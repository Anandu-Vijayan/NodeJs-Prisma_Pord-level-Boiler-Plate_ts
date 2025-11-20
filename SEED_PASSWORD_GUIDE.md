# How to Update Passwords in Seed Data

This guide shows you how to add or update passwords in seed migration files.

## Quick Start

### Method 1: Add Password to Existing Seed Migration

Edit `prisma/seed-migrations/20241120_000000_initial_seed.ts` and add the `password` field:

```typescript
export const seedUsers: SeedUser[] = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    contactNumber: '1234567890',
    password: 'Admin123!', // Add password here - it will be automatically hashed
    isActive: true,
  },
  // ... other users
];
```

**Then apply the migration:**
```bash
npm run seed:migrate:apply
```

---

### Method 2: Create a New Migration to Update Passwords

If you want to update passwords for existing users without modifying the initial seed:

1. **Create a new migration:**
```bash
npm run seed:migrate:create
```

2. **Edit the generated file** (e.g., `prisma/seed-migrations/20241121_000000_update_passwords.ts`):

```typescript
import { SeedUser } from '../seed.types';

export const migrationId = '20241121_000000_update_passwords';
export const description = 'Update passwords for existing users';
export const timestamp = new Date('2024-11-21T00:00:00Z');

export const seedUsers: SeedUser[] = [
  {
    // Only email is required to identify the user
    email: 'admin@example.com',
    // Add password to update it
    password: 'NewAdminPassword123!',
  },
  {
    email: 'john.doe@example.com',
    password: 'NewUserPassword123!',
  },
];
```

**Note:** When updating existing users, you only need to provide:
- `email` (required) - to identify the user
- `password` (optional) - to update the password
- Any other fields you want to update

3. **Apply the migration:**
```bash
npm run seed:migrate:apply
```

---

## Important Notes

### ✅ What Happens When You Add a Password

- **If user doesn't exist:** User will be created with the hashed password
- **If user exists:** Password will be updated (hashed automatically)
- **If password is NOT provided:** Existing password is preserved (not overwritten)

### ✅ Password Hashing

Passwords are **automatically hashed** using bcrypt before being stored in the database. You provide plain text passwords in the seed file, and the system handles the hashing.

### ✅ Updating Existing Users

When updating passwords for existing users in a new migration:

```typescript
export const seedUsers: SeedUser[] = [
  {
    email: 'admin@example.com',  // Required: identifies the user
    password: 'NewPassword123!',   // Optional: updates password if provided
    // Other fields are optional
  },
];
```

### ❌ Removing Passwords

To remove a password from a user, you cannot set it to `null` or empty string. You would need to:
1. Use the API endpoint to update the user
2. Or manually update the database

---

## Examples

### Example 1: Set Passwords for All Users in Initial Seed

```typescript
export const seedUsers: SeedUser[] = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    contactNumber: '1234567890',
    password: 'Admin123!',
    isActive: true,
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    contactNumber: '1234567890',
    password: 'User123!',
    isActive: true,
  },
];
```

### Example 2: Update Only Admin Password

```typescript
// In a new migration file
export const seedUsers: SeedUser[] = [
  {
    email: 'admin@example.com',
    password: 'NewAdminPassword456!',
  },
];
```

### Example 3: Update Multiple Users with Different Passwords

```typescript
// In a new migration file
export const seedUsers: SeedUser[] = [
  {
    email: 'admin@example.com',
    password: 'AdminSecure123!',
  },
  {
    email: 'john.doe@example.com',
    password: 'JohnPassword123!',
  },
  {
    email: 'jane.smith@example.com',
    password: 'JanePassword123!',
  },
];
```

### Example 4: Create User Without Password

```typescript
export const seedUsers: SeedUser[] = [
  {
    name: 'New User',
    email: 'newuser@example.com',
    role: 'user',
    contactNumber: '1234567890',
    // No password field - user created without password
    isActive: true,
  },
];
```

---

## Commands Reference

```bash
# Create a new seed migration
npm run seed:migrate:create

# Apply pending migrations
npm run seed:migrate:apply

# Check migration status
npm run seed:migrate:status

# Run seed script (applies all migrations)
npm run prisma:seed
```

---

## Troubleshooting

### Password Not Updating

1. **Check the migration was applied:**
   ```bash
   npm run seed:migrate:status
   ```

2. **Verify the email matches exactly** (case-sensitive):
   ```typescript
   email: 'admin@example.com', // Must match exactly
   ```

3. **Ensure password field is included:**
   ```typescript
   password: 'YourPassword123!', // Must be present
   ```

### Migration Already Applied

If you modify an already-applied migration, you need to:
1. Create a new migration file with the password updates
2. Or manually reset the migration status (not recommended)

### Password Not Hashed

Passwords are automatically hashed by the migration system. If you see plain text passwords in the database, check:
- The migration was applied correctly
- The `applyMigration` function in `prisma/seed-migrate.ts` is working

---

## Security Best Practices

1. **Never commit passwords to production** - Use environment variables or secure vaults
2. **Use strong passwords** - Minimum 8 characters with mixed case, numbers, and special characters
3. **Different passwords for different users** - Don't use the same password for all seed users
4. **Remove passwords from seed files in production** - Only include passwords in development

---

## Related Files

- `prisma/seed-migrations/20241120_000000_initial_seed.ts` - Initial seed file
- `prisma/seed-migrate.ts` - Migration logic
- `prisma/seed.types.ts` - Type definitions
- `PASSWORD_UPDATE_GUIDE.md` - Complete password update guide

