import { PrismaClient } from '@prisma/client';
import logger from '../utilities/logger';
import { runMigration, isAutoMigrationEnabled } from './migration';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const connectDB = async (): Promise<void> => {
  try {
    // Run auto-migration if enabled (before connecting)
    if (isAutoMigrationEnabled() && process.env.NODE_ENV !== 'test') {
      await runMigration();
    }

    // Test the connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Graceful shutdown (only if not in test mode)
    if (process.env.NODE_ENV !== 'test') {
      process.on('SIGINT', async () => {
        await prisma.$disconnect();
        logger.info('Database connection closed through app termination');
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await prisma.$disconnect();
        logger.info('Database connection closed through app termination');
        process.exit(0);
      });
    }
  } catch (error) {
    const err = error as Error;
    logger.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;

