const { userService } = require('../services');

// @desc   Get All Users
// @route  GET /users
// @access Public
exports.getAllUsers = (req, res, next) => {
    const users = userService.getAllUsers();
    const response = {
        success: true,
        data: users
    }
    res.status(200).send(response);
};
