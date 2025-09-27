const express = require('express');
const router = express.Router();
const {
    upload,
    submitReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    markHelpful
} = require('../Controllers/ProductReviewController');
const { ensureAuthenticated } = require('../Middlewares/Auth');

// Public routes
router.get('/reviews/product/:productId', getProductReviews);

// Protected routes (require authentication)
// Submit a review for a product (with optional video upload)
router.post('/reviews/product/:productId', ensureAuthenticated, upload, submitReview);

// Get current user's reviews
router.get('/my-reviews', ensureAuthenticated, getUserReviews);

// Update a review (with optional video upload)
router.put('/reviews/:reviewId', ensureAuthenticated, upload, updateReview);

// Delete a review
router.delete('/reviews/:reviewId', ensureAuthenticated, deleteReview);

// Mark a review as helpful
router.post('/reviews/:reviewId/helpful', ensureAuthenticated, markHelpful);

module.exports = router;
