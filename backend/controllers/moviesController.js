const getModelForCollection = require("../models/Movies");
const Movie = getModelForCollection("movies");
const MovieSimilar = getModelForCollection("similar");
const User = require("../models/User");

const Genre = require("../models/Genres");

const axios = require("axios");

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
  const apiUrl = "https://awd-llm.azurewebsites.net/retriever/";
  const encodedQuery = encodeURIComponent(query);

  try {
    // Tạo URL đầy đủ với các tham số bao gồm query
    const fullUrl = `${apiUrl}?llm_api_key=${encodeURIComponent(
      process.env.GEMINI_API_KEY
    )}&collection_name=movies&query=${encodedQuery}&amount=${amount}&threshold=${threshold}`;

    console.log("LLM API Request:", fullUrl); // Ghi log URL đầy đủ để kiểm tra

    const response = await axios.get(fullUrl); // Gửi yêu cầu GET đến API

    // console.log('LLM Response:', response.data); // Log phản hồi từ API

    return response.data.data.result; // Trả về mảng các ID tài liệu
  } catch (error) {
    console.error(
      "LLM API error:",
      error.response ? error.response.data : error
    );
    throw new Error("Error retrieving data from LLM");
  }
}

function capitalizeWords(string) {
  return string
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildFilterCriteria({
  genres,
  minRating,
  maxRating,
  startDate,
  endDate,
}) {
  let filterCriteria = {};

  if (genres) {
    // console.log("chua decode",genres)
    genres = decodeURIComponent(genres);
    console.log("decode", genres);
    if (typeof genres === "string") {
      genres = genres.split(",").map((genre) => capitalizeWords(genre.trim()));
    } else if (Array.isArray(genres)) {
      genres = genres.map((genre) => capitalizeWords(genre.trim()));
    }
    filterCriteria["genres.name"] = { $all: genres };
  }
  if (minRating) {
    filterCriteria.vote_average = {
      ...(filterCriteria.vote_average || {}),
      $gte: parseFloat(minRating),
    };
  }

  if (maxRating) {
    filterCriteria.vote_average = {
      ...(filterCriteria.vote_average || {}),
      $lte: parseFloat(maxRating),
    };
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
    data: items,
  };
};

exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find({});
    res.json(genres);
  } catch (error) {
    console.error("Failed to retrieve genres:", error);
    res.status(500).send("Server error while retrieving genres");
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
  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (currentPage - 1) * pageSize;

  try {
    // Lấy kết quả từ LLM
    const llmResults = await retrieveFromLLM(query);
    const llmIds = new Set(llmResults); // Chuyển thành Set để loại bỏ trùng lặp
    console.log(llmIds);

    // Xây dựng điều kiện tìm kiếm dựa trên kết quả LLM và điều kiện từ filters
    const filterCriteria = buildFilterCriteria(filters);
    const dbSearchCriteria = {
      $or: [
        { _id: { $in: Array.from(llmIds) } },
        { title: { $regex: query, $options: "i" } },
        { "credits.cast.name": { $regex: query, $options: "i" } },
      ],
      ...filterCriteria,
    };

    // Truy vấn MongoDB với điều kiện đã xây dựng, kết hợp phân trang
    const results = await Movie.find(dbSearchCriteria)
      .skip(skip)
      .limit(pageSize);
    const totalResults = await Movie.countDocuments(dbSearchCriteria);

    res.json({
      total: totalResults,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(totalResults / pageSize),
      data: results,
    });
  } catch (error) {
    console.error("Error in enhanced search:", error);
    res.status(500).send(`Error in enhanced search: ${error.message}`);
  }
};

exports.getUpcomingMovies = async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const baseCriteria = {
    categories: "upcoming",
    ...buildFilterCriteria(filters),
  };

  try {
    const result = await applyFiltersAndPagination(baseCriteria, page, limit);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .send(`Error fetching popular movies with filters: ${error}`);
  }
};

exports.getTopRatedMovies = async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const baseCriteria = {
    categories: "top_rated",
    ...buildFilterCriteria(filters),
  };

  try {
    const result = await applyFiltersAndPagination(baseCriteria, page, limit);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .send(`Error fetching popular movies with filters: ${error}`);
  }
};

exports.getPopularMovies = async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const baseCriteria = {
    categories: "popular",
    ...buildFilterCriteria(filters),
  };

  try {
    const result = await applyFiltersAndPagination(baseCriteria, page, limit);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .send(`Error fetching popular movies with filters: ${error}`);
  }
};

