/**
 * Auto-seed utility
 * Periodically checks if seed data exists in the database
 * and seeds if data is missing
 */

import { MongoClient } from 'mongodb';
import logger from '../utilities/logger';
import config from './env';

/**
 * Check if seed data exists in the database
 * Uses native MongoDB to avoid Prisma schema validation issues
 */
const checkSeedDataExists = async (): Promise<boolean> => {
  try {
    // Use native MongoDB driver to check for seed data
    // This avoids Prisma schema validation issues with existing data
    const client = new MongoClient(config.DATABASE_URL);
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if admin user exists
    const adminUser = await usersCollection.findOne({
      email: 'admin@example.com',
    });

    await client.close();

    // If admin user exists, assume seed data is present
    return adminUser !== null;
  } catch (error) {
    logger.error('Error checking seed data:', error);
    return false;
  }
};

/**
 * Seed users using migration system
 * Note: Migrations handle password hashing internally if password is provided
 */
const seedUsers = async (): Promise<void> => {
  try {
    logger.info('🌱 Auto-seeding users...');

    // Use the seed migration system
    // Using require since prisma files are outside src directory
    const path = require('path');
    const seedMigratePath = path.join(__dirname, '../../prisma/seed-migrate');
    delete require.cache[require.resolve(seedMigratePath)];
    const { applyPendingMigrations } = require(seedMigratePath);
    await applyPendingMigrations();
  } catch (error) {
    const err = error as Error;
    logger.error(`Error auto-seeding users: ${err.message}`);
    throw error;
  }
};

/**
 * Check and seed database if needed
 */
export const checkAndSeed = async (): Promise<void> => {
  try {
    const dataExists = await checkSeedDataExists();

    if (!dataExists) {
      logger.info('📦 Seed data not found. Auto-seeding database...');
      await seedUsers();
      logger.info('✅ Auto-seeding completed');
    } else {
      logger.debug('✅ Seed data already exists in database');
    }
  } catch (error) {
    const err = error as Error;
    logger.error(`Auto-seed check failed: ${err.message}`);
    // Don't throw - allow app to continue even if seeding fails
  }
};

/**
 * Check if auto-seeding is enabled
 */
export const isAutoSeedEnabled = (): boolean => {
  // Auto-seed is enabled by default in development
  // Can be controlled via PRISMA_AUTO_SEED environment variable
  if (process.env.PRISMA_AUTO_SEED !== undefined) {
    return process.env.PRISMA_AUTO_SEED === 'true';
  }

  // Default: enabled in development, disabled in production and test
  return config.NODE_ENV === 'development';
};

/**
 * Start periodic auto-seeding
 * @param intervalMinutes - Interval in minutes to check and seed (default: 60)
 */
export const startAutoSeed = (intervalMinutes: number = 60): NodeJS.Timeout | null => {
  if (!isAutoSeedEnabled()) {
    logger.debug('Auto-seeding is disabled');
    return null;
  }

  if (config.NODE_ENV === 'test') {
    logger.debug('Auto-seeding disabled in test environment');
    return null;
  }

  logger.info(`🔄 Starting auto-seed with ${intervalMinutes} minute interval`);

  // Run immediately on start
  checkAndSeed().catch((error) => {
    logger.error('Initial auto-seed failed:', error);
  });

  // Set up periodic checks
  const interval = setInterval(() => {
    checkAndSeed().catch((error) => {
      logger.error('Periodic auto-seed failed:', error);
    });
  }, intervalMinutes * 60 * 1000);

  return interval;
};

/**
 * Stop periodic auto-seeding
 */
export const stopAutoSeed = (interval: NodeJS.Timeout | null): void => {
  if (interval) {
    clearInterval(interval);
    logger.info('🛑 Auto-seed stopped');
  }
};

