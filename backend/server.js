// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const userRoutes = require('./routes/users');
const folderRoutes = require('./routes/folders');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pinoHttp = require('pino-http');
const logger = require('./utils/logger');

// Load env vars based on environment
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const app = express();

// HTTP logger (requests/responses)
app.use(
  pinoHttp({
    logger,
    autoLogging: true,
    customLogLevel: function (res, err) {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          id: req.id,
          userId: req.user ? req.user._id || req.user.id : undefined,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  })
);

// Create uploads directory if it doesn't exist
const createUploadsDirectories = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const profileImagesDir = path.join(__dirname, 'uploads', 'profile-images');
  
  try {
    // Create main uploads directory
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      logger.info('Uploads directory created');
    }
    
    // Create profile-images subdirectory
    if (!fs.existsSync(profileImagesDir)) {
      fs.mkdirSync(profileImagesDir, { recursive: true });
      logger.info('Profile images directory created');
    }
    
    logger.info('Upload directories are ready');
  } catch (error) {
    logger.error({ err: error }, 'Error creating upload directories');
  }
};

// Call the function to create directories
createUploadsDirectories();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', // CRA
    'http://localhost:5173'  // Vite
  ],
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/folders', folderRoutes);

// Debug endpoint
app.get('/api/debug', (req, res) => {
    res.json({
    message: 'Server is running and routes are loaded', 
    timestamp: new Date(),
    routes: ['/api/auth', '/api/notes', '/api/users', '/api/folders'],
    uploadsPath: path.join(__dirname, 'uploads'),
    staticServing: 'Uploads directory is being served at /uploads'
  });
});

// Test uploads endpoint
app.get('/api/test-uploads', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const profileImagesDir = path.join(__dirname, 'uploads', 'profile-images');
  
  try {
    const uploadsExists = fs.existsSync(uploadsDir);
    const profileImagesExists = fs.existsSync(profileImagesDir);
    
    res.json({
      success: true,
      uploads: {
        path: uploadsDir,
        exists: uploadsExists
      },
      profileImages: {
        path: profileImagesDir,
        exists: profileImagesExists
      },
      staticServing: 'Files will be available at http://localhost:5000/uploads/profile-images/filename.jpg'
    });
  } catch (error) {
    req.log.error({ err: error }, 'Test uploads endpoint failed');
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  req.log ? req.log.error({ err }, 'Unhandled application error') : logger.error({ err }, 'Unhandled application error');
  res.status(500).json({ success: false, message: 'Server error' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.originalUrl}` 
  });
});

// Only start the server if this file is run directly (not in tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  
  // Connect to database and start server
  connectDB().then(() => {
    app.listen(PORT, () => logger.info({ port: PORT }, 'Server running'));
  }).catch(err => {
    logger.error({ err }, 'Database connection failed');
    process.exit(1);
  });
}

// Export the app for testing
module.exports = app;

// Process-level exception handlers
process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception');
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
});