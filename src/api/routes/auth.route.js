const express = require('express');
const router = express.Router();
const { register, login, logout, forgotPassword, resetPassword, token } = require('../controllers/auth.controller');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resetPasswordKey').post(resetPassword);
router.route('/token').post(token);
router.route('/logout').delete(logout)

module.exports = router;
