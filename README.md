# منصة متين التعليمية — Matin Platform

نظام إدارة مدارس متكامل مبني على Next.js 15 + PostgreSQL

---

## المتطلبات

- Node.js 18+
- PostgreSQL 14+
- npm أو yarn

---

## التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone https://github.com/rakanshalal-wq/matin.git
cd matin
```

### 2. تثبيت الحزم

```bash
npm install
```

### 3. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
psql -U postgres -c "CREATE DATABASE matin_db;"
psql -U postgres -c "CREATE USER matin WITH PASSWORD 'your_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE matin_db TO matin;"

# تشغيل الـ schema
psql -U matin -d matin_db -f scripts/schema.sql

# إضافة البيانات الأولية (super_admin)
psql -U matin -d matin_db -f scripts/seed.sql
```

### 4. إعداد ملف البيئة

```bash
cp .env.example .env.local
```

عدّل `.env.local`:

```env
DATABASE_URL=postgresql://matin:your_password@localhost:5432/matin_db
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=your_jwt_secret_here
```

### 5. تشغيل المشروع

```bash
# وضع التطوير
npm run dev

# بناء للإنتاج
npm run build
npm start
```

---

## بيانات الدخول الافتراضية

| الدور | الإيميل | كلمة المرور |
|-------|---------|-------------|
| مالك المنصة (Super Admin) | admin@matin.ink | Admin@2026 |

> **تنبيه:** غيّر كلمة المرور فور الدخول الأول

---

## الأدوار والصلاحيات

| الدور | الوصول |
|-------|--------|
| `super_admin` | السلطة المطلقة على المنصة كاملة |
| `owner` | مالك المؤسسة — إدارة كاملة للمؤسسة |
| `admin` | مدير المؤسسة — إدارة يومية |
| `teacher` | المعلم — الفصول والدرجات والحضور |
| `student` | الطالب — عرض الدرجات والاختبارات |
| `parent` | ولي الأمر — متابعة أبنائه |
| `employee` | موظف — حسب الصلاحيات المعطاة |

---

## هيكل المشروع

```
src/
├── app/
│   ├── api/           # API Routes (100+ endpoint)
│   ├── dashboard/     # لوحات التحكم لكل الأدوار
│   ├── owner/         # لوحة مالك المنصة
│   └── login/         # صفحة تسجيل الدخول
├── components/
│   ├── Sidebar.tsx    # الشريط الجانبي الموحد
│   └── ui-icons.tsx   # نظام الأيقونات
└── lib/
    ├── auth.ts        # المصادقة وإدارة الجلسات
    └── integrations.ts # التكاملات الخارجية
scripts/
├── schema.sql         # هيكل قاعدة البيانات الكامل
└── seed.sql           # البيانات الأولية
```

---

## النشر على السيرفر (Production)

### باستخدام PM2

```bash
npm install -g pm2
npm run build
pm2 start npm --name "matin" -- start
pm2 save
pm2 startup
```

### باستخدام Docker

```bash
docker build -t matin-platform .
docker run -d -p 3000:3000 --env-file .env.local matin-platform
```

### Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## الميزات الرئيسية

- **إدارة المؤسسات** — مدارس، معاهد، روضات، جامعات
- **إدارة الطلاب والمعلمين** — تسجيل، ملفات، صلاحيات
- **الحضور والغياب** — يومي مع إشعارات لأولياء الأمور
- **الدرجات والتقارير** — كشوف درجات، تحليلات
- **الاختبارات الإلكترونية** — بنك أسئلة، حراسة إلكترونية
- **الجدول الدراسي** — توليد تلقائي
- **المالية** — رسوم، فواتير، تقارير مالية
- **الإشعارات** — SMS، WhatsApp، Email، Push
- **التكاملات** — Moyasar، HyperPay، نفاذ، Google Maps
- **الذكاء الاصطناعي** — AI Auditor لرصد الشذوذات
- **الباقات** — مجانية، أساسية، احترافية، ذهبية، حكومية

---

## الدعم الفني

للتواصل: admin@matin.ink
