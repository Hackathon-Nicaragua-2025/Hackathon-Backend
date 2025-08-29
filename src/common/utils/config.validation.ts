// config.validation.ts
import { z } from 'zod';

export const configValidationSchema = z.object({
  DB_TYPE: z.enum(['postgres', 'mysql', 'mariadb', 'sqlite', 'mssql']),
  DB_HOST: z.string({
    required_error: 'DB_HOST is required',
  }),
  DB_PORT: z
    .string({
      required_error: 'DB_PORT is required',
    })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'DB_PORT must be a number',
    }),
  DB_USERNAME: z.string({
    required_error: 'DB_USERNAME is required',
  }),
  DB_PASSWORD: z.string({
    required_error: 'DB_PASSWORD is required',
  }),
  DB_NAME: z.string({
    required_error: 'DB_NAME is required',
  }),
  DB_SYNCHRONIZE: z
    .string({
      required_error: 'DB_SYNCHRONIZE is required',
    })
    .transform((val) => val.toLowerCase() === 'true'),
  DB_LOGGING: z
    .string({
      required_error: 'DB_LOGGING is required',
    })
    .transform((val) => val.toLowerCase() === 'true'),
  DB_PREFIX: z.string({
    required_error: 'DB_PREFIX is required',
  }),
  PORT: z
    .string({
      required_error: 'PORT is required',
    })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'PORT must be a number',
    }),
  JWT_SECRET: z.string({
    required_error: 'JWT_SECRET is required',
  }),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z
    .string({
      required_error: 'JWT_ACCESS_TOKEN_EXPIRES_IN is required',
    })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'JWT_ACCESS_TOKEN_EXPIRES_IN must be a number',
    }),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z
    .string({
      required_error: 'JWT_REFRESH_TOKEN_EXPIRES_IN is required',
    })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'JWT_REFRESH_TOKEN_EXPIRES_IN must be a number',
    }),
  BCRYPT_SALT_ROUNDS: z
    .string({
      required_error: 'BCRYPT_SALT_ROUNDS is required',
    })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'BCRYPT_SALT_ROUNDS must be a number',
    }),
});
