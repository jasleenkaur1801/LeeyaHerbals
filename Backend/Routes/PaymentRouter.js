const express = require('express');
const router = express.Router();
const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    getPaymentDetails,
    refundPayment
} = require('../Controllers/PaymentController');
const { ensureAuthenticated } = require('../Middlewares/Auth');

// Create Razorpay order
router.post('/create-order', createRazorpayOrder);

// Verify Razorpay payment - with authentication middleware
router.post('/verify-payment', ensureAuthenticated, verifyRazorpayPayment);

// Get payment details
router.get('/payment/:paymentId', getPaymentDetails);

// Refund payment
router.post('/refund/:paymentId', refundPayment);

module.exports = router;
