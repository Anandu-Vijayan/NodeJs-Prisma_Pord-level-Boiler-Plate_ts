/**
 * Seed file for Prisma
 * Populates the database with dummy data for development and testing
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const prisma = new PrismaClient();

// Get MongoDB connection string from environment
const DATABASE_URL = process.env.DATABASE_URL || '';

/**
 * Seed users with dummy data
 */
async function seedUsers() {
  console.log('🌱 Seeding users...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    },
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
    },
    {
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
    },
    {
      name: 'Inactive User',
      email: 'inactive@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: false,
    },
  ];

  // Use native MongoDB driver to avoid transaction requirements
  // Prisma operations require replica set for some operations
  const client = new MongoClient(DATABASE_URL);
  await client.connect();
  const db = client.db();
  const usersCollection = db.collection('users');

  // Create/Update users using native MongoDB operations
  for (const userData of users) {
    const result = await usersCollection.updateOne(
      { email: userData.email },
      { $set: userData },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    } else {
      console.log(`✅ Updated user: ${userData.email} (${userData.role})`);
    }
  }

  await client.close();

  console.log(`✨ Seeded ${users.length} users`);
}

/**
 * Main seed function
 */
async function main() {
  try {
    console.log('🚀 Starting database seeding...\n');

    await seedUsers();

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

