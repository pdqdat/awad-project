const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        clerkUserId: { type: String, unique: true, required: true },
        firstName: String,
        lastName: String,
        watchlist: [
            {
                movieId: { type: Number, required: true },
                addedAt: { type: Date, default: Date.now }
            }
        ],
        favoriteList: [
            {
                movieId: { type: Number, required: true }, 
                addedAt: { type: Date, default: Date.now }
            }
        ],
        ratingList: [
            {
                movieId: { type: Number, required: true },
                rating: { type: Number, required: true, min: 0, max: 10 },
                ratedAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema, 'user');
module.exports = User;
