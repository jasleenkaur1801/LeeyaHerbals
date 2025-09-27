// Debug server to test review routes step by step
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test 1: Basic server
app.get('/ping', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Test 2: Simple review endpoint without dependencies
app.get('/api/reviews/product/:productId', (req, res) => {
  console.log('GET /api/reviews/product/' + req.params.productId);
  res.json({
    success: true,
    message: 'Review endpoint is working',
    productId: req.params.productId,
    reviews: [],
    stats: {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    },
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalReviews: 0,
      hasMore: false
    }
  });
});

// Test 3: POST endpoint
app.post('/api/reviews/product/:productId', (req, res) => {
  console.log('POST /api/reviews/product/' + req.params.productId);
  console.log('Body:', req.body);
  res.json({
    success: true,
    message: 'Review submitted successfully (debug mode)',
    review: {
      _id: 'debug-review-' + Date.now(),
      productId: req.params.productId,
      userName: 'Debug User',
      rating: req.body.rating || 5,
      comment: req.body.comment || 'Debug comment',
      videoUrl: null,
      helpfulCount: 0,
      isVerified: true,
      createdAt: new Date().toISOString()
    }
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Debug server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`GET  http://localhost:${PORT}/ping`);
  console.log(`GET  http://localhost:${PORT}/api/reviews/product/74`);
  console.log(`POST http://localhost:${PORT}/api/reviews/product/74`);
  console.log('\nServer is ready for testing!');
});
