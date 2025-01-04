const express = require('express');
const { addReview, getReviews,deleteReview } = require('../controllers/reviewController');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const router = express.Router();

router.post('/reviews', ClerkExpressRequireAuth(), addReview);
router.get('/movies/:movieId/reviews', getReviews);
router.delete('/reviews/:reviewId', ClerkExpressRequireAuth(), deleteReview);


module.exports = router;
