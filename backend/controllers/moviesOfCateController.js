const getModelForCollection = require('../models/MoviesOfCate');

const MovieUpcoming = getModelForCollection('movies_upcoming');
const MovieTopRated = getModelForCollection('movies_top_rated');
const MoviePopular = getModelForCollection('movies_popular');
const MovieNowPlaying = getModelForCollection('movies_now_playing');
const MovieSimilar= getModelForCollection('similar');


exports.getSimilarMovies = async (req, res) => {
  try {
      const movie = await MovieSimilar.findOne({ tmdb_id: req.params.tmdb_id })
      if (movie && movie.similar_movies) {
          res.json(movie.similar_movies);
      } else {
          res.status(404).send('Similar movies not found');
      }
  } catch (error) {
      res.status(500).send(error.toString());
  }
};


exports.getUpcomingMovies = async (req, res) => {
  try {
    const movies = await MovieUpcoming.find();
    res.json(movies);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

exports.getTopRatedMovies = async (req, res) => {
  try {
    const movies = await MovieTopRated.find();
    res.json(movies);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

exports.getPopularMovies = async (req, res) => {
  try {
    const movies = await MoviePopular.find();
    res.json(movies);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

exports.getNowPlayingMovies = async (req, res) => {
  try {
    const movies = await MovieNowPlaying.find();
    res.json(movies);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
