import Link from 'next/link';

export default function NotFound() {
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
      <div style={{ fontSize: '6rem', fontWeight: 900, color: '#6C63FF', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
        الصفحة غير موجودة
      </h1>
      <p style={{ color: 'rgba(238,238,245,0.5)', maxWidth: 400, margin: 0 }}>
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link
        href="/"
        style={{
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          background: '#6C63FF',
          color: '#fff',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '1rem',
        }}
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
