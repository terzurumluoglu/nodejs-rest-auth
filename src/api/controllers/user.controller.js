const { userMock } = require('../../mock');

// @desc   Get All Users
// @route  GET /users
// @access Public
exports.getAllUsers = (req, res, next) => {
    const response = {
        success: true,
        data: userMock
    }
    res.status(200).send(response);
};
