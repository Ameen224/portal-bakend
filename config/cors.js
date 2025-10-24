const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:5173", 
    "http://localhost:3000",
    "http://localhost:4173",
    "http://localhost:8000"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false
};

// For development, you can also allow all origins
const developmentCorsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
};

// Export based on environment
module.exports = process.env.NODE_ENV === 'production' ? corsOptions : corsOptions;