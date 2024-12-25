const getModelForCollection = require('../models/MoviesOfCate');

const MovieSimilar= getModelForCollection('similar');

const Movie = require('../models/Movies');



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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const movies = await Movie.find({ categories: 'upcoming' })
                              .skip(skip)
                              .limit(limit);
    const totalMovies = await Movie.countDocuments({ categories: 'upcoming' });
    res.json({
        total: totalMovies,
        page,
        limit,
        totalPages: Math.ceil(totalMovies / limit),
        data: movies
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};


exports.getTopRatedMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const movies = await Movie.find({ categories: 'top_rated' }) 
                              .skip(skip)
                              .limit(limit);
    const totalMovies = await Movie.countDocuments({ categories: 'top_rated' });
    res.json({
        total: totalMovies,
        page,
        limit,
        totalPages: Math.ceil(totalMovies / limit),
        data: movies
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};


exports.getPopularMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const movies = await Movie.find({ categories: 'popular' })
                              .skip(skip)
                              .limit(limit);
    const totalMovies = await Movie.countDocuments({ categories: 'popular' });
    res.json({
        total: totalMovies,
        page,
        limit,
        totalPages: Math.ceil(totalMovies / limit),
        data: movies
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

exports.getNowPlayingMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const movies = await Movie.find({ categories: 'now_playing' })
                              .skip(skip)
                              .limit(limit);
    const totalMovies = await Movie.countDocuments({ categories: 'now_playing' });
    res.json({
        total: totalMovies,
        page,
        limit,
        totalPages: Math.ceil(totalMovies / limit),
        data: movies
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
