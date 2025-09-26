const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../Middlewares/AdminAuth');
const {
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
    deleteUser,
    getAllProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    uploadProductImage
} = require('../Controllers/AdminController');

// All admin routes require authentication and admin privileges
router.use(ensureAuthenticated);
router.use(ensureAdmin);

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:orderId/status', updateOrderStatus);

// Product management
router.get('/products', getAllProducts);
router.post('/products', addProduct);
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);

// Image upload
router.post('/upload-image', uploadProductImage);

module.exports = router;
