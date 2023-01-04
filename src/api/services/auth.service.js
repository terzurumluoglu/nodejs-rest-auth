const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { environments } = require('../../constants');

const { getUserInfo } = require('../services/user.service');

const dayAsSecond = 24 * 60 * 60 * 1000;

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

const sendTokenResponse = (user, statusCode, res) => {

    const userInfo = getUserInfo(user);

    const token = generateJWT(userInfo.id);

    const now = (new Date()).getTime();
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
            ...userInfo,
            token
        }
    })
}

module.exports = { hashString, matchPassword, generateJWT, sendTokenResponse };