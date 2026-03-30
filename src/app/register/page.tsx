'use client';
export const dynamic = 'force-dynamic';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    institution_name: '',
    institution_type: 'school',
    city: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    password: '',
    confirm_password: '',
    plan: 'basic'
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    color: '#EEEEF5',
    fontSize: 15,
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'var(--font)'
  };

  const btnStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--gold)',
    color: '#000',
    border: 'none',
    borderRadius: 12,
    padding: '16px',
    fontSize: 16,
    fontWeight: 800,
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 8px 24px rgba(201, 168, 76, 0.25)',
    fontFamily: 'var(--font)',
    marginTop: 24,
    opacity: loading ? 0.7 : 1
  };

  const labelStyle: React.CSSProperties = {
    color: 'rgba(238, 238, 245, 0.65)',
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
    display: 'block'
  };

  const handleNext = () => {
    if (!form.institution_name.trim()) { setError('اسم المؤسسة مطلوب'); return; }
    if (!form.contact_name.trim()) { setError('اسم المسؤول مطلوب'); return; }
    if (!form.contact_phone.trim()) { setError('رقم الجوال مطلوب'); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.contact_email.trim()) { setError('البريد الإلكتروني مطلوب'); return; }
    if (!form.password) { setError('كلمة المرور مطلوبة'); return; }
    if (form.password.length < 8) { setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return; }
    if (form.password !== form.confirm_password) { setError('كلمتا المرور غير متطابقتين'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution_name: form.institution_name.trim(),
          institution_type: form.institution_type,
          city: form.city.trim() || undefined,
          contact_name: form.contact_name.trim(),
          contact_phone: form.contact_phone.trim(),
          contact_email: form.contact_email.trim().toLowerCase(),
          password: form.password,
          plan: form.plan,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'حدث خطأ أثناء التسجيل'); return; }
      setSuccess('تم إنشاء حسابك بنجاح! جاري توجيهك...');
      setTimeout(() => router.push('/login?registered=1'), 2000);
    } catch {
      setError('تعذّر الاتصال بالخادم، يرجى المحاولة مجدداً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#06060E', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
      direction: 'rtl',
      fontFamily: 'var(--font)'
    }}>
      {/* Background Effects */}
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '40%', background: 'radial-gradient(ellipse, rgba(201, 168, 76, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")', pointerEvents: 'none', opacity: 0.4 }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #C9A84C 0%, #E2C46A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#000', boxShadow: '0 8px 24px rgba(201, 168, 76, 0.3)' }}>م</div>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#EEEEF5', letterSpacing: -1 }}>متين</span>
          </Link>
        </div>

        <div style={{ background: '#0B0B16', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 24, padding: '40px 32px', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ color: '#EEEEF5', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>ابدأ رحلتك مع متين</h2>
            <p style={{ color: 'rgba(238, 238, 245, 0.35)', fontSize: 14, fontWeight: 500 }}>انضم لأكثر من 500 مؤسسة تعليمية في المملكة</p>
          </div>

          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= s ? '#C9A84C' : 'rgba(255,255,255,0.06)', border: `2px solid ${step >= s ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step >= s ? '#000' : 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 800, transition: 'all 0.3s' }}>{s}</div>
                {s < 2 && <div style={{ width: 40, height: 2, background: step > s ? '#C9A84C' : 'rgba(255,255,255,0.08)', borderRadius: 1, transition: 'all 0.3s' }} />}
              </div>
            ))}
          </div>

          {/* Error / Success */}
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#FCA5A5', fontSize: 14, fontWeight: 600 }}>{error}</div>}
          {success && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#86EFAC', fontSize: 14, fontWeight: 600 }}>{success}</div>}

          {step === 1 ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>اسم المؤسسة التعليمية *</label>
                <input type="text" value={form.institution_name} onChange={e => setForm({...form, institution_name: e.target.value})} placeholder="مثلاً: مدارس الرواد الأهلية" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>نوع المؤسسة</label>
                <select value={form.institution_type} onChange={e => setForm({...form, institution_type: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="school">مدرسة</option>
                  <option value="university">جامعة</option>
                  <option value="institute">معهد</option>
                  <option value="kindergarten">روضة أطفال</option>
                  <option value="training_center">مركز تدريب</option>
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>اسم المسؤول *</label>
                <input type="text" value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} placeholder="الاسم الكامل" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>رقم الجوال *</label>
                <input type="tel" value={form.contact_phone} onChange={e => setForm({...form, contact_phone: e.target.value})} placeholder="05xxxxxxxx" style={inputStyle} dir="ltr" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>المدينة</label>
                <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="الرياض، جدة، الدمام..." style={inputStyle} />
              </div>
              <button onClick={handleNext} style={btnStyle}>التالي ←</button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>البريد الإلكتروني *</label>
                <input type="email" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} placeholder="name@school.com" style={inputStyle} dir="ltr" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>كلمة المرور * (8 أحرف على الأقل)</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" style={inputStyle} dir="ltr" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>تأكيد كلمة المرور *</label>
                <input type="password" value={form.confirm_password} onChange={e => setForm({...form, confirm_password: e.target.value})} placeholder="••••••••" style={inputStyle} dir="ltr" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>الباقة</label>
                <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="free">مجانية</option>
                  <option value="basic">أساسية</option>
                  <option value="pro">احترافية</option>
                  <option value="enterprise">مؤسسية</option>
                </select>
              </div>
              <button onClick={handleSubmit} disabled={loading} style={btnStyle}>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب ✓'}</button>
              <button onClick={() => { setStep(1); setError(''); }} style={{ ...btnStyle, background: 'rgba(255,255,255,0.03)', color: '#EEEEF5', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'none', marginTop: 12 }}>← رجوع</button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ color: 'rgba(238, 238, 245, 0.35)', fontSize: 14, fontWeight: 500 }}>
              لديك حساب بالفعل؟ <Link href="/login" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 700 }}>تسجيل الدخول</Link>
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ color: 'rgba(238, 238, 245, 0.2)', fontSize: 12, fontWeight: 500 }}>
            © 2026 منصة متين. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}
