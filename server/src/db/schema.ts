
import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const clicksTable = pgTable('clicks', {
  id: serial('id').primaryKey(),
  ip_address: text('ip_address'), // Nullable by default
  user_agent: text('user_agent'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type Click = typeof clicksTable.$inferSelect; // For SELECT operations
export type NewClick = typeof clicksTable.$inferInsert; // For INSERT operations

// Important: Export all tables and relations for proper query building
export const tables = { clicks: clicksTable };
