/**
 * Automated Coupon Endpoint Testing Script
 * 
 * This script tests all coupon endpoints automatically
 * 
 * Prerequisites:
 * 1. Server must be running (npm start)
 * 2. You need a user account (will show you how to get one)
 * 
 * Usage: node testCouponEndpoints.js
 */

const BASE_URL = 'http://localhost:8080';

// ========================================
// CONFIGURATION - UPDATE THESE VALUES
// ========================================
const TEST_USER = {
  email: 'test@example.com',
  password: 'test123',
  name: 'Test User'
};

// ========================================
// Helper Functions
// ========================================

async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

// ========================================
// Test Functions
// ========================================

async function loginOrSignup() {
  console.log('\n📝 Step 1: Getting user credentials...\n');
  
  // Try to login first
  let result = await apiCall('/auth/login', 'POST', {
    email: TEST_USER.email,
    password: TEST_USER.password
  });
  
  if (result.data && result.data.token) {
    console.log('✅ Logged in successfully!');
    console.log(`   User: ${result.data.name || TEST_USER.name}`);
    console.log(`   Email: ${result.data.email || TEST_USER.email}`);
    return {
      token: result.data.token,
      userId: result.data._id
    };
  }
  
  // If login fails, try signup
  console.log('ℹ️  User not found. Creating test user...');
  result = await apiCall('/auth/signup', 'POST', TEST_USER);
  
  if (result.data && result.data.token) {
    console.log('✅ Test user created successfully!');
    console.log(`   User: ${TEST_USER.name}`);
    console.log(`   Email: ${TEST_USER.email}`);
    return {
      token: result.data.token,
      userId: result.data._id
    };
  }
  
  console.error('❌ Failed to login or create user:', result.data);
  console.log('\n💡 Please create a user manually:');
  console.log(`   POST ${BASE_URL}/auth/signup`);
  console.log('   Body: { "name": "Test User", "email": "test@example.com", "password": "test123" }');
  process.exit(1);
}

async function testGetAvailableCoupons(token, userId) {
  console.log('\n\n🧪 Test 2: Get Available Coupons');
  console.log('─'.repeat(50));
  
  const result = await apiCall(`/api/coupons/user/${userId}`, 'GET', null, token);
  
  if (result.data && result.data.success) {
    console.log(`✅ SUCCESS: Found ${result.data.count} available coupons`);
    result.data.coupons.forEach(coupon => {
      console.log(`\n   📌 ${coupon.code}`);
      console.log(`      Type: ${coupon.discountType}`);
      console.log(`      Value: ${coupon.discountType === 'PERCENT' ? coupon.discountValue + '%' : '₹' + coupon.discountValue}`);
      console.log(`      Min Order: ₹${coupon.minOrderValue}`);
      console.log(`      Available For: ${coupon.availableFor || 'all'}`);
    });
    return true;
  } else {
    console.log('❌ FAILED:', result.data?.message || result.error);
    return false;
  }
}

async function testApplyWelcome10(token, userId) {
  console.log('\n\n🧪 Test 3: Apply WELCOME10 Coupon');
  console.log('─'.repeat(50));
  
  const result = await apiCall('/api/coupons/apply', 'POST', {
    userId,
    couponCode: 'WELCOME10',
    orderAmount: 1500
  }, token);
  
  if (result.data && result.data.success) {
    console.log('✅ SUCCESS: WELCOME10 applied!');
    console.log(`\n   Original Amount: ₹${result.data.data.originalAmount}`);
    console.log(`   Discount: ₹${result.data.data.discountAmount} (${result.data.data.discountValue}%)`);
    console.log(`   Final Amount: ₹${result.data.data.finalAmount}`);
    console.log(`   💰 Saved: ₹${result.data.data.discountAmount}`);
    return true;
  } else {
    console.log('❌ FAILED:', result.data?.message || result.error);
    console.log('   (This is normal if user already has orders)');
    return false;
  }
}

async function testApplyFlat150(token, userId) {
  console.log('\n\n🧪 Test 4: Apply FLAT150 Coupon');
  console.log('─'.repeat(50));
  
  const result = await apiCall('/api/coupons/apply', 'POST', {
    userId,
    couponCode: 'FLAT150',
    orderAmount: 2000
  }, token);
  
  if (result.data && result.data.success) {
    console.log('✅ SUCCESS: FLAT150 applied!');
    console.log(`\n   Original Amount: ₹${result.data.data.originalAmount}`);
    console.log(`   Discount: ₹${result.data.data.discountAmount}`);
    console.log(`   Final Amount: ₹${result.data.data.finalAmount}`);
    console.log(`   💰 Saved: ₹${result.data.data.discountAmount}`);
    return true;
  } else {
    console.log('❌ FAILED:', result.data?.message || result.error);
    return false;
  }
}

