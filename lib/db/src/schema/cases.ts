import { pgTable, serial, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const caseStatusEnum = pgEnum("case_status", ["open", "investigating", "closed", "cold"]);
export const casePriorityEnum = pgEnum("case_priority", ["low", "medium", "high", "critical"]);

export const casesTable = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseNumber: text("case_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  crimeType: text("crime_type").notNull(),
  status: caseStatusEnum("status").notNull().default("open"),
  priority: casePriorityEnum("priority").notNull().default("medium"),
  assignedOfficerId: integer("assigned_officer_id"),
  assignedOfficerName: text("assigned_officer_name"),
  reportId: integer("report_id"),
  firId: integer("fir_id"),
  evidence: text("evidence").array(),
  suspects: text("suspects").array(),
  witnesses: text("witnesses").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCaseSchema = createInsertSchema(casesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type CaseRecord = typeof casesTable.$inferSelect;
