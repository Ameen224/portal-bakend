const Client = require('../models/Client');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Protected (Super Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalClients = await Client.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // Get recent activities (last 10 clients and products)
    const recentClients = await Client.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type createdAt');

    // Get client status breakdown
    const clientStatusStats = await Client.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get product type breakdown
    const productTypeStats = await Product.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        overview: {
          totalClients,
          totalProducts,
          totalUsers
        },
        recentActivities: {
          recentClients,
          recentProducts
        },
        statistics: {
          clientsByStatus: clientStatusStats,
          productsByType: productTypeStats
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
};

module.exports = {
  getDashboardStats
};