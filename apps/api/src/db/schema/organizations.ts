// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — DB Schema: Organizations
// ─────────────────────────────────────────────────────────────────────────────
import { pgTable, uuid, varchar, pgEnum, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const planEnum = pgEnum('plan_type', ['free', 'pro', 'studio', 'enterprise']);

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  plan: planEnum('plan').notNull().default('free'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  maxSeats: integer('max_seats').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
