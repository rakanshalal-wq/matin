/**
 * lib/tenant.ts — نظام العزل Schema-per-Tenant
 *
 * كل مؤسسة (مدرسة/جامعة) تحصل على PostgreSQL Schema خاص بها
 * يحمي بيانات الطلاب والمعلمين من التداخل بين المؤسسات.
 *
 * الدوال الرئيسية:
 *  - createTenantSchema(schoolId): تُنشئ Schema + جميع الجداول
 *  - getTenantClient(schemaName):  تُرجع Pool client مضبوط على search_path الصحيح
 *  - checkTenantQuota(schoolId, type): تفحص الحصة مقابل الحد المسموح
 *  - invalidateTenantQuotaCache(schoolId): تُبطل الكاش عند الترقية
 */

import { Pool, PoolClient } from 'pg';

// ── Connection Pool المشترك (لا ننشئ Pool لكل مدرسة) ─────────────
const MATIN_DB_URL =
  process.env.MATIN_DATABASE_URL || process.env.DATABASE_URL || '';

const sharedPool = new Pool({
  connectionString: MATIN_DB_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: MATIN_DB_URL.includes('localhost') || MATIN_DB_URL.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false },
});

// ── Cache بسيط في الذاكرة (TTL = 30 ثانية) ───────────────────────
interface QuotaCacheEntry {
  data: QuotaInfo;
  expiresAt: number;
}
const quotaCache = new Map<string, QuotaCacheEntry>();
const CACHE_TTL_MS = 30_000; // 30 ثانية

export interface QuotaInfo {
  allowed: boolean;
  current: number;
  limit: number;
  currentStorageBytes: number;
  limitStorageBytes: number;
}

// ── DDL الجداول التي تُنشأ داخل كل Schema ────────────────────────
const TENANT_SCHEMA_DDL = /* sql */ `
-- الطلاب
CREATE TABLE IF NOT EXISTS students (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      VARCHAR(50) UNIQUE,
  gender          VARCHAR(10) DEFAULT 'MALE',
  date_of_birth   DATE,
  class_id        INTEGER,
  user_id         TEXT,
  school_id       TEXT,
  owner_id        TEXT,
  enrollment_date DATE DEFAULT NOW(),
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- المعلمون
CREATE TABLE IF NOT EXISTS teachers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id     VARCHAR(50) UNIQUE,
  specialization  VARCHAR(100),
  qualification   VARCHAR(100),
  hire_date       DATE,
  user_id         TEXT,
  school_id       TEXT,
  owner_id        TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- الفصول
CREATE TABLE IF NOT EXISTS classes (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  grade_level     VARCHAR(50),
  academic_year   VARCHAR(20),
  capacity        INTEGER DEFAULT 30,
  school_id       TEXT,
  teacher_id      TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- الحضور
CREATE TABLE IF NOT EXISTS attendance (
  id              SERIAL PRIMARY KEY,
  student_id      UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id        INTEGER,
  date            DATE NOT NULL,
  status          VARCHAR(20) DEFAULT 'present',
  notes           TEXT,
  created_by      TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- الدرجات
CREATE TABLE IF NOT EXISTS grades (
  id              SERIAL PRIMARY KEY,
  student_id      UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id      INTEGER,
  exam_type       VARCHAR(50),
  score           DECIMAL(5,2),
  max_score       DECIMAL(5,2) DEFAULT 100,
  semester        VARCHAR(20),
  academic_year   VARCHAR(20),
  created_by      TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- الجداول الدراسية
CREATE TABLE IF NOT EXISTS schedules (
  id              SERIAL PRIMARY KEY,
  class_id        INTEGER,
  subject_id      INTEGER,
  teacher_id      TEXT,
  day_of_week     VARCHAR(15),
  start_time      TIME,
  end_time        TIME,
  room            VARCHAR(50),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ملفات مرفوعة (لتتبع حجم التخزين)
CREATE TABLE IF NOT EXISTS uploaded_files (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name       VARCHAR(255) NOT NULL,
  file_path       TEXT NOT NULL,
  file_size       BIGINT NOT NULL DEFAULT 0,
  file_type       VARCHAR(100),
  category        VARCHAR(50) DEFAULT 'general',
  uploaded_by     TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);
`;

