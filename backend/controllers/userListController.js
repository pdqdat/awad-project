const UserList = require('../models/UserList');

// Create a new list
exports.createList = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('User is not authenticated');
          }          
        const newList = new UserList({
            user_id: req.user.id, 
            name: req.body.name,
            movies: req.body.movies,
            shared: req.body.shared
        });
        await newList.save();
        res.status(201).json(newList);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Update an existing list
exports.updateList = async (req, res) => {
    try {
        const updatedList = await UserList.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.json(updatedList);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Delete a list
exports.deleteList = async (req, res) => {
    try {
        await UserList.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Get all lists for a user
exports.getAllLists = async (req, res) => {
    try {
        const lists = await UserList.find({ user_id: req.user.id });
        res.json(lists);
    } catch (error) {
        res.status(400).send(error.message);
    }
};
