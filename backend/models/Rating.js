const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
