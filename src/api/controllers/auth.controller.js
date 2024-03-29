const { authService, userService } = require('../services');
const { deleteCookie } = require('../services/cookie.service');
const { ErrorResponse }  = require('../utils');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// @desc   Register
// @route  POST /auth/register
// @access Public
const register = async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;

    const savedUser = await userService.save(user.allInfo);

    const response = {
        user: savedUser,
        res,
        refreshToken: undefined
    };

    authService.sendTokenResponse(response);
};

// @desc   Login
// @route  POST /auth/login
// @access Public
const login = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Email and Password must enter', 400));
    }

    const { user, hashedPassword } = await userService.getUserByEmail(email);

    if (!user) {
        return next(new ErrorResponse('Email or Password is invalid!', 404));
    }

    const isMatch = await authService.matchPassword({ enteredPassword: password, hashedPassword });

    if (!isMatch) {
        return next(new ErrorResponse('Email or Password is invalid!', 404));
    }

    const response = {
        user,
        res,
        refreshToken: undefined
    };

    authService.sendTokenResponse(response);
};

// @desc   Forgot Password
// @route  POST /auth/forgotpassword
// @access Public
const forgotPassword = async (req, res, next) => {

    const { email } = req.body;

    if (!email) {
        return next(new ErrorResponse('Email must enter', 400));
    }

    const { user } = await userService.getUserByEmail(email);

    if (!user) {
        return next(new ErrorResponse(`There is no user this email: ${email}`, 401));
    }

    const url = req.protocol + '://' + req.get('host');

    await userService.update({ url, email })

    res.status(200).send({
        success: true,
        result: {
            message: 'Email was sent successfully'
        },
    })
};

// @desc   Reset Password
// @route  POST /auth/resetpassword
// @access Public
const resetPassword = async (req, res, next) => {

    const { resetPasswordKey } = req.params;
    const { password } = req.body;

    if (!resetPasswordKey) {
        return next(new ErrorResponse('Reset Password Key is invalid!', 400));
    }

    const user = await userService.getUserByResetPasswordKey(resetPasswordKey);

    if (!user) {
        return next(new ErrorResponse('Reset Password Key is invalid!', 400));
    }

    const now = new Date();
    const resetPasswordKeyExpire = new Date(user.resetPasswordKeyExpire);

    if (!resetPasswordKeyExpire || now > resetPasswordKeyExpire) {
        return next(new ErrorResponse('Time Out! Reset Password Key is invalid anymore', 400));
    }

    if (!password) {
        return next(new ErrorResponse('Password must enter', 400));
    }

    await userService.updatePassword({ email: user.email, password });

    res.status(200).send({
        success: true,
        result: {
            message: 'Password changed successfully',
        },
    });
};

// @desc   Generate Access Token using by Refresh Token
// @route  POST /auth/token
// @access Public
const token = async (req, res, next) => {

    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
        return res.status(401).send('UNAUTHORIZE');
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (error, decode) => {
        if (error){
            return res.status(401).send('UNAUTHORIZE');
        }
        const { iat, exp, ...user } = decode;

        const response = {
            user,
            res,
            refreshToken
        };

        authService.sendTokenResponse(response);
    });
};

const logout = async (req, res, next) => {
    deleteCookie(res, 'accessToken', 'refreshToken');

    res.status(200).json({
        success: true,
        result: {
            message: 'Success',
        }
    });
};

module.exports = { register, login, logout, forgotPassword, resetPassword, token };
