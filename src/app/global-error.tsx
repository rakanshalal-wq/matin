'use client';
export const dynamic = 'force-dynamic';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, background: '#0a0a0a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Cairo, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <h2 style={{ color: '#D4A843', fontSize: 24, fontWeight: 800, marginBottom: 16 }}>حدث خطأ</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>{error?.message || 'خطأ غير متوقع'}</p>
          <button
            onClick={reset}
            style={{ background: 'linear-gradient(135deg, #D4A843, #C9A227)', color: '#000', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            حاول مجدداً
          </button>
        </div>
      </body>
    </html>
  );
}
