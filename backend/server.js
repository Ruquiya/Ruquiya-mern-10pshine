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

dotenv.config();
connectDB();

const app = express();

// Create uploads directory if it doesn't exist
const createUploadsDirectories = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const profileImagesDir = path.join(__dirname, 'uploads', 'profile-images');
  
  try {
    // Create main uploads directory
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('📁 Uploads directory created');
    }
    
    // Create profile-images subdirectory
    if (!fs.existsSync(profileImagesDir)) {
      fs.mkdirSync(profileImagesDir, { recursive: true });
      console.log('📁 Profile images directory created');
    }
    
    console.log('✅ Upload directories are ready');
  } catch (error) {
    console.error('❌ Error creating upload directories:', error);
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
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.originalUrl}` 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));