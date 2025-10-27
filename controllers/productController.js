const Product = require('../models/Product');
const Developer = require('../models/Developer');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('assignedDevelopers.developerId', 'name email department experience')
      .populate('clientId', 'name email')
      .select('name description type price status priority startDate endDate deadline progress budget technologies assignedDevelopers clientId createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        count: products.length
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('assignedDevelopers.developerId', 'name email department experience skills phone status')
      .populate('clientId', 'name email phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// @desc    Add new product
// @route   POST /api/products
// @access  Protected (Super Admin only)
const addProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      type, 
      price,
      priority,
      startDate,
      endDate,
      deadline,
      clientId,
      budget,
      technologies,
      requirements
    } = req.body;

    // Validate required fields
    if (!name || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and type are required'
      });
    }

    // Validate product type
    const validTypes = ['software', 'hardware', 'service', 'consulting'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid product type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    // Validate priority if provided
    if (priority) {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
        });
      }
    }

    // Create new product
    const product = new Product({
      name,
      description,
      type,
      price: price || 0,
      priority: priority || 'medium',
      startDate,
      endDate,
      deadline,
      clientId,
      budget: budget || 0,
      technologies: technologies || [],
      requirements: requirements || []
    });

    await product.save();

    // Populate the created product
    const populatedProduct = await Product.findById(product._id)
      .populate('assignedDevelopers.developerId', 'name email department experience')
      .populate('clientId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product: populatedProduct
      }
    });
  } catch (error) {
    console.error('Add product error:', error);
    
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
      message: 'Server error while adding product'
    });
  }
};

// @desc    Assign developer to product
// @route   POST /api/products/:id/assign-developer
// @access  Protected (Super Admin only)
const assignDeveloperToProduct = async (req, res) => {
  try {
    const { developerId, role } = req.body;
    const productId = req.params.id;

    // Validate required fields
    if (!developerId) {
      return res.status(400).json({
        success: false,
        message: 'Developer ID is required'
      });
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['lead', 'developer', 'tester', 'designer'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
        });
      }
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if developer exists
    const developer = await Developer.findById(developerId);
    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }

    // Check if developer is already assigned to this product
    const isAlreadyAssigned = product.assignedDevelopers.some(
      assignment => assignment.developerId.toString() === developerId
    );

    if (isAlreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Developer is already assigned to this product'
      });
    }

    // Add developer to product
    product.assignedDevelopers.push({
      developerId,
      role: role || 'developer',
      assignedAt: new Date()
    });

    await product.save();

    // Update developer's assigned projects
    if (!developer.assignedProjects.includes(product.name)) {
      developer.assignedProjects.push(product.name);
      await developer.save();
    }

    // Get updated product with populated data
    const updatedProduct = await Product.findById(productId)
      .populate('assignedDevelopers.developerId', 'name email department experience')
      .populate('clientId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Developer assigned to product successfully',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    console.error('Assign developer error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while assigning developer'
    });
  }
};

// @desc    Remove developer from product
// @route   DELETE /api/products/:id/remove-developer/:developerId
// @access  Protected (Super Admin only)
const removeDeveloperFromProduct = async (req, res) => {
  try {
    const { id: productId, developerId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if developer is assigned to this product
    const assignmentIndex = product.assignedDevelopers.findIndex(
      assignment => assignment.developerId.toString() === developerId
    );

    if (assignmentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Developer is not assigned to this product'
      });
    }

    // Remove developer from product
    product.assignedDevelopers.splice(assignmentIndex, 1);
    await product.save();

    // Update developer's assigned projects
    const developer = await Developer.findById(developerId);
    if (developer) {
      developer.assignedProjects = developer.assignedProjects.filter(
        projectName => projectName !== product.name
      );
      await developer.save();
    }

    // Get updated product with populated data
    const updatedProduct = await Product.findById(productId)
      .populate('assignedDevelopers.developerId', 'name email department experience')
      .populate('clientId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Developer removed from product successfully',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    console.error('Remove developer error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while removing developer'
    });
  }
};

// @desc    Update product status
// @route   PATCH /api/products/:id/status
// @access  Protected
const updateProductStatus = async (req, res) => {
  try {
    const { status, progress } = req.body;
    const productId = req.params.id;

    // Validate status if provided
    if (status) {
      const validStatuses = ['planning', 'active', 'on-hold', 'completed', 'cancelled', 'inactive', 'discontinued'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // Validate progress if provided
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('assignedDevelopers.developerId', 'name email department experience')
      .populate('clientId', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  assignDeveloperToProduct,
  removeDeveloperFromProduct,
  updateProductStatus
};