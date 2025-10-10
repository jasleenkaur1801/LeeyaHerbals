const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * UserCoupon Model
 * Tracks which coupons are issued to specific users and their usage history
 */
const UserCouponSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  couponCode: {
    type: String,
    required: true,
    uppercase: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  usageHistory: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      },
      usedAt: {
        type: Date,
        default: Date.now
      },
      discountAmount: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    enum: ['active', 'used', 'expired'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can have only one instance of a specific coupon
UserCouponSchema.index({ userId: 1, couponId: 1 }, { unique: true });
UserCouponSchema.index({ userId: 1, status: 1 });

const UserCoupon = mongoose.model('UserCoupon', UserCouponSchema);
module.exports = UserCoupon;
