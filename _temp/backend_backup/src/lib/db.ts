import { Pool } from 'pg';

// DATABASE_URL يجب أن يكون محدداً في .env
// لا نضع credentials مباشرة في الكود
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // في development نعطي تحذيراً، في production نوقف التشغيل
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL environment variable is required');
  }
  console.warn('[db] DATABASE_URL not set — database queries will fail');
}

const pool = new Pool({
  connectionString: connectionString || undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
