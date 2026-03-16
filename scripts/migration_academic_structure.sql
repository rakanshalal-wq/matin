-- ═══════════════════════════════════════════════════════════════════
-- migration_academic_structure.sql
-- نظام الهيكل الأكاديمي الكامل — منصة متين
-- وفق نظام وزارة التعليم السعودية 1445هـ
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- 1. جدول المراحل الدراسية (مرجعي عام)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academic_stages (
  id          SERIAL PRIMARY KEY,
  name_ar     VARCHAR(50) NOT NULL UNIQUE,
  name_en     VARCHAR(50),
  order_num   INTEGER NOT NULL,
  years_count INTEGER NOT NULL,
  description TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 2. جدول الصفوف الدراسية (مرجعي عام)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academic_grades (
  id          SERIAL PRIMARY KEY,
  stage_id    INTEGER NOT NULL REFERENCES academic_stages(id) ON DELETE CASCADE,
  name_ar     VARCHAR(80) NOT NULL,
  name_en     VARCHAR(80),
  grade_num   INTEGER NOT NULL,
  order_num   INTEGER NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(stage_id, grade_num)
);

-- ─────────────────────────────────────────────────────────────────
-- 3. جدول المسارات الدراسية (للثانوية)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academic_tracks (
  id          SERIAL PRIMARY KEY,
  name_ar     VARCHAR(100) NOT NULL UNIQUE,
  name_en     VARCHAR(100),
  applies_to  VARCHAR(50) DEFAULT 'الثانوية',
  description TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 4. جدول المواد الدراسية المرجعية (قائمة وزارة التعليم)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subject_catalog (
  id          SERIAL PRIMARY KEY,
  name_ar     VARCHAR(200) NOT NULL,
  name_en     VARCHAR(200),
  code        VARCHAR(50),
  stage_id    INTEGER REFERENCES academic_stages(id),
  track_id    INTEGER REFERENCES academic_tracks(id),
  grade_ids   INTEGER[],           -- الصفوف التي تُدرَّس فيها
  weekly_hours INTEGER DEFAULT 2,
  is_core     BOOLEAN DEFAULT true, -- إلزامي أم اختياري
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 5. جدول مواد المدرسة (قابل للتخصيص من كل مدرسة)
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE subjects
  ADD COLUMN IF NOT EXISTS stage_id    INTEGER REFERENCES academic_stages(id),
  ADD COLUMN IF NOT EXISTS track_id    INTEGER REFERENCES academic_tracks(id),
  ADD COLUMN IF NOT EXISTS grade_ids   INTEGER[],
  ADD COLUMN IF NOT EXISTS weekly_hours INTEGER DEFAULT 2,
  ADD COLUMN IF NOT EXISTS is_core     BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS catalog_id  INTEGER REFERENCES subject_catalog(id),
  ADD COLUMN IF NOT EXISTS color       VARCHAR(20) DEFAULT '#3B82F6';

-- ─────────────────────────────────────────────────────────────────
-- 6. تحديث جدول الفصول (classes) لإضافة المرحلة والمسار
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS stage_id    INTEGER REFERENCES academic_stages(id),
  ADD COLUMN IF NOT EXISTS track_id    INTEGER REFERENCES academic_tracks(id),
  ADD COLUMN IF NOT EXISTS grade_id    INTEGER REFERENCES academic_grades(id),
  ADD COLUMN IF NOT EXISTS section     VARCHAR(10) DEFAULT 'أ',
  ADD COLUMN IF NOT EXISTS school_id   VARCHAR(100),
  ADD COLUMN IF NOT EXISTS owner_id    VARCHAR(100);

-- ─────────────────────────────────────────────────────────────────
-- 7. جدول الجدول الدراسي الأسبوعي (محسّن)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_schedule (
  id           SERIAL PRIMARY KEY,
  school_id    VARCHAR(100),
  owner_id     VARCHAR(100),
  class_id     INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  subject_id   INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id   INTEGER,
  day_of_week  INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 4), -- 0=الأحد ... 4=الخميس
  period_num   INTEGER NOT NULL CHECK (period_num BETWEEN 1 AND 10),
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  room         VARCHAR(50),
  academic_year VARCHAR(20) DEFAULT '1445-1446',
  semester     INTEGER DEFAULT 1 CHECK (semester IN (1,2,3)),
  notes        TEXT,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, day_of_week, period_num, academic_year, semester)
);

-- ─────────────────────────────────────────────────────────────────
-- 8. جدول أوقات الحصص الافتراضية للمدرسة
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS school_periods (
  id           SERIAL PRIMARY KEY,
  school_id    VARCHAR(100),
  owner_id     VARCHAR(100),
  period_num   INTEGER NOT NULL,
  name_ar      VARCHAR(50) NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  is_break     BOOLEAN DEFAULT false,
  created_at   TIMESTAMP DEFAULT NOW(),
  UNIQUE(school_id, period_num)
);

-- ═══════════════════════════════════════════════════════════════════
-- بيانات وزارة التعليم السعودية 1445هـ
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- المراحل الدراسية
-- ─────────────────────────────────────────────────────────────────
INSERT INTO academic_stages (name_ar, name_en, order_num, years_count, description) VALUES
  ('الابتدائية',  'Primary',   1, 6, 'من الصف الأول إلى السادس الابتدائي'),
  ('المتوسطة',    'Middle',    2, 3, 'من الصف الأول إلى الثالث المتوسط'),
  ('الثانوية',    'Secondary', 3, 3, 'من الصف الأول إلى الثالث الثانوي')
ON CONFLICT (name_ar) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- الصفوف الدراسية
-- ─────────────────────────────────────────────────────────────────
-- الابتدائية (stage_id=1)
INSERT INTO academic_grades (stage_id, name_ar, name_en, grade_num, order_num) VALUES
  (1, 'الأول الابتدائي',   'Grade 1',  1,  1),
  (1, 'الثاني الابتدائي',  'Grade 2',  2,  2),
  (1, 'الثالث الابتدائي',  'Grade 3',  3,  3),
  (1, 'الرابع الابتدائي',  'Grade 4',  4,  4),
  (1, 'الخامس الابتدائي',  'Grade 5',  5,  5),
  (1, 'السادس الابتدائي',  'Grade 6',  6,  6)
ON CONFLICT (stage_id, grade_num) DO NOTHING;

-- المتوسطة (stage_id=2)
INSERT INTO academic_grades (stage_id, name_ar, name_en, grade_num, order_num) VALUES
  (2, 'الأول المتوسط',   'Grade 7',  1,  7),
  (2, 'الثاني المتوسط',  'Grade 8',  2,  8),
  (2, 'الثالث المتوسط',  'Grade 9',  3,  9)
ON CONFLICT (stage_id, grade_num) DO NOTHING;

-- الثانوية (stage_id=3)
INSERT INTO academic_grades (stage_id, name_ar, name_en, grade_num, order_num) VALUES
  (3, 'الأول الثانوي (مشترك)',  'Grade 10', 1, 10),
  (3, 'الثاني الثانوي',         'Grade 11', 2, 11),
  (3, 'الثالث الثانوي',         'Grade 12', 3, 12)
ON CONFLICT (stage_id, grade_num) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- المسارات الدراسية (الثانوية)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO academic_tracks (name_ar, name_en, applies_to, description) VALUES
  ('عام',                          'General',              'الابتدائية والمتوسطة', 'المسار الموحد للمرحلتين الابتدائية والمتوسطة'),
  ('مشترك (جميع المسارات)',        'Common Track',         'الثانوية', 'الأول الثانوي مشترك لجميع المسارات'),
  ('المسار العام',                 'General Track',        'الثانوية', 'مسار العلوم الإنسانية والاجتماعية'),
  ('مسار علوم الحاسب والهندسة',   'CS & Engineering',     'الثانوية', 'الذكاء الاصطناعي والهندسة والبرمجة'),
  ('مسار الصحة والحياة',          'Health & Life',        'الثانوية', 'العلوم الطبية والصحة العامة'),
  ('مسار إدارة الأعمال',          'Business Admin',       'الثانوية', 'الاقتصاد والمحاسبة وريادة الأعمال'),
  ('المسار الشرعي',               'Sharia Track',         'الثانوية', 'الفقه والتفسير والحديث والعقيدة')
ON CONFLICT (name_ar) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- المواد الدراسية — الابتدائية
-- ─────────────────────────────────────────────────────────────────
INSERT INTO subject_catalog (name_ar, name_en, code, stage_id, weekly_hours, is_core) VALUES
  ('لغتي الخالدة',                'Arabic Language',         'ARB-P',  1, 8, true),
  ('الرياضيات',                   'Mathematics',             'MTH-P',  1, 6, true),
  ('العلوم',                      'Science',                 'SCI-P',  1, 3, true),
  ('الدراسات الإسلامية',          'Islamic Studies',         'ISL-P',  1, 4, true),
  ('القرآن الكريم',               'Holy Quran',              'QRN-P',  1, 3, true),
  ('اللغة الإنجليزية',            'English Language',        'ENG-P',  1, 4, true),
  ('التربية الفنية',              'Art Education',           'ART-P',  1, 1, true),
  ('التربية البدنية',             'Physical Education',      'PE-P',   1, 2, true),
  ('المهارات الحياتية والأسرية',  'Life Skills',             'LSK-P',  1, 2, true),
  ('الدراسات الاجتماعية',         'Social Studies',          'SOC-P',  1, 2, true),
  ('التقنية الرقمية',             'Digital Technology',      'DGT-P',  1, 1, false)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- المواد الدراسية — المتوسطة
-- ─────────────────────────────────────────────────────────────────
INSERT INTO subject_catalog (name_ar, name_en, code, stage_id, weekly_hours, is_core) VALUES
  ('لغتي الخالدة',                'Arabic Language',         'ARB-M',  2, 6, true),
  ('الرياضيات',                   'Mathematics',             'MTH-M',  2, 5, true),
  ('العلوم',                      'Science',                 'SCI-M',  2, 4, true),
  ('الدراسات الإسلامية',          'Islamic Studies',         'ISL-M',  2, 4, true),
  ('القرآن الكريم',               'Holy Quran',              'QRN-M',  2, 2, true),
  ('اللغة الإنجليزية',            'English Language',        'ENG-M',  2, 4, true),
  ('التاريخ',                     'History',                 'HIS-M',  2, 2, true),
  ('الجغرافيا',                   'Geography',               'GEO-M',  2, 2, true),
  ('التربية الوطنية',             'National Education',      'NAT-M',  2, 1, true),
  ('التربية الفنية',              'Art Education',           'ART-M',  2, 1, true),
  ('التربية البدنية',             'Physical Education',      'PE-M',   2, 2, true),
  ('المهارات الحياتية والأسرية',  'Life Skills',             'LSK-M',  2, 2, true),
  ('المهارات الرقمية',            'Digital Skills',          'DGS-M',  2, 2, true)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- المواد الدراسية — الثانوية (مشترك - أول ثانوي)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO subject_catalog (name_ar, name_en, code, stage_id, track_id, weekly_hours, is_core) VALUES
  ('لغتي الخالدة',                'Arabic Language',         'ARB-S1', 3, 2, 5, true),
  ('الرياضيات',                   'Mathematics',             'MTH-S1', 3, 2, 5, true),
  ('العلوم',                      'Science',                 'SCI-S1', 3, 2, 4, true),
  ('الدراسات الإسلامية',          'Islamic Studies',         'ISL-S1', 3, 2, 3, true),
  ('القرآن الكريم',               'Holy Quran',              'QRN-S1', 3, 2, 2, true),
  ('اللغة الإنجليزية',            'English Language',        'ENG-S1', 3, 2, 4, true),
  ('التاريخ',                     'History',                 'HIS-S1', 3, 2, 2, true),
  ('الجغرافيا',                   'Geography',               'GEO-S1', 3, 2, 2, true),
  ('التربية الوطنية',             'National Education',      'NAT-S1', 3, 2, 1, true),
  ('علم البيئة',                  'Environmental Science',   'ENV-S1', 3, 2, 1, true),
  ('التربية البدنية',             'Physical Education',      'PE-S1',  3, 2, 2, true),
  ('المهارات الحياتية والأسرية',  'Life Skills',             'LSK-S1', 3, 2, 2, true),
  ('التقنية الرقمية',             'Digital Technology',      'DGT-S1', 3, 2, 2, true)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- المواد — الثانوية المسار العام (ثاني وثالث)
-- ─────────────────────────────────────────────────────────────────
INSERT INTO subject_catalog (name_ar, name_en, code, stage_id, track_id, weekly_hours, is_core) VALUES
  ('الكفايات اللغوية',            'Language Competencies',   'LNG-GEN', 3, 3, 4, true),
  ('الدراسات الأدبية',            'Literary Studies',        'LIT-GEN', 3, 3, 3, true),
  ('اللغة الإنجليزية',            'English Language',        'ENG-GEN', 3, 3, 4, true),
  ('الرياضيات',                   'Mathematics',             'MTH-GEN', 3, 3, 4, true),
  ('الفيزياء',                    'Physics',                 'PHY-GEN', 3, 3, 3, true),
  ('الكيمياء',                    'Chemistry',               'CHM-GEN', 3, 3, 3, true),
  ('الأحياء',                     'Biology',                 'BIO-GEN', 3, 3, 3, true),
  ('علوم الأرض والفضاء',          'Earth & Space Science',   'EAR-GEN', 3, 3, 2, true),
  ('الدراسات الإسلامية',          'Islamic Studies',         'ISL-GEN', 3, 3, 2, true),
  ('المهارات الحياتية والأسرية',  'Life Skills',             'LSK-GEN', 3, 3, 2, true),
  ('التربية البدنية',             'Physical Education',      'PE-GEN',  3, 3, 2, true)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- المواد — مسار علوم الحاسب والهندسة
-- ─────────────────────────────────────────────────────────────────
INSERT INTO subject_catalog (name_ar, name_en, code, stage_id, track_id, weekly_hours, is_core) VALUES
  ('الكفايات اللغوية',            'Language Competencies',   'LNG-CS', 3, 4, 4, true),
  ('اللغة الإنجليزية',            'English Language',        'ENG-CS', 3, 4, 4, true),
  ('الرياضيات',                   'Mathematics',             'MTH-CS', 3, 4, 6, true),
  ('الفيزياء',                    'Physics',                 'PHY-CS', 3, 4, 4, true),
  ('الكيمياء',                    'Chemistry',               'CHM-CS', 3, 4, 2, true),
  ('الأحياء',                     'Biology',                 'BIO-CS', 3, 4, 2, true),
  ('الدراسات الإسلامية',          'Islamic Studies',         'ISL-CS', 3, 4, 2, true),
  ('علم البيانات',                'Data Science',            'DAT-CS', 3, 4, 3, true),
  ('الهندسة',                     'Engineering',             'ENG2-CS',3, 4, 3, true),
  ('انترنت الأشياء',              'IoT',                     'IOT-CS', 3, 4, 2, true),
  ('التصميم الهندسي',             'Engineering Design',      'DES-CS', 3, 4, 2, true),
  ('الذكاء الاصطناعي',            'Artificial Intelligence', 'AI-CS',  3, 4, 3, true),
  ('الأمن السيبراني',             'Cybersecurity',           'CYB-CS', 3, 4, 2, false),
  ('هندسة البرمجيات',             'Software Engineering',    'SWE-CS', 3, 4, 2, false),
  ('مشروع التخرج',                'Graduation Project',      'PRJ-CS', 3, 4, 2, true)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- المواد — مسار الصحة والحياة
-- ─────────────────────────────────────────────────────────────────
INSERT INTO subject_catalog (name_ar, name_en, code, stage_id, track_id, weekly_hours, is_core) VALUES
  ('الكفايات اللغوية',            'Language Competencies',   'LNG-HL', 3, 5, 4, true),
  ('اللغة الإنجليزية',            'English Language',        'ENG-HL', 3, 5, 4, true),
  ('الرياضيات',                   'Mathematics',             'MTH-HL', 3, 5, 4, true),
  ('الفيزياء',                    'Physics',                 'PHY-HL', 3, 5, 3, true),
  ('الكيمياء',                    'Chemistry',               'CHM-HL', 3, 5, 4, true),
  ('الأحياء',                     'Biology',                 'BIO-HL', 3, 5, 4, true),
  ('الدراسات الإسلامية',          'Islamic Studies',         'ISL-HL', 3, 5, 2, true),
  ('أنظمة جسم الإنسان',           'Human Body Systems',      'HBS-HL', 3, 5, 3, true),
  ('التغذية والصحة',              'Nutrition & Health',      'NTR-HL', 3, 5, 2, true),
  ('الصحة العامة',                'Public Health',           'PBH-HL', 3, 5, 3, true),
  ('التصميم الهندسي',             'Engineering Design',      'DES-HL', 3, 5, 2, true),
  ('اللياقة والثقافة الصحية',     'Fitness & Health Culture','FIT-HL', 3, 5, 2, true),
  ('مشروع التخرج',                'Graduation Project',      'PRJ-HL', 3, 5, 2, true)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- المواد — مسار إدارة الأعمال
-- ─────────────────────────────────────────────────────────────────
INSERT INTO subject_catalog (name_ar, name_en, code, stage_id, track_id, weekly_hours, is_core) VALUES
  ('الكفايات اللغوية',            'Language Competencies',   'LNG-BA', 3, 6, 4, true),
  ('اللغة الإنجليزية',            'English Language',        'ENG-BA', 3, 6, 4, true),
  ('الرياضيات',                   'Mathematics',             'MTH-BA', 3, 6, 4, true),
  ('الدراسات الإسلامية',          'Islamic Studies',         'ISL-BA', 3, 6, 2, true),
  ('مبادئ المحاسبة',              'Accounting Principles',   'ACC-BA', 3, 6, 4, true),
  ('مبادئ الإدارة',               'Management Principles',   'MGT-BA', 3, 6, 3, true),
  ('الاقتصاد',                    'Economics',               'ECO-BA', 3, 6, 3, true),
  ('القانون',                     'Law',                     'LAW-BA', 3, 6, 2, true),
  ('التسويق',                     'Marketing',               'MKT-BA', 3, 6, 2, true),
  ('ريادة الأعمال',               'Entrepreneurship',        'ENT-BA', 3, 6, 2, true),
  ('المحاسبة المالية',            'Financial Accounting',    'FAC-BA', 3, 6, 3, false),
  ('إدارة الأعمال',               'Business Administration',  'BUS-BA', 3, 6, 3, false),
  ('الاقتصاد الكلي',              'Macroeconomics',          'MAC-BA', 3, 6, 2, false),
  ('القانون التجاري',             'Commercial Law',          'CLW-BA', 3, 6, 2, false),
  ('مشروع التخرج',                'Graduation Project',      'PRJ-BA', 3, 6, 2, true)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- المواد — المسار الشرعي
-- ─────────────────────────────────────────────────────────────────
INSERT INTO subject_catalog (name_ar, name_en, code, stage_id, track_id, weekly_hours, is_core) VALUES
  ('الكفايات اللغوية',            'Language Competencies',   'LNG-SH', 3, 7, 4, true),
  ('اللغة الإنجليزية',            'English Language',        'ENG-SH', 3, 7, 3, true),
  ('الرياضيات',                   'Mathematics',             'MTH-SH', 3, 7, 3, true),
  ('التفسير وعلوم القرآن',        'Quran Sciences',          'QRN-SH', 3, 7, 5, true),
  ('الحديث وعلومه',               'Hadith Sciences',         'HDT-SH', 3, 7, 4, true),
  ('الفقه وأصوله',                'Fiqh & Principles',       'FQH-SH', 3, 7, 5, true),
  ('العقيدة والمذاهب المعاصرة',   'Aqeedah',                 'AQD-SH', 3, 7, 3, true),
  ('التاريخ الإسلامي',            'Islamic History',         'ISH-SH', 3, 7, 3, true),
  ('القانون',                     'Law',                     'LAW-SH', 3, 7, 2, true),
  ('الفقه المقارن',               'Comparative Fiqh',        'CFQ-SH', 3, 7, 3, false),
  ('أصول الفقه',                  'Usul al-Fiqh',            'UFQ-SH', 3, 7, 3, false),
  ('السيرة النبوية',              'Seerah',                  'SIR-SH', 3, 7, 2, false),
  ('مشروع التخرج',                'Graduation Project',      'PRJ-SH', 3, 7, 2, true)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────
-- أوقات الحصص الافتراضية (نموذج عام)
-- المدرسة تستطيع تعديلها لاحقاً
-- ─────────────────────────────────────────────────────────────────
-- ملاحظة: هذه القيم تُدرج فقط إذا لم تكن المدرسة قد أدخلت أوقاتها
-- يتم الإدراج عبر الكود عند تسجيل مدرسة جديدة

-- ─────────────────────────────────────────────────────────────────
-- فهارس لتحسين الأداء
-- ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_academic_grades_stage ON academic_grades(stage_id);
CREATE INDEX IF NOT EXISTS idx_subject_catalog_stage ON subject_catalog(stage_id);
CREATE INDEX IF NOT EXISTS idx_subject_catalog_track ON subject_catalog(track_id);
CREATE INDEX IF NOT EXISTS idx_weekly_schedule_class ON weekly_schedule(class_id);
CREATE INDEX IF NOT EXISTS idx_weekly_schedule_teacher ON weekly_schedule(teacher_id);
CREATE INDEX IF NOT EXISTS idx_weekly_schedule_school ON weekly_schedule(school_id);
CREATE INDEX IF NOT EXISTS idx_school_periods_school ON school_periods(school_id);
