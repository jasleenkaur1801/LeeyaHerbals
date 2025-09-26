const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../Models/Order');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Auth middleware is now handled in the router

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(amount * 100), // Amount in paise (multiply by 100)
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            payment_capture: 1 // Auto capture payment
        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order: razorpayOrder,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
};

// Verify Razorpay payment
const verifyRazorpayPayment = async (req, res) => {
    try {
        console.log('=== PAYMENT VERIFICATION START ===');
        console.log('Payment verification request received:', JSON.stringify(req.body, null, 2));
        
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData
        } = req.body;

        console.log('Payment details:', {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature: razorpay_signature ? 'Present' : 'Missing'
        });

        // Create signature for verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        console.log('Signature verification:', {
            expected: expectedSignature,
            received: razorpay_signature,
            match: expectedSignature === razorpay_signature
        });

        // Verify signature
        if (expectedSignature !== razorpay_signature) {
            console.log('Signature verification failed');
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed - Invalid signature'
            });
        }

        console.log('Payment verification successful');

        // Payment verified successfully, create order in database
        // Use the authenticated user's ID from the token
        console.log('Authenticated user from token:', req.user);
        const userId = req.user._id || req.user.id;
        console.log('Using userId for order:', userId);

        const newOrder = new Order({
            userId: userId,
            orderId: `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userEmail: orderData.userEmail,
            userName: orderData.userName,
            items: orderData.items,
            subtotal: orderData.totalAmount,
            shipping: 0,
            total: orderData.totalAmount,
            totalAmount: orderData.totalAmount,
            address: orderData.shippingAddress,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: 'razorpay',
            paymentStatus: 'completed',
            status: 'confirmed',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            orderStatus: 'confirmed',
            orderDate: new Date(),
            placedAt: new Date()
        });

        console.log('Attempting to save order:', JSON.stringify(newOrder.toObject(), null, 2));
        await newOrder.save();
        console.log('=== ORDER CREATED SUCCESSFULLY ===');
        console.log('Order ID:', newOrder._id);
        console.log('Order Details:', JSON.stringify(newOrder.toObject(), null, 2));

        res.status(200).json({
            success: true,
            message: 'Payment verified and order created successfully',
            orderId: newOrder._id
        });

    } catch (error) {
        console.error('Error verifying payment:', error);
        
        // Check if it's a validation error
        if (error.name === 'ValidationError') {
            console.error('Validation errors:', error.errors);
            return res.status(400).json({
                success: false,
                message: 'Order validation failed',
                errors: Object.keys(error.errors).map(key => ({
                    field: key,
                    message: error.errors[key].message
                }))
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await razorpay.payments.fetch(paymentId);

        res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment details',
            error: error.message
        });
    }
};

// Refund payment
const refundPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { amount, reason } = req.body;

        const refund = await razorpay.payments.refund(paymentId, {
            amount: amount ? Math.round(amount * 100) : undefined, // Full refund if amount not specified
            notes: {
                reason: reason || 'Refund requested by customer'
            }
        });

        res.status(200).json({
            success: true,
            refund
        });

    } catch (error) {
        console.error('Error processing refund:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process refund',
            error: error.message
        });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
    getPaymentDetails,
    refundPayment
};
