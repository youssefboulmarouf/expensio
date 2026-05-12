import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('$2b$12$mockedhashvalue'),
    compare: vi.fn().mockResolvedValue(true),
  },
}));

import { prisma } from '../../../lib/prisma';
import { register, checkEmailAvailability, AppError } from '../auth.service';

const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockCreate = vi.mocked(prisma.user.create);

const baseInput = {
  email: 'test@example.com',
  password: 'password123',
  fullName: 'Test User',
};

const mockUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: baseInput.email,
  fullName: baseInput.fullName,
  emailVerified: false,
  createdAt: new Date('2026-01-01'),
};

describe('register', () => {
  beforeEach(() => vi.clearAllMocks());

  it('throws AppError with EMAIL_ALREADY_EXISTS when email is taken', async () => {
    mockFindUnique.mockResolvedValue(mockUser as never);

    await expect(register(baseInput)).rejects.toThrow(AppError);
    await expect(register(baseInput)).rejects.toMatchObject({
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'An account with this email already exists',
    });
  });

  it('creates user and returns user when email is free', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue(mockUser as never);

    const result = await register(baseInput);

    expect(result.user).toEqual(mockUser);
    expect(result).not.toHaveProperty('accessToken');
  });

  it('stores a hashed password, not the plaintext', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue(mockUser as never);

    await register(baseInput);

    const createArg = mockCreate.mock.calls[0]![0] as { data: { passwordHash: string } };
    expect(createArg.data.passwordHash).toBe('$2b$12$mockedhashvalue');
    expect(createArg.data.passwordHash).not.toBe(baseInput.password);
  });
});

describe('checkEmailAvailability', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns available: false when a user with that email exists', async () => {
    mockFindUnique.mockResolvedValue({ id: 'some-id' } as never);

    const result = await checkEmailAvailability('taken@example.com');
    expect(result).toEqual({ available: false });
  });

  it('returns available: true when no user has that email', async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await checkEmailAvailability('free@example.com');
    expect(result).toEqual({ available: true });
  });
});
