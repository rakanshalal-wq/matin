-- ═══════════════════════════════════════════════════════════════════
-- منصة متين — Migration: Schema-per-Tenant
-- تشغيل: psql -U matin_user -d matin_db -f scripts/migration_tenant_schema.sql
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. جدول tenants ─────────────────────────────────────────────
-- يحتوي على بيانات ربط كل مؤسسة بـ Schema الخاص بها
CREATE TABLE IF NOT EXISTS tenants (
  id            SERIAL PRIMARY KEY,
  schema_name   VARCHAR(63) UNIQUE NOT NULL,  -- مثل: school_42 (حد PostgreSQL = 63 حرفاً)
  owner_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id     INTEGER REFERENCES schools(id) ON DELETE SET NULL,
  status        VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  migrated      BOOLEAN DEFAULT false,        -- علامة: تم نقل البيانات القديمة
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_owner_id   ON tenants(owner_id);
CREATE INDEX IF NOT EXISTS idx_tenants_school_id  ON tenants(school_id);
CREATE INDEX IF NOT EXISTS idx_tenants_schema     ON tenants(schema_name);

-- ─── 2. تحديث جدول subscription_plans ───────────────────────────
-- إضافة حد التخزين (لم يكن موجوداً)
ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS max_storage_gb  INTEGER DEFAULT 5;

-- تحديث القيم الافتراضية لتعكس الباقات الفعلية
UPDATE subscription_plans SET max_storage_gb = 2   WHERE plan_key = 'free';
UPDATE subscription_plans SET max_storage_gb = 10  WHERE plan_key = 'basic';
UPDATE subscription_plans SET max_storage_gb = 50  WHERE plan_key = 'professional';
UPDATE subscription_plans SET max_storage_gb = 500 WHERE plan_key = 'enterprise';
UPDATE subscription_plans SET max_storage_gb = 500 WHERE plan_key = 'gold';

-- ─── 3. جدول tenant_quotas ───────────────────────────────────────
-- يتتبع الاستهلاك الحالي لكل مؤسسة بشكل لحظي
CREATE TABLE IF NOT EXISTS tenant_quotas (
  id                    SERIAL PRIMARY KEY,
  tenant_id             INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  current_students      INTEGER DEFAULT 0 CHECK (current_students >= 0),
  current_storage_bytes BIGINT  DEFAULT 0 CHECK (current_storage_bytes >= 0),
  last_updated          TIMESTAMP DEFAULT NOW(),
  UNIQUE (tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_quotas_tenant ON tenant_quotas(tenant_id);

-- ─── 4. دالة تحديث last_updated تلقائياً ─────────────────────────
CREATE OR REPLACE FUNCTION update_tenant_quota_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tenant_quotas_updated ON tenant_quotas;
CREATE TRIGGER trg_tenant_quotas_updated
  BEFORE UPDATE ON tenant_quotas
  FOR EACH ROW EXECUTE FUNCTION update_tenant_quota_timestamp();

-- ─── 5. تحديث updated_at في tenants ─────────────────────────────
CREATE OR REPLACE FUNCTION update_tenants_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tenants_updated ON tenants;
CREATE TRIGGER trg_tenants_updated
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_tenants_timestamp();
