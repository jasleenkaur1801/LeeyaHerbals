const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Coupon Model
 * Stores global coupon definitions with validation rules and conditions
 */
const CouponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['PERCENT', 'FLAT'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderValue: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validTo: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: 1,
    min: 1,
    description: 'Maximum number of times a user can use this coupon'
  },
  condition: {
    type: {
      type: String,
      enum: ['FIRST_ORDER', 'SPENT_OVER', 'MANUAL', 'AUTO_GENERATED'],
      required: true
    },
    value: {
      type: Number,
      default: 0,
      description: 'For SPENT_OVER condition, this is the minimum spent amount'
    }
  },
  description: {
    type: String,
    default: ''
  },
  maxDiscountCap: {
    type: Number,
    default: null,
    description: 'Maximum discount amount for PERCENT type coupons'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster lookups
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, validFrom: 1, validTo: 1 });

const Coupon = mongoose.model('Coupon', CouponSchema);
module.exports = Coupon;
