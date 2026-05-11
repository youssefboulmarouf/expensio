import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  // Required
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL is required' })
    .startsWith('postgresql://', 'must start with postgresql://'),
  WEB_URL: z
    .string({ required_error: 'WEB_URL is required' })
    .regex(/^https?:\/\//, 'must start with http:// or https://'),
  JWT_SECRET: z
    .string({ required_error: 'JWT_SECRET is required' })
    .min(32, 'must be at least 32 characters'),

  // Optional with defaults
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number({ invalid_type_error: 'PORT must be a valid number' }).default(3001),
  JWT_EXPIRY: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),

  // Optional
  DIRECT_URL: z.string().startsWith('postgresql://').optional(),
  ALCHEMY_API_KEY: z.string().optional(),
  PINATA_API_KEY: z.string().optional(),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  console.error('\n❌ Environment variable validation failed:\n');
  for (const issue of result.error.issues) {
    const name = issue.path[0] ?? 'unknown';
    console.error(`  ${String(name)}: ${issue.message}`);
  }
  console.error('\nSee apps/api/.env.example for reference.\n');
  process.exit(1);
}

export const env = result.data;
