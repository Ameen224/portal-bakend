const Client = require('../models/Client');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .select('name email projects status createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Clients retrieved successfully',
      data: {
        clients,
        count: clients.length
      }
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching clients'
    });
  }
};

// @desc    Add new client
// @route   POST /api/clients
// @access  Protected (Super Admin only)
const addClient = async (req, res) => {
  try {
    const { name, email, projects } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if client already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Client with this email already exists'
      });
    }

    // Create new client
    const client = new Client({
      name,
      email,
      projects: projects || []
    });

    await client.save();

    res.status(201).json({
      success: true,
      message: 'Client added successfully',
      data: {
        client: {
          id: client._id,
          name: client.name,
          email: client.email,
          projects: client.projects,
          status: client.status,
          createdAt: client.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Add client error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while adding client'
    });
  }
};

module.exports = {
  getAllClients,
  addClient
};