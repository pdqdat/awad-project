const Movie = require("../models/Movies");

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
    const { query } = req.query;
    try {
        const movies = await Movie.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { "credits.cast.name": { $regex: query, $options: "i" } },
            ],
        });
        res.json(movies);
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
