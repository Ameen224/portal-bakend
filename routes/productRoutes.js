const express = require('express');
const { 
  getAllProducts, 
  getProductById,
  addProduct,
  assignDeveloperToProduct,
  removeDeveloperFromProduct,
  updateProductStatus
} = require('../controllers/productController');
const { authMiddleware, superAdminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/products - Public route
router.get('/', getAllProducts);

// GET /api/products/:id - Public route
router.get('/:id', getProductById);

// POST /api/products - Protected route for super admin only
router.post('/', authMiddleware, superAdminMiddleware, addProduct);

// POST /api/products/:id/assign-developer - Protected route for super admin only
router.post('/:id/assign-developer', authMiddleware, superAdminMiddleware, assignDeveloperToProduct);

// DELETE /api/products/:id/remove-developer/:developerId - Protected route for super admin only
router.delete('/:id/remove-developer/:developerId', authMiddleware, superAdminMiddleware, removeDeveloperFromProduct);

// PATCH /api/products/:id/status - Protected route
router.patch('/:id/status', authMiddleware, updateProductStatus);

module.exports = router;