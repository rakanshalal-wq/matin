-- ═══════════════════════════════════════════════════════════════════
-- Migration: إضافة أعمدة Offboarding لجدول tenants
-- تشغيل: psql -U matin_user -d matin_db -f scripts/migration_offboarding.sql
-- ═══════════════════════════════════════════════════════════════════

-- عمود تاريخ بدء فترة السماح (يُعيَّن عند إلغاء الاشتراك)
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS offboard_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- عمود تأكيد إرسال التنبيه الأول (قبل الحذف بـ 7 أيام)
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS offboard_notified BOOLEAN DEFAULT false;

-- عمود تسجيل رابط تصدير البيانات بعد طلب التصدير
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS data_export_url TEXT DEFAULT NULL;

-- تحديث قيد status ليشمل حالة الانتظار قبل الحذف
ALTER TABLE tenants
  DROP CONSTRAINT IF EXISTS tenants_status_check;
ALTER TABLE tenants
  ADD CONSTRAINT tenants_status_check
    CHECK (status IN ('active', 'suspended', 'pending', 'offboarding'));

-- فهرس للبحث السريع عن المؤسسات في فترة الانتظار
CREATE INDEX IF NOT EXISTS idx_tenants_offboard_at
  ON tenants (offboard_at)
  WHERE offboard_at IS NOT NULL;
