const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { environments } = require('../../constants');

const dayAsSecond = 24 * 60 * 60 * 1000;

const refreshTokens = [];

const hashString = async (str) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(str, salt);
};

const matchPassword = ({ enteredPassword, hashedPassword }) => {
    return bcryptjs.compare(enteredPassword, hashedPassword);
};

const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const sendTokenResponse = (user, statusCode, res) => {

    const token = generateJWT(user.id);
    const refreshToken = generateRefreshToken(user.id);
    refreshTokens.push(refreshToken);

    const now = Date.now();
    const expires = new Date(now + process.env.JWT_COOKIE_EXPIRE * dayAsSecond);

    const options = {
        expires,
        httpOnly: true,
    };

    if (process.env.ENVIRONMENT === environments.production) {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).send({
        success: true,
        data: {
            ...user,
            token,
            refreshToken
        }
    })
}

module.exports = { hashString, matchPassword, generateJWT, sendTokenResponse };