import { Pool } from 'pg';

// DATABASE_URL يجب أن يكون محدداً في .env
const MATIN_DB_URL = process.env.MATIN_DATABASE_URL || process.env.DATABASE_URL || '';

if (!MATIN_DB_URL || (!MATIN_DB_URL.startsWith('postgresql://') && !MATIN_DB_URL.startsWith('postgres://'))) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[DB] MATIN_DATABASE_URL أو DATABASE_URL غير معيّن. يجب تعيين متغير بيئة PostgreSQL صحيح.');
  }
  console.warn('[DB] DATABASE_URL not set — database queries will fail');
}

const isLocal = MATIN_DB_URL.includes('localhost') || MATIN_DB_URL.includes('127.0.0.1');

// globalThis reuse: يمنع إنشاء pool جديد عند كل hot reload في التطوير
const globalForDb = globalThis as unknown as { _pgPool: Pool | undefined };

if (!globalForDb._pgPool && MATIN_DB_URL) {
  globalForDb._pgPool = new Pool({
    connectionString: MATIN_DB_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });
}

const pool = globalForDb._pgPool!;

export default pool;
export { pool };
