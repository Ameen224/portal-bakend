const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['software', 'hardware', 'service', 'consulting'],
    trim: true
  },
  price: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled', 'inactive', 'discontinued'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  deadline: {
    type: Date
  },
  assignedDevelopers: [{
    developerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Developer',
      required: true
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['lead', 'developer', 'tester', 'designer'],
      default: 'developer'
    }
  }],
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  budget: {
    type: Number,
    min: 0
  },
  technologies: [{
    type: String,
    trim: true
  }],
  requirements: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ status: 1, priority: 1 });
productSchema.index({ 'assignedDevelopers.developerId': 1 });

module.exports = mongoose.model('Product', productSchema);