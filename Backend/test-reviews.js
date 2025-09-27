// Simple test script to verify review system is working
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test review endpoints
app.get('/api/reviews/product/:productId', (req, res) => {
  const { productId } = req.params;
  
  // Return mock data for testing
  res.json({
    success: true,
    reviews: [
      {
        _id: 'test1',
        productId: productId,
        userName: 'Test User',
        rating: 5,
        comment: 'Great product! Really helped with my skin.',
        videoUrl: null,
        helpfulCount: 3,
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'test2',
        productId: productId,
        userName: 'Another User',
        rating: 4,
        comment: 'Good quality, would recommend to others.',
        videoUrl: null,
        helpfulCount: 1,
        isVerified: true,
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ],
    stats: {
      averageRating: 4.5,
      totalReviews: 2,
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 }
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalReviews: 2,
      hasMore: false
    }
  });
});

app.post('/api/reviews/product/:productId', (req, res) => {
  res.json({
    success: true,
    message: 'Review submitted successfully (test mode)',
    review: {
      _id: 'new-test-review',
      productId: req.params.productId,
      userName: 'Test User',
      rating: req.body.rating,
      comment: req.body.comment,
      videoUrl: null,
      helpfulCount: 0,
      isVerified: true,
      createdAt: new Date().toISOString()
    }
  });
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Test review server running on http://localhost:${PORT}`);
  console.log('Test endpoints:');
  console.log(`GET http://localhost:${PORT}/api/reviews/product/1`);
  console.log(`POST http://localhost:${PORT}/api/reviews/product/1`);
});
