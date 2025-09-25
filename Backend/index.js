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
const OrderRouter = require('./Routes/OrderRouter');
const ProductRouter = require('./Routes/ProductRouter');
const AdminRouter = require('./Routes/AdminRouter');

const PORT = process.env.PORT || 8080;
require('./Models/db');

app.get("/ping",(req,res)=>{
    res.send("hello");
});

app.use(bodyParser.json());
app.use(cors());


app.use('/auth', AuthRouter);
app.use('/api/orders', OrderRouter);
app.use('/products', ProductRouter);
app.use('/admin', AdminRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
});
