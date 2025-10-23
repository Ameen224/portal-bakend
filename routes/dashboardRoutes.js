const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { authMiddleware, superAdminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/dashboard - Protected route for super admin only
router.get('/', authMiddleware, superAdminMiddleware, getDashboardStats);

module.exports = router;