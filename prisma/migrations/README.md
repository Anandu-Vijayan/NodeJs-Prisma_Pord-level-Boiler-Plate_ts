# Prisma Migrations for MongoDB

## Important Note

MongoDB does not support traditional Prisma migrations. Prisma uses `db push` for MongoDB instead of `migrate`.

## How to Use

### For MongoDB (Current Setup)

1. **Apply Schema Changes:**
   ```bash
   npm run db:push
   # or
   npx prisma db push
   ```

2. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   # or
   npx prisma generate
   ```

3. **Seed Database:**
   ```bash
   npm run db:seed
   # or
   npm run prisma:seed
   ```

### Migration Workflow

1. **Modify `prisma/schema.prisma`** with your changes
2. **Push changes to database:**
   ```bash
   npm run db:push
   ```
3. **Regenerate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```
4. **Seed data (if needed):**
   ```bash
   npm run db:seed
   ```

## Migration History

Since MongoDB doesn't support migrations, we track schema changes manually:

### Initial Schema (2024-11-20)
- Created `User` model with:
  - id (ObjectId)
  - name (String)
  - email (String, unique)
  - password (String, optional)
  - role (String, default: "user")
  - isActive (Boolean, default: true)
  - createdAt (DateTime)
  - updatedAt (DateTime)

## Best Practices

1. **Version Control:** Always commit `prisma/schema.prisma` to version control
2. **Documentation:** Document schema changes in this README
3. **Testing:** Test schema changes in development before production
4. **Backup:** Backup database before applying schema changes in production

## Useful Commands

- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with dummy data
- `npm run db:reset` - Reset database and reseed (⚠️ deletes all data)
- `npm run prisma:studio` - Open Prisma Studio to view/edit data
- `npm run prisma:generate` - Regenerate Prisma Client

