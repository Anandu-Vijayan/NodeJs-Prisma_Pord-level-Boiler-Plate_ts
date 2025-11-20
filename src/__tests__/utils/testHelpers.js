const { PrismaClient } = require('@prisma/client');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

let mongoServer;
let prisma;
let mongoClient;

/**
 * Connect to in-memory MongoDB for testing
 */
const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  let mongoUri = mongoServer.getUri();
  
  // Ensure database name is in the URI (MongoMemoryServer might not include it)
  // Prisma needs the database name in the connection string
  if (!mongoUri.includes('/')) {
    mongoUri = `${mongoUri}test-db`;
  } else if (mongoUri.endsWith('/')) {
    mongoUri = `${mongoUri}test-db`;
  }
  
  // Set DATABASE_URL for Prisma BEFORE creating client
  process.env.DATABASE_URL = mongoUri;
  
  // Create MongoDB client for native operations
  mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  
  // Create unique index on email field (required for unique constraint)
  const db = mongoClient.db();
  const usersCollection = db.collection('users');
  try {
    await usersCollection.createIndex({ email: 1 }, { unique: true });
  } catch (e) {
    // Index might already exist, continue
  }
  
  // Disconnect any existing Prisma client
  if (prisma) {
    await prisma.$disconnect().catch(() => {});
  }
  
  // Clear global Prisma instance if it exists (for test isolation)
  if (global.prisma) {
    await global.prisma.$disconnect().catch(() => {});
    delete global.prisma;
  }
  
  // Clear all Prisma-related modules from cache
  Object.keys(require.cache).forEach((key) => {
    if (key.includes('@prisma') || key.includes('config/database')) {
      delete require.cache[key];
    }
  });
  
  // Create new Prisma client with explicit datasource URL
  // Prisma Client reads DATABASE_URL from env at initialization
  const { PrismaClient: FreshPrismaClient } = require('@prisma/client');
  
  // Force Prisma to use the new connection by setting env before client creation
  // Note: Prisma Client reads DATABASE_URL when it's instantiated
  prisma = new FreshPrismaClient({
    log: process.env.NODE_ENV === 'test' ? [] : ['error'],
  });
  
  // Connect to the database
  await prisma.$connect();
};

/**
 * Drop database, close connection and stop mongoServer
 */
const closeTestDB = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

/**
 * Clear all collections in the database
 * Uses native MongoDB driver to avoid replica set requirement
 */
const clearDatabase = async () => {
  if (mongoClient) {
    const db = mongoClient.db();
    await db.collection('users').deleteMany({});
  }
};

/**
 * Create a test user
 * Uses native MongoDB driver to avoid replica set requirement
 */
const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    isActive: true,
    ...overrides,
  };
  
  // Hash password
  const hashedPassword = await bcrypt.hash(defaultUser.password, 10);
  
  // Use native MongoDB driver to avoid transaction requirements
  if (mongoClient) {
    const db = mongoClient.db();
    const usersCollection = db.collection('users');
    
    const userData = {
      ...defaultUser,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Insert user using native MongoDB
    const result = await usersCollection.insertOne(userData);
    
    // Fetch the created user (without password)
    const user = await usersCollection.findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    );
    
    // Transform to match Prisma format (convert _id to id)
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  
  // Fallback to Prisma if mongoClient is not available
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
 * Create user using native MongoDB (for testing createUserWithPassword)
 * This bypasses Prisma's transaction requirement
 */
const createUserWithPasswordNative = async (data) => {
  const { hashPassword } = require('../../v1.0/models/User');
  const hashedPassword = await hashPassword(data.password);
  
  if (mongoClient) {
    const db = mongoClient.db();
    const usersCollection = db.collection('users');
    
    const userData = {
      ...data,
      password: hashedPassword,
      role: data.role || 'user',
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Insert user using native MongoDB
    const result = await usersCollection.insertOne(userData);
    
    // Fetch the created user (without password)
    const user = await usersCollection.findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    );
    
    // Transform to match Prisma format (convert _id to id)
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  
  throw new Error('MongoDB client not available');
};

/**
 * Find user by email using native MongoDB
 */
const findUserByEmailNative = async (email) => {
  if (mongoClient) {
    const db = mongoClient.db();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne(
      { email },
      { projection: { password: 0 } }
    );
    
    if (!user) return null;
    
    // Transform to match Prisma format
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  
  return null;
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
  createUserWithPasswordNative,
  findUserByEmailNative,
  generateTestToken,
  getPrisma: () => prisma,
  getMongoClient: () => mongoClient,
};
