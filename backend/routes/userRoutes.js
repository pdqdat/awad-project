const express = require('express');
const { ClerkExpressRequireAuth  } =  require('@clerk/clerk-sdk-node')

const {
    addToWatchlist,
    markAsFavorite,
    rateMovie,
    getWatchlist,
    getFavoriteList,
    getRatingList,
    removeFromWatchlist,
    removeFromFavoriteList,
    removeFromRatingList,
} = require('../controllers/userController');

const router = express.Router();

router.post('/watchlist', ClerkExpressRequireAuth(), addToWatchlist);
router.get('/watchlist', ClerkExpressRequireAuth(), getWatchlist);
router.post('/favorite', ClerkExpressRequireAuth(), markAsFavorite);
router.get('/favorite', ClerkExpressRequireAuth(), getFavoriteList);
router.post('/rate', ClerkExpressRequireAuth(), rateMovie);
router.get('/rate', ClerkExpressRequireAuth(), getRatingList);
router.delete('/watchlist', ClerkExpressRequireAuth(), removeFromWatchlist);
router.delete('/favorite', ClerkExpressRequireAuth(), removeFromFavoriteList);
router.delete('/rate', ClerkExpressRequireAuth(), removeFromRatingList);



module.exports = router;
