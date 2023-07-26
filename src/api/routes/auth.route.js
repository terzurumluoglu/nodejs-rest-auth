const express = require('express');
const router = express.Router();
const { register, login, logout, forgotPassword, resetPassword, token } = require('../controllers/auth.controller');
const { asyncHandler } = require('../middleware/asyncHandler');

router.route('/register').post(asyncHandler(register));
router.route('/login').post(asyncHandler(login));
router.route('/forgotpassword').post(asyncHandler(forgotPassword));
router.route('/resetpassword/:resetPasswordKey').post(asyncHandler(resetPassword));
router.route('/token').post(asyncHandler(token));
router.route('/logout').delete(asyncHandler(logout))

module.exports = router;
