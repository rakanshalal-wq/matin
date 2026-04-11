import { Search, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardNotFound() {
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
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        {/* رقم 404 */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #D4A843, #E8C547)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          404
        </div>

        {/* أيقونة */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'rgba(201,162,39,0.1)',
            border: '1px solid rgba(201,162,39,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <Search size={36} color="#D4A843" />
        </div>

        <h1
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 800,
            margin: '0 0 10px',
          }}
        >
          الصفحة غير موجودة
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14,
            margin: '0 0 28px',
            lineHeight: 1.7,
          }}
        >
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #D4A843, #E8C547)',
              color: '#06060E',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <Home size={16} />
            الرئيسية
          </Link>

          <button
            onClick={() => window.history.back()}
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
              fontFamily: 'IBM Plex Sans Arabic, sans-serif',
            }}
          >
            <ArrowRight size={16} />
            رجوع
          </button>
        </div>
      </div>
    </div>
  );
}
