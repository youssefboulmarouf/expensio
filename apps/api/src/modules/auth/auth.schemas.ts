import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Enter a valid email')
    .transform((v) => v.toLowerCase()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
  fullName: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
});

export const checkEmailSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Enter a valid email')
    .transform((v) => v.toLowerCase()),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type CheckEmailInput = z.infer<typeof checkEmailSchema>;
