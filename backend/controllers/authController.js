const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
    console.error('Register error:', error);
    

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
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
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
    console.error('Login error:', error);
    
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
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};