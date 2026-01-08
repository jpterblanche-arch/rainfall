import { pgTable, text, varchar, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Rainfall record table
export const rainfallRecords = pgTable("rainfall_records", {
  id: varchar("id").primaryKey(),
  date: date("date").notNull(),
  amount: integer("amount").notNull(), // rainfall in mm
});

export const insertRainfallSchema = createInsertSchema(rainfallRecords).omit({
  id: true,
}).extend({
  date: z.string().min(1, "Date is required"),
  amount: z.number().min(0, "Amount must be 0 or greater").max(500, "Amount seems too high"),
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
