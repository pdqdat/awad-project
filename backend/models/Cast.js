const mongoose = require("mongoose");

const castSchema = new mongoose.Schema({
    tmdb_id: { type: Number, required: true, unique: true },
    name: String,
    adult: Boolean,
    also_known_as: [String],
    biography: String,
    birthday: String,
    deathday: String,
    gender: Number,
    homepage: String,
    imdb_id: String,
    known_for_department: String,
    place_of_birth: String,
    popularity: Number,
    profile_path: String,
    movie_credits: {
        cast: [
            {
                id: Number,
                title: String,
                character: String,
                credit_id: String,
                poster_path: String,
                release_date: String,
                vote_average: Number,
                adult: Boolean,
                backdrop_path: String,
                genre_ids: [Number],
                original_language: String,
                original_title: String,
                overview: String,
                popularity: Number,
                video: Boolean,
                vote_count: Number,
            },
        ],
        crew: [
            {
                id: Number,
                title: String,
                credit_id: String,
                poster_path: String,
                release_date: String,
                vote_average: Number,
                adult: Boolean,
                backdrop_path: String,
                genre_ids: [Number],
                original_language: String,
                original_title: String,
                overview: String,
                popularity: Number,
                video: Boolean,
                vote_count: Number,
                department: String,
                job: String,
            },
        ],
    },
});

const Cast = mongoose.model("Cast", castSchema, "people");

module.exports = Cast;
