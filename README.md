# 🎓 منصة متين - Matin Platform

منصة سعودية متكاملة لإدارة المؤسسات التعليمية. نظام SaaS يمنح كل مؤسسة نطاق فرعي خاص ولوحة تحكم كاملة.

## 📋 نظرة عامة

**متين** = **سلة + زد** (لكن للتعليم)

- 🏫 **الفكرة:** منصة SaaS تعليمية متكاملة
- 🌍 **النموذج:** كل مؤسسة تحصل على نطاق فرعي (school1.matin.ink)
- 👥 **المستخدمون:** 11 دور (مالك، مدير، معلم، طالب، ولي أمر، مدرب، محفظ، إلخ)
- 💰 **الربح:** اشتراكات شهرية (مجاني / 299 ر.س / 599 ر.س)

## 🚀 التقنيات المستخدمة

- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL
- **Auth:** JWT
- **Payment:** Stripe
- **Email:** Resend
- **AI:** OpenAI + Claude

## 📁 هيكل المشروع

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # صفحات المصادقة
│   ├── api/                      # API Routes (192 endpoint)
│   ├── dashboard/                # لوحات التحكم (150+ صفحة)
│   ├── institution/[slug]/       # صفحات المؤسسات العامة
│   └── page.tsx                  # الصفحة الرئيسية
├── components/
│   ├── institution-templates/    # قوالب المؤسسات (6 قوالب)
│   └── ui/                       # مكونات الواجهة
├── lib/                          # المكتبات والأدوات
│   ├── auth.ts                   # المصادقة والأدوار
│   ├── db.ts                     # قاعدة البيانات
│   ├── email.ts                  # البريد الإلكتروني
│   └── stripe.ts                 # الدفع
└── middleware.ts                 # التوجيه والأمان
```

## 🎯 المميزات الرئيسية

### ✅ المنجز (75%)
- [x] نظام النطاقات الفرعية (Subdomains)
- [x] 11 دور مستخدم
- [x] 150+ صفحة داشبورد
- [x] 192 API endpoint
- [x] نظام الدفع (Stripe)
- [x] البريد الإلكتروني (Resend)
- [x] 213 جدول في قاعدة البيانات

### 🔄 قيد التطوير (25%)
- [ ] قوالب المؤسسات الـ 6
- [ ] تخصيص الألوان للمؤسسات
- [ ] ربط البريد بالعمليات
- [ ] اختبار شامل

## 🛠️ التشغيل المحلي

```bash
# 1. استنساخ المشروع
git clone https://github.com/rakanshalal-wq/matin.git
cd matin

# 2. تثبيت الاعتماديات
npm install

# 3. إعداد المتغيرات البيئية
cp .env.example .env.local
# عدل .env.local ببياناتك

# 4. تشغيل قاعدة البيانات
# تأكد من وجود PostgreSQL

# 5. تشغيل التطبيق
npm run dev
```

## 📊 متغيرات البيئة (.env.local)

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/matin_db

# JWT
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...

# AI
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## 👥 الأدوار والصلاحيات

| الدور | المستوى | الوصف |
|-------|---------|-------|
| super_admin | 6 | مالك المنصة |
| owner | 5 | مالك المؤسسة |
| admin | 4 | مدير المدرسة |
| teacher | 3 | معلم |
| parent | 2 | ولي أمر |
| student | 1 | طالب |
| trainer | 3 | مدرب |
| trainee | 1 | متدرب |
| muhaffiz | 3 | محفظ قرآن |
| supervisor | 4 | مشرف تحفيظ |
| caregiver | 3 | مربية |

## 💳 خطط الاشتراك

| الباقة | السعر | المميزات |
|--------|-------|----------|
| **مجاني** | 0 ر.س | 100 طالب، 5 معلمين، مميزات أساسية |
| **متقدم** | 299 ر.س/شهر | 500 طالب، دعم 24/7، تقارير متقدمة |
| **مؤسسي** | 599 ر.س/شهر | غير محدود، VIP، تخصيص كامل |

## 📞 التواصل

- **المطور:** ركان شلال
- **البريد:** rakanshalal@gmail.com
- **الموقع:** https://matin.ink

## 📄 الترخيص

جميع الحقوق محفوظة © 2026 منصة متين
