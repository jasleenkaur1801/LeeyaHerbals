/**
 * Test Script for Coupon Feature
 * 
 * This script helps you test the coupon endpoints manually
 * Run: node testCoupons.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./Models/Coupon');
const UserCoupon = require('./Models/UserCoupon');
const User = require('./Models/User');
const Order = require('./Models/Order');

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/leeyaherbals';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Test functions
const runTests = async () => {
  try {
    console.log('\n🧪 Starting Coupon Feature Tests...\n');
    
    // Test 1: Check if coupons are seeded
    console.log('📋 Test 1: Checking seeded coupons...');
    const coupons = await Coupon.find({});
    console.log(`✅ Found ${coupons.length} coupons in database:`);
    coupons.forEach(c => {
      console.log(`   - ${c.code} (${c.discountType}: ${c.discountValue})`);
    });
    
    // Test 2: Check coupon validity
    console.log('\n📋 Test 2: Checking active coupons...');
    const currentDate = new Date();
    const activeCoupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: currentDate },
      validTo: { $gte: currentDate }
    });
    console.log(`✅ Found ${activeCoupons.length} active coupons`);
    
    // Test 3: Check for any users (for testing purposes)
    console.log('\n📋 Test 3: Checking users in database...');
    const userCount = await User.countDocuments({});
    console.log(`✅ Found ${userCount} users in database`);
    
    if (userCount > 0) {
      const sampleUser = await User.findOne({});
      console.log(`   Sample user: ${sampleUser.name} (${sampleUser.email})`);
      
      // Test 4: Check user's order count
      console.log('\n📋 Test 4: Checking user orders...');
      const orderCount = await Order.countDocuments({ userId: sampleUser._id });
      console.log(`✅ User has ${orderCount} orders`);
      
      // Test 5: Check user's coupons
      console.log('\n📋 Test 5: Checking user coupons...');
      const userCoupons = await UserCoupon.find({ userId: sampleUser._id });
      console.log(`✅ User has ${userCoupons.length} issued coupons`);
      userCoupons.forEach(uc => {
        console.log(`   - ${uc.couponCode} (Used: ${uc.usageCount} times, Status: ${uc.status})`);
      });
    } else {
      console.log('ℹ️  No users found. Create a user account to test user-specific features.');
    }
    
    // Test 6: Display coupon conditions
    console.log('\n📋 Test 6: Coupon conditions breakdown...');
    const welcome10 = await Coupon.findOne({ code: 'WELCOME10' });
    const thankyou200 = await Coupon.findOne({ code: 'THANKYOU200' });
    const flat150 = await Coupon.findOne({ code: 'FLAT150' });
    
    if (welcome10) {
      console.log('\n🎁 WELCOME10:');
      console.log(`   Condition: ${welcome10.condition.type}`);
      console.log(`   Min Order: ₹${welcome10.minOrderValue}`);
      console.log(`   Discount: ${welcome10.discountValue}%`);
      console.log(`   Max Cap: ₹${welcome10.maxDiscountCap}`);
      console.log(`   Valid Until: ${welcome10.validTo.toLocaleDateString()}`);
    }
    
    if (thankyou200) {
      console.log('\n🎁 THANKYOU200:');
      console.log(`   Condition: ${thankyou200.condition.type} (Earn when spending ₹${thankyou200.condition.value})`);
      console.log(`   Min Order (for use): ₹${thankyou200.minOrderValue}`);
      console.log(`   Discount: ₹${thankyou200.discountValue}`);
      console.log(`   Valid Until: ${thankyou200.validTo.toLocaleDateString()}`);
    }
    
    if (flat150) {
      console.log('\n🎁 FLAT150:');
      console.log(`   Condition: ${flat150.condition.type}`);
      console.log(`   Min Order: ₹${flat150.minOrderValue}`);
      console.log(`   Discount: ₹${flat150.discountValue}`);
      console.log(`   Usage Limit: ${flat150.usageLimit} times per user`);
      console.log(`   Valid Until: ${flat150.validTo.toLocaleDateString()}`);
    }
    
    console.log('\n✅ All tests completed!\n');
    console.log('📝 Next Steps:');
    console.log('   1. Start your server: npm start');
    console.log('   2. Test endpoints using Postman or cURL');
    console.log('   3. Refer to COUPON_FEATURE_README.md for API documentation\n');
    
  } catch (error) {
    console.error('❌ Error running tests:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📪 Database connection closed');
    process.exit(0);
  }
};

// Run the tests
runTests();
