// controllers/userRatingController.js
const UserRating = require('../models/UserRating');
const Movie = require('../models/Movies');

// Rate a movie
exports.rateMovie = async (req, res) => {
    const { movie_id, rating } = req.body;
    try {
        // Check if the user has already rated the movie
        const existingRating = await UserRating.findOne({
            user_id: req.user.id,
            movie_id: movie_id
        });

        if (existingRating) {
            // Update the existing rating
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            // Create a new rating
            const newRating = new UserRating({
                user_id: req.user.id,
                movie_id: movie_id,
                rating: rating
            });
            await newRating.save();
        }

        // Update the movie's average rating
        const movie = await Movie.findById(movie_id);
        if (movie) {
            const ratings = await UserRating.find({ movie_id: movie_id });
            const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
            movie.vote_average = averageRating;
            movie.vote_count = ratings.length;
            await movie.save();
        }

        res.status(201).json({ message: "Rating updated successfully." });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Get user ratings
exports.getUserRatings = async (req, res) => {
    try {
        const ratings = await UserRating.find({ user_id: req.user.id });
        res.json(ratings);
    } catch (error) {
        res.status(400).send(error.message);
    }
};
