// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — Server Entry Point
// Initialises Sentry first, then connects DB, then starts HTTP server.
// ─────────────────────────────────────────────────────────────────────────────
import { initSentry } from './lib/sentry'; // must be first
initSentry();

import { buildApp } from './app';
import { env } from './config/env';
import { connectDb, closeDb } from './db/client';
import { logger } from './lib/logger';

async function main() {
  // 1. Verify DB connection before accepting traffic
  await connectDb();

  // 2. Build and start Fastify
  const app = await buildApp();

  await app.listen({ port: env.PORT, host: env.HOST });
  logger.info(
    { port: env.PORT, env: env.NODE_ENV },
    `spatiumai-api listening on :${env.PORT}`
  );

  // 3. Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutdown signal received');
    await app.close();
    await closeDb();
    logger.info('Graceful shutdown complete');
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error({ err }, 'Failed to start spatiumai-api');
  process.exit(1);
});
