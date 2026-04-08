-- =============================================
-- إصلاح قاعدة بيانات منصة متين
-- =============================================

-- 1. إصلاح school_id الخاطئة للمستخدمين
-- المستخدم 20 (بيري - teacher) school_id = '10' → ربطه بمدرسة النصر
UPDATE users SET school_id = 'school_d62554e13bc78423' WHERE id = 20 AND school_id = '10';

-- المستخدم 21 (لبلل - teacher) school_id = '10' → ربطه بمدرسة النصر
UPDATE users SET school_id = 'school_d62554e13bc78423' WHERE id = 21 AND school_id = '10';

-- المستخدم 22 (احمد حماده - student) school_id = '123' → ربطه بمدرسة النجاح
UPDATE users SET school_id = 'school_5b0c17d7e105df28' WHERE id = 22 AND school_id = '123';

-- المستخدم 23 (راكان - student) school_id = '17' → ربطه بمدرسة النصر
UPDATE users SET school_id = 'school_d62554e13bc78423' WHERE id = 23 AND school_id = '17';

-- المستخدم 25 (اخمد - teacher) school_id = '14' → ربطه بمدرسة النصر
UPDATE users SET school_id = 'school_d62554e13bc78423' WHERE id = 25 AND school_id = '14';

-- المستخدم 19 (راشد - employee) → تحويل الدور إلى admin لأنه لا يوجد دور employee في النظام
UPDATE users SET role = 'admin' WHERE id = 19 AND role = 'employee';

-- المستخدمين 4 و 5 (user role) → تحويلهم إلى student أو حذفهم
UPDATE users SET role = 'student', school_id = 'school_5b0c17d7e105df28' WHERE id = 4 AND role = 'user';
UPDATE users SET role = 'student', school_id = 'school_5b0c17d7e105df28' WHERE id = 5 AND role = 'user';

-- 2. إضافة جدول institution_types (أنواع المؤسسات)
CREATE TABLE IF NOT EXISTS institution_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    label_ar VARCHAR(255) NOT NULL,
    allowed_features JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج أنواع المؤسسات الافتراضية
INSERT INTO institution_types (name, label_ar, allowed_features) VALUES
('school', 'مدرسة', '{"lectures_recorded": true, "exams_proctored": true, "question_bank_advanced": true, "gps_tracking": true, "daily_activity_reports": false, "gallery": true, "cafeteria": true, "clinic": true, "library": true}'),
('university', 'جامعة', '{"lectures_recorded": true, "exams_proctored": true, "question_bank_advanced": true, "gps_tracking": false, "daily_activity_reports": false, "gallery": true, "credit_hours": true, "colleges": true, "courses": true}'),
('nursery', 'حضانة', '{"lectures_recorded": false, "exams_proctored": false, "question_bank_advanced": false, "gps_tracking": true, "daily_activity_reports": true, "gallery": true, "cafeteria": true, "clinic": true}'),
('institute', 'معهد تدريب', '{"lectures_recorded": true, "exams_proctored": true, "question_bank_advanced": true, "gps_tracking": false, "daily_activity_reports": false, "gallery": true, "courses": true, "certificates": true}'),
('center', 'مركز تعليمي', '{"lectures_recorded": true, "exams_proctored": false, "question_bank_advanced": true, "gps_tracking": false, "daily_activity_reports": false, "gallery": true, "courses": true}')
ON CONFLICT (name) DO NOTHING;

-- إضافة حقل institution_type_id لجدول schools
ALTER TABLE schools ADD COLUMN IF NOT EXISTS institution_type_id INT REFERENCES institution_types(id) DEFAULT 1;

-- 3. إضافة جدول delegates (المفوّضين)
CREATE TABLE IF NOT EXISTS delegates (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    school_id TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, owner_id)
);

-- 4. إضافة جدول parent_child_mapping (ربط ولي الأمر بالأبناء)
CREATE TABLE IF NOT EXISTS parent_child_mapping (
    parent_id INT REFERENCES users(id) ON DELETE CASCADE,
    child_id INT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_id, child_id)
);

