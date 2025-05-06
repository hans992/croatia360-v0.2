// lib/db.ts
import { Pool } from 'pg';

declare global {
  var pgPool: Pool | undefined;
}

let pool: Pool;

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(dbConfig);
} else {
  if (!globalThis.pgPool) {
    globalThis.pgPool = new Pool(dbConfig);
  }
  pool = globalThis.pgPool;
}

export default pool;

export async function testDbConnection() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW() as currentTime');
      console.log('Uspješna konekcija! Vrijeme s baze:', result.rows[0].currenttime);
      return result.rows[0].currenttime;
    } catch (err) {
      console.error('Greška pri testiranju konekcije:', err);
      throw err;
    } finally {
      client.release(); // Jako važno: uvijek oslobodite klijenta!
    }
  }