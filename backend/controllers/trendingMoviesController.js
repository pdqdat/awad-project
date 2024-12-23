const getModelForCollection = require('../models/MoviesTrending');

const MoviesTrendingDays = getModelForCollection('movies_trending_day');
const MoviesTrendingWeek = getModelForCollection('movies_trending_week');

exports.getTrendingMoviesDay = async (req, res) => {
  try {
    const movies = await MoviesTrendingDays.find({});
    res.json(movies);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getTrendingMoviesWeek = async (req, res) => {
  try {
    const movies = await MoviesTrendingWeek.find({});
    res.json(movies);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
