'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const INSTITUTION_TYPES = [
  { value: 'school', label: '🏫 مدرسة' },
  { value: 'quran', label: '📖 حلقة قرآن' },
  { value: 'institute', label: '📚 معهد' },
  { value: 'training', label: '💼 مركز تدريب' },
  { value: 'university', label: '🎓 جامعة' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [institutionType, setInstitutionType] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institutionName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleNextStep(e: FormEvent) {
    e.preventDefault();
    if (!institutionType) {
      setError('يرجى اختيار نوع المؤسسة');
      return;
    }
    setError('');
    setStep(2);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقتين');
      return;
    }
    if (form.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          institutionName: form.institutionName,
          institutionType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'حدث خطأ، حاول مرة أخرى');
        return;
      }

      router.push(data.redirect ?? '/login');
    } catch {
      setError('تعذّر الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoIcon}>م</span>
          <span style={styles.logoText}>متين</span>
        </div>

        <h1 style={styles.title}>إنشاء حساب جديد</h1>
        <p style={styles.subtitle}>
          {step === 1 ? 'اختر نوع مؤسستك التعليمية' : 'أدخل بياناتك لإنشاء الحساب'}
        </p>

        {/* Step indicator */}
        <div style={styles.steps}>
          <div style={{ ...styles.stepDot, ...(step >= 1 ? styles.stepActive : {}) }}>١</div>
          <div style={styles.stepLine} />
          <div style={{ ...styles.stepDot, ...(step >= 2 ? styles.stepActive : {}) }}>٢</div>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleNextStep} style={styles.form}>
            <div style={styles.typeGrid}>
              {INSTITUTION_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => { setInstitutionType(type.value); setError(''); }}
                  style={{
                    ...styles.typeBtn,
                    ...(institutionType === type.value ? styles.typeBtnActive : {}),
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <button type="submit" style={styles.btn}>
              التالي →
            </button>
            <p style={styles.loginLink}>
              لديك حساب؟{' '}
              <Link href="/login" style={styles.link}>تسجيل الدخول</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>الاسم الكامل</label>
              <input
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="محمد أحمد"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>اسم المؤسسة</label>
              <input
                name="institutionName"
                type="text"
                value={form.institutionName}
                onChange={handleChange}
                required
                placeholder="مدرسة النور الأهلية"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>البريد الإلكتروني</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="example@school.com"
                style={{ ...styles.input, direction: 'ltr', textAlign: 'left' }}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>كلمة المرور</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="8 أحرف على الأقل"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>تأكيد كلمة المرور</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="أعد كتابة كلمة المرور"
                style={styles.input}
              />
            </div>

            <div style={styles.rowBtns}>
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); }}
                style={styles.backBtn}
              >
                ← رجوع
              </button>
              <button type="submit" disabled={loading} style={{ ...styles.btn, flex: 1 }}>
                {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
              </button>
            </div>

            <p style={styles.loginLink}>
              لديك حساب؟{' '}
              <Link href="/login" style={styles.link}>تسجيل الدخول</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    padding: '1rem',
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    direction: 'rtl',
  },
  card: {
    background: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    justifyContent: 'center',
  },
  logoIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #D4A843, #B8922E)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#D4A843',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    margin: '0 0 0.4rem',
  },
  subtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: '0.875rem',
    marginBottom: '1.25rem',
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  stepDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#334155',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '700',
    transition: 'all 0.2s',
  },
  stepActive: {
    background: 'linear-gradient(135deg, #D4A843, #B8922E)',
    color: '#fff',
  },
  stepLine: {
    width: '48px',
    height: '2px',
    background: '#334155',
    borderRadius: '1px',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.4)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#FCA5A5',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  typeBtn: {
    background: '#0F172A',
    border: '1px solid #334155',
    borderRadius: '10px',
    padding: '0.85rem 0.5rem',
    color: '#94A3B8',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    textAlign: 'center',
  },
  typeBtnActive: {
    background: 'rgba(212,168,67,0.12)',
    border: '1px solid rgba(212,168,67,0.5)',
    color: '#D4A843',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    color: '#94A3B8',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  input: {
    background: '#0F172A',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#F8FAFC',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit',
  },
  btn: {
    background: 'linear-gradient(135deg, #D4A843, #B8922E)',
    border: 'none',
    borderRadius: '8px',
    padding: '0.875rem',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
  },
  rowBtns: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '0.875rem 1rem',
    color: '#94A3B8',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  },
  loginLink: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: '0.875rem',
  },
  link: {
    color: '#D4A843',
    textDecoration: 'none',
    fontWeight: '600',
  },
};
