// ─────────────────────────────────────────────────────────────────────────────
// SpatiumAI — Evaluation Types
// Types for the end-to-end evaluation lifecycle:
//   POST /evaluations → job queued → worker processes → WebSocket events → result
// ─────────────────────────────────────────────────────────────────────────────

import type { ConstraintDomain, ConstraintSeverity } from './constraint-kb';
import type { SpatialGraph } from './spatial-graph';

export type EvaluationStatus =
  | 'queued'
  | 'parsing'
  | 'evaluating'
  | 'complete'
  | 'failed';

export type ProjectTypology = 'residential' | 'commercial' | 'institutional' | 'mixed';

/**
 * The result for a single constraint check against a spatial graph.
 */
export interface EvaluationResult {
  constraintId: string;
  constraintCode: string; // e.g. "NBC-3-4.2.1"
  domain: ConstraintDomain;
  severity: ConstraintSeverity;

  passed: boolean;

  /** Room/wall/opening IDs from the spatial graph that triggered this result */
  affectedElementIds: string[];

  /** The actual measured value (e.g. 8.2 for a room area) */
  measuredValue?: number;

  /** The threshold that was checked against (e.g. 9.5 for NBC min bedroom area) */
  thresholdValue?: number;
  unit?: string;

  /**
   * Ayush-written description shown to the architect.
   * E.g. "Bedroom 2 area is 8.2 m² — below NBC minimum of 9.5 m²"
   */
  description: string;

  /** Whether the architect dismissed this finding (marked not applicable) */
  dismissed?: boolean;
  dismissedAt?: string;
  dismissedBy?: string; // user ID
}

/**
 * Per-domain summary rolled up from individual EvaluationResults.
 */
export interface DomainSummary {
  domain: ConstraintDomain;
  totalChecks: number;
  passed: number;
  failed: number;
  advisories: number;
  score: number; // 0-100 domain-level score
}

/**
 * The complete evaluation summary stored in PostgreSQL and returned to the frontend.
 */
export interface EvaluationSummary {
  evaluationId: string;
  projectId: string;
  status: EvaluationStatus;

  /** Overall compliance score 0–100. Weighted across all domains. */
  complianceScore: number;

  /** Vastu-specific score 0–100. Only populated when project.vastu_enabled = true */
  vastuScore?: number;

  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  advisoryChecks: number;

  domainSummaries: DomainSummary[];
  results: EvaluationResult[];

  /** Full spatial graph stored for floor plan rendering. Not included in list views. */
  spatialGraph?: SpatialGraph;

  durationMs?: number;
  createdAt: string; // ISO 8601
  completedAt?: string;
  failureReason?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// WebSocket Event Types (API → Frontend)
// The API service publishes these over WebSocket after consuming from Redis pub/sub.
// ─────────────────────────────────────────────────────────────────────────────

export type EvaluationEvent =
  | {
      type: 'queued';
      evaluationId: string;
      timestamp: string;
    }
  | {
      type: 'parsing';
      evaluationId: string;
      progress: number; // 0–100
      timestamp: string;
    }
  | {
      type: 'evaluating';
      evaluationId: string;
      domain: ConstraintDomain;
      domainProgress: number; // 0–8 (how many of 8 domains complete)
      progress: number; // 0–100 overall
      timestamp: string;
    }
  | {
      type: 'complete';
      evaluationId: string;
      summary: EvaluationSummary;
      timestamp: string;
    }
  | {
      type: 'failed';
      evaluationId: string;
      error: string;
      timestamp: string;
    };

// ─────────────────────────────────────────────────────────────────────────────
// BullMQ Job Payload Types
// ─────────────────────────────────────────────────────────────────────────────

export interface EvaluationJobData {
  evaluationId: string;
  projectId: string;
  organizationId: string;
  fileKey: string; // S3 object key
  fileFormat: 'dxf' | 'ifc' | 'pdf' | 'image';
  options: {
    vastuEnabled: boolean;
    jurisdiction: string;
    typology: ProjectTypology;
  };
}
