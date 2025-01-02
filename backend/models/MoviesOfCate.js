const mongoose = require("mongoose");

const movieCateSchema = new mongoose.Schema({
    tmdb_id: Number,
    adult: Boolean,
    backdrop_path: String,
    genre_ids: [Number],
    id: Number,
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    release_date: Date,
    title: String,
    video: Boolean,
    vote_average: Number,
    vote_count: Number,
    similar_movies: [
        {
            tmdb_id: Number,
            title: String,
            adult: Boolean,
            backdrop_path: String,
            genre_ids: [Number],
            original_language: String,
            original_title: String,
            overview: String,
            popularity: Number,
            poster_path: String,
            release_date: Date,
            video: Boolean,
            vote_average: Number,
            vote_count: Number,
        },
    ],
});

// Function to get or create a model for a specific collection
const getModelForCollection = (collectionName) => {
    return mongoose.model("Cate", movieCateSchema, collectionName);
};

module.exports = getModelForCollection;
