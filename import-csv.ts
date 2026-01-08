import fs from 'fs';
import { storage } from './server/storage';
import { parse } from 'date-fns';

async function importData() {
  try {
    const csvData = fs.readFileSync('attached_assets/reen_1767879189141.csv', 'utf-8');
    const lines = csvData.split('\n');
    
    // Skip header and handle potential BOM
    let count = 0;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const [dateStr, mmStr] = line.split(';');
      if (!dateStr || !mmStr) continue;

      // Date format: "Friday 29Oct-10"
      // We need to parse this. date-fns can help.
      // Example: "Friday 29Oct-10" -> "EEEE ddMMM-yy"
      // Wait, the format seems to be DayOfWeek DayMonth-Year
      // Let's try to extract "29Oct-10"
      const datePart = dateStr.split(' ').slice(1).join(' '); // "29Oct-10"
      
      try {
        const dateObj = parse(datePart, 'ddMMM-yy', new Date());
        const amount = parseFloat(mmStr.replace(',', '.'));
        
        if (!isNaN(dateObj.getTime()) && !isNaN(amount)) {
          await storage.addRainfall({
            date: dateObj.toISOString().split('T')[0],
            amount: Math.round(amount)
          });
          count++;
        }
      } catch (e) {
        console.error(`Failed to parse line ${i}: ${line}`, e);
      }
    }
    console.log(`Successfully imported ${count} records.`);
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importData();
