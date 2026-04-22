// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — Environment Configuration
// Type-safe env validation. Fails fast on startup if required vars are missing.
// ─────────────────────────────────────────────────────────────────────────────
import { z } from 'zod';

const envSchema = z.object({
  // Service
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  HOST: z.string().default('0.0.0.0'),
  SERVICE_NAME: z.string().default('spatiumai-api'),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().default(7),

  // Sentry
  SENTRY_DSN: z.string().url().optional(),

  // AWS S3
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  // Internal service URLs (for worker → parser/ai calls)
  PARSER_SERVICE_URL: z.string().url().default('http://localhost:8001'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:8002'),

  // Rate limiting
  RATE_LIMIT_MAX: z.coerce.number().default(60),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),

  // CORS
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
});

function loadEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
export type Env = typeof env;
