const mongoose = require('mongoose');

const ProductReviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  images: [{
    type: String,
    default: []
  }],
  videos: [{
    type: String,
    default: []
  }],
  videoUrl: {
    type: String,
    default: null
  },
  videoFileName: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, {
  timestamps: true
});

// Index for efficient queries
ProductReviewSchema.index({ productId: 1, createdAt: -1 });
ProductReviewSchema.index({ userId: 1, productId: 1 }, { unique: true }); // Prevent duplicate reviews

// Virtual for average rating calculation
ProductReviewSchema.statics.getProductStats = async function(productId) {
  const stats = await this.aggregate([
    { $match: { productId: productId, status: 'approved' } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingBreakdown: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats[0].ratingBreakdown.forEach(rating => {
    breakdown[rating]++;
  });

  return {
    averageRating: Math.round(stats[0].averageRating * 10) / 10,
    totalReviews: stats[0].totalReviews,
    ratingBreakdown: breakdown
  };
};

module.exports = mongoose.model('ProductReview', ProductReviewSchema);
