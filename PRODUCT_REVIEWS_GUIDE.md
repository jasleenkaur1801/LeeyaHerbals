# 🌟 Product Reviews & Ratings System

A comprehensive product review system with star ratings, text comments, and video uploads for the Leeya Herbals e-commerce platform.

## ✨ Features Overview

### 🎯 Core Functionality
- **Star Rating System**: 1-5 star ratings with interactive hover effects
- **Text Reviews**: Rich comment system with 1000 character limit
- **Video Reviews**: Upload and playback video reviews (100MB limit)
- **User Authentication**: Secure review submission with JWT tokens
- **Review Statistics**: Average ratings and rating distribution
- **Helpful Voting**: Mark reviews as helpful
- **Responsive Design**: Mobile-first responsive layout

### 🔒 Security Features
- JWT authentication required for review submission
- Duplicate review prevention (one review per user per product)
- File type validation for video uploads
- XSS protection and input sanitization
- Rate limiting and spam protection

## 🏗️ System Architecture

### Backend Components

#### 1. Database Model (`ProductReview.js`)
```javascript
{
  productId: String,        // Product identifier
  userId: ObjectId,         // User reference
  userName: String,         // User display name
  userEmail: String,        // User email (private)
  rating: Number,           // 1-5 star rating
  comment: String,          // Review text (max 1000 chars)
  videoUrl: String,         // Video file path
  videoFileName: String,    // Original filename
  isVerified: Boolean,      // Verification status
  helpfulCount: Number,     // Helpful votes count
  status: String,           // pending/approved/rejected
  timestamps: true          // createdAt, updatedAt
}
```

#### 2. API Endpoints
- `GET /api/products/:productId/reviews` - Get product reviews (public)
- `POST /api/products/:productId/reviews` - Submit review (authenticated)
- `GET /api/my-reviews` - Get user's reviews (authenticated)
- `PUT /api/reviews/:reviewId` - Update review (authenticated)
- `DELETE /api/reviews/:reviewId` - Delete review (authenticated)
- `POST /api/reviews/:reviewId/helpful` - Mark as helpful (authenticated)

#### 3. File Upload System
- **Storage**: Local filesystem (`uploads/reviews/`)
- **File Types**: Video files only (mp4, avi, mov, etc.)
- **Size Limit**: 100MB per video
- **Naming**: Timestamp-based unique filenames
- **Security**: File type validation and sanitization

### Frontend Components

#### 1. ProductReviews.jsx (Main Container)
- Manages review form visibility
- Handles authentication checks
- Coordinates between form and list components

#### 2. ReviewForm.jsx (Review Submission)
- Interactive star rating system
- Text comment input with character counter
- Video upload with preview
- Form validation and error handling
- Responsive design

#### 3. ReviewList.jsx (Review Display)
- Review statistics and rating breakdown
- Paginated review listing
- Video playback functionality
- Helpful voting system
- Load more functionality

## 🚀 Installation & Setup

### Backend Setup

1. **Install Dependencies** (if needed):
   ```bash
   cd Backend
   npm install multer
   ```

2. **Create Upload Directory**:
   ```bash
   mkdir -p uploads/reviews
   ```

3. **Start Backend Server**:
   ```bash
   npm start
   ```

### Frontend Setup

1. **No additional dependencies required** - Uses existing React setup

2. **Start Frontend**:
   ```bash
   cd Frontend
   npm start
   ```

## 📱 Usage Guide

### For Customers

#### Writing a Review
1. **Navigate to Product Page**: Go to any product detail page
2. **Click "Write a Review"**: Button appears in Reviews section
3. **Login Required**: System will prompt for authentication
4. **Fill Review Form**:
   - Select star rating (1-5 stars)
   - Write detailed comment (10-1000 characters)
   - Upload video review (optional, max 100MB)
5. **Submit Review**: Review appears immediately after submission

#### Viewing Reviews
1. **Product Pages**: All reviews display automatically
2. **Rating Statistics**: See average rating and distribution
3. **Video Playback**: Click play on video reviews
4. **Helpful Voting**: Mark reviews as helpful (requires login)

### For Developers

#### Adding Review System to New Products
```jsx
import ProductReviews from './components/ProductReviews';

// In your product component
<ProductReviews 
  productId={productId}
  isAuthenticated={isAuthenticated}
  onOpenAuth={onOpenAuth}
/>
```

#### Customizing Review Display
```jsx
// Custom styling
.product-reviews {
  /* Your custom styles */
}

// Custom behavior
const handleReviewSubmitted = (newReview) => {
  // Custom logic after review submission
};
```

## 🎨 Styling & Theming

### Color Palette
```css
:root {
  --primary-green: #2d5a27;    /* Herbal green */
  --secondary-green: #4a7c59;  /* Sage green */
  --star-color: #fbbf24;       /* Gold stars */
  --text-primary: #374151;     /* Dark text */
  --text-secondary: #6b7280;   /* Light text */
  --border-color: #e5e7eb;     /* Borders */
  --background: #f7faf7;       /* Light background */
}
```

### Responsive Breakpoints
- **Desktop**: ≥769px - Full layout with side-by-side elements
- **Tablet**: 768px - Stacked layout with reduced spacing
- **Mobile**: ≤480px - Single column with touch-optimized buttons

