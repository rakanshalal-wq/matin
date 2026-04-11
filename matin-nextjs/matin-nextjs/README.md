# متين — Next.js 15

مشروع Next.js 15 كامل لمنصة **متين** التعليمية، يتضمن ثلاث صفحات رئيسية محوّلة من HTML إلى مكونات React/TypeScript.

## الصفحات

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| الصفحة الرئيسية | `/` | Landing page كاملة مع Navbar، Hero، مؤسسات، مميزات، أسعار، وفوتر |
| لوحة التحكم | `/dashboard` | داشبورد مالك المنصة مع Sidebar، إحصائيات، جدول المؤسسات |
| محرر الواجهة | `/dashboard/theme-editor` | محرر مباشر للصفحة الرئيسية مع معاينة حية |

## هيكل المشروع

```
src/
├── app/
│   ├── layout.tsx              # Layout رئيسي
│   ├── globals.css             # CSS عالمي + Tailwind
│   ├── page.tsx                # الصفحة الرئيسية
│   └── dashboard/
│       ├── layout.tsx
│       ├── page.tsx            # لوحة التحكم
│       └── theme-editor/
│           └── page.tsx        # محرر الواجهة
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── InstitutionsSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── RolesSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── CTASection.tsx
│   │   └── Footer.tsx
│   └── dashboard/
│       ├── Sidebar.tsx
│       ├── DashboardHeader.tsx
│       ├── StatCards.tsx
│       ├── InstitutionsTable.tsx
│       └── QuickActions.tsx
└── lib/
    └── utils.ts
```

## التشغيل

```bash
npm install
npm run dev
```

## التقنيات

- **Next.js 15** + React 19
- **TypeScript**
- **Tailwind CSS 3**
- **Lucide React** (أيقونات)
- **خط Cairo** (Google Fonts)

## الألوان الأساسية

| المتغير | القيمة |
|---------|--------|
| `gold` | `#D4A843` |
| `bg` | `#06060E` |
| `txt` | `#EEEEF5` |
