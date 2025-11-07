const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const generateToken = (userId, rememberMe = false) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: rememberMe ? '30d' : '1d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const username = name ? name.toLowerCase().replace(/\s+/g, '') + Math.random().toString(36).substring(2, 8) : email.split('@')[0] + Math.random().toString(36).substring(2, 8);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = new User({
      username,
      name,
      email,
      password
    });

    await user.save();

    const token = generateToken(user._id);

    logger.info({ userId: user._id, email: user.email }, 'User registered');
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        preferences: user.preferences,
        displayName: user.displayName
      },
      token
    });
  } catch (error) {
    logger.error({ err: error }, 'Register error');

    if (error.code === 11000 && error.keyPattern.username) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists. Please try again.'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      logger.warn({ email }, 'Login failed: user not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn({ userId: user._id }, 'Login failed: invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (rememberMe !== undefined) {
      user.rememberMe = rememberMe;
      await user.save();
    }

    if (!user.username) {
      user.username = user.name ? 
        user.name.toLowerCase().replace(/\s+/g, '') + Math.random().toString(36).substring(2, 6) :
        user.email.split('@')[0] + Math.random().toString(36).substring(2, 6);
      await user.save();
    }
    const token = generateToken(user._id, rememberMe);

    logger.info({ userId: user._id }, 'User logged in');
    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        preferences: user.preferences,
        rememberMe: user.rememberMe,
        displayName: user.displayName
      },
      token
    });
  } catch (error) {
    logger.error({ err: error }, 'Login error');
    
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userData = {
      ...req.user.toObject(),
      displayName: req.user.displayName
    };
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id }, 'Get me error');
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, profilePicture } = req.body;
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
      user.email = email;
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update profile picture if provided
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    // Handle password change
    if (currentPassword && newPassword) {
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      user.password = newPassword;
    }

    await user.save();

    // Return updated user data
    const updatedUser = await User.findById(userId);

    logger.info({ userId }, 'User profile updated');
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        preferences: updatedUser.preferences,
        displayName: updatedUser.displayName
      },
      message: 'Profile updated successfully'
    });

  } catch (error) {
    logger.error({ err: error, userId: req.user?._id }, 'Update profile error');
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old profile image if exists and it's a local file
    if (user.profilePicture && user.profilePicture.includes('profile-images')) {
      const oldImagePath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user profile picture with full URL for frontend
    const profilePictureUrl = `/uploads/profile-images/${req.file.filename}`;
    user.profilePicture = profilePictureUrl;
    await user.save();

    logger.info({ userId: req.user._id }, 'Profile image uploaded');
    res.json({
      success: true,
      data: {
        profilePicture: profilePictureUrl
      },
      message: 'Profile image uploaded successfully'
    });

  } catch (error) {
    logger.error({ err: error, userId: req.user?._id }, 'Upload profile image error');
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image'
    });
  }
};