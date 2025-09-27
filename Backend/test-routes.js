// Test script to verify review routes are working
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Import the review router
const ProductReviewRouter = require('./Routes/ProductReviewRouter');

// Mount the router
app.use('/api', ProductReviewRouter);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

const PORT = 8082;
app.listen(PORT, () => {
  console.log(`Route test server running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log(`GET  http://localhost:${PORT}/api/reviews/product/1`);
  console.log(`POST http://localhost:${PORT}/api/reviews/product/1`);
  console.log(`GET  http://localhost:${PORT}/test`);
  
  // Test the routes
  setTimeout(() => {
    console.log('\nTesting routes...');
    
    // Test GET route
    fetch(`http://localhost:${PORT}/api/reviews/product/1`)
      .then(res => {
        console.log(`GET /api/reviews/product/1: ${res.status} ${res.statusText}`);
        return res.text();
      })
      .then(text => console.log('Response:', text.substring(0, 100) + '...'))
      .catch(err => console.log('GET Error:', err.message));
      
  }, 1000);
});
