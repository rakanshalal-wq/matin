'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    institution_name: '',
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
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 8px 24px rgba(201, 168, 76, 0.25)',
    fontFamily: 'var(--font)',
    marginTop: 24
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

          {step === 1 ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: 'rgba(238, 238, 245, 0.65)', fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block' }}>اسم المؤسسة التعليمية</label>
                <input type="text" value={form.institution_name} onChange={e => setForm({...form, institution_name: e.target.value})} placeholder="مثلاً: مدارس الرواد الأهلية" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: 'rgba(238, 238, 245, 0.65)', fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block' }}>اسم المسؤول</label>
                <input type="text" value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} placeholder="الاسم الكامل" style={inputStyle} />
              </div>
              <button onClick={() => setStep(2)} style={btnStyle}>التالي ←</button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: 'rgba(238, 238, 245, 0.65)', fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block' }}>البريد الإلكتروني</label>
                <input type="email" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} placeholder="name@school.com" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: 'rgba(238, 238, 245, 0.65)', fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block' }}>كلمة المرور</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" style={inputStyle} />
              </div>
              <button onClick={() => setStep(1)} style={{ ...btnStyle, background: 'rgba(255,255,255,0.03)', color: '#EEEEF5', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'none', marginTop: 16 }}>← رجوع</button>
              <button style={btnStyle}>إنشاء الحساب ✓</button>
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
