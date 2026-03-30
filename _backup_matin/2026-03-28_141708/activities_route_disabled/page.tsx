'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function ActivitiesPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#06060E', color: '#EEEEF5' }}
    >
      <div
        className="w-full max-w-2xl rounded-3xl p-8"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(212,168,67,0.18)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
        }}
      >
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl font-black"
          style={{
            color: '#06060E',
            background: 'linear-gradient(135deg, #D4A843, #E8C060)'
          }}
        >
          م
        </div>

        <h1 className="mb-2 text-2xl font-black">صفحة الأنشطة تحت صيانة مؤقتة</h1>

        <p
          className="mb-6 text-sm leading-8"
          style={{ color: 'rgba(238,238,245,0.78)' }}
        >
          تم تعطيل صفحة الأنشطة مؤقتًا لإكمال إصلاح النشر وإرجاع المنصة للعمل بشكل طبيعي.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-2xl px-5 py-3 font-bold"
            style={{
              color: '#06060E',
              background: 'linear-gradient(135deg, #D4A843, #E8C060)'
            }}
          >
            الرجوع إلى لوحة التحكم
          </Link>

          <Link
            href="/"
            className="rounded-2xl px-5 py-3 font-bold"
            style={{
              color: '#EEEEF5',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(212,168,67,0.18)'
            }}
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
