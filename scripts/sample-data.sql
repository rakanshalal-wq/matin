-- بيانات تجريبية شاملة لمنصة متين
-- المدرسة: school_d62554e13bc78423

-- === سجلات الحضور ===
INSERT INTO attendance (id, student_id, class_id, date, status, school_id, owner_id, created_at, updated_at) VALUES
('att-001', '8865cf28-273b-4c7b-a12d-3dc4a6d10b32', 'cls-005', '2026-03-01', 'present', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('att-002', '6299e3de-9c9f-4a15-880e-dfc8c9fd17de', 'cls-005', '2026-03-01', 'present', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('att-003', '9e94aeac-58d8-49a1-93d9-57c2a377712c', 'cls-005', '2026-03-01', 'absent', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('att-004', '8865cf28-273b-4c7b-a12d-3dc4a6d10b32', 'cls-005', '2026-03-02', 'present', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('att-005', '6299e3de-9c9f-4a15-880e-dfc8c9fd17de', 'cls-005', '2026-03-02', 'late', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('att-006', '9e94aeac-58d8-49a1-93d9-57c2a377712c', 'cls-005', '2026-03-02', 'present', 'school_d62554e13bc78423', '17', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- === الواجبات ===
INSERT INTO homework (id, title, description, class_id, subject_id, teacher_id, due_date, status, school_id, owner_id, created_at, updated_at) VALUES
('hw-001', 'واجب الرياضيات - الفصل الأول', 'حل تمارين الصفحة 25-30', 'cls-005', 'sub-002', 'cb94fda2-f63f-4d3a-9e68-667e1a95b3ee', '2026-03-10', 'active', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('hw-002', 'واجب اللغة العربية - القراءة', 'قراءة النص وتلخيصه', 'cls-005', 'sub-001', '6703ba86-7072-4064-abc4-8b25899da431', '2026-03-12', 'active', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('hw-003', 'واجب العلوم - التجربة', 'كتابة تقرير عن التجربة', 'cls-006', 'sub-003', 'ce5656d3-e696-4c9c-9043-acaf4bdce932', '2026-03-15', 'active', 'school_d62554e13bc78423', '17', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- === الدرجات ===
INSERT INTO grades (id, student_id, exam_id, subject_id, score, total, percentage, grade, school_id, created_at, updated_at) VALUES
('grd-001', '8865cf28-273b-4c7b-a12d-3dc4a6d10b32', NULL, 'sub-001', 85, 100, 85, 'A', 'school_d62554e13bc78423', NOW(), NOW()),
('grd-002', '8865cf28-273b-4c7b-a12d-3dc4a6d10b32', NULL, 'sub-002', 92, 100, 92, 'A+', 'school_d62554e13bc78423', NOW(), NOW()),
('grd-003', '6299e3de-9c9f-4a15-880e-dfc8c9fd17de', NULL, 'sub-001', 78, 100, 78, 'B+', 'school_d62554e13bc78423', NOW(), NOW()),
('grd-004', '6299e3de-9c9f-4a15-880e-dfc8c9fd17de', NULL, 'sub-002', 65, 100, 65, 'C+', 'school_d62554e13bc78423', NOW(), NOW()),
('grd-005', '9e94aeac-58d8-49a1-93d9-57c2a377712c', NULL, 'sub-001', 90, 100, 90, 'A', 'school_d62554e13bc78423', NOW(), NOW()),
('grd-006', '9e94aeac-58d8-49a1-93d9-57c2a377712c', NULL, 'sub-003', 88, 100, 88, 'A', 'school_d62554e13bc78423', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- === الاختبارات ===
INSERT INTO exams (id, title_ar, description, type, subject_id, class_id, teacher_id, duration, total_marks, status, school_id, owner_id, created_at, updated_at) VALUES
('exam-001', 'اختبار الرياضيات - منتصف الفصل', 'اختبار منتصف الفصل الأول للرياضيات', 'midterm', 'sub-002', 'cls-005', 'cb94fda2-f63f-4d3a-9e68-667e1a95b3ee', 60, 100, 'published', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('exam-002', 'اختبار اللغة العربية - نهائي', 'الاختبار النهائي للغة العربية', 'final', 'sub-001', 'cls-005', '6703ba86-7072-4064-abc4-8b25899da431', 90, 100, 'draft', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('exam-003', 'اختبار العلوم - قصير', 'اختبار قصير في الوحدة الثالثة', 'quiz', 'sub-003', 'cls-006', 'ce5656d3-e696-4c9c-9043-acaf4bdce932', 30, 50, 'published', 'school_d62554e13bc78423', '17', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- === المكتبة ===
INSERT INTO library (id, title, author, isbn, category, quantity, status, school_id, owner_id, created_at, updated_at) VALUES
('lib-001', 'الرياضيات المتقدمة', 'د. أحمد محمد', '978-1234567890', 'رياضيات', 15, 'available', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('lib-002', 'قصص الأنبياء', 'ابن كثير', '978-0987654321', 'دينية', 20, 'available', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('lib-003', 'العلوم الطبيعية', 'د. سارة علي', '978-1122334455', 'علوم', 10, 'available', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('lib-004', 'اللغة العربية - المستوى المتقدم', 'د. فاطمة حسن', '978-5566778899', 'لغة عربية', 25, 'available', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('lib-005', 'English Grammar', 'John Smith', '978-9988776655', 'لغة إنجليزية', 12, 'borrowed', 'school_d62554e13bc78423', '17', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- === الكافتيريا ===
INSERT INTO cafeteria (id, name, category, price, status, school_id, owner_id, created_at, updated_at) VALUES
('caf-001', 'ساندويتش دجاج', 'وجبات', 10.00, 'available', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('caf-002', 'عصير برتقال', 'مشروبات', 5.00, 'available', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('caf-003', 'كيك شوكولاتة', 'حلويات', 8.00, 'available', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('caf-004', 'ماء معدني', 'مشروبات', 2.00, 'available', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('caf-005', 'فطيرة جبنة', 'وجبات', 7.00, 'unavailable', 'school_d62554e13bc78423', '17', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- === النقل - الباصات ===
INSERT INTO buses (id, bus_number, route, capacity, status, school_id, owner_id, created_at, updated_at) VALUES
('bus-001', 'BUS-101', 'مسار الشمال - حي النرجس', 40, 'active', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('bus-002', 'BUS-102', 'مسار الجنوب - حي الياسمين', 35, 'active', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('bus-003', 'BUS-103', 'مسار الشرق - حي الملقا', 30, 'maintenance', 'school_d62554e13bc78423', '17', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- === السلوك ===
INSERT INTO behavior (id, student_id, type, points, reason, date, school_id, owner_id, created_at, updated_at) VALUES
('beh-001', '8865cf28-273b-4c7b-a12d-3dc4a6d10b32', 'positive', 10, 'تفوق في الرياضيات', '2026-03-01', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('beh-002', '6299e3de-9c9f-4a15-880e-dfc8c9fd17de', 'negative', -5, 'تأخر عن الحصة', '2026-03-01', 'school_d62554e13bc78423', '17', NOW(), NOW()),
('beh-003', '9e94aeac-58d8-49a1-93d9-57c2a377712c', 'positive', 15, 'مشاركة فعالة في الصف', '2026-03-02', 'school_d62554e13bc78423', '17', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- === الإشعارات ===
INSERT INTO notifications (id, title, message, type, user_id, read, school_id, owner_id, created_at) VALUES
('notif-001', 'مرحباً بك في متين', 'تم تسجيلك بنجاح في منصة متين التعليمية', 'info', '19', false, 'school_d62554e13bc78423', '17', NOW()),
('notif-002', 'واجب جديد', 'تم إضافة واجب جديد في مادة الرياضيات', 'homework', '22', false, 'school_d62554e13bc78423', '17', NOW()),
('notif-003', 'نتائج الاختبار', 'تم رصد درجات اختبار منتصف الفصل', 'exam', '22', false, 'school_d62554e13bc78423', '17', NOW()),
('notif-004', 'اجتماع أولياء الأمور', 'يسرنا دعوتكم لحضور اجتماع أولياء الأمور', 'meeting', '26', false, 'school_d62554e13bc78423', '17', NOW())
ON CONFLICT (id) DO NOTHING;

-- === الرسائل ===
INSERT INTO messages (id, sender_id, receiver_id, subject, content, read, school_id, owner_id, created_at) VALUES
('msg-001', '19', '20', 'ترحيب', 'مرحباً بك في المدرسة، نتمنى لك عاماً دراسياً موفقاً', false, 'school_d62554e13bc78423', '17', NOW()),
('msg-002', '20', '19', 'استفسار', 'هل يمكنني الحصول على جدول الحصص المحدث؟', false, 'school_d62554e13bc78423', '17', NOW()),
('msg-003', '19', '22', 'تنبيه', 'يرجى مراجعة درجات الاختبار الأخير', false, 'school_d62554e13bc78423', '17', NOW())
ON CONFLICT (id) DO NOTHING;

-- === المنشورات (المجتمع) ===
INSERT INTO posts (id, title, content, author_id, type, status, school_id, created_at, updated_at) VALUES
('post-001', 'مرحباً بالعام الدراسي الجديد', 'نرحب بجميع الطلاب والمعلمين في العام الدراسي الجديد', '19', 'announcement', 'published', 'school_d62554e13bc78423', NOW(), NOW()),
('post-002', 'نتائج مسابقة الرياضيات', 'تهانينا للطلاب الفائزين في مسابقة الرياضيات', '20', 'news', 'published', 'school_d62554e13bc78423', NOW(), NOW()),
('post-003', 'رحلة مدرسية', 'سيتم تنظيم رحلة مدرسية يوم الخميس القادم', '19', 'event', 'published', 'school_d62554e13bc78423', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
