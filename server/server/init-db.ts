import { pool } from "./db";

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rainfall (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL UNIQUE,
        mm NUMERIC(5,1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Rainfall table ready");
  } catch (err) {
    console.error("❌ Database init failed", err);
    process.exit(1);
  }
}

initDb();

