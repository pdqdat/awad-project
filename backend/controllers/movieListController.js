const MovieList = require('../models/MovieList');

// Create a new list
exports.createList = async (req, res) => {
    const { name, public } = req.body;
    const userId = req.user.id; // Assuming the user id is attached to req.user by Clerk middleware

    try {
        const newList = new MovieList({
            userId,
            name,
            public,
            movies: []
        });
        await newList.save();
        res.status(201).json(newList);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Add a movie to a list
exports.addMovieToList = async (req, res) => {
    const { listId, movieId } = req.body;

    try {
        const list = await MovieList.findById(listId);
        if (list.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        list.movies.push(movieId);
        await list.save();
        res.status(200).json(list);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
