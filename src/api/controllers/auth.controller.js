const { asyncHandler } = require('../middleware/asyncHandler');
const { authService } = require('../services');
const ErrorResponse = require('../utils/ErrorResponse');
const { getDatabase } = require('../../config/db');


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

module.exports = { register, login };
