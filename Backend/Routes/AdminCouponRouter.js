const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../Middlewares/Auth');
const { ensureAdmin } = require('../Middlewares/AdminAuth');
const {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
  getCouponStats,
  getDashboardAnalytics
} = require('../Controllers/AdminCouponController');

/**
 * Admin Coupon Management Routes
 * All routes require admin authentication
 */

/**
 * @route   GET /admin/coupons/analytics/dashboard
 * @desc    Get dashboard analytics for all coupons
 * @access  Admin only
 */
router.get('/analytics/dashboard', ensureAuthenticated, ensureAdmin, getDashboardAnalytics);

/**
 * @route   GET /admin/coupons
 * @desc    Get all coupons with statistics
 * @access  Admin only
 * @query   status=active|inactive, type=FIRST_ORDER|MANUAL|AUTO_GENERATED
 */
router.get('/', ensureAuthenticated, ensureAdmin, getAllCoupons);

/**
 * @route   POST /admin/coupons
 * @desc    Create a new coupon
 * @access  Admin only
 * @body    { code, discountType, discountValue, minOrderValue, validFrom, validTo, usageLimit, condition, description }
 */
router.post('/', ensureAuthenticated, ensureAdmin, createCoupon);

/**
 * @route   GET /admin/coupons/:id/stats
 * @desc    Get detailed statistics for a specific coupon
 * @access  Admin only
 */
router.get('/:id/stats', ensureAuthenticated, ensureAdmin, getCouponStats);

/**
 * @route   PUT /admin/coupons/:id
 * @desc    Update coupon details
 * @access  Admin only
 */
router.put('/:id', ensureAuthenticated, ensureAdmin, updateCoupon);

/**
 * @route   PATCH /admin/coupons/:id/toggle
 * @desc    Toggle coupon active/inactive status
 * @access  Admin only
 */
router.patch('/:id/toggle', ensureAuthenticated, ensureAdmin, toggleCouponStatus);

/**
 * @route   DELETE /admin/coupons/:id
 * @desc    Delete a coupon
 * @access  Admin only
 */
router.delete('/:id', ensureAuthenticated, ensureAdmin, deleteCoupon);

module.exports = router;
