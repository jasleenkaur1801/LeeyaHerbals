// Load environment variables if .env file exists
try {
    require('dotenv').config();
} catch (error) {
    console.log('No .env file found, using default values');
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const orderRouter = require('./Routes/orders');
const ProductRouter = require('./Routes/ProductRouter');
const StripeRouter = require('./Routes/StripeRouter');  // ✅ merged
const AdminRouter = require('./Routes/AdminRouter');    // ✅ merged

const PORT = process.env.PORT || 8080;
require('./Models/db');

app.get("/ping",(req,res)=>{
    res.send("hello");
});

app.use(bodyParser.json());
app.use(cors());

// Stripe webhook needs raw body, so handle it before other middleware
app.use('/api/webhook', express.raw({type: 'application/json'}));

app.use('/auth', AuthRouter);
app.use('/api/orders', orderRouter);
app.use('/products', ProductRouter);
app.use('/api', StripeRouter);
app.use('/admin', AdminRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
});
