-- =============================================================
-- Migration: Add mosque and quran_center as valid institution types
-- Date: 2026-04-12
-- Reason: Registering a mosque (institution_type='mosque') fails with
--         HTTP 500 because the DB may have a CHECK constraint or ENUM
--         on schools.type / users.institution_type that predates mosque
--         being added as a supported type.
--
-- Run this script ONCE on the production database:
--   psql $DATABASE_URL -f scripts/fix_institution_type_constraints.sql
-- =============================================================

BEGIN;

-- ── 1. schools.type ──────────────────────────────────────────

-- If schools.type is an ENUM, add new values to the ENUM type.
DO $$
DECLARE
  col_udt text;
BEGIN
  SELECT udt_name INTO col_udt
  FROM information_schema.columns
  WHERE table_name = 'schools' AND column_name = 'type';

  IF col_udt IS NOT NULL AND col_udt NOT IN ('varchar', 'text', 'bpchar') THEN
    -- It is an ENUM type — add the new values if they don't exist
    BEGIN
      EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', col_udt, 'mosque');
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not add mosque to enum %: %', col_udt, SQLERRM;
    END;
    BEGIN
      EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', col_udt, 'quran_center');
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not add quran_center to enum %: %', col_udt, SQLERRM;
    END;
  END IF;
END $$;

-- Drop any CHECK constraint on schools.type that restricts allowed values.
DO $$
DECLARE
  rec record;
BEGIN
  FOR rec IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'schools'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%type%'
  LOOP
    EXECUTE format('ALTER TABLE schools DROP CONSTRAINT IF EXISTS %I', rec.conname);
    RAISE NOTICE 'Dropped CHECK constraint % on schools.type', rec.conname;
  END LOOP;
END $$;

-- Ensure schools.type is a plain VARCHAR (convert from ENUM if needed).
DO $$
DECLARE
  col_udt text;
BEGIN
  SELECT udt_name INTO col_udt
  FROM information_schema.columns
  WHERE table_name = 'schools' AND column_name = 'type';

  -- If it is still an enum after the ADD VALUE attempts, cast to varchar
  IF col_udt IS NOT NULL AND col_udt NOT IN ('varchar', 'text', 'bpchar') THEN
    EXECUTE 'ALTER TABLE schools ALTER COLUMN type TYPE VARCHAR(50) USING type::text';
    RAISE NOTICE 'Converted schools.type from enum to VARCHAR(50)';
  END IF;
END $$;

-- ── 2. users.institution_type ─────────────────────────────────

-- Same treatment for users.institution_type
DO $$
DECLARE
  col_udt text;
BEGIN
  SELECT udt_name INTO col_udt
  FROM information_schema.columns
  WHERE table_name = 'users' AND column_name = 'institution_type';

  IF col_udt IS NOT NULL AND col_udt NOT IN ('varchar', 'text', 'bpchar') THEN
    BEGIN
      EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', col_udt, 'mosque');
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not add mosque to enum %: %', col_udt, SQLERRM;
    END;
    BEGIN
      EXECUTE format('ALTER TYPE %I ADD VALUE IF NOT EXISTS %L', col_udt, 'quran_center');
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not add quran_center to enum %: %', col_udt, SQLERRM;
    END;
  END IF;
END $$;

-- Drop any CHECK constraint on users.institution_type
DO $$
DECLARE
  rec record;
BEGIN
  FOR rec IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'users'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%institution_type%'
  LOOP
    EXECUTE format('ALTER TABLE users DROP CONSTRAINT IF EXISTS %I', rec.conname);
    RAISE NOTICE 'Dropped CHECK constraint % on users.institution_type', rec.conname;
  END LOOP;
END $$;

-- Ensure users.institution_type is a plain VARCHAR
DO $$
DECLARE
  col_udt text;
BEGIN
  SELECT udt_name INTO col_udt
  FROM information_schema.columns
  WHERE table_name = 'users' AND column_name = 'institution_type';

  IF col_udt IS NOT NULL AND col_udt NOT IN ('varchar', 'text', 'bpchar') THEN
    EXECUTE 'ALTER TABLE users ALTER COLUMN institution_type TYPE VARCHAR(50) USING institution_type::text';
    RAISE NOTICE 'Converted users.institution_type from enum to VARCHAR(50)';
  END IF;
END $$;

-- ── 3. Verify current constraints ────────────────────────────
SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name IN ('schools', 'users')
ORDER BY tc.table_name, tc.constraint_name;

COMMIT;
