import { pgTable, serial, text, timestamp, boolean, numeric, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reportStatusEnum = pgEnum("report_status", ["pending", "investigating", "resolved", "closed"]);

export const reportsTable = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  crimeType: text("crime_type").notNull(),
  status: reportStatusEnum("status").notNull().default("pending"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  address: text("address"),
  anonymous: boolean("anonymous").default(false),
  reporterId: integer("reporter_id"),
  assignedOfficerId: integer("assigned_officer_id"),
  imageUrl: text("image_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reportsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reportsTable.$inferSelect;
