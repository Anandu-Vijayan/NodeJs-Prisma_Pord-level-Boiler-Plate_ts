// Global teardown - runs once after all tests
module.exports = async () => {
  // Clean up any global resources
  // For example, closing database connections
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.$disconnect();
    console.log('🧹 Test database connection closed');
  } catch (error) {
    // Ignore errors if Prisma is not connected
  }

  console.log('✅ Test environment cleaned up');
};
