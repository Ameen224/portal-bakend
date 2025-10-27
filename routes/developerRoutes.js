const express = require('express');
const { 
  getAllDevelopers, 
  addDeveloper, 
  getDeveloperById 
} = require('../controllers/developerController');
const { authMiddleware, superAdminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/developers - Public route
router.get('/', getAllDevelopers);

// GET /api/developers/:id - Public route
router.get('/:id', getDeveloperById);

// POST /api/developers - Protected route for super admin only
router.post('/', authMiddleware, superAdminMiddleware, addDeveloper);

module.exports = router;