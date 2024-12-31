
const getModelForCollection = require('../models/Movies');
const Movie = getModelForCollection('movies');
const MovieSimilar= getModelForCollection('similar');

const Genre = require('../models/Genres');

function capitalizeWords(string) {
  return string.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function buildFilterCriteria({ genres, minRating, maxRating, startDate, endDate }) {
  let filterCriteria = {};

  if (genres) {
      // console.log("chua decode",genres)
      genres = decodeURIComponent(genres).replace(/\+/g, ' ');
      // console.log("decode",genres)
      if (typeof genres === 'string') {
          genres = genres.split(',').map(genre => capitalizeWords(genre.trim()));
      } else if (Array.isArray(genres)) {
          genres = genres.map(genre => capitalizeWords(genre.trim()));
      } 
      filterCriteria['genres.name'] = { $all: genres };
  }
  if (minRating) {
    filterCriteria.vote_average = { ...(filterCriteria.vote_average || {}), $gte: parseFloat(minRating) };
  }

  if (maxRating) {
    filterCriteria.vote_average = { ...(filterCriteria.vote_average || {}), $lte: parseFloat(maxRating) };
  }

  if (startDate && endDate) {
    filterCriteria.release_date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    filterCriteria.release_date = { $gte: startDate };
  } else if (endDate) {
    filterCriteria.release_date = { $lte: endDate };
  }

  return filterCriteria;
}

const applyFiltersAndPagination = async (baseCriteria, page, limit) => {
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (currentPage - 1) * pageSize;

  const totalItems = await Movie.countDocuments(baseCriteria);
  const items = await Movie.find(baseCriteria).skip(skip).limit(pageSize);


  return {
      total: totalItems,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      data: items
  };
};


exports.getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find({});
        res.json(genres);
    } catch (error) {
        console.error('Failed to retrieve genres:', error);
        res.status(500).send('Server error while retrieving genres');
    }
};

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
  const { query, page = 1, limit = 10, ...filters } = req.query;
  const baseCriteria = {
      $or: [
          { title: { $regex: query, $options: 'i' } },
          { 'credits.cast.name': { $regex: query, $options: 'i' } }
      ],
      ...buildFilterCriteria(filters)
  };

  try {
      const result = await applyFiltersAndPagination(baseCriteria, page, limit);
      res.json(result);
      // console.log("Search Criteria:", baseCriteria); // Debug log
  } catch (error) {
      res.status(500).send(`Error in searching movies with pagination: ${error}`);
  }
};



exports.getUpcomingMovies = async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const baseCriteria = { categories: 'upcoming', ...buildFilterCriteria(filters) };

  try {
      const result = await applyFiltersAndPagination(baseCriteria, page, limit);
      res.json(result);
  } catch (error) {
      res.status(500).send(`Error fetching popular movies with filters: ${error}`);
  }
};



  exports.getTopRatedMovies = async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;
    const baseCriteria = { categories: 'top_rated', ...buildFilterCriteria(filters) };
  
    try {
        const result = await applyFiltersAndPagination(baseCriteria, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).send(`Error fetching popular movies with filters: ${error}`);
    }
  };
  

exports.getPopularMovies = async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const baseCriteria = { categories: 'popular', ...buildFilterCriteria(filters) };

  try {
      const result = await applyFiltersAndPagination(baseCriteria, page, limit);
      res.json(result);
  } catch (error) {
      res.status(500).send(`Error fetching popular movies with filters: ${error}`);
  }
};



exports.getNowPlayingMovies = async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const baseCriteria = { categories: 'now_playing', ...buildFilterCriteria(filters) };

  try {
      const result = await applyFiltersAndPagination(baseCriteria, page, limit);
      res.json(result);
  } catch (error) {
      res.status(500).send(`Error fetching popular movies with filters: ${error}`);
  }
};



exports.getSimilarMovies = async (req, res) => {
  try {
      console.log("tmdb_id:", req.params.tmdb_id);
      const movie = await MovieSimilar.findOne({ tmdb_id: req.params.tmdb_id });
      // console.log("Movie found:", movie);
      if (movie && movie.similar_movies) {
          res.json(movie.similar_movies);
      } else {
          res.status(404).send('Similar movies not found');
      }
  } catch (error) {
      console.error('Error retrieving similar movies:', error);
      res.status(500).send(error.toString());
  }
};
