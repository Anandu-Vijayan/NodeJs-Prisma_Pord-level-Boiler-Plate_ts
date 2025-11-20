# Auto-Seed Feature

This feature automatically checks if seed data exists in the database and seeds it if missing. It runs periodically to ensure your database always has the required seed data.

## How It Works

1. **Initial Check**: When the application starts, it checks if seed data exists (by checking for the admin user)
2. **Auto-Seed**: If seed data is missing, it automatically seeds the database
3. **Periodic Checks**: The system periodically checks and seeds the database at configurable intervals

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Enable/Disable auto-seeding
# Default: enabled in development, disabled in production and test
PRISMA_AUTO_SEED=true

# Auto-seed check interval in minutes
# Default: 60 minutes
PRISMA_AUTO_SEED_INTERVAL=60
```

### Configuration Options

- **`PRISMA_AUTO_SEED`**: 
  - `true` - Enable auto-seeding
  - `false` - Disable auto-seeding
  - If not set: Enabled in development, disabled in production and test

- **`PRISMA_AUTO_SEED_INTERVAL`**: 
  - Interval in minutes to check and seed the database
  - Default: 60 minutes
  - Minimum recommended: 15 minutes

## Default Behavior

- **Development**: Auto-seeding is **enabled** by default
- **Production**: Auto-seeding is **disabled** by default (for safety)
- **Test**: Auto-seeding is **disabled** (tests handle their own database)

## Seed Data

The auto-seed feature seeds the following users:

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@example.com | password123 | admin | Active |
| john.doe@example.com | password123 | user | Active |
| jane.smith@example.com | password123 | user | Active |
| bob.johnson@example.com | password123 | user | Active |
| alice.williams@example.com | password123 | user | Active |
| inactive@example.com | password123 | user | Inactive |

**Default Password:** `password123` (for all users)

## Usage

### Automatic (Recommended)

The auto-seed feature runs automatically when the application starts (if enabled). No manual intervention needed.

### Manual Check

You can also manually trigger a seed check:

```typescript
import { checkAndSeed } from './config/autoSeed';

// Check and seed if needed
await checkAndSeed();
```

### Start/Stop Periodic Seeding

```typescript
import { startAutoSeed, stopAutoSeed } from './config/autoSeed';

// Start periodic seeding (checks every 30 minutes)
const interval = startAutoSeed(30);

// Stop periodic seeding
stopAutoSeed(interval);
```

## Logs

The auto-seed feature logs its activities:

- `🌱 Auto-seeding users...` - When seeding starts
- `✅ Created user: email@example.com (role)` - When a new user is created
- `✅ Updated user: email@example.com (role)` - When an existing user is updated
- `✨ Auto-seeded X users (Y created, Z updated)` - Seeding summary
- `📦 Seed data not found. Auto-seeding database...` - When seed data is missing
- `✅ Seed data already exists in database` - When seed data is present

## Best Practices

1. **Development**: Keep auto-seeding enabled to ensure test data is always available
2. **Production**: Disable auto-seeding unless you specifically need it
3. **Testing**: Auto-seeding is automatically disabled in test environment
4. **Interval**: Set a reasonable interval (15-60 minutes) to avoid unnecessary database checks

## Technical Notes

- Uses native MongoDB driver to avoid Prisma transaction requirements
- Checks for seed data by looking for the admin user (`admin@example.com`)
- Uses `upsert` operations to create or update users
- Gracefully handles errors without crashing the application
- Automatically stops on application shutdown

## Troubleshooting

### Auto-seeding not working

1. Check if `PRISMA_AUTO_SEED` is set to `true`
2. Verify you're not in test or production mode (unless explicitly enabled)
3. Check application logs for error messages
4. Ensure database connection is working

### Seed data not persisting

- Auto-seed uses `upsert` operations, so data should persist
- If data is being deleted, check for other processes that might be clearing the database
- Verify database connection string is correct

### Too frequent checks

- Increase `PRISMA_AUTO_SEED_INTERVAL` to reduce check frequency
- Recommended minimum: 15 minutes

