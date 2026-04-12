'use client';
import { useState } from 'react';

const PRIMARY = '#0EA5E9';
const SECONDARY = '#0369A1';
const ACCENT = '#F59E0B';
const BG = '#06060E';
const TEXT = '#EEEEF5';
const GOLD = '#D4A843';
const CARD_BG = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(14,165,233,0.15)';

interface InstituteTemplateProps {
  data?: any;
  globalAds?: any[];
  globalProducts?: any[];
}

const programs = [
  { title: 'تطوير الويب', price: '3,200 ر.س', level: 'متوسط', seats: 8, color: PRIMARY, icon: '💻' },
  { title: 'الذكاء الاصطناعي', price: '4,500 ر.س', level: 'متقدم', seats: 5, color: GOLD, icon: '🤖' },
  { title: 'إدارة المشاريع PMP', price: '2,800 ر.س', level: 'مبتدئ', seats: 12, color: '#10B981', icon: '📋' },
  { title: 'التحليل المالي', price: '1,900 ر.س', level: 'مبتدئ', seats: 15, color: ACCENT, icon: '📊' },
  { title: 'القيادة والإدارة', price: '1,600 ر.س', level: 'متوسط', seats: 10, color: '#8B5CF6', icon: '🎯' },
  { title: 'الأمن السيبراني', price: '5,200 ر.س', level: 'متقدم', seats: 4, color: '#EF4444', icon: '🔐' },
];

const features = [
  { title: 'شهادات معتمدة', desc: 'شهادات معتمدة من هيئة تقييم التعليم ETEC', icon: '🏅', color: GOLD },
  { title: '3 طرق تدريب', desc: 'حضوري أو أونلاين أو مدمج حسب راحتك', icon: '🎓', color: PRIMARY },
  { title: 'مدربون من الصناعة', desc: 'خبراء معتمدون بخبرة ميدانية 10+ سنوات', icon: '👨‍🏫', color: '#10B981' },
  { title: 'مساعد ذكاء اصطناعي', desc: 'مساعد AI لدعمك أثناء الدراسة على مدار الساعة', icon: '🤖', color: '#8B5CF6' },
  { title: 'دفع بالأقساط', desc: 'خطط دفع مرنة بدون فوائد على جميع البرامج', icon: '💳', color: ACCENT },
  { title: 'اختبارات ذكية', desc: 'تقييم تكيفي يضمن تقدمك الحقيقي', icon: '📝', color: '#EF4444' },
];

const schedule = [
  { day: 'الأحد - الثلاثاء', time: '5:00 - 8:00م', program: 'تطوير الويب', trainer: 'سارة القحطاني', method: 'حضوري', seats: 8 },
  { day: 'الاثنين - الأربعاء', time: '7:00 - 10:00م', program: 'الذكاء الاصطناعي', trainer: 'خالد المطيري', method: 'أونلاين', seats: 5 },
  { day: 'الأحد - الخميس', time: '9:00 - 12:00ص', program: 'PMP', trainer: 'نورة العمري', method: 'مدمج', seats: 12 },
  { day: 'الثلاثاء - الخميس', time: '4:00 - 7:00م', program: 'التحليل المالي', trainer: 'فيصل الشمري', method: 'حضوري', seats: 15 },
  { day: 'الجمعة - السبت', time: '10:00ص - 1:00م', program: 'الأمن السيبراني', trainer: 'خالد المطيري', method: 'أونلاين', seats: 4 },
];

const trainers = [
  { name: 'سارة القحطاني', specialty: 'تطوير الويب والبرمجة', rating: '4.9', trainees: 1240, badge: 'S', color: PRIMARY },
  { name: 'خالد المطيري', specialty: 'الذكاء الاصطناعي والبيانات', rating: '4.8', trainees: 980, badge: 'خ', color: GOLD },
  { name: 'نورة العمري', specialty: 'إدارة المشاريع', rating: '4.9', trainees: 760, badge: 'ن', color: '#10B981' },
  { name: 'فيصل الشمري', specialty: 'الأمن السيبراني', rating: '4.7', trainees: 540, badge: 'ف', color: '#EF4444' },
];

