
const express = require('express');
const router = express.Router();
const Product = require('../Models/Product');

// Get all active products (public endpoint)
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        
        let query = { isActive: true };
        if (category) {
            query.category = category;
        }
        
        const products = await Product.find(query)
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            products
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Internal server error', 
            success: false 
        });
    }
});

// Get product by ID (public endpoint)
router.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findOne({ 
            $or: [{ _id: productId }, { id: productId }],
            isActive: true 
        });
        
        if (!product) {
            return res.status(404).json({ 
                message: 'Product not found', 
                success: false 
            });
        }
        
        res.status(200).json({
            success: true,
            product
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Internal server error', 
            success: false 
        });
    }
});

// Get products by category (public endpoint)
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        
        const products = await Product.find({ 
            category, 
            isActive: true 
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            products
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Internal server error', 
            success: false 
        });
    }
});

module.exports = router;
