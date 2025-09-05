// Backend: Express route for Stripe Checkout
const express = require('express');
const router = express.Router();
// Check if Stripe key is configured
const stripeKey = process.env.STRIPE_SECRET_KEY;
console.log('Stripe Key configured:', !!stripeKey);

if (!stripeKey) {
  console.error('STRIPE_SECRET_KEY not found in environment variables');
}

const stripe = stripeKey ? require('stripe')(stripeKey) : null;

router.post('/create-checkout-session', async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(500).json({ 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY in environment variables.' 
      });
    }

    const { items, cart, shipping, total } = req.body;
    const itemsToProcess = items || cart;
    
    if (!itemsToProcess || !Array.isArray(itemsToProcess) || itemsToProcess.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }
    
    console.log('Processing items for Stripe:', itemsToProcess);
    
    const line_items = itemsToProcess.map(item => {
      console.log('Processing item:', item);
      return {
        price_data: {
          currency: 'inr',
          product_data: { 
            name: item.name || 'Product'
            // Removing images for now to avoid URL validation issues
            // images: item.image ? [item.image] : []
          },
          unit_amount: Math.round((item.price || 0) * 100), // Stripe expects paise
        },
        quantity: item.quantity || item.qty || 1,
      };
    });
    if (shipping > 0) {
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Shipping' },
          unit_amount: shipping * 100,
        },
        quantity: 1,
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout?payment_cancelled=true`,
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe Error Details:', err);
    res.status(500).json({ 
      error: 'Stripe error', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;