-- 5. إضافة جدول bus_live_location (تتبع الباصات)
CREATE TABLE IF NOT EXISTS bus_live_location (
    id SERIAL PRIMARY KEY,
    bus_id INT,
    driver_id INT,
    lat NUMERIC(10, 7),
    lng NUMERIC(10, 7),
    speed NUMERIC(5, 2),
    heading NUMERIC(5, 2),
    school_id TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. إضافة جدول store_settings (إعدادات المتجر)
CREATE TABLE IF NOT EXISTS store_settings (
    school_id TEXT PRIMARY KEY,
    is_active BOOLEAN DEFAULT TRUE,
    commission_rate NUMERIC(5, 2) DEFAULT 10.00,
    override_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. إضافة جدول student_answers (إجابات الطلاب)
CREATE TABLE IF NOT EXISTS student_answers (
    id SERIAL PRIMARY KEY,
    exam_id INT,
    student_id INT REFERENCES users(id),
    question_id INT,
    answer_text TEXT,
    grade NUMERIC,
    is_final BOOLEAN DEFAULT FALSE,
    graded_by_ai BOOLEAN DEFAULT FALSE,
    school_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. إضافة جدول support_tickets (تذاكر الدعم)
CREATE TABLE IF NOT EXISTS support_tickets (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(50) DEFAULT 'medium',
    user_id INT REFERENCES users(id),
    school_id TEXT,
    assigned_to INT REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. إضافة جدول ticket_replies (ردود التذاكر)
CREATE TABLE IF NOT EXISTS ticket_replies (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. إضافة جدول referrals (نظام الإحالة)
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    referrer_school_id TEXT,
    referred_school_id TEXT,
    referral_code VARCHAR(50) UNIQUE,
    reward_amount NUMERIC(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. إضافة جدول badges (شارات الطلاب)
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    points INT DEFAULT 0,
    school_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. إضافة جدول student_badges
CREATE TABLE IF NOT EXISTS student_badges (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users(id),
    badge_id INT REFERENCES badges(id),
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    school_id TEXT
);

-- 13. إضافة جدول financial_transactions (سجل التدقيق المالي)
CREATE TABLE IF NOT EXISTS financial_transactions (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'SAR',
    description TEXT,
    reference_id TEXT,
    user_id INT,
    school_id TEXT,
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'completed',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. إضافة جدول white_label_settings (العلامة البيضاء)
CREATE TABLE IF NOT EXISTS white_label_settings (
    id SERIAL PRIMARY KEY,
    school_id TEXT UNIQUE,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#1a1a2e',
    secondary_color VARCHAR(20) DEFAULT '#d4a843',
    custom_domain TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. إضافة جدول certificate_templates (قوالب الشهادات)
CREATE TABLE IF NOT EXISTS certificate_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_html TEXT,
    school_id TEXT,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. إضافة جدول issued_certificates (الشهادات الصادرة)
CREATE TABLE IF NOT EXISTS issued_certificates (
    id SERIAL PRIMARY KEY,
    template_id INT REFERENCES certificate_templates(id),
    student_id INT REFERENCES users(id),
    verification_code VARCHAR(100) UNIQUE,
    issued_by INT REFERENCES users(id),
    school_id TEXT,
    metadata JSONB DEFAULT '{}',
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. إضافة حقول ناقصة في جدول schools
ALTER TABLE schools ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS region VARCHAR(100);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'SA';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS primary_color VARCHAR(20) DEFAULT '#1a1a2e';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(20) DEFAULT '#d4a843';

-- 18. إضافة حقول ناقصة في جدول users
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS national_id VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- 19. تحديث slugs للمدارس الحالية
UPDATE schools SET slug = 'alnajah-school' WHERE id = 'school_5b0c17d7e105df28' AND (slug IS NULL OR slug = '');
UPDATE schools SET slug = 'alnamoothajia' WHERE id = 'school_ac120bb39264e454' AND (slug IS NULL OR slug = '');
UPDATE schools SET slug = 'alnasr-school' WHERE id = 'school_d62554e13bc78423' AND (slug IS NULL OR slug = '');

-- 20. منح الصلاحيات
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO matin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO matin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO matin_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO matin_user;

-- تأكيد النجاح
SELECT 'Database fixes applied successfully!' AS result;
