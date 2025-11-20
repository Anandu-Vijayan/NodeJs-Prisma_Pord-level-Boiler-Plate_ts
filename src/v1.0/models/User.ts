import { User as PrismaUser } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { userSelectFields } from './userSelect';

export interface IUser extends PrismaUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = IUser;

// Helper function to hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Helper function to compare password
export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

// Helper function to create user with hashed password
export const createUserWithPassword = async (
  data: Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt' | 'password'> & { password: string },
): Promise<Omit<PrismaUser, 'password'>> => {
  const { prisma } = await import('../../config/database');
  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: userSelectFields,
  });

  return user;
};

// Re-export Prisma User type for convenience
export { PrismaUser as User };
