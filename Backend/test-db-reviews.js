// Test script to verify review database functionality
const mongoose = require('mongoose');
require('./Models/db'); // Connect to database
const ProductReview = require('./Models/ProductReview');

async function testReviewDatabase() {
  try {
    console.log('🔗 Testing database connection...');
    
    // Test 1: Check if we can connect
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Database connected successfully');
    } else {
      console.log('❌ Database not connected');
      return;
    }
    
    // Test 2: Count existing reviews
    const reviewCount = await ProductReview.countDocuments();
    console.log(`📊 Total reviews in database: ${reviewCount}`);
    
    // Test 3: Get reviews for a specific product
    const productReviews = await ProductReview.find({ productId: '74' });
    console.log(`📝 Reviews for product 74: ${productReviews.length}`);
    
    if (productReviews.length > 0) {
      console.log('📋 Sample review:');
      console.log({
        id: productReviews[0]._id,
        productId: productReviews[0].productId,
        userName: productReviews[0].userName,
        rating: productReviews[0].rating,
        comment: productReviews[0].comment.substring(0, 50) + '...',
        createdAt: productReviews[0].createdAt
      });
    }
    
    // Test 4: Test the stats function
    const stats = await ProductReview.getProductStats('74');
    console.log('📈 Product 74 stats:', stats);
    
    console.log('\n🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testReviewDatabase();
