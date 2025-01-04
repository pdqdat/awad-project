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
            .lean()  // Sử dụng lean() để tối ưu hóa truy vấn
            .exec();

        // Lấy thông tin người dùng cho mỗi review
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

