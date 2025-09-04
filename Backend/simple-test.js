require('dotenv').config();
console.log('Environment variables loaded:');
console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('PORT:', process.env.PORT);

if (process.env.STRIPE_SECRET_KEY) {
  console.log('Stripe key starts with:', process.env.STRIPE_SECRET_KEY.substring(0, 20) + '...');
  
  // Test Stripe initialization
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('Stripe initialized successfully');
  } catch (error) {
    console.error('Stripe initialization failed:', error.message);
  }
} else {
  console.error('STRIPE_SECRET_KEY not found!');
}
