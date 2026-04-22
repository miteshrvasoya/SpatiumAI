// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — DB Schema: Resolutions
// AI-generated fix options for each constraint violation
// ─────────────────────────────────────────────────────────────────────────────
import {
  pgTable, uuid, text, jsonb, integer, timestamp,
} from 'drizzle-orm/pg-core';
import { evaluations } from './evaluations';
import { constraintKb } from './constraint-kb';
import { users } from './users';

export const resolutions = pgTable('resolutions', {
  id: uuid('id').primaryKey().defaultRandom(),
  evaluationId: uuid('evaluation_id')
    .notNull()
    .references(() => evaluations.id, { onDelete: 'cascade' }),
  constraintId: uuid('constraint_id')
    .notNull()
    .references(() => constraintKb.id),

  /** Plain English description of the conflict shown as context */
  conflictDescription: text('conflict_description').notNull(),

  /**
   * Array of ResolutionOption objects (2–3 options).
   * Stored as JSONB. Every element ID in affectedElementIds
   * is validated against the spatial graph before storage.
   */
  resolutionOptions: jsonb('resolution_options').notNull().default([]),

  /** Which option the architect selected (0-indexed) */
  acceptedOptionIndex: integer('accepted_option_index'),

  /** FK to the user who accepted the resolution */
  acceptedBy: uuid('accepted_by').references(() => users.id),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Resolution = typeof resolutions.$inferSelect;
export type NewResolution = typeof resolutions.$inferInsert;
