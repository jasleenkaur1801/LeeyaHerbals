const ProductReview = require('../Models/ProductReview');
const User = require('../Models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads/reviews';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Allow video files only
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    },
    fileFilter: fileFilter
}).single('video');

// Submit a new review
const submitReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Rating and comment are required'
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user already reviewed this product
        const existingReview = await ProductReview.findOne({ productId, userId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Handle video upload
        let videoUrl = null;
        let videoFileName = null;
        if (req.file) {
            videoUrl = `/uploads/reviews/${req.file.filename}`;
            videoFileName = req.file.filename;
        }

        // Create new review
        const newReview = new ProductReview({
            productId,
            userId,
            userName: user.name,
            userEmail: user.email,
            rating: parseInt(rating),
            comment: comment.trim(),
            videoUrl,
            videoFileName
        });

        await newReview.save();

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review: newReview
        });

    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit review',
            error: error.message
        });
    }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        // Get reviews
        const reviews = await ProductReview.find({ 
            productId, 
            status: 'approved' 
        })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-userEmail'); // Don't expose email addresses

        // Get product statistics
        const stats = await ProductReview.getProductStats(productId);

        // Calculate pagination info
        const totalReviews = await ProductReview.countDocuments({ 
            productId, 
            status: 'approved' 
        });

        res.json({
            success: true,
            reviews,
            stats,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalReviews / limit),
                totalReviews,
                hasMore: skip + reviews.length < totalReviews
            }
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const reviews = await ProductReview.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalReviews = await ProductReview.countDocuments({ userId });

        res.json({
            success: true,
            reviews,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalReviews / limit),
                totalReviews,
                hasMore: skip + reviews.length < totalReviews
            }
        });

    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user reviews',
            error: error.message
        });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const review = await ProductReview.findOne({ _id: reviewId, userId });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or you do not have permission to edit it'
            });
        }

        // Update fields
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }
            review.rating = rating;
        }

        if (comment !== undefined) {
            review.comment = comment.trim();
        }

        // Handle new video upload
        if (req.file) {
            // Delete old video if exists
            if (review.videoFileName) {
                const oldVideoPath = path.join(uploadsDir, review.videoFileName);
                if (fs.existsSync(oldVideoPath)) {
                    fs.unlinkSync(oldVideoPath);
                }
            }
            
            review.videoUrl = `/uploads/reviews/${req.file.filename}`;
            review.videoFileName = req.file.filename;
        }

        await review.save();

        res.json({
            success: true,
            message: 'Review updated successfully',
            review
        });

    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update review',
            error: error.message
        });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await ProductReview.findOne({ _id: reviewId, userId });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or you do not have permission to delete it'
            });
        }

        // Delete video file if exists
        if (review.videoFileName) {
            const videoPath = path.join(uploadsDir, review.videoFileName);
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
        }

        await ProductReview.findByIdAndDelete(reviewId);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message
        });
    }
};

// Mark review as helpful
const markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await ProductReview.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.helpfulCount += 1;
        await review.save();

        res.json({
            success: true,
            message: 'Review marked as helpful',
            helpfulCount: review.helpfulCount
        });

    } catch (error) {
        console.error('Error marking review as helpful:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark review as helpful',
            error: error.message
        });
    }
};

module.exports = {
    upload,
    submitReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    markHelpful
};
