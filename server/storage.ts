import { type RainfallRecord, type InsertRainfall, type MonthlyTotal } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from 'fs';
import { parse } from 'date-fns';
import path from 'path';

export interface IStorage {
  getAllRainfall(): Promise<RainfallRecord[]>;
  addRainfall(record: InsertRainfall): Promise<RainfallRecord>;
  getMonthlyTotals(): Promise<MonthlyTotal[]>;
}

export class MemStorage implements IStorage {
  private rainfallRecords: Map<string, RainfallRecord>;

  constructor() {
    this.rainfallRecords = new Map();
    this.importHistoricalData();
  }

  private async importHistoricalData() {
    try {
      const csvPath = path.resolve(process.cwd(), 'attached_assets/reen_1767879189141.csv');
      if (!fs.existsSync(csvPath)) return;

      const csvData = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvData.split('\n');
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [dateStr, mmStr] = line.split(';');
        if (!dateStr || !mmStr) continue;

        const datePart = dateStr.includes(' ') ? dateStr.split(' ').slice(1).join(' ') : dateStr; 
        
        try {
          // Format is Monday 29Sept-25 -> parse 29Sept-25
          const dateObj = parse(datePart, 'ddMMM-yy', new Date());
          const amount = parseFloat(mmStr.replace(',', '.'));
          
          if (!isNaN(dateObj.getTime()) && mmStr) {
            const id = randomUUID();
            this.rainfallRecords.set(id, {
              id,
              date: dateObj.toISOString().split('T')[0],
              amount: mmStr.trim().replace(',', '.')
            });
          }
        } catch (e) {
          console.error(`Error parsing line ${i}: ${line}`, e);
        }
      }
      console.log(`Imported ${this.rainfallRecords.size} records from CSV.`);
    } catch (error) {
      console.error('Initial import failed:', error);
    }
  }

  async getAllRainfall(): Promise<RainfallRecord[]> {
    return Array.from(this.rainfallRecords.values());
  }

  async addRainfall(insert: InsertRainfall): Promise<RainfallRecord> {
    const id = randomUUID();
    const record: RainfallRecord = {
      id,
      date: insert.date,
      amount: insert.amount.replace(',', '.'),
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

      const amount = parseFloat(record.amount);

      if (totalsMap.has(key)) {
        const existing = totalsMap.get(key)!;
        existing.total += amount;
      } else {
        totalsMap.set(key, { month, year, total: amount });
      }
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return Array.from(totalsMap.values()).map((item) => ({
      ...item,
      total: parseFloat(item.total.toFixed(1)),
      label: `${monthNames[item.month]} ${item.year}`,
    }));
  }
}

export const storage = new MemStorage();
