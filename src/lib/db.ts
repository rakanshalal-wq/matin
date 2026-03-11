import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://matin_user:matin_pass_2026@localhost:5432/matin_db';

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
