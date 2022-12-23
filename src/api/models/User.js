const mongoose = require('mongoose');
const { authService } = require('../services');
const { Schema } = mongoose;

const UserSchema = new Schema({
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
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

UserSchema.pre('save', async function(next) {
    this.password = await authService.hashString(this.password);
});

module.exports = mongoose.model('User', UserSchema);
