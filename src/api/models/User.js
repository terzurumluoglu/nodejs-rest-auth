const mongoose = require('mongoose');
const { authService } = require('../services');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter a name'],
        unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            'Please enter a correct email'
        ],
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: 6,
        select: false,
    },
    resetPasswordToken: String,
    access_token: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

userSchema.pre('save', async function() {
    this.password = await authService.hashString(this.password);
});

userSchema.methods.matchPassword = function(enteredPassword) {
    return authService.matchPassword(this.password, enteredPassword);
}

module.exports = model('User', userSchema);
