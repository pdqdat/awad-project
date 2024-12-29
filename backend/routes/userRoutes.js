const express = require('express');
const { createList, addMovieToList } = require('../controllers/movieListController');
const { rateMovie } = require('../controllers/movieRatingController');

const router = express.Router();


router.post('/list/create', createList);
router.put('/list/addMovie', addMovieToList);
router.post('/rate', rateMovie);

module.exports = router;
