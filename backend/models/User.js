// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkUserId: { type: String, unique: true, required: true }, // Clerk's unique ID
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true }, // Email is unique per user
    watchlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Reference to Movie collection
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // User's favorite movies
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);
export default User;
