const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { environments } = require('../../constants');

const dayAsSecond = 24 * 60 * 60 * 1000;

const hashString = async (str) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(str, salt);
};

const matchPassword = ({ enteredPassword, hashedPassword }) => {
    return bcryptjs.compare(enteredPassword, hashedPassword);
};

const generateJWT = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_EXPIRE
    });
};

const verifyJWT = (refreshToken) => {
    return jwt.verify(refreshToken, process.env.REFRESH_SECRET);
};

const sendTokenResponse = (response) => {
    const { user, res, refreshToken } = response;
    const accessToken = generateJWT(user);

    const now = Date.now();

    if (process.env.ENVIRONMENT === environments.production) {
        options.secure = true;
    }

    const result = refreshToken ? {
        accessToken,
        refreshToken
    } : {
        ...user,
        accessToken,
        refreshToken: generateRefreshToken(user)
    };

    res.status(200)
        .cookie('accessToken', accessToken, {
            expires: new Date(now + process.env.JWT_COOKIE_EXPIRE * dayAsSecond),
            httpOnly: true,
        })
        .cookie('refreshToken', result.refreshToken, {
            expires: new Date(now + process.env.REFRESH_COOKIE_EXPIRE * dayAsSecond),
            httpOnly: true,
        })
        .send({
            success: true,
            result
        });
}

module.exports = { hashString, matchPassword, generateJWT, sendTokenResponse, verifyJWT };
