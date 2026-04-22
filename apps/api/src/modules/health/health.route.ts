// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — Health Route
// GET /health     → liveness (is the process alive?)
// GET /health/ready → readiness (DB + Redis connected?)
// ─────────────────────────────────────────────────────────────────────────────
import type { FastifyInstance } from 'fastify';
import { db } from '../../db/client';
import { sql } from 'drizzle-orm';
import { env } from '../../config/env';

export async function healthRoutes(app: FastifyInstance) {
  /** Liveness — always 200 if process is running */
  app.get('/', async (_req, reply) => {
    return reply.send({
      status: 'ok',
      service: env.SERVICE_NAME,
      timestamp: new Date().toISOString(),
    });
  });

  /** Readiness — checks DB and Redis */
  app.get('/ready', async (_req, reply) => {
    const checks: Record<string, 'ok' | 'error'> = {};

    // PostgreSQL check
    try {
      await db.execute(sql`SELECT 1`);
      checks['postgres'] = 'ok';
    } catch {
      checks['postgres'] = 'error';
    }

    const allHealthy = Object.values(checks).every((v) => v === 'ok');

    return reply.status(allHealthy ? 200 : 503).send({
      status: allHealthy ? 'ready' : 'not_ready',
      service: env.SERVICE_NAME,
      checks,
      timestamp: new Date().toISOString(),
    });
  });
}
