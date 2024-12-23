const express = require('express');
const router = express.Router();
const castController = require('../controllers/castController');

// Route to get actor details by tmdb_id
router.get('/cast/:tmdb_id', castController.getCastById);

module.exports = router;
