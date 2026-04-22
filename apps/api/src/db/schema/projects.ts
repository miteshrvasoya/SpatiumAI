// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — DB Schema: Projects
// ─────────────────────────────────────────────────────────────────────────────
import { pgTable, uuid, varchar, pgEnum, boolean, timestamp } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { users } from './users';

export const typologyEnum = pgEnum('project_typology', [
  'residential', 'commercial', 'institutional', 'mixed',
]);

export const projectStatusEnum = pgEnum('project_status', [
  'draft', 'evaluating', 'complete',
]);

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  typology: typologyEnum('typology').notNull().default('residential'),
  jurisdiction: varchar('jurisdiction', { length: 100 }).notNull().default('national'),
  vastuEnabled: boolean('vastu_enabled').notNull().default(true),
  status: projectStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
