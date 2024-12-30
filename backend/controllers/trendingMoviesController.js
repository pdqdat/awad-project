const getModelForCollection = require('../models/MoviesTrending');
const MoviesTrendingDays = getModelForCollection('movies_trending_day');
const MoviesTrendingWeek = getModelForCollection('movies_trending_week');
const Genre = require('../models/Genres');

// Helper function to convert genre names to genre IDs
async function convertGenreNamesToIds(genreNames) {
  const normalizedNames = genreNames.map(name =>
    capitalizeWords(name)  // Ensuring proper capitalization
  );

  const genres = await Genre.find({ name: { $in: normalizedNames } });
  return genres.map(genre => genre.id); // Return only the IDs
}

function capitalizeWords(string) {
  return string.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function buildFilterCriteria({ genres, minRating, maxRating, startDate, endDate }) {
  let filterCriteria = {};

  if (genres) {
    let genreNames = genres;
    if (typeof genres === 'string') {
      genreNames = genres.split(',').map(genre => capitalizeWords(genre.trim()));
    } else if (Array.isArray(genres)) {
      genreNames = genres.map(genre => capitalizeWords(genre.trim()));
    }
    // Ensure the promise is resolved here
    const genreIds = await convertGenreNamesToIds(genreNames);
    filterCriteria.genre_ids = { $all: genreIds };
  }

  if (minRating) {
    filterCriteria.vote_average = { $gte: parseFloat(minRating) };
  }

  if (maxRating) {
    filterCriteria.vote_average = { $lte: parseFloat(maxRating) };
  }

  if (startDate) {
    filterCriteria.release_date = { $gte: startDate };
  }

  if (endDate) {
    filterCriteria.release_date = { $lte: endDate };
  }

  return filterCriteria;
}


async function applyFiltersAndPagination(model, filterCriteria, page, limit) {
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (currentPage - 1) * pageSize;

  const totalItems = await model.countDocuments(filterCriteria);
  const items = await model.find(filterCriteria).skip(skip).limit(pageSize);

  return {
      total: totalItems,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      data: items
  };
}

exports.getTrendingMoviesDay = async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const filterCriteria = buildFilterCriteria(filters);

  try {
    const result = await applyFiltersAndPagination(MoviesTrendingDays, filterCriteria, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).send('Error fetching trending movies by day: ' + error.message);
  }
};

exports.getTrendingMoviesWeek = async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;

  try {
    // Properly await the asynchronous operation to get the filter criteria
    const filterCriteria = await buildFilterCriteria(filters);
    const result = await applyFiltersAndPagination(MoviesTrendingWeek, filterCriteria, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).send('Error fetching trending movies by week: ' + error.message);
  }
};

