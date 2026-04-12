-- =====================================================
-- Migration v3: إضافة الجداول المفقودة من الـ API routes
-- تاريخ: 2026-03-13
-- =====================================================

-- 1. activity_log (سجل النشاطات للـ AI)
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activity_log_school ON activity_log(school_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);

-- 2. advertisements (الإعلانات)
CREATE TABLE IF NOT EXISTS advertisements (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  image_url TEXT,
  link TEXT,
  bg_color VARCHAR(20) DEFAULT '#6C63FF',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ai_moderation (مراقبة المحتوى بالذكاء الاصطناعي)
CREATE TABLE IF NOT EXISTS ai_moderation (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- post, comment, message
  content_id INTEGER NOT NULL,
  content_text TEXT,
  verdict VARCHAR(20) DEFAULT 'pending', -- approved, rejected, pending
  reason TEXT,
  confidence DECIMAL(5,2),
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_moderation_school ON ai_moderation(school_id);

-- 4. attendances (alias لـ attendance - للتوافق)
-- ملاحظة: جدول attendance موجود، هذا view للتوافق
CREATE OR REPLACE VIEW attendances AS SELECT * FROM attendance;

-- 5. bus (الحافلات)
CREATE TABLE IF NOT EXISTS bus (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  plate_number VARCHAR(20) NOT NULL,
  driver_name VARCHAR(100),
  driver_phone VARCHAR(20),
  capacity INTEGER DEFAULT 30,
  route_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(11,8),
  last_location_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bus_school ON bus(school_id);

-- 6. cafeteria (إعدادات المقصف)
CREATE TABLE IF NOT EXISTS cafeteria (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) DEFAULT 'المقصف المدرسي',
  is_open BOOLEAN DEFAULT true,
  open_time TIME DEFAULT '07:00',
  close_time TIME DEFAULT '14:00',
  daily_limit DECIMAL(10,2) DEFAULT 50.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. classes (الفصول - alias لـ classrooms)
CREATE OR REPLACE VIEW classes AS SELECT * FROM classrooms;

-- 8. comments (تعليقات عامة - alias لـ post_comments)
CREATE TABLE IF NOT EXISTS post_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);
CREATE OR REPLACE VIEW comments AS SELECT * FROM post_comments;

-- 9. commissions (العمولات للشركاء)
CREATE TABLE IF NOT EXISTS commissions (
  id BIGSERIAL PRIMARY KEY,
  partner_id INTEGER,
  school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  rate DECIMAL(5,2) DEFAULT 10.00,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, cancelled
  period_start DATE,
  period_end DATE,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. contracts (العقود)
CREATE TABLE IF NOT EXISTS contracts (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  party_name VARCHAR(200),
  contract_type VARCHAR(50) DEFAULT 'service',
  start_date DATE,
  end_date DATE,
  value DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
  notes TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contracts_school ON contracts(school_id);

-- 11. contracts_docs (مستندات العقود)
CREATE TABLE IF NOT EXISTS contracts_docs (
  id BIGSERIAL PRIMARY KEY,
  contract_id INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
  file_name VARCHAR(200) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. driver (السائقون)
CREATE TABLE IF NOT EXISTS driver (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  license_number VARCHAR(50),
  license_expiry DATE,
  bus_id INTEGER REFERENCES bus(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_driver_school ON driver(school_id);

-- 13. features (مميزات الباقات)
CREATE TABLE IF NOT EXISTS features (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  label VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. financial_log (سجل المعاملات المالية)
CREATE TABLE IF NOT EXISTS financial_log (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL, -- income, expense, refund
  category VARCHAR(100),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  reference_id INTEGER,
  reference_type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_financial_log_school ON financial_log(school_id);

-- 15. grade_appeals (تظلمات الدرجات)
CREATE TABLE IF NOT EXISTS grade_appeals (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  subject VARCHAR(100),
  exam_id INTEGER,
  original_grade DECIMAL(5,2),
  requested_grade DECIMAL(5,2),
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_grade_appeals_school ON grade_appeals(school_id);
CREATE INDEX IF NOT EXISTS idx_grade_appeals_student ON grade_appeals(student_id);

-- 16. homework (الواجبات - alias لـ assignments)
CREATE OR REPLACE VIEW homework AS SELECT * FROM assignments;

-- 17. homework_submissions (تسليم الواجبات - alias لـ assignment_submissions)
CREATE OR REPLACE VIEW homework_submissions AS SELECT * FROM assignment_submissions;

-- 18. lecture_post_answers (إجابات منشورات المحاضرات)
CREATE TABLE IF NOT EXISTS lecture_post_answers (
  id BIGSERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  score DECIMAL(5,2),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. post_likes (إعجابات المنشورات)
CREATE TABLE IF NOT EXISTS post_likes (
  id BIGSERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
CREATE OR REPLACE VIEW likes AS SELECT * FROM post_likes;

-- 20. live_sessions (الجلسات المباشرة)
CREATE TABLE IF NOT EXISTS live_sessions (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classrooms(id) ON DELETE SET NULL,
  subject VARCHAR(100),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  meeting_url TEXT,
  platform VARCHAR(50) DEFAULT 'zoom', -- zoom, teams, meet, custom
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, live, ended, cancelled
  recording_url TEXT,
  attendees_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_live_sessions_school ON live_sessions(school_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_teacher ON live_sessions(teacher_id);

-- 21. parent_child_mapping (ربط ولي الأمر بالطالب)
CREATE TABLE IF NOT EXISTS parent_child_mapping (
  id BIGSERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(50) DEFAULT 'parent', -- parent, guardian
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_parent_child_parent ON parent_child_mapping(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_student ON parent_child_mapping(student_id);

-- 22. partners (الشركاء)
CREATE TABLE IF NOT EXISTS partners (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  logo_url TEXT,
  website TEXT,
  contact_email VARCHAR(200),
  contact_phone VARCHAR(20),
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  status VARCHAR(20) DEFAULT 'active',
  referral_code VARCHAR(50) UNIQUE,
  total_referrals INTEGER DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. payments (المدفوعات)
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'SAR',
  payment_method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
  reference_number VARCHAR(100),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_school ON payments(school_id);

-- 24. plans (خطط الاشتراك)
CREATE TABLE IF NOT EXISTS plans (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  label VARCHAR(200) NOT NULL,
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_yearly DECIMAL(10,2) DEFAULT 0,
  max_students INTEGER DEFAULT 100,
  max_teachers INTEGER DEFAULT 10,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. platform_services (خدمات المنصة)
CREATE TABLE IF NOT EXISTS platform_services (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  label VARCHAR(200) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. proctoring_snapshots (لقطات مراقبة الامتحانات)
CREATE TABLE IF NOT EXISTS proctoring_snapshots (
  id BIGSERIAL PRIMARY KEY,
  exam_session_id INTEGER,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  snapshot_url TEXT,
  alert_type VARCHAR(50), -- face_not_detected, multiple_faces, tab_switch
  confidence DECIMAL(5,2),
  reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_proctoring_school ON proctoring_snapshots(school_id);

-- 27. question_bank (بنك الأسئلة)
CREATE TABLE IF NOT EXISTS question_bank (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  subject VARCHAR(100),
  grade_level VARCHAR(50),
  question_text TEXT NOT NULL,
  question_type VARCHAR(30) DEFAULT 'mcq', -- mcq, true_false, essay, fill
  options JSONB DEFAULT '[]',
  correct_answer TEXT,
  difficulty VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
  points DECIMAL(5,2) DEFAULT 1,
  tags TEXT[],
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_question_bank_school ON question_bank(school_id);

-- 28. questions (alias لـ question_bank)
CREATE OR REPLACE VIEW questions AS SELECT * FROM question_bank;

-- 29. referrals (الإحالات)
CREATE TABLE IF NOT EXISTS referrals (
  id BIGSERIAL PRIMARY KEY,
  partner_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
  referral_code VARCHAR(50),
  referred_school_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, converted, expired
  commission_amount DECIMAL(10,2) DEFAULT 0,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 30. requests (طلبات الانضمام)
CREATE TABLE IF NOT EXISTS requests (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  request_type VARCHAR(50) DEFAULT 'join', -- join, transfer, leave
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  notes TEXT,
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_requests_school ON requests(school_id);

-- 31. scholarships (المنح الدراسية)
CREATE TABLE IF NOT EXISTS scholarships (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2),
  discount_percent DECIMAL(5,2),
  criteria TEXT,
  max_recipients INTEGER,
  current_recipients INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_scholarships_school ON scholarships(school_id);

-- 32. school_integrations (تكاملات المدرسة)
CREATE TABLE IF NOT EXISTS school_integrations (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  integration_type VARCHAR(50) NOT NULL, -- zoom, teams, google, whatsapp
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, integration_type)
);

-- 33. school_owners (ملاك المدارس)
CREATE TABLE IF NOT EXISTS school_owners (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  ownership_percent DECIMAL(5,2) DEFAULT 100,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, school_id)
);

-- 34. school_registrations (تسجيل المدارس الجديدة)
CREATE TABLE IF NOT EXISTS school_registrations (
  id BIGSERIAL PRIMARY KEY,
  school_name VARCHAR(200) NOT NULL,
  owner_name VARCHAR(200) NOT NULL,
  owner_email VARCHAR(200) NOT NULL,
  owner_phone VARCHAR(20),
  city VARCHAR(100),
  school_type VARCHAR(50),
  student_count INTEGER,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  notes TEXT,
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 35. service_audit_log (سجل تدقيق الخدمات)
CREATE TABLE IF NOT EXISTS service_audit_log (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  service_name VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL, -- enabled, disabled, configured
  performed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 36. store_settings (إعدادات المتجر)
CREATE TABLE IF NOT EXISTS store_settings (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE UNIQUE,
  store_name VARCHAR(200),
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  currency VARCHAR(10) DEFAULT 'SAR',
  tax_rate DECIMAL(5,2) DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  min_order DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  allow_cash BOOLEAN DEFAULT true,
  allow_online BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 37. student_answers (إجابات الطلاب في الامتحانات)
CREATE TABLE IF NOT EXISTS student_answers (
  id BIGSERIAL PRIMARY KEY,
  exam_id INTEGER,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES question_bank(id) ON DELETE CASCADE,
  answer TEXT,
  is_correct BOOLEAN,
  points_earned DECIMAL(5,2) DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_student_answers_exam ON student_answers(exam_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_student ON student_answers(student_id);

-- 38. teacher_assignments (توزيع المعلمين على الفصول)
CREATE TABLE IF NOT EXISTS teacher_assignments (
  id BIGSERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
  subject VARCHAR(100),
  academic_year VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(teacher_id, class_id, subject)
);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_school ON teacher_assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_teacher ON teacher_assignments(teacher_id);

-- 39. unified_invoice_items (بنود الفواتير الموحدة)
CREATE TABLE IF NOT EXISTS unified_invoice_items (
  id BIGSERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL,
  school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  description VARCHAR(300) NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_unified_invoice_items_invoice ON unified_invoice_items(invoice_id);
