# Database Seeding Guide

This directory contains seed files to populate your database with dummy data for development and testing.

## Seed File

- `seed.ts` - Main seed file that populates the database with dummy users

## Usage

### Run Seed

```bash
npm run db:seed
# or
npm run prisma:seed
```

### Reset and Reseed Database

⚠️ **Warning:** This will delete all existing data!

```bash
npm run db:reset
```

This command will:
1. Reset the database (delete all data)
2. Apply schema changes
3. Seed the database with dummy data

## Seed Data

### Users

The seed file creates the following users:

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@example.com | password123 | admin | Active |
| john.doe@example.com | password123 | user | Active |
| jane.smith@example.com | password123 | user | Active |
| bob.johnson@example.com | password123 | user | Active |
| alice.williams@example.com | password123 | user | Active |
| inactive@example.com | password123 | user | Inactive |

**Default Password:** `password123` (for all users)

## Customizing Seed Data

Edit `prisma/seed.ts` to customize the seed data:

```typescript
const users = [
  {
    name: 'Your Name',
    email: 'your.email@example.com',
    password: hashedPassword,
    role: 'user', // or 'admin'
    isActive: true,
  },
  // Add more users...
];
```

## Technical Notes

**MongoDB Replica Set Requirement:**
- Prisma's `create()`, `upsert()`, and `deleteMany()` operations require MongoDB to be run as a replica set
- The seed file uses the native MongoDB driver instead to work with standalone MongoDB instances
- This allows the seed to work without requiring replica set configuration

## Best Practices

1. **Development Only:** Seed files are for development and testing. Never run seeds in production.
2. **Idempotent:** The seed file uses MongoDB's `updateOne` with `upsert: true` to avoid duplicates if run multiple times.
3. **Secure Passwords:** In production, use strong, unique passwords. The seed uses a simple password for convenience.
4. **Safe to Run Multiple Times:** The seed uses upsert operations, so it's safe to run multiple times without creating duplicates.

## Testing with Seed Data

After seeding, you can test authentication:

```bash
# Login as admin
curl -X POST http://localhost:4040/api/v1.0/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Login as regular user
curl -X POST http://localhost:4040/api/v1.0/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"password123"}'
```

## Troubleshooting

### Seed Fails

1. **Check Database Connection:**
   - Ensure MongoDB is running
   - Verify `DATABASE_URL` in `.env` is correct

2. **Check Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

3. **Check Schema:**
   - Ensure `prisma/schema.prisma` is valid
   - Run `npx prisma validate`

### Duplicate Users

The seed uses `upsert`, so running it multiple times is safe. If you want to start fresh:

```bash
npm run db:reset
```

