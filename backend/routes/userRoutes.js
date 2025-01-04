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
    createPersonalList,
    addMovieToPersonalList,
    getPersonalLists,
    getPersonalListById,
    deletePersonalList
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
router.post('/lists', ClerkExpressRequireAuth(), createPersonalList);
router.post('/lists/:listId/movies', ClerkExpressRequireAuth(), addMovieToPersonalList);
router.get('/lists', ClerkExpressRequireAuth(), getPersonalLists);
router.get('/lists/:listId', ClerkExpressRequireAuth(), getPersonalListById);
router.delete('/lists/:listId', ClerkExpressRequireAuth(), deletePersonalList);



module.exports = router;
