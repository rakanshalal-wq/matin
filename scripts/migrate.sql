-- ═══════════════════════════════════════════════════════════════════
-- منصة متين التعليمية — Migration الكامل v5
-- قاعدة البيانات: PostgreSQL 14+
-- تشغيل: psql -U matin_user -d matin_db -f scripts/migrate.sql
-- ═══════════════════════════════════════════════════════════════════

-- ─── Extensions ───────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'super_admin', 'platform_staff', 'owner', 'admin', 'staff',
    'teacher', 'student', 'parent', 'driver'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE institution_type AS ENUM (
    'school', 'university', 'institute', 'kindergarten', 'nursery', 'training_center'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE plan_type AS ENUM (
    'free', 'basic', 'professional', 'enterprise', 'gold'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lecture_type AS ENUM ('onsite', 'online', 'recorded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lecture_status AS ENUM (
    'scheduled', 'confirmed', 'online_auto', 'recorded_auto', 'absent', 'completed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'excused', 'late');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'refunded', 'partial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE admission_status AS ENUM ('pending', 'approved', 'rejected', 'waitlisted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══════════════════════════════════════════════════════════════════
-- 1. إعدادات المنصة
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS platform_settings (
  id          SERIAL PRIMARY KEY,
  key         VARCHAR(100) UNIQUE NOT NULL,
  value       TEXT,
  category    VARCHAR(50) DEFAULT 'general',
  description TEXT,
  updated_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO platform_settings (key, value, category, description) VALUES
  ('platform_name',       'متين',                    'general',  'اسم المنصة'),
  ('platform_name_en',    'Matin',                   'general',  'اسم المنصة بالإنجليزية'),
  ('platform_logo',       '/logo.png',               'general',  'شعار المنصة'),
  ('platform_domain',     'matin.ink',               'general',  'نطاق المنصة'),
  ('otp_enabled',         'false',                   'security', 'تفعيل OTP'),
  ('sovereign_tax_rate',  '2.5',                     'finance',  'نسبة الضريبة السيادية %'),
  ('vat_rate',            '15',                      'finance',  'نسبة ضريبة القيمة المضافة %'),
  ('maintenance_mode',    'false',                   'system',   'وضع الصيانة'),
  ('email_from',          'noreply@matin.ink',       'email',    'إيميل الإرسال'),
  ('email_from_name',     'منصة متين',               'email',    'اسم المرسل'),
  ('email_api_key',       '',                        'email',    'مفتاح Resend API'),
  ('sms_provider',        'unifonic',                'sms',      'مزود الرسائل'),
  ('sms_api_key',         '',                        'sms',      'مفتاح SMS API'),
  ('whatsapp_token',      '',                        'whatsapp', 'توكن واتساب'),
  ('whatsapp_phone_id',   '',                        'whatsapp', 'رقم واتساب'),
  ('payment_gateway',     'hyperpay',                'payment',  'بوابة الدفع'),
  ('hyperpay_token',      '',                        'payment',  'توكن HyperPay'),
  ('moyasar_key',         '',                        'payment',  'مفتاح Moyasar')
ON CONFLICT (key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- 2. المؤسسات التعليمية
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS institutions (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  name            VARCHAR(200) NOT NULL,
  name_en         VARCHAR(200),
  type            institution_type NOT NULL DEFAULT 'school',
  plan            plan_type NOT NULL DEFAULT 'free',
  logo            TEXT,
  cover_image     TEXT,
  description     TEXT,
  address         TEXT,
  city            VARCHAR(100),
  region          VARCHAR(100),
  phone           VARCHAR(20),
  email           VARCHAR(200),
  website         TEXT,
  license_number  VARCHAR(100),
  license_expiry  DATE,
  max_students    INTEGER DEFAULT 100,
  current_students INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  is_verified     BOOLEAN DEFAULT false,
  plan_expires_at TIMESTAMP,
  sovereign_tax_rate DECIMAL(5,2) DEFAULT 2.5,
  show_matin_ads  BOOLEAN DEFAULT true,
  custom_domain   VARCHAR(200),
  settings        JSONB DEFAULT '{}',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 3. المستخدمون
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id                    SERIAL PRIMARY KEY,
  tenant_id             VARCHAR(50),
  institution_id        INTEGER REFERENCES institutions(id) ON DELETE SET NULL,
  role                  user_role NOT NULL DEFAULT 'student',
  name                  VARCHAR(200) NOT NULL,
  name_en               VARCHAR(200),
  email                 VARCHAR(200) UNIQUE NOT NULL,
  phone                 VARCHAR(20),
  national_id           VARCHAR(20),
  password              TEXT NOT NULL,
  avatar                TEXT,
  gender                VARCHAR(10),
  date_of_birth         DATE,
  address               TEXT,
  is_active             BOOLEAN DEFAULT true,
  is_verified           BOOLEAN DEFAULT false,
  must_change_password  BOOLEAN DEFAULT false,
  last_login            TIMESTAMP,
  login_count           INTEGER DEFAULT 0,
  failed_attempts       INTEGER DEFAULT 0,
  locked_until          TIMESTAMP,
  package               plan_type DEFAULT 'free',
  school_id             INTEGER,
  owner_id              INTEGER,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);

-- Super Admin الافتراضي
INSERT INTO users (role, name, email, password, is_active, is_verified)
VALUES (
  'super_admin',
  'مالك المنصة',
  'admin@matin.ink',
  '$2b$10$rOzJqQZQZQZQZQZQZQZQZOZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZ',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- 4. OTP
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS otp_codes (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code        VARCHAR(6) NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  used        BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 5. الفصول الدراسية
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS classes (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  institution_id  INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  grade_level     VARCHAR(50),
  academic_year   VARCHAR(20),
  semester        VARCHAR(20),
  capacity        INTEGER DEFAULT 30,
  current_count   INTEGER DEFAULT 0,
  homeroom_teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 6. المواد الدراسية
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS subjects (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  institution_id  INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name            VARCHAR(200) NOT NULL,
  name_en         VARCHAR(200),
  code            VARCHAR(50),
  description     TEXT,
  credit_hours    INTEGER DEFAULT 3,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 7. ربط المعلم بالمادة والفصل
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS teacher_assignments (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  teacher_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id        INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id      INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  academic_year   VARCHAR(20),
  semester        VARCHAR(20),
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(teacher_id, class_id, subject_id, academic_year, semester)
);

-- ═══════════════════════════════════════════════════════════════════
-- 8. تسجيل الطلاب في الفصول
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS student_enrollments (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id        INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  academic_year   VARCHAR(20),
  semester        VARCHAR(20),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status          VARCHAR(20) DEFAULT 'active',
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, class_id, academic_year, semester)
);

-- ═══════════════════════════════════════════════════════════════════
-- 9. الجدول الدراسي
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS schedules (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  class_id        INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id      INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week     INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  room            VARCHAR(50),
  academic_year   VARCHAR(20),
  semester        VARCHAR(20),
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 10. المحاضرات والحصص
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS lectures (
  id                SERIAL PRIMARY KEY,
  tenant_id         VARCHAR(50) NOT NULL,
  schedule_id       INTEGER REFERENCES schedules(id) ON DELETE SET NULL,
  class_id          INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id        INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title             VARCHAR(200),
  type              lecture_type DEFAULT 'onsite',
  status            lecture_status DEFAULT 'scheduled',
  scheduled_at      TIMESTAMP NOT NULL,
  confirmed_at      TIMESTAMP,
  started_at        TIMESTAMP,
  ended_at          TIMESTAMP,
  online_link       TEXT,
  recording_url     TEXT,
  notes             TEXT,
  alert_3h_sent     BOOLEAN DEFAULT false,
  alert_2h_sent     BOOLEAN DEFAULT false,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 11. الحضور والغياب
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS attendance (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  lecture_id      INTEGER NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          attendance_status DEFAULT 'absent',
  gps_lat         DECIMAL(10,7),
  gps_lng         DECIMAL(10,7),
  gps_distance    DECIMAL(10,2),
  check_in_time   TIMESTAMP,
  excuse_reason   TEXT,
  excuse_doc      TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(lecture_id, student_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- 12. الدرجات والتقييم
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS grades (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id        INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id      INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade_type      VARCHAR(50) NOT NULL,
  title           VARCHAR(200),
  score           DECIMAL(8,2) NOT NULL,
  max_score       DECIMAL(8,2) NOT NULL,
  percentage      DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN max_score > 0 THEN (score / max_score * 100) ELSE 0 END) STORED,
  semester        VARCHAR(20),
  academic_year   VARCHAR(20),
  notes           TEXT,
  is_final        BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 13. الواجبات
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS assignments (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  class_id        INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id      INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(300) NOT NULL,
  description     TEXT,
  due_date        TIMESTAMP NOT NULL,
  max_score       DECIMAL(8,2) DEFAULT 10,
  attachments     JSONB DEFAULT '[]',
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  assignment_id   INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT,
  attachments     JSONB DEFAULT '[]',
  score           DECIMAL(8,2),
  feedback        TEXT,
  submitted_at    TIMESTAMP DEFAULT NOW(),
  graded_at       TIMESTAMP,
  status          VARCHAR(20) DEFAULT 'submitted',
  UNIQUE(assignment_id, student_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- 14. الاختبارات
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS exams (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  class_id        INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id      INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(300) NOT NULL,
  description     TEXT,
  exam_type       VARCHAR(50) DEFAULT 'quiz',
  duration_minutes INTEGER DEFAULT 60,
  total_marks     DECIMAL(8,2) DEFAULT 100,
  pass_marks      DECIMAL(8,2) DEFAULT 50,
  start_time      TIMESTAMP,
  end_time        TIMESTAMP,
  is_published    BOOLEAN DEFAULT false,
  is_encrypted    BOOLEAN DEFAULT true,
  shuffle_questions BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  exam_id         INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  subject_id      INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  teacher_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_text   TEXT NOT NULL,
  question_type   VARCHAR(50) DEFAULT 'mcq',
  options         JSONB DEFAULT '[]',
  correct_answer  TEXT,
  marks           DECIMAL(8,2) DEFAULT 1,
  difficulty      VARCHAR(20) DEFAULT 'medium',
  status          VARCHAR(20) DEFAULT 'green',
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_results (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  exam_id         INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score           DECIMAL(8,2),
  percentage      DECIMAL(5,2),
  answers         JSONB DEFAULT '{}',
  started_at      TIMESTAMP,
  submitted_at    TIMESTAMP,
  status          VARCHAR(20) DEFAULT 'pending',
  UNIQUE(exam_id, student_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- 15. نظام القبول والتسجيل
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS admissions (
  id                SERIAL PRIMARY KEY,
  tenant_id         VARCHAR(50) NOT NULL,
  institution_id    INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  applicant_name    VARCHAR(200) NOT NULL,
  applicant_email   VARCHAR(200),
  applicant_phone   VARCHAR(20),
  national_id       VARCHAR(20),
  date_of_birth     DATE,
  gender            VARCHAR(10),
  grade_applying    VARCHAR(50),
  academic_year     VARCHAR(20),
  documents         JSONB DEFAULT '[]',
  status            admission_status DEFAULT 'pending',
  notes             TEXT,
  reviewed_by       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at       TIMESTAMP,
  application_fee   DECIMAL(10,2) DEFAULT 0,
  fee_paid          BOOLEAN DEFAULT false,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 16. المدفوعات والرسوم
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS payments (
  id                SERIAL PRIMARY KEY,
  tenant_id         VARCHAR(50) NOT NULL,
  institution_id    INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount            DECIMAL(12,2) NOT NULL,
  vat               DECIMAL(12,2) DEFAULT 0,
  sovereign_tax     DECIMAL(12,2) DEFAULT 0,
  net_amount        DECIMAL(12,2),
  status            payment_status DEFAULT 'pending',
  payment_type      VARCHAR(50) DEFAULT 'tuition',
  description       TEXT,
  due_date          DATE,
  paid_at           TIMESTAMP,
  gateway           VARCHAR(50),
  gateway_ref       VARCHAR(200),
  invoice_number    VARCHAR(100),
  semester          VARCHAR(20),
  academic_year     VARCHAR(20),
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 17. الباقات والاشتراكات
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS subscription_plans (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  name_en         VARCHAR(100),
  plan_key        plan_type UNIQUE NOT NULL,
  description     TEXT,
  price_monthly   DECIMAL(10,2) DEFAULT 0,
  price_yearly    DECIMAL(10,2) DEFAULT 0,
  max_students    INTEGER DEFAULT 100,
  max_teachers    INTEGER DEFAULT 10,
  max_classes     INTEGER DEFAULT 5,
  features        JSONB DEFAULT '[]',
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

INSERT INTO subscription_plans (name, name_en, plan_key, description, price_monthly, price_yearly, max_students, max_teachers, max_classes, features) VALUES
  ('مجانية',      'Free',         'free',         'للمؤسسات الصغيرة — تجريبية',        0,    0,     100,  5,   3,  '["حضور","درجات","رسائل","جداول"]'),
  ('أساسية',      'Basic',        'basic',        'للمؤسسات المتوسطة',                  299,  2990,  500,  25,  15, '["حضور","درجات","اختبارات","تقارير","مكتبة"]'),
  ('احترافية',    'Professional', 'professional', 'للمؤسسات الكبيرة',                   699,  6990,  2000, 100, 50, '["كل الأساسية","متجر","AI","تصدير","مجتمع","MatinCoin"]'),
  ('مؤسسية',      'Enterprise',   'enterprise',   'للجامعات والسلاسل',                  0,    0,     99999,999, 999,'["كل الاحترافية","نقل","مقصف","صحة","GPS","API","Portfolio"]'),
  ('ذهبية',       'Gold',         'gold',         'للجهات الحكومية',                    0,    0,     99999,999, 999,'["كل المميزات","تعديلات","إخفاء إعلانات متين"]')
ON CONFLICT (plan_key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- 18. الكوبونات
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS coupons (
  id              SERIAL PRIMARY KEY,
  code            VARCHAR(50) UNIQUE NOT NULL,
  description     TEXT,
  discount_type   VARCHAR(20) DEFAULT 'percentage',
  discount_value  DECIMAL(10,2) NOT NULL,
  max_uses        INTEGER DEFAULT 1,
  used_count      INTEGER DEFAULT 0,
  valid_from      TIMESTAMP DEFAULT NOW(),
  valid_until     TIMESTAMP,
  is_active       BOOLEAN DEFAULT true,
  created_by      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 19. الإشعارات
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notifications (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50),
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(300) NOT NULL,
  body            TEXT,
  type            VARCHAR(50) DEFAULT 'info',
  is_read         BOOLEAN DEFAULT false,
  action_url      TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 20. الإعلانات السيادية
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS advertisements (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(300) NOT NULL,
  content         TEXT,
  image_url       TEXT,
  link_url        TEXT,
  target_roles    JSONB DEFAULT '["all"]',
  is_mandatory    BOOLEAN DEFAULT true,
  is_active       BOOLEAN DEFAULT true,
  start_date      TIMESTAMP DEFAULT NOW(),
  end_date        TIMESTAMP,
  views_count     INTEGER DEFAULT 0,
  created_by      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 21. النقل المدرسي
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS buses (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  institution_id  INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  plate_number    VARCHAR(20) NOT NULL,
  capacity        INTEGER DEFAULT 30,
  driver_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  route_name      VARCHAR(200),
  is_active       BOOLEAN DEFAULT true,
  gps_device_id   VARCHAR(100),
  last_lat        DECIMAL(10,7),
  last_lng        DECIMAL(10,7),
  last_update     TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bus_routes (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  bus_id          INTEGER NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pickup_address  TEXT,
  pickup_lat      DECIMAL(10,7),
  pickup_lng      DECIMAL(10,7),
  dropoff_address TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bus_trips (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  bus_id          INTEGER NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
  trip_date       DATE NOT NULL,
  trip_type       VARCHAR(20) DEFAULT 'morning',
  started_at      TIMESTAMP,
  ended_at        TIMESTAMP,
  status          VARCHAR(20) DEFAULT 'scheduled'
);

CREATE TABLE IF NOT EXISTS bus_boarding (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  trip_id         INTEGER NOT NULL REFERENCES bus_trips(id) ON DELETE CASCADE,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boarded         BOOLEAN DEFAULT false,
  boarded_at      TIMESTAMP,
  alighted        BOOLEAN DEFAULT false,
  alighted_at     TIMESTAMP,
  parent_notified BOOLEAN DEFAULT false
);

-- ═══════════════════════════════════════════════════════════════════
-- 22. المقصف الذكي
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS cafeteria_items (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  institution_id  INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name            VARCHAR(200) NOT NULL,
  description     TEXT,
  price           DECIMAL(10,2) NOT NULL,
  category        VARCHAR(100),
  allergens       JSONB DEFAULT '[]',
  image_url       TEXT,
  is_available    BOOLEAN DEFAULT true,
  calories        INTEGER,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cafeteria_wallets (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance         DECIMAL(10,2) DEFAULT 0,
  daily_limit     DECIMAL(10,2) DEFAULT 50,
  updated_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id)
);

CREATE TABLE IF NOT EXISTS cafeteria_transactions (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  wallet_id       INTEGER NOT NULL REFERENCES cafeteria_wallets(id) ON DELETE CASCADE,
  amount          DECIMAL(10,2) NOT NULL,
  type            VARCHAR(20) DEFAULT 'purchase',
  description     TEXT,
  items           JSONB DEFAULT '[]',
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 23. المكتبة الرقمية
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS library_resources (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50),
  institution_id  INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
  title           VARCHAR(300) NOT NULL,
  author          VARCHAR(200),
  description     TEXT,
  type            VARCHAR(50) DEFAULT 'pdf',
  file_url        TEXT,
  cover_url       TEXT,
  subject_id      INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  grade_level     VARCHAR(50),
  is_public       BOOLEAN DEFAULT false,
  downloads       INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 24. الملتقى المجتمعي
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS forum_posts (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  institution_id  INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  author_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(300),
  content         TEXT NOT NULL,
  category        VARCHAR(100),
  is_pinned       BOOLEAN DEFAULT false,
  is_approved     BOOLEAN DEFAULT true,
  views           INTEGER DEFAULT 0,
  likes           INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_replies (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  post_id         INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_approved     BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 25. المتجر
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS store_products (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  institution_id  INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name            VARCHAR(300) NOT NULL,
  description     TEXT,
  price           DECIMAL(10,2) NOT NULL,
  stock           INTEGER DEFAULT 0,
  category        VARCHAR(100),
  images          JSONB DEFAULT '[]',
  is_active       BOOLEAN DEFAULT true,
  commission_rate DECIMAL(5,2) DEFAULT 2.5,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_orders (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  institution_id  INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  buyer_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items           JSONB NOT NULL,
  total_amount    DECIMAL(12,2) NOT NULL,
  commission      DECIMAL(12,2) DEFAULT 0,
  status          VARCHAR(30) DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 26. العمولات والإحالات
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS commissions (
  id              SERIAL PRIMARY KEY,
  referrer_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id  INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  amount          DECIMAL(12,2) NOT NULL,
  type            VARCHAR(50) DEFAULT 'referral',
  status          VARCHAR(20) DEFAULT 'pending',
  paid_at         TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 27. سجل الأمان (Audit Log) — غير قابل للحذف
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50),
  user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action          VARCHAR(100) NOT NULL,
  entity          VARCHAR(100),
  entity_id       VARCHAR(100),
  old_value       JSONB,
  new_value       JSONB,
  ip_address      VARCHAR(45),
  user_agent      TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMP DEFAULT NOW()
);

-- منع الحذف من audit_logs
CREATE OR REPLACE RULE no_delete_audit AS ON DELETE TO audit_logs DO INSTEAD NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- 28. الرسائل والمحادثات
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS conversations (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  participant_1   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_2   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message    TEXT,
  last_message_at TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

CREATE TABLE IF NOT EXISTS messages (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 29. السجل الصحي
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS health_records (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blood_type      VARCHAR(5),
  allergies       JSONB DEFAULT '[]',
  chronic_diseases JSONB DEFAULT '[]',
  medications     JSONB DEFAULT '[]',
  emergency_contact VARCHAR(200),
  emergency_phone VARCHAR(20),
  notes           TEXT,
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vaccinations (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50) NOT NULL,
  student_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vaccine_name    VARCHAR(200) NOT NULL,
  dose_number     INTEGER DEFAULT 1,
  date_given      DATE,
  next_dose_date  DATE,
  administered_by VARCHAR(200),
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 30. الدعم الفني
-- ═══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS support_tickets (
  id              SERIAL PRIMARY KEY,
  tenant_id       VARCHAR(50),
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id  INTEGER REFERENCES institutions(id) ON DELETE SET NULL,
  title           VARCHAR(300) NOT NULL,
  description     TEXT NOT NULL,
  category        VARCHAR(100),
  priority        VARCHAR(20) DEFAULT 'medium',
  status          VARCHAR(30) DEFAULT 'open',
  assigned_to     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  resolved_at     TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_replies (
  id              SERIAL PRIMARY KEY,
  ticket_id       INTEGER NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_internal     BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- Indexes للأداء
-- ═══════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_institution ON users(institution_id);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendance_lecture ON attendance(lecture_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_subject ON grades(subject_id);
CREATE INDEX IF NOT EXISTS idx_lectures_scheduled ON lectures(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_lectures_teacher ON lectures(teacher_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_institution ON payments(institution_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ═══════════════════════════════════════════════════════════════════
-- تشغيل Migration بنجاح
-- ═══════════════════════════════════════════════════════════════════
SELECT 'Migration completed successfully — منصة متين v5' AS status;