const certificates = [
  { title: 'معتمد من ETEC', desc: 'جميع شهاداتنا معتمدة من هيئة تقييم التعليم والتدريب', icon: '🏆', color: GOLD },
  { title: 'شراكات دولية', desc: 'معترف بها دولياً عبر شراكاتنا مع Google و Microsoft و PMI', icon: '🌐', color: PRIMARY },
  { title: 'تحقق بـ QR', desc: 'كل شهادة تحتوي على QR Code للتحقق الفوري من صحتها', icon: '📱', color: '#10B981' },
];

export const InstituteTemplate: React.FC<InstituteTemplateProps> = ({ data, globalAds, globalProducts }) => {
  const [activeNav, setActiveNav] = useState('الرئيسية');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginTab, setLoginTab] = useState<'متدرب' | 'مدرب' | 'إدارة'>('متدرب');
  const [registerStep, setRegisterStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', program: '', method: '' });

  const navLinks = ['الرئيسية', 'البرامج', 'المدربون', 'الجدول', 'الشهادات', 'تواصل'];
  const instituteName = data?.name_ar || data?.name || 'معهد الإتقان للتدريب';

  const statBarItems = [
    { label: 'برنامج تدريبي', value: '68+', color: PRIMARY },
    { label: 'مدرب معتمد', value: '48+', color: GOLD },
    { label: 'خريج ناجح', value: '14,200+', color: '#10B981' },
    { label: 'رضا المتدربين', value: '96%', color: ACCENT },
    { label: 'شراكة مؤسسية', value: '24+', color: '#8B5CF6' },
  ];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: BG, color: TEXT, minHeight: '100vh' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(6,6,14,0.95)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${BORDER}`, padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff' }}>إ</div>
          <span style={{ fontSize: 17, fontWeight: 800, color: TEXT }}>{instituteName}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {navLinks.map(link => (
            <button key={link} onClick={() => setActiveNav(link)} style={{ background: activeNav === link ? `${PRIMARY}18` : 'none', border: 'none', color: activeNav === link ? PRIMARY : 'rgba(238,238,245,0.6)', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>{link}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setShowLoginModal(true)} style={{ background: 'none', border: `1px solid ${BORDER}`, color: TEXT, padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>تسجيل الدخول</button>
          <button style={{ background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 16px ${PRIMARY}40` }}>سجّل الآن</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '80px 64px 64px', background: `radial-gradient(ellipse at 70% 50%, ${PRIMARY}10 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, ${GOLD}08 0%, transparent 50%)` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 56, alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${GOLD}15`, border: `1px solid ${GOLD}30`, borderRadius: 20, padding: '6px 14px', marginBottom: 24 }}>
              <span style={{ fontSize: 14 }}>🏅</span>
              <span style={{ color: GOLD, fontSize: 12, fontWeight: 700 }}>معتمد من هيئة تقييم التعليم والتدريب</span>
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.2, margin: '0 0 20px', background: `linear-gradient(135deg,${TEXT},${PRIMARY})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>طوّر مهاراتك<br />احترافياً وبسرعة</h1>
            <p style={{ color: 'rgba(238,238,245,0.6)', fontSize: 16, lineHeight: 1.8, marginBottom: 32, maxWidth: 520 }}>برامج تدريبية معتمدة بأسلوب حديث وتجربة تعلم استثنائية تضمن لك الوصول لسوق العمل في أقل وقت.</p>
            <div style={{ display: 'flex', gap: 14, marginBottom: 48, flexWrap: 'wrap' }}>
              <button style={{ background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', color: '#fff', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 24px ${PRIMARY}40` }}>سجّل في برنامج</button>
              <button style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>جولة تعريفية ◀</button>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[{ v: '14,200+', l: 'خريج' }, { v: '68', l: 'برنامج' }, { v: '96%', l: 'رضا' }, { v: '48+', l: 'مدرب' }].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: PRIMARY }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: 'rgba(238,238,245,0.4)', fontWeight: 600, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Hero Card */}
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28, backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(238,238,245,0.5)', marginBottom: 18 }}>البرامج المتاحة الآن</div>
            {programs.slice(0, 3).map(p => (
              <div key={p.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${p.color}08`, border: `1px solid ${p.color}20`, borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{p.icon}</span>
                  <div>
                    <div style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>{p.title}</div>
                    <div style={{ color: p.color, fontSize: 12, fontWeight: 600, marginTop: 2 }}>{p.price}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: p.color, fontSize: 16, fontWeight: 800 }}>{p.seats}</div>
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10 }}>مقعد</div>
                </div>
              </div>
            ))}
            <button style={{ width: '100%', background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', color: '#fff', padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 6 }}>عرض جميع البرامج</button>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ background: `${CARD_BG}`, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '24px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, maxWidth: 1000, margin: '0 auto' }}>
          {statBarItems.map((s, i) => (
            <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '0 24px', borderRight: i < statBarItems.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(238,238,245,0.45)', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROGRAMS ── */}
      <section style={{ padding: '72px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: PRIMARY, fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>البرامج التدريبية</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>اختر برنامجك المثالي</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {programs.map(p => (
              <div key={p.title} style={{ background: CARD_BG, border: `1px solid ${p.color}20`, borderRadius: 18, padding: 24, transition: 'all 0.25s', cursor: 'pointer' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 12px 40px ${p.color}20`; el.style.borderColor = `${p.color}45`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = `${p.color}20`; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{p.icon}</span>
                  <span style={{ background: `${p.color}18`, color: p.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, border: `1px solid ${p.color}30` }}>{p.level}</span>
                </div>
                <h3 style={{ color: TEXT, fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>{p.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: `1px solid ${p.color}15` }}>
                  <div style={{ color: p.color, fontSize: 18, fontWeight: 900 }}>{p.price}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                    <span style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{p.seats} مقعد متاح</span>
                  </div>
                </div>
                <button style={{ width: '100%', background: `${p.color}15`, border: `1px solid ${p.color}30`, color: p.color, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 14 }}>سجّل الآن</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '72px 64px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>لماذا نحن</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>مميزات تجعلنا الأفضل</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: CARD_BG, border: `1px solid ${f.color}15`, borderRadius: 16, padding: '24px 20px' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16, border: `1px solid ${f.color}25` }}>{f.icon}</div>
                <h3 style={{ color: TEXT, fontSize: 16, fontWeight: 800, margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ color: 'rgba(238,238,245,0.5)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <section style={{ padding: '72px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: PRIMARY, fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>مواعيد الدفعات</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>الجدول الزمني القادم</h2>
          </div>
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 1.1fr 1.1fr 0.8fr 0.7fr', padding: '14px 24px', background: `${PRIMARY}10`, borderBottom: `1px solid ${BORDER}` }}>
              {['الأيام', 'الوقت', 'البرنامج', 'المدرب', 'الطريقة', 'المقاعد'].map(h => (
                <div key={h} style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, fontWeight: 700 }}>{h}</div>
              ))}
            </div>
            {schedule.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 1.1fr 1.1fr 0.8fr 0.7fr', padding: '16px 24px', borderBottom: i < schedule.length - 1 ? `1px solid ${BORDER}` : 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${PRIMARY}06`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                <div style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{row.day}</div>
                <div style={{ color: PRIMARY, fontSize: 13, fontWeight: 600 }}>{row.time}</div>
                <div style={{ color: TEXT, fontSize: 13 }}>{row.program}</div>
                <div style={{ color: 'rgba(238,238,245,0.6)', fontSize: 13 }}>{row.trainer}</div>
                <div><span style={{ background: `${ACCENT}15`, color: ACCENT, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>{row.method}</span></div>
                <div style={{ color: '#10B981', fontSize: 13, fontWeight: 700 }}>{row.seats} متاح</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAINERS ── */}
      <section style={{ padding: '72px 64px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>فريقنا</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>المدربون المعتمدون</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {trainers.map(t => (
              <div key={t.name} style={{ background: CARD_BG, border: `1px solid ${t.color}20`, borderRadius: 18, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.borderColor = `${t.color}45`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = `${t.color}20`; }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${t.color},${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 auto 16px', border: `3px solid ${t.color}30` }}>{t.badge}</div>
                <h3 style={{ color: TEXT, fontSize: 16, fontWeight: 800, margin: '0 0 6px' }}>{t.name}</h3>
                <p style={{ color: 'rgba(238,238,245,0.45)', fontSize: 12, margin: '0 0 16px' }}>{t.specialty}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, paddingTop: 16, borderTop: `1px solid ${t.color}15` }}>
                  <div><div style={{ color: GOLD, fontSize: 16, fontWeight: 800 }}>⭐ {t.rating}</div><div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10 }}>تقييم</div></div>
                  <div><div style={{ color: t.color, fontSize: 16, fontWeight: 800 }}>{t.trainees.toLocaleString()}</div><div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10 }}>متدرب</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATES ── */}
      <section style={{ padding: '72px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>الاعتماد والاعتراف</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>شهاداتنا معترف بها عالمياً</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {certificates.map(c => (
              <div key={c.title} style={{ background: `linear-gradient(135deg,${c.color}08,transparent)`, border: `1px solid ${c.color}25`, borderRadius: 20, padding: '36px 28px', textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 20 }}>{c.icon}</div>
                <h3 style={{ color: TEXT, fontSize: 20, fontWeight: 800, margin: '0 0 12px' }}>{c.title}</h3>
                <p style={{ color: 'rgba(238,238,245,0.5)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTER FORM ── */}
      <section style={{ padding: '72px 64px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ color: PRIMARY, fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>ابدأ رحلتك</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>سجّل في برنامج الآن</h2>
          </div>
          {/* Steps */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
            {['البيانات الشخصية', 'اختيار البرنامج', 'التأكيد'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: registerStep > i + 1 ? '#10B981' : registerStep === i + 1 ? PRIMARY : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: registerStep >= i + 1 ? '#fff' : 'rgba(255,255,255,0.3)', border: registerStep === i + 1 ? `2px solid ${PRIMARY}` : 'none', transition: 'all 0.3s' }}>{registerStep > i + 1 ? '✓' : i + 1}</div>
                  <div style={{ fontSize: 11, color: registerStep >= i + 1 ? TEXT : 'rgba(238,238,245,0.35)', fontWeight: 600, whiteSpace: 'nowrap' }}>{step}</div>
                </div>
                {i < 2 && <div style={{ width: 80, height: 2, background: registerStep > i + 1 ? '#10B981' : BORDER, margin: '0 8px', marginBottom: 28, transition: 'all 0.3s' }} />}
              </div>
            ))}
          </div>
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 36 }}>
            {registerStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[{ label: 'الاسم الكامل', ph: 'أدخل اسمك', key: 'name' }, { label: 'البريد الإلكتروني', ph: 'email@example.com', key: 'email' }, { label: 'رقم الجوال', ph: '05xxxxxxxx', key: 'phone' }].map(f => (
                  <div key={f.key} style={{ gridColumn: f.key === 'phone' ? '1/-1' : undefined }}>
                    <label style={{ display: 'block', color: 'rgba(238,238,245,0.6)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{f.label}</label>
                    <input placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '12px 16px', color: TEXT, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                ))}
              </div>
            )}
            {registerStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(238,238,245,0.6)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>اختر البرنامج</label>
                  <select value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '12px 16px', color: TEXT, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}>
                    <option value="">-- اختر --</option>
                    {programs.map(p => <option key={p.title} value={p.title} style={{ background: '#0F0F1A' }}>{p.title} — {p.price}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(238,238,245,0.6)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>طريقة التدريب</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {['حضوري', 'أونلاين', 'مدمج'].map(m => (
                      <button key={m} onClick={() => setSelectedMethod(m)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${selectedMethod === m ? PRIMARY : BORDER}`, background: selectedMethod === m ? `${PRIMARY}18` : 'transparent', color: selectedMethod === m ? PRIMARY : 'rgba(238,238,245,0.5)', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{m}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {registerStep === 3 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
                <h3 style={{ color: TEXT, fontSize: 22, fontWeight: 800, margin: '0 0 12px' }}>تأكيد التسجيل</h3>
                <p style={{ color: 'rgba(238,238,245,0.5)', fontSize: 14, lineHeight: 1.8 }}>سيتواصل معك فريقنا خلال 24 ساعة لتأكيد تسجيلك في برنامج <strong style={{ color: PRIMARY }}>{selectedProgram || 'المختار'}</strong></p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              {registerStep > 1 && registerStep < 3 && <button onClick={() => setRegisterStep(s => s - 1)} style={{ padding: '12px 24px', borderRadius: 10, border: `1px solid ${BORDER}`, background: 'transparent', color: 'rgba(238,238,245,0.5)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>السابق</button>}
              {registerStep < 3 && <button onClick={() => setRegisterStep(s => s + 1)} style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>التالي</button>}
              {registerStep === 3 && <button style={{ padding: '12px 32px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,#10B981,#059669)`, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>إرسال الطلب</button>}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '56px 64px 32px', background: 'rgba(0,0,0,0.4)', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff' }}>إ</div>
                <span style={{ fontSize: 17, fontWeight: 800 }}>{instituteName}</span>
              </div>
              <p style={{ color: 'rgba(238,238,245,0.4)', fontSize: 13, lineHeight: 1.8, maxWidth: 280 }}>نقدم أفضل برامج التدريب المهني والتقني المعتمدة في المملكة العربية السعودية.</p>
            </div>
            {[
              { title: 'البرامج', links: ['تطوير الويب', 'الذكاء الاصطناعي', 'إدارة المشاريع', 'التحليل المالي'] },
              { title: 'المعهد', links: ['من نحن', 'المدربون', 'الشهادات', 'الأخبار'] },
              { title: 'التواصل', links: ['info@institute.sa', '920000000', 'الرياض، المملكة', 'واتساب'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: TEXT, fontSize: 14, fontWeight: 800, marginBottom: 16 }}>{col.title}</h4>
                {col.links.map(l => <div key={l} style={{ color: 'rgba(238,238,245,0.4)', fontSize: 13, marginBottom: 10, cursor: 'pointer' }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'rgba(238,238,245,0.3)', fontSize: 12 }}>© 2025 {instituteName}. جميع الحقوق محفوظة.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {['🐦', '📘', '📸', '💼'].map((icon, i) => <div key={i} style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>{icon}</div>)}
            </div>
          </div>
        </div>
      </footer>

      {/* ── LOGIN MODAL ── */}
      {showLoginModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#0A0A18', border: `1px solid ${BORDER}`, borderRadius: 22, padding: 36, width: '100%', maxWidth: 420, direction: 'rtl', position: 'relative' }}>
            <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(238,238,245,0.5)', width: 32, height: 32, borderRadius: 8, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 900, margin: '0 0 24px', textAlign: 'center' }}>تسجيل الدخول</h2>
            <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
              {(['متدرب', 'مدرب', 'إدارة'] as const).map(tab => (
                <button key={tab} onClick={() => setLoginTab(tab)} style={{ flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', background: loginTab === tab ? PRIMARY : 'transparent', color: loginTab === tab ? '#fff' : 'rgba(238,238,245,0.4)', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{tab}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[{ label: 'البريد الإلكتروني', ph: 'email@example.com', type: 'email' }, { label: 'كلمة المرور', ph: '••••••••', type: 'password' }].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', color: 'rgba(238,238,245,0.5)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '12px 16px', color: TEXT, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              ))}
              <button style={{ width: '100%', background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', color: '#fff', padding: '14px 0', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>دخول كـ {loginTab}</button>
              <div style={{ textAlign: 'center', color: 'rgba(238,238,245,0.35)', fontSize: 12, marginTop: 4 }}>نسيت كلمة المرور؟ <span style={{ color: PRIMARY, cursor: 'pointer', fontWeight: 600 }}>استعادة</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteTemplate;
