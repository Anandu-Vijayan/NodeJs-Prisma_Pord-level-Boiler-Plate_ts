# How Password Encryption Works in Seed Data

This document explains exactly how passwords are encrypted (hashed) when seeding data.

## Overview

**Important:** Passwords are **hashed**, not encrypted. Hashing is a one-way process that cannot be reversed. This is the correct approach for password storage.

---

## The Encryption Process

### Step 1: You Provide Plain Text Password

In your seed migration file (`prisma/seed-migrations/20241120_000000_initial_seed.ts`):

```typescript
export const seedUsers: SeedUser[] = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin123!', // ← Plain text password (you provide this)
    role: 'admin',
    isActive: true,
  },
];
```

### Step 2: Migration System Detects Password

When you run `npm run seed:migrate:apply`, the system reads the seed file and checks if a password is provided.

**Location:** `prisma/seed-migrate.ts` - `applyMigration()` function

```typescript
// Line 118-121
if (userData.password) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userDataToSave.password = hashedPassword;
}
```

### Step 3: Password is Hashed Using bcrypt

The password is hashed using the **bcryptjs** library:

```typescript
import bcrypt from 'bcryptjs';

// Hash the password with 10 salt rounds
const hashedPassword = await bcrypt.hash(userData.password, 10);
```

**What happens:**
1. **Salt Generation:** bcrypt automatically generates a random salt
2. **Hashing:** The password + salt is hashed using the bcrypt algorithm
3. **Salt Rounds:** 10 rounds means the password is hashed 2^10 (1024) times
4. **Result:** A hashed string like `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

### Step 4: Hashed Password is Stored in Database

The hashed password (not the plain text) is saved to MongoDB:

```typescript
// For new users
await usersCollection.insertOne({
  ...userData,
  password: hashedPassword, // ← Hashed version stored
  createdAt: now,
  updatedAt: now,
});

// For existing users (update)
await usersCollection.updateOne(
  { email: userData.email },
  { $set: { ...updateData, password: hashedPassword } }
);
```

---

## Complete Flow Diagram

```
┌─────────────────────────────────────┐
│  Seed Migration File                │
│  password: 'Admin123!'              │  ← Plain text (you write this)
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  applyMigration() function          │
│  Checks: if (userData.password)    │  ← Detects password field
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  bcrypt.hash(password, 10)          │
│  - Generates random salt            │
│  - Hashes password + salt           │
│  - Repeats 2^10 times               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Hashed Password                    │
│  $2a$10$N9qo8uLOickgx2ZMRZoMye...   │  ← One-way hash (cannot reverse)
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  MongoDB Database                    │
│  { password: "$2a$10$..." }         │  ← Stored in database
└─────────────────────────────────────┘
```

---

## Technical Details

### Library Used: `bcryptjs`

**Package:** `bcryptjs`  
**Location:** `package.json` dependencies  
**Import:** `import bcrypt from 'bcryptjs';`

### Hash Algorithm: bcrypt

- **Type:** Adaptive hash function
- **Salt Rounds:** 10 (configurable, but 10 is standard)
- **Output Format:** `$2a$10$[22-char-salt][31-char-hash]`
- **Example:** `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

### Salt Rounds Explained

- **10 rounds** = 2^10 = 1,024 iterations
- Higher rounds = more secure but slower
- 10 is the industry standard balance

### Why bcrypt?

1. **One-way:** Cannot be reversed to get original password
2. **Slow by design:** Makes brute-force attacks difficult
3. **Salt included:** Each hash is unique even for same password
4. **Industry standard:** Widely used and trusted

---

## Code Locations

### 1. Seed Migration Logic

**File:** `prisma/seed-migrate.ts`  
**Function:** `applyMigration()`  
**Lines:** 118-121

```typescript
// Hash password only if provided
if (userData.password) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userDataToSave.password = hashedPassword;
}
```

### 2. User Model Helper

**File:** `src/v1.0/models/User.ts`  
**Function:** `hashPassword()`  
**Lines:** 12-15

```typescript
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
```

**Note:** The seed migration uses `bcrypt.hash()` directly, while the User model uses `bcrypt.genSalt()` first. Both produce the same result.

---

## Example: Complete Process

### Input (Seed File)

```typescript
{
  email: 'admin@example.com',
  password: 'Admin123!',
  name: 'Admin User',
}
```

### Processing

```typescript
// 1. Read password from seed data
const plainPassword = 'Admin123!';

// 2. Hash it
const hashedPassword = await bcrypt.hash(plainPassword, 10);
// Result: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

// 3. Store in database
await usersCollection.insertOne({
  email: 'admin@example.com',
  password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  name: 'Admin User',
});
```

### Output (Database)

```json
{
  "_id": ObjectId("..."),
  "email": "admin@example.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "name": "Admin User",
  "createdAt": ISODate("2024-11-20T00:00:00Z"),
  "updatedAt": ISODate("2024-11-20T00:00:00Z")
}
```

---

## Password Verification

When a user logs in, the system verifies the password:

**File:** `src/v1.0/controller/auth.ts`  
**Function:** `login()`

```typescript
// 1. Get user with hashed password from database
const user = await prisma.user.findUnique({
  where: { email },
  select: userSelectWithPassword,
});

// 2. Compare plain text password with hashed password
const isMatch = await comparePassword(password, user.password);
// comparePassword uses: bcrypt.compare(plainText, hashedPassword)

// 3. If match, user is authenticated
if (isMatch) {
  // Login successful
}
```

**How it works:**
- `bcrypt.compare()` extracts the salt from the stored hash
- Hashes the provided password with the same salt
- Compares the results
- Returns `true` if they match

---

## Security Features

### ✅ What's Protected

1. **Plain text never stored** - Only hashes in database
2. **Unique salts** - Each password has different hash
3. **Slow hashing** - Prevents brute-force attacks
4. **One-way process** - Cannot reverse to get original

### ⚠️ Important Notes

1. **Seed files contain plain text** - This is OK for development, but:
   - Never commit real passwords to production
   - Use environment variables for production seeds
   - Consider using password managers for seed data

2. **Same password = different hash** - Due to random salts:
   ```typescript
   // Same password, different hashes
   'Admin123!' → '$2a$10$abc123...'
   'Admin123!' → '$2a$10$xyz789...'
   ```

3. **Cannot recover original password** - If lost, must reset:
   - Use "forgot password" flow
   - Or admin reset via API

---

## Testing the Hashing

You can test the hashing process:

```typescript
import bcrypt from 'bcryptjs';

const password = 'Admin123!';
const hash = await bcrypt.hash(password, 10);
console.log('Hashed:', hash);

// Verify
const isMatch = await bcrypt.compare('Admin123!', hash);
console.log('Match:', isMatch); // true

const isWrong = await bcrypt.compare('WrongPassword', hash);
console.log('Wrong:', isWrong); // false
```

---

## Summary

1. **You provide:** Plain text password in seed file
2. **System detects:** Password field in seed data
3. **System hashes:** Using `bcrypt.hash(password, 10)`
4. **System stores:** Hashed password in database
5. **System verifies:** Using `bcrypt.compare()` on login

**Key Point:** The plain text password you write in the seed file is automatically converted to a secure hash before being stored in the database. You never need to manually hash passwords - the system does it for you!

---

## Related Files

- `prisma/seed-migrate.ts` - Migration logic with password hashing
- `src/v1.0/models/User.ts` - Password hashing utilities
- `src/v1.0/controller/auth.ts` - Password verification on login
- `package.json` - bcryptjs dependency