// ── بيانات أولية تُدرج تلقائياً في كل Schema جديد ────────────────
const TENANT_SEED_SQL = /* sql */ `
-- المواد الدراسية الأساسية
CREATE TABLE IF NOT EXISTS subjects (
  id          SERIAL PRIMARY KEY,
  name_ar     VARCHAR(100) NOT NULL,
  name_en     VARCHAR(100),
  code        VARCHAR(20),
  grade_level VARCHAR(50),
  created_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO subjects (name_ar, name_en, code) VALUES
  ('الرياضيات',    'Mathematics',         'MATH'),
  ('اللغة العربية', 'Arabic Language',    'ARAB'),
  ('اللغة الإنجليزية', 'English Language','ENG'),
  ('العلوم',       'Science',             'SCI'),
  ('الدراسات الاجتماعية', 'Social Studies','SOC'),
  ('التربية الإسلامية', 'Islamic Studies', 'ISL'),
  ('التربية البدنية', 'Physical Education','PE'),
  ('الحاسب الآلي', 'Computer Science',    'CS'),
  ('الفنون',       'Arts',                'ART'),
  ('التربية الوطنية', 'Civic Education',  'CIV')
ON CONFLICT DO NOTHING;

-- الفصول الدراسية الافتراضية
INSERT INTO classes (name, grade_level, academic_year, capacity)
VALUES
  ('الصف الأول أ',   'الصف الأول',   '2025-2026', 30),
  ('الصف الثاني أ',  'الصف الثاني',  '2025-2026', 30),
  ('الصف الثالث أ',  'الصف الثالث',  '2025-2026', 30)
ON CONFLICT DO NOTHING;

-- الأدوار الوظيفية
CREATE TABLE IF NOT EXISTS roles (
  id          SERIAL PRIMARY KEY,
  name_ar     VARCHAR(100) NOT NULL,
  name_en     VARCHAR(100),
  permissions JSONB DEFAULT '[]',
  created_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (name_ar, name_en, permissions) VALUES
  ('مدير المؤسسة',  'Institution Admin',  '["all"]'),
  ('معلم',          'Teacher',            '["students:read","grades:write","attendance:write"]'),
  ('موظف إداري',    'Administrative Staff','["students:read","reports:read"]'),
  ('ولي أمر',       'Parent',             '["students:own:read"]')
ON CONFLICT DO NOTHING;
`;

