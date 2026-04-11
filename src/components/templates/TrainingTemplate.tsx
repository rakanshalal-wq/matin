'use client';
import React, { useState } from 'react';

interface TrainingTemplateProps {
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

const TrainingTemplate: React.FC<TrainingTemplateProps> = ({ data, globalAds, globalProducts }) => {
  const P = data.primary_color || '#E65100';
  const S = data.secondary_color || '#BF360C';
  const A = data.accent_color || '#FF6D00';
  const GOLD = '#D4A843';
  const BG = '#06060E';
  const TEXT = '#EEEEF5';
  const CARD = 'rgba(255,255,255,0.035)';
  const BD = 'rgba(255,255,255,0.08)';
  const DIM = 'rgba(238,238,245,0.6)';
  const MUT = 'rgba(238,238,245,0.3)';
  const font = data.font_family || 'IBM Plex Sans Arabic, sans-serif';

  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [activeNav, setActiveNav] = useState('');

  const navLinks = ['البرامج', 'المدربون', 'الشهادات', 'تواصل'];

  const programs = [
    { name: 'تطوير ويب متكامل', level: 'مبتدئ → متقدم', duration: '3 أشهر', price: 2500, seats: 8, icon: '💻', color: '#3B82F6' },
    { name: 'إدارة المشاريع PMP', level: 'متوسط', duration: '6 أسابيع', price: 3200, seats: 5, icon: '📊', color: '#8B5CF6' },
    { name: 'الذكاء الاصطناعي وتعلم الآلة', level: 'متوسط → متقدم', duration: '4 أشهر', price: 4000, seats: 6, icon: '🤖', color: '#EC4899' },
    { name: 'الأمن السيبراني', level: 'متوسط', duration: '10 أسابيع', price: 3500, seats: 3, icon: '🔐', color: '#10B981' },
    { name: 'تطوير تطبيقات الجوال', level: 'مبتدئ → متوسط', duration: '12 أسبوع', price: 2800, seats: 10, icon: '📱', color: '#F59E0B' },
    { name: 'القيادة وإدارة الفرق', level: 'جميع المستويات', duration: '4 أسابيع', price: 1200, seats: 15, icon: '🎯', color: '#EF4444' },
  ];

  const trainers = [
    { name: 'خالد الحربي', specialty: 'تطوير ويب وتطبيقات الجوال', exp: '12 عاماً', rating: 4.9, courses: 8, icon: '👨‍💻' },
    { name: 'عبدالرحمن السالم', specialty: 'إدارة المشاريع PMP & PRINCE2', exp: '15 عاماً', rating: 4.8, courses: 6, icon: '📋' },
    { name: 'نورة الشمري', specialty: 'الذكاء الاصطناعي والبيانات', exp: '9 أعوام', rating: 4.9, courses: 5, icon: '🤖' },
    { name: 'فيصل العتيبي', specialty: 'الأمن السيبراني والشبكات', exp: '11 عاماً', rating: 4.7, courses: 7, icon: '🔒' },
  ];

  const heroPrograms = [
    { name: 'تطوير ويب', start: 'يبدأ 15 يناير', seats: 8, live: true },
    { name: 'PMP', start: 'يبدأ 20 يناير', seats: 5, live: true },
    { name: 'الذكاء الاصطناعي', start: 'يبدأ 1 فبراير', seats: 6, live: false },
    { name: 'أمن سيبراني', start: 'يبدأ 10 فبراير', seats: 3, live: false },
  ];

  const statsBar = [
    { value: '120+', label: 'دورة تدريبية' },
    { value: '2800+', label: 'خريج ناجح' },
    { value: '40+', label: 'مدرب خبير' },
    { value: '15', label: 'قاعة تدريبية' },
    { value: '95%', label: 'رضا المتدربين' },
  ];

  return (
    <div style={{ fontFamily: font, backgroundColor: BG, color: TEXT, minHeight: '100vh', direction: 'rtl' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #06060E; } ::-webkit-scrollbar-thumb { background: ${P}40; border-radius: 4px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px ${P}30} 50%{box-shadow:0 0 40px ${P}60} }
      `}} />

      {/* ===== NAVBAR ===== */}
      <nav style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 100, backdropFilter: 'blur(24px) saturate(1.8)', background: 'rgba(6,6,14,0.88)', borderBottom: `1px solid ${BD}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: `linear-gradient(135deg,${P},${S})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
              {data.logo ? <img src={data.logo} alt="" style={{ width: '100%', height: '100%', borderRadius: 11, objectFit: 'cover' }} /> : data.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{data.name || 'مركز الإبداع للتدريب'}</div>
              <div style={{ fontSize: 10, color: MUT, fontWeight: 500 }}>مركز تدريب معتمد · TVTC</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {navLinks.map((link, i) => (
              <button key={i} onClick={() => setActiveNav(link)} style={{ background: activeNav === link ? `${P}18` : 'transparent', border: `1px solid ${activeNav === link ? P + '40' : 'transparent'}`, borderRadius: 8, padding: '7px 14px', color: activeNav === link ? P : DIM, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>{link}</button>
            ))}
            <div style={{ width: 1, height: 24, background: BD, margin: '0 8px' }} />
            <button onClick={() => setShowLogin(true)} style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 9, padding: '7px 16px', color: DIM, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>دخول</button>
            <button style={{ background: `linear-gradient(135deg,${P},${S})`, border: 'none', borderRadius: 9, padding: '8px 18px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 16px ${P}30` }}>سجّل الآن</button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ paddingTop: 110, paddingBottom: 64, padding: '110px 24px 64px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 460px', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${P}18`, border: `1px solid ${P}40`, borderRadius: 20, padding: '6px 16px', fontSize: 12, color: P, fontWeight: 700, marginBottom: 22 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: P, animation: 'pulse 2s infinite', display: 'inline-block' }} />
              التسجيل مفتوح الآن
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.13, marginBottom: 18, letterSpacing: -0.5 }}>
              طوّر مهاراتك<br />
              <span style={{ background: `linear-gradient(135deg,${P},${A})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>مع أقوى البرامج</span>
            </h1>
            <p style={{ fontSize: 16, color: DIM, lineHeight: 1.75, marginBottom: 32, maxWidth: 460 }}>
              {data.description || 'نقدم برامج تدريبية معتمدة عالمياً تلبي متطلبات سوق العمل وتصنع كوادر بشرية متميزة في مختلف المجالات التقنية والإدارية.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 32 }}>
              {[['2800', 'خريج'], ['95%', 'رضا'], ['120+', 'دورة'], ['40+', 'مدرب']].map(([v, l], i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: i % 2 === 0 ? P : GOLD }}>{v}</div>
                  <div style={{ fontSize: 11, color: MUT, fontWeight: 500, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ background: `linear-gradient(135deg,${P},${S})`, border: 'none', borderRadius: 12, padding: '13px 30px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 6px 24px ${P}35` }}>تصفح البرامج</button>
              <button style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 12, padding: '13px 22px', color: DIM, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>تحدث معنا</button>
            </div>
          </div>

          {/* Hero Card */}
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 20, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>البرامج النشطة</div>
              <div style={{ fontSize: 11, color: P, background: `${P}18`, padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>4 برامج</div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {heroPrograms.map((prog, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BD}`, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{prog.name}</div>
                    <div style={{ fontSize: 11, color: MUT, marginTop: 3 }}>{prog.start}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: prog.seats <= 5 ? '#EF4444' : '#10B981', background: prog.seats <= 5 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>
                      {prog.seats} مقعد متاح
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: 14, background: `linear-gradient(135deg,${P},${S})`, border: 'none', borderRadius: 11, padding: '11px 0', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>احجز مقعدك الآن</button>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <div style={{ maxWidth: 1160, margin: '0 auto 64px', padding: '0 24px' }}>
        <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: '28px 36px', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 0 }}>
          {statsBar.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderLeft: i < 4 ? `1px solid ${BD}` : 'none', padding: '0 12px' }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: i % 2 === 0 ? P : GOLD }}>{s.value}</div>
              <div style={{ fontSize: 12, color: MUT, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== PROGRAMS ===== */}
      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-block', background: `${P}18`, border: `1px solid ${P}30`, borderRadius: 20, padding: '5px 16px', fontSize: 12, color: P, fontWeight: 700, marginBottom: 12 }}>برامجنا التدريبية</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 10 }}>اختر مسارك المهني</h2>
            <p style={{ fontSize: 15, color: DIM, maxWidth: 480, margin: '0 auto' }}>برامج متخصصة تأهّلك للعمل فور التخرج بشهادة معترف بها</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {programs.map((prog, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 18, padding: 24, transition: 'all .25s', cursor: 'pointer' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.borderColor = P + '40'; el.style.boxShadow = `0 12px 40px ${P}15`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = BD; el.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: prog.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{prog.icon}</div>
                  <div style={{ fontSize: 11, color: prog.seats <= 5 ? '#EF4444' : '#10B981', background: prog.seats <= 5 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>{prog.seats} مقاعد متبقية</div>
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{prog.name}</div>
                <div style={{ fontSize: 12, color: DIM, marginBottom: 4 }}>{prog.level}</div>
                <div style={{ fontSize: 12, color: MUT, marginBottom: 16 }}>المدة: {prog.duration}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${BD}`, paddingTop: 14 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: P }}>{prog.price.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: MUT }}>ريال سعودي</div>
                  </div>
                  <button style={{ background: `${P}18`, border: `1px solid ${P}30`, borderRadius: 9, padding: '8px 16px', color: P, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>سجّل الآن</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRAINERS ===== */}
      <section style={{ padding: '0 24px 72px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', paddingTop: 56 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-block', background: `${GOLD}18`, border: `1px solid ${GOLD}30`, borderRadius: 20, padding: '5px 16px', fontSize: 12, color: GOLD, fontWeight: 700, marginBottom: 12 }}>نخبة المدربين</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 10 }}>تعلّم على يد الخبراء</h2>
            <p style={{ fontSize: 15, color: DIM, maxWidth: 460, margin: '0 auto' }}>مدربون معتمدون بخبرات دولية يضمنون جودة التعلم</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {trainers.map((t, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 18, padding: 24, textAlign: 'center', transition: 'all .25s', cursor: 'pointer' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.borderColor = GOLD + '40'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = BD; }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: `linear-gradient(135deg,${P}30,${GOLD}30)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 14px', border: `2px solid ${GOLD}25` }}>{t.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: DIM, marginBottom: 8, lineHeight: 1.5 }}>{t.specialty}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: GOLD }}>⭐ {t.rating}</div>
                    <div style={{ fontSize: 10, color: MUT }}>التقييم</div>
                  </div>
                  <div style={{ width: 1, background: BD }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: P }}>{t.courses}</div>
                    <div style={{ fontSize: 10, color: MUT }}>دورات</div>
                  </div>
                  <div style={{ width: 1, background: BD }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: DIM }}>{t.exp}</div>
                    <div style={{ fontSize: 10, color: MUT }}>خبرة</div>
                  </div>
                </div>
                <button style={{ width: '100%', background: `${GOLD}15`, border: `1px solid ${GOLD}25`, borderRadius: 9, padding: '8px 0', color: GOLD, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>عرض الملف</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CERTIFICATES ===== */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', background: `${P}18`, border: `1px solid ${P}30`, borderRadius: 20, padding: '5px 16px', fontSize: 12, color: P, fontWeight: 700, marginBottom: 16 }}>شهاداتنا المعتمدة</div>
              <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 14 }}>شهادة تفتح لك الأبواب</h2>
              <p style={{ fontSize: 15, color: DIM, lineHeight: 1.75, marginBottom: 28 }}>شهاداتنا معتمدة من المؤسسة العامة للتدريب التقني والمهني TVTC ومعترف بها دولياً.</p>
              <div style={{ display: 'grid', gap: 14 }}>
                {[
                  { icon: '🏛️', title: 'اعتماد TVTC', desc: 'معتمد من المؤسسة العامة للتدريب المهني السعودية' },
                  { icon: '🌐', title: 'اعتراف دولي', desc: 'شهادات معترف بها في أكثر من 40 دولة حول العالم' },
                  { icon: '📱', title: 'التحقق بـ QR', desc: 'رمز QR فريد لكل شهادة للتحقق الفوري من صحتها' },
                  { icon: '💼', title: 'ملف الإنجاز', desc: 'محفظة رقمية احترافية تعرض مهاراتك وإنجازاتك' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${P}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: DIM, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 20, padding: 28 }}>
              <div style={{ background: `linear-gradient(135deg,${P}20,${GOLD}10)`, border: `2px solid ${GOLD}40`, borderRadius: 16, padding: 28, textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>شهادة إتمام الدورة</div>
                <div style={{ fontSize: 13, color: DIM, marginBottom: 12 }}>مُنحت لـ: أحمد محمد العمري</div>
                <div style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>دورة تطوير الويب المتكاملة</div>
                <div style={{ width: 60, height: 60, background: `${P}20`, border: `1px solid ${P}40`, borderRadius: 8, margin: '14px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: DIM }}>QR</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[['تطوير ويب', P], ['PMP', '#8B5CF6'], ['أمن سيبراني', '#10B981'], ['الذكاء الاصطناعي', '#EC4899']].map(([name, color], i) => (
                  <div key={i} style={{ background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color }}>{name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ background: `linear-gradient(135deg,${P}22,${S}15,rgba(6,6,14,.8))`, border: `1px solid ${P}35`, borderRadius: 24, padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: `${P}08`, borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, background: `${GOLD}06`, borderRadius: '50%' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'inline-block', background: `${GOLD}20`, border: `1px solid ${GOLD}40`, borderRadius: 20, padding: '5px 16px', fontSize: 12, color: GOLD, fontWeight: 700, marginBottom: 16 }}>عرض محدود</div>
              <h2 style={{ fontSize: 38, fontWeight: 900, marginBottom: 10 }}>
                خصم <span style={{ color: P }}>15%</span> للتسجيل المبكر
              </h2>
              <p style={{ fontSize: 15, color: DIM, marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>سجّل قبل نهاية الشهر واحصل على خصم 15% على أي برنامج تدريبي مع ضمان استرداد المبلغ خلال 7 أيام</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button style={{ background: `linear-gradient(135deg,${P},${S})`, border: 'none', borderRadius: 12, padding: '14px 32px', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 8px 28px ${P}35` }}>سجّل الآن واستفد</button>
                <button style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 12, padding: '14px 22px', color: DIM, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>تواصل معنا</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: `1px solid ${BD}`, padding: '40px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${P},${S})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>{(data.name || 'م').charAt(0)}</div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{data.name || 'مركز الإبداع للتدريب'}</div>
              </div>
              <p style={{ fontSize: 13, color: MUT, lineHeight: 1.7 }}>نبني الكفاءات ونطور المهارات ونصنع القادة في بيئة تعليمية عالمية المستوى.</p>
            </div>
            {[
              { title: 'روابط سريعة', links: ['البرامج التدريبية', 'فريق المدربين', 'الشهادات', 'عن المركز'] },
              { title: 'الدعم', links: ['تواصل معنا', 'الأسئلة الشائعة', 'سياسة الاسترداد', 'الشروط والأحكام'] },
              { title: 'التواصل', links: ['info@center.sa', '+966 50 000 0000', 'الرياض، المملكة العربية السعودية', 'الأحد - الخميس 8ص-5م'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 14 }}>{col.title}</div>
                {col.links.map((link, j) => (
                  <div key={j} style={{ fontSize: 12, color: MUT, marginBottom: 8, cursor: 'pointer' }}>{link}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: MUT }}>© {new Date().getFullYear()} {data.name || 'مركز الإبداع للتدريب'} — مدعوم بواسطة منصة متين</div>
            <div style={{ fontSize: 11, color: MUT }}>مركز تدريب معتمد · TVTC</div>
          </div>
        </div>
      </footer>

      {/* ===== LOGIN MODAL ===== */}
      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#0D0D1A', border: `1px solid ${BD}`, borderRadius: 20, padding: 32, width: '100%', maxWidth: 400, direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>تسجيل الدخول</div>
              <button onClick={() => setShowLogin(false)} style={{ background: 'none', border: 'none', color: MUT, fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: DIM, fontWeight: 600, display: 'block', marginBottom: 6 }}>البريد الإلكتروني</label>
              <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} type="email" placeholder="example@email.com" style={{ width: '100%', background: CARD, border: `1px solid ${BD}`, borderRadius: 10, padding: '11px 14px', color: TEXT, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 12, color: DIM, fontWeight: 600, display: 'block', marginBottom: 6 }}>كلمة المرور</label>
              <input value={loginPass} onChange={e => setLoginPass(e.target.value)} type="password" placeholder="••••••••" style={{ width: '100%', background: CARD, border: `1px solid ${BD}`, borderRadius: 10, padding: '11px 14px', color: TEXT, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
            </div>
            <button style={{ width: '100%', background: `linear-gradient(135deg,${P},${S})`, border: 'none', borderRadius: 11, padding: '12px 0', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}>دخول</button>
            <div style={{ textAlign: 'center', fontSize: 12, color: MUT }}>ليس لديك حساب؟ <span style={{ color: P, cursor: 'pointer', fontWeight: 700 }}>سجّل الآن</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingTemplate;
