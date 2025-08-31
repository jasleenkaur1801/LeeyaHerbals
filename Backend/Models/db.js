const mongoose = require('mongoose');

// Use environment variable or default to local MongoDB
const mongo_url = process.env.MONGO_CONN || "mongodb://127.0.0.1:27017/auth-db";

mongoose.connect(mongo_url)
.then(()=>{
    console.log("Mongo db connected...");
})
.catch((err)=>{
    console.log("Mongo db connection error: ",err);
});
