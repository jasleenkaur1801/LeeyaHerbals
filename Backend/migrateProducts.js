// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('./Models/Product');

// Import products from the frontend file
const { ALL_PRODUCTS } = require('../Frontend/src/products.js');

// Connect to MongoDB Atlas
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_CONN || 'mongodb://localhost:27017/leeyaherbals';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Migrate products to database
const migrateProducts = async () => {
    try {
        console.log('Starting product migration...');
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        // Insert all products
        const migratedProducts = [];
        
        for (const product of ALL_PRODUCTS) {
            try {
                const newProduct = new Product({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    weight: product.weight,
                    image: product.image,
                    rating: product.rating,
                    description: product.description,
                    isActive: true
                });
                
                await newProduct.save();
                migratedProducts.push(newProduct);
                console.log(`✓ Migrated: ${product.name}`);
            } catch (error) {
                console.error(`✗ Failed to migrate ${product.name}:`, error.message);
            }
        }
        
        console.log(`\nMigration completed!`);
        console.log(`Successfully migrated ${migratedProducts.length} out of ${ALL_PRODUCTS.length} products`);
        
        // Display summary by category
        const categoryCount = {};
        migratedProducts.forEach(product => {
            categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        });
        
        console.log('\nProducts by category:');
        Object.entries(categoryCount).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} products`);
        });
        
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
};

// Run migration
const runMigration = async () => {
    await connectDB();
    await migrateProducts();
};

// Execute if run directly
if (require.main === module) {
    runMigration().catch(console.error);
}

module.exports = { runMigration };
