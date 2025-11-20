/**
 * Auto-migration utility
 * Handles automatic database schema synchronization using Prisma
 */

import { execSync } from 'child_process';
import logger from '../utilities/logger';
import config from './env';

/**
 * Run Prisma db push to sync schema with database
 * This is the recommended approach for MongoDB (which doesn't support migrations)
 */
const runMigration = async (): Promise<void> => {
  try {
    logger.info('Starting database schema synchronization...');
    
    // Use execSync to run prisma db push
    // This will sync the Prisma schema with the database
    const output = execSync('npx prisma db push', {
      encoding: 'utf-8',
      stdio: 'pipe',
      env: {
        ...process.env,
        DATABASE_URL: config.DATABASE_URL,
      },
    });

    logger.info('Database schema synchronized successfully');
    
    if (output) {
      logger.debug('Migration output:', output);
    }
  } catch (error) {
    const err = error as Error & { stdout?: string; stderr?: string };
    logger.error('Database schema synchronization failed:', err.message);
    
    if (err.stdout) {
      logger.error('Migration stdout:', err.stdout);
    }
    if (err.stderr) {
      logger.error('Migration stderr:', err.stderr);
    }
    
    // Don't throw error - let the app continue if migration fails
    // This allows the app to start even if there are minor schema issues
    logger.warn('Continuing with application startup despite migration warning');
  }
};

/**
 * Check if auto-migration is enabled
 */
const isAutoMigrationEnabled = (): boolean => {
  // Auto-migration is enabled if:
  // 1. PRISMA_AUTO_MIGRATE is explicitly set to 'true'
  // 2. OR we're in development mode and PRISMA_AUTO_MIGRATE is not set to 'false'
  const autoMigrate = process.env.PRISMA_AUTO_MIGRATE;
  
  if (autoMigrate === 'true') {
    return true;
  }
  
  if (autoMigrate === 'false') {
    return false;
  }
  
  // Default: enable in development, disable in production/test
  return config.NODE_ENV === 'development';
};

export { runMigration, isAutoMigrationEnabled };

