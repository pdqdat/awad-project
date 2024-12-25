const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById, searchMovies, filterMovies, getAllGenres } = require('../controllers/moviesController');



router.get('/movies', getAllMovies);
router.get('/movies/:tmdb_id', getMovieById);
router.get('/search', searchMovies);
router.get('/filter', filterMovies);
router.get('/genres', getAllGenres);

module.exports = router;
