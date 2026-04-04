'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [step, setStep] = useState<'credentials' | 'otp' | 'change_password'>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [loggedToken, setLoggedToken] = useState('');

  const ROLES_PATHS: Record<string, string> = {
    super_admin: '/owner',
    owner: '/school-dashboard',
    admin: '/dashboard/admin',
    school_owner: '/dashboard/admin',
    university_owner: '/dashboard/admin',
    institute_owner: '/dashboard/admin',
    kindergarten_owner: '/dashboard/admin',
    training_owner: '/dashboard/admin',
    teacher: '/dashboard/teacher',
    student: '/dashboard/student',
    parent: '/dashboard/parent',
    driver: '/dashboard/driver',
    platform_staff: '/dashboard/support',
  };

  const completeLogin = (user: any, token: string) => {
    localStorage.setItem('matin_user', JSON.stringify(user));
    if (token) localStorage.setItem('matin_token', token);
    const path = ROLES_PATHS[user.role] || '/dashboard';
    router.push(path);
  };

  const checkAndRedirect = (data: any) => {
    if (data.user?.must_change_password) {
      setLoggedUser(data.user);
      setLoggedToken(data.token || '');
      setStep('change_password');
      setLoading(false);
      return;
    }
    completeLogin(data.user, data.token);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('ادخل الإيميل وكلمة المرور'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message || 'فشل تسجيل الدخول'); setLoading(false); return; }

      if (data.requireOTP) {
        setUserId(data.userId);
        setStep('otp');
        setLoading(false);
        return;
      }

      checkAndRedirect(data);
    } catch { setError('خطأ بالاتصال بالسيرفر'); setLoading(false); }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) { setError('ادخل رمز التحقق'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code })
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.message || 'رمز التحقق غير صحيح'); setLoading(false); return; }

      checkAndRedirect(data);
    } catch { setError('خطأ بالاتصال بالسيرفر'); setLoading(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    if (newPassword !== confirmPassword) { setError('كلمات المرور غير متطابقة'); return; }
    setLoading(true);
    setError('');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (loggedToken) headers['Authorization'] = 'Bearer ' + loggedToken;

      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.error || 'فشل تغيير كلمة المرور'); setLoading(false); return; }

      loggedUser.must_change_password = false;
      completeLogin(loggedUser, loggedToken);
    } catch { setError('خطأ بالاتصال بالسيرفر'); setLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12,
    padding: '14px 18px', color: 'white', fontSize: 15, outline: 'none',
    transition: 'all 0.3s', boxSizing: 'border-box' as const
  };

  return (
    <div style={{ minHeight: '100vh', background: '#06060E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl', padding: 20 }}>
      <div style={{ position: 'fixed', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -200, left: -200, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'inline-block' }}>
            <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #C9A84C 0%, #E2C46A 100%)', borderRadius: 20, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(201,168,76,0.35)', fontSize: 32, fontWeight: 900, color: '#000' }}>م</div>
            <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, #C9A84C 0%, #E2C46A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4, letterSpacing: 1 }}>متين</div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
            {step === 'credentials' ? 'تسجيل الدخول إلى لوحة التحكم' : step === 'otp' ? 'أدخل رمز التحقق المرسل لإيميلك' : 'يجب تغيير كلمة المرور المؤقتة'}
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 20, padding: '40px 32px', backdropFilter: 'blur(20px)', boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.05)' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <span style={{ color: '#EF4444', fontSize: 14, fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>📧 البريد الإلكتروني</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" style={inputStyle} dir="ltr" />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>🔒 كلمة المرور</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} dir="ltr" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #C9A84C 0%, #E2C46A 100%)', color: '#000', border: 'none', borderRadius: 12, padding: '16px', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', fontFamily: 'IBM Plex Sans Arabic, sans-serif', boxShadow: loading ? 'none' : '0 4px 20px rgba(201,168,76,0.3)' }}>
                {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </button>
            </form>
          ) : step === 'otp' ? (
            <form onSubmit={handleVerifyOTP}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 48 }}>📬</div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 8 }}>تم إرسال رمز مكون من 6 أرقام إلى</p>
                <p style={{ color: '#C9A227', fontWeight: 700, fontSize: 15 }}>{email}</p>
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>🔑 رمز التحقق</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="000000" maxLength={6} style={{ ...inputStyle, fontSize: 32, fontWeight: 900, textAlign: 'center', letterSpacing: 12 }} dir="ltr" />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? 'rgba(201,162,39,0.5)' : 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: '16px', fontSize: 17, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                {loading ? '⏳ جاري التحقق...' : '🚀 تأكيد الدخول'}
              </button>
              <button type="button" onClick={() => { setStep('credentials'); setCode(''); setError(''); }} style={{ width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', marginTop: 16, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                ← تغيير الإيميل
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 48 }}>🔐</div>
                <h3 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginTop: 12 }}>تغيير كلمة المرور</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 8 }}>هذا أول تسجيل دخول لك — يرجى إنشاء كلمة مرور جديدة خاصة بك</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>🔒 كلمة المرور الجديدة</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="6 أحرف على الأقل" style={inputStyle} dir="ltr" />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'block' }}>🔒 تأكيد كلمة المرور</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="أعد كتابة كلمة المرور" style={inputStyle} dir="ltr" />
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '8px 12px', marginBottom: 16, textAlign: 'center' }}>
                  <span style={{ color: '#EF4444', fontSize: 13 }}>❌ كلمات المرور غير متطابقة</span>
                </div>
              )}
              {newPassword && confirmPassword && newPassword === confirmPassword && (
                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '8px 12px', marginBottom: 16, textAlign: 'center' }}>
                  <span style={{ color: '#22C55E', fontSize: 13 }}>✅ كلمات المرور متطابقة</span>
                </div>
              )}
              <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? 'rgba(201,162,39,0.5)' : 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: '16px', fontSize: 17, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                {loading ? '⏳ جاري الحفظ...' : '🔐 تغيير كلمة المرور والدخول'}
              </button>
            </form>
          )}

          {step === 'credentials' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', margin: '28px 0', gap: 16 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>أو</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 12 }}>ما عندك حساب؟</p>
                <button onClick={() => router.push('/register')} style={{ width: '100%', background: 'rgba(201,162,39,0.08)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                  🏫 سجّل مدرستك الآن
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>مطوّر بواسطة </span>
          <span style={{ color: '#C9A227', fontSize: 13, fontWeight: 700 }}>متين</span>
        </div>
      </div>
    </div>
  );
}
