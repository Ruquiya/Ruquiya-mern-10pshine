# Backend Testing

This directory contains unit tests for the backend application using **Mocha** and **Chai**.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure MongoDB is running (test database will be created automatically)

3. Create a `.env.test` file (optional) in the backend root:
```env
MONGO_URI=mongodb://localhost:27017/notes-app-test
JWT_SECRET=test-secret-key
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Test Structure

- `test/setup.js` - Test environment setup (database connection, cleanup)
- `test/controllers/` - API endpoint tests
- `test/models/` - Database model tests
- `test/services/` - Business logic tests

## Test Files

- `noteController.test.js` - Tests for note CRUD operations
- `Note.test.js` - Tests for Note model validation and defaults

## Notes

- Tests use a separate test database
- Collections are cleared before each test
- Database is dropped after all tests complete
- JWT authentication is handled with test tokens

