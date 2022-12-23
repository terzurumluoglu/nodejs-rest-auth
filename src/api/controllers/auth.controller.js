const User = require('../models/User');
const { asyncHandler } = require('../middleware/asyncHandler');
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

    const access_token = response.generateJWT();

    res.status(200).json({
        success: true,
        data: response,
        access_token
    });
});


// @desc   Login
// @route  POST /auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if ([email, password].includes(undefined)) {
        return next(new ErrorResponse('Email or Password is invalid!', 401));
    }

    const response = await User.findOne({ email }).select('+password');

    if (!response) {
        return next(new ErrorResponse('Email or Password is invalid!', 401));
    }
    
    const isMatch = await response.matchPassword(password);

    if (isMatch) {
        const access_token = response.generateJWT();
        res.status(200).json({
            success: true,
            access_token
        })
    } else {
        return next(new ErrorResponse('Email or Password is invalid!', 401));
    }

    res.status(200).json({
        success: true,
        data: response,
        access_token
    });
});