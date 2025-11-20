module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Preset for TypeScript
  preset: 'ts-jest',

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.{ts,js}',
    '**/?(*.)+(spec|test).{ts,js}',
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/jest.setup.js'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
    '!src/server.ts',
    '!src/config/env.ts',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // Coverage thresholds (set to minimum levels to allow single file testing)
  // These are intentionally low to allow running individual test files
  // Increase these as you add more comprehensive tests
  coverageThreshold: {
    global: {
      branches: 0, // Allow single file tests
      functions: 0, // Allow single file tests
      lines: 0, // Allow single file tests
      statements: 0, // Allow single file tests
    },
  },

  // Paths to ignore
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/logs/',
    '/coverage/',
    '/src/__tests__/',
    '/dist/',
  ],

  // Module paths
  moduleDirectories: ['node_modules', 'src'],

  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@utilities/(.*)$': '<rootDir>/src/utilities/$1',
    '^@v1/(.*)$': '<rootDir>/src/v1.0/$1',
  },

  // Transform configuration
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Test timeout
  testTimeout: 10000,

  // Transform ignore patterns
  transformIgnorePatterns: ['/node_modules/'],

  // Global test setup
  globalSetup: '<rootDir>/src/__tests__/setup/global.setup.js',
  globalTeardown: '<rootDir>/src/__tests__/setup/global.teardown.js',
};
