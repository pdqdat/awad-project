const Movie = require('../models/Movies');

exports.getAllMovies = async (req, res) => {
  const { all } = req.query;

  if (all === 'true') {
      try {
          const movies = await Movie.find({});
          res.json(movies);
      } catch (error) {
          res.status(500).send(error.message);
      }
  } else {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      try {
          const movies = await Movie.find({})
                                    .skip(skip)
                                    .limit(limit);
          const totalMovies = await Movie.countDocuments({});
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
  }
};



exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdb_id: req.params.tmdb_id });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send('Movie not found');
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

exports.searchMovies = async (req, res) => {
  const { query } = req.query; 
  try {
      const movies = await Movie.find({
          $or: [
              { title: { $regex: query, $options: 'i' } },
              { 'credits.cast.name': { $regex: query, $options: 'i' } }
          ]
      });
      res.json(movies);
  } catch (error) {
      res.status(500).send(error.toString());
  }
};


exports.filterMovies = async (req, res) => {
    const { genre, rating, releaseDate } = req.query;
    let filterCriteria = {};

    if (genre) {
        filterCriteria.genres = { $in: [genre] }; 
    }
    if (rating) {
        filterCriteria.vote_average = { $gte: parseFloat(rating) }; 
    }
    if (releaseDate) {
        filterCriteria.release_date = { $gte: new Date(releaseDate) }; 
    }

    try {
        const movies = await Movie.find(filterCriteria);
        res.json(movies);
    } catch (error) {
        res.status(500).send(error.toString());
    }   
};

