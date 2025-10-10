const Coupon = require('../Models/Coupon');
const UserCoupon = require('../Models/UserCoupon');

/**
 * Admin Coupon Management Controller
 * Provides admin-only endpoints for managing coupons
 */

/**
 * Get All Coupons (Admin)
 * GET /admin/coupons
 */
const getAllCoupons = async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let query = {};
    
    // Filter by active status
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    // Filter by condition type
    if (type) {
      query['condition.type'] = type.toUpperCase();
    }
    
    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    
    // Get usage statistics for each coupon
    const couponsWithStats = await Promise.all(
      coupons.map(async (coupon) => {
        const totalIssued = await UserCoupon.countDocuments({ couponId: coupon._id });
        const totalUsed = await UserCoupon.countDocuments({ 
          couponId: coupon._id,
          status: 'used'
        });
        const activeUsers = await UserCoupon.countDocuments({
          couponId: coupon._id,
          status: 'active'
        });
        
        return {
          ...coupon.toObject(),
          stats: {
            totalIssued,
            totalUsed,
            activeUsers
          }
        };
      })
    );
    
    return res.status(200).json({
      success: true,
      count: couponsWithStats.length,
      coupons: couponsWithStats
    });
    
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Create New Coupon (Admin)
 * POST /admin/coupons
 */
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      validFrom,
      validTo,
      isActive,
      usageLimit,
      condition,
      description,
      maxDiscountCap
    } = req.body;
    
    // Validation
    if (!code || !discountType || !discountValue || validTo === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: code, discountType, discountValue, validTo'
      });
    }
    
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }
    
    // Create new coupon
    const newCoupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      validFrom: validFrom || new Date(),
      validTo,
      isActive: isActive !== undefined ? isActive : true,
      usageLimit: usageLimit || 1,
      condition: condition || { type: 'MANUAL', value: 0 },
      description: description || '',
      maxDiscountCap: maxDiscountCap || null
    });
    
    await newCoupon.save();
    
    return res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon: newCoupon
    });
    
  } catch (error) {
    console.error('Error creating coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update Coupon (Admin)
 * PUT /admin/coupons/:id
 */
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Don't allow changing the code
    delete updateData.code;
    
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedCoupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      coupon: updatedCoupon
    });
    
  } catch (error) {
    console.error('Error updating coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Toggle Coupon Active Status (Admin)
 * PATCH /admin/coupons/:id/toggle
 */
const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    
    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        isActive: coupon.isActive
      }
    });
    
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete Coupon (Admin)
 * DELETE /admin/coupons/:id
 */
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    // Also delete all user coupon records
    await UserCoupon.deleteMany({ couponId: id });
    
    return res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get Coupon Usage Statistics (Admin)
 * GET /admin/coupons/:id/stats
 */
const getCouponStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    // Get detailed statistics
    const userCoupons = await UserCoupon.find({ couponId: id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    const totalIssued = userCoupons.length;
    const totalUsed = userCoupons.filter(uc => uc.status === 'used').length;
    const activeCount = userCoupons.filter(uc => uc.status === 'active').length;
    const expiredCount = userCoupons.filter(uc => uc.status === 'expired').length;
    
    // Calculate total discount given
    let totalDiscountGiven = 0;
    userCoupons.forEach(uc => {
      uc.usageHistory.forEach(usage => {
        totalDiscountGiven += usage.discountAmount;
      });
    });
    
    return res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      stats: {
        totalIssued,
        totalUsed,
        activeCount,
        expiredCount,
        totalDiscountGiven: Math.round(totalDiscountGiven * 100) / 100,
        usageRate: totalIssued > 0 ? Math.round((totalUsed / totalIssued) * 100) : 0
      },
      recentUsage: userCoupons.slice(0, 10).map(uc => ({
        user: uc.userId ? uc.userId.name : 'Unknown',
        email: uc.userId ? uc.userId.email : 'Unknown',
        issuedAt: uc.issuedAt,
        usageCount: uc.usageCount,
        status: uc.status,
        lastUsed: uc.usageHistory.length > 0 ? uc.usageHistory[uc.usageHistory.length - 1].usedAt : null
      }))
    });
    
  } catch (error) {
    console.error('Error fetching coupon stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get Dashboard Analytics (Admin)
 * GET /admin/coupons/analytics/dashboard
 */
const getDashboardAnalytics = async (req, res) => {
  try {
    const totalCoupons = await Coupon.countDocuments({});
    const activeCoupons = await Coupon.countDocuments({ isActive: true });
    const totalIssuedCoupons = await UserCoupon.countDocuments({});
    const totalUsedCoupons = await UserCoupon.countDocuments({ status: 'used' });
    
    // Calculate total discount given across all coupons
    const allUserCoupons = await UserCoupon.find({});
    let totalDiscountGiven = 0;
    allUserCoupons.forEach(uc => {
      uc.usageHistory.forEach(usage => {
        totalDiscountGiven += usage.discountAmount;
      });
    });
    
    // Get top performing coupons
    const coupons = await Coupon.find({});
    const couponPerformance = await Promise.all(
      coupons.map(async (coupon) => {
        const usedCount = await UserCoupon.countDocuments({
          couponId: coupon._id,
          status: 'used'
        });
        
        return {
          code: coupon.code,
          usedCount,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        };
      })
    );
    
    couponPerformance.sort((a, b) => b.usedCount - a.usedCount);
    
    return res.status(200).json({
      success: true,
      analytics: {
        totalCoupons,
        activeCoupons,
        inactiveCoupons: totalCoupons - activeCoupons,
        totalIssuedCoupons,
        totalUsedCoupons,
        unusedCoupons: totalIssuedCoupons - totalUsedCoupons,
        totalDiscountGiven: Math.round(totalDiscountGiven * 100) / 100,
        overallUsageRate: totalIssuedCoupons > 0 ? 
          Math.round((totalUsedCoupons / totalIssuedCoupons) * 100) : 0
      },
      topPerformingCoupons: couponPerformance.slice(0, 5)
    });
    
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
  getCouponStats,
  getDashboardAnalytics
};
