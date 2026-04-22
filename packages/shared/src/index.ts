// ─────────────────────────────────────────────────────────────────────────────
// @spatiumai/shared — Barrel Export
// Single import point for all shared types and schemas.
// ─────────────────────────────────────────────────────────────────────────────

// Types
export type {
  SpaceType, WallType, OpeningType, FacingDirection, FileFormat,
  Point2D, BoundingBox, Room, Wall, Opening, AdjacencyEntry, SpatialGraph,
} from './types/spatial-graph';

export type {
  ConstraintDomain, ConstraintSeverity, CheckType, ThresholdUnit, SpaceTypeFilter,
  ConstraintKBEntry, ConstraintKBDraft,
} from './types/constraint-kb';

export type {
  EvaluationStatus, ProjectTypology,
  EvaluationResult, DomainSummary, EvaluationSummary, EvaluationEvent,
  EvaluationJobData,
} from './types/evaluation';

export type {
  ResolutionOption, ResolutionSet, ResolveRequest, ResolveResponse,
} from './types/resolution';

// Zod Schemas (for runtime validation)
export {
  SpatialGraphSchema, RoomSchema, WallSchema, OpeningSchema, AdjacencyEntrySchema,
} from './schemas/spatial-graph.schema';

export {
  ConstraintKBEntrySchema, ConstraintKBDraftSchema, ConstraintDomainSchema,
  ConstraintSeveritySchema, CheckTypeSchema,
} from './schemas/constraint-kb.schema';

export {
  CreateEvaluationSchema, EvaluationJobDataSchema, EvaluationResultSchema,
  EvaluationStatusSchema, ProjectTypologySchema,
} from './schemas/evaluation.schema';
