# دليل إعداد منصة متين على السيرفر

> **تاريخ التحديث:** مارس 2026 — يغطي جميع الـ migrations حتى نظام الهيكل الأكاديمي

---

## 1. متطلبات السيرفر

| المتطلب | الإصدار الأدنى |
|---|---|
| Node.js | 18.x أو أحدث |
| PostgreSQL | 14.x أو أحدث |
| npm / pnpm | آخر إصدار |
| ذاكرة RAM | 2 GB كحد أدنى |
| مساحة القرص | 10 GB كحد أدنى |

---

## 2. إعداد متغيرات البيئة (.env)

انسخ ملف `.env.example` وأعد تسميته `.env.local`:

```bash
cp .env.example .env.local
```

ثم عدّل القيم التالية:

```env
# ─── قاعدة البيانات (إلزامي) ───────────────────────────────────
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/matin_db"

# ─── الأمان (إلزامي) ───────────────────────────────────────────
JWT_SECRET="ضع هنا 64 حرفاً عشوائياً على الأقل"
# لتوليد JWT_SECRET: openssl rand -base64 64

# ─── عنوان التطبيق (إلزامي) ────────────────────────────────────
NEXT_PUBLIC_APP_URL="https://your-domain.com"
ALLOWED_ORIGINS="https://your-domain.com,https://www.your-domain.com"

# ─── البريد الإلكتروني (مطلوب لإرسال الإيميلات) ───────────────
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxx"
FROM_EMAIL="noreply@your-domain.com"

# ─── الدفع الإلكتروني (اختياري) ────────────────────────────────
MOYASAR_API_KEY="sk_live_xxxxxxxxxxxxxxxxxx"
MOYASAR_PUBLISHABLE_KEY="pk_live_xxxxxxxxxxxxxxxxxx"

# ─── الذكاء الاصطناعي (اختياري) ────────────────────────────────
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxx"

# ─── التخزين السحابي (اختياري) ─────────────────────────────────
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="xxxxxxxxxxxxxxxxxx"
CLOUDINARY_API_SECRET="xxxxxxxxxxxxxxxxxx"

# ─── إشعارات Push (اختياري) ─────────────────────────────────────
VAPID_PUBLIC_KEY="xxxxxxxxxxxxxxxxxx"
VAPID_PRIVATE_KEY="xxxxxxxxxxxxxxxxxx"
```

---

## 3. تثبيت الحزم

```bash
npm install
# أو
pnpm install
```

---

## 4. إعداد قاعدة البيانات

### 4.1 إنشاء قاعدة البيانات

```sql
CREATE DATABASE matin_db;
```

### 4.2 تشغيل ملفات SQL بالترتيب الصحيح

> **تحذير:** شغّل الملفات بالترتيب المحدد أدناه. لا تتخطَّ أي ملف.

```bash
# الطريقة الأسهل — شغّل كل الملفات بأمر واحد:
psql -U postgres -d matin_db -f scripts/schema.sql
psql -U postgres -d matin_db -f scripts/migrate.sql
psql -U postgres -d matin_db -f scripts/migration_v2.sql
psql -U postgres -d matin_db -f scripts/migration_v3.sql
psql -U postgres -d matin_db -f scripts/fix_db_schema.sql
psql -U postgres -d matin_db -f scripts/fix-database.sql
psql -U postgres -d matin_db -f scripts/add-indexes.sql
psql -U postgres -d matin_db -f scripts/migration_tracks.sql
psql -U postgres -d matin_db -f scripts/migration_academic_structure.sql
```

| الترتيب | الملف | الغرض |
|---|---|---|
| 1 | `schema.sql` | إنشاء جميع الجداول الأساسية (50 جدول) |
| 2 | `migrate.sql` | تحديثات المرحلة الأولى |
| 3 | `migration_v2.sql` | تحديثات المرحلة الثانية |
| 4 | `migration_v3.sql` | تحديثات المرحلة الثالثة |
| 5 | `fix_db_schema.sql` | إصلاحات هيكل قاعدة البيانات |
| 6 | `fix-database.sql` | إصلاحات إضافية |
| 7 | `add-indexes.sql` | إضافة الفهارس لتحسين الأداء |
| 8 | `migration_tracks.sql` | إضافة عمود المسار لبنك الأسئلة |
| 9 | `migration_academic_structure.sql` | نظام الهيكل الأكاديمي الكامل (مراحل/صفوف/مواد/مسارات) |

