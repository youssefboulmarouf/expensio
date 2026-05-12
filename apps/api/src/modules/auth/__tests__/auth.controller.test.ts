import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../auth.service', () => ({
  AppError: class AppError extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
    }
  },
  register: vi.fn(),
  checkEmailAvailability: vi.fn(),
}));

import app from '../../../app';
import * as authService from '../auth.service';
import { AppError } from '../auth.service';

const mockRegister = vi.mocked(authService.register);
const mockCheckEmail = vi.mocked(authService.checkEmailAvailability);

const validBody = {
  email: 'test@example.com',
  password: 'password123',
  fullName: 'Test User',
};

const mockUserResponse = {
  user: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    fullName: 'Test User',
    emailVerified: false,
    createdAt: new Date().toISOString(),
  },
};

describe('POST /auth/register', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 201 with user on success (no token)', async () => {
    mockRegister.mockResolvedValue(mockUserResponse as never);

    const res = await request(app).post('/auth/register').send(validBody);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test@example.com');
    expect(res.body.data).not.toHaveProperty('accessToken');
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
  });

  it('returns 409 with EMAIL_ALREADY_EXISTS when email is taken', async () => {
    mockRegister.mockRejectedValue(
      new AppError('EMAIL_ALREADY_EXISTS', 'An account with this email already exists'),
    );

    const res = await request(app).post('/auth/register').send(validBody);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
    expect(res.body.error.message).toBe('An account with this email already exists');
  });

  it('returns 422 with field map for invalid input', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'not-an-email',
      password: 'short',
      fullName: 'J',
    });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toBe('Invalid input');
    expect(res.body.error.details).toMatchObject({ email: expect.any(String) });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('returns 422 when required fields are missing', async () => {
    const res = await request(app).post('/auth/register').send({});

    expect(res.status).toBe(422);
    expect(res.body.error.details).toMatchObject({
      email: expect.any(String),
      password: expect.any(String),
      fullName: expect.any(String),
    });
  });

  it('returns 500 with error details in non-production environments', async () => {
    mockRegister.mockRejectedValue(new Error('DB connection lost'));

    const res = await request(app).post('/auth/register').send(validBody);

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(res.body.error.details.message).toBe('DB connection lost');
    expect(res.body.error.details.stack).toMatch(/Error: DB connection lost/);
  });
});

describe('GET /auth/check-email', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 200 with available: true for a free email', async () => {
    mockCheckEmail.mockResolvedValue({ available: true });

    const res = await request(app).get('/auth/check-email?email=free@example.com');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.available).toBe(true);
  });

  it('returns 200 with available: false for a taken email', async () => {
    mockCheckEmail.mockResolvedValue({ available: false });

    const res = await request(app).get('/auth/check-email?email=taken@example.com');

    expect(res.status).toBe(200);
    expect(res.body.data.available).toBe(false);
  });

  it('returns 422 for an invalid email format', async () => {
    const res = await request(app).get('/auth/check-email?email=not-valid');

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toBe('Invalid email format');
    expect(mockCheckEmail).not.toHaveBeenCalled();
  });

  it('returns 422 when the email query param is missing', async () => {
    const res = await request(app).get('/auth/check-email');

    expect(res.status).toBe(422);
  });
});
