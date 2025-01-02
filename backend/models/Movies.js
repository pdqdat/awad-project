const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    tmdb_id: {
        type: Number,
        required: true,
    },
    adult: Boolean,
    backdrop_path: String,
    belongs_to_collection: {
        id: Number,
        name: String,
        poster_path: String,
        backdrop_path: String,
    },
    budget: Number,
    categories: [String],
    genres: [
        {
            id: Number,
            name: String,
        },
    ],
    homepage: String,
    imdb_id: String,
    origin_country: [String],
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    production_companies: [
        {
            id: Number,
            name: String,
            logo_path: String,
            country: String,
        },
    ],
    production_countries: [
        {
            iso_3166_1: String,
            name: String,
        },
    ],
    release_date: Date,
    revenue: Number,
    runtime: Number,
    spoken_languages: [
        {
            iso_639_1: String,
            name: String,
        },
    ],
    status: String,
    tagline: String,
    title: {
        type: String,
        required: true,
    },
    video: Boolean,
    vote_average: Number,
    vote_count: Number,
    credits: {
        type: {
            cast: [
                {
                    id: Number,
                    name: String,
                    gender: Number,
                    character: String,
                    profile_path: String,
                },
            ],
            crew: [
                {
                    id: Number,
                    name: String,
                    gender: Number,
                    department: String,
                    job: String,
                    profile_path: String,
                },
            ],
        },
        index: { sparse: true },
    },
});
movieSchema.index({ title: "text", "credits.cast.name": "text" });

const Movie = mongoose.model("Movie", movieSchema, "movies");

module.exports = Movie;
