// Backend: Express route for Stripe Checkout
const express = require('express');
const router = express.Router();
console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Set your Stripe secret key in .env

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart, shipping } = req.body;
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    const line_items = cart.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: { name: item.name },
        unit_amount: item.price * 100, // Stripe expects paise
      },
      quantity: item.quantity,
    }));
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
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?canceled=true`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe error' });
  }
});

module.exports = router;
