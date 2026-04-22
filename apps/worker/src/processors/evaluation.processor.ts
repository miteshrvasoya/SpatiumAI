// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-worker — Evaluation Job Processor
// Core logic: parser call → constraint eval → AI resolve → publish result
// ─────────────────────────────────────────────────────────────────────────────
import type { Job } from 'bullmq';
import type { EvaluationJobData, EvaluationEvent } from '@spatiumai/shared';
import { SpatialGraphSchema } from '@spatiumai/shared';
import { logger } from '../lib/logger';
import { captureError } from '../lib/sentry';
import { ParserClient } from '../clients/parser.client';
import { AIClient } from '../clients/ai.client';

/**
 * Publishes a WebSocket progress event to Redis pub/sub.
 * The API service subscribes and forwards to the client WebSocket.
 */
async function publishEvent(
  publisher: import('ioredis').Redis,
  event: EvaluationEvent
): Promise<void> {
  await publisher.publish(
    `evaluation:${event.evaluationId}`,
    JSON.stringify(event)
  );
}

export async function processEvaluationJob(
  job: Job<EvaluationJobData>,
  parserClient: ParserClient,
  aiClient: AIClient,
  publisher: import('ioredis').Redis,
  db: import('drizzle-orm/node-postgres').NodePgDatabase
): Promise<void> {
  const { evaluationId, projectId, organizationId, fileKey, fileFormat, options } = job.data;
  const jobLogger = logger.child({ evaluationId, projectId, jobId: job.id });

  jobLogger.info('Processing evaluation job');

  try {
    // ── Step 1: Parse file → SpatialGraph ──────────────────────────────────
    await publishEvent(publisher, {
      type: 'parsing',
      evaluationId,
      progress: 10,
      timestamp: new Date().toISOString(),
    });

    const rawGraph = await parserClient.parseFile({ fileKey, fileFormat });

    // Validate parser output against schema before trusting it
    const graphResult = SpatialGraphSchema.safeParse(rawGraph);
    if (!graphResult.success) {
      throw new Error(
        `Parser returned invalid SpatialGraph: ${JSON.stringify(graphResult.error.flatten())}`
      );
    }
    const spatialGraph = graphResult.data;

    jobLogger.info(
      { roomCount: spatialGraph.rooms.length, totalAreaSqm: spatialGraph.totalAreaSqm },
      'Spatial graph parsed and validated'
    );

    // ── Step 2: Constraint Evaluation (Sprint 1 — stubs for now) ───────────
    // TODO Sprint 1: implement actual constraint evaluation engine
    // For now, publish evaluating events with domain progress
    const domains = ['nbc', 'vastu', 'ergonomics', 'circulation', 'structural', 'daylight', 'fire', 'typology'] as const;
    for (const [i, domain] of domains.entries()) {
      await publishEvent(publisher, {
        type: 'evaluating',
        evaluationId,
        domain,
        domainProgress: i + 1,
        progress: 20 + (i / domains.length) * 60,
        timestamp: new Date().toISOString(),
      });
      // Remove this in Sprint 1 when real evaluation runs
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // ── Step 3: AI Resolution Generation (Sprint 4) ─────────────────────────
    // TODO Sprint 4: call aiClient.resolve() for each failed constraint

    // ── Step 4: Store result and publish complete ────────────────────────────
    // TODO Sprint 1: update evaluations table in DB with results

    await publishEvent(publisher, {
      type: 'complete',
      evaluationId,
      summary: {
        evaluationId,
        projectId,
        status: 'complete',
        complianceScore: 0, // placeholder
        totalChecks: 0,
        passedChecks: 0,
        failedChecks: 0,
        advisoryChecks: 0,
        domainSummaries: [],
        results: [],
        spatialGraph,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });

    jobLogger.info({ durationMs: Date.now() - (job.timestamp ?? 0) }, 'Evaluation job complete');

  } catch (error) {
    jobLogger.error({ err: error }, 'Evaluation job failed');
    captureError(error, { evaluationId, projectId, organizationId, jobId: job.id });

    await publishEvent(publisher, {
      type: 'failed',
      evaluationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }).catch(() => { /* swallow pub/sub errors on failure path */ });

    throw error; // re-throw so BullMQ marks as failed and retries
  }
}