### Component Structure
```
ProductReviews/
├── ProductReviews.jsx       # Main container
├── ProductReviews.css       # Container styles
├── ReviewForm.jsx           # Review submission form
├── ReviewForm.css           # Form styles
├── ReviewList.jsx           # Review display list
└── ReviewList.css           # List styles
```

## 🔧 Configuration Options

### File Upload Settings
```javascript
// Backend/Controllers/ProductReviewController.js
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: fileFilter
});
```

### Review Validation Rules
```javascript
// Rating: 1-5 stars (required)
// Comment: 10-1000 characters (required)
// Video: Optional, max 100MB
// Duplicate prevention: One review per user per product
```

### Database Indexes
```javascript
// For optimal performance
ProductReviewSchema.index({ productId: 1, createdAt: -1 });
ProductReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Video Upload Fails
**Symptoms**: Error during video upload
**Solutions**:
- Check file size (must be < 100MB)
- Verify file type (must be video/*)
- Ensure uploads directory exists and is writable
- Check server disk space

#### 2. Reviews Not Displaying
**Symptoms**: No reviews show on product page
**Solutions**:
- Check API endpoint connectivity
- Verify productId parameter
- Check browser console for errors
- Ensure reviews exist in database

#### 3. Authentication Issues
**Symptoms**: Cannot submit reviews
**Solutions**:
- Verify JWT token in localStorage
- Check token expiration
- Ensure user is logged in
- Verify API authentication middleware

#### 4. Performance Issues
**Symptoms**: Slow loading of reviews
**Solutions**:
- Implement pagination (already included)
- Add database indexes (already included)
- Optimize video file sizes
- Use CDN for video delivery

### Debug Commands
```bash
# Check uploads directory
ls -la uploads/reviews/

# Check database reviews
db.productreviews.find({productId: "your-product-id"})

# Check server logs
tail -f server.log
```

## 📊 Analytics & Monitoring

### Key Metrics to Track
- Review submission rate
- Average rating per product
- Video upload success rate
- User engagement with reviews
- Helpful votes distribution

### Database Queries
```javascript
// Get product review statistics
const stats = await ProductReview.getProductStats(productId);

// Get top-rated products
const topRated = await ProductReview.aggregate([
  { $group: { 
    _id: "$productId", 
    avgRating: { $avg: "$rating" },
    totalReviews: { $sum: 1 }
  }},
  { $sort: { avgRating: -1 } },
  { $limit: 10 }
]);
```

## 🚀 Production Deployment

### Environment Variables
```bash
# Backend/.env
UPLOAD_MAX_SIZE=104857600  # 100MB in bytes
UPLOAD_DIR=uploads/reviews
VIDEO_QUALITY=720p
```

### Performance Optimizations
- Enable gzip compression for API responses
- Implement CDN for video file delivery
- Add database connection pooling
- Use Redis for session management
- Implement rate limiting

### Security Checklist
- [ ] File upload validation enabled
- [ ] JWT token expiration configured
- [ ] CORS settings configured
- [ ] Input sanitization enabled
- [ ] Rate limiting implemented
- [ ] HTTPS enabled in production

## 🎉 Success Indicators

### ✅ System Working When:
1. **Backend**: Server starts without errors
2. **Frontend**: Components render without console errors
3. **Reviews**: Can submit reviews with star ratings
4. **Videos**: Can upload and play video reviews
5. **Statistics**: Rating averages calculate correctly
6. **Authentication**: Login required for submissions
7. **Responsive**: Works on mobile and desktop

### 📈 Expected User Flow:
1. User visits product page
2. Scrolls to Reviews section
3. Clicks "Write a Review"
4. Logs in (if not authenticated)
5. Fills review form with rating, comment, optional video
6. Submits review successfully
7. Review appears in product reviews list
8. Other users can view and mark as helpful

## 🤝 Contributing

### Code Standards
- Use ESLint configuration
- Follow React best practices
- Write descriptive commit messages
- Add comments for complex logic
- Maintain responsive design principles

### Testing Checklist
- [ ] Test all API endpoints
- [ ] Verify file upload functionality
- [ ] Check responsive design on multiple devices
- [ ] Validate form submissions and error handling
- [ ] Test authentication flows

## 📞 Support

For issues with the review system:

1. **Check Documentation**: Review this guide first
2. **Debug Tools**: Use browser dev tools and server logs
3. **Common Issues**: Check troubleshooting section
4. **Database**: Verify data integrity and indexes

---

## 🎊 Congratulations!

Your Product Reviews & Ratings system is now fully implemented! 

### Key Benefits:
- ⭐ **Enhanced Trust**: Customer reviews build product credibility
- 🎥 **Rich Media**: Video reviews provide authentic product demos
- 📱 **Mobile Ready**: Responsive design works on all devices
- 🔒 **Secure**: JWT authentication and input validation
- 🚀 **Scalable**: Optimized for performance and growth

The system seamlessly integrates with your existing Leeya Herbals platform without disrupting current functionality. Customers can now share their experiences, helping other buyers make informed decisions about your herbal products! 🌿
