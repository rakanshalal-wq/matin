'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // يمكن إرسال الخطأ لخدمة monitoring هنا
  }, [error]);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0F',
        color: '#EEEEF5',
        fontFamily: 'Tajawal, sans-serif',
        gap: '1.5rem',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ fontSize: '4rem' }}>⚠️</div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
        حدث خطأ غير متوقع
      </h1>
      <p style={{ color: 'rgba(238,238,245,0.5)', maxWidth: 400, margin: 0 }}>
        نعتذر عن هذا الخطأ. يمكنك المحاولة مجدداً أو العودة للصفحة الرئيسية.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 2rem',
            background: '#6C63FF',
            color: '#fff',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          حاول مجدداً
        </button>
        <a
          href="/"
          style={{
            padding: '0.75rem 2rem',
            background: 'rgba(255,255,255,0.08)',
            color: '#EEEEF5',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          الرئيسية
        </a>
      </div>
    </div>
  );
}
