const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');
const { verifyToken } = require('../Middlewares/Auth');

// Create a new order
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('=== ORDER CREATION API CALLED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User from token:', req.user);
    
    const { 
      orderId, 
      paymentMethod, 
      paymentStatus,
      subtotal, 
      shipping, 
      total, 
      items, 
      address,
      status 
    } = req.body;
    
    const userId = req.user._id;
    console.log('Creating order for userId:', userId);
    
    // Generate orderId if not provided
    const finalOrderId = orderId || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const order = new Order({
      userId,
      orderId: finalOrderId,
      paymentMethod,
      paymentStatus: paymentStatus || 'completed',
      subtotal,
      shipping: shipping || 0,
      total,
      items,
      address,
      status: status || 'placed'
    });
    
    await order.save();
    console.log('=== ORDER SAVED SUCCESSFULLY ===');
    console.log('Order ID:', order._id);
    console.log('Order details:', JSON.stringify(order.toObject(), null, 2));
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create order', 
      details: err.message 
    });
  }
});

// Get all orders for the logged-in user
router.get('/my', verifyToken, async (req, res) => {
  try {
    console.log('=== FETCHING USER ORDERS ===');
    console.log('User from token:', req.user);
    const userId = req.user._id;
    console.log('Searching for orders with userId:', userId);
    const orders = await Order.find({ userId }).sort({ createdAt: -1, orderDate: -1 });
    console.log('Found orders:', orders.length);
    console.log('Orders:', JSON.stringify(orders, null, 2));
    res.json({
      success: true,
      orders
    });
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch orders', 
      details: err.message 
    });
  }
});

// Get a specific order by ID
router.get('/:orderId', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    
    const order = await Order.findOne({ 
      $or: [
        { orderId: orderId },
        { _id: orderId }
      ],
      userId 
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order', 
      details: err.message 
    });
  }
});

// Update order status (for admin or payment updates)
router.patch('/:orderId/status', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    
    const order = await Order.findOneAndUpdate(
      { 
        $or: [
          { orderId: orderId },
          { _id: orderId }
        ],
        userId 
      },
      updateData,
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update order', 
      details: err.message 
    });
  }
});

module.exports = router;
