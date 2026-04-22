// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — Drizzle ORM Client
// ─────────────────────────────────────────────────────────────────────────────
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../config/env';
import { logger } from '../lib/logger';
import * as schema from './schema';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected PostgreSQL pool error');
  process.exit(1);
});

export const db = drizzle(pool, { schema, logger: env.NODE_ENV === 'development' });

export async function connectDb(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    logger.info('PostgreSQL connection established');
  } finally {
    client.release();
  }
}

export async function closeDb(): Promise<void> {
  await pool.end();
  logger.info('PostgreSQL pool closed');
}
