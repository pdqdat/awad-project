const express = require('express');
const { ClerkExpressRequireAuth  } =  require('@clerk/clerk-sdk-node')
const router = express.Router();
const navigationController = require('../controllers/navigationController');

// Route to handle navigation queries
router.post('/navigate',ClerkExpressRequireAuth(), navigationController.getNavigation);

module.exports = router;
