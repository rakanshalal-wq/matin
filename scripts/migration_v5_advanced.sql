-- ═══════════════════════════════════════════════════════════════════
-- Migration v5 — الميزات المتقدمة والتكاملات
-- التاريخ: 2026-04-12
-- التطبيق: psql $DATABASE_URL -f scripts/migration_v5_advanced.sql
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. المحاضرات الذكية ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lectures (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL,
  classroom_id  UUID,
  teacher_id    UUID NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  scheduled_at  TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  zoom_meeting_id VARCHAR(255),
  zoom_url      TEXT,
  recording_url TEXT,
  status        VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','ended','cancelled')),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lectures_institution ON lectures(institution_id);
CREATE INDEX IF NOT EXISTS idx_lectures_teacher     ON lectures(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lectures_scheduled   ON lectures(scheduled_at);

CREATE TABLE IF NOT EXISTS lecture_attendance (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id       UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  student_id       UUID NOT NULL,
  attended_at      TIMESTAMP,
  duration_attended INTEGER,
  status           VARCHAR(50) DEFAULT 'absent' CHECK (status IN ('present','absent','late')),
  created_at       TIMESTAMP DEFAULT NOW(),
  UNIQUE(lecture_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_lecture_attendance_lecture  ON lecture_attendance(lecture_id);
CREATE INDEX IF NOT EXISTS idx_lecture_attendance_student  ON lecture_attendance(student_id);

CREATE TABLE IF NOT EXISTS lecture_recordings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id      UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  recording_url   TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size_mb    DECIMAL(10,2),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── 2. قراءات الإعلانات ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcement_reads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id  UUID NOT NULL,
  user_id          UUID NOT NULL,
  read_at          TIMESTAMP DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_ann_reads_announcement ON announcement_reads(announcement_id);
CREATE INDEX IF NOT EXISTS idx_ann_reads_user         ON announcement_reads(user_id);

-- ─── 3. أعذار الغياب ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS attendance_excuses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL,
  date           DATE NOT NULL,
  reason         TEXT NOT NULL,
  attachment_url TEXT,
  status         VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  approved_by    UUID,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_excuses_student ON attendance_excuses(student_id);
CREATE INDEX IF NOT EXISTS idx_excuses_date    ON attendance_excuses(date);

-- ─── 4. تتبع الموقع ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS student_locations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL,
  latitude       DECIMAL(10,8) NOT NULL,
  longitude      DECIMAL(11,8) NOT NULL,
  accuracy_meters DECIMAL(10,2),
  timestamp      TIMESTAMP NOT NULL,
  device_id      VARCHAR(255),
  battery_level  INTEGER,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_locations_student   ON student_locations(student_id);
CREATE INDEX IF NOT EXISTS idx_student_locations_timestamp ON student_locations(timestamp);

CREATE TABLE IF NOT EXISTS location_checkins (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL,
  check_in_time  TIMESTAMP NOT NULL,
  check_out_time TIMESTAMP,
  location_name  VARCHAR(255),
  latitude       DECIMAL(10,8),
  longitude      DECIMAL(11,8),
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkins_student ON location_checkins(student_id);

CREATE TABLE IF NOT EXISTS safe_zones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id  UUID NOT NULL,
  name            VARCHAR(255) NOT NULL,
  latitude        DECIMAL(10,8) NOT NULL,
  longitude       DECIMAL(11,8) NOT NULL,
  radius_meters   INTEGER,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safe_zones_institution ON safe_zones(institution_id);

CREATE TABLE IF NOT EXISTS location_alerts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL,
  safe_zone_id UUID NOT NULL REFERENCES safe_zones(id) ON DELETE CASCADE,
  alert_type   VARCHAR(50),
  triggered_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_location_alerts_student ON location_alerts(student_id);

-- ─── 5. قراءات وإضافات المكتبة ───────────────────────────────────

CREATE TABLE IF NOT EXISTS resource_reads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id      UUID NOT NULL,
  user_id          UUID NOT NULL,
  read_at          TIMESTAMP DEFAULT NOW(),
  duration_seconds INTEGER
);

CREATE INDEX IF NOT EXISTS idx_resource_reads_resource ON resource_reads(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_reads_user     ON resource_reads(user_id);

CREATE TABLE IF NOT EXISTS resource_favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL,
  user_id     UUID NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

-- ─── 6. بنك الأسئلة ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id  UUID NOT NULL,
  subject_id      UUID,
  created_by      UUID NOT NULL,
  title           VARCHAR(255) NOT NULL,
  content         TEXT NOT NULL,
  question_type   VARCHAR(50) DEFAULT 'mcq',
  difficulty_level VARCHAR(50) DEFAULT 'medium',
  points          INTEGER DEFAULT 1,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_institution ON questions(institution_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject     ON questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_by  ON questions(created_by);

CREATE TABLE IF NOT EXISTS question_options (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id  UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text  TEXT NOT NULL,
  is_correct   BOOLEAN DEFAULT FALSE,
  order_index  INTEGER,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_q_options_question ON question_options(question_id);

CREATE TABLE IF NOT EXISTS question_imports (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id   UUID NOT NULL,
  import_file_url  TEXT NOT NULL,
  total_questions  INTEGER,
  imported_count   INTEGER,
  status           VARCHAR(50) DEFAULT 'pending',
  error_message    TEXT,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- ─── 7. تقييم الأسئلة ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS question_ratings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL,
  rating      INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(question_id, user_id)
);

CREATE TABLE IF NOT EXISTS question_statistics (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id      UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE UNIQUE,
  total_attempts   INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  average_rating   DECIMAL(3,2),
  difficulty_rating DECIMAL(3,2),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- ─── 8. تفضيلات الإشعارات ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notification_preferences (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  enabled_email     BOOLEAN DEFAULT TRUE,
  enabled_push      BOOLEAN DEFAULT TRUE,
  enabled_sms       BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, notification_type)
);

CREATE INDEX IF NOT EXISTS idx_notif_prefs_user ON notification_preferences(user_id);

-- ─── 9. مدفوعات المتجر والاشتراكات ──────────────────────────────

CREATE TABLE IF NOT EXISTS subscription_payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id  UUID NOT NULL,
  subscription_id UUID NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  currency        VARCHAR(3) DEFAULT 'SAR',
  payment_method  VARCHAR(50),
  transaction_id  VARCHAR(255),
  status          VARCHAR(50) DEFAULT 'pending',
  paid_at         TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_payments_institution ON subscription_payments(institution_id);

CREATE TABLE IF NOT EXISTS store_payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL,
  amount         DECIMAL(10,2) NOT NULL,
  currency       VARCHAR(3) DEFAULT 'SAR',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  status         VARCHAR(50) DEFAULT 'pending',
  paid_at        TIMESTAMP,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_payments_order ON store_payments(order_id);

-- ─── 10. مزودو الشحن والشحنات ────────────────────────────────────

CREATE TABLE IF NOT EXISTS shipping_providers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL,
  provider_name  VARCHAR(100) NOT NULL,
  api_key        TEXT NOT NULL,
  api_secret     TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL,
  provider_id       UUID NOT NULL REFERENCES shipping_providers(id),
  tracking_number   VARCHAR(255) NOT NULL,
  status            VARCHAR(50) DEFAULT 'pending',
  estimated_delivery DATE,
  actual_delivery    DATE,
  created_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipments_order    ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);

-- ─── 11. الملتقى المجتمعي ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS forums (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID,
  name           VARCHAR(255) NOT NULL,
  description    TEXT,
  is_public      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forums_institution ON forums(institution_id);

CREATE TABLE IF NOT EXISTS forum_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL,
  file_url    TEXT NOT NULL,
  file_name   VARCHAR(255),
  file_type   VARCHAR(50),
  file_size_mb DECIMAL(10,2),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_attachments_post ON forum_attachments(post_id);

CREATE TABLE IF NOT EXISTS forum_follows (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  forum_id   UUID NOT NULL REFERENCES forums(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, forum_id)
);

CREATE INDEX IF NOT EXISTS idx_forum_follows_user  ON forum_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_follows_forum ON forum_follows(forum_id);
