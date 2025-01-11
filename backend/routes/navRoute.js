const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigationController');

// Route to handle navigation queries
router.post('/navigate', navigationController.getNavigation);

module.exports = router;
