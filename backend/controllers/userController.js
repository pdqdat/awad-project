const getModelForCollection = require('../models/Movies');
const User = require('../models/User');
const Movie = getModelForCollection('movies');
const PersonalList = require('../models/PersonalList')


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

        const movieIds = user.watchlist.map(item => item.movieId);

        const movies = await Movie.find(
            { tmdb_id: { $in: movieIds } },
            {
                _id: 1,
                tmdb_id: 1,
                adult: 1,
                backdrop_path: 1,
                belongs_to_collection: 1,
                genres: 1,
                homepage: 1,
                id: 1,
                imdb_id: 1,
                overview: 1,
                popularity: 1,
                poster_path: 1,
                release_date: 1,
                runtime: 1,
                title: 1,
                vote_average: 1,
                vote_count: 1,
            }
        );

        res.status(200).json({ watchlist: movies });
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

        // Lấy danh sách ID phim từ favorite list
        const movieIds = user.favoriteList.map(item => item.movieId);

        // Truy vấn thông tin chi tiết phim
        const movies = await Movie.find(
            { tmdb_id: { $in: movieIds } },
            {
                _id: 1,
                tmdb_id: 1,
                adult: 1,
                backdrop_path: 1,
                belongs_to_collection: 1,
                genres: 1,
                homepage: 1,
                id: 1,
                imdb_id: 1,
                overview: 1,
                popularity: 1,
                poster_path: 1,
                release_date: 1,
                runtime: 1,
                title: 1,
                vote_average: 1,
                vote_count: 1,
            }
        );

        res.status(200).json({ favoriteList: movies });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorite list', error: error.message });
    }
};


exports.getRatingList = async (req, res) => {
    const userId = req.auth.userId;

    try {
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Lấy danh sách ID phim từ rating list
        const movieIds = user.ratingList.map(item => item.movieId);

        // Truy vấn thông tin chi tiết phim
        const movies = await Movie.find(
            { tmdb_id: { $in: movieIds } },
            {
                _id: 1,
                tmdb_id: 1,
                adult: 1,
                backdrop_path: 1,
                belongs_to_collection: 1,
                genres: 1,
                homepage: 1,
                id: 1,
                imdb_id: 1,
                overview: 1,
                popularity: 1,
                poster_path: 1,
                release_date: 1,
                runtime: 1,
                title: 1,
                vote_average: 1,
                vote_count: 1,
            }
        );

        // Thêm rating của user vào chi tiết movie
        const ratingDetails = movies.map(movie => {
            const rating = user.ratingList.find(item => item.movieId === movie.tmdb_id);
            return {
                ...movie._doc,
                userRating: rating.rating,
            };
        });

        res.status(200).json({ ratingList: ratingDetails });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rating list', error: error.message });
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

exports.createPersonalList = async (req, res) => {
    const userId = req.auth.userId;
    const { name, description, isPublic } = req.body;

    try {
        const newList = new PersonalList({
            userId,
            name,
            description,
            isPublic
        });

        await newList.save();
        res.status(201).json({ message: 'List created successfully', list: newList });
    } catch (error) {
        res.status(500).json({ message: 'Error creating list', error: error.message });
    }
};

exports.addMovieToPersonalList = async (req, res) => {
    const userId = req.auth.userId;
    const { movieId } = req.body; 
    const listId = req.params.listId; 

    // console.log('User ID:', userId); 
    // console.log('listId:', listId); 

    try {
        const list = await PersonalList.findOne({ _id: listId, userId });
        console.log('List:', list); 

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        const exists = list.movies.some(item => item.movieId === movieId);
        if (exists) {
            return res.status(400).json({ message: 'Movie already in list' });
        }

        list.movies.push({ movieId });
        await list.save();

        res.status(200).json({ message: 'Movie added to list', list });
    } catch (error) {
        res.status(500).json({ message: 'Error adding movie to list', error: error.message });
    }
};


exports.getPersonalLists = async (req, res) => {
    const userId = req.auth.userId;

    try {
        const lists = await PersonalList.find({ userId });
        res.status(200).json({ lists });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lists', error: error.message });
    }
};


exports.getPersonalListById = async (req, res) => {
    const userId = req.auth.userId;
    const { listId } = req.params;

    try {
        const list = await PersonalList.findOne({ _id: listId, userId });
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        const movieIds = list.movies.map(item => item.movieId);
        const movies = await Movie.find(
            { tmdb_id: { $in: movieIds } },
            {
                _id: 1,
                tmdb_id: 1,
                adult: 1,
                backdrop_path: 1,
                belongs_to_collection: 1,
                genres: 1,
                homepage: 1,
                id: 1,
                imdb_id: 1,
                overview: 1,
                popularity: 1,
                poster_path: 1,
                release_date: 1,
                runtime: 1,
                title: 1,
                vote_average: 1,
                vote_count: 1,
            }
        );

        res.status(200).json({ list, movies });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching list details', error: error.message });
    }
};


exports.deletePersonalList = async (req, res) => {
    const userId = req.auth.userId;
    const { listId } = req.params;

    try {
        const list = await PersonalList.findOneAndDelete({ _id: listId, userId });
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        res.status(200).json({ message: 'List deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting list', error: error.message });
    }
};
