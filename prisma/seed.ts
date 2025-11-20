/**
 * Seed file for Prisma
 * Populates the database with dummy data for development and testing
 * 
 * Note: This file now uses the seed migration system.
 * To update seed data, create a new migration instead of editing this file.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Main seed function
 * Applies all seed migrations
 */
async function main() {
  try {
    console.log('🚀 Starting database seeding...\n');

    // Apply all seed migrations
    const { applyPendingMigrations } = require('./seed-migrate');
    await applyPendingMigrations();

    console.log('\n✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Execute seed
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

