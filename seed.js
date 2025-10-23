const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Client = require('./models/Client');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Client.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data...');

    // Create Super Admin User
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'admin@clientportal.com',
      password: 'admin123',
      role: 'super_admin'
    });
    await superAdmin.save();
    console.log('Super Admin created');

    // Create sample clients
    const clients = [
      {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        projects: ['Website Redesign', 'Mobile App Development']
      },
      {
        name: 'Tech Solutions Inc',
        email: 'info@techsolutions.com',
        projects: ['Cloud Migration', 'Security Audit']
      },
      {
        name: 'Digital Marketing Pro',
        email: 'hello@digitalmarketing.com',
        projects: ['SEO Optimization', 'Social Media Management']
      },
      {
        name: 'StartupXYZ',
        email: 'team@startupxyz.com',
        projects: ['MVP Development']
      }
    ];

    await Client.insertMany(clients);
    console.log('Sample clients created');

    // Create sample products
    const products = [
      {
        name: 'Web Development Package',
        description: 'Complete web development solution with modern technologies',
        type: 'software',
        price: 5000
      },
      {
        name: 'Mobile App Development',
        description: 'Cross-platform mobile application development',
        type: 'software',
        price: 8000
      },
      {
        name: 'Cloud Infrastructure Setup',
        description: 'Complete cloud infrastructure setup and configuration',
        type: 'service',
        price: 3000
      },
      {
        name: 'Security Consulting',
        description: 'Comprehensive security audit and consulting services',
        type: 'consulting',
        price: 2500
      },
      {
        name: 'Server Hardware',
        description: 'High-performance server hardware for enterprise needs',
        type: 'hardware',
        price: 15000
      }
    ];

    await Product.insertMany(products);
    console.log('Sample products created');

    console.log('\n=== SEEDING COMPLETED ===');
    console.log('Super Admin Login Credentials:');
    console.log('Email: admin@clientportal.com');
    console.log('Password: admin123');
    console.log('\nSample data created:');
    console.log(`- ${clients.length} clients`);
    console.log(`- ${products.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();