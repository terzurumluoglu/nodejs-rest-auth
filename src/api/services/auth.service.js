const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../middleware/asyncHandler');
const { environments } = require('../../constants');

const service = require('../services');

const dayAsSecond = 24 * 60 * 60 * 1000;

exports.hashString = asyncHandler(async (str) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(str, salt);
});

exports.matchPassword = (hashedPassword, enteredPassword) => {
    return bcryptjs.compare(enteredPassword, hashedPassword);
};

exports.generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

exports.sendTokenResponse = (user, statusCode, res) => {

    const userInfo = service.userService.getUserInfo(user);

    const token = this.generateJWT(userInfo.id);

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
