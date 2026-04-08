'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || 'حدث خطأ، حاول مجدداً');
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0F', fontFamily: 'Tajawal, sans-serif', padding: '1rem'
    }}>
      <div style={{
        background: '#13131A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem',
        padding: '2.5rem', width: '100%', maxWidth: '420px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔑</div>
          <h1 style={{ color: '#EEEEF5', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            نسيت كلمة المرور؟
          </h1>
          <p style={{ color: 'rgba(238,238,245,0.5)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
          </p>
        </div>

        {sent ? (
          <div style={{
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✅</div>
            <p style={{ color: '#86efac', fontWeight: 600, margin: 0 }}>تم الإرسال!</p>
            <p style={{ color: 'rgba(238,238,245,0.5)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              إذا كان البريد مسجلاً، ستصل رسالة إعادة التعيين خلال دقائق. تحقق من مجلد الـ Spam.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ color: 'rgba(238,238,245,0.7)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="example@school.com"
                style={{
                  width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem',
                  color: '#EEEEF5', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.875rem', background: '#6C63FF', color: '#fff',
                border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/login" style={{ color: '#6C63FF', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
