import { Pool } from 'pg';

// DATABASE_URL يجب أن يكون محدداً في .env
const MATIN_DB_URL = process.env.MATIN_DATABASE_URL || process.env.DATABASE_URL || '';

if (!MATIN_DB_URL || (!MATIN_DB_URL.startsWith('postgresql://') && !MATIN_DB_URL.startsWith('postgres://'))) {
  // During `next build` NEXT_PHASE is 'phase-production-build' — DB is not needed then.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
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

// Auto-migration: create missing tables on first connection.
// Runs once per process (guarded by flag on globalThis).
const globalForMigration = globalThis as unknown as { _matnMigrationDone: boolean };
if (!globalForMigration._matnMigrationDone && MATIN_DB_URL) {
  globalForMigration._matnMigrationDone = true;
  pool.query(`
    CREATE TABLE IF NOT EXISTS exams (
      id         SERIAL PRIMARY KEY,
      school_id  INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      title      VARCHAR(255) NOT NULL DEFAULT '',
      status     VARCHAR(50)  NOT NULL DEFAULT 'DRAFT'
                   CHECK (status IN ('DRAFT','SCHEDULED','ONGOING','COMPLETED','CANCELLED')),
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_exams_school_id ON exams(school_id);
    CREATE INDEX IF NOT EXISTS idx_exams_status    ON exams(status);

    CREATE TABLE IF NOT EXISTS subjects (
      id         SERIAL PRIMARY KEY,
      school_id  INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      name       VARCHAR(255) NOT NULL DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);

    CREATE TABLE IF NOT EXISTS courses (
      id         SERIAL PRIMARY KEY,
      school_id  INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      name       VARCHAR(255) NOT NULL DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_courses_school_id ON courses(school_id);

    CREATE TABLE IF NOT EXISTS classes (
      id         SERIAL PRIMARY KEY,
      school_id  INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      name       VARCHAR(255) NOT NULL DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
  `).catch((err: Error) => {
    console.warn('[DB] auto-migration warning (non-fatal):', err.message);
  });
}

export default pool;
export { pool };
