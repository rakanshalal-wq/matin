'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function JoinSchoolPage() {
  const params = useParams();
  const router = useRouter();
  const schoolCode = params?.code as string;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    national_id: '',
    employee_id: '',
    student_id: '',
    grade: '',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setError('يرجى ملء الاسم والبريد الإلكتروني');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/school-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, school_code: schoolCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'فشل التسجيل'); return; }
      setSuccess(data.message);
      setStep(3);
    } catch { setError('خطأ في الاتصال'); }
    finally { setLoading(false); }
  };

  const roles = [
    { value: 'teacher', label: 'معلم / معلمة', icon: '👨‍🏫', desc: 'التسجيل كمعلم في هذه المدرسة' },
    { value: 'student', label: 'طالب / طالبة', icon: '🎓', desc: 'التسجيل كطالب في هذه المدرسة' },
    { value: 'parent', label: 'ولي أمر', icon: '👨‍👩‍👧', desc: 'التسجيل كولي أمر لمتابعة أبنائك' },
  ];

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px', padding: '12px 14px', color: 'white', fontSize: '14px', boxSizing: 'border-box' as const,
  };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '6px', display: 'block' };

  return (
    <div style={{ minHeight: '100vh', background: '#06060E', fontFamily: 'IBM Plex Sans Arabic, Arial, sans-serif', direction: 'rtl', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '20px' }}>
          <div style={{ color: '#C9A227', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>متين</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>الانضمام للمدرسة</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: '16px', padding: '32px' }}>

          {step === 1 && (
            <>
              <div style={{ color: '#C9A227', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>كيف تريد الانضمام؟</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {roles.map(r => (
                  <div key={r.value} onClick={() => { setForm({ ...form, role: r.value }); setStep(2); }}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A227'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                    <div style={{ fontSize: '36px' }}>{r.icon}</div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>{r.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ color: '#C9A227', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>
                تسجيل {form.role === 'teacher' ? 'معلم' : form.role === 'student' ? 'طالب' : 'ولي أمر'} جديد
              </div>
              {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', color: '#FCA5A5', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>الاسم الكامل *</label>
                  <input style={inputStyle} name="name" value={form.name} onChange={handleChange} placeholder="أدخل اسمك الكامل" />
                </div>
                <div>
                  <label style={labelStyle}>البريد الإلكتروني *</label>
                  <input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com" />
                </div>

                <div>
                  <label style={labelStyle}>رقم الجوال</label>
                  <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} placeholder="05XXXXXXXX" />
                </div>
                <div>
                  <label style={labelStyle}>رقم الهوية</label>
                  <input style={inputStyle} name="national_id" value={form.national_id} onChange={handleChange} placeholder="رقم الهوية الوطنية" />
                </div>
                {form.role === 'teacher' && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>الرقم الوظيفي (اختياري)</label>
                    <input style={inputStyle} name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="سيتم إنشاؤه تلقائياً إذا تُرك فارغاً" />
                  </div>
                )}
                {form.role === 'student' && (
                  <>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>الصف الدراسي *</label>
                    <select style={{...inputStyle, appearance: 'auto'}} name="grade" value={form.grade} onChange={handleChange}>
                      <option value="">-- اختر الصف --</option>
                      <option value="1">الصف الأول</option><option value="2">الصف الثاني</option><option value="3">الصف الثالث</option>
                      <option value="4">الصف الرابع</option><option value="5">الصف الخامس</option><option value="6">الصف السادس</option>
                      <option value="7">الصف الأول متوسط</option><option value="8">الصف الثاني متوسط</option><option value="9">الصف الثالث متوسط</option>
                      <option value="10">الصف الأول ثانوي</option><option value="11">الصف الثاني ثانوي</option><option value="12">الصف الثالث ثانوي</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>الرقم الأكاديمي (اختياري)</label>
                    <input style={inputStyle} name="student_id" value={form.student_id} onChange={handleChange} placeholder="سيتم إنشاؤه تلقائياً إذا تُرك فارغاً" />
                  </div>
                  </>
                )}
              </div>
              <button onClick={handleSubmit} disabled={loading}
                style={{ background: '#C9A227', color: '#06060E', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: '20px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'جاري التسجيل...' : 'تسجيل ✓'}
              </button>
              <button onClick={() => setStep(1)}
                style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', cursor: 'pointer', marginTop: '12px', width: '100%' }}>
                ← رجوع
              </button>
            </>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
              <div style={{ color: '#10B981', fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>تم التسجيل بنجاح!</div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.8', marginBottom: '24px' }}>{success}</p>
              <div style={{ background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ color: '#C9A227', fontWeight: 700, marginBottom: '4px' }}>ملاحظة</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>حسابك بانتظار موافقة إدارة المدرسة. ستتمكن من تسجيل الدخول بعد التفعيل.</div>
              </div>
              <button onClick={() => router.push('/login')}
                style={{ background: '#C9A227', color: '#06060E', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                الذهاب لتسجيل الدخول
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '20px' }}>
          <a href={`/school/${schoolCode}`} style={{ color: '#C9A227', textDecoration: 'none' }}>← العودة لصفحة المدرسة</a>
        </p>
      </div>
    </div>
  );
}
