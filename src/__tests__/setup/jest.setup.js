// Jest setup file - runs before each test file

// Increase timeout for integration tests
jest.setTimeout(10000);

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  // Uncomment to silence console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: jest.fn(), // Keep errors visible
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/test-db';

// Suppress winston logs during tests
const winston = require('winston');

if (winston.transports.Console) {
  winston.transports.Console.prototype.silent = true;
}
if (winston.transports.File) {
  winston.transports.File.prototype.silent = true;
}
