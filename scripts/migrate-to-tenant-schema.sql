-- ═══════════════════════════════════════════════════════════════════
-- منصة متين — سكريبت نقل البيانات الموجودة إلى Schemas معزولة
-- تشغيل: psql -U matin_user -d matin_db -f scripts/migrate-to-tenant-schema.sql
--
-- ⚠️  تحذير: شغّل هذا السكريبت في وقت انخفاض الحركة
--     وتأكد من أخذ backup كامل قبل التشغيل.
-- ═══════════════════════════════════════════════════════════════════

-- ─── دالة مساعدة: إنشاء Schema ونقل بيانات مدرسة واحدة ────────────
CREATE OR REPLACE FUNCTION migrate_school_to_tenant(p_school_id INTEGER)
RETURNS TEXT AS $$
DECLARE
  v_schema    TEXT := 'school_' || p_school_id;
  v_owner_id  INTEGER;
  v_tenant_id INTEGER;
  v_count_s   INTEGER;
  v_count_t   INTEGER;
BEGIN
  -- جلب owner_id
  SELECT owner_id INTO v_owner_id FROM schools WHERE id = p_school_id;
  IF v_owner_id IS NULL THEN
    RETURN 'ERROR: school ' || p_school_id || ' not found';
  END IF;

  -- إنشاء Schema إن لم يكن موجوداً
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', v_schema);

  -- ─── جدول students ───────────────────────────────────────────
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.students (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id      VARCHAR(50) UNIQUE,
      gender          VARCHAR(10) DEFAULT ''MALE'',
      date_of_birth   DATE,
      class_id        INTEGER,
      user_id         TEXT,
      school_id       TEXT,
      owner_id        TEXT,
      enrollment_date DATE DEFAULT NOW(),
      notes           TEXT,
      created_at      TIMESTAMP DEFAULT NOW(),
      updated_at      TIMESTAMP DEFAULT NOW()
    )', v_schema);

  -- ─── جدول teachers ───────────────────────────────────────────
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.teachers (
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
    )', v_schema);

  -- ─── جدول classes ────────────────────────────────────────────
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.classes (
      id              SERIAL PRIMARY KEY,
      name            VARCHAR(100) NOT NULL,
      grade_level     VARCHAR(50),
      academic_year   VARCHAR(20),
      capacity        INTEGER DEFAULT 30,
      school_id       TEXT,
      teacher_id      TEXT,
      created_at      TIMESTAMP DEFAULT NOW()
    )', v_schema);

  -- ─── جدول attendance ─────────────────────────────────────────
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.attendance (
      id              SERIAL PRIMARY KEY,
      student_id      UUID,
      class_id        INTEGER,
      date            DATE NOT NULL,
      status          VARCHAR(20) DEFAULT ''present'',
      notes           TEXT,
      created_by      TEXT,
      created_at      TIMESTAMP DEFAULT NOW()
    )', v_schema);

  -- ─── جدول grades ─────────────────────────────────────────────
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.grades (
      id              SERIAL PRIMARY KEY,
      student_id      UUID,
      subject_id      INTEGER,
      exam_type       VARCHAR(50),
      score           DECIMAL(5,2),
      max_score       DECIMAL(5,2) DEFAULT 100,
      semester        VARCHAR(20),
      academic_year   VARCHAR(20),
      created_by      TEXT,
      created_at      TIMESTAMP DEFAULT NOW()
    )', v_schema);

  -- ─── جدول schedules ──────────────────────────────────────────
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.schedules (
      id              SERIAL PRIMARY KEY,
      class_id        INTEGER,
      subject_id      INTEGER,
      teacher_id      TEXT,
      day_of_week     VARCHAR(15),
      start_time      TIME,
      end_time        TIME,
      room            VARCHAR(50),
      created_at      TIMESTAMP DEFAULT NOW()
    )', v_schema);

  -- ─── جدول uploaded_files ─────────────────────────────────────
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.uploaded_files (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      file_name       VARCHAR(255) NOT NULL,
      file_path       TEXT NOT NULL,
      file_size       BIGINT NOT NULL DEFAULT 0,
      file_type       VARCHAR(100),
      category        VARCHAR(50) DEFAULT ''general'',
      uploaded_by     TEXT,
      created_at      TIMESTAMP DEFAULT NOW()
    )', v_schema);

  -- ─── نقل بيانات الطلاب ───────────────────────────────────────
  EXECUTE format('
    INSERT INTO %I.students
           (id, student_id, gender, date_of_birth, class_id, user_id,
            school_id, owner_id, enrollment_date, notes, created_at, updated_at)
    SELECT id::uuid, student_id, gender, date_of_birth, class_id::integer, user_id::text,
           school_id::text, owner_id::text, enrollment_date, notes, created_at, updated_at
    FROM   public.students
    WHERE  school_id::text = $1::text
    ON CONFLICT (id) DO NOTHING',
    v_schema
  ) USING p_school_id;

  -- ─── نقل بيانات الدرجات ──────────────────────────────────────
  EXECUTE format('
    INSERT INTO %I.grades
           (student_id, subject_id, exam_type, score, max_score, semester, academic_year, created_by, created_at)
    SELECT g.student_id::uuid, g.subject_id::integer, g.exam_type, g.score::decimal,
           g.max_score::decimal, g.semester, g.academic_year, g.recorded_by::text, g.created_at
    FROM public.grades g
    WHERE g.school_id::text = $1::text
    ON CONFLICT DO NOTHING',
    v_schema
  ) USING p_school_id;

  -- ─── نقل بيانات الحضور ───────────────────────────────────────
  EXECUTE format('
    INSERT INTO %I.attendance
           (student_id, class_id, date, status, notes, created_by, created_at)
    SELECT a.student_id::uuid, a.class_id::integer, a.date, a.status::text,
           a.notes, a.recorded_by::text, a.created_at
    FROM public.attendance a
    WHERE a.school_id::text = $1::text
    ON CONFLICT DO NOTHING',
    v_schema
  ) USING p_school_id;

  -- ─── إحصاء ما تم نقله ────────────────────────────────────────
  EXECUTE format('SELECT COUNT(*) FROM %I.students', v_schema) INTO v_count_s;
  EXECUTE format('SELECT COUNT(*) FROM %I.grades',   v_schema) INTO v_count_t;

  -- ─── إنشاء/تحديث سجل tenant ──────────────────────────────────
  INSERT INTO tenants (schema_name, owner_id, school_id, status, migrated)
  VALUES (v_schema, v_owner_id, p_school_id, 'active', true)
  ON CONFLICT (schema_name) DO UPDATE SET migrated = true, updated_at = NOW();

  -- جلب tenant_id
  SELECT id INTO v_tenant_id FROM tenants WHERE schema_name = v_schema;

  -- ─── إنشاء/تحديث سجل الحصص ──────────────────────────────────
  INSERT INTO tenant_quotas (tenant_id, current_students, current_storage_bytes)
  VALUES (v_tenant_id, v_count_s, 0)
  ON CONFLICT (tenant_id) DO UPDATE
    SET current_students = v_count_s, last_updated = NOW();

  RETURN format('OK: %s — نُقل %s طالب, %s درجة', v_schema, v_count_s, v_count_t);
END;
$$ LANGUAGE plpgsql;

-- ─── تشغيل النقل على جميع المدارس ────────────────────────────────
DO $$
DECLARE
  r RECORD;
  result TEXT;
BEGIN
  FOR r IN SELECT id FROM schools ORDER BY id
  LOOP
    BEGIN
      result := migrate_school_to_tenant(r.id);
      RAISE NOTICE '%', result;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'فشل نقل school_% : %', r.id, SQLERRM;
    END;
  END LOOP;
END $$;
