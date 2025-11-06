import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder/TextDecoder (needed for react-router-dom)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Provide a default fetch mock for tests that don't mock it explicitly
if (!global.fetch) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: { get: () => 'application/json' },
    json: async () => ({ success: true, data: [] })
  });
}

// Mock execCommand used by the editor
if (!document.execCommand) {
  document.execCommand = jest.fn().mockReturnValue(true);
}

// Mock queryCommandState used by the editor formatting checks
if (!document.queryCommandState) {
  document.queryCommandState = jest.fn().mockReturnValue(false);
}

// Basic getSelection mock to avoid jsdom selection issues
if (!window.getSelection) {
  window.getSelection = () => ({
    rangeCount: 0,
    getRangeAt: () => ({
      startContainer: { parentElement: document.createElement('div') },
      cloneContents: () => document.createDocumentFragment(),
      deleteContents: () => {},
      insertNode: () => {},
      toString: () => ''
    }),
    removeAllRanges: () => {},
    addRange: () => {},
    toString: () => ''
  });
}

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('Not implemented'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
