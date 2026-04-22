// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — DB Schema: Evaluations
// Core table — stores spatial graph, results, and scores.
// ─────────────────────────────────────────────────────────────────────────────
import {
  pgTable, uuid, varchar, pgEnum, integer, jsonb, timestamp,
} from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const evaluationStatusEnum = pgEnum('evaluation_status', [
  'queued', 'parsing', 'evaluating', 'complete', 'failed',
]);

export const fileFormatEnum = pgEnum('file_format', [
  'dxf', 'ifc', 'pdf', 'image',
]);

export const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),

  /** S3 object key of the uploaded file */
  fileKey: varchar('file_key', { length: 500 }).notNull(),
  fileFormat: fileFormatEnum('file_format').notNull(),

  status: evaluationStatusEnum('status').notNull().default('queued'),

  /**
   * Full SpatialGraph JSON from the parser service.
   * Stored as JSONB for flexible querying and floor plan rendering.
   */
  spatialGraph: jsonb('spatial_graph'),

  /**
   * Array of EvaluationResult objects from the constraint engine.
   * Stored as JSONB — queried in full on the evaluation detail page.
   */
  constraintResults: jsonb('constraint_results'),

  /** Weighted compliance score 0–100 across all domains */
  complianceScore: integer('compliance_score'),

  /** Vastu-specific score 0–100 */
  vastuScore: integer('vastu_score'),

  /** Total wall-clock time from queue entry to completion */
  durationMs: integer('duration_ms'),

  /** Set when status = 'failed' */
  failureReason: varchar('failure_reason', { length: 1000 }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;
