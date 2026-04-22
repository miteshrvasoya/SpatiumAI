// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — DB Schema: Constraint KB
// Every entry requires Ayush approval before active=true
// ─────────────────────────────────────────────────────────────────────────────
import {
  pgTable, uuid, varchar, pgEnum, boolean, decimal, jsonb, text, timestamp, real,
} from 'drizzle-orm/pg-core';

export const domainEnum = pgEnum('constraint_domain', [
  'nbc', 'vastu', 'ergonomics', 'circulation',
  'structural', 'daylight', 'fire', 'typology',
]);

export const severityEnum = pgEnum('constraint_severity', [
  'critical', 'major', 'advisory',
]);

export const checkTypeEnum = pgEnum('check_type', [
  'min_area', 'max_area', 'min_dimension', 'min_distance',
  'max_distance', 'ratio', 'orientation', 'adjacency', 'flag',
]);

export const constraintKb = pgTable('constraint_kb', {
  id: uuid('id').primaryKey().defaultRandom(),
  domain: domainEnum('domain').notNull(),

  /** e.g. "NBC-3-4.2.1", "VASTU-NE-TOILET" */
  code: varchar('code', { length: 100 }).notNull().unique(),

  /** PostgreSQL array of space types */
  spaceTypes: varchar('space_types', { length: 50 }).array().notNull(),
  jurisdiction: varchar('jurisdiction', { length: 100 }).array().notNull(),

  severity: severityEnum('severity').notNull(),
  checkType: checkTypeEnum('check_type').notNull(),

  thresholdValue: decimal('threshold_value', { precision: 10, scale: 4 }),
  thresholdUnit: varchar('threshold_unit', { length: 20 }),

  /**
   * What the architect sees.
   * Written by Ayush — never auto-generated.
   */
  plainDescription: text('plain_description').notNull(),

  /**
   * JSON array of strings — clues given to the LLM resolution generator.
   * e.g. ["Merge with adjacent corridor", "Extend into balcony space"]
   */
  resolutionHints: jsonb('resolution_hints').notNull().default([]),

  sourceReference: varchar('source_reference', { length: 500 }).notNull(),

  /**
   * Must be TRUE before this constraint can be active in production.
   * Set by Ayush after reviewing the entry.
   */
  ayushApproved: boolean('ayush_approved').notNull().default(false),

  active: boolean('active').notNull().default(false),

  /**
   * Automatically tracked post-launch.
   * If > 0.05, constraint goes into review queue.
   */
  falsePositiveRate: real('false_positive_rate'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ConstraintKBRow = typeof constraintKb.$inferSelect;
export type NewConstraintKBRow = typeof constraintKb.$inferInsert;
