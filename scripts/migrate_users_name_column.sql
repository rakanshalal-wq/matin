-- =============================================================
-- Migration: Fix users table column names to match application code
-- Date: 2026-04-12
-- Reason: Prisma schema used full_name / password_hash / avatar_url
--         but all raw SQL in the application expects name / password / avatar.
--         Run this script ONCE on the production database to align the schema.
-- =============================================================

BEGIN;

-- ── 1. name (was full_name in Prisma schema) ─────────────────
DO $$
BEGIN
    -- Rename full_name → name if full_name exists and name does not
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'full_name'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'name'
    ) THEN
        ALTER TABLE users RENAME COLUMN full_name TO name;
        RAISE NOTICE 'Renamed users.full_name → users.name';

    -- Add name column if neither exists
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'name'
    ) THEN
        ALTER TABLE users ADD COLUMN name VARCHAR(255);
        RAISE NOTICE 'Added users.name column';
    ELSE
        RAISE NOTICE 'users.name column already exists — no change needed';
    END IF;
END $$;

-- ── 2. password (was password_hash in Prisma schema) ─────────
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'password_hash'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'password'
    ) THEN
        ALTER TABLE users RENAME COLUMN password_hash TO password;
        RAISE NOTICE 'Renamed users.password_hash → users.password';
    END IF;
END $$;

-- ── 3. avatar (was avatar_url in Prisma schema) ───────────────
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'avatar_url'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'avatar'
    ) THEN
        ALTER TABLE users RENAME COLUMN avatar_url TO avatar;
        RAISE NOTICE 'Renamed users.avatar_url → users.avatar';
    END IF;
END $$;

-- ── 4. status — add if missing (Prisma used is_active boolean) ─
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'status'
    ) THEN
        ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active';
        -- Populate from is_active if that column exists
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'is_active'
        ) THEN
            UPDATE users SET status = CASE WHEN is_active THEN 'active' ELSE 'suspended' END;
        END IF;
        RAISE NOTICE 'Added users.status column';
    END IF;
END $$;

-- ── 5. Add any other columns the app expects if missing ────────
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='bio') THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'student';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='school_id') THEN
        ALTER TABLE users ADD COLUMN school_id INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='owner_id') THEN
        ALTER TABLE users ADD COLUMN owner_id INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='package') THEN
        ALTER TABLE users ADD COLUMN package VARCHAR(50) DEFAULT 'basic';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='national_id') THEN
        ALTER TABLE users ADD COLUMN national_id VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='city') THEN
        ALTER TABLE users ADD COLUMN city VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='max_schools') THEN
        ALTER TABLE users ADD COLUMN max_schools INTEGER DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='max_students') THEN
        ALTER TABLE users ADD COLUMN max_students INTEGER DEFAULT 50;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='max_teachers') THEN
        ALTER TABLE users ADD COLUMN max_teachers INTEGER DEFAULT 3;
    END IF;
END $$;

COMMIT;

-- Verify result
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- =============================================================
-- Addendum: Fix schools table columns to match application code
-- =============================================================

BEGIN;

DO $$
BEGIN
    -- name_ar
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='name_ar') THEN
        ALTER TABLE schools ADD COLUMN name_ar VARCHAR(200);
        UPDATE schools SET name_ar = name WHERE name_ar IS NULL;
    END IF;
    -- institution_type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='institution_type') THEN
        ALTER TABLE schools ADD COLUMN institution_type VARCHAR(50);
        -- copy from type if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='type') THEN
            UPDATE schools SET institution_type = type WHERE institution_type IS NULL;
        END IF;
    END IF;
    -- status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='status') THEN
        ALTER TABLE schools ADD COLUMN status VARCHAR(30) DEFAULT 'TRIAL';
    END IF;
    -- trial_ends_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='trial_ends_at') THEN
        ALTER TABLE schools ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;
    END IF;
    -- subscription_ends_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='subscription_ends_at') THEN
        ALTER TABLE schools ADD COLUMN subscription_ends_at TIMESTAMP WITH TIME ZONE;
    END IF;
    -- owner_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='owner_id') THEN
        ALTER TABLE schools ADD COLUMN owner_id INTEGER;
    END IF;
    -- logo_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='logo_url') THEN
        ALTER TABLE schools ADD COLUMN logo_url TEXT;
    END IF;
    -- cover_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='cover_url') THEN
        ALTER TABLE schools ADD COLUMN cover_url TEXT;
    END IF;
    -- website_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='website_url') THEN
        ALTER TABLE schools ADD COLUMN website_url VARCHAR(255);
    END IF;
    -- settings
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='settings') THEN
        ALTER TABLE schools ADD COLUMN settings JSONB;
    END IF;
    -- students_count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='students_count') THEN
        ALTER TABLE schools ADD COLUMN students_count INTEGER DEFAULT 0;
    END IF;
END $$;

COMMIT;
