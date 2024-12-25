const mongoose = require('mongoose');

const trendingSchema = new mongoose.Schema({
  tmdb_id: Number,
  adult: Boolean,
  backdrop_path: String,
  categories: [String],
  genre_ids: [Number],
  media_type: String,
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  release_date: Date,
  title: String,
  video: Boolean,
  vote_average: Number,
  vote_count: Number
});

const getModelForCollection = (collectionName) => {
  return mongoose.model('Trending', trendingSchema, collectionName);
};

module.exports = getModelForCollection;
