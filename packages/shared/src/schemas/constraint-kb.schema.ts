// ─────────────────────────────────────────────────────────────────────────────
// SpatiumAI — Zod Schemas for Constraint KB
// Used by pre-commit hook to validate KB entries before they can be merged.
// ─────────────────────────────────────────────────────────────────────────────
import { z } from 'zod';

export const ConstraintDomainSchema = z.enum([
  'nbc', 'vastu', 'ergonomics', 'circulation',
  'structural', 'daylight', 'fire', 'typology',
]);

export const ConstraintSeveritySchema = z.enum(['critical', 'major', 'advisory']);

export const CheckTypeSchema = z.enum([
  'min_area', 'max_area', 'min_dimension', 'min_distance',
  'max_distance', 'ratio', 'orientation', 'adjacency', 'flag',
]);

export const ThresholdUnitSchema = z.enum(['sqm', 'm', 'mm', 'ratio', 'percent', 'count']);

export const SpaceTypeFilterSchema = z.enum([
  'bedroom', 'living', 'dining', 'kitchen', 'bathroom', 'toilet',
  'corridor', 'staircase', 'balcony', 'utility', 'pooja', 'garage',
  'lobby', 'all',
]);

export const ConstraintKBEntrySchema = z.object({
  id: z.string().uuid(),
  domain: ConstraintDomainSchema,
  code: z.string().regex(/^[A-Z]+-[A-Z0-9-]+$/, 'Code must be DOMAIN-RULE format, e.g. NBC-3-4.2.1'),
  spaceTypes: z.array(SpaceTypeFilterSchema).min(1),
  severity: ConstraintSeveritySchema,
  checkType: CheckTypeSchema,
  thresholdValue: z.number().optional(),
  thresholdUnit: ThresholdUnitSchema.optional(),
  plainDescription: z.string().min(10, 'plainDescription must be at least 10 chars — write it properly'),
  resolutionHints: z.array(z.string().min(5)).min(1, 'At least one resolution hint required'),
  jurisdiction: z.array(z.string()).min(1),
  sourceReference: z.string().min(5, 'Source reference required — e.g. "NBC 2016 Part 3 Section 4.2.1"'),
  ayushApproved: z.boolean(),
  active: z.boolean(),
  falsePositiveRate: z.number().min(0).max(1).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).refine(
  (entry) => {
    // Numeric check types require a threshold value and unit
    const numericCheckTypes = ['min_area', 'max_area', 'min_dimension', 'min_distance', 'max_distance', 'ratio'];
    if (numericCheckTypes.includes(entry.checkType)) {
      return entry.thresholdValue !== undefined && entry.thresholdUnit !== undefined;
    }
    return true;
  },
  { message: 'Numeric check types (min_area, ratio, etc.) require thresholdValue and thresholdUnit' }
);

// Base object schema before the .refine — used for ConstraintKBDraftSchema composition
const _ConstraintKBBaseSchema = z.object({
  id: z.string().uuid(),
  domain: ConstraintDomainSchema,
  code: z.string().regex(/^[A-Z]+-[A-Z0-9-]+$/, 'Code must be DOMAIN-RULE format, e.g. NBC-3-4.2.1'),
  spaceTypes: z.array(SpaceTypeFilterSchema).min(1),
  jurisdiction: z.array(z.string()).min(1),
  severity: ConstraintSeveritySchema,
  checkType: CheckTypeSchema,
  thresholdValue: z.number().optional(),
  thresholdUnit: ThresholdUnitSchema.optional(),
  plainDescription: z.string().min(10),
  resolutionHints: z.array(z.string().min(5)).min(1),
  sourceReference: z.string().min(5),
  ayushApproved: z.boolean(),
  active: z.boolean(),
  falsePositiveRate: z.number().min(0).max(1).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/** For drafting a new KB entry — plainDescription optional, ayushApproved must be false */
export const ConstraintKBDraftSchema = _ConstraintKBBaseSchema
  .omit({ id: true, falsePositiveRate: true, createdAt: true, updatedAt: true })
  .extend({
    plainDescription: z.string().optional(),
    ayushApproved: z.literal(false),
  });

export type ConstraintKBEntry = z.infer<typeof ConstraintKBEntrySchema>;
export type ConstraintKBDraft = z.infer<typeof ConstraintKBDraftSchema>;
