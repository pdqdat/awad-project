const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        clerkUserId: { type: String, unique: true, required: true },
        firstName: String,
        lastName: String,
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema, 'user');

module.exports = User;
