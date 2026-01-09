import { pool } from "./db";

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rainfall (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        rainfall_mm NUMERIC NOT NULL
      );
    `);
    console.log("Rainfall table ready ✅");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err; // throw so that the build/start process knows something went wrong
  }
}

// only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDb().catch(() => process.exit(1));
}

export { initDb };

