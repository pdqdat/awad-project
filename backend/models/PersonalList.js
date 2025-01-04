const mongoose = require('mongoose');

const personalListSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    name: { type: String, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: false }, 
    movies: [
        {
            movieId: { type: Number, required: true }, 
            addedAt: { type: Date, default: Date.now }, 
        }
    ]
}, { timestamps: true }); 

const PersonalList = mongoose.model('PersonalList', personalListSchema);

module.exports = PersonalList;
