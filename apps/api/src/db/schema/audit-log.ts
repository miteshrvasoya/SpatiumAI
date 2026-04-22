// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — DB Schema: Audit Log
// Immutable append-only log of all mutating operations.
// Retained 2 years. Accessible to org owners only.
// ─────────────────────────────────────────────────────────────────────────────
import { pgTable, uuid, varchar, jsonb, inet, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),

  /** what happened: 'evaluation.created', 'resolution.accepted', 'user.invited', etc. */
  action: varchar('action', { length: 100 }).notNull(),

  /** 'evaluation', 'project', 'organization', 'user', etc. */
  resourceType: varchar('resource_type', { length: 50 }).notNull(),
  resourceId: uuid('resource_id'),

  /** Additional context: before/after values, request params, etc. */
  metadata: jsonb('metadata'),

  ipAddress: inet('ip_address'),

  /** Immutable — no updatedAt, no deletedAt */
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type AuditLogRow = typeof auditLog.$inferSelect;
export type NewAuditLogRow = typeof auditLog.$inferInsert;
