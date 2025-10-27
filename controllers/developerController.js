const Developer = require('../models/Developer');

// Helper function to map frontend roles to backend departments
const mapRoleToDepartment = (role) => {
  const roleMapping = {
    'Frontend Developer': 'frontend',
    'Backend Developer': 'backend',
    'Full Stack Developer': 'fullstack',
    'DevOps Engineer': 'devops',
    'UI/UX Designer': 'frontend',
    'Project Manager': 'fullstack'
  };
  return roleMapping[role] || 'fullstack';
};

// @desc    Get all developers
// @route   GET /api/developers
// @access  Public
const getAllDevelopers = async (req, res) => {
  try {
    const developers = await Developer.find()
      .select('name email phone skills experience department salary joinDate status assignedProjects createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Developers retrieved successfully',
      data: {
        developers,
        count: developers.length
      }
    });
  } catch (error) {
    console.error('Get developers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching developers'
    });
  }
};

// @desc    Add new developer
// @route   POST /api/developers
// @access  Protected (Super Admin only)
const addDeveloper = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      skills, 
      experience, 
      department,
      role, // Frontend sends role, map to department
      salary, 
      joinDate, 
      assignedProjects 
    } = req.body;

    // Map role to department if role is provided
    const finalDepartment = department || (role ? mapRoleToDepartment(role) : null);

    // Validate required fields
    if (!name || !email || !finalDepartment) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and department/role are required'
      });
    }

    // Validate department
    const validDepartments = ['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'qa'];
    if (!validDepartments.includes(finalDepartment)) {
      return res.status(400).json({
        success: false,
        message: `Invalid department. Must be one of: ${validDepartments.join(', ')}`
      });
    }

    // Validate experience level if provided
    if (experience) {
      const validExperience = ['junior', 'mid', 'senior', 'lead'];
      if (!validExperience.includes(experience)) {
        return res.status(400).json({
          success: false,
          message: `Invalid experience level. Must be one of: ${validExperience.join(', ')}`
        });
      }
    }

    // Check if developer already exists
    const existingDeveloper = await Developer.findOne({ email });
    if (existingDeveloper) {
      return res.status(400).json({
        success: false,
        message: 'Developer with this email already exists'
      });
    }

    // Create new developer
    const developer = new Developer({
      name,
      email,
      phone,
      skills: skills || [],
      experience: experience ? experience.toLowerCase() : 'junior',
      department: finalDepartment,
      salary: salary || 0,
      joinDate: joinDate || Date.now(),
      assignedProjects: assignedProjects || []
    });

    await developer.save();

    res.status(201).json({
      success: true,
      message: 'Developer added successfully',
      data: {
        developer: {
          id: developer._id,
          name: developer.name,
          email: developer.email,
          phone: developer.phone,
          skills: developer.skills,
          experience: developer.experience,
          department: developer.department,
          salary: developer.salary,
          joinDate: developer.joinDate,
          status: developer.status,
          assignedProjects: developer.assignedProjects,
          createdAt: developer.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Add developer error:', error);
    
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
      message: 'Server error while adding developer'
    });
  }
};

// @desc    Get developer by ID
// @route   GET /api/developers/:id
// @access  Public
const getDeveloperById = async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id);

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Developer retrieved successfully',
      data: {
        developer
      }
    });
  } catch (error) {
    console.error('Get developer by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid developer ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching developer'
    });
  }
};

module.exports = {
  getAllDevelopers,
  addDeveloper,
  getDeveloperById
};