exports.getNowPlayingMovies = async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const baseCriteria = {
    categories: "now_playing",
    ...buildFilterCriteria(filters),
  };

  try {
    const result = await applyFiltersAndPagination(baseCriteria, page, limit);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .send(`Error fetching popular movies with filters: ${error}`);
  }
};

// exports.getSimilarMovies = async (req, res) => {
//   try {
//       console.log("tmdb_id:", req.params.tmdb_id);
//       const movie = await MovieSimilar.findOne({ tmdb_id: req.params.tmdb_id });
//       // console.log("Movie found:", movie);
//       if (movie && movie.similar_movies) {
//           res.json(movie.similar_movies);
//       } else {
//           res.status(404).send('Similar movies not found');
//       }
//   } catch (error) {
//       console.error('Error retrieving similar movies:', error);
//       res.status(500).send(error.toString());
//   }
// };

// Analyze the watchlist to extract genre frequencies
const analyzeWatchlist = async (watchlist, genreMapping) => {
  const genreFrequency = {};
  const movieIds = watchlist.map((item) => item.movieId);

  console.log("Watchlist Movie IDs:", movieIds); // Log the IDs from the watchlist

  // Fetch detailed movie data for the watchlist
  const movies = await Movie.find({ tmdb_id: { $in: movieIds } });
  console.log("Detailed Movies from Watchlist:", movies); // Log the detailed movie data

  movies.forEach((movie) => {
    if (movie.genres && Array.isArray(movie.genres)) {
      console.log("Movie Genres:", movie.genres); // Log genres of each movie
      movie.genres.forEach((genre) => {
        const genreName = genre.name || genreMapping[genre.id] || "Unknown"; // Adjust for different genre structures
        console.log("Resolved Genre Name:", genreName); // Log resolved genre name
        genreFrequency[genreName] = (genreFrequency[genreName] || 0) + 1;
      });
    } else {
      console.warn("Invalid or missing genres for movie:", movie.tmdb_id);
    }
  });

  const sortedGenres = Object.entries(genreFrequency)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([genre]) => genre);

  console.log("Sorted Genres by Frequency:", sortedGenres); // Log the sorted genres

  return { sortedGenres, movieIds };
};

const findSimilarMoviesFromWatchlist = async (genres) => {
  console.log("Genres used for similar movie search:", genres); // Log the genres passed to the query

  if (!genres || genres.length === 0) {
    console.warn("No genres provided for finding similar movies.");
    return [];
  }

  try {
    const movies = await Movie.find({
      "genres.name": { $in: genres }, // Match by genre names
    }).limit(10);

    console.log("Movies found from genres:", movies); // Log the movies found from genres
    return movies;
  } catch (error) {
    console.error("Error finding similar movies from genres:", error);
    return [];
  }
};

exports.getSimilarMovies = async (req, res) => {
  const userId = req.auth ? req.auth.userId : null;
  const { tmdb_id } = req.params;

  try {
    const genreDocs = await Genre.find({});
    const genreMapping = genreDocs.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});

    console.log("Genre Mapping:", genreMapping); // Log the genre mapping

    const movieSimilar = await MovieSimilar.findOne({ tmdb_id });
    let similarMovies = movieSimilar ? movieSimilar.similar_movies : [];

    console.log("Initial Similar Movies:", similarMovies); // Log the initial similar movies

    if (userId) {
      const user = await User.findOne({ clerkUserId: userId });
      if (user && user.watchlist.length > 0) {
        console.log("User Watchlist:", user.watchlist); // Log the user's watchlist
        const watchlist = user.watchlist;

        const { sortedGenres } = await analyzeWatchlist(
          watchlist,
          genreMapping
        );

        const historyBasedMovies = await findSimilarMoviesFromWatchlist(
          sortedGenres
        );

        console.log("History-Based Movies:", historyBasedMovies); // Log the history-based movies

        similarMovies = [...similarMovies, ...historyBasedMovies];
      }
    }

    // Remove duplicate movies
    const uniqueSimilarMovies = Array.from(
      similarMovies
        .reduce((map, movie) => {
          map.set(movie.id || movie.tmdb_id, movie);
          return map;
        }, new Map())
        .values()
    );

    console.log("Unique Similar Movies:", uniqueSimilarMovies); // Log the final unique similar movies

    res.status(200).json(uniqueSimilarMovies);
  } catch (error) {
    console.error("Error retrieving similar movies:", error);
    res
      .status(500)
      .json({
        message: "Error retrieving similar movies",
        error: error.message,
      });
  }
};
