const mongoose = require('mongoose');

const movieListModel = new mongoose.Schema({
    clerkUserId: { type: String, unique: true, required: true },
    firstName: String,
    lastName: String,
    lists: [{
        name: String,
        movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
        tags: [String],
        sharedUrl: String
    }],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    likedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
}, { timestamps: true });

const MovieList = mongoose.model('MovieList', movieListModel);
module.exports = MovieList;
