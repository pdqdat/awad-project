const express = require('express');
const router = express.Router();
const {
  getTrendingMoviesDay,
  getTrendingMoviesWeek
} = require('../controllers/trendingMoviesController');

router.get('/trending/day', getTrendingMoviesDay);
router.get('/trending/week', getTrendingMoviesWeek);

module.exports = router;
