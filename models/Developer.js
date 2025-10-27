const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Developer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Developer email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: String,
    enum: ['junior', 'mid', 'senior', 'lead'],
    default: 'junior'
  },
  department: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'qa'],
    required: [true, 'Department is required']
  },
  salary: {
    type: Number,
    min: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  },
  assignedProjects: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Developer', developerSchema);