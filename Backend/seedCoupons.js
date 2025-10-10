/**
 * Seed Script for Initial Coupon Data
 * Run this script to populate the database with default coupons
 * 
 * Usage: node seedCoupons.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./Models/Coupon');

// Database connection - use same variable as main app
const MONGO_URI = process.env.MONGO_CONN || process.env.MONGO_URI || 'mongodb://localhost:27017/leeyaherbals';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Define the three coupons
const coupons = [
  {
    code: 'WELCOME10',
    discountType: 'PERCENT',
    discountValue: 10,
    minOrderValue: 0,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Valid for 1 year
    isActive: true,
    usageLimit: 1,
    condition: {
      type: 'FIRST_ORDER',
      value: 0
    },
    description: '10% off on your first order! Welcome to Leeya Herbals!',
    maxDiscountCap: 500 // Maximum ₹500 discount
  },
  {
    code: 'THANKYOU200',
    discountType: 'FLAT',
    discountValue: 200,
    minOrderValue: 2000, // Changed from 999 to 2000
    validFrom: new Date(),
    validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Valid for 1 year
    isActive: true,
    usageLimit: 5, // Can be used 5 times per user
    condition: {
      type: 'MANUAL', // Changed from AUTO_GENERATED to MANUAL - always available
      value: 0
    },
    description: 'Get flat ₹200 off on orders above ₹2000',
    maxDiscountCap: null
  },
  {
    code: 'FLAT150',
    discountType: 'FLAT',
    discountValue: 150,
    minOrderValue: 1500,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Valid for 1 year
    isActive: true,
    usageLimit: 3, // Can be used up to 3 times per user
    condition: {
      type: 'MANUAL',
      value: 0
    },
    description: 'Get flat ₹150 off on orders above ₹1500',
    maxDiscountCap: null
  }
];

// Seed function
const seedCoupons = async () => {
  try {
    console.log('🌱 Starting coupon seeding process...\n');

    // Clear existing coupons (optional - comment out if you want to preserve existing data)
    const deleteResult = await Coupon.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing coupons\n`);

    // Insert new coupons
    const insertedCoupons = await Coupon.insertMany(coupons);
    
    console.log(`✅ Successfully seeded ${insertedCoupons.length} coupons:\n`);
    
    insertedCoupons.forEach((coupon, index) => {
      console.log(`${index + 1}. ${coupon.code}`);
      console.log(`   Type: ${coupon.discountType}`);
      console.log(`   Value: ${coupon.discountType === 'PERCENT' ? coupon.discountValue + '%' : '₹' + coupon.discountValue}`);
      console.log(`   Min Order: ₹${coupon.minOrderValue}`);
      console.log(`   Condition: ${coupon.condition.type}`);
      console.log(`   Valid Until: ${coupon.validTo.toLocaleDateString()}`);
      console.log(`   Description: ${coupon.description}\n`);
    });

    console.log('🎉 Coupon seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding coupons:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n📪 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedCoupons();
