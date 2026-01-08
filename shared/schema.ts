import { pgTable, text, varchar, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Rainfall record table
export const rainfallRecords = pgTable("rainfall_records", {
  id: varchar("id").primaryKey(),
  date: date("date").notNull(),
  amount: text("amount").notNull(), // rainfall in mm (stored as string for precision/flexibility)
});

export const insertRainfallSchema = createInsertSchema(rainfallRecords).omit({
  id: true,
}).extend({
  date: z.string().min(1, "Date is required"),
  amount: z.string().regex(/^\d+([.,]\d+)?$/, "Enter a valid amount (e.g., 4.5 or 4,5)"),
});

export type InsertRainfall = z.infer<typeof insertRainfallSchema>;
export type RainfallRecord = typeof rainfallRecords.$inferSelect;

// Monthly total type for frontend
export type MonthlyTotal = {
  month: number;
  year: number;
  total: number;
  label: string;
};
