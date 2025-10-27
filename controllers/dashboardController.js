const Client = require('../models/Client');
const Product = require('../models/Product');
const User = require('../models/User');
const Developer = require('../models/Developer');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Protected (Super Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalClients = await Client.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDevelopers = await Developer.countDocuments();

    // Get recent activities (last 5 items each)
    const recentClients = await Client.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type status priority progress createdAt')
      .populate('assignedDevelopers.developerId', 'name');

    const recentDevelopers = await Developer.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name department experience createdAt');

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

    // Get developer department breakdown
    const developerDepartmentStats = await Developer.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get developer experience breakdown
    const developerExperienceStats = await Developer.aggregate([
      {
        $group: {
          _id: '$experience',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get product status breakdown (including project statuses)
    const productStatusStats = await Product.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get product priority breakdown
    const productPriorityStats = await Product.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get active products with team size
    const activeProducts = await Product.find({ status: 'active' })
      .select('name progress assignedDevelopers')
      .populate('assignedDevelopers.developerId', 'name');

    // Calculate average product progress
    const avgProgress = await Product.aggregate([
      {
        $group: {
          _id: null,
          averageProgress: { $avg: '$progress' }
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
          totalProjects: totalProducts, // Products are projects now
          totalUsers,
          totalDevelopers,
          averageProgress: avgProgress[0]?.averageProgress || 0
        },
        recentActivities: {
          recentClients,
          recentProducts,
          recentProjects: recentProducts, // Products are projects now
          recentDevelopers
        },
        statistics: {
          clientsByStatus: clientStatusStats,
          productsByType: productTypeStats,
          productsByStatus: productStatusStats,
          productsByPriority: productPriorityStats,
          projectsByStatus: productStatusStats, // For backward compatibility
          projectsByPriority: productPriorityStats, // For backward compatibility
          developersByDepartment: developerDepartmentStats,
          developersByExperience: developerExperienceStats
        },
        activeProjects: activeProducts
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