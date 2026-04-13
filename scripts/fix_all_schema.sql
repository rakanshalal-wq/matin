-- =============================================================
-- Migration: Ensure ALL columns required by registration exist
-- Date: 2026-04-13
-- Run ONCE on production:
--   psql $DATABASE_URL -f scripts/fix_all_schema.sql
-- =============================================================

BEGIN;

-- ── schools table ─────────────────────────────────────────────

DO $$
BEGIN
  -- is_active (used in registration INSERT)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='is_active') THEN
    ALTER TABLE schools ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
    RAISE NOTICE 'Added schools.is_active';
  END IF;

  -- updated_at (used in registration INSERT)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='updated_at') THEN
    ALTER TABLE schools ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added schools.updated_at';
  END IF;

  -- created_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='created_at') THEN
    ALTER TABLE schools ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added schools.created_at';
  END IF;

  -- type (institution type)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='type') THEN
    ALTER TABLE schools ADD COLUMN type VARCHAR(50) DEFAULT 'school';
    RAISE NOTICE 'Added schools.type';
  END IF;

  -- code
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='code') THEN
    ALTER TABLE schools ADD COLUMN code VARCHAR(50);
    RAISE NOTICE 'Added schools.code';
  END IF;

  -- email
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='email') THEN
    ALTER TABLE schools ADD COLUMN email VARCHAR(255);
    RAISE NOTICE 'Added schools.email';
  END IF;

  -- phone
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='phone') THEN
    ALTER TABLE schools ADD COLUMN phone VARCHAR(50);
    RAISE NOTICE 'Added schools.phone';
  END IF;

  -- slug
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='slug') THEN
    ALTER TABLE schools ADD COLUMN slug VARCHAR(255);
    RAISE NOTICE 'Added schools.slug';
  END IF;

  -- owner_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='owner_id') THEN
    ALTER TABLE schools ADD COLUMN owner_id INTEGER;
    RAISE NOTICE 'Added schools.owner_id';
  END IF;

  -- city
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='city') THEN
    ALTER TABLE schools ADD COLUMN city VARCHAR(100);
    RAISE NOTICE 'Added schools.city';
  END IF;

  -- institution_type (mirrors type for queries that use this column name)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='institution_type') THEN
    ALTER TABLE schools ADD COLUMN institution_type VARCHAR(50);
    UPDATE schools SET institution_type = type WHERE institution_type IS NULL;
    RAISE NOTICE 'Added schools.institution_type';
  END IF;

  -- status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='status') THEN
    ALTER TABLE schools ADD COLUMN status VARCHAR(30) DEFAULT 'TRIAL';
    RAISE NOTICE 'Added schools.status';
  END IF;

  -- trial_ends_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='schools' AND column_name='trial_ends_at') THEN
    ALTER TABLE schools ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added schools.trial_ends_at';
  END IF;
END $$;

-- Drop any CHECK constraint on schools.type that may reject mosque/quran_center
DO $$
DECLARE rec record;
BEGIN
  FOR rec IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'schools'::regclass AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%type%'
  LOOP
    EXECUTE format('ALTER TABLE schools DROP CONSTRAINT IF EXISTS %I', rec.conname);
    RAISE NOTICE 'Dropped CHECK constraint % on schools.type', rec.conname;
  END LOOP;
END $$;

-- If schools.type is an enum, convert to VARCHAR
DO $$
DECLARE col_udt text;
BEGIN
  SELECT udt_name INTO col_udt FROM information_schema.columns
  WHERE table_name='schools' AND column_name='type';
  IF col_udt IS NOT NULL AND col_udt NOT IN ('varchar','text','bpchar') THEN
    EXECUTE 'ALTER TABLE schools ALTER COLUMN type TYPE VARCHAR(50) USING type::text';
    RAISE NOTICE 'Converted schools.type from enum to VARCHAR(50)';
  END IF;
END $$;

-- ── users table ───────────────────────────────────────────────

DO $$
BEGIN
  -- institution_type
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='users' AND column_name='institution_type') THEN
    ALTER TABLE users ADD COLUMN institution_type VARCHAR(50);
    RAISE NOTICE 'Added users.institution_type';
  END IF;

  -- owner_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='users' AND column_name='owner_id') THEN
    ALTER TABLE users ADD COLUMN owner_id INTEGER;
    RAISE NOTICE 'Added users.owner_id';
  END IF;

  -- school_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='users' AND column_name='school_id') THEN
    ALTER TABLE users ADD COLUMN school_id INTEGER;
    RAISE NOTICE 'Added users.school_id';
  END IF;

  -- package
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='users' AND column_name='package') THEN
    ALTER TABLE users ADD COLUMN package VARCHAR(50) DEFAULT 'basic';
    RAISE NOTICE 'Added users.package';
  END IF;

  -- status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='users' AND column_name='status') THEN
    ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active';
    RAISE NOTICE 'Added users.status';
  END IF;

  -- phone
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='users' AND column_name='phone') THEN
    ALTER TABLE users ADD COLUMN phone VARCHAR(50);
    RAISE NOTICE 'Added users.phone';
  END IF;

  -- role
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_name='users' AND column_name='role') THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'student';
    RAISE NOTICE 'Added users.role';
  END IF;
END $$;

-- Drop any CHECK constraint on users.institution_type or users.package
DO $$
DECLARE rec record;
BEGIN
  FOR rec IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'users'::regclass AND contype = 'c'
      AND (pg_get_constraintdef(oid) ILIKE '%institution_type%'
        OR pg_get_constraintdef(oid) ILIKE '%package%')
  LOOP
    EXECUTE format('ALTER TABLE users DROP CONSTRAINT IF EXISTS %I', rec.conname);
    RAISE NOTICE 'Dropped CHECK constraint % on users', rec.conname;
  END LOOP;
END $$;

-- If users.institution_type is an enum, convert to VARCHAR
DO $$
DECLARE col_udt text;
BEGIN
  SELECT udt_name INTO col_udt FROM information_schema.columns
  WHERE table_name='users' AND column_name='institution_type';
  IF col_udt IS NOT NULL AND col_udt NOT IN ('varchar','text','bpchar') THEN
    EXECUTE 'ALTER TABLE users ALTER COLUMN institution_type TYPE VARCHAR(50) USING institution_type::text';
    RAISE NOTICE 'Converted users.institution_type from enum to VARCHAR(50)';
  END IF;
END $$;

COMMIT;

-- Show final state
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('schools','users')
  AND column_name IN (
    'is_active','updated_at','type','code','slug','owner_id','city',
    'institution_type','status','package','phone','role','school_id'
  )
ORDER BY table_name, column_name;
