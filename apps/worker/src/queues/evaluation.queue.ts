// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-worker — BullMQ Queue Definition
// Shared queue reference used by API (to enqueue) and worker (to process).
// ─────────────────────────────────────────────────────────────────────────────
import { Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import type { EvaluationJobData } from '@spatiumai/shared';

export const EVALUATION_QUEUE_NAME = 'evaluations';

/**
 * Creates the Redis connection for BullMQ.
 * BullMQ requires a dedicated ioredis connection — not shared with other uses.
 */
export function createRedisConnection(url: string) {
  return new IORedis(url, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
  });
}

/**
 * The evaluation job queue — referenced by both API (enqueue) and worker (process).
 */
export function createEvaluationQueue(redisUrl: string) {
  const connection = createRedisConnection(redisUrl);
  return new Queue<EvaluationJobData>(EVALUATION_QUEUE_NAME, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2_000,
      },
      removeOnComplete: { age: 86_400 }, // keep 24h for debugging
      removeOnFail: { age: 604_800 },    // keep 7 days for forensics
    },
  });
}

export function createQueueEvents(redisUrl: string) {
  const connection = createRedisConnection(redisUrl);
  return new QueueEvents(EVALUATION_QUEUE_NAME, { connection });
}
