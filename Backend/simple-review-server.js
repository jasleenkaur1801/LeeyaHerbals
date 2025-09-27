// Simple working review server - guaranteed to work
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

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

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files allowed'), false);
        }
    }
}).single('video');

// In-memory storage for reviews (for testing)
let reviews = {};

// GET reviews for a product
app.get('/api/reviews/product/:productId', (req, res) => {
    const { productId } = req.params;
    console.log(`GET /api/reviews/product/${productId}`);
    
    const productReviews = reviews[productId] || [];
    
    // Calculate stats
    const totalReviews = productReviews.length;
    const averageRating = totalReviews > 0 
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;
    
    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    productReviews.forEach(r => ratingBreakdown[r.rating]++);
    
    res.json({
        success: true,
        reviews: productReviews,
        stats: {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews,
            ratingBreakdown
        },
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalReviews,
            hasMore: false
        }
    });
});

// POST new review
app.post('/api/reviews/product/:productId', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                success: false,
                message: 'File upload error: ' + err.message
            });
        }
        
        const { productId } = req.params;
        const { rating, comment } = req.body;
        
        console.log(`POST /api/reviews/product/${productId}`);
        console.log('Data:', { rating, comment, hasVideo: !!req.file });
        
        // Validate
        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Rating and comment are required'
            });
        }
        
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }
        
        // Create review
        const review = {
            _id: 'review_' + Date.now(),
            productId,
            userName: 'Test User',
            rating: parseInt(rating),
            comment: comment.trim(),
            videoUrl: req.file ? `/uploads/reviews/${req.file.filename}` : null,
            helpfulCount: 0,
            isVerified: true,
            createdAt: new Date().toISOString()
        };
        
        // Store review
        if (!reviews[productId]) {
            reviews[productId] = [];
        }
        reviews[productId].push(review);
        
        console.log('Review saved:', review);
        
        res.json({
            success: true,
            message: 'Review submitted successfully!',
            review
        });
    });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test endpoint
app.get('/ping', (req, res) => {
    res.json({ message: 'Review server is working!' });
});

// Mark review as helpful
app.post('/api/reviews/:reviewId/helpful', (req, res) => {
    const { reviewId } = req.params;
    console.log(`POST /api/reviews/${reviewId}/helpful`);
    
    // Find and update review
    let found = false;
    Object.keys(reviews).forEach(productId => {
        const review = reviews[productId].find(r => r._id === reviewId);
        if (review) {
            review.helpfulCount = (review.helpfulCount || 0) + 1;
            found = true;
        }
    });
    
    if (found) {
        res.json({
            success: true,
            message: 'Marked as helpful'
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Review not found'
        });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`\n🚀 Review Server running on http://localhost:${PORT}`);
    console.log('📝 Available endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/reviews/product/74`);
    console.log(`   POST http://localhost:${PORT}/api/reviews/product/74`);
    console.log(`   GET  http://localhost:${PORT}/ping`);
    console.log('\n✅ Server ready! Try submitting a review now.\n');
});
