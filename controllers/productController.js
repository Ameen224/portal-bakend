const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select('name description type price status createdAt')
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

// @desc    Add new product
// @route   POST /api/products
// @access  Protected (Super Admin only)
const addProduct = async (req, res) => {
  try {
    const { name, description, type, price } = req.body;

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

    // Create new product
    const product = new Product({
      name,
      description,
      type,
      price: price || 0
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: {
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          type: product.type,
          price: product.price,
          status: product.status,
          createdAt: product.createdAt
        }
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

module.exports = {
  getAllProducts,
  addProduct
};