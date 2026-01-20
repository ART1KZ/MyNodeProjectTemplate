import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  BOT_TOKEN: z.string().min(1, 'BOT_TOKEN обязателен'),
  BOT_WEBHOOK_URL: z.string().url().optional(),
  BOT_WEBHOOK_SECRET: z.string().min(32).optional(),
  DATABASE_URL: z.string().url('DATABASE_URL должен быть валидным'),
  DB_POOL_SIZE: z.coerce.number().int().min(1).max(100).default(10),
  REDIS_URL: z.string().url().optional(),
  REDIS_PASSWORD: z.string().optional(),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().default(100),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const errors = result.error.issues
    .map(({ path, message }) => `  • ${path.join('.')}: ${message}`)
    .join('\n');
  throw new Error(`❌ Env validation failed:\n${errors}`);
}

export const config = result.data;
export type Config = typeof config;
