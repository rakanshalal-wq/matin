'use client';
import React, { useState } from 'react';

interface QuranTemplateProps {
  data: {
    name: string;
    logo?: string;
    cover_image?: string;
    description?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    font_family?: string;
    show_global_ads?: boolean;
  };
  globalAds?: any[];
  globalProducts?: any[];
}

const QuranTemplate: React.FC<QuranTemplateProps> = ({ data, globalAds, globalProducts }) => {
  const P = data.primary_color || '#047857';
  const S = data.secondary_color || '#065F46';
  const A = data.accent_color || '#D4A843';
  const FF = data.font_family || 'IBM Plex Sans Arabic, sans-serif';
  const [showModal, setShowModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const BG = '#06060E';
  const TX = '#EEEEF5';
  const CARD = 'rgba(255,255,255,0.03)';
  const BD = 'rgba(255,255,255,0.07)';
  const DIM = 'rgba(238,238,245,0.6)';
  const MUT = 'rgba(238,238,245,0.3)';

  const stats4 = [
    { val: '1200', lbl: 'طالب' },
    { val: '85', lbl: 'حافظ' },
    { val: '35', lbl: 'محفظ' },
    { val: '12', lbl: 'إجازة' },
  ];

  const statsBar = [
    { val: '1200+', lbl: 'طالب مسجّل' },
    { val: '35', lbl: 'محفظ مجاز' },
    { val: '85', lbl: 'حافظ مكتمل' },
    { val: '12', lbl: 'إجازة بسند' },
    { val: '20', lbl: 'حلقة نشطة' },
  ];

  const programs = [
    { icon: '🌱', title: 'البراعم', age: '4 – 8 سنوات', desc: 'حفظ قصار السور وتأسيس حب القرآن بأسلوب ممتع.' },
    { icon: '📚', title: 'الحفظ المتدرج', age: '9 – 15 سنة', desc: 'منهج تدريجي من آخر المصحف إلى أوله مع مراجعة مستمرة.' },
    { icon: '🏆', title: 'الإتقان', age: '12 سنة فأكثر', desc: 'ختم المصحف كاملاً مع التجويد وتقييم دوري.' },
    { icon: '🎙️', title: 'التجويد', age: 'جميع الأعمار', desc: 'تعليم أحكام التجويد من مخارج وصفات مع تطبيق عملي.' },
    { icon: '📜', title: 'الإجازة', age: 'حافظ كامل', desc: 'منهج متخصص لنيل الإجازة بسند متصل بالنبي ﷺ.' },
    { icon: '👩‍🏫', title: 'حلقات النساء', age: 'مستقل', desc: 'حلقات مخصصة للنساء مع محفظات متخصصات.' },
  ];

  const teachers = [
    { name: 'الشيخ عبدالرحمن', role: 'مشرف عام · إجازة حفص', students: 45, rating: 4.9 },
    { name: 'محمد الغامدي', role: 'محفظ · رواية ورش', students: 32, rating: 4.8 },
    { name: 'أحمد الدوسري', role: 'محفظ · حفص عن عاصم', students: 28, rating: 4.7 },
    { name: 'نورة المالكي', role: 'محفظة نساء · إجازة', students: 22, rating: 5.0 },
  ];

  const features = [
    { icon: '📱', title: 'متابعة إلكترونية', desc: 'ولي الأمر يتابع تقدم ابنه لحظة بلحظة عبر التطبيق.' },
    { icon: '🥇', title: 'مسابقات قرآنية', desc: 'مسابقات شهرية وسنوية بجوائز قيّمة.' },
    { icon: '📜', title: 'إجازات بالسند', desc: 'للمتميزين إجازة بسند متصل وشهادة معتمدة.' },
    { icon: '⭐', title: 'نقاط الحفز', desc: 'نظام نقاط يحفّز الطلاب على الحفظ والمراجعة.' },
    { icon: '💬', title: 'تواصل مباشر', desc: 'تواصل فوري مع المحفظ وإدارة المركز.' },
    { icon: '🕌', title: 'بيئة تربوية', desc: 'برامج توعوية ورحلات تربوية دورية.' },
  ];

  const halaqatStatus = [
    { name: 'حلقة الفجر', time: '05:30 – 06:30', teacher: 'الشيخ عبدالرحمن', students: 18, live: true },
    { name: 'حلقة العصر', time: '16:00 – 17:30', teacher: 'أحمد الدوسري', students: 22, live: false },
  ];

  return (
    <div style={{ fontFamily: FF, backgroundColor: BG, color: TX, minHeight: '100vh', direction: 'rtl' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 100, backdropFilter: 'blur(20px) saturate(1.8)', background: 'rgba(6,6,14,.88)', borderBottom: '1px solid ' + BD }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: `linear-gradient(135deg,${P},${S})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: `0 4px 16px ${P}55` }}>
              {data.logo ? <img src={data.logo} alt="logo" style={{ width: '100%', height: '100%', borderRadius: 11 }} /> : '📖'}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>مركز النور لتحفيظ القرآن</div>
              <div style={{ fontSize: 10, color: MUT }}>رحلة الحفظ تبدأ هنا</div>
            </div>
          </div>
          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13, color: DIM }}>
            {['البرامج', 'المحفّظون', 'المميزات', 'تواصل'].map(l => (
              <span key={l} style={{ cursor: 'pointer', fontWeight: 600 }}>{l}</span>
            ))}
          </div>
          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setShowModal(true)} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid ' + BD, borderRadius: 9, padding: '8px 16px', color: DIM, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FF }}>دخول</button>
            <button style={{ background: `linear-gradient(135deg,${P},${S})`, border: 'none', borderRadius: 9, padding: '9px 20px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FF, boxShadow: `0 4px 16px ${P}55` }}>سجّل ابنك الآن</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 120, paddingBottom: 70, padding: '120px 24px 70px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 460px', gap: 60, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${P}18`, border: `1px solid ${P}40`, borderRadius: 20, padding: '6px 16px', fontSize: 12, color: '#10B981', fontWeight: 700, marginBottom: 22 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981' }}></span>
              باب التسجيل مفتوح
            </div>
            <h1 style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.18, marginBottom: 18, letterSpacing: '-0.5px' }}>
              احفظ كتاب الله مع<br />
              <span style={{ background: `linear-gradient(135deg,${P},${A})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {data.name || 'مركز النور'}
              </span>
            </h1>
            <p style={{ fontSize: 16, color: DIM, lineHeight: 1.8, marginBottom: 30, maxWidth: 480 }}>
              {data.description || 'بيئة قرآنية متكاملة تجمع الحفظ والتجويد والإجازة تحت إشراف نخبة من المحفّظين المجازين بأعلى معايير الإتقان.'}
            </p>
            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 28, marginBottom: 32 }}>
              {stats4.map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: i % 2 === 0 ? P : A }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: MUT, fontWeight: 600 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ background: `linear-gradient(135deg,${P},${S})`, border: 'none', borderRadius: 12, padding: '13px 30px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FF, boxShadow: `0 8px 28px ${P}4D` }}>سجّل ابنك الآن</button>
              <button style={{ background: 'rgba(255,255,255,.05)', border: '1px solid ' + BD, borderRadius: 12, padding: '13px 22px', color: DIM, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FF }}>تواصل معنا</button>
            </div>
          </div>
          {/* Hero Card */}
          <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 20, padding: 22, backdropFilter: 'blur(12px)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: A, marginBottom: 14 }}>📡 حالة الحلقات اليوم</div>
            {halaqatStatus.map((h, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid ' + BD, borderRadius: 12, padding: '12px 14px', marginBottom: i === 0 ? 10 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{h.name}</span>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: h.live ? '#10B98120' : 'rgba(255,255,255,.05)', color: h.live ? '#10B981' : MUT, fontWeight: 700 }}>
                    {h.live ? '🔴 مباشرة' : '⏳ قادمة'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: DIM }}>⏰ {h.time} &nbsp;|&nbsp; 👤 {h.teacher}</div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,.07)', borderRadius: 4 }}>
                    <div style={{ width: `${(h.students / 25) * 100}%`, height: '100%', background: `linear-gradient(90deg,${P},${A})`, borderRadius: 4 }}></div>
                  </div>
                  <span style={{ fontSize: 11, color: MUT }}>{h.students}/25 طالب</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14, textAlign: 'center', background: `${P}15`, border: `1px solid ${P}30`, borderRadius: 10, padding: '10px', fontSize: 13, color: P, fontWeight: 700, cursor: 'pointer' }}>
              سجّل ابنك في حلقة اليوم →
            </div>
          </div>
        </div>
      </section>

      {/* ── QURAN VERSE ── */}
      <section style={{ padding: '0 24px 70px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', border: `1px solid ${A}40`, borderRadius: 20, padding: '36px 40px', background: `${A}08`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: BG, padding: '0 16px' }}>
            <span style={{ fontSize: 11, color: A, fontWeight: 700, letterSpacing: 1 }}>آية كريمة</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.9, color: TX, marginBottom: 12, fontFamily: 'serif' }}>
            ﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾
          </div>
          <div style={{ fontSize: 12, color: A, fontWeight: 600 }}>سورة القمر – الآية 17</div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto 70px', padding: '0 24px' }}>
        <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 18, padding: '28px 36px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {statsBar.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderLeft: i < 4 ? '1px solid ' + BD : 'none' }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: i % 2 === 0 ? P : A }}>{s.val}</div>
              <div style={{ fontSize: 11.5, color: MUT, fontWeight: 600, marginTop: 4 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROGRAMS ── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: P, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>برامجنا</div>
            <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 12 }}>مسارات الحفظ المتكاملة</h2>
            <p style={{ fontSize: 14, color: DIM, maxWidth: 500, margin: '0 auto' }}>نقدّم برامج مصممة لكل مرحلة عمرية ومستوى تعليمي</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {programs.map((p, i) => (
              <div key={i} style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: '22px 20px', transition: 'border-color 0.2s', cursor: 'pointer' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: A, fontWeight: 700, marginBottom: 10, background: `${A}15`, display: 'inline-block', padding: '2px 10px', borderRadius: 20 }}>{p.age}</div>
                <p style={{ fontSize: 13, color: DIM, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEACHERS ── */}
      <section style={{ padding: '0 24px 80px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 60, paddingBottom: 20 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: A, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>فريقنا</div>
            <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 12 }}>نخبة المحفّظين المجازين</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {teachers.map((t, i) => (
              <div key={i} style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: '24px 18px', textAlign: 'center' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: `linear-gradient(135deg,${P}30,${A}20)`, border: `2px solid ${P}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 28 }}>🎓</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: DIM, marginBottom: 12 }}>{t.role}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 18, fontSize: 11 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: P, fontSize: 16 }}>{t.students}</div>
                    <div style={{ color: MUT }}>طالب</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: A, fontSize: 16 }}>{t.rating}</div>
                    <div style={{ color: MUT }}>تقييم ⭐</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: P, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>لماذا نحن؟</div>
            <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 12 }}>ما يميّز مركزنا</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 14, padding: '20px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${P}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 5 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: DIM, lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', background: `linear-gradient(135deg,${P}20,${A}10)`, border: `1px solid ${P}40`, borderRadius: 24, padding: '52px 40px' }}>
          <div style={{ fontSize: 38, marginBottom: 16 }}>📖</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 14 }}>سجّل أبناءك اليوم</h2>
          <p style={{ fontSize: 15, color: DIM, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.8 }}>
            انضم لأكثر من 1200 طالب يحفظون كتاب الله في أجواء تربوية متكاملة مع نخبة من المحفّظين المجازين.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button style={{ background: `linear-gradient(135deg,${P},${S})`, border: 'none', borderRadius: 12, padding: '14px 36px', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: FF, boxShadow: `0 8px 28px ${P}55` }}>سجّل الآن مجاناً</button>
            <button style={{ background: 'rgba(255,255,255,.06)', border: '1px solid ' + BD, borderRadius: 12, padding: '14px 24px', color: DIM, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FF }}>استفسار عبر واتساب</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '40px 24px 28px', borderTop: '1px solid ' + BD }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 36 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>📖</span>
                <span style={{ fontSize: 15, fontWeight: 800 }}>مركز النور</span>
              </div>
              <p style={{ fontSize: 12, color: DIM, lineHeight: 1.8, maxWidth: 260 }}>مركز متخصص في تحفيظ القرآن الكريم وتجويده وفق أعلى معايير الجودة.</p>
            </div>
            {[
              { title: 'البرامج', links: ['البراعم', 'الحفظ المتدرج', 'الإتقان', 'التجويد'] },
              { title: 'المركز', links: ['من نحن', 'المحفّظون', 'أخبارنا', 'تواصل'] },
              { title: 'الدعم', links: ['الأسئلة الشائعة', 'سياسة الخصوصية', 'الشروط'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, color: TX }}>{col.title}</div>
                {col.links.map(l => <div key={l} style={{ fontSize: 12, color: DIM, marginBottom: 8, cursor: 'pointer' }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid ' + BD, paddingTop: 20, textAlign: 'center', fontSize: 11, color: MUT }}>
            © {new Date().getFullYear()} مركز النور لتحفيظ القرآن الكريم – مدعوم بواسطة منصة متين
          </div>
        </div>
      </footer>

      {/* ── LOGIN MODAL ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#0D0D1E', border: '1px solid ' + BD, borderRadius: 20, padding: 36, width: '100%', maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📖</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>دخول المركز</div>
              <div style={{ fontSize: 12, color: MUT }}>أدخل بياناتك للوصول إلى لوحة التحكم</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: DIM, display: 'block', marginBottom: 6 }}>البريد الإلكتروني</label>
              <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} type="email" placeholder="example@quran.com" style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid ' + BD, borderRadius: 10, padding: '11px 14px', color: TX, fontSize: 13, fontFamily: FF, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 12, color: DIM, display: 'block', marginBottom: 6 }}>كلمة المرور</label>
              <input value={loginPass} onChange={e => setLoginPass(e.target.value)} type="password" placeholder="••••••••" style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid ' + BD, borderRadius: 10, padding: '11px 14px', color: TX, fontSize: 13, fontFamily: FF, boxSizing: 'border-box' }} />
            </div>
            <button style={{ width: '100%', background: `linear-gradient(135deg,${P},${S})`, border: 'none', borderRadius: 12, padding: 13, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FF, marginBottom: 12 }}>دخول</button>
            <button onClick={() => setShowModal(false)} style={{ width: '100%', background: 'transparent', border: '1px solid ' + BD, borderRadius: 12, padding: 11, color: DIM, fontSize: 13, cursor: 'pointer', fontFamily: FF }}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuranTemplate;
