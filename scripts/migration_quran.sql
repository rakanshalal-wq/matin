-- ===== وحدة تحفيظ القرآن الكريم — متين =====
-- تنفيذ: psql -d <database> -f scripts/migration_quran.sql

-- مراكز التحفيظ (تستخدم جدول schools الحالي + نوع quran_center)
-- لا حاجة لجدول جديد — يُستخدم school_id من جدول schools

-- حلقات التحفيظ
CREATE TABLE IF NOT EXISTS quran_circles (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  school_id    INTEGER,
  teacher_id   INTEGER,
  schedule     TEXT,          -- مثل: "السبت والاثنين 10:00–11:30"
  max_students INTEGER DEFAULT 15,
  level        VARCHAR(50) DEFAULT 'مبتدئ', -- مبتدئ، متوسط، متقدم
  status       VARCHAR(20) DEFAULT 'active',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- طلاب الحلقات
CREATE TABLE IF NOT EXISTS quran_students (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(200) NOT NULL,
  circle_id       INTEGER REFERENCES quran_circles(id) ON DELETE SET NULL,
  school_id       INTEGER,
  parent_phone    VARCHAR(30),
  date_of_birth   DATE,
  current_juz     INTEGER DEFAULT 0, -- الجزء الحالي (0-30)
  total_memorized TEXT,              -- مثال: "جزء 1 + 2 + الفاتحة"
  notes           TEXT,
  status          VARCHAR(20) DEFAULT 'active',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- جلسات التسميع المباشرة
CREATE TABLE IF NOT EXISTS quran_sessions (
  id           SERIAL PRIMARY KEY,
  circle_id    INTEGER REFERENCES quran_circles(id) ON DELETE SET NULL,
  teacher_id   INTEGER,
  school_id    INTEGER,
  title        VARCHAR(200),
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  ended_at     TIMESTAMPTZ,
  status       VARCHAR(20) DEFAULT 'active', -- active, ended
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- حضور الحلقات
CREATE TABLE IF NOT EXISTS quran_attendance (
  id          SERIAL PRIMARY KEY,
  session_id  INTEGER REFERENCES quran_sessions(id) ON DELETE CASCADE,
  student_id  INTEGER REFERENCES quran_students(id) ON DELETE CASCADE,
  circle_id   INTEGER,
  school_id   INTEGER,
  date        DATE NOT NULL,
  status      VARCHAR(20) DEFAULT 'PRESENT', -- PRESENT, ABSENT, LATE, EXCUSED
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- تقدم الحفظ
CREATE TABLE IF NOT EXISTS quran_progress (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER REFERENCES quran_students(id) ON DELETE CASCADE,
  session_id    INTEGER REFERENCES quran_sessions(id) ON DELETE SET NULL,
  school_id     INTEGER,
  surah_name    VARCHAR(100),
  from_ayah     INTEGER,
  to_ayah       INTEGER,
  juz_number    INTEGER,
  rating        VARCHAR(20) DEFAULT 'جيد', -- ممتاز، جيد جداً، جيد، يحتاج مراجعة
  tajweed_notes TEXT,
  date          DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- خطط الحفظ
CREATE TABLE IF NOT EXISTS quran_plans (
  id          SERIAL PRIMARY KEY,
  circle_id   INTEGER REFERENCES quran_circles(id) ON DELETE CASCADE,
  school_id   INTEGER,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  target_juz  INTEGER,       -- الهدف: كم جزء
  duration_weeks INTEGER,    -- المدة بالأسابيع
  status      VARCHAR(20) DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- نقاط التحفيز
CREATE TABLE IF NOT EXISTS quran_points (
  id          SERIAL PRIMARY KEY,
  student_id  INTEGER REFERENCES quran_students(id) ON DELETE CASCADE,
  school_id   INTEGER,
  points      INTEGER DEFAULT 0,
  reason      VARCHAR(200),
  added_by    INTEGER, -- teacher_id
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- الفهارس
CREATE INDEX IF NOT EXISTS idx_quran_circles_school ON quran_circles(school_id);
CREATE INDEX IF NOT EXISTS idx_quran_students_circle ON quran_students(circle_id);
CREATE INDEX IF NOT EXISTS idx_quran_sessions_circle ON quran_sessions(circle_id);
CREATE INDEX IF NOT EXISTS idx_quran_attendance_session ON quran_attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_quran_progress_student ON quran_progress(student_id);
