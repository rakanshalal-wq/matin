-- ============================================================
-- migration_v2.sql — منصة متين
-- الجداول الناقصة من schema الأصلي
-- تاريخ الإنشاء: 2026-03-13
-- ملاحظة: جميع الجداول تستخدم IF NOT EXISTS لأمان التشغيل المتكرر
-- ============================================================

-- ============================================================
-- 1. جداول الاختبارات
-- ============================================================

-- جلسات الاختبار (exam_sessions)
CREATE TABLE IF NOT EXISTS exam_sessions (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    exam_id         INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    student_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','terminated','paused')),
    score           NUMERIC(10,2),
    total_marks     NUMERIC(10,2),
    percentage      NUMERIC(5,2),
    grade           TEXT,
    ip_address      TEXT,
    user_agent      TEXT,
    tab_switches    INTEGER DEFAULT 0,
    copy_attempts   INTEGER DEFAULT 0,
    blur_count      INTEGER DEFAULT 0,
    started_at      TIMESTAMPTZ DEFAULT NOW(),
    finished_at     TIMESTAMPTZ,
    school_id       INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_exam_id ON exam_sessions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_student_id ON exam_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_school_id ON exam_sessions(school_id);

-- مخالفات الاختبار (exam_violations)
CREATE TABLE IF NOT EXISTS exam_violations (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id  TEXT REFERENCES exam_sessions(id) ON DELETE CASCADE,
    type        TEXT NOT NULL,
    description TEXT,
    severity    TEXT DEFAULT 'low' CHECK (severity IN ('low','medium','high','critical')),
    timestamp   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_exam_violations_session_id ON exam_violations(session_id);

-- إجابات الاختبار (exam_answers)
CREATE TABLE IF NOT EXISTS exam_answers (
    id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id          TEXT REFERENCES exam_sessions(id) ON DELETE CASCADE,
    question_id         INTEGER,
    question_bank_id    TEXT,
    answer              TEXT,
    is_correct          BOOLEAN,
    time_spent_seconds  INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_exam_answers_session_id ON exam_answers(session_id);

-- سجلات طباعة الاختبارات (exam_print_logs)
CREATE TABLE IF NOT EXISTS exam_print_logs (
    id              SERIAL PRIMARY KEY,
    exam_id         INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    printed_by      INTEGER REFERENCES users(id),
    user_id         INTEGER REFERENCES users(id),
    school_id       INTEGER REFERENCES schools(id),
    copies_count    INTEGER DEFAULT 1,
    copies          INTEGER DEFAULT 1,
    watermark       TEXT,
    ip_address      TEXT,
    printed_at      TIMESTAMPTZ DEFAULT NOW()
);

-- جلسات المراقبة الإلكترونية (exam_proctoring_sessions)
CREATE TABLE IF NOT EXISTS exam_proctoring_sessions (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    exam_session_id TEXT REFERENCES exam_sessions(id) ON DELETE CASCADE,
    student_id      INTEGER REFERENCES users(id),
    violations      JSONB DEFAULT '[]',
    screenshots     JSONB DEFAULT '[]',
    status          TEXT DEFAULT 'active',
    started_at      TIMESTAMPTZ DEFAULT NOW(),
    ended_at        TIMESTAMPTZ,
    school_id       INTEGER REFERENCES schools(id)
);

-- أسئلة الاختبار المرتبطة (exam_questions)
CREATE TABLE IF NOT EXISTS exam_questions (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    exam_id         INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    question_id     INTEGER,
    question_bank_id TEXT,
    "order"         INTEGER DEFAULT 0,
    points          NUMERIC(5,2) DEFAULT 1,
    question_text   TEXT,
    options         JSONB,
    correct_answer  TEXT,
    difficulty      TEXT DEFAULT 'medium',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(exam_id);

-- قاعة الاختبارات (exam_rooms)
CREATE TABLE IF NOT EXISTS exam_rooms (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    building    TEXT,
    capacity    INTEGER DEFAULT 30,
    floor       TEXT,
    equipment   TEXT,
    status      TEXT DEFAULT 'available' CHECK (status IN ('available','occupied','maintenance')),
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الاختبارات (exam_schedule)
CREATE TABLE IF NOT EXISTS exam_schedule (
    id          SERIAL PRIMARY KEY,
    exam_name   TEXT NOT NULL,
    subject     TEXT,
    date        DATE,
    start_time  TIME,
    end_time    TIME,
    room        TEXT,
    class_name  TEXT,
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. جداول النقل والمواصلات
-- ============================================================

-- الحافلات (buses)
CREATE TABLE IF NOT EXISTS buses (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    bus_number      TEXT NOT NULL,
    plate_number    TEXT,
    capacity        INTEGER DEFAULT 40,
    driver_name     TEXT,
    driver_phone    TEXT,
    route_name      TEXT,
    status          TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','maintenance')),
    school_id       INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_buses_school_id ON buses(school_id);

-- ركاب الحافلة (bus_riders)
CREATE TABLE IF NOT EXISTS bus_riders (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    bus_id          TEXT REFERENCES buses(id) ON DELETE CASCADE,
    student_id      INTEGER REFERENCES users(id),
    pickup_address  TEXT,
    stop_order      INTEGER DEFAULT 0,
    status          TEXT DEFAULT 'active',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- رحلات الحافلة (bus_trips)
CREATE TABLE IF NOT EXISTS bus_trips (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    bus_id      TEXT REFERENCES buses(id) ON DELETE CASCADE,
    trip_type   TEXT DEFAULT 'morning' CHECK (trip_type IN ('morning','afternoon','custom')),
    started_at  TIMESTAMPTZ DEFAULT NOW(),
    ended_at    TIMESTAMPTZ,
    status      TEXT DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- أحداث رحلة الحافلة (bus_events)
CREATE TABLE IF NOT EXISTS bus_events (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    trip_id     TEXT REFERENCES bus_trips(id) ON DELETE CASCADE,
    student_id  INTEGER REFERENCES users(id),
    event_type  TEXT NOT NULL CHECK (event_type IN ('pickup','dropoff','absent','late')),
    gps_lat     NUMERIC(10,7),
    gps_lng     NUMERIC(10,7),
    timestamp   TIMESTAMPTZ DEFAULT NOW()
);

-- الموقع المباشر للحافلة (bus_live_location)
CREATE TABLE IF NOT EXISTS bus_live_location (
    id          SERIAL PRIMARY KEY,
    bus_id      TEXT REFERENCES buses(id) ON DELETE CASCADE,
    trip_id     TEXT REFERENCES bus_trips(id) ON DELETE SET NULL,
    lat         NUMERIC(10,7) NOT NULL,
    lng         NUMERIC(10,7) NOT NULL,
    speed       NUMERIC(5,2),
    heading     NUMERIC(5,2),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- صيانة الحافلات (bus_maintenance)
CREATE TABLE IF NOT EXISTS bus_maintenance (
    id          SERIAL PRIMARY KEY,
    bus_number  TEXT NOT NULL,
    type        TEXT NOT NULL,
    description TEXT,
    date        DATE,
    cost        NUMERIC(10,2),
    status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- السائقون (drivers)
CREATE TABLE IF NOT EXISTS drivers (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    phone           TEXT,
    license_number  TEXT,
    bus_number      TEXT,
    route           TEXT,
    role            TEXT DEFAULT 'driver',
    status          TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- رخص القيادة (driver_licenses)
CREATE TABLE IF NOT EXISTS driver_licenses (
    id              SERIAL PRIMARY KEY,
    driver_name     TEXT NOT NULL,
    license_number  TEXT NOT NULL,
    type            TEXT,
    issue_date      DATE,
    expiry_date     DATE,
    status          TEXT DEFAULT 'valid' CHECK (status IN ('valid','expired','suspended')),
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- سجلات الوقود (fuel_records)
CREATE TABLE IF NOT EXISTS fuel_records (
    id          SERIAL PRIMARY KEY,
    bus_id      TEXT REFERENCES buses(id) ON DELETE CASCADE,
    bus_number  TEXT,
    liters      NUMERIC(8,2),
    cost        NUMERIC(10,2),
    date        DATE DEFAULT CURRENT_DATE,
    station     TEXT,
    odometer    NUMERIC(10,2),
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. جداول الصحة والرعاية
-- ============================================================

-- العيادة (clinic)
CREATE TABLE IF NOT EXISTS clinic (
    id              SERIAL PRIMARY KEY,
    patient_name    TEXT NOT NULL,
    visit_type      TEXT,
    symptoms        TEXT,
    diagnosis       TEXT,
    treatment       TEXT,
    doctor_name     TEXT,
    visit_date      DATE DEFAULT CURRENT_DATE,
    status          TEXT DEFAULT 'open' CHECK (status IN ('open','closed','follow_up')),
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_clinic_school_id ON clinic(school_id);

-- التأمين الصحي (health_insurance)
CREATE TABLE IF NOT EXISTS health_insurance (
    id              SERIAL PRIMARY KEY,
    person_name     TEXT NOT NULL,
    provider        TEXT,
    policy_number   TEXT,
    type            TEXT,
    start_date      DATE,
    end_date        DATE,
    coverage        TEXT,
    status          TEXT DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- الطلاب الموهوبون (gifted)
CREATE TABLE IF NOT EXISTS gifted (
    id              SERIAL PRIMARY KEY,
    student_name    TEXT NOT NULL,
    talent_type     TEXT,
    description     TEXT,
    program         TEXT,
    teacher_name    TEXT,
    status          TEXT DEFAULT 'active',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ذوو الاحتياجات الخاصة (special_needs)
CREATE TABLE IF NOT EXISTS special_needs (
    id              SERIAL PRIMARY KEY,
    student_name    TEXT NOT NULL,
    condition_type  TEXT,
    description     TEXT,
    support_plan    TEXT,
    teacher_name    TEXT,
    status          TEXT DEFAULT 'active',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- التطعيمات (vaccinations_table)
CREATE TABLE IF NOT EXISTS vaccinations_table (
    id              SERIAL PRIMARY KEY,
    student_name    TEXT NOT NULL,
    vaccine_name    TEXT NOT NULL,
    dose_number     INTEGER DEFAULT 1,
    date            DATE DEFAULT CURRENT_DATE,
    next_dose_date  DATE,
    administered_by TEXT,
    status          TEXT DEFAULT 'completed' CHECK (status IN ('completed','pending','missed')),
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- السلوك (behavior)
CREATE TABLE IF NOT EXISTS behavior (
    id              SERIAL PRIMARY KEY,
    student_name    TEXT NOT NULL,
    type            TEXT NOT NULL CHECK (type IN ('positive','negative','neutral')),
    category        TEXT,
    description     TEXT,
    points          INTEGER DEFAULT 0,
    teacher_name    TEXT,
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_behavior_school_id ON behavior(school_id);

-- الإرشاد النفسي (counseling)
CREATE TABLE IF NOT EXISTS counseling (
    id              SERIAL PRIMARY KEY,
    student_name    TEXT NOT NULL,
    counselor_name  TEXT,
    type            TEXT,
    description     TEXT,
    status          TEXT DEFAULT 'open' CHECK (status IN ('open','closed','follow_up')),
    notes           TEXT,
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- الطوارئ (emergencies)
CREATE TABLE IF NOT EXISTS emergencies (
    id              SERIAL PRIMARY KEY,
    student_name    TEXT NOT NULL,
    type            TEXT NOT NULL,
    description     TEXT,
    action_taken    TEXT,
    reported_by     TEXT,
    severity        TEXT DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
    date            TIMESTAMPTZ DEFAULT NOW(),
    status          TEXT DEFAULT 'open' CHECK (status IN ('open','resolved','pending')),
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- مفاتيح الطوارئ (emergency_keys)
CREATE TABLE IF NOT EXISTS emergency_keys (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name        TEXT NOT NULL,
    key_hash    TEXT NOT NULL,
    permissions JSONB DEFAULT '[]',
    expires_at  TIMESTAMPTZ,
    is_active   BOOLEAN DEFAULT true,
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- سجلات استخدام مفاتيح الطوارئ (emergency_key_logs)
CREATE TABLE IF NOT EXISTS emergency_key_logs (
    id          SERIAL PRIMARY KEY,
    key_id      TEXT REFERENCES emergency_keys(id) ON DELETE CASCADE,
    used_by     TEXT,
    action      TEXT,
    ip_address  TEXT,
    used_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. جداول التواصل والرسائل
-- ============================================================

-- غرف الدردشة (chat_rooms)
CREATE TABLE IF NOT EXISTS chat_rooms (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    type            TEXT DEFAULT 'group' CHECK (type IN ('direct','group','broadcast')),
    members_count   INTEGER DEFAULT 0,
    last_message    TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    status          TEXT DEFAULT 'active',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- الرسائل (messages)
CREATE TABLE IF NOT EXISTS messages (
    id          SERIAL PRIMARY KEY,
    title       TEXT,
    content     TEXT NOT NULL,
    sender      TEXT,
    receiver    TEXT,
    type        TEXT DEFAULT 'general',
    priority    TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
    status      TEXT DEFAULT 'sent' CHECK (status IN ('sent','delivered','read','archived')),
    is_read     BOOLEAN DEFAULT false,
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_school_id ON messages(school_id);

-- صندوق الوارد (inbox_messages)
CREATE TABLE IF NOT EXISTS inbox_messages (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message_id  INTEGER REFERENCES messages(id) ON DELETE CASCADE,
    is_read     BOOLEAN DEFAULT false,
    is_starred  BOOLEAN DEFAULT false,
    folder      TEXT DEFAULT 'inbox',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- منشورات المجتمع (community_posts)
CREATE TABLE IF NOT EXISTS community_posts (
    id          SERIAL PRIMARY KEY,
    content     TEXT NOT NULL,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    school_id   INTEGER REFERENCES schools(id),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_pinned   BOOLEAN DEFAULT false,
    status      TEXT DEFAULT 'active',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_community_posts_school_id ON community_posts(school_id);

-- إعجابات المجتمع (community_likes)
CREATE TABLE IF NOT EXISTS community_likes (
    id          SERIAL PRIMARY KEY,
    post_id     INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- تعليقات المجتمع (community_comments)
CREATE TABLE IF NOT EXISTS community_comments (
    id          SERIAL PRIMARY KEY,
    post_id     INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- المنتديات (forums)
CREATE TABLE IF NOT EXISTS forums (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    category        TEXT,
    author          TEXT,
    description     TEXT,
    members_count   INTEGER DEFAULT 0,
    posts_count     INTEGER DEFAULT 0,
    status          TEXT DEFAULT 'active',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- المتابعات (follows)
CREATE TABLE IF NOT EXISTS follows (
    id              SERIAL PRIMARY KEY,
    follower_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    following_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- منشورات الشبكة الاجتماعية (posts)
CREATE TABLE IF NOT EXISTS posts (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    media_url   TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    school_id   INTEGER REFERENCES schools(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- إعجابات المنشورات (post_likes)
CREATE TABLE IF NOT EXISTS post_likes (
    id          SERIAL PRIMARY KEY,
    post_id     INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- تعليقات المنشورات (post_comments)
CREATE TABLE IF NOT EXISTS post_comments (
    id          SERIAL PRIMARY KEY,
    post_id     INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. جداول المحتوى التعليمي
-- ============================================================

-- المحاضرات (lectures) - إذا لم تكن موجودة
CREATE TABLE IF NOT EXISTS lectures (
    id                      SERIAL PRIMARY KEY,
    title                   TEXT NOT NULL,
    subject                 TEXT,
    teacher_id              INTEGER REFERENCES users(id),
    teacher_name            TEXT,
    class_id                INTEGER,
    scheduled_at            TIMESTAMPTZ,
    duration                INTEGER DEFAULT 60,
    type                    TEXT DEFAULT 'in_person' CHECK (type IN ('in_person','online','hybrid')),
    location                TEXT,
    description             TEXT,
    status                  TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','active','completed','cancelled')),
    confirmation_deadline   TIMESTAMPTZ,
    unlock_window_hours     INTEGER DEFAULT 24,
    course_id               INTEGER,
    video_url               TEXT,
    attachments             JSONB DEFAULT '[]',
    materials               JSONB DEFAULT '[]',
    school_id               INTEGER REFERENCES schools(id),
    owner_id                INTEGER,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lectures_school_id ON lectures(school_id);
CREATE INDEX IF NOT EXISTS idx_lectures_teacher_id ON lectures(teacher_id);

-- تأكيدات الحضور للمحاضرات (lecture_confirmations)
CREATE TABLE IF NOT EXISTS lecture_confirmations (
    id          SERIAL PRIMARY KEY,
    lecture_id  INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
    student_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
    confirmed   BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(lecture_id, student_id)
);

-- أسئلة ما بعد المحاضرة (lecture_post_questions)
CREATE TABLE IF NOT EXISTS lecture_post_questions (
    id          SERIAL PRIMARY KEY,
    lecture_id  INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
    question    TEXT NOT NULL,
    answer      TEXT,
    student_id  INTEGER REFERENCES users(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- البث المباشر (live_streams)
CREATE TABLE IF NOT EXISTS live_streams (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    subject         TEXT,
    teacher_name    TEXT,
    class_name      TEXT,
    platform        TEXT,
    link            TEXT,
    date            TIMESTAMPTZ,
    duration        INTEGER,
    viewers_count   INTEGER DEFAULT 0,
    status          TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','ended','cancelled')),
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- التسجيلات (recordings)
CREATE TABLE IF NOT EXISTS recordings (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    subject         TEXT,
    teacher_name    TEXT,
    class_name      TEXT,
    duration        INTEGER,
    file_url        TEXT,
    file_size       BIGINT,
    views_count     INTEGER DEFAULT 0,
    date            TIMESTAMPTZ DEFAULT NOW(),
    status          TEXT DEFAULT 'active',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- الفيديوهات (video_items)
CREATE TABLE IF NOT EXISTS video_items (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    url         TEXT,
    thumbnail   TEXT,
    duration    INTEGER,
    views_count INTEGER DEFAULT 0,
    status      TEXT DEFAULT 'active',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- معرض الصور (gallery_items)
CREATE TABLE IF NOT EXISTS gallery_items (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    image_url   TEXT,
    category    TEXT,
    status      TEXT DEFAULT 'active',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- الكتب المكتبية (library_books)
CREATE TABLE IF NOT EXISTS library_books (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    author      TEXT,
    isbn        TEXT,
    category    TEXT,
    quantity    INTEGER DEFAULT 1,
    available   INTEGER DEFAULT 1,
    status      TEXT DEFAULT 'available',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- قاعدة المعرفة (knowledge_base)
CREATE TABLE IF NOT EXISTS knowledge_base (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    content     TEXT,
    category    TEXT,
    tags        JSONB DEFAULT '[]',
    status      TEXT DEFAULT 'active',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- المقررات (courses)
CREATE TABLE IF NOT EXISTS courses (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name        TEXT NOT NULL,
    description TEXT,
    duration    INTEGER,
    price       NUMERIC(10,2) DEFAULT 0,
    instructor  TEXT,
    level       TEXT DEFAULT 'beginner',
    status      TEXT DEFAULT 'active',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- المناهج (curriculum)
CREATE TABLE IF NOT EXISTS curriculum (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT,
    grade       TEXT,
    subject     TEXT,
    year        TEXT,
    status      TEXT DEFAULT 'active',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- التعليم الإلكتروني (elearning)
CREATE TABLE IF NOT EXISTS elearning (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    type            TEXT DEFAULT 'course',
    subject         TEXT,
    instructor      TEXT,
    description     TEXT,
    duration        INTEGER,
    level           TEXT DEFAULT 'beginner',
    students_count  INTEGER DEFAULT 0,
    status          TEXT DEFAULT 'active',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. جداول المالية والإدارة
-- ============================================================

-- كشوف الرواتب (payroll)
CREATE TABLE IF NOT EXISTS payroll (
    id          SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES users(id),
    school_id   INTEGER REFERENCES schools(id),
    amount      NUMERIC(10,2) NOT NULL,
    bonus       NUMERIC(10,2) DEFAULT 0,
    deductions  NUMERIC(10,2) DEFAULT 0,
    net_amount  NUMERIC(10,2),
    month       INTEGER CHECK (month BETWEEN 1 AND 12),
    year        INTEGER,
    status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
    notes       TEXT,
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payroll_school_id ON payroll(school_id);

-- رسوم الطلاب (student_fees)
CREATE TABLE IF NOT EXISTS student_fees (
    id              SERIAL PRIMARY KEY,
    student_id      INTEGER REFERENCES users(id),
    student_name    TEXT,
    amount          NUMERIC(10,2) NOT NULL,
    fee_type        TEXT,
    description     TEXT,
    due_date        DATE,
    paid_date       DATE,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','waived')),
    payment_method  TEXT,
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_student_fees_school_id ON student_fees(school_id);

-- تتبع الطلاب (student_tracking)
CREATE TABLE IF NOT EXISTS student_tracking (
    id          SERIAL PRIMARY KEY,
    student_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lat         NUMERIC(10,7),
    lng         NUMERIC(10,7),
    status      TEXT DEFAULT 'at_school',
    bus_id      TEXT,
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    school_id   INTEGER REFERENCES schools(id)
);

-- الفواتير الموحدة (unified_invoices)
CREATE TABLE IF NOT EXISTS unified_invoices (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_number  TEXT UNIQUE,
    user_id         INTEGER REFERENCES users(id),
    school_id       INTEGER REFERENCES schools(id),
    amount          NUMERIC(10,2) NOT NULL,
    tax             NUMERIC(10,2) DEFAULT 0,
    total           NUMERIC(10,2),
    description     TEXT,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled','refunded')),
    due_date        DATE,
    paid_at         TIMESTAMPTZ,
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- المدفوعات الموحدة (unified_payments)
CREATE TABLE IF NOT EXISTS unified_payments (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_id      TEXT REFERENCES unified_invoices(id),
    user_id         INTEGER REFERENCES users(id),
    amount          NUMERIC(10,2) NOT NULL,
    method          TEXT DEFAULT 'online',
    provider        TEXT,
    transaction_id  TEXT,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- إعدادات الدفع (payment_settings)
CREATE TABLE IF NOT EXISTS payment_settings (
    id          SERIAL PRIMARY KEY,
    provider    TEXT NOT NULL,
    config      JSONB DEFAULT '{}',
    is_active   BOOLEAN DEFAULT false,
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- إعدادات دفع المدرسة (school_payment_settings)
CREATE TABLE IF NOT EXISTS school_payment_settings (
    id              SERIAL PRIMARY KEY,
    school_id       INTEGER REFERENCES schools(id) ON DELETE CASCADE UNIQUE,
    provider        TEXT,
    public_key      TEXT,
    secret_key      TEXT,
    webhook_secret  TEXT,
    currency        TEXT DEFAULT 'SAR',
    is_active       BOOLEAN DEFAULT false,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. جداول الإدارة والتنظيم
-- ============================================================

-- التعاميم (circulars)
CREATE TABLE IF NOT EXISTS circulars (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    type            TEXT DEFAULT 'general',
    content         TEXT,
    sender          TEXT,
    target_audience TEXT DEFAULT 'all',
    priority        TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
    publish_date    DATE DEFAULT CURRENT_DATE,
    status          TEXT DEFAULT 'active',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- لجان التصحيح (grading_committees)
CREATE TABLE IF NOT EXISTS grading_committees (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    subject     TEXT,
    members     TEXT,
    head        TEXT,
    status      TEXT DEFAULT 'active',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- طلبات القبول (admissions)
CREATE TABLE IF NOT EXISTS admissions (
    id              SERIAL PRIMARY KEY,
    school_id       INTEGER REFERENCES schools(id),
    student_name    TEXT NOT NULL,
    email           TEXT,
    phone           TEXT,
    grade           TEXT,
    parent_name     TEXT,
    parent_phone    TEXT,
    notes           TEXT,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','waitlisted')),
    rejection_reason TEXT,
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_admissions_school_id ON admissions(school_id);

-- أحداث التقويم (calendar_events)
CREATE TABLE IF NOT EXISTS calendar_events (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    start_date  TIMESTAMPTZ NOT NULL,
    end_date    TIMESTAMPTZ,
    type        TEXT DEFAULT 'event',
    color       TEXT DEFAULT '#3B82F6',
    all_day     BOOLEAN DEFAULT false,
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- الاجتماعات (meetings)
CREATE TABLE IF NOT EXISTS meetings (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    date        TIMESTAMPTZ,
    location    TEXT,
    organizer   TEXT,
    attendees   TEXT,
    status      TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled')),
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- العملاء المحتملون (leads)
CREATE TABLE IF NOT EXISTS leads (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT,
    phone       TEXT,
    company     TEXT,
    source      TEXT,
    status      TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','converted','lost')),
    notes       TEXT,
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- الأخبار (news_articles)
CREATE TABLE IF NOT EXISTS news_articles (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    content     TEXT,
    image_url   TEXT,
    author      TEXT,
    category    TEXT,
    status      TEXT DEFAULT 'active',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- مظهر المدرسة (school_appearance)
CREATE TABLE IF NOT EXISTS school_appearance (
    id                  SERIAL PRIMARY KEY,
    school_id           INTEGER REFERENCES schools(id) ON DELETE CASCADE UNIQUE,
    primary_color       TEXT DEFAULT '#1a1a2e',
    secondary_color     TEXT DEFAULT '#C9A84C',
    background_color    TEXT DEFAULT '#ffffff',
    logo_url            TEXT,
    hero_image_url      TEXT,
    school_name         TEXT,
    school_slogan       TEXT,
    template            TEXT DEFAULT 'default',
    font                TEXT DEFAULT 'Cairo',
    show_ads            BOOLEAN DEFAULT true,
    show_store_button   BOOLEAN DEFAULT true,
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- صفحات المدرسة (school_pages)
CREATE TABLE IF NOT EXISTS school_pages (
    id          SERIAL PRIMARY KEY,
    school_id   INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    slug        TEXT NOT NULL,
    title       TEXT,
    content     JSONB DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, slug)
);

-- سجلات الأمان (security_records)
CREATE TABLE IF NOT EXISTS security_records (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    type        TEXT DEFAULT 'incident',
    severity    TEXT DEFAULT 'low',
    status      TEXT DEFAULT 'open',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- الإعدادات العامة (settings)
CREATE TABLE IF NOT EXISTS settings (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    key         TEXT NOT NULL,
    value       TEXT,
    category    TEXT DEFAULT 'general',
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    UNIQUE(key, school_id)
);

-- إعدادات الموقع (site_settings)
CREATE TABLE IF NOT EXISTS site_settings (
    id          SERIAL PRIMARY KEY,
    key         TEXT NOT NULL UNIQUE,
    value       TEXT,
    category    TEXT DEFAULT 'general',
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- الزوار (visitors)
CREATE TABLE IF NOT EXISTS visitors (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    phone       TEXT,
    purpose     TEXT,
    host_name   TEXT,
    check_in    TIMESTAMPTZ DEFAULT NOW(),
    check_out   TIMESTAMPTZ,
    status      TEXT DEFAULT 'checked_in',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- المرافق (facilities)
CREATE TABLE IF NOT EXISTS facilities (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    type        TEXT DEFAULT 'room',
    capacity    INTEGER,
    status      TEXT DEFAULT 'available',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. جداول المستخدمين الموسّعة
-- ============================================================

-- الطلاب (students) - جدول موسّع
CREATE TABLE IF NOT EXISTS students (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    student_id      TEXT,
    gender          TEXT CHECK (gender IN ('male','female','other')),
    date_of_birth   DATE,
    class_id        INTEGER,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    school_id       INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    owner_id        INTEGER,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);

-- المعلمون (teachers) - جدول موسّع
CREATE TABLE IF NOT EXISTS teachers (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    employee_id     TEXT,
    specialization  TEXT,
    department      TEXT,
    salary          NUMERIC(10,2),
    hire_date       DATE DEFAULT CURRENT_DATE,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    school_id       INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);

-- أولياء الأمور (parents) - جدول موسّع
CREATE TABLE IF NOT EXISTS parents (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    occupation  TEXT,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    school_id   INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- المشرفون (supervisors_table)
CREATE TABLE IF NOT EXISTS supervisors_table (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    phone           TEXT,
    email           TEXT,
    specialization  TEXT,
    assigned_exams  TEXT,
    status          TEXT DEFAULT 'active',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- المدربون (trainers)
CREATE TABLE IF NOT EXISTS trainers (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    specialization  TEXT,
    phone           TEXT,
    email           TEXT,
    status          TEXT DEFAULT 'active',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- سجلات التدريب (training_records)
CREATE TABLE IF NOT EXISTS training_records (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    trainer_id  INTEGER REFERENCES trainers(id),
    participants TEXT,
    date        DATE DEFAULT CURRENT_DATE,
    duration    INTEGER,
    status      TEXT DEFAULT 'active',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- الكليات (colleges)
CREATE TABLE IF NOT EXISTS colleges (
    id          SERIAL PRIMARY KEY,
    school_id   INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    name_en     TEXT,
    type        TEXT DEFAULT 'college',
    dean_name   TEXT,
    email       TEXT,
    phone       TEXT,
    description TEXT,
    is_active   BOOLEAN DEFAULT true,
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- المندوبون (delegates)
CREATE TABLE IF NOT EXISTS delegates (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    owner_id    INTEGER,
    school_id   INTEGER REFERENCES schools(id),
    permissions JSONB DEFAULT '[]',
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- الساعات المعتمدة (credit_hours)
CREATE TABLE IF NOT EXISTS credit_hours (
    id              SERIAL PRIMARY KEY,
    subject_name    TEXT NOT NULL,
    code            TEXT,
    hours           INTEGER DEFAULT 3,
    type            TEXT DEFAULT 'required',
    semester        TEXT,
    department      TEXT,
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. جداول AI والإشراف
-- ============================================================

-- محادثات AI (ai_chats)
CREATE TABLE IF NOT EXISTS ai_chats (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message     TEXT NOT NULL,
    reply       TEXT,
    model       TEXT,
    tokens_used INTEGER DEFAULT 0,
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_chats_user_id ON ai_chats(user_id);

-- إشراف AI (ai_moderation_log)
CREATE TABLE IF NOT EXISTS ai_moderation_log (
    id              SERIAL PRIMARY KEY,
    content_type    TEXT,
    content_id      TEXT,
    content_preview TEXT,
    safety_score    NUMERIC(5,2),
    verdict         TEXT,
    ai_explanation  TEXT,
    action_taken    TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- سجل الإشراف (moderation_log)
CREATE TABLE IF NOT EXISTS moderation_log (
    id              SERIAL PRIMARY KEY,
    moderator_id    INTEGER REFERENCES users(id),
    moderator_name  TEXT,
    action          TEXT NOT NULL,
    content_type    TEXT,
    content_id      TEXT,
    reason          TEXT,
    is_ai_action    BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- إعدادات الإشراف (moderation_settings)
CREATE TABLE IF NOT EXISTS moderation_settings (
    id          SERIAL PRIMARY KEY,
    key         TEXT NOT NULL UNIQUE,
    value       TEXT,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- تقارير المحتوى (content_reports)
CREATE TABLE IF NOT EXISTS content_reports (
    id              SERIAL PRIMARY KEY,
    reporter_id     INTEGER REFERENCES users(id),
    content_type    TEXT NOT NULL,
    content_id      TEXT NOT NULL,
    reason          TEXT,
    description     TEXT,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','resolved','dismissed')),
    reviewed_by     INTEGER REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. جداول المتجر والإعلانات
-- ============================================================

-- الإعلانات (ads)
CREATE TABLE IF NOT EXISTS ads (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    description     TEXT,
    image_url       TEXT,
    click_url       TEXT,
    is_platform_ad  BOOLEAN DEFAULT false,
    position        TEXT DEFAULT 'sidebar',
    target_type     TEXT DEFAULT 'all',
    start_date      DATE,
    end_date        DATE,
    priority        INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    clicks_count    INTEGER DEFAULT 0,
    views_count     INTEGER DEFAULT 0,
    owner_id        INTEGER,
    school_id       INTEGER REFERENCES schools(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- سلة التسوق (cart_items)
CREATE TABLE IF NOT EXISTS cart_items (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id  INTEGER REFERENCES store_products(id) ON DELETE CASCADE,
    quantity    INTEGER DEFAULT 1,
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- شركات الشحن (shipping_companies)
CREATE TABLE IF NOT EXISTS shipping_companies (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    code        TEXT,
    logo_url    TEXT,
    api_url     TEXT,
    is_active   BOOLEAN DEFAULT true,
    config      JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. جداول متنوعة
-- ============================================================

-- المستخدمون الضيوف (guest_users)
CREATE TABLE IF NOT EXISTS guest_users (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    phone       TEXT,
    email       TEXT,
    nationality TEXT,
    purpose     TEXT,
    token       TEXT UNIQUE,
    expires_at  TIMESTAMPTZ,
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- خدمات المؤسسة (institution_services)
CREATE TABLE IF NOT EXISTS institution_services (
    id          SERIAL PRIMARY KEY,
    school_id   INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    service_key TEXT NOT NULL,
    is_enabled  BOOLEAN DEFAULT false,
    enabled_by  INTEGER REFERENCES users(id),
    enabled_at  TIMESTAMPTZ,
    disabled_at TIMESTAMPTZ,
    disabled_by INTEGER REFERENCES users(id),
    notes       TEXT,
    config      JSONB DEFAULT '{}',
    UNIQUE(school_id, service_key)
);

-- المخزون (inventory_items)
CREATE TABLE IF NOT EXISTS inventory_items (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    quantity    INTEGER DEFAULT 0,
    unit        TEXT DEFAULT 'piece',
    min_quantity INTEGER DEFAULT 5,
    category    TEXT,
    status      TEXT DEFAULT 'available',
    school_id   INTEGER REFERENCES schools(id),
    owner_id    INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- الشركاء (partners)
CREATE TABLE IF NOT EXISTS partners (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    logo_url    TEXT,
    icon        TEXT,
    website     TEXT,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- مجلس أولياء الأمور (parents_council)
CREATE TABLE IF NOT EXISTS parents_council (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    type            TEXT DEFAULT 'meeting',
    date            TIMESTAMPTZ,
    location        TEXT,
    attendees_count INTEGER DEFAULT 0,
    agenda          TEXT,
    notes           TEXT,
    status          TEXT DEFAULT 'scheduled',
    school_id       INTEGER REFERENCES schools(id),
    owner_id        INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- OTP البريد الإلكتروني (email_otps)
CREATE TABLE IF NOT EXISTS email_otps (
    id          SERIAL PRIMARY KEY,
    email       TEXT NOT NULL,
    otp         TEXT NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps(email);

-- تصميمات الصفحات (page_designs)
CREATE TABLE IF NOT EXISTS page_designs (
    id          SERIAL PRIMARY KEY,
    school_id   INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    page        TEXT NOT NULL,
    design      JSONB DEFAULT '{}',
    is_active   BOOLEAN DEFAULT true,
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, page)
);

-- المدارس (schools) - إذا لم تكن موجودة
CREATE TABLE IF NOT EXISTS schools (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    name_ar         TEXT,
    type            TEXT DEFAULT 'school',
    city            TEXT,
    country         TEXT DEFAULT 'SA',
    phone           TEXT,
    email           TEXT,
    logo_url        TEXT,
    website         TEXT,
    owner_id        INTEGER REFERENCES users(id),
    package         TEXT DEFAULT 'free',
    status          TEXT DEFAULT 'active',
    subscription_end DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. Indexes إضافية للأداء
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions(status);
CREATE INDEX IF NOT EXISTS idx_student_fees_status ON student_fees(status);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_ai_chats_school_id ON ai_chats(school_id);
CREATE INDEX IF NOT EXISTS idx_behavior_student_name ON behavior(student_name);
CREATE INDEX IF NOT EXISTS idx_clinic_visit_date ON clinic(visit_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_email_otps_expires_at ON email_otps(expires_at);

-- ============================================================
-- انتهى migration_v2.sql
-- ============================================================
