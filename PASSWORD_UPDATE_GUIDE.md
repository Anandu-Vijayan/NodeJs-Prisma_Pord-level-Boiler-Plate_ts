# Password Update Guide

This guide explains all the ways to update passwords in this application.

## Table of Contents
1. [API Endpoints](#api-endpoints)
2. [Seed Migrations](#seed-migrations)
3. [Direct Database Update](#direct-database-update)

---

## 1. API Endpoints

### 1.1 Change Password (Recommended for Users)

**Endpoint:** `PUT /api/v1.0/auth/change-password`  
**Access:** Private (requires authentication)  
**Description:** Allows authenticated users to change their own password by providing the current password.

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Example using cURL:**
```bash
curl -X PUT http://localhost:4040/api/v1.0/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456"
  }'
```

**Example using JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:4040/api/v1.0/auth/change-password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    currentPassword: 'oldPassword123',
    newPassword: 'newPassword456'
  })
});
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

**Error Responses:**
- `400 Bad Request`: Missing current password or new password, or new password is too short
- `401 Unauthorized`: Current password is incorrect or user not authenticated

---

### 1.2 Update User (Admin/User Update)

**Endpoint:** `PUT /api/v1.0/users/:id`  
**Access:** Private (users can update themselves, admins can update any user)  
**Description:** Updates user information, including password. Note: This endpoint does NOT require the current password, so it should be used carefully.

**Request Body:**
```json
{
  "name": "Updated Name",
  "password": "newPassword456"
}
```

**Example using cURL:**
```bash
curl -X PUT http://localhost:4040/api/v1.0/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "password": "newPassword456"
  }'
```

**Note:** The password will be automatically hashed before being stored in the database.

---

## 2. Seed Migrations

### 2.1 Update Password in Seed Migration

To update passwords for seed data, you can add or update the `password` field in a seed migration file.

**Example: Update existing seed migration**

Edit `prisma/seed-migrations/20241120_000000_initial_seed.ts`:

```typescript
export const seedUsers: SeedUser[] = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    isActive: true,
    contactNumber: '1234567890',
    password: 'AdminPassword123', // Add password here
  },
  // ... other users
];
```

**Example: Create a new migration to update passwords**

1. Create a new migration file:
```bash
npm run seed:migrate:create
```

2. Edit the generated file to include password updates:

```typescript
import { SeedUser } from '../seed.types';

export const migrationId = '20241121_000000_update_passwords';
export const description = 'Update passwords for existing users';
export const timestamp = new Date('2024-11-21T00:00:00Z');

export const seedUsers: SeedUser[] = [
  {
    email: 'admin@example.com',
    password: 'NewAdminPassword123', // Only email and password needed for updates
  },
  {
    email: 'user@example.com',
    password: 'NewUserPassword123',
  },
];
```

3. Apply the migration:
```bash
npm run seed:migrate:apply
```

**Important Notes:**
- If you provide a `password` in the seed data, it will be hashed and stored.
- If you don't provide a `password`, the existing password will be preserved.
- Only include fields you want to update (email is required to identify the user).

---

## 3. Direct Database Update

### 3.1 Using MongoDB Shell

**Warning:** Direct database updates bypass application logic and should only be used for emergency situations or development.

1. Connect to MongoDB:
```bash
mongosh "mongodb://localhost:27017/nodejs-app"
```

2. Hash the password first (you'll need to generate a bcrypt hash):
   - Use an online bcrypt generator, or
   - Use Node.js to generate the hash:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = await bcrypt.hash('newPassword123', 10);
   console.log(hash);
   ```

3. Update the user:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { password: "$2a$10$YOUR_HASHED_PASSWORD_HERE" } }
);
```

### 3.2 Using Prisma Studio

1. Start Prisma Studio:
```bash
npm run prisma:studio
```

2. Navigate to the Users table
3. Find the user you want to update
4. **Note:** Prisma Studio will show the hashed password, but you cannot directly edit it with a plain text password. You'll need to hash it first using one of the methods above.

---

## Security Best Practices

1. **Always use the Change Password endpoint** for user-initiated password changes (requires current password verification).
2. **Use the Update User endpoint sparingly** and only when necessary (e.g., admin resetting a user's password).
3. **Never store plain text passwords** - all passwords are automatically hashed using bcrypt.
4. **Use strong passwords** - minimum 6 characters, but recommend 12+ with mixed case, numbers, and special characters.
5. **For seed data**, only include passwords in development environments, never in production seed files.

---

## Password Hashing Details

- **Algorithm:** bcrypt
- **Salt Rounds:** 10
- **Implementation:** `bcryptjs` library
- **Location:** `src/v1.0/models/User.ts`

The password is automatically hashed in:
- User registration
- User creation (admin)
- User update (when password is provided)
- Password change endpoint
- Seed migrations (when password is provided)

---

## Troubleshooting

### Password not updating via API
- Check that you're sending the correct JWT token
- Verify the user ID in the URL matches the authenticated user (or you're an admin)
- Ensure the password field is included in the request body

### Password not updating in seed migration
- Verify the migration file has the `password` field in the `seedUsers` array
- Check that the migration has been applied: `npm run seed:migrate:status`
- Ensure the email matches exactly (case-sensitive)

### Forgot password functionality
Currently, there is no "forgot password" or "reset password" endpoint. You would need to:
1. Use the Update User endpoint (admin only)
2. Or implement a forgot password flow with email verification

---

## Related Files

- `src/v1.0/controller/auth.ts` - Change password endpoint
- `src/v1.0/controller/users.ts` - Update user endpoint
- `src/v1.0/models/User.ts` - Password hashing utilities
- `prisma/seed-migrate.ts` - Seed migration logic
- `prisma/seed-migrations/` - Seed migration files

