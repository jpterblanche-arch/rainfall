import { pool } from "./db";

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rainfall (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        rainfall_mm NUMERIC NOT NULL
      );
    `);
    console.log("Rainfall table ready ✅");
    process.exit(0);
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
})();


