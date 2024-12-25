import express from 'express';
import { handleClerkWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Clerk webhook endpoint
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), handleClerkWebhook);

export default router;
