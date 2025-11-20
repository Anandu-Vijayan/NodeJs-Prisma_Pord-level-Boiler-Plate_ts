# Seed Migration System

A migration system for tracking and managing seed data changes over time.

## Quick Start

### Create a New Seed Migration

When you need to update seed data:

```bash
npm run seed:migrate:create "add_new_test_users"
```

This creates a new migration file in `prisma/seed-migrations/` with a timestamp.

### Apply Migrations

```bash
# Apply all pending migrations
npm run seed:migrate:apply

# Check migration status
npm run seed:migrate:status
```

## How It Works

1. **Migration Files**: Each migration is a TypeScript file in `prisma/seed-migrations/`
2. **Tracking**: Applied migrations are tracked in the `seed_migrations` collection
3. **Automatic**: Auto-seed feature automatically applies pending migrations
4. **Versioned**: Each migration has a unique ID and timestamp

## Migration File Structure

```typescript
import { SeedUser } from '../seed.types';

export const migrationId = '20241120_120000_add_new_users';
export const description = 'Add new users to seed data';
export const timestamp = new Date('2024-11-20T12:00:00Z');

export const seedUsers: SeedUser[] = [
  {
    name: 'New User',
    email: 'newuser@example.com',
    role: 'user',
    isActive: true,
  },
  // ... more users
];
```

## Workflow

### Adding New Seed Data

1. **Create migration**:
   ```bash
   npm run seed:migrate:create "add_new_users"
   ```

2. **Edit the migration file** in `prisma/seed-migrations/`:
   - Add your new users to the `seedUsers` array
   - Update existing users if needed

3. **Apply migration**:
   ```bash
   npm run seed:migrate:apply
   ```

### Updating Existing Seed Data

1. **Create migration**:
   ```bash
   npm run seed:migrate:create "update_user_roles"
   ```

2. **Edit the migration file**:
   - Modify user data in the `seedUsers` array
   - The system will update existing users based on email

3. **Apply migration**:
   ```bash
   npm run seed:migrate:apply
   ```

## Commands

| Command | Description |
|---------|-------------|
| `npm run seed:migrate:create [description]` | Create a new migration file |
| `npm run seed:migrate:apply` | Apply all pending migrations |
| `npm run seed:migrate:status` | Check which migrations are applied |
| `npm run prisma:seed` | Run seed (applies all migrations) |

## Integration

- **Auto-Seed**: Automatically applies pending migrations on startup
- **Manual Seed**: `npm run prisma:seed` applies all migrations
- **Database**: Tracks applied migrations in `seed_migrations` collection

## Best Practices

1. **One change per migration**: Keep migrations focused
2. **Descriptive names**: Use clear migration descriptions
3. **Test migrations**: Test migrations in development before production
4. **Version control**: Commit migration files to git
5. **Don't edit old migrations**: Create new migrations instead

## Example

```bash
# 1. Create migration
npm run seed:migrate:create "add_manager_role_users"

# 2. Edit prisma/seed-migrations/YYYYMMDD_HHMMSS_add_manager_role_users.ts
#    Add new users with manager role

# 3. Apply migration
npm run seed:migrate:apply

# 4. Check status
npm run seed:migrate:status
```

## Migration Tracking

Migrations are tracked in the database:

- **Collection**: `seed_migrations`
- **Fields**: `migrationId`, `appliedAt`
- **Purpose**: Prevents duplicate application of migrations

## Notes

- Migrations are idempotent (safe to run multiple times)
- Uses native MongoDB driver to avoid Prisma transaction requirements
- Preserves existing `createdAt` timestamps when updating users
- Automatically fixes null `createdAt` values

