const express = require('express');
const bodyParser = require('body-parser');
const { handleClerkWebhook } = require('../controllers/webhookController');

const router = express.Router();

// Clerk webhook endpoint
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), handleClerkWebhook);

module.exports = router;
