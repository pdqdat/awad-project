const getModelForCollection = require('../models/MoviesTrending');

const MoviesTrendingDays = getModelForCollection('movies_trending_day');
const MoviesTrendingWeek = getModelForCollection('movies_trending_week');

exports.getTrendingMoviesDay = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const movies = await MoviesTrendingDays.find({})
                                          .skip(skip)
                                          .limit(limit);
    const totalMovies = await MoviesTrendingDays.countDocuments({});
    res.json({
        total: totalMovies,
        page,
        limit,
        totalPages: Math.ceil(totalMovies / limit),
        data: movies
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};


exports.getTrendingMoviesWeek = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const movies = await MoviesTrendingWeek.find({})
                                           .skip(skip)
                                           .limit(limit);
    const totalMovies = await MoviesTrendingWeek.countDocuments({});
    res.json({
        total: totalMovies,
        page,
        limit,
        totalPages: Math.ceil(totalMovies / limit),
        data: movies
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
