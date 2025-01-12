const axios = require('axios');
const getModelForCollection = require("../models/Movies");
const Movie = getModelForCollection("movies");

const API_ENDPOINT = 'https://awd-llm.azurewebsites.net/navigate/';
const API_KEY = process.env.GEMINI_API_KEY;

exports.getNavigation = async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    const apiUrl = `${API_ENDPOINT}?llm_api_key=${encodeURIComponent(API_KEY)}&query=${encodeURIComponent(query)}`;

    try {
        const response = await axios.post(apiUrl);
        if (response.data.status === 200 && response.data.data.is_success) {
            // Handle response based on the route
            switch (response.data.data.route) {
                case 'CAST_PAGE':
                case 'MOVIE_PAGE':
                    const movieIds = response.data.data.params.movie_ids;
                    const movies = await Movie.find({
                        '_id': { $in: movieIds }
                    }, {
                        _id: 1,
                        tmdb_id: 1,
                        adult: 1,
                        backdrop_path: 1,
                        belongs_to_collection: 1,
                        genres: 1,
                        homepage: 1,
                        id: 1,
                        imdb_id: 1,
                        overview: 1,
                        popularity: 1,
                        poster_path: 1,
                        release_date: 1,
                        runtime: 1,
                        title: 1,
                        vote_average: 1,
                        vote_count: 1
                    });
                    res.json({
                        route: response.data.data.route,
                        params: movies, // Add movie details to the response
                        metadata: response.data.data.metadata
                    });
                    break;
                default:
                    res.json({
                        route: response.data.data.route,
                        params: response.data.data.params,
                        metadata: response.data.data.metadata
                    });
                    break;
            }
        } else {
            res.status(response.data.status).json({ message: 'Navigation failed', details: response.data });
        }
    } catch (error) {
        console.error('Error accessing the LLM navigation API:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
