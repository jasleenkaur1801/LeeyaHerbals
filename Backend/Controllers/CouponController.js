const Coupon = require('../Models/Coupon');
const UserCoupon = require('../Models/UserCoupon');
const Order = require('../Models/Order');
const User = require('../Models/User');

/**
 * Apply Coupon at Checkout
 * POST /api/coupons/apply
 * Request Body: { userId, couponCode, orderAmount }
 */
const applyCoupon = async (req, res) => {
  console.log('🎟️ Apply Coupon Request Received!');
  console.log('Request Body:', req.body);
  
  try {
    const { userId, couponCode, orderAmount } = req.body;

    console.log(`Applying coupon: ${couponCode} for user: ${userId}, amount: ₹${orderAmount}`);

    // Validation
    if (!userId || !couponCode || !orderAmount) {
      console.log('❌ Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, couponCode, orderAmount'
      });
    }

    if (orderAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order amount'
      });
    }

    // Find the coupon
    console.log('🔍 Searching for coupon:', couponCode.toUpperCase());
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    console.log('Found coupon:', coupon ? coupon.code : 'NOT FOUND');
    
    if (!coupon) {
      console.log('❌ Coupon not found in database');
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }
    
    console.log('✅ Coupon found:', coupon.code, '- Type:', coupon.discountType, '- Value:', coupon.discountValue);

    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is no longer active'
      });
    }

    // Check validity dates
    const currentDate = new Date();
    if (currentDate < coupon.validFrom || currentDate > coupon.validTo) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired or is not yet valid'
      });
    }

    // Check minimum order value
    if (orderAmount < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
      });
    }

    // Check user-specific conditions
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // For FIRST_ORDER condition
    if (coupon.condition.type === 'FIRST_ORDER') {
      const previousOrders = await Order.countDocuments({ userId });
      if (previousOrders > 0) {
        return res.status(400).json({
          success: false,
          message: 'This coupon is valid only for first-time orders'
        });
      }
    }

    // For AUTO_GENERATED coupons (like THANKYOU200)
    if (coupon.condition.type === 'AUTO_GENERATED') {
      // Check if user has this coupon issued to them
      const userCoupon = await UserCoupon.findOne({
        userId,
        couponId: coupon._id,
        status: 'active'
      });

      if (!userCoupon) {
        return res.status(400).json({
          success: false,
          message: 'You do not have this coupon. Complete qualifying orders to earn it!'
        });
      }

      // Check usage limit
      if (userCoupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: 'You have already used this coupon the maximum number of times'
        });
      }
    }

    // For MANUAL coupons, check usage limit per user
    if (coupon.condition.type === 'MANUAL') {
      const userCoupon = await UserCoupon.findOne({
        userId,
        couponId: coupon._id
      });

      if (userCoupon && userCoupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: `You can only use this coupon ${coupon.usageLimit} time(s)`
        });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    
    if (coupon.discountType === 'PERCENT') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      
      // Apply max discount cap if exists
      if (coupon.maxDiscountCap && discountAmount > coupon.maxDiscountCap) {
        discountAmount = coupon.maxDiscountCap;
      }
    } else if (coupon.discountType === 'FLAT') {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed order amount
    if (discountAmount > orderAmount) {
      discountAmount = orderAmount;
    }

    // Calculate final amount
    const finalAmount = orderAmount - discountAmount;

    // Return success response with discount details
    return res.status(200).json({
      success: true,
      message: 'Coupon applied successfully!',
      data: {
        couponCode: coupon.code,
        couponId: coupon._id,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        originalAmount: orderAmount,
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100,
        description: coupon.description || `${coupon.discountType === 'PERCENT' ? coupon.discountValue + '% OFF' : '₹' + coupon.discountValue + ' OFF'}`
      }
    });

  } catch (error) {
    console.error('Error applying coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Auto-Generate Coupon for User
 * POST /api/coupons/generate
 * Request Body: { userId, orderAmount, orderId }
 * 
 * This endpoint is called after order placement to check if user qualifies
 * for any auto-generated coupons (like THANKYOU200 for orders above ₹2000)
 */
const generateCoupon = async (req, res) => {
  try {
    const { userId, orderAmount, orderId } = req.body;

    // Validation
    if (!userId || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, orderAmount'
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find auto-generated coupons with SPENT_OVER condition
    const eligibleCoupons = await Coupon.find({
      isActive: true,
      'condition.type': 'AUTO_GENERATED',
      'condition.value': { $lte: orderAmount }
    });

    if (eligibleCoupons.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No coupons earned from this order',
        couponsGenerated: []
      });
    }

    const generatedCoupons = [];

    for (const coupon of eligibleCoupons) {
      // Check if user already has this coupon
      const existingUserCoupon = await UserCoupon.findOne({
        userId,
        couponId: coupon._id
      });

      if (!existingUserCoupon) {
        // Issue the coupon to the user
        const userCoupon = new UserCoupon({
          userId,
          couponId: coupon._id,
          couponCode: coupon.code,
          status: 'active'
        });

        await userCoupon.save();

        generatedCoupons.push({
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderValue: coupon.minOrderValue,
          validTo: coupon.validTo,
          description: coupon.description
        });

        console.log(`Generated coupon ${coupon.code} for user ${userId}`);
      }
    }

    if (generatedCoupons.length > 0) {
      return res.status(200).json({
        success: true,
        message: `Congratulations! You've earned ${generatedCoupons.length} coupon(s)!`,
        couponsGenerated: generatedCoupons
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'You already have these coupons',
        couponsGenerated: []
      });
    }

  } catch (error) {
    console.error('Error generating coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get All Available Coupons for a User
 * GET /api/coupons/user/:userId
 */
const getUserCoupons = async (req, res) => {
  try {
    const { userId } = req.params;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentDate = new Date();

    // Get all active manual coupons available to everyone
    const manualCoupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: currentDate },
      validTo: { $gte: currentDate },
      'condition.type': 'MANUAL'
    }).select('-__v');

    // Get first order coupons if user has no orders
    const orderCount = await Order.countDocuments({ userId });
    let firstOrderCoupons = [];
    
    if (orderCount === 0) {
      firstOrderCoupons = await Coupon.find({
        isActive: true,
        validFrom: { $lte: currentDate },
        validTo: { $gte: currentDate },
        'condition.type': 'FIRST_ORDER'
      }).select('-__v');
    }

    // Get user-specific auto-generated coupons
    const userCoupons = await UserCoupon.find({
      userId,
      status: 'active'
    }).populate('couponId');

    const autoGeneratedCoupons = userCoupons
      .filter(uc => uc.couponId && uc.couponId.isActive)
      .filter(uc => {
        const coupon = uc.couponId;
        return currentDate >= coupon.validFrom && currentDate <= coupon.validTo;
      })
      .filter(uc => uc.usageCount < uc.couponId.usageLimit)
      .map(uc => ({
        ...uc.couponId.toObject(),
        usageCount: uc.usageCount,
        usageLimit: uc.couponId.usageLimit,
        remainingUses: uc.couponId.usageLimit - uc.usageCount
      }));

    // Combine all available coupons
    const allCoupons = [
      ...manualCoupons.map(c => ({
        ...c.toObject(),
        availableFor: 'all',
        remainingUses: null
      })),
      ...firstOrderCoupons.map(c => ({
        ...c.toObject(),
        availableFor: 'first_order',
        remainingUses: null
      })),
      ...autoGeneratedCoupons.map(c => ({
        ...c,
        availableFor: 'earned'
      }))
    ];

    return res.status(200).json({
      success: true,
      count: allCoupons.length,
      coupons: allCoupons
    });

  } catch (error) {
    console.error('Error fetching user coupons:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Record Coupon Usage After Order Placement
 * POST /api/coupons/record-usage
 * Request Body: { userId, couponId, orderId, discountAmount }
 * 
 * This should be called after successful order placement
 */
const recordCouponUsage = async (req, res) => {
  try {
    const { userId, couponId, orderId, discountAmount } = req.body;

    if (!userId || !couponId || !orderId || discountAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Find or create user coupon record
    let userCoupon = await UserCoupon.findOne({
      userId,
      couponId
    });

    if (!userCoupon) {
      userCoupon = new UserCoupon({
        userId,
        couponId,
        couponCode: coupon.code,
        usageCount: 0,
        status: 'active'
      });
    }

    // Add usage history
    userCoupon.usageHistory.push({
      orderId,
      usedAt: new Date(),
      discountAmount
    });

    userCoupon.usageCount += 1;

    // Update status if usage limit reached
    if (userCoupon.usageCount >= coupon.usageLimit) {
      userCoupon.status = 'used';
    }

    await userCoupon.save();

    return res.status(200).json({
      success: true,
      message: 'Coupon usage recorded successfully'
    });

  } catch (error) {
    console.error('Error recording coupon usage:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  applyCoupon,
  generateCoupon,
  getUserCoupons,
  recordCouponUsage
};
