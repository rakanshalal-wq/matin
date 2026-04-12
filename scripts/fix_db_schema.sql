-- =====================================================
-- إصلاح هيكل قاعدة البيانات - منصة متين
-- التاريخ: 2026-02-27
-- =====================================================

-- 1. إضافة الأعمدة المفقودة في جدول users
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS school_id TEXT,
  ADD COLUMN IF NOT EXISTS owner_id TEXT,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS package VARCHAR(50) DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS code_expires_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
  ADD COLUMN IF NOT EXISTS institution_type VARCHAR(50);

-- 2. إضافة الأعمدة المفقودة في جدول schools
ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS owner_id TEXT,
  ADD COLUMN IF NOT EXISTS institution_type VARCHAR(50) DEFAULT 'school',
  ADD COLUMN IF NOT EXISTS students_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'trial';

-- 3. إنشاء جدول subscriptions إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  school_id TEXT NOT NULL,
  owner_id TEXT,
  plan_id INTEGER,
  status VARCHAR(20) DEFAULT 'trial',
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  trial_ends_at TIMESTAMP,
  starts_at TIMESTAMP DEFAULT NOW(),
  ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. إنشاء جدول plans إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  name_ar VARCHAR(100),
  price_monthly NUMERIC DEFAULT 0,
  price_yearly NUMERIC DEFAULT 0,
  max_students INTEGER DEFAULT 100,
  max_teachers INTEGER DEFAULT 10,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- إدراج الخطط الافتراضية
INSERT INTO plans (name, name_ar, price_monthly, price_yearly, max_students, max_teachers) VALUES
  ('starter', 'المبتدئ', 299, 2990, 100, 10),
  ('professional', 'الاحترافي', 599, 5990, 500, 50),
  ('enterprise', 'المؤسسي', 1299, 12990, 2000, 200)
ON CONFLICT (name) DO NOTHING;

-- 5. إنشاء جدول school_staff لربط الموظفين بالمدارس
CREATE TABLE IF NOT EXISTS school_staff (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'teacher',
  status VARCHAR(20) DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, school_id)
);

-- 6. إنشاء جدول school_owners لربط المالكين بالمدارس
CREATE TABLE IF NOT EXISTS school_owners (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(school_id)
);

-- 7. إضافة فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_school_id ON subscriptions(school_id);

-- 8. تحديث جدول question_bank - إضافة أعمدة مفقودة
ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- 9. إنشاء جدول exam_results
CREATE TABLE IF NOT EXISTS exam_results (
  id SERIAL PRIMARY KEY,
  exam_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  school_id TEXT,
  score NUMERIC DEFAULT 0,
  max_score NUMERIC DEFAULT 100,
  percentage NUMERIC DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  answers JSONB DEFAULT '{}',
  time_taken INTEGER DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT NOW(),
  graded_at TIMESTAMP,
  graded_by INTEGER,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_results_exam_id ON exam_results(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results(student_id);

-- 10. إنشاء جدول notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  school_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- تأكيد الإنجاز
SELECT 'تم إصلاح هيكل قاعدة البيانات بنجاح ✓' as status;
