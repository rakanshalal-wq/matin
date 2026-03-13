'use client';
import Link from 'next/link';
import { useState } from 'react';

const INSTITUTION_TYPES = [
  { id: 'school', label: 'مدرسة', icon: '🏫' },
  { id: 'university', label: 'جامعة أو كلية', icon: '🎓' },
  { id: 'institute', label: 'معهد أو أكاديمية', icon: '📚' },
  { id: 'kindergarten', label: 'روضة أطفال', icon: '🌱' },
  { id: 'training', label: 'مركز تدريب', icon: '💼' },
];

const STUDENT_RANGES = [
  { id: 'small', label: 'أقل من 200 طالب' },
  { id: 'medium', label: '200 – 1000 طالب' },
  { id: 'large', label: '1000 – 5000 طالب' },
  { id: 'enterprise', label: 'أكثر من 5000 طالب' },
];

const INTERESTS = [
  'الحضور والغياب', 'الاختبارات الإلكترونية', 'التعليم الإلكتروني',
  'النقل المدرسي', 'الإدارة المالية', 'الصحة المدرسية',
  'المساعد الذكي AI', 'تكامل واتساب', 'تكامل نفاذ ونور',
  'تطبيق الجوال', 'الكافتيريا', 'المكتبة الرقمية',
];

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', institution: '', role: '',
    type: '', students: '', interests: [] as string[],
    preferred_time: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleInterest = (item: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(item)
        ? f.interests.filter(i => i !== item)
        : [...f.interests, item],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          institution_name: form.institution,
          role: form.role,
          institution_type: form.type,
          student_count: form.students,
          interests: form.interests.join(', '),
          notes: `الوقت المفضل: ${form.preferred_time}\n${form.notes}`,
          source: 'demo_request',
          status: 'new',
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const navLinkStyle: React.CSSProperties = {
    color: 'rgba(238,238,245,0.65)', textDecoration: 'none', fontSize: 14, fontWeight: 500,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl' }}>

        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 40, background: 'rgba(6,6,14,0.92)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#EEEEF5', fontSize: 19, fontWeight: 800 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#C9A84C,#E2C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#000' }}>م</div>
            متين
          </Link>
          <div style={{ display: 'flex', gap: 28, flex: 1 }}>
            <Link href="/features" style={navLinkStyle}>المميزات</Link>
            <Link href="/pricing" style={navLinkStyle}>الأسعار</Link>
            <Link href="/about" style={navLinkStyle}>عن متين</Link>
            <Link href="/contact" style={navLinkStyle}>تواصل معنا</Link>
          </div>
          <div style={{ display: 'flex', gap: 8, marginRight: 'auto' }}>
            <Link href="/login" style={{ padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(238,238,245,0.65)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>تسجيل الدخول</Link>
            <Link href="/register" style={{ padding: '8px 20px', borderRadius: 9, background: '#C9A84C', color: '#000', fontSize: 13.5, fontWeight: 700, textDecoration: 'none' }}>ابدأ مجاناً</Link>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: '100px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 100%)' }} />
          <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C', padding: '6px 16px', borderRadius: 100, fontSize: 12.5, fontWeight: 600, marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C9A84C', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              عرض تجريبي مجاني
            </div>
            <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, margin: 0 }}>
              شاهد متين بنفسك
              <span style={{ display: 'block', background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>في عرض مخصص لمؤسستك</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(238,238,245,0.65)', maxWidth: 560, margin: '20px auto 0', lineHeight: 1.8 }}>
              خبير متين يُريك كيف تحل المنصة تحديات مؤسستك تحديداً — عرض مباشر، أسئلة وأجوبة، وخطة تطبيق واضحة.
            </p>
          </div>
        </section>

        {/* TRUST BADGES */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, padding: '0 24px 48px', flexWrap: 'wrap' }}>
          {[
            { icon: '⏱', text: '30 دقيقة فقط' },
            { icon: '🎯', text: 'مخصص لمؤسستك' },
            { icon: '💬', text: 'أسئلة مفتوحة' },
            { icon: '🆓', text: 'مجاني تماماً' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(238,238,245,0.55)', fontSize: 14 }}>
              <span style={{ fontSize: 20 }}>{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>

        {/* FORM */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          {submitted ? (
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 24, padding: '64px 48px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 24 }}>✅</div>
              <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 16px' }}>تم استلام طلبك!</h2>
              <p style={{ fontSize: 16, color: 'rgba(238,238,245,0.65)', lineHeight: 1.8, maxWidth: 480, margin: '0 auto 32px' }}>
                سيتواصل معك أحد خبراء متين خلال 24 ساعة لتحديد موعد العرض المناسب لك.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" style={{ padding: '12px 28px', borderRadius: 12, background: '#C9A84C', color: '#000', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>ابدأ تجربة مجانية الآن</Link>
                <Link href="/" style={{ padding: '12px 28px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(238,238,245,0.65)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>العودة للرئيسية</Link>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, overflow: 'hidden' }}>
              {/* STEP INDICATOR */}
              <div style={{ padding: '24px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                      background: step >= s ? '#C9A84C' : 'rgba(255,255,255,0.04)',
                      color: step >= s ? '#000' : 'rgba(238,238,245,0.3)',
                      border: step === s ? '2px solid #C9A84C' : '1px solid rgba(255,255,255,0.06)',
                    }}>{s}</div>
                    <span style={{ fontSize: 13, color: step >= s ? '#EEEEF5' : 'rgba(238,238,245,0.35)', fontWeight: step === s ? 600 : 400 }}>
                      {s === 1 ? 'معلوماتك' : s === 2 ? 'مؤسستك' : 'التفضيلات'}
                    </span>
                    {s < 3 && <div style={{ width: 32, height: 1, background: step > s ? '#C9A84C' : 'rgba(255,255,255,0.08)' }} />}
                  </div>
                ))}
              </div>

              <div style={{ padding: '40px' }}>
                {/* STEP 1 */}
                {step === 1 && (
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>معلوماتك الشخصية</h2>
                    <p style={{ fontSize: 14, color: 'rgba(238,238,245,0.5)', margin: '0 0 32px' }}>سنتواصل معك على هذه البيانات لتحديد موعد العرض.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      {[
                        { key: 'name', label: 'الاسم الكامل', placeholder: 'محمد العتيبي', type: 'text' },
                        { key: 'role', label: 'المسمى الوظيفي', placeholder: 'مدير المدرسة', type: 'text' },
                        { key: 'email', label: 'البريد الإلكتروني', placeholder: 'name@school.edu.sa', type: 'email' },
                        { key: 'phone', label: 'رقم الجوال', placeholder: '05xxxxxxxx', type: 'tel' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(238,238,245,0.7)', marginBottom: 8 }}>{f.label}</label>
                          <input
                            type={f.type}
                            placeholder={f.placeholder}
                            value={(form as any)[f.key]}
                            onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                            style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#EEEEF5', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => form.name && form.email && form.phone ? setStep(2) : null}
                      style={{ marginTop: 32, padding: '13px 32px', borderRadius: 12, background: form.name && form.email && form.phone ? '#C9A84C' : 'rgba(201,168,76,0.3)', color: '#000', fontSize: 14, fontWeight: 700, border: 'none', cursor: form.name && form.email && form.phone ? 'pointer' : 'not-allowed', width: '100%' }}
                    >
                      التالي ←
                    </button>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>معلومات مؤسستك</h2>
                    <p style={{ fontSize: 14, color: 'rgba(238,238,245,0.5)', margin: '0 0 32px' }}>سيساعدنا هذا في تخصيص العرض لاحتياجاتك الفعلية.</p>

                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(238,238,245,0.7)', marginBottom: 8 }}>اسم المؤسسة</label>
                      <input
                        type="text"
                        placeholder="مدارس النخبة"
                        value={form.institution}
                        onChange={e => setForm(f => ({ ...f, institution: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#EEEEF5', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(238,238,245,0.7)', marginBottom: 12 }}>نوع المؤسسة</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                        {INSTITUTION_TYPES.map(t => (
                          <button
                            key={t.id}
                            onClick={() => setForm(f => ({ ...f, type: t.id }))}
                            style={{ padding: '12px', borderRadius: 12, border: `1px solid ${form.type === t.id ? '#C9A84C' : 'rgba(255,255,255,0.08)'}`, background: form.type === t.id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)', color: form.type === t.id ? '#C9A84C' : 'rgba(238,238,245,0.65)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                          >
                            <span style={{ fontSize: 22 }}>{t.icon}</span>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(238,238,245,0.7)', marginBottom: 12 }}>عدد الطلاب</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                        {STUDENT_RANGES.map(r => (
                          <button
                            key={r.id}
                            onClick={() => setForm(f => ({ ...f, students: r.id }))}
                            style={{ padding: '12px 16px', borderRadius: 12, border: `1px solid ${form.students === r.id ? '#C9A84C' : 'rgba(255,255,255,0.08)'}`, background: form.students === r.id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)', color: form.students === r.id ? '#C9A84C' : 'rgba(238,238,245,0.65)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'right' }}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => setStep(1)} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(238,238,245,0.55)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>→ السابق</button>
                      <button
                        onClick={() => form.institution && form.type && form.students ? setStep(3) : null}
                        style={{ flex: 2, padding: '13px', borderRadius: 12, background: form.institution && form.type && form.students ? '#C9A84C' : 'rgba(201,168,76,0.3)', color: '#000', fontSize: 14, fontWeight: 700, border: 'none', cursor: form.institution && form.type && form.students ? 'pointer' : 'not-allowed' }}
                      >
                        التالي ←
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>ما الذي يهمك أكثر؟</h2>
                    <p style={{ fontSize: 14, color: 'rgba(238,238,245,0.5)', margin: '0 0 32px' }}>اختر الميزات التي تريد التركيز عليها في العرض.</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
                      {INTERESTS.map(item => (
                        <button
                          key={item}
                          onClick={() => toggleInterest(item)}
                          style={{ padding: '8px 16px', borderRadius: 100, border: `1px solid ${form.interests.includes(item) ? '#C9A84C' : 'rgba(255,255,255,0.08)'}`, background: form.interests.includes(item) ? 'rgba(201,168,76,0.1)' : 'transparent', color: form.interests.includes(item) ? '#C9A84C' : 'rgba(238,238,245,0.55)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(238,238,245,0.7)', marginBottom: 8 }}>الوقت المفضل للعرض</label>
                      <select
                        value={form.preferred_time}
                        onChange={e => setForm(f => ({ ...f, preferred_time: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#EEEEF5', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                      >
                        <option value="">اختر الوقت المناسب</option>
                        <option value="morning">صباحاً (9 – 12)</option>
                        <option value="afternoon">ظهراً (12 – 3)</option>
                        <option value="evening">مساءً (3 – 6)</option>
                        <option value="flexible">مرن — أي وقت مناسب</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: 28 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(238,238,245,0.7)', marginBottom: 8 }}>أي تفاصيل إضافية؟ (اختياري)</label>
                      <textarea
                        placeholder="مثلاً: لدينا 3 فروع، نريد نظام موحد..."
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        rows={3}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#EEEEF5', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => setStep(2)} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(238,238,245,0.55)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>→ السابق</button>
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ flex: 2, padding: '13px', borderRadius: 12, background: '#C9A84C', color: '#000', fontSize: 14, fontWeight: 700, border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}
                      >
                        {loading ? 'جارٍ الإرسال...' : 'أرسل طلب العرض ✓'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* WHY DEMO */}
        {!submitted && (
          <section style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 24px' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', margin: '0 0 48px' }}>ماذا ستشاهد في العرض؟</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                {[
                  { icon: '🎯', title: 'عرض مخصص', desc: 'نُريك الميزات التي تحل مشاكل مؤسستك تحديداً، لا عرضاً عاماً.' },
                  { icon: '🔴', title: 'بث مباشر', desc: 'تجربة حية على بيانات حقيقية — لا شرائح ولا فيديوهات مسجلة.' },
                  { icon: '💬', title: 'أسئلة مفتوحة', desc: 'اسأل ما تريد — خبيرنا يجيب على كل استفسار بشكل مباشر.' },
                  { icon: '📋', title: 'خطة تطبيق', desc: 'تخرج بخطة واضحة: كيف تبدأ، كم يستغرق، وما التكلفة الفعلية.' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{item.title}</div>
                    <div style={{ fontSize: 13.5, color: 'rgba(238,238,245,0.55)', lineHeight: 1.7 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'rgba(238,238,245,0.5)', fontSize: 14 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#C9A84C,#E2C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#000' }}>م</div>
            متين
          </Link>
          <p style={{ fontSize: 12.5, color: 'rgba(238,238,245,0.3)', margin: 0 }}>© {new Date().getFullYear()} منصة متين. جميع الحقوق محفوظة.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/privacy" style={{ fontSize: 12.5, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>سياسة الخصوصية</Link>
            <Link href="/terms" style={{ fontSize: 12.5, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>الشروط والأحكام</Link>
          </div>
        </footer>

        <style>{`
          @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
          input:focus, select:focus, textarea:focus { border-color: rgba(201,168,76,0.4) !important; }
          input::placeholder, textarea::placeholder { color: rgba(238,238,245,0.2); }
          select option { background: #0d0d1a; }
        `}</style>
      </div>
    </>
  );
}
