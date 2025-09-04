const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');
const { verifyToken } = require('../Middlewares/Auth');

// Create a new order

router.post('/', verifyToken, async (req, res) => {
  try {
    const { orderId, placedAt, status, paymentMethod, total, items } = req.body;
    const userId = req.user._id;
    const order = new Order({
      userId,
      orderId,
      placedAt,
      status,
      paymentMethod,
      total,
      items
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// Get all orders for the logged-in user

router.get('/my', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ placedAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

module.exports = router;
