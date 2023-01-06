const { hashString } = require('./auth.service');
const { getUserCollection } = require('../../config/db');
const User = require('../models/user');
const crypto = require('crypto');
const { Mail } = require('../utils');

const getUserById = async (id) => {
    const u = await getUserCollection().findOne({ _id: id })
    const user = new User();
    user.setUser = u;
    return user.info;
}

const getUserByEmail = async (email) => {
    const u = await getUserCollection().findOne({ email });
    if (!u) {
        throw new Error(`There is no user this email: ${email}`);
    }
    const user = new User();
    user.setUser = u;
    return {
        user: user.info,
        hashedPassword: user.password
    };
}
const getUserByResetPasswordKey = async (resetPasswordKey) => {
    const u = await getUserCollection().findOne({ resetPasswordKey });
    if (!u) {
        throw new Error('Reset Password Key is invalid!');
    }
    const user = new User();
    user.setUser = u;
    return user.info;
}

const save = async (user) => {
    let { password, ...others } = user;
    const hashedPassword = await hashString(user.password);
    const userToBeInserted = { ...others, password: hashedPassword };
    const { insertedId } = await getUserCollection().insertOne(userToBeInserted);
    return getUserById(insertedId);
}

const updatePassword = async ({ email, password }) => {

    const toBeSetted = { password: await hashString(password) };

    await getUserCollection().updateOne(
        { email },
        { $set: toBeSetted });
}

const update = async ({ url, email }) => {
    const now = Date.now();
    const resetPasswordKey = crypto.randomBytes(16).toString('hex');
    const resetPasswordKeyExpire = new Date(now + 10 * 60 * 1000);
    const toBeSetted = { resetPasswordKey, resetPasswordKeyExpire };

    const mail = new Mail();

    const subject = "Reset Password Request!";
    const text = `Hi, I am a mail :), I was sent to reset your password.
        You must do post request with data that includes new password this url to change your password in 10 minutes.
        ${url}/auth/resetpassword/${resetPasswordKey}`;

    await getUserCollection().updateOne(
        { email },
        { $set: toBeSetted });
        
    await mail.send({ to: email, subject, text })
}

module.exports = { getUserById, getUserByEmail, getUserByResetPasswordKey, save, update, updatePassword };
