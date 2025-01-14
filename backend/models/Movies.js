const mongoose = require('mongoose');


const trailerSchema = new mongoose.Schema({
  iso_639_1: String,
  iso_3166_1: String,
  name: String,
  key: String,
  site: {
      type: String,
      enum: ['YouTube', 'Vimeo', 'Dailymotion'], // Include other sites as needed
  },
  size: Number,
  type: {
      type: String,
      enum: ['Trailer', 'Teaser', 'Clip'] // Specify other types if necessary
  },
  official: Boolean,
  published_at: Date,
  id: String
});

const movieSchema = new mongoose.Schema({
  tmdb_id: {
    type: Number,
    required: true
  },
  adult: Boolean,
  backdrop_path: String,
  belongs_to_collection: {
    id: Number,
    name: String,
    poster_path: String,
    backdrop_path: String
  },
  budget: Number,
  categories: [String],
  genres: [{
    id: Number,
    name: String
  }],
  homepage: String,
  imdb_id: String,
  origin_country: [String],
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  production_companies: [{
    id: Number,
    name: String,
    logo_path: String,
    country: String
  }],
  production_countries: [{
    iso_3166_1: String,
    name: String
  }],
  release_date: String,
  revenue: Number,
  runtime: Number,
  spoken_languages: [{
    iso_639_1: String,
    name: String
  }],
  status: String,
  tagline: String,
  title: {
    type: String,
    required: true
  },
  video: Boolean,
  vote_average: Number,
  vote_count: Number,
  credits: {
    type: {
        cast: [{
            id: Number,
            name: String,
            gender: Number,
            character: String,
            profile_path: String
        }],
        crew: [{
            id: Number,
            name: String,
            gender: Number,
            department: String,
            job: String,
            profile_path: String
        }]
    },
    index: {sparse: true}
},

similar_movies: [{
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
  vote_count: Number
}], 
trailers: [trailerSchema]  // Adding the trailer subdocument array

});
movieSchema.index({ 'title': 'text', 'credits.cast.name': 'text' });


const getModelForCollection = (collectionName) => {
  return mongoose.model('Movie', movieSchema, collectionName);
};

module.exports = getModelForCollection;
