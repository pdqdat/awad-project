
const getModelForCollection = require('../models/Movies');
const Movie = getModelForCollection('movies');
const MovieSimilar= getModelForCollection('similar');

const Genre = require('../models/Genres');

const axios = require('axios');

function ensureProperlyEncoded(str) {
  try {
    // Giải mã để kiểm tra xem đã được encode chưa
    const decoded = decodeURIComponent(str);
    // Nếu giải mã thành công mà không có lỗi, và chuỗi giải mã khác chuỗi ban đầu, nghĩa là đã encode
    return decoded === str ? encodeURIComponent(str) : str;
  } catch (e) {
    // Nếu có lỗi trong quá trình giải mã, nghĩa là chuỗi có thể chưa được encode hoặc đã được encode không đúng
    return encodeURIComponent(str);
  }
}

async function retrieveFromLLM(query, amount = 5, threshold = 0.5) {
  const apiUrl = 'https://awd-llm.azurewebsites.net/retriever/';
  const encodedQuery = encodeURIComponent(query);

  try {
    // Tạo URL đầy đủ với các tham số bao gồm query
    const fullUrl = `${apiUrl}?gemini_api_key=${encodeURIComponent(process.env.GEMINI_API_KEY)}&collection_name=movies&query=${encodedQuery}&amount=${amount}&threshold=${threshold}`;

    console.log('LLM API Request:', fullUrl); // Ghi log URL đầy đủ để kiểm tra

    const response = await axios.get(fullUrl); // Gửi yêu cầu GET đến API

    // console.log('LLM Response:', response.data); // Log phản hồi từ API

    return response.data.data.result; // Trả về mảng các ID tài liệu
  } catch (error) {
    console.error('LLM API error:', error.response ? error.response.data : error);
    throw new Error('Error retrieving data from LLM');
  }
}


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

// exports.searchMovies = async (req, res) => {
//   const { query, page = 1, limit = 10, ...filters } = req.query;
//   const baseCriteria = {
//       $or: [
//           { title: { $regex: query, $options: 'i' } },
//           { 'credits.cast.name': { $regex: query, $options: 'i' } }
//       ],
//       ...buildFilterCriteria(filters)
//   };

//   try {
//       const result = await applyFiltersAndPagination(baseCriteria, page, limit);
//       res.json(result);
//       // console.log("Search Criteria:", baseCriteria); // Debug log
//   } catch (error) {
//       res.status(500).send(`Error in searching movies with pagination: ${error}`);
//   }
// };

exports.searchMovies = async (req, res) => {
  const { query, page = 1, limit = 10, ...filters } = req.query;
  const filterCriteria = buildFilterCriteria(filters);
  const llmResults = await retrieveFromLLM(query);

  // Traditional database search criteria
  const dbSearchCriteria = {
       $or: [
          { title: { $regex: query, $options: 'i' } },
          { 'credits.cast.name': { $regex: query, $options: 'i' } }
      ],
    ...filterCriteria 
  };

  const resultsFromDB = await Movie.find(dbSearchCriteria).limit(limit).skip((page - 1) * limit);
  const resultsFromLLM = llmResults.length ? await Movie.find({ _id: { $in: llmResults }, ...filterCriteria }).limit(limit) : [];


  console.log("db",resultsFromDB.length)
  console.log("LLM",resultsFromLLM.length)


  // Combine results and eliminate duplicates
  const combinedResults = [...resultsFromDB, ...resultsFromLLM].reduce((acc, current) => {
    const x = acc.find(item => item._id.toString() === current._id.toString());
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  res.json({
    total: combinedResults.length,
    page,
    limit,
    totalPages: Math.ceil(combinedResults.length / limit),
    data: combinedResults
  });
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