### 4.3 التحقق من نجاح التثبيت

```sql
-- تحقق من عدد الجداول (يجب أن يكون 60+)
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';

-- تحقق من بيانات وزارة التعليم
SELECT COUNT(*) FROM academic_stages;   -- يجب أن يكون 3
SELECT COUNT(*) FROM academic_grades;   -- يجب أن يكون 12
SELECT COUNT(*) FROM academic_subjects; -- يجب أن يكون 60+
SELECT COUNT(*) FROM academic_tracks;   -- يجب أن يكون 7
```

---

## 5. إنشاء حساب مدير المنصة (super_admin)

```sql
-- بعد تشغيل الـ migrations، أنشئ أول مستخدم super_admin
INSERT INTO users (name, email, password_hash, role, is_active)
VALUES (
  'اسم المدير',
  'admin@your-domain.com',
  -- استخدم bcrypt hash لكلمة المرور
  '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'super_admin',
  true
);
```

أو استخدم سكريبت الإنشاء:

```bash
node scripts/create-admin.mjs --email admin@your-domain.com --password YourSecurePassword
```

---

## 6. بناء وتشغيل التطبيق

### للتطوير:
```bash
npm run dev
```

### للإنتاج:
```bash
npm run build
npm run start
```

### مع PM2 (موصى به للإنتاج):
```bash
npm install -g pm2
npm run build
pm2 start npm --name "matin" -- start
pm2 save
pm2 startup
```

---

## 7. هيكل الأدوار في النظام

| الدور | الوصف | الصلاحيات |
|---|---|---|
| `super_admin` | مالك المنصة | كامل الصلاحيات |
| `admin` / `school_owner` | مدير المدرسة | إدارة مدرسته كاملاً |
| `teacher` | المعلم | فصوله وطلابه ومواده |
| `student` | الطالب | بياناته الدراسية |
| `parent` | ولي الأمر | متابعة أبنائه |
| `driver` | السائق | إدارة الرحلات |
| `platform_staff` | موظف الدعم | الدعم الفني |

---

## 8. المسارات الدراسية المدعومة

| المرحلة | المسار |
|---|---|
| الابتدائية (الأول → السادس) | عام |
| المتوسطة (الأول → الثالث) | عام |
| أول ثانوي | مشترك (جميع المسارات) |
| ثاني وثالث ثانوي | المسار العام |
| ثاني وثالث ثانوي | علوم الحاسب والهندسة |
| ثاني وثالث ثانوي | الصحة والحياة |
| ثاني وثالث ثانوي | إدارة الأعمال |
| ثاني وثالث ثانوي | المسار الشرعي |

---

## 9. استيراد بنك الأسئلة بالإكسل

1. حمّل نموذج Excel من: `docs/question_bank_template.xlsx`
2. اذهب إلى: **لوحة التحكم → بنك الأسئلة → استيراد**
3. اختر المرحلة والمسار والصف
4. ارفع ملف Excel
5. راجع الأسئلة قبل الحفظ

---

## 10. استكشاف الأخطاء

### مشكلة: خطأ في الاتصال بقاعدة البيانات
```bash
# تحقق من صحة DATABASE_URL
psql "$DATABASE_URL" -c "SELECT 1;"
```

### مشكلة: خطأ في JWT
```bash
# تأكد أن JWT_SECRET لا يقل عن 32 حرفاً
echo -n "$JWT_SECRET" | wc -c
```

### مشكلة: خطأ في تشغيل migration
```bash
# شغّل migration محدد مع عرض الأخطاء
psql -U postgres -d matin_db -f scripts/migration_academic_structure.sql -v ON_ERROR_STOP=1
```

---

## 11. تحديث المشروع

```bash
git pull origin main
npm install
npm run build
pm2 restart matin
```

إذا كان هناك migrations جديدة، شغّلها بعد `git pull`:
```bash
# تحقق من الملفات الجديدة في scripts/
git diff HEAD~1 HEAD --name-only | grep scripts/
```
