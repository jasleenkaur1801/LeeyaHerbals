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
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AuthRouter = require('./Routes/AuthRouter');
const OrderRouter = require('./Routes/OrderRouter');
const ProductRouter = require('./Routes/ProductRouter');
const AdminRouter = require('./Routes/AdminRouter');
const PaymentRouter = require('./Routes/PaymentRouter');
const OTPRouter = require('./Routes/OTPRouter');
const ProductReviewRouter = require('./Routes/ProductReviewRouter');

const PORT = process.env.PORT || 8080;
require('./Models/db');

app.get("/ping",(req,res)=>{
    res.send("hello");
});

app.use(bodyParser.json());
// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-deployed-website.netlify.app', 'https://your-custom-domain.com'] // Replace with your actual frontend URLs
    : ['http://localhost:3000', 'http://localhost:5173'], // Development URLs
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/auth', AuthRouter);
app.use('/api/orders', OrderRouter);
app.use('/products', ProductRouter);
app.use('/admin', AdminRouter);
app.use('/api/payment', PaymentRouter);
app.use('/api/otp', OTPRouter);

// Import ProductReview model
const ProductReview = require('./Models/ProductReview');

// Add review routes that match frontend expectations
app.get('/api/reviews/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    console.log(`GET reviews for product ${productId}, page ${page}`);
    
    // Get reviews from database
    const productReviews = await ProductReview.find({ 
      productId: productId,
      status: 'approved'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
    // Get total count
    const totalReviews = await ProductReview.countDocuments({ 
      productId: productId,
      status: 'approved'
    });
    
    // Get stats using the model's static method
    const stats = await ProductReview.getProductStats(productId);
    
    console.log(`Found ${productReviews.length} reviews for product ${productId}`);
    
    res.json({
      success: true,
      reviews: productReviews,
      stats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasMore: page < Math.ceil(totalReviews / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Configure multer for handling FormData with file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/reviews';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow both images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// Add authentication middleware for review submission
const { ensureAuthenticated } = require('./Middlewares/Auth');

app.post('/api/reviews/product/:productId', ensureAuthenticated, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'videos', maxCount: 2 }
]), async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const user = req.user; // From JWT token
    
    // Handle uploaded files
    const images = req.files?.images || [];
    const videos = req.files?.videos || [];
    
    console.log('Review submission:', { 
      productId, 
      rating, 
      comment, 
      imageCount: images.length,
      videoCount: videos.length,
      user: user.name 
    });
    
    // Basic validation
    if (!rating || !comment) {
      console.log('Validation failed:', { rating: !!rating, comment: !!comment });
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Process uploaded files
    const imageUrls = images.map(file => `/uploads/reviews/${file.filename}`);
    const videoUrls = videos.map(file => `/uploads/reviews/${file.filename}`);
    
    // Create review object with real user data
    const reviewData = {
      productId,
      userId: user._id,
      userName: user.name || 'Anonymous User',
      userEmail: user.email,
      rating: parseInt(rating),
      comment: comment.trim(),
      images: imageUrls,
      videos: videoUrls,
      helpfulCount: 0,
      isVerified: true,
      status: 'approved'
    };
    
    // Save review to database
    const review = new ProductReview(reviewData);
    await review.save();
    
    console.log(`Review saved to database for product ${productId} by ${user.name}:`, review._id);
    
    // Return success response
    res.json({
      success: true,
      message: 'Review submitted successfully!',
      review: {
        _id: review._id,
        productId: review.productId,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        images: review.images,
        videos: review.videos,
        helpfulCount: review.helpfulCount,
        isVerified: review.isVerified,
        createdAt: review.createdAt
      }
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

// Mark review as helpful
app.post('/api/reviews/:reviewId/helpful', ensureAuthenticated, async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    console.log(`Marking review ${reviewId} as helpful`);
    
    // Update helpful count in database
    const review = await ProductReview.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Marked as helpful',
      helpfulCount: review.helpfulCount
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.use('/api', ProductReviewRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
});
