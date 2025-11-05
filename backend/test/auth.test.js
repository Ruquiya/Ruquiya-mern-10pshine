// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const auth = async (req, res, next) => {
  try {
    console.log('🔐 Auth Middleware - Starting authentication...');
    console.log('🔐 Headers:', req.headers);
    
    const token = req.header('Authorization');
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    console.log('🔐 Token received (first 20 chars):', actualToken.substring(0, 20) + '...');
    
    // Debug JWT secret
    const jwtSecret = process.env.JWT_SECRET;
    console.log('🔐 JWT Secret from env:', jwtSecret ? 'Present' : 'Missing');
    console.log('🔐 JWT Secret value:', jwtSecret);
    
    // Verify token
    const decoded = jwt.verify(actualToken, jwtSecret);
    console.log('🔐 Token decoded:', decoded);
    
    // Check if user exists in database
    console.log('🔐 Looking for user with ID:', decoded.id);
    
    // Make sure database is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ Database not connected in auth middleware');
      return res.status(500).json({ success: false, message: 'Database connection error' });
    }
    
    const user = await User.findById(decoded.id).select('-password');
    console.log('🔐 User found:', user ? `Yes (${user.email})` : 'No');
    
    if (!user) {
      console.log('❌ User not found in database for ID:', decoded.id);
      return res.status(401).json({ success: false, message: 'Token is not valid - user not found' });
    }

    console.log('✅ User authenticated successfully:', user._id);
    req.user = user;
    next();
  } catch (error) {
    console.error('🔐 Auth middleware error:', error.message);
    console.error('🔐 Error details:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }
    
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = auth;