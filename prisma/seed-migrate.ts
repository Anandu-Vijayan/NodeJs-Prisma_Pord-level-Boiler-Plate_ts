/**
 * Seed Migration System
 * Tracks and applies seed data migrations
 */

import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { SeedMigration, AppliedMigration } from './seed.types';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || '';
const MIGRATIONS_DIR = join(__dirname, 'seed-migrations');
const MIGRATIONS_COLLECTION = 'seed_migrations';
const USERS_COLLECTION = 'users';

/**
 * Get all migration files
 */
async function getMigrationFiles(): Promise<string[]> {
  try {
    const files = await readdir(MIGRATIONS_DIR);
    return files
      .filter((file) => file.endsWith('.ts') && file !== 'README.md')
      .sort();
  } catch (error) {
    console.error('Error reading migrations directory:', error);
    return [];
  }
}

/**
 * Load migration module
 */
async function loadMigration(fileName: string): Promise<SeedMigration> {
  const filePath = join(MIGRATIONS_DIR, fileName);
  const migration = await import(filePath);
  
  return {
    migrationId: migration.migrationId,
    description: migration.description,
    timestamp: migration.timestamp,
    seedUsers: migration.seedUsers,
  };
}

/**
 * Get applied migrations from database
 */
async function getAppliedMigrations(
  db: any,
): Promise<Set<string>> {
  try {
    const migrationsCollection = db.collection(MIGRATIONS_COLLECTION);
    const applied = await migrationsCollection
      .find({})
      .toArray();
    return new Set(applied.map((m: AppliedMigration) => m.migrationId));
  } catch (error) {
    // Collection might not exist yet, return empty set
    return new Set();
  }
}

/**
 * Mark migration as applied
 */
