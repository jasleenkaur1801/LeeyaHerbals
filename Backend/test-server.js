// Simple test to check if server starts properly
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!', 
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    env: {
      PORT: process.env.PORT,
      FRONTEND_URL: process.env.FRONTEND_URL,
      STRIPE_KEY_EXISTS: !!process.env.STRIPE_SECRET_KEY
    }
  });
});

// Simple Stripe test
app.post('/api/test-stripe', async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Test Product',
          },
          unit_amount: 100000, // ₹1000 in paise
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe test error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});
