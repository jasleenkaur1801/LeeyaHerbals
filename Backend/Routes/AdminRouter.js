const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../Middlewares/AdminAuth');
const {
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
    deleteUser
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

module.exports = router;