// ─────────────────────────────────────────────────────────────────
// دالة إنشاء Schema جديد لمؤسسة
// ─────────────────────────────────────────────────────────────────
export async function createTenantSchema(schoolId: string | number): Promise<string> {
  const schemaName = `school_${schoolId}`;
  const client = await sharedPool.connect();
  try {
    await client.query('BEGIN');

    // إنشاء الـ Schema (IF NOT EXISTS آمن)
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    // تعيين search_path وإنشاء الجداول
    await client.query(`SET LOCAL search_path = "${schemaName}", public`);
    await client.query(TENANT_SCHEMA_DDL);

    // إدراج البيانات الأولية (Seed) في Schema الجديد
    await client.query(TENANT_SEED_SQL);

    await client.query('COMMIT');
    return schemaName;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ─────────────────────────────────────────────────────────────────
// دالة الحصول على Client مضبوط على search_path الصحيح
// ─────────────────────────────────────────────────────────────────
export async function getTenantClient(schemaName: string): Promise<PoolClient> {
  const client = await sharedPool.connect();
  // نضبط search_path للـ session الحالي فقط — لا يؤثر على connections أخرى
  await client.query(`SET search_path = "${schemaName}", public`);
  return client;
}

// ─────────────────────────────────────────────────────────────────
// دالة فحص الحصة (students أو storage)
// ─────────────────────────────────────────────────────────────────
export async function checkTenantQuota(
  schoolId: string | number,
  type: 'students' | 'storage',
  additionalBytes?: number
): Promise<QuotaInfo> {
  const cacheKey = `${schoolId}:${type}`;
  const cached = quotaCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const result = await sharedPool.query<{
    current_students: string;
    current_storage_bytes: string;
    max_students: string;
    max_storage_gb: string;
  }>(
    `SELECT
       tq.current_students,
       tq.current_storage_bytes,
       sp.max_students,
       sp.max_storage_gb
     FROM tenants t
     JOIN tenant_quotas tq  ON tq.tenant_id = t.id
     JOIN schools sc        ON sc.id = t.school_id
     JOIN subscriptions sub ON sub.school_id = sc.id AND sub.status = 'active'
     JOIN subscription_plans sp ON sp.id = sub.plan_id
     WHERE t.school_id = $1
     ORDER BY sub.created_at DESC
     LIMIT 1`,
    [String(schoolId)]
  );

  const row = result.rows[0];
  if (!row) {
    // لا يوجد اشتراك → نسمح بالعمل بحدود افتراضية محدودة (free tier)
    const defaultInfo: QuotaInfo = {
      allowed: type === 'students' ? true : true,
      current: 0,
      limit: 100,
      currentStorageBytes: 0,
      limitStorageBytes: 2 * 1024 * 1024 * 1024,
    };
    return defaultInfo;
  }

  const currentStudents = parseInt(row.current_students, 10);
  const currentStorageBytes = parseInt(row.current_storage_bytes, 10);
  const maxStudents = parseInt(row.max_students, 10);
  const maxStorageBytes = parseInt(row.max_storage_gb, 10) * 1024 * 1024 * 1024;

  let info: QuotaInfo;
  if (type === 'students') {
    info = {
      allowed: currentStudents < maxStudents,
      current: currentStudents,
      limit: maxStudents,
      currentStorageBytes,
      limitStorageBytes: maxStorageBytes,
    };
  } else {
    const extra = additionalBytes || 0;
    info = {
      allowed: currentStorageBytes + extra <= maxStorageBytes,
      current: currentStudents,
      limit: maxStudents,
      currentStorageBytes,
      limitStorageBytes: maxStorageBytes,
    };
  }

  quotaCache.set(cacheKey, { data: info, expiresAt: Date.now() + CACHE_TTL_MS });
  return info;
}

// ─────────────────────────────────────────────────────────────────
// إبطال كاش مؤسسة معينة (يُستدعى عند الترقية أو التعديل)
// ─────────────────────────────────────────────────────────────────
export function invalidateTenantQuotaCache(schoolId: string | number): void {
  quotaCache.delete(`${schoolId}:students`);
  quotaCache.delete(`${schoolId}:storage`);
}

// ─────────────────────────────────────────────────────────────────
// زيادة عداد الطلاب في tenant_quotas
// ─────────────────────────────────────────────────────────────────
export async function incrementStudentQuota(schoolId: string | number): Promise<void> {
  await sharedPool.query(
    `UPDATE tenant_quotas tq
     SET current_students = current_students + 1
     FROM tenants t
     WHERE tq.tenant_id = t.id AND t.school_id = $1`,
    [String(schoolId)]
  );
  invalidateTenantQuotaCache(schoolId);
}

// ─────────────────────────────────────────────────────────────────
// زيادة عداد التخزين في tenant_quotas
// ─────────────────────────────────────────────────────────────────
export async function incrementStorageQuota(
  schoolId: string | number,
  bytes: number
): Promise<void> {
  await sharedPool.query(
    `UPDATE tenant_quotas tq
     SET current_storage_bytes = current_storage_bytes + $2
     FROM tenants t
     WHERE tq.tenant_id = t.id AND t.school_id = $1`,
    [String(schoolId), bytes]
  );
  invalidateTenantQuotaCache(schoolId);
}

// ─────────────────────────────────────────────────────────────────
// تهيئة tenant جديد: إنشاء Schema + سجل في tenants + tenant_quotas
// ─────────────────────────────────────────────────────────────────
export async function provisionTenant(
  ownerId: string | number,
  schoolId: string | number
): Promise<{ tenantId: number; schemaName: string }> {
  const schemaName = await createTenantSchema(schoolId);

  const client = await sharedPool.connect();
  try {
    await client.query('BEGIN');

    // إنشاء سجل tenant (أو استرجاعه إن كان موجوداً)
    const tenantResult = await client.query<{ id: number }>(
      `INSERT INTO tenants (schema_name, owner_id, school_id, status)
       VALUES ($1, $2, $3, 'active')
       ON CONFLICT (schema_name) DO UPDATE SET updated_at = NOW()
       RETURNING id`,
      [schemaName, String(ownerId), String(schoolId)]
    );
    const tenantId = tenantResult.rows[0].id;

    // إنشاء سجل الحصة الافتراضي
    await client.query(
      `INSERT INTO tenant_quotas (tenant_id, current_students, current_storage_bytes)
       VALUES ($1, 0, 0)
       ON CONFLICT (tenant_id) DO NOTHING`,
      [tenantId]
    );

    await client.query('COMMIT');
    return { tenantId, schemaName };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
