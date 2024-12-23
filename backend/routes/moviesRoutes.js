const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById, searchMovies, filterMovies } = require('../controllers/moviesController');



router.get('/movies', getAllMovies);
router.get('/movies/:tmdb_id', getMovieById);
router.get('/search', searchMovies);
router.get('/filter', filterMovies);

module.exports = router;
