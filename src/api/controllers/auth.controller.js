const { asyncHandler } = require('../middleware/asyncHandler');
const { authService } = require('../services');
const { ErrorResponse, Mail }  = require('../utils');
const { getDatabase } = require('../../config/db');
const crypto = require('crypto');


const getUserCollection = () => getDatabase().collection('users');

// @desc   Register
// @route  POST /auth/register
// @access Public
const register = asyncHandler(async (req, res, next) => {

    const { name, email, password } = req.body;

    if ([name, email, password].includes(undefined)) {
        return next(new ErrorResponse('Name, Email, Password must enter!', 400));
    }

    const userToBeInserted = {
        name,
        email,
        password: await authService.hashString(password),
    }

    const collection = getUserCollection();
    const { insertedId } = await collection.insertOne(userToBeInserted);

    const user = await collection.findOne({ _id: insertedId });

    authService.sendTokenResponse(user, 200, res);
});

// @desc   Login
// @route  POST /auth/login
// @access Public
const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if ([email, password].includes(undefined)) {
        return next(new ErrorResponse('Email and Password must enter', 400));
    }

    const user = await getUserCollection().findOne({ email });

    if (!user) {
        return next(new ErrorResponse('Email or Password is invalid!', 401));
    }

    const isMatch = await authService.matchPassword({ enteredPassword: password, hashedPassword: user.password });

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

    const user = await getUserCollection().findOne({ email });

    if (!user) {
        return next(new ErrorResponse(`There is no user this email: ${email}`, 401));
    }

    const now = Date.now();

    const resetPasswordKey = crypto.randomBytes(16).toString('hex');
    const resetPasswordKeyExpire = new Date(now + 10 * 60 * 1000);

    const mail = new Mail();

    const url = req.protocol + '://' + req.get('host');

    const to = email;
    const subject = "Reset Password Request!";
    const text = `Hey I am a mail :), I was wanted by you to reset your password.
    You must do post request with data that includes new password this url to change your password in 10 minutes.
    ${url}/auth/resetpassword/${resetPasswordKey}
    `;

    await getUserCollection().updateOne(
        { email },
        { $set: { resetPasswordKey, resetPasswordKeyExpire } });

    mail.sendEmail({ to, subject, text });

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

    const user = await getUserCollection().findOne({ resetPasswordKey });

    if (!user) {
        return next(new ErrorResponse('Reset Password Key is invalid!', 400));
    }

    const date = new Date();

    const resetPasswordKeyExpire = new Date(user.resetPasswordKeyExpire);

    if (date > resetPasswordKeyExpire) {
        return next(new ErrorResponse('Time Out! Reset Password Key is invalid anymore', 400));
    }

    if (!password) {
        return next(new ErrorResponse('Password must enter', 400));
    }

    await getUserCollection().updateOne(
        {
            email: user.email
        },
        {
            $set: {
                resetPasswordKey: undefined,
                resetPasswordKeyExpire: undefined,
                password: authService.hashString(password)
            }
        });

    res.status(200).send({
        success: true,
        data: {
            message: 'Password changed successfully'
        }
    })
});

module.exports = { register, login, forgotPassword, resetPassword };
