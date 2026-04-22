import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  SERVICE_NAME: z.string().default('spatiumai-worker'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  PARSER_SERVICE_URL: z.string().url().default('http://localhost:8001'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:8002'),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
  SENTRY_DSN: z.string().url().optional(),
});

function loadEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid worker environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
