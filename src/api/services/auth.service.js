const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../middleware/asyncHandler');

exports.hashString = asyncHandler(async (str) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(str, salt);
});

exports.matchPassword = (hashedPassword, enteredPassword) => {
    return bcryptjs.compare(enteredPassword, hashedPassword);
};

exports.generateJWT = function(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
