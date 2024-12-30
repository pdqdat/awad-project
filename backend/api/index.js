const express = require('express');
const connectDB = require('../config/db.js');
const movieRoutes = require('../routes/moviesRoutes.js');
const trendingRoutes = require('../routes/moviesTrendingRoutes.js');
const castRoutes = require('../routes/castRoute.js');
const userRoutes = require('../routes/userRoutes.js'); 
const webhookRoutes = require('../routes/webhookRoutes.js');

const { clerkMiddleware, requireAuth } = require('@clerk/express');
const { ClerkExpressRequireAuth } =  require('@clerk/clerk-sdk-node')

const dotenv = require('dotenv');
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());

// app.use(clerkMiddleware());

// Connect to the database
connectDB();



app.use((req, res, next) => {
    if (req.path === '/api/webhook') {
        next(); // Skip JSON parsing for webhook route
    } else {
        express.json()(req, res, next); // Apply JSON parsing for all other routes
    }
});


// Define routes
app.use('/api', movieRoutes);
app.use('/api', trendingRoutes);
app.use('/api', castRoutes);
app.use('/api',ClerkExpressRequireAuth(), userRoutes); 
app.use('/api', webhookRoutes);

// app.get('/debug-secret', (req, res) => {
//     const secretKey = process.env.CLERK_WEBHOOK_SECRET_KEY;
//     if (!secretKey) {
//         res.status(500).send('CLERK_WEBHOOK_SECRET_KEY is not set or empty');
//     } else {
//         res.status(200).send(`CLERK_WEBHOOK_SECRET_KEY: ${secretKey}`);
//     }
// });



app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
  })

// Handle 404 - Not Found
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist.");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // console.log('CLERK_WEBHOOK_SECRET_KEY:', process.env.CLERK_WEBHOOK_SECRET_KEY);
});

module.exports = app;