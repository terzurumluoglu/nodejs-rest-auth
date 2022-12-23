const bcryptjs = require('bcryptjs');
const { asyncHandler } = require('../middleware/asyncHandler');

exports.hashString = asyncHandler(async (str) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(str, salt);
});

exports.matchPassword = (hashedPassword, enteredPassword) => {
    return bcryptjs.compare(enteredPassword, hashedPassword);
};
