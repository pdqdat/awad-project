const mongoose = require('mongoose');

const userListSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    shared: { type: Boolean, default: false }
});

const UserList = mongoose.model('UserList', userListSchema);
module.exports = UserList;