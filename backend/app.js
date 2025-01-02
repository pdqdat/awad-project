const express = require("express");
const connectDB = require("./config/db");
const movieRoutes = require("./routes/moviesRoutes");
const trendingRoutes = require("./routes/moviesTrendingRoutes");
const movieOfCateRoutes = require("./routes/moviesOfCateRoutes.js");
const castRoutes = require("./routes/castRoute.js");

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Define routes
app.use("/api", movieRoutes);
app.use("/api", trendingRoutes);
app.use("/api", movieOfCateRoutes);
app.use("/api", castRoutes);

// Handle 404 - Not Found
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist.");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
