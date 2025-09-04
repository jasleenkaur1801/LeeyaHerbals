// Test script to check orders in database
const mongoose = require('mongoose');
require('./Models/db');
const Order = require('./Models/Order');
const UserModel = require('./Models/User');

async function testOrders() {
    try {
        console.log('🔍 Testing orders in database...');
        
        // Check total orders count
        const totalOrders = await Order.countDocuments();
        console.log(`📊 Total orders in database: ${totalOrders}`);
        
        // Get all orders
        const orders = await Order.find();
        console.log(`📦 Found ${orders.length} orders:`);
        
        orders.forEach((order, index) => {
            console.log(`\n--- Order ${index + 1} ---`);
            console.log(`Order ID: ${order.orderId}`);
            console.log(`User ID: ${order.userId}`);
            console.log(`Status: ${order.status}`);
            console.log(`Total: ₹${order.total}`);
            console.log(`Payment: ${order.paymentMethod}`);
            console.log(`Items: ${order.items.length}`);
            console.log(`Placed At: ${order.placedAt}`);
        });
        
        // Test with populated user data
        console.log('\n🔗 Testing with populated user data...');
        const ordersWithUsers = await Order.find().populate('userId', 'name email phone');
        console.log(`📋 Orders with user data: ${ordersWithUsers.length}`);
        
        ordersWithUsers.forEach((order, index) => {
            console.log(`\n--- Populated Order ${index + 1} ---`);
            console.log(`Order ID: ${order.orderId}`);
            console.log(`Customer: ${order.userId?.name || 'N/A'}`);
            console.log(`Email: ${order.userId?.email || 'N/A'}`);
            console.log(`Status: ${order.status}`);
            console.log(`Total: ₹${order.total}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error testing orders:', error);
        process.exit(1);
    }
}

testOrders();
