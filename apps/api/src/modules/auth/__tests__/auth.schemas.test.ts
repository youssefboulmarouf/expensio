import { describe, it, expect } from 'vitest';
import { registerSchema, checkEmailSchema } from '../auth.schemas';

const validRegister = {
  email: 'Test@Example.COM',
  password: 'password123',
  fullName: 'Jane Doe',
};

describe('registerSchema', () => {
  it('accepts valid input', () => {
    const result = registerSchema.safeParse(validRegister);
    expect(result.success).toBe(true);
  });

  it('lowercases the email', () => {
    const result = registerSchema.safeParse(validRegister);
    expect(result.success && result.data.email).toBe('test@example.com');
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({ ...validRegister, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing email', () => {
    const result = registerSchema.safeParse({
      password: validRegister.password,
      fullName: validRegister.fullName,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ ...validRegister, password: 'short' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/8 characters/);
    }
  });

  it('rejects a fullName shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validRegister, fullName: 'J' });
    expect(result.success).toBe(false);
  });

  it('rejects a fullName longer than 100 characters', () => {
    const result = registerSchema.safeParse({ ...validRegister, fullName: 'J'.repeat(101) });
    expect(result.success).toBe(false);
  });
});

describe('checkEmailSchema', () => {
  it('accepts a valid email and lowercases it', () => {
    const result = checkEmailSchema.safeParse({ email: 'USER@EXAMPLE.COM' });
    expect(result.success).toBe(true);
    expect(result.success && result.data.email).toBe('user@example.com');
  });

  it('rejects an invalid email', () => {
    const result = checkEmailSchema.safeParse({ email: 'not-valid' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing email', () => {
    const result = checkEmailSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
