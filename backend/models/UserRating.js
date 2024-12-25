const mongoose = require('mongoose');

const userRatingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    rating: { type: Number, required: true }
});

const UserRating = mongoose.model('UserRating', userRatingSchema);
module.exports = UserRating;