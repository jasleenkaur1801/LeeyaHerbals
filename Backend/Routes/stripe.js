const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');

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

// POST /api/create-checkout-session - Create Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { orderId, items, total, customerEmail } = req.body;

    console.log('Creating Stripe session with:', { orderId, items, total, customerEmail });

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not found in environment variables');
      return res.status(500).json({ error: 'Stripe configuration missing' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          description: `Weight: ${item.weight || 'N/A'}`
        },
        unit_amount: Math.round(item.price * 100), // Convert to paise
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: orderId ? orderId.toString() : 'unknown'
      },
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
      billing_address_collection: 'required',
    });

    res.json({
      success: true,
      url: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create payment session' 
    });
  }
});

// POST /api/webhook - Stripe webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      try {
        // Update order status to confirmed
        const orderId = parseInt(session.metadata.orderId);
        const userId = parseInt(session.metadata.userId);
        
        // Here you would update your database
        // For now, we'll just log it
        console.log(`Payment successful for order ${orderId}, user ${userId}`);
        console.log(`Payment amount: ₹${session.amount_total / 100}`);
        
        // In a real application, update the order status in your database
        // await updateOrderStatus(orderId, 'confirmed', session.payment_intent);
        
      } catch (error) {
        console.error('Error processing successful payment:', error);
      }
      break;

    case 'checkout.session.expired':
      const expiredSession = event.data.object;
      console.log(`Payment session expired for order ${expiredSession.metadata.orderId}`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// GET /api/payment-status/:sessionId - Check payment status
router.get('/payment-status/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.json({
      success: true,
      status: session.payment_status,
      orderId: session.metadata.orderId
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check payment status' 
    });
  }
});

module.exports = router;
