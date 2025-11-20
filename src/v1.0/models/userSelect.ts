/**
 * User Select Fields
 * Reusable select configurations for Prisma user queries
 */

/**
 * Select fields for user queries (excludes password)
 * Use this for all user queries that return data to clients
 */
export const userSelectFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Select fields for user queries including password
 * Use this ONLY for authentication operations (login, password verification)
 */
export const userSelectWithPassword = {
  id: true,
  name: true,
  email: true,
  password: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Select fields for minimal user info (for existence checks)
 * Use this when you only need to check if user exists
 */
export const userSelectMinimal = {
  id: true,
  email: true,
} as const;

