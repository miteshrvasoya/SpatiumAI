// ─────────────────────────────────────────────────────────────────────────────
// SpatiumAI — Zod Schemas for Evaluations
// Validates job payloads, API request/response bodies, and WebSocket events.
// ─────────────────────────────────────────────────────────────────────────────
import { z } from 'zod';

export const EvaluationStatusSchema = z.enum([
  'queued', 'parsing', 'evaluating', 'complete', 'failed',
]);

export const ProjectTypologySchema = z.enum([
  'residential', 'commercial', 'institutional', 'mixed',
]);

// POST /v1/evaluations request body
export const CreateEvaluationSchema = z.object({
  projectId: z.string().uuid(),
  fileKey: z.string().min(1, 'fileKey (S3 object key) is required'),
  fileFormat: z.enum(['dxf', 'ifc', 'pdf', 'image']),
  options: z.object({
    vastuEnabled: z.boolean().default(true),
    jurisdiction: z.string().default('national'),
    typology: ProjectTypologySchema.default('residential'),
  }).default({}),
  idempotencyKey: z.string().optional(),
});

// BullMQ job data
export const EvaluationJobDataSchema = z.object({
  evaluationId: z.string().uuid(),
  projectId: z.string().uuid(),
  organizationId: z.string().uuid(),
  fileKey: z.string(),
  fileFormat: z.enum(['dxf', 'ifc', 'pdf', 'image']),
  options: z.object({
    vastuEnabled: z.boolean(),
    jurisdiction: z.string(),
    typology: ProjectTypologySchema,
  }),
});

export const EvaluationResultSchema = z.object({
  constraintId: z.string().uuid(),
  constraintCode: z.string(),
  domain: z.string(),
  severity: z.enum(['critical', 'major', 'advisory']),
  passed: z.boolean(),
  affectedElementIds: z.array(z.string()),
  measuredValue: z.number().optional(),
  thresholdValue: z.number().optional(),
  unit: z.string().optional(),
  description: z.string(),
  dismissed: z.boolean().optional(),
  dismissedAt: z.string().datetime().optional(),
  dismissedBy: z.string().uuid().optional(),
});

export type CreateEvaluation = z.infer<typeof CreateEvaluationSchema>;
export type EvaluationJobData = z.infer<typeof EvaluationJobDataSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
