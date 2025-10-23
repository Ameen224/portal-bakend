const express = require('express');
const { getAllProducts, addProduct } = require('../controllers/productController');
const { authMiddleware, superAdminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/products - Public route
router.get('/', getAllProducts);

// POST /api/products - Protected route for super admin only
router.post('/', authMiddleware, superAdminMiddleware, addProduct);

module.exports = router;