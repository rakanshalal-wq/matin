-- =============================================================
-- Migration: Create missing tables required by dashboard-stats
-- Date: 2026-04-13
-- Tables: exams, subjects, courses
-- Run ONCE on production:
--   psql $DATABASE_URL -f scripts/create_missing_tables.sql
-- =============================================================

BEGIN;

-- ── exams ─────────────────────────────────────────────────────
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

-- ── subjects ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id         SERIAL PRIMARY KEY,
  school_id  INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name       VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);

-- ── courses ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id         SERIAL PRIMARY KEY,
  school_id  INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name       VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_school_id ON courses(school_id);

-- ── classes (guard against missing too) ───────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id         SERIAL PRIMARY KEY,
  school_id  INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name       VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);

COMMIT;
