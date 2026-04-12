-- =====================================================
-- إضافة الـ Indexes لتحسين أداء قاعدة البيانات
-- تاريخ: مارس 2026
-- التطبيق: شغّل هذا الملف بصلاحيات postgres (superuser)
--   sudo -u postgres psql -d YOUR_DB_NAME -f scripts/add-indexes.sql
-- =====================================================

-- users table
CREATE INDEX IF NOT EXISTS idx_users_owner_id   ON users(owner_id);
CREATE INDEX IF NOT EXISTS idx_users_role        ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email       ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status      ON users(status);

-- institutions table
CREATE INDEX IF NOT EXISTS idx_institutions_owner_id ON institutions(owner_id);

-- invoices table
CREATE INDEX IF NOT EXISTS idx_invoices_institution_id ON invoices(institution_id);
CREATE INDEX IF NOT EXISTS idx_invoices_student_id     ON invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status         ON invoices(status);

-- certificates table
CREATE INDEX IF NOT EXISTS idx_certificates_institution_id ON certificates(institution_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student_id     ON certificates(student_id);

-- complaints table
CREATE INDEX IF NOT EXISTS idx_complaints_institution_id ON complaints(institution_id);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id        ON complaints(user_id);

-- leaves table
CREATE INDEX IF NOT EXISTS idx_leaves_user_id        ON leaves(user_id);
CREATE INDEX IF NOT EXISTS idx_leaves_institution_id ON leaves(institution_id);

-- salaries table
CREATE INDEX IF NOT EXISTS idx_salaries_user_id        ON salaries(user_id);
CREATE INDEX IF NOT EXISTS idx_salaries_institution_id ON salaries(institution_id);

-- bus_logs table
CREATE INDEX IF NOT EXISTS idx_bus_logs_student_id ON bus_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_bus_logs_route_id   ON bus_logs(route_id);

-- cafeteria_orders table
CREATE INDEX IF NOT EXISTS idx_cafeteria_orders_student_id     ON cafeteria_orders(student_id);
CREATE INDEX IF NOT EXISTS idx_cafeteria_orders_institution_id ON cafeteria_orders(institution_id);

-- coin_transactions table
CREATE INDEX IF NOT EXISTS idx_coin_transactions_student_id     ON coin_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_institution_id ON coin_transactions(institution_id);

-- otp_codes table (مهم: يُستعلم عنه كثيراً ويجب تنظيفه دورياً)
CREATE INDEX IF NOT EXISTS idx_otp_codes_user_id    ON otp_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes(expires_at);

-- =====================================================
-- تنظيف OTP المنتهية الصلاحية (شغّل دورياً أو عبر cron)
-- DELETE FROM otp_codes WHERE expires_at < NOW() - INTERVAL '1 day';
-- =====================================================

SELECT 'تم إنشاء جميع الـ indexes بنجاح' as result;
