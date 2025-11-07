// config/db.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Don't connect if already connected
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info({ host: conn.connection.host }, 'MongoDB connected');
    return conn;
  } catch (error) {
    logger.error({ err: error }, 'Database connection error');
    
    // In test environment, we might want to handle this differently
    if (process.env.NODE_ENV === 'test') {
      throw error; // Let the test handle it
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;