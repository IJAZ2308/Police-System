import { pgTable, serial, text, timestamp, numeric, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const alertTypeEnum = pgEnum("alert_type", ["panic", "weapon", "suspicious", "accident", "fire"]);
export const alertStatusEnum = pgEnum("alert_status", ["active", "dispatched", "resolved"]);

export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: alertTypeEnum("type").notNull(),
  status: alertStatusEnum("status").notNull().default("active"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: numeric("longitude", { precision: 10, scale: 7 }).notNull(),
  address: text("address"),
  message: text("message"),
  senderId: integer("sender_id"),
  senderName: text("sender_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertAlertSchema = createInsertSchema(alertsTable).omit({ id: true, createdAt: true });
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type AlertRecord = typeof alertsTable.$inferSelect;
