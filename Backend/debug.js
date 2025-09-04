console.log('Starting debug...');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

try {
  require('dotenv').config();
  console.log('Environment variables loaded');
  console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
  console.log('PORT:', process.env.PORT);
  
  const express = require('express');
  console.log('Express loaded');
  
  const app = express();
  const PORT = process.env.PORT || 8080;
  
  app.get('/test', (req, res) => {
    res.json({ message: 'Server working!' });
  });
  
  app.listen(PORT, () => {
    console.log(`Debug server running on port ${PORT}`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}
