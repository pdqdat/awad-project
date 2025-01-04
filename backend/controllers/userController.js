const getModelForCollection = require('../models/Movies');
const User = require('../models/User');
const Movie = getModelForCollection('movies');


exports.addToWatchlist = async (req, res) => {
    const { movieId } = req.body;
    const userId = req.auth.userId; 

    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const exists = user.watchlist.some(item => item.movieId === movieId);
        if (exists) {
            return res.status(400).json({ message: 'Movie already in watchlist' });
        }

        user.watchlist.push({ movieId });
        await user.save();

        res.status(201).json({ message: 'Movie added to watchlist', watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to watchlist', error: error.message });
    }
};


exports.markAsFavorite = async (req, res) => {
    const { movieId } = req.body;
    const userId = req.auth.userId; 

    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const exists = user.favoriteList.some(item => item.movieId === movieId);
        if (exists) {
            return res.status(400).json({ message: 'Movie already in favorite list' });
        }

        user.favoriteList.push({ movieId });
        await user.save();

        res.status(201).json({ message: 'Movie marked as favorite', favoriteList: user.favoriteList });
    } catch (error) {
        res.status(500).json({ message: 'Error marking as favorite', error: error.message });
    }
};

exports.rateMovie = async (req, res) => {
    const { movieId, rating } = req.body;
    const userId = req.auth.userId; 

    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const movie = await Movie.findOne({ tmdb_id: movieId });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const existingRating = user.ratingList.find(item => item.movieId === movieId);
        const currentVoteCount = movie.vote_count || 0;
        const currentVoteAverage = movie.vote_average || 0;

        if (existingRating) {
            const oldRating = existingRating.rating;

            const adjustedVoteAverage = (currentVoteAverage * currentVoteCount - oldRating + rating) / currentVoteCount;

            existingRating.rating = rating;
            existingRating.ratedAt = new Date();

            movie.vote_average = adjustedVoteAverage;
        } else {
            const newVoteAverage = (currentVoteAverage * currentVoteCount + rating) / (currentVoteCount + 1);

            user.ratingList.push({ movieId, rating });

            movie.vote_average = newVoteAverage;
            movie.vote_count = currentVoteCount + 1;
        }

        await user.save();
        await movie.save();

        res.status(200).json({
            message: 'Rating updated successfully',
            movie: {
                tmdb_id: movie.tmdb_id,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
            },
            user: {
                clerkUserId: user.clerkUserId,
                ratingList: user.ratingList,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error rating movie', error: error.message });
    }
};

exports.getWatchlist = async (req, res) => {
    const userId = req.auth.userId; 

    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
    }
};


exports.getFavoriteList = async (req, res) => {
    const userId = req.auth.userId; 

    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ favoriteList: user.favoriteList });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
    }
};


exports.getRatingList = async (req, res) => {
    const userId = req.auth.userId; 

    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ ratingList: user.ratingList });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
    }
};

exports.removeFromWatchlist = async (req, res) => {
    const { movieId } = req.body;
    const userId = req.auth.userId;

    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const initialLength = user.watchlist.length;
        user.watchlist = user.watchlist.filter(item => item.movieId !== movieId);

        if (user.watchlist.length === initialLength) {
            return res.status(404).json({ message: 'Movie not found in watchlist' });
        }

        await user.save();
        res.status(200).json({ message: 'Movie removed from watchlist', watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: 'Error removing movie from watchlist', error: error.message });
    }
};


exports.removeFromFavoriteList = async (req, res) => {
    const { movieId } = req.body;
    const userId = req.auth.userId;

    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const initialLength = user.favoriteList.length;
        user.favoriteList = user.favoriteList.filter(item => item.movieId !== movieId);

        if (user.favoriteList.length === initialLength) {
            return res.status(404).json({ message: 'Movie not found in favorite list' });
        }

        await user.save();
        res.status(200).json({ message: 'Movie removed from favorite list', favoriteList: user.favoriteList });
    } catch (error) {
        res.status(500).json({ message: 'Error removing movie from favorite list', error: error.message });
    }
};

exports.removeFromRatingList = async (req, res) => {
    const { movieId } = req.body;
    const userId = req.auth.userId;

    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const ratingIndex = user.ratingList.findIndex(item => item.movieId === movieId);
        if (ratingIndex === -1) {
            return res.status(404).json({ message: 'Rating not found in rating list' });
        }

        const oldRating = user.ratingList[ratingIndex].rating;

        user.ratingList.splice(ratingIndex, 1);
        await user.save();

        const movie = await Movie.findOne({ tmdb_id: movieId });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const currentVoteCount = movie.vote_count || 0;
        const currentVoteAverage = movie.vote_average || 0;

        if (currentVoteCount > 1) {
            const newVoteAverage = (currentVoteAverage * currentVoteCount - oldRating) / (currentVoteCount - 1);
            movie.vote_average = newVoteAverage;
            movie.vote_count = currentVoteCount - 1;
        } else {
            movie.vote_average = 0;
            movie.vote_count = 0;
        }

        await movie.save();

        res.status(200).json({
            message: 'Rating removed successfully',
            movie: {
                tmdb_id: movie.tmdb_id,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
            },
            user: {
                clerkUserId: user.clerkUserId,
                ratingList: user.ratingList,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error removing rating', error: error.message });
    }
};

