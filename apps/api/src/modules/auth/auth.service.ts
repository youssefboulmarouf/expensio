import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import type { RegisterInput } from './auth.schemas';

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export async function register(data: RegisterInput) {
  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) {
    throw new AppError('EMAIL_ALREADY_EXISTS', 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: { email: data.email, fullName: data.fullName, passwordHash },
    select: {
      id: true,
      email: true,
      fullName: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return { user };
}

export async function checkEmailAvailability(email: string) {
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  return { available: !existing };
}
