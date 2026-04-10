-- ===================================================
-- Migration: إضافة دعم 2FA (TOTP) للمستخدمين
-- التطبيق: psql $DATABASE_URL -f scripts/migration_2fa.sql
-- ===================================================

-- إضافة أعمدة 2FA لجدول المستخدمين
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS totp_secret      TEXT,
  ADD COLUMN IF NOT EXISTS totp_enabled     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS totp_enabled_at  TIMESTAMP;

-- جدول تتبع الأكواد المستخدمة (لمنع إعادة الاستخدام)
CREATE TABLE IF NOT EXISTS totp_used_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL,
  token      VARCHAR(6) NOT NULL,
  used_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, token, used_at)
);

-- تنظيف الأكواد القديمة تلقائياً (أقدم من دقيقتين)
CREATE INDEX IF NOT EXISTS idx_totp_used_tokens_user_used
  ON totp_used_tokens (user_id, used_at);

-- تعليق توضيحي
COMMENT ON COLUMN users.totp_secret IS 'سر TOTP مشفر بـ Base32، محفوظ بعد التحقق من صحته فقط';
COMMENT ON COLUMN users.totp_enabled IS 'هل 2FA مفعّل لهذا المستخدم';
