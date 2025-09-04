const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock database - replace with your actual database
let orders = [];
let orderIdCounter = 1000;

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// GET /api/orders - Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userOrders = orders.filter(order => order.userId === req.user.id);
    
    // Sort by creation date (newest first)
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      orders: userOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// POST /api/orders - Create new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, subtotal, shipping, total, paymentMethod, address, status } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Items are required' 
      });
    }

    if (!address || !address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({ 
        success: false, 
        error: 'Complete address is required' 
      });
    }

    if (!paymentMethod || !['cod', 'online'].includes(paymentMethod)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid payment method is required' 
      });
    }

    // Create new order
    const newOrder = {
      id: orderIdCounter++,
      userId: req.user.id,
      userEmail: req.user.email,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        weight: item.weight,
        image: item.image
      })),
      subtotal: Number(subtotal),
      shipping: Number(shipping),
      total: Number(total),
      paymentMethod,
      address: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: address.landmark || ''
      },
      status: status || (paymentMethod === 'cod' ? 'confirmed' : 'pending'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to orders array (in production, save to database)
    orders.push(newOrder);

    console.log('Order created successfully:', newOrder.id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create order' 
    });
  }
});

// PUT /api/orders/:id - Update order status
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const orderIndex = orders.findIndex(order => 
      order.id === orderId && order.userId === req.user.id
    );

    if (orderIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    // Update order status
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Order updated successfully',
      order: orders[orderIndex]
    });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update order' 
    });
  }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    const order = orders.find(order => 
      order.id === orderId && order.userId === req.user.id
    );

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

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch order' 
    });
  }
});

module.exports = router;
