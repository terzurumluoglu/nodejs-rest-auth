const User = require('../models/User');
const { asyncHandler } = require('../middleware/asyncHandler');

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
