const UserModel = require('../Models/User');
const Order = require('../Models/Order');

// Get all users for admin dashboard
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 });
        
        const userStats = {
            totalUsers: users.length,
            newUsersThisMonth: users.filter(user => {
                const userDate = new Date(user.createdAt);
                const currentDate = new Date();
                return userDate.getMonth() === currentDate.getMonth() && 
                       userDate.getFullYear() === currentDate.getFullYear();
            }).length
        };

        res.status(200).json({
            success: true,
            users,
            stats: userStats
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Get all orders for admin dashboard
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email phone')
            .sort({ placedAt: -1 });

        const orderStats = {
            totalOrders: orders.length,
            pendingOrders: orders.filter(order => order.status === 'Placed').length,
            completedOrders: orders.filter(order => order.status === 'Delivered').length,
            totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
        };

        res.status(200).json({
            success: true,
            orders,
            stats: orderStats
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status', 
                success: false 
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('userId', 'name email phone');

        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found', 
                success: false 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments({ role: 'user' });
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Placed' });
        
        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        // Monthly stats
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const monthlyUsers = await UserModel.countDocuments({
            role: 'user',
            createdAt: {
                $gte: new Date(currentYear, currentMonth, 1),
                $lt: new Date(currentYear, currentMonth + 1, 1)
            }
        });

        const monthlyOrders = await Order.countDocuments({
            placedAt: {
                $gte: new Date(currentYear, currentMonth, 1),
                $lt: new Date(currentYear, currentMonth + 1, 1)
            }
        });

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    placedAt: {
                        $gte: new Date(currentYear, currentMonth, 1),
                        $lt: new Date(currentYear, currentMonth + 1, 1)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalOrders,
                pendingOrders,
                totalRevenue,
                monthlyUsers,
                monthlyOrders,
                monthlyRevenue: monthlyRevenue[0]?.total || 0
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found', 
                success: false 
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ 
                message: 'Cannot delete admin user', 
                success: false 
            });
        }

        await UserModel.findByIdAndDelete(userId);
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports = {
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
    deleteUser
};
