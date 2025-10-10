const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../Middlewares/Auth');
const {
  applyCoupon,
  generateCoupon,
  getUserCoupons,
  recordCouponUsage
} = require('../Controllers/CouponController');

/**
 * @route   POST /api/coupons/apply
 * @desc    Apply coupon at checkout
 * @access  Protected
 * @body    { userId, couponCode, orderAmount }
 */
router.post('/apply', ensureAuthenticated, applyCoupon);

/**
 * @route   POST /api/coupons/generate
 * @desc    Auto-generate coupon for qualifying orders
 * @access  Protected
 * @body    { userId, orderAmount, orderId }
 */
router.post('/generate', ensureAuthenticated, generateCoupon);

/**
 * @route   GET /api/coupons/user/:userId
 * @desc    Get all available coupons for a user
 * @access  Protected
 */
router.get('/user/:userId', ensureAuthenticated, getUserCoupons);

/**
 * @route   POST /api/coupons/record-usage
 * @desc    Record coupon usage after order placement
 * @access  Protected
 * @body    { userId, couponId, orderId, discountAmount }
 */
router.post('/record-usage', ensureAuthenticated, recordCouponUsage);

module.exports = router;