async function markMigrationApplied(
  db: any,
  migration: SeedMigration,
): Promise<void> {
  const migrationsCollection = db.collection(MIGRATIONS_COLLECTION);
  
  // Use updateOne with upsert to avoid duplicate key errors
  // This makes the operation idempotent
  await migrationsCollection.updateOne(
    { migrationId: migration.migrationId },
    {
      $set: {
        migrationId: migration.migrationId,
        appliedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

/**
 * Apply a single migration
 */
async function applyMigration(
  db: any,
  migration: SeedMigration,
): Promise<void> {
  console.log(`📦 Applying migration: ${migration.migrationId}`);
  console.log(`   Description: ${migration.description}`);

  const usersCollection = db.collection(USERS_COLLECTION);

  let createdCount = 0;
  let updatedCount = 0;

  for (const userData of migration.seedUsers) {
    const now = new Date();
    
    // Only hash password if it's provided in seed data
    let userDataToSave: any = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    };
    
    // Hash password only if provided
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userDataToSave.password = hashedPassword;
    }

    // Check if user exists
    const existingUser = await usersCollection.findOne({
      email: userData.email,
    });

    if (existingUser) {
      // Update existing user, preserve createdAt and password
      const updateData: any = {
        ...userDataToSave,
        updatedAt: now,
      };

      // Preserve createdAt if it already exists and is valid
      if (
        existingUser.createdAt &&
        existingUser.createdAt instanceof Date
      ) {
        updateData.createdAt = existingUser.createdAt;
      } else {
        updateData.createdAt = now;
      }

      // Only update password if it's explicitly provided in seed data
      // If password is not in seed data, don't include it in the update
      // This preserves existing passwords
      if (!userData.password) {
        delete updateData.password;
      }

      const result = await usersCollection.updateOne(
        { email: userData.email },
        { $set: updateData },
      );

      if (result.modifiedCount > 0) {
        updatedCount++;
      }
    } else {
      // Create new user (only include password if provided in seed data)
      const insertData: any = { ...userDataToSave };
      
      // Remove password from insert if not provided in seed data
      if (!userData.password) {
        delete insertData.password;
      }
      
      const result = await usersCollection.insertOne(insertData);
      if (result.insertedId) {
        createdCount++;
      }
    }
  }

  // Mark migration as applied
  await markMigrationApplied(db, migration);

  console.log(
    `✅ Migration applied: ${createdCount} created, ${updatedCount} updated`,
  );
}

/**
 * Apply all pending migrations
 */
export async function applyPendingMigrations(): Promise<void> {
  try {
    console.log('🚀 Starting seed migrations...\n');

    const client = new MongoClient(DATABASE_URL);
    await client.connect();
    const db = client.db();

    // Ensure migrations collection exists
    const migrationsCollection = db.collection(MIGRATIONS_COLLECTION);
    await migrationsCollection.createIndex(
      { migrationId: 1 },
      { unique: true },
    );

    // Get all migration files
    const migrationFiles = await getMigrationFiles();
    console.log(`Found ${migrationFiles.length} migration files\n`);

    // Get applied migrations
    const appliedMigrations = await getAppliedMigrations(db);

    // Apply pending migrations
    let appliedCount = 0;
    for (const fileName of migrationFiles) {
      const migration = await loadMigration(fileName);

      if (!appliedMigrations.has(migration.migrationId)) {
        try {
          await applyMigration(db, migration);
          appliedCount++;
          console.log('');
        } catch (error: any) {
          // If it's a duplicate key error, the migration was already applied
          // This can happen in race conditions or if migration was partially applied
          if (error.code === 11000 && error.keyPattern?.migrationId) {
            console.log(
              `⚠️  Migration ${migration.migrationId} appears to be already applied (duplicate key). Skipping...`,
            );
            // Mark as applied to prevent future attempts
            await markMigrationApplied(db, migration);
          } else {
            throw error;
          }
        }
      } else {
        console.log(
          `⏭️  Skipping already applied migration: ${migration.migrationId}`,
        );
      }
    }

    await client.close();

    if (appliedCount === 0) {
      console.log('✅ All migrations are up to date');
    } else {
      console.log(`✅ Applied ${appliedCount} migration(s)`);
    }
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
    throw error;
  }
}

/**
 * Check migration status
 */
export async function checkMigrationStatus(): Promise<void> {
  try {
    const client = new MongoClient(DATABASE_URL);
    await client.connect();
    const db = client.db();

    const migrationFiles = await getMigrationFiles();
    const appliedMigrations = await getAppliedMigrations(db);

    console.log('📊 Seed Migration Status\n');
    console.log(`Total migrations: ${migrationFiles.length}`);
    console.log(`Applied migrations: ${appliedMigrations.size}`);
    console.log(`Pending migrations: ${migrationFiles.length - appliedMigrations.size}\n`);

    console.log('Migration Details:');
    for (const fileName of migrationFiles) {
      const migration = await loadMigration(fileName);
      const isApplied = appliedMigrations.has(migration.migrationId);
      const status = isApplied ? '✅ Applied' : '⏳ Pending';
      console.log(
        `  ${status} - ${migration.migrationId}: ${migration.description}`,
      );
    }

    await client.close();
  } catch (error) {
    console.error('❌ Error checking migration status:', error);
    throw error;
  }
}

/**
 * Create a new migration file
 */
export async function createMigration(description: string): Promise<string> {
  try {
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .replace('T', '_')
      .substring(0, 15); // YYYYMMDD_HHMMSS

    const fileName = `${timestamp}_${description
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')}.ts`;

    const filePath = join(MIGRATIONS_DIR, fileName);

    // Load current seed data from the latest migration or seed.ts
    const latestMigration = await getLatestMigration();
    const seedUsers = latestMigration?.seedUsers || [];

    const migrationIdValue = `${timestamp}_${description
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')}`;
    
    const seedUsersJson = JSON.stringify(seedUsers, null, 2);
    const dateStr = now.toISOString().split('T')[0];
    const timestampStr = now.toISOString();

    const fileContent = `/**
 * Seed Migration
 * Date: ${dateStr}
 * Description: ${description}
 */

import { SeedUser } from '../seed.types';

export const migrationId = '${migrationIdValue}';
export const description = '${description}';
export const timestamp = new Date('${timestampStr}');

export const seedUsers: SeedUser[] = ${seedUsersJson};
`;

    const { writeFile } = await import('fs/promises');
    await writeFile(filePath, fileContent, 'utf-8');

    console.log(`✅ Created migration file: ${fileName}`);
    console.log(`   Path: ${filePath}`);
    console.log(`\n📝 Edit the file to update seed data, then run:`);
    console.log(`   npm run seed:migrate:apply`);

    return fileName;
  } catch (error) {
    console.error('❌ Error creating migration:', error);
    throw error;
  }
}

/**
 * Get the latest migration
 */
async function getLatestMigration(): Promise<SeedMigration | null> {
  try {
    const files = await getMigrationFiles();
    if (files.length === 0) return null;

    const latestFile = files[files.length - 1];
    return await loadMigration(latestFile);
  } catch (error) {
    return null;
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'apply') {
    applyPendingMigrations()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  } else if (command === 'status') {
    checkMigrationStatus()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  } else if (command === 'create') {
    const description: string = process.argv[3] || 'update_seed_data';
    createMigration(description)
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  } else {
    console.log('Usage:');
    console.log('  npm run seed:migrate:apply   - Apply pending migrations');
    console.log('  npm run seed:migrate:status  - Check migration status');
    console.log('  npm run seed:migrate:create  - Create new migration');
    process.exit(1);
  }
}

