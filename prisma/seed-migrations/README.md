# Seed Migrations

This directory contains seed data migrations that track changes to seed data over time.

## How It Works

1. Each seed migration file contains seed data for a specific version
2. Migrations are tracked in the database to know which ones have been applied
3. When seed data changes, create a new migration file
4. The system automatically applies pending migrations

## Creating a New Seed Migration

```bash
npm run seed:migrate:create
```

This will:
- Create a new migration file with timestamp
- Copy current seed data as a template
- Update seed files to use the new migration

## Manual Migration Creation

1. Create a new file: `prisma/seed-migrations/YYYYMMDD_HHMMSS_description.ts`
2. Export seed data following the pattern in existing migrations
3. Run: `npm run seed:migrate:apply`

## Migration File Structure

```typescript
import { SeedUser } from '../seed.types';

export const migrationId = '20241120_120000_add_new_users';
export const description = 'Add new users to seed data';
export const timestamp = new Date('2024-11-20T12:00:00Z');

export const seedUsers: SeedUser[] = [
  // Seed data here
];
```

## Applying Migrations

```bash
# Apply all pending migrations
npm run seed:migrate:apply

# Check migration status
npm run seed:migrate:status
```

