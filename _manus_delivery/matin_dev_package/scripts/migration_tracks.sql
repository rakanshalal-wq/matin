-- =====================================================
-- Migration: إضافة دعم المسارات الدراسية لبنك الأسئلة
-- منصة متين — وفق نظام وزارة التعليم السعودية 1445هـ
-- =====================================================

-- 1. إضافة عمود track (المسار الدراسي) لجدول question_bank
ALTER TABLE question_bank
  ADD COLUMN IF NOT EXISTS track VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS stage VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS grade VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS semester VARCHAR(10) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS lesson VARCHAR(200) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS explanation TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ai_grade VARCHAR(20) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ai_feedback TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS quality_label VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'locked',
  ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS difficulty_score INTEGER DEFAULT NULL;

-- 2. إضافة فهرس على عمود track لتسريع الاستعلامات
CREATE INDEX IF NOT EXISTS idx_question_bank_track ON question_bank(track);
CREATE INDEX IF NOT EXISTS idx_question_bank_stage ON question_bank(stage);
CREATE INDEX IF NOT EXISTS idx_question_bank_grade ON question_bank(grade);
CREATE INDEX IF NOT EXISTS idx_question_bank_subject ON question_bank(subject);

-- 3. إنشاء جدول المسارات المرجعي
CREATE TABLE IF NOT EXISTS school_tracks (
  id SERIAL PRIMARY KEY,
  stage VARCHAR(50) NOT NULL,           -- الابتدائية / المتوسطة / الثانوية
  track_name VARCHAR(100) NOT NULL,     -- اسم المسار
  track_code VARCHAR(50) NOT NULL,      -- كود المسار
  grades TEXT[] NOT NULL,               -- الصفوف المتاحة
  subjects TEXT[] NOT NULL,             -- المواد الدراسية
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. إدراج المسارات الرسمية وفق وزارة التعليم السعودية
INSERT INTO school_tracks (stage, track_name, track_code, grades, subjects, description) VALUES
-- الابتدائية
('الابتدائية', 'عام', 'primary_general',
  ARRAY['الأول الابتدائي','الثاني الابتدائي','الثالث الابتدائي','الرابع الابتدائي','الخامس الابتدائي','السادس الابتدائي'],
  ARRAY['لغتي الخالدة','الرياضيات','العلوم','الدراسات الإسلامية','القرآن الكريم','اللغة الإنجليزية','التربية الفنية','التربية البدنية','المهارات الحياتية والأسرية','الدراسات الاجتماعية'],
  'المرحلة الابتدائية — مناهج مشتركة لجميع الصفوف'),

-- المتوسطة
('المتوسطة', 'عام', 'middle_general',
  ARRAY['الأول المتوسط','الثاني المتوسط','الثالث المتوسط'],
  ARRAY['لغتي الخالدة','الرياضيات','العلوم','الدراسات الإسلامية','القرآن الكريم','اللغة الإنجليزية','التاريخ','الجغرافيا','التربية الوطنية','التربية الفنية','التربية البدنية','المهارات الحياتية والأسرية','المهارات الرقمية'],
  'المرحلة المتوسطة — مناهج مشتركة لجميع الصفوف'),

-- الثانوية — السنة الأولى المشتركة
('الثانوية', 'مشترك (جميع المسارات)', 'secondary_common',
  ARRAY['أول ثانوي (مشترك)'],
  ARRAY['لغتي الخالدة','الرياضيات','العلوم','الدراسات الإسلامية','القرآن الكريم','اللغة الإنجليزية','التاريخ','الجغرافيا','التربية الوطنية','علم البيئة','التربية البدنية','المهارات الحياتية والأسرية','التقنية الرقمية'],
  'السنة الأولى الثانوية — مشتركة لجميع المسارات'),

-- الثانوية — المسار العام
('الثانوية', 'المسار العام', 'secondary_general',
  ARRAY['ثاني ثانوي','ثالث ثانوي'],
  ARRAY['الكفايات اللغوية','الدراسات الأدبية','اللغة الإنجليزية','الرياضيات','الفيزياء','الكيمياء','الأحياء','علوم الأرض والفضاء','الدراسات الإسلامية','المهارات الحياتية والأسرية','التربية البدنية'],
  'يتيح جميع التخصصات الجامعية — الأكثر شيوعاً'),

-- الثانوية — مسار علوم الحاسب والهندسة
('الثانوية', 'مسار علوم الحاسب والهندسة', 'secondary_cs_eng',
  ARRAY['ثاني ثانوي','ثالث ثانوي'],
  ARRAY['الكفايات اللغوية','اللغة الإنجليزية','الرياضيات','الفيزياء','الكيمياء','الأحياء','الدراسات الإسلامية','علم البيانات','الهندسة','انترنت الأشياء','التصميم الهندسي','الذكاء الاصطناعي','الأمن السيبراني','هندسة البرمجيات','مشروع التخرج'],
  'يؤهل لتخصصات التقنية والهندسة وعلوم الحاسب'),

-- الثانوية — مسار الصحة والحياة
('الثانوية', 'مسار الصحة والحياة', 'secondary_health',
  ARRAY['ثاني ثانوي','ثالث ثانوي'],
  ARRAY['الكفايات اللغوية','اللغة الإنجليزية','الرياضيات','الفيزياء','الكيمياء','الأحياء','الدراسات الإسلامية','أنظمة جسم الإنسان','التغذية والصحة','الصحة العامة','التصميم الهندسي','اللياقة والثقافة الصحية','مشروع التخرج'],
  'يؤهل لكليات الطب والصيدلة والتمريض والعلوم الصحية'),

-- الثانوية — مسار إدارة الأعمال
('الثانوية', 'مسار إدارة الأعمال', 'secondary_business',
  ARRAY['ثاني ثانوي','ثالث ثانوي'],
  ARRAY['الكفايات اللغوية','اللغة الإنجليزية','الرياضيات','الدراسات الإسلامية','مبادئ المحاسبة','مبادئ الإدارة','الاقتصاد','القانون','التسويق','ريادة الأعمال','المحاسبة المالية','إدارة الأعمال','الاقتصاد الكلي','القانون التجاري','مشروع التخرج'],
  'يؤهل لكليات الإدارة والاقتصاد والمحاسبة'),

-- الثانوية — المسار الشرعي
('الثانوية', 'المسار الشرعي', 'secondary_sharia',
  ARRAY['ثاني ثانوي','ثالث ثانوي'],
  ARRAY['الكفايات اللغوية','اللغة الإنجليزية','الرياضيات','التفسير وعلوم القرآن','الحديث وعلومه','الفقه وأصوله','العقيدة والمذاهب المعاصرة','التاريخ الإسلامي','القانون','الفقه المقارن','أصول الفقه','السيرة النبوية','مشروع التخرج'],
  'يؤهل لكليات الشريعة والدراسات الإسلامية')

ON CONFLICT DO NOTHING;

-- 5. تأكيد الإنجاز
SELECT 'تم تحديث هيكل بنك الأسئلة بنجاح — تمت إضافة دعم المسارات الدراسية ✓' AS status;
SELECT COUNT(*) AS tracks_count FROM school_tracks;
