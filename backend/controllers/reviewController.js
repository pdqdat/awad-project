const Review = require('../models/Review');
const User= require('../models/User')

exports.addReview = async (req, res) => {
    const { movieId, text } = req.body;
    const userId = req.auth.userId;  

    try {
        const review = new Review({
            movieId,
            userId,
            text
        });

        await review.save();
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};

exports.getReviews = async (req, res) => {
    const { movieId } = req.params;

    try {
        const reviews = await Review.find({ movieId })
            .lean() 
            .exec();

        const userInfos = await Promise.all(
            reviews.map(review => 
                User.findOne({ clerkUserId: review.userId }, 'firstName lastName').lean()
            )
        );

        // Gắn thông tin người dùng vào từng review
        const reviewsWithUserInfo = reviews.map((review, index) => ({
            ...review,
            user: userInfos[index]
        }));

        res.status(200).json(reviewsWithUserInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};


exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.auth.userId;  

    try {
        const result = await Review.deleteOne({ _id: reviewId, userId: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No review found or you don't have permission to delete this review" });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};