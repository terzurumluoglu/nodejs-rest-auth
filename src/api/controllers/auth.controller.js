const User = require('../models/User');
const { asyncHandler } = require('../middleware/asyncHandler');
const service = require('../services');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc   Register
// @route  POST /auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = new User({
        name,
        email,
        password
    });

    const response = await user.save();

    const access_token = service.authService.generateJWT();

    const userInfo = service.userService.getUserInfo(response);

    res.status(200).json({
        success: true,
        data: { ...userInfo, access_token },
    });
});

// @desc   Login
// @route  POST /auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if ([email, password].includes(undefined)) {
        return next(new ErrorResponse('Email and Password must enter', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Email or Password is invalid!', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Email or Password is invalid!', 401));
    }

    service.authService.sendTokenResponse(user, 200, res);
});
