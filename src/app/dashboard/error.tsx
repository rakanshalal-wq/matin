'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // يمكن إرسال الخطأ لخدمة monitoring هنا مستقبلاً
    // مثال: Sentry.captureException(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'IBM Plex Sans Arabic, sans-serif',
        direction: 'rtl',
        padding: '40px 20px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        {/* أيقونة الخطأ */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 24,
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <AlertTriangle size={44} color="#EF4444" />
        </div>

        {/* العنوان */}
        <h1
          style={{
            color: 'white',
            fontSize: 22,
            fontWeight: 800,
            margin: '0 0 10px',
          }}
        >
          حدث خطأ غير متوقع
        </h1>

        {/* الوصف */}
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14,
            margin: '0 0 8px',
            lineHeight: 1.7,
          }}
        >
          واجهت الصفحة مشكلة أثناء التحميل. يمكنك المحاولة مجدداً أو العودة للرئيسية.
        </p>

        {/* رسالة الخطأ التقنية (للمطورين) */}
        {error?.message && (
          <div
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: 10,
              padding: '10px 16px',
              margin: '16px 0 24px',
              textAlign: 'right',
            }}
          >
            <p
              style={{
                color: 'rgba(239,68,68,0.8)',
                fontSize: 12,
                fontFamily: 'monospace',
                margin: 0,
                wordBreak: 'break-word',
                direction: 'ltr',
                textAlign: 'left',
              }}
            >
              {error.message}
            </p>
          </div>
        )}

        {/* الأزرار */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #C9A227, #E8C547)',
              color: '#06060E',
              border: 'none',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'IBM Plex Sans Arabic, sans-serif',
            }}
          >
            <RefreshCw size={16} />
            إعادة المحاولة
          </button>

          <a
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'IBM Plex Sans Arabic, sans-serif',
            }}
          >
            <Home size={16} />
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
