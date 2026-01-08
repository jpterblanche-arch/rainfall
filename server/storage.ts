import { type RainfallRecord, type InsertRainfall, type MonthlyTotal } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllRainfall(): Promise<RainfallRecord[]>;
  addRainfall(record: InsertRainfall): Promise<RainfallRecord>;
  getMonthlyTotals(): Promise<MonthlyTotal[]>;
}

export class MemStorage implements IStorage {
  private rainfallRecords: Map<string, RainfallRecord>;

  constructor() {
    this.rainfallRecords = new Map();
  }

  async getAllRainfall(): Promise<RainfallRecord[]> {
    return Array.from(this.rainfallRecords.values());
  }

  async addRainfall(insert: InsertRainfall): Promise<RainfallRecord> {
    const id = randomUUID();
    const record: RainfallRecord = {
      id,
      date: insert.date,
      amount: insert.amount,
    };
    this.rainfallRecords.set(id, record);
    return record;
  }

  async getMonthlyTotals(): Promise<MonthlyTotal[]> {
    const records = Array.from(this.rainfallRecords.values());
    const totalsMap = new Map<string, { month: number; year: number; total: number }>();

    for (const record of records) {
      const date = new Date(record.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      if (totalsMap.has(key)) {
        const existing = totalsMap.get(key)!;
        existing.total += record.amount;
      } else {
        totalsMap.set(key, { month, year, total: record.amount });
      }
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return Array.from(totalsMap.values()).map((item) => ({
      ...item,
      label: `${monthNames[item.month]} ${item.year}`,
    }));
  }
}

export const storage = new MemStorage();
