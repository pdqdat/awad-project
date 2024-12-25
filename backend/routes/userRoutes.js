// routes/user.js
const express = require('express');
const router = express.Router();
const userListController = require('../controllers/userListController');
const userRatingController = require('../controllers/userRatingController');

// User lists
router.post('/lists', userListController.createList);
router.put('/lists/:id', userListController.updateList);
router.delete('/lists/:id', userListController.deleteList);
router.get('/lists', userListController.getAllLists);

// User ratings
router.post('/ratings', userRatingController.rateMovie);
router.get('/ratings', userRatingController.getUserRatings);

module.exports = router;
