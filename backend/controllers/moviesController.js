
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
      genres = decodeURIComponent(genres)
      console.log("decode",genres)
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

    if (all === "true") {
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
            const movies = await Movie.find({}).skip(skip).limit(limit);
            const totalMovies = await Movie.countDocuments({});
            res.json({
                total: totalMovies,
                page,
                limit,
                totalPages: Math.ceil(totalMovies / limit),
                data: movies,
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
            res.status(404).send("Movie not found");
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
};

exports.searchMovies = async (req, res) => {
  const { query, page = 1, limit = 10, ...filters } = req.query;
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (currentPage - 1) * pageSize;

  try {
    // Lấy kết quả từ LLM
    const llmResults = await retrieveFromLLM(query);
    const llmIds = new Set(llmResults); // Chuyển thành Set để loại bỏ trùng lặp
    console.log(llmIds)

    // Xây dựng điều kiện tìm kiếm dựa trên kết quả LLM và điều kiện từ filters
    const filterCriteria = buildFilterCriteria(filters);
    const dbSearchCriteria = {
      $or: [
        { _id: { $in: Array.from(llmIds) } },
        { title: { $regex: query, $options: 'i' } },
        { 'credits.cast.name': { $regex: query, $options: 'i' } }
      ],
      ...filterCriteria
    };

    // Truy vấn MongoDB với điều kiện đã xây dựng, kết hợp phân trang
    const results = await Movie.find(dbSearchCriteria).skip(skip).limit(pageSize);
    const totalResults = await Movie.countDocuments(dbSearchCriteria);

    res.json({
      total: totalResults,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(totalResults / pageSize),
      data: results
    });
  } catch (error) {
    console.error('Error in enhanced search:', error);
    res.status(500).send(`Error in enhanced search: ${error.message}`);
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
        res.status(500).send(error.toString());
    }
};

exports.filterMovies = async (req, res) => {
    const { genre, minRating, maxRating, releaseDate, page = 1, limit = 10 } = req.query;
    let filterCriteria = {};

    // Parse page and limit
    const currentPage = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (currentPage - 1) * pageSize;

    // Filter by genre if specified
    if (genre) {
        filterCriteria.genres = { $in: [genre] };
    }

    // Filter by rating range
    if (minRating || maxRating) {
        filterCriteria.vote_average = {};
        if (minRating) {
            filterCriteria.vote_average.$gte = parseFloat(minRating);
        }
        if (maxRating) {
            filterCriteria.vote_average.$lte = parseFloat(maxRating);
        }
    }

    // Filter by release date if specified
    if (releaseDate) {
        filterCriteria.release_date = { $gte: new Date(releaseDate) };
    }

    try {
        const totalMovies = await Movie.countDocuments(filterCriteria);
        const movies = await Movie.find(filterCriteria).skip(skip).limit(pageSize);

        res.json({
            total: totalMovies,
            page: currentPage,
            limit: pageSize,
            totalPages: Math.ceil(totalMovies / pageSize),
            data: movies,
        });
    } catch (error) {
        res.status(500).send(error.toString());
    }
};