async function testGenerateThankyou200(token, userId) {
  console.log('\n\n🧪 Test 5: Generate THANKYOU200 (Auto-coupon)');
  console.log('─'.repeat(50));
  console.log('   Simulating order of ₹2500...');
  
  const result = await apiCall('/api/coupons/generate', 'POST', {
    userId,
    orderAmount: 2500,
    orderId: 'TEST_' + Date.now()
  }, token);
  
  if (result.data && result.data.success) {
    if (result.data.couponsGenerated.length > 0) {
      console.log('✅ SUCCESS: Coupon auto-generated!');
      result.data.couponsGenerated.forEach(coupon => {
        console.log(`\n   🎉 Earned: ${coupon.code}`);
        console.log(`      Discount: ₹${coupon.discountValue}`);
        console.log(`      Min Order: ₹${coupon.minOrderValue}`);
        console.log(`      Valid Until: ${new Date(coupon.validTo).toLocaleDateString()}`);
      });
      return true;
    } else {
      console.log('ℹ️  No new coupons generated (user already has this coupon)');
      return true;
    }
  } else {
    console.log('❌ FAILED:', result.data?.message || result.error);
    return false;
  }
}

async function testApplyThankyou200(token, userId) {
  console.log('\n\n🧪 Test 6: Apply THANKYOU200 Coupon');
  console.log('─'.repeat(50));
  
  const result = await apiCall('/api/coupons/apply', 'POST', {
    userId,
    couponCode: 'THANKYOU200',
    orderAmount: 1200
  }, token);
  
  if (result.data && result.data.success) {
    console.log('✅ SUCCESS: THANKYOU200 applied!');
    console.log(`\n   Original Amount: ₹${result.data.data.originalAmount}`);
    console.log(`   Discount: ₹${result.data.data.discountAmount}`);
    console.log(`   Final Amount: ₹${result.data.data.finalAmount}`);
    console.log(`   💰 Saved: ₹${result.data.data.discountAmount}`);
    return true;
  } else {
    console.log('❌ FAILED:', result.data?.message || result.error);
    console.log('   (User needs to earn this coupon first via Test 5)');
    return false;
  }
}

async function testValidation(token, userId) {
  console.log('\n\n🧪 Test 7: Validation - Minimum Order Not Met');
  console.log('─'.repeat(50));
  console.log('   Trying FLAT150 with only ₹1000 order...');
  
  const result = await apiCall('/api/coupons/apply', 'POST', {
    userId,
    couponCode: 'FLAT150',
    orderAmount: 1000
  }, token);
  
  if (result.data && !result.data.success) {
    console.log('✅ VALIDATION WORKING: Correctly rejected!');
    console.log(`   Error: ${result.data.message}`);
    return true;
  } else {
    console.log('❌ VALIDATION FAILED: Should have been rejected');
    return false;
  }
}

// ========================================
// Main Test Runner
// ========================================

async function runAllTests() {
  console.log('\n');
  console.log('═'.repeat(60));
  console.log('🧪  COUPON SYSTEM - AUTOMATED ENDPOINT TESTING');
  console.log('═'.repeat(60));
  
  try {
    // Check if server is running
    console.log('\n🔍 Checking if server is running...');
    const pingResult = await apiCall('/ping', 'GET');
    if (pingResult.error) {
      console.log('❌ Server is not running!');
      console.log('\n💡 Start your server first:');
      console.log('   npm start\n');
      process.exit(1);
    }
    console.log('✅ Server is running!\n');
    
    // Login or create user
    const { token, userId } = await loginOrSignup();
    
    // Run tests
    const results = {
      getAvailableCoupons: await testGetAvailableCoupons(token, userId),
      applyWelcome10: await testApplyWelcome10(token, userId),
      applyFlat150: await testApplyFlat150(token, userId),
      generateThankyou200: await testGenerateThankyou200(token, userId),
      applyThankyou200: await testApplyThankyou200(token, userId),
      validation: await testValidation(token, userId)
    };
    
    // Summary
    console.log('\n\n');
    console.log('═'.repeat(60));
    console.log('📊  TEST RESULTS SUMMARY');
    console.log('═'.repeat(60));
    
    const passed = Object.values(results).filter(r => r === true).length;
    const total = Object.keys(results).length;
    
    Object.entries(results).forEach(([test, passed]) => {
      const icon = passed ? '✅' : '❌';
      console.log(`${icon} ${test}`);
    });
    
    console.log('\n' + '─'.repeat(60));
    console.log(`Total: ${passed}/${total} tests passed`);
    console.log('─'.repeat(60));
    
    if (passed === total) {
      console.log('\n🎉 ALL TESTS PASSED! Your coupon system is working perfectly!\n');
    } else {
      console.log('\n⚠️  Some tests failed. Check the details above.\n');
    }
    
  } catch (error) {
    console.error('\n❌ Error running tests:', error.message);
    console.log('\nMake sure:');
    console.log('1. Server is running (npm start)');
    console.log('2. Database is connected');
    console.log('3. Coupons are seeded (node seedCoupons.js)\n');
  }
}

// Run the tests
runAllTests();
