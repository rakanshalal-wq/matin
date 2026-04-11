-- =====================================================
-- Migration v4 — إصلاح الأعمدة المفقودة
-- التاريخ: 2026-04-11
-- التطبيق: psql $DATABASE_URL -f scripts/migration_v4.sql
-- =====================================================

-- 1. التأكد من أن VIEW teachers لا تتعارض مع TABLE teachers
--    إذا كان teachers موجوداً كـ VIEW بدون user_id نحذفه ونعيد إنشاءه كجدول

DO $$
BEGIN
  -- تحقق إذا كان teachers view (وليس table)
  IF EXISTS (
    SELECT 1 FROM information_schema.views
    WHERE table_schema = 'public' AND table_name = 'teachers'
  ) THEN
    EXECUTE 'DROP VIEW IF EXISTS public.teachers CASCADE';
  END IF;
END;
$$;

-- 2. إنشاء جدول teachers إذا لم يكن موجوداً (كـ TABLE وليس VIEW)
CREATE TABLE IF NOT EXISTS teachers (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    employee_id     TEXT,
    specialization  TEXT,
    department      TEXT,
    salary          NUMERIC(10,2),
    hire_date       DATE DEFAULT CURRENT_DATE,
    user_id         TEXT,
    school_id       TEXT,
    owner_id        TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. إضافة عمود user_id إذا لم يكن موجوداً
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS school_id TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS owner_id TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS salary NUMERIC(10,2);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS hire_date DATE DEFAULT CURRENT_DATE;

CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_owner_id ON teachers(owner_id);

-- 4. التأكد من أن VIEW students لا تتعارض مع TABLE students
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.views
    WHERE table_schema = 'public' AND table_name = 'students'
  ) THEN
    EXECUTE 'DROP VIEW IF EXISTS public.students CASCADE';
  END IF;
END;
$$;

-- 5. إنشاء جدول students إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS students (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    student_id      TEXT,
    gender          TEXT CHECK (gender IN ('male','female','other')),
    date_of_birth   DATE,
    class_id        TEXT,
    user_id         TEXT,
    school_id       TEXT,
    owner_id        TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 6. إضافة الأعمدة المفقودة في students
ALTER TABLE students ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS school_id TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS owner_id TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS class_id TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS enrollment_date DATE DEFAULT CURRENT_DATE;

CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_owner_id ON students(owner_id);

-- 7. إضافة أعمدة TOTP المفقودة في users (تُكمّل migration_2fa.sql)
ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_secret      TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_enabled     BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_enabled_at  TIMESTAMP;

-- 8. إنشاء جدول totp_used_tokens إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS totp_used_tokens (
  id         BIGSERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT    NOT NULL,
  used_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_totp_used_tokens_unique ON totp_used_tokens (user_id, token);
CREATE INDEX IF NOT EXISTS idx_totp_used_tokens_user_used ON totp_used_tokens (user_id, used_at);
