// Script to create an admin user for Leeya Herbals
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserModel = require('./Models/User');

// Load environment variables
try {
    require('dotenv').config();
} catch (error) {
    console.log('No .env file found, using default values');
}

// Connect to MongoDB
require('./Models/db');

async function createAdminUser() {
    try {
        // Check if admin already exists
        const existingAdmin = await UserModel.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Admin user details
        const adminData = {
            name: 'Leeya Admin',
            email: 'admin@leeyaherbals.com',
            password: 'admin123', // This will be hashed
            role: 'admin',
            phone: '+91-90000-00000',
            address: 'Mumbai, India'
        };

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Create admin user
        const adminUser = new UserModel({
            ...adminData,
            password: hashedPassword
        });

        await adminUser.save();

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Password:', 'admin123');
        console.log('');
        console.log('You can now login to the admin panel at: http://localhost:3000/admin');
        console.log('');
        console.log('⚠️  Please change the default password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

// Run the script
createAdminUser();
