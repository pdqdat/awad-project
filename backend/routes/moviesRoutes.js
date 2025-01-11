const express = require('express');
const { ClerkExpressWithAuth  } = require('@clerk/clerk-sdk-node');

const router = express.Router();


const { getAllMovies, getMovieById, searchMovies, filterMovies, getAllGenres,   getUpcomingMovies,
    getTopRatedMovies,
    getPopularMovies,
    getNowPlayingMovies,
    getSimilarMovies} = require('../controllers/moviesController');



router.get('/movies', getAllMovies);
router.get('/movies/:tmdb_id', getMovieById);
router.get('/search', searchMovies);
// router.get('/filter', filterMovies);
router.get('/genres', getAllGenres);

router.get('/movies/cate/upcoming', getUpcomingMovies);
router.get('/movies/cate/toprated', getTopRatedMovies);
router.get('/movies/cate/popular', getPopularMovies);
router.get('/movies/cate/nowplaying', getNowPlayingMovies);
router.get('/movies/:tmdb_id/similar',ClerkExpressWithAuth (), getSimilarMovies);


module.exports = router;
