# Prisma Auto-Migration Guide

This boilerplate includes automatic database schema synchronization using Prisma's `db push` command.

## How It Works

When the application starts, it automatically runs `prisma db push` to sync your Prisma schema (`prisma/schema.prisma`) with your MongoDB database. This ensures your database structure always matches your schema definition.

## Configuration

### Environment Variable

Control auto-migration behavior using the `PRISMA_AUTO_MIGRATE` environment variable:

```env
# Enable auto-migration explicitly
PRISMA_AUTO_MIGRATE=true

# Disable auto-migration
PRISMA_AUTO_MIGRATE=false

# Default behavior (enabled in development, disabled in production/test)
# (omit the variable or leave it unset)
```

### Default Behavior

- **Development mode**: Auto-migration is **enabled** by default
- **Production mode**: Auto-migration is **disabled** by default
- **Test mode**: Auto-migration is **disabled** (tests handle their own database setup)

## Usage

### Development

In development, auto-migration runs automatically when you start the server:

```bash
npm run dev
```

You'll see logs like:
```
Starting database schema synchronization...
Database schema synchronized successfully
Database connected successfully
```

### Production

In production, auto-migration is disabled by default for safety. To enable it:

1. Set `PRISMA_AUTO_MIGRATE=true` in your production `.env` file
2. Or run migrations manually before deployment:
   ```bash
   npx prisma db push
   ```

### Manual Migration

You can always run migrations manually:

```bash
# Sync schema to database
npx prisma db push

# Generate Prisma Client (required after schema changes)
npx prisma generate
```

## How It Works Internally

1. On application startup, `connectDB()` is called
2. If auto-migration is enabled, `runMigration()` executes `npx prisma db push`
3. The schema is synchronized with the database
4. The Prisma Client connects to the database
5. The application continues normal startup

## Error Handling

If auto-migration fails:
- The error is logged
- The application continues to start (doesn't crash)
- You can check the logs for migration issues
- Manual migration can be run to fix issues

## Best Practices

1. **Development**: Keep auto-migration enabled for convenience
2. **Production**: 
   - Option A: Disable auto-migration and run migrations manually during deployment
   - Option B: Enable auto-migration if you want automatic schema updates
3. **CI/CD**: Run migrations as part of your deployment pipeline
4. **Team Development**: Commit schema changes to version control, let auto-migration handle the rest

## Schema Changes

When you modify `prisma/schema.prisma`:

1. The changes are automatically applied on next startup (if auto-migration is enabled)
2. Or run `npx prisma db push` manually
3. Regenerate Prisma Client: `npx prisma generate`
4. Restart your application

## Example Workflow

```bash
# 1. Modify prisma/schema.prisma
# 2. Start the application
npm run dev

# Auto-migration runs automatically:
# - Schema changes are detected
# - Database is updated
# - Application starts successfully
```

## Troubleshooting

### Migration Fails

If auto-migration fails:
1. Check your `DATABASE_URL` is correct
2. Ensure MongoDB is running and accessible
3. Check Prisma schema syntax
4. Review error logs for specific issues
5. Run `npx prisma db push` manually to see detailed errors

### Schema Not Updating

If schema changes aren't being applied:
1. Verify `PRISMA_AUTO_MIGRATE` is set correctly
2. Check that you're in the right environment (dev vs prod)
3. Ensure Prisma Client is regenerated: `npx prisma generate`
4. Restart the application

### Performance Concerns

Auto-migration adds a small delay on startup. If this is a concern:
- Disable in production: `PRISMA_AUTO_MIGRATE=false`
- Run migrations manually during deployment
- Use CI/CD pipelines for migration management

