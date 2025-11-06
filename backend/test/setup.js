// Set JWT_SECRET FIRST before any other requires
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

require('dotenv').config();

// Try to load .env.test if it exists
try {
  const testEnv = require('dotenv').config({ path: '.env.test' });
  if (testEnv.parsed && testEnv.parsed.JWT_SECRET) {
    process.env.JWT_SECRET = testEnv.parsed.JWT_SECRET;
  }
} catch (error) {
  // .env.test doesn't exist, that's okay
}

// Ensure JWT_SECRET is always set for tests
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key';
}

console.log('🔐 JWT_SECRET set to:', process.env.JWT_SECRET ? 'Present' : 'Missing');

const mongoose = require('mongoose');

const testDbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/notes-app-test';

let isConnected = false;

// Export setup/teardown functions for tests to use
module.exports = {
  async connectDB() {
    if (!isConnected) {
      console.log('\n Setting up test environment...');
      try {
        await mongoose.connect(testDbUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('Test database connected');
      } catch (error) {
        console.error('Test database connection error:', error);
        throw error;
      }
    }
  },
  
  async disconnectDB() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
      isConnected = false;
      console.log('\nTest database disconnected and cleaned up');
    }
  },
  
  async clearCollections() {
    if (mongoose.connection.readyState !== 0) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        try {
          await collections[key].deleteMany({});
          console.log(` Cleared collection: ${key}`);
        } catch (error) {
          // Ignore errors
        }
      }
    }
  }
};

// Try to set up Mocha hooks if available (may not work with --require)
try {
  if (typeof before !== 'undefined') {
    const setup = module.exports;
    
    before(async function() {
      this.timeout(10000);
      await setup.connectDB();
    });

    after(async function() {
      this.timeout(10000);
      await setup.disconnectDB();
    });

    beforeEach(async function() {
      await setup.clearCollections();
    });
  }
} catch (e) {
  // Hooks not available, tests will need to call setup functions manually
  console.log('⚠️ Mocha hooks not available - tests should use setup functions');
}
