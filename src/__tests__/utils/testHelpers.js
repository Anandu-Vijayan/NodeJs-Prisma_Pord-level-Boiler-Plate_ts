const { PrismaClient } = require('@prisma/client');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

let mongoServer;
let prisma;

/**
 * Connect to in-memory MongoDB for testing
 */
const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Set DATABASE_URL for Prisma
  process.env.DATABASE_URL = mongoUri;
  
  // Create new Prisma client with test database URL
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: mongoUri,
      },
    },
  });
  
  await prisma.$connect();
};

/**
 * Drop database, close connection and stop mongoServer
 */
const closeTestDB = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

/**
 * Clear all collections in the database
 */
const clearDatabase = async () => {
  if (prisma) {
    await prisma.user.deleteMany({});
  }
};

/**
 * Create a test user
 */
const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    ...overrides,
  };
  
  // Hash password
  const hashedPassword = await bcrypt.hash(defaultUser.password, 10);
  
  return await prisma.user.create({
    data: {
      ...defaultUser,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Generate JWT token for testing
 */
const generateTestToken = (userId) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = {
  connectTestDB,
  closeTestDB,
  clearDatabase,
  createTestUser,
  generateTestToken,
  getPrisma: () => prisma,
};
