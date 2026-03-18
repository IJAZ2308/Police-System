import { pgTable, serial, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const firStatusEnum = pgEnum("fir_status", ["draft", "filed", "under_investigation", "closed"]);

export const firsTable = pgTable("firs", {
  id: serial("id").primaryKey(),
  firNumber: text("fir_number").notNull().unique(),
  complainantName: text("complainant_name").notNull(),
  complainantPhone: text("complainant_phone"),
  crimeType: text("crime_type").notNull(),
  ipcSections: text("ipc_sections").array(),
  description: text("description").notNull(),
  location: text("location"),
  dateOfIncident: text("date_of_incident"),
  summary: text("summary"),
  status: firStatusEnum("status").notNull().default("draft"),
  assignedOfficerId: integer("assigned_officer_id"),
  createdById: integer("created_by_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFirSchema = createInsertSchema(firsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFir = z.infer<typeof insertFirSchema>;
export type Fir = typeof firsTable.$inferSelect;
