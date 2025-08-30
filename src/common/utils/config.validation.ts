// config.validation.ts
import { z } from 'zod';

export const configValidationSchema = z.object({
  // Database Configuration
  DATABASE_HOST: z.string({
    required_error: 'DATABASE_HOST is required',
  }),
  DATABASE_PORT: z
    .string()
    .default('5432')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'DATABASE_PORT must be a number',
    }),
  DATABASE_NAME: z.string({
    required_error: 'DATABASE_NAME is required',
  }),
  DATABASE_USERNAME: z.string({
    required_error: 'DATABASE_USERNAME is required',
  }),
  DATABASE_PASSWORD: z.string({
    required_error: 'DATABASE_PASSWORD is required',
  }),

  // Supabase Configuration
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // JWT Configuration
  JWT_SECRET: z.string({
    required_error: 'JWT_SECRET is required',
  }),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  // App Configuration
  NODE_ENV: z.string().default('development'),
  PORT: z
    .string()
    .default('3000')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'PORT must be a number',
    }),

  // Logging
  LOG_LEVEL: z.string().default('debug'),

  // Bcrypt Configuration
  BCRYPT_SALT_ROUNDS: z
    .string()
    .default('12')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'BCRYPT_SALT_ROUNDS must be a number',
    }),
});
