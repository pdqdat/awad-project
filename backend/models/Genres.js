// models/Genre.js
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    tmdb_id: { type: Number, required: true, unique: true },
    id: { type: Number, required: true, unique: true }, 
    name: { type: String, required: true }
});

const Genre = mongoose.model('Genre', genreSchema, 'movie_genres');

module.exports = Genre;
