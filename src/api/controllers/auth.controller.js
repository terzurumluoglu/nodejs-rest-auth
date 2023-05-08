const { asyncHandler } = require('../middleware/asyncHandler');
const { authService, userService } = require('../services');
const { ErrorResponse }  = require('../utils');
const User = require('../models/user');

// @desc   Register
// @route  POST /auth/register
// @access Public
const register = asyncHandler(async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = new User();
    user.setName = name;
    user.setEmail = email;
    user.setPassword = password;

    const savedUser = await userService.save(user);

    authService.sendTokenResponse(savedUser, 200, res);
});

// @desc   Login
// @route  POST /auth/login
// @access Public
const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Email and Password must enter', 400));
    }

    const { user, hashedPassword } = await userService.getUserByEmail(email);

    if (!user) {
        return next(new ErrorResponse('Email or Password is invalid!', 401));
    }

    const isMatch = await authService.matchPassword({ enteredPassword: password, hashedPassword });

    if (!isMatch) {
        return next(new ErrorResponse('Email or Password is invalid!', 401));
    }

    authService.sendTokenResponse(user, 200, res);
});

// @desc   Forgot Password
// @route  POST /auth/forgotpassword
// @access Public
const forgotPassword = asyncHandler(async (req, res, next) => {

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
        data: {
            message: 'Email was sent successfully'
        }
    })
});

// @desc   Reset Password
// @route  POST /auth/resetpassword
// @access Public
const resetPassword = asyncHandler(async (req, res, next) => {

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
        data: {
            message: 'Password changed successfully'
        }
    })
});

const token = asyncHandler(async (req, res, next) => {

    const { refreshToken } = req.body;
    
    if (refreshToken === null) {
        return res.status(401).send('UNAUTHORIZE');
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(401).send('UNAUTHORIZE');
    }
    
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401)
        }
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ access_token: accessToken })
    });
});

module.exports = { register, login, forgotPassword, resetPassword, token };
