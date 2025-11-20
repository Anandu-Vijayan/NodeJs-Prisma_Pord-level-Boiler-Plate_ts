/**
 * Type definitions for seed data
 */

export interface SeedUser {
  name: string;
  email: string;
  role: string;
  contactNumber?: string;
  password?: string; // Optional - only set if provided
  isActive: boolean;
}

export interface SeedMigration {
  migrationId: string;
  description: string;
  timestamp: Date;
  seedUsers: SeedUser[];
}

export interface AppliedMigration {
  migrationId: string;
  appliedAt: Date;
}

