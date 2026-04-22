// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-worker — Worker Entry Point
// ─────────────────────────────────────────────────────────────────────────────
import { initSentry } from './lib/sentry';
initSentry();

import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import type { EvaluationJobData } from '@spatiumai/shared';
import { EVALUATION_QUEUE_NAME, createRedisConnection } from './queues/evaluation.queue';
import { processEvaluationJob } from './processors/evaluation.processor';
import { ParserClient } from './clients/parser.client';
import { AIClient } from './clients/ai.client';
import { logger } from './lib/logger';
import { env } from './config/env';

async function main() {
  logger.info({ env: env.NODE_ENV }, 'spatiumai-worker starting');

  // Clients for downstream services
  const parserClient = new ParserClient(env.PARSER_SERVICE_URL);
  const aiClient = new AIClient(env.AI_SERVICE_URL);

  // Redis pub/sub publisher (separate connection from BullMQ)
  const publisher = new IORedis(env.REDIS_URL);

  // Verify downstream services are reachable
  const [parserUp, aiUp] = await Promise.all([
    parserClient.health(),
    aiClient.health(),
  ]);
  logger.info({ parserUp, aiUp }, 'Downstream service health check');

  // TODO Sprint 1: connect to DB for updating evaluation status
  const db = null as any; // placeholder

  const worker = new Worker<EvaluationJobData>(
    EVALUATION_QUEUE_NAME,
    async (job) => {
      await processEvaluationJob(job, parserClient, aiClient, publisher, db);
    },
    {
      connection: createRedisConnection(env.REDIS_URL),
      concurrency: env.WORKER_CONCURRENCY,
      // Stalled job detection — if job takes > 5 min, mark as stalled
      stalledInterval: 30_000,
      maxStalledCount: 2,
    }
  );

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id, evaluationId: job.data.evaluationId }, 'Job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Job failed');
  });

  worker.on('error', (err) => {
    logger.error({ err }, 'Worker error');
  });

  logger.info(
    { queue: EVALUATION_QUEUE_NAME, concurrency: env.WORKER_CONCURRENCY },
    'spatiumai-worker listening for jobs'
  );

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutdown signal received');
    await worker.close();
    await publisher.quit();
    logger.info('spatiumai-worker shutdown complete');
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error({ err }, 'Failed to start spatiumai-worker');
  process.exit(1);
});
