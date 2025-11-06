# Frontend Testing

This directory contains unit tests for the frontend application using **Jest** and **React Testing Library**.

## Setup

1. Install dependencies:
```bash
npm install
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

- `src/setupTests.js` - Test environment configuration
- `src/services/__tests__/` - Service layer tests
- `src/components/**/__tests__/` - Component tests

## Test Files

- `noteService.test.js` - Tests for note service API calls
- `NoteCard.test.js` - Tests for NoteCard component rendering and interactions

## Configuration

- Jest configuration: `jest.config.js`
- Babel configuration: `babel.config.js`
- Test setup: `src/setupTests.js`

## Notes

- `fetch` API is mocked in tests
- `localStorage` is mocked for authentication
- Component tests use React Testing Library for user-centric testing

