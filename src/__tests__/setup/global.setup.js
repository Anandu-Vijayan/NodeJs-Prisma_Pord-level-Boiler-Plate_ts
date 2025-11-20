// Global setup - runs once before all tests
module.exports = async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

  // You can add database setup here if needed
  // For example, connecting to a test database
  console.log('🧪 Test environment initialized');
};
