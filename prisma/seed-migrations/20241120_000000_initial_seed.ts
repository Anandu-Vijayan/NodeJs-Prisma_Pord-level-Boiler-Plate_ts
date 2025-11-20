/**
 * Initial Seed Migration
 * Date: 2024-11-20
 * Description: Initial seed data for users
 * 
 * Note: Password is optional. Only include password field if you want to set/update passwords.
 * If password is not provided, existing passwords will be preserved or users will be created without passwords.
 */

import { SeedUser } from '../seed.types';

export const migrationId = '20241120_000000_initial_seed';
export const description = 'Initial seed data for users';
export const timestamp = new Date('2024-11-20T00:00:00Z');

export const seedUsers: SeedUser[] = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    contactNumber: '1234567890',
    password: 'Admin123!', // Password will be automatically hashed
    isActive: true,
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    contactNumber: '1234567890',
    password: 'User123!', // Password will be automatically hashed
    isActive: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    contactNumber: '1234567890',
    password: 'User123!', // Password will be automatically hashed
    isActive: true,
  },
  {
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'user',
    contactNumber: '1234567890',
    password: 'User123!', // Password will be automatically hashed
    isActive: true,
  },
  {
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'user',
    contactNumber: '1234567890',
    password: 'User123!', // Password will be automatically hashed
    isActive: true,
  },
  {
    name: 'Inactive User',
    email: 'inactive@example.com',
    role: 'user',
    contactNumber: '1234567890',
    // No password - user will be created without password or existing password preserved
    isActive: false,
  },
];
