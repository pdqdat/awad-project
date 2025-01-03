const Rating = require('../models/Rating');
const Movie = require('../models/Movies');

// Create or update a rating, and update the movie's average rating
exports.rateMovie = async (req, res) => {
    const { movieId, rating } = req.body;
    const userId = req.user.id; // Assuming you are attaching the user ID from Clerk authentication

    try {
        // Find or create a rating
        let userRating = await Rating.findOneAndUpdate(
            { movieId, userId },
            { rating },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Update the movie average rating and vote count
        const ratings = await Rating.find({ movieId: movieId });
        const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
        
        await Movie.findByIdAndUpdate(movieId, {
            vote_average: averageRating,
            vote_count: ratings.length
        });

        res.status(200).json({
            success: true,
            message: 'Rating updated and movie average calculated successfully',
            data: {
                movieId: movieId,
                averageRating: averageRating,
                totalRatings: ratings.length
            }
        });
    } catch (error) {
        console.error('Error handling rating:', error);
        res.status(500).json({ success: false, message: 'Failed to process rating: ' + error.message });
    }
};
