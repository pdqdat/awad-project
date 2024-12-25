const express = require('express');
const router = express.Router();
const {
  getUpcomingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getNowPlayingMovies,
  getSimilarMovies
} = require('../controllers/moviesOfCateController');

router.get('/movies/cate/upcoming', getUpcomingMovies);
router.get('/movies/cate/toprated', getTopRatedMovies);
router.get('/movies/cate/popular', getPopularMovies);
router.get('/movies/cate/nowplaying', getNowPlayingMovies);
router.get('/movies/:tmdb_id/similar', getSimilarMovies);

module.exports = router;
