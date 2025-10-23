const express = require('express');
const { getAllClients, addClient } = require('../controllers/clientController');
const { authMiddleware, superAdminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/clients - Public route
router.get('/', getAllClients);

// POST /api/clients - Protected route for super admin only
router.post('/', authMiddleware, superAdminMiddleware, addClient);

module.exports = router;