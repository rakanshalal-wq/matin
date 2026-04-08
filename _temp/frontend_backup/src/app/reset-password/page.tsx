'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) setError('رابط إعادة التعيين غير صالح');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
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
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
          <h1 style={{ color: '#EEEEF5', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            تعيين كلمة مرور جديدة
          </h1>
        </div>

        {success ? (
          <div style={{
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✅</div>
            <p style={{ color: '#86efac', fontWeight: 600, margin: 0 }}>تم تعيين كلمة المرور بنجاح!</p>
            <p style={{ color: 'rgba(238,238,245,0.5)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              سيتم تحويلك لصفحة تسجيل الدخول...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ color: 'rgba(238,238,245,0.7)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="8 أحرف على الأقل"
                style={{
                  width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem',
                  color: '#EEEEF5', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ color: 'rgba(238,238,245,0.7)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="أعد كتابة كلمة المرور"
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
              disabled={loading || !token}
              style={{
                width: '100%', padding: '0.875rem', background: '#6C63FF', color: '#fff',
                border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '1rem',
                cursor: (loading || !token) ? 'not-allowed' : 'pointer', opacity: (loading || !token) ? 0.7 : 1
              }}
            >
              {loading ? 'جاري التعيين...' : 'تعيين كلمة المرور'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0A0A0F' }} />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
