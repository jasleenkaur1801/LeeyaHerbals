const UserModel = require('../Models/User');
const Order = require('../Models/Order');
const Product = require('../Models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
        }
    }
});

// Get all users for admin dashboard
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 });
        
        const userStats = {
            totalUsers: users.length,
            newUsersThisMonth: users.filter(user => {
                const userDate = new Date(user.createdAt);
                const currentDate = new Date();
                return userDate.getMonth() === currentDate.getMonth() && 
                       userDate.getFullYear() === currentDate.getFullYear();
            }).length
        };

        res.status(200).json({
            success: true,
            users,
            stats: userStats
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Get all orders for admin dashboard
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email phone')
            .sort({ placedAt: -1 });

        const orderStats = {
            totalOrders: orders.length,
            pendingOrders: orders.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled').length,
            completedOrders: orders.filter(order => order.status === 'Delivered').length,
            cancelledOrders: orders.filter(order => order.status === 'Cancelled').length,
            totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
        };

        res.status(200).json({
            success: true,
            orders,
            stats: orderStats
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status', 
                success: false 
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('userId', 'name email phone');

        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found', 
                success: false 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments({ role: 'user' });
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ 
            status: { $nin: ['Delivered', 'Cancelled'] } 
        });
        
        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        // Monthly stats
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const monthlyUsers = await UserModel.countDocuments({
            role: 'user',
            createdAt: {
                $gte: new Date(currentYear, currentMonth, 1),
                $lt: new Date(currentYear, currentMonth + 1, 1)
            }
        });

        const monthlyOrders = await Order.countDocuments({
            placedAt: {
                $gte: new Date(currentYear, currentMonth, 1),
                $lt: new Date(currentYear, currentMonth + 1, 1)
            }
        });

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    placedAt: {
                        $gte: new Date(currentYear, currentMonth, 1),
                        $lt: new Date(currentYear, currentMonth + 1, 1)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalOrders,
                pendingOrders,
                totalRevenue,
                monthlyUsers,
                monthlyOrders,
                monthlyRevenue: monthlyRevenue[0]?.total || 0
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found', 
                success: false 
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ 
                message: 'Cannot delete admin user', 
                success: false 
            });
        }

        await UserModel.findByIdAndDelete(userId);
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Get all products for admin dashboard
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            products
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Add new product
const addProduct = async (req, res) => {
    try {
        const { id, name, price, category, weight, image, rating, description } = req.body;

        // Validate required fields
        if (!name || !price || !category || !weight || !description) {
            return res.status(400).json({ 
                message: 'Missing required fields', 
                success: false 
            });
        }

        // Check if product ID already exists
        const existingProduct = await Product.findOne({ id });
        if (existingProduct) {
            return res.status(400).json({ 
                message: 'Product ID already exists', 
                success: false 
            });
        }

        // Create new product
        const newProduct = new Product({
            id,
            name,
            price,
            category,
            weight,
            image: image || '/placeholder-product.png',
            rating: rating || 5,
            description
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product: newProduct
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error: ' + err.message, 
                success: false 
            });
        }
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        console.log('Attempting to delete product with ID:', productId);
        
        let product;
        
        // Try to find by MongoDB ObjectId first
        if (mongoose.Types.ObjectId.isValid(productId)) {
            product = await Product.findById(productId);
        }
        
        // If not found by ObjectId, try to find by custom id field
        if (!product && !isNaN(productId)) {
            product = await Product.findOne({ id: parseInt(productId) });
        }
        
        if (!product) {
            console.log('Product not found with ID:', productId);
            return res.status(404).json({ 
                message: 'Product not found', 
                success: false 
            });
        }

        console.log('Found product:', product.name);

        // Soft delete - mark as inactive instead of removing
        await Product.findByIdAndUpdate(product._id, { isActive: false });
        
        console.log('Product marked as inactive');
        
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ 
            message: 'Internal server error: ' + err.message, 
            success: false 
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;

        console.log('Attempting to update product with ID:', productId);

        let product;
        
        // Try to find and update by MongoDB ObjectId first
        if (mongoose.Types.ObjectId.isValid(productId)) {
            product = await Product.findByIdAndUpdate(
                productId,
                updateData,
                { new: true, runValidators: true }
            );
        }
        
        // If not found by ObjectId, try to find by custom id field
        if (!product && !isNaN(productId)) {
            product = await Product.findOneAndUpdate(
                { id: parseInt(productId) },
                updateData,
                { new: true, runValidators: true }
            );
        }

        if (!product) {
            console.log('Product not found with ID:', productId);
            return res.status(404).json({ 
                message: 'Product not found', 
                success: false 
            });
        }

        console.log('Product updated:', product.name);

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error: ' + err.message, 
                success: false 
            });
        }
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Upload product image
const uploadProductImage = (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }
        
        // Return the image URL
        const imageUrl = `/uploads/products/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
        });
    });
};

module.exports = {
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
    deleteUser,
    getAllProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    uploadProductImage,
    upload
};
