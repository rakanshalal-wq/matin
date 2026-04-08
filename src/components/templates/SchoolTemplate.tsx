'use client';
import React, { useState } from 'react';

interface SchoolTemplateProps {
  data: {
    name: string;
    slug?: string;
    logo?: string;
    cover_image?: string;
    description?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    phone?: string;
    email?: string;
    address?: string;
    student_count?: number;
    teacher_count?: number;
    success_rate?: number;
    years?: number;
  };
}

const SchoolTemplate: React.FC<SchoolTemplateProps> = ({ data }) => {
  const [mobileNav, setMobileNav] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'bot', text: `أهلاً! أنا مساعد ${data.name} الذكي. يمكنني مساعدتك في الدروس، المنهج، وأي استفسار عن المدرسة. بماذا يمكنني مساعدتك؟ 😊` },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const pc = data.primary_color || '#1E88E5';
  const sc = data.secondary_color || '#0D47A1';
  const ac = data.accent_color || '#FFB300';
  const schoolName = data.name || 'المدرسة';

  const sendAI = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    setTimeout(() => {
      const responses = [
        'سؤال ممتاز! دعني أشرح لك بالتفصيل...',
        'بكل سرور 😊 الإجابة هي...',
        'هذا موضوع مهم في المنهج. الجواب هو...',
      ];
      setAiMessages(prev => [...prev, { role: 'bot', text: responses[Math.floor(Math.random() * responses.length)] + ' (هذا عرض توضيحي)' }]);
    }, 900);
  };

  return (
    <div style={{ background: '#06060E', color: '#EEEEF5', minHeight: '100vh', direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', sans-serif", position: 'relative', overflow: 'hidden' }}>

      {/* ════ NAVBAR ════ */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 28px', height: 64, background: 'rgba(6,6,14,0.85)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${pc}, ${sc})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
            {data.logo ? <img src={data.logo} alt="" style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover' }} /> : '🏫'}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#EEEEF5' }}>{schoolName}</div>
            <div style={{ fontSize: 9, color: 'rgba(238,238,245,0.35)', fontWeight: 600 }}>مدعومة بمنصة متين</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {['الخدمات', 'المتجر', 'المكتبة', 'الأنشطة', 'الإعلانات', 'التسجيل'].map((label, i) => (
            <a key={i} href={`#${['services', 'store', 'library', 'activities', 'announcements', 'register'][i]}`} style={{ color: 'rgba(238,238,245,0.55)', fontSize: 12, fontWeight: 600, textDecoration: 'none', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>
              {label}
            </a>
          ))}
          <button style={{ background: `linear-gradient(135deg, ${pc}, ${sc})`, border: 'none', borderRadius: 9, padding: '8px 18px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>
            تسجيل الدخول
          </button>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section style={{ paddingTop: 100, paddingBottom: 0, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `rgba(${parseInt(pc.slice(1, 3), 16)},${parseInt(pc.slice(3, 5), 16)},${parseInt(pc.slice(5, 7), 16)},0.08)`, border: `1px solid rgba(${parseInt(pc.slice(1, 3), 16)},${parseInt(pc.slice(3, 5), 16)},${parseInt(pc.slice(5, 7), 16)},0.2)`, borderRadius: 20, padding: '5px 14px', fontSize: 11, color: pc, fontWeight: 700, marginBottom: 20 }}>
              🏫 بوابة {schoolName} الإلكترونية
            </div>
            <h1 style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.12, marginBottom: 16, letterSpacing: '-0.5px' }}>
              نصنع قادة المستقبل<br /><span style={{ color: pc }}>بأحدث المعايير</span>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(238,238,245,0.45)', lineHeight: 1.75, marginBottom: 28, maxWidth: 480 }}>
              {data.description || 'مؤسسة تعليمية متكاملة تضم مدرسة وروضة وحضانة — بيئة تعليمية متميزة مع تقنية متين المتكاملة.'}
            </p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 36 }}>
              <a href="#register" style={{ textDecoration: 'none', background: `linear-gradient(135deg, ${pc}, ${sc})`, color: '#fff', border: 'none', borderRadius: 11, padding: '12px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                سجّل ابنك الآن ←
              </a>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 11, padding: '12px 22px', color: 'rgba(238,238,245,0.7)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                جولة افتراضية
              </button>
            </div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { n: `${data.student_count || 1200}+`, l: 'طالب وطالبة', c: pc },
                { n: `${data.teacher_count || 85}+`, l: 'معلم ومعلمة', c: '#10B981' },
                { n: `${data.success_rate || 98}%`, l: 'نسبة النجاح', c: '#A78BFA' },
                { n: `${data.years || 15}+`, l: 'سنة خبرة', c: '#FB923C' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.c, marginBottom: 2 }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: 'rgba(238,238,245,0.4)', fontWeight: 600 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Info Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, position: 'sticky', top: 80 }}>
            <div style={{ width: '100%', height: 200, borderRadius: 14, background: `linear-gradient(135deg, ${pc}22, ${sc}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 60, border: '1px solid rgba(255,255,255,0.05)' }}>
              {data.cover_image ? <img src={data.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} /> : '🏫'}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#EEEEF5', marginBottom: 6 }}>{schoolName}</div>
            <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.4)', marginBottom: 14 }}>مدرسة · روضة · حضانة</div>
            {[
              { icon: '📍', label: data.address || 'حي النزهة، الرياض' },
              { icon: '📞', label: data.phone || '966-11-XXXXXXX+' },
              { icon: '📧', label: data.email || 'info@school.edu.sa' },
              { icon: '⏰', label: 'الأحد — الخميس 7:00-3:00' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(238,238,245,0.5)', padding: '6px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span>{item.icon}</span> {item.label}
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
              <button style={{ background: `linear-gradient(135deg, ${pc}, ${sc})`, border: 'none', borderRadius: 10, padding: '10px 0', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                تواصل معنا
              </button>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 0', color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                مشاركة
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════ SERVICES ════ */}
      <section id="services" style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: 'rgba(238,238,245,0.5)', fontWeight: 700, marginBottom: 12 }}>
              ⚡ خدمات المدرسة
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 900 }}>كل ما يحتاجه ولي الأمر <span style={{ color: pc }}>في مكان واحد</span></h2>
            <p style={{ fontSize: 13, color: 'rgba(238,238,245,0.4)', marginTop: 8 }}>خدمات متكاملة — الدراسة، الدفع، الأنشطة، التواصل، وأكثر</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { icon: '🏪', title: 'المتجر الإلكتروني', desc: 'الزي، الكتب، الأدوات — توصيل لباب بيتك', color: '#7a4a1a', color2: '#5c3510' },
              { icon: '📚', title: 'المكتبة الرقمية', desc: 'مراجع، كتب، مقاطع تعليمية مجانية', color: '#1a5a7a', color2: '#0f3d56' },
              { icon: '🎯', title: 'الأنشطة والفعاليات', desc: 'رحلات، بطولات، نوادي — سجّل مباشرة', color: '#1a7a4a', color2: '#0f5c35' },
              { icon: '📣', title: 'الإعلانات والأخبار', desc: 'آخر مستجدات المدرسة والجدول الدراسي', color: '#7a1a1a', color2: '#5c0f0f' },
              { icon: '🤝', title: 'الملتقى المجتمعي', desc: 'تواصل مع أولياء الأمور والإدارة', color: '#5a1a7a', color2: '#3d0f5c' },
              { icon: '🤖', title: 'المساعد الذكي AI', desc: 'إجابة فورية على أسئلة المنهج 24/7', color: '#1a4a7a', color2: '#0f3566' },
            ].map((svc, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 18, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${svc.color}, ${svc.color2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>
                  {svc.icon}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#EEEEF5', marginBottom: 6 }}>{svc.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(238,238,245,0.4)', lineHeight: 1.5 }}>{svc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ QUICK ACTIONS ════ */}
      <section style={{ padding: '40px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>🔗 وصول سريع</h2>
            <p style={{ fontSize: 12, color: 'rgba(238,238,245,0.35)', marginTop: 4 }}>اختصارات لأهم الخدمات — اضغط مباشرة</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {[
              { icon: '✅', title: 'تسجيل الحضور', sub: 'متابعة يومية', c1: '#1a7a4a', c2: '#0f5c35' },
              { icon: '📋', title: 'الدرجات والنتائج', sub: 'اختبارات وواجبات', c1: '#1a4a7a', c2: '#0f3566' },
              { icon: '📍', title: 'تتبع GPS', sub: 'موقع ابنك الآن', c1: '#1a4a7a', c2: '#0f3566' },
              { icon: '🚌', title: 'GPS الباص', sub: 'تتبع مسار الباص', c1: '#7a4a1a', c2: '#5c3510' },
              { icon: '💬', title: 'راسل المعلم', sub: 'تواصل مباشر', c1: '#5a1a7a', c2: '#3d0f5c' },
              { icon: '💳', title: 'دفع الرسوم', sub: 'مدى · فيزا · Apple Pay', c1: '#7a1a1a', c2: '#5c0f0f' },
              { icon: '📊', title: 'المساعد الذكي', sub: 'أسئلة دراسية 24/7', c1: '#1a5a7a', c2: '#0f3d56' },
              { icon: '📖', title: 'المكتبة الرقمية', sub: 'كتب ومراجع مجانية', c1: '#1a4a7a', c2: '#0f3566' },
              { icon: '📝', title: 'تقديم عذر', sub: 'غياب أو تأخر', c1: '#1a7a4a', c2: '#0f5c35' },
              { icon: '🏅', title: 'الشهادات', sub: 'شهادات وسجلات', c1: '#7a6a1a', c2: '#5c500f' },
              { icon: '🛍️', title: 'المتجر', sub: 'زي وكتب وأدوات', c1: '#7a4a1a', c2: '#5c3510' },
              { icon: '📅', title: 'الجدول الدراسي', sub: 'جدول الفصل الكامل', c1: '#1a4a7a', c2: '#0f3566' },
            ].map((qa, i) => (
              <a key={i} href="#" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: `linear-gradient(135deg, ${qa.c1}, ${qa.c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 8px' }}>
                  {qa.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#EEEEF5', marginBottom: 2 }}>{qa.title}</div>
                <div style={{ fontSize: 9.5, color: 'rgba(238,238,245,0.35)' }}>{qa.sub}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════ AI ASSISTANT ════ */}
      <section style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: 'rgba(238,238,245,0.5)', fontWeight: 700, marginBottom: 12 }}>
                🤖 الذكاء الاصطناعي
              </div>
              <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12 }}>
                مساعد مخصص<br />لطلاب <span style={{ color: pc }}>{schoolName}</span>
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(238,238,245,0.4)', lineHeight: 1.7, marginBottom: 20 }}>
                مساعد ذكي يعرف منهج المدرسة ويجيب على أسئلة الطلاب في أي وقت — رياضيات، علوم، عربي، وأكثر.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['يعرف مناهج المدرسة وكتبها المقررة', 'يشرح الدروس بطرق مختلفة حتى يفهم الطالب', 'يحل المسائل خطوة بخطوة', 'متاح 24/7 — حتى وقت الامتحانات', 'يرد على ولي الأمر باستفسارات المدرسة'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(238,238,245,0.5)' }}>
                    <span style={{ color: '#10B981' }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
            {/* AI Chat Demo */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `rgba(${parseInt(ac.slice(1, 3), 16)},${parseInt(ac.slice(3, 5), 16)},${parseInt(ac.slice(5, 7), 16)},0.15)`, border: `1px solid rgba(${parseInt(ac.slice(1, 3), 16)},${parseInt(ac.slice(3, 5), 16)},${parseInt(ac.slice(5, 7), 16)},0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#EEEEF5' }}>مساعد {schoolName} الذكي</div>
                  <div style={{ fontSize: 11, color: 'rgba(16,185,129,0.8)', fontWeight: 600 }}>● نشط الآن</div>
                </div>
              </div>
              <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 0', marginBottom: 10 }}>
                {aiMessages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: msg.role === 'bot' ? `rgba(${parseInt(ac.slice(1, 3), 16)},${parseInt(ac.slice(3, 5), 16)},${parseInt(ac.slice(5, 7), 16)},0.12)` : `rgba(${parseInt(pc.slice(1, 3), 16)},${parseInt(pc.slice(3, 5), 16)},${parseInt(pc.slice(5, 7), 16)},0.12)`, border: `1px solid ${msg.role === 'bot' ? `rgba(${parseInt(ac.slice(1, 3), 16)},${parseInt(ac.slice(3, 5), 16)},${parseInt(ac.slice(5, 7), 16)},0.22)` : `rgba(${parseInt(pc.slice(1, 3), 16)},${parseInt(pc.slice(3, 5), 16)},${parseInt(pc.slice(5, 7), 16)},0.22)`}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                      {msg.role === 'bot' ? '🤖' : '👦'}
                    </div>
                    <div style={{ background: msg.role === 'bot' ? 'rgba(255,255,255,0.04)' : `rgba(${parseInt(pc.slice(1, 3), 16)},${parseInt(pc.slice(3, 5), 16)},${parseInt(pc.slice(5, 7), 16)},0.1)`, border: `1px solid ${msg.role === 'bot' ? 'rgba(255,255,255,0.08)' : `rgba(${parseInt(pc.slice(1, 3), 16)},${parseInt(pc.slice(3, 5), 16)},${parseInt(pc.slice(5, 7), 16)},0.2)`}`, borderRadius: 12, padding: '10px 14px', fontSize: 12.5, color: 'rgba(238,238,245,0.75)', lineHeight: 1.6, maxWidth: '80%' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendAI()} placeholder="اسأل عن أي درس أو استفسار..." style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 12, outline: 'none', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }} />
                <button onClick={sendAI} style={{ background: `linear-gradient(135deg, ${pc}, ${sc})`, border: 'none', borderRadius: 10, padding: '10px 18px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                  إرسال
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ STORE ════ */}
      <section id="store" style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: 'rgba(238,238,245,0.5)', fontWeight: 700, marginBottom: 12 }}>🏪 المتجر</div>
            <h2 style={{ fontSize: 30, fontWeight: 900 }}>متجر <span style={{ color: pc }}>{schoolName}</span></h2>
            <p style={{ fontSize: 13, color: 'rgba(238,238,245,0.4)', marginTop: 8 }}>الزي الرسمي، الكتب، الأدوات المدرسية — توصيل لباب بيتك</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { icon: '👔', name: 'الزي المدرسي الرسمي', price: '69 SAR', old: '85 SAR', c1: '#1a4a7a', c2: '#0f3566' },
              { icon: '🎒', name: 'حقيبة المدرسة — مرحلة أولى', price: '249 SAR', old: '', c1: '#5a1a7a', c2: '#3d0f5c' },
              { icon: '✏️', name: 'طقم الأدوات المدرسية', price: '42 SAR', old: '55 SAR', c1: '#1a7a4a', c2: '#0f5c35' },
              { icon: '📒', name: 'كراسات المدرسة — حزمة سنوية', price: '35 SAR', old: '', c1: '#7a4a1a', c2: '#5c3510' },
            ].map((p, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ height: 100, background: `linear-gradient(135deg, ${p.c1}, ${p.c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                  {p.icon}
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEEF5', marginBottom: 6 }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      {p.old && <span style={{ fontSize: 11, color: 'rgba(238,238,245,0.3)', textDecoration: 'line-through', marginLeft: 6 }}>{p.old}</span>}
                      <span style={{ fontSize: 16, fontWeight: 800, color: ac }}>{p.price}</span>
                    </div>
                    <button style={{ background: `rgba(${parseInt(ac.slice(1, 3), 16)},${parseInt(ac.slice(3, 5), 16)},${parseInt(ac.slice(5, 7), 16)},0.15)`, border: `1px solid rgba(${parseInt(ac.slice(1, 3), 16)},${parseInt(ac.slice(3, 5), 16)},${parseInt(ac.slice(5, 7), 16)},0.3)`, borderRadius: 8, padding: '6px 14px', color: ac, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                      أضف للسلة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ LIBRARY ════ */}
      <section id="library" style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: 'rgba(238,238,245,0.5)', fontWeight: 700, marginBottom: 12 }}>📚 المكتبة الرقمية</div>
            <h2 style={{ fontSize: 30, fontWeight: 900 }}>مكتبة <span style={{ color: pc }}>{schoolName} الرقمية</span></h2>
            <p style={{ fontSize: 13, color: 'rgba(238,238,245,0.4)', marginTop: 8 }}>مراجع، كتب، مقاطع تعليمية — مجانية لجميع طلاب المدرسة</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { icon: '📖', title: 'كتاب الرياضيات — الصف الرابع', meta: 'المنهج الوطني المطور · PDF', tag: 'مقرر', tagBg: 'rgba(96,165,250,0.1)', tagColor: '#60A5FA', c1: '#1a4a7a', c2: '#0f3566' },
              { icon: '🧪', title: 'مقاطع تجارب العلوم', meta: '12 مقطع · جميع المراحل', tag: 'فيديو', tagBg: 'rgba(16,185,129,0.1)', tagColor: '#10B981', c1: '#1a7a4a', c2: '#0f5c35' },
              { icon: '✍️', title: 'قصص اللغة العربية', meta: 'مكتبة القراءة الحرة · 80 قصة', tag: 'قراءة', tagBg: 'rgba(167,139,250,0.1)', tagColor: '#A78BFA', c1: '#5a1a7a', c2: '#3d0f5c' },
              { icon: '📊', title: 'بنك مسائل الرياضيات', meta: '+500 مسألة محلولة بالتفصيل', tag: 'تدريب', tagBg: 'rgba(251,146,60,0.1)', tagColor: '#FB923C', c1: '#7a4a1a', c2: '#5c3510' },
              { icon: '🌍', title: 'دروس اللغة الإنجليزية', meta: 'مستويات متعددة · صوت وصورة', tag: 'لغة', tagBg: `rgba(${parseInt(ac.slice(1, 3), 16)},${parseInt(ac.slice(3, 5), 16)},${parseInt(ac.slice(5, 7), 16)},0.1)`, tagColor: ac, c1: '#7a6a1a', c2: '#5c500f' },
              { icon: '🕌', title: 'مراجع التربية الإسلامية', meta: 'قرآن + أحاديث + فقه', tag: 'ديني', tagBg: 'rgba(34,211,238,0.1)', tagColor: '#22D3EE', c1: '#1a5a7a', c2: '#0f3d56' },
            ].map((lib, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${lib.c1}, ${lib.c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {lib.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEEF5', marginBottom: 3 }}>{lib.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.35)', marginBottom: 6 }}>{lib.meta}</div>
                  <span style={{ background: lib.tagBg, color: lib.tagColor, border: `1px solid ${lib.tagColor}33`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>{lib.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ ACTIVITIES ════ */}
      <section id="activities" style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: 'rgba(238,238,245,0.5)', fontWeight: 700, marginBottom: 12 }}>🎯 الأنشطة والفعاليات</div>
            <h2 style={{ fontSize: 30, fontWeight: 900 }}>أنشطة <span style={{ color: pc }}>هذا الفصل</span></h2>
            <p style={{ fontSize: 13, color: 'rgba(238,238,245,0.4)', marginTop: 8 }}>سجّل ابنك في الأنشطة والرحلات مباشرة من هنا</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { type: 'رحلة علمية', title: 'رحلة متحف العلوم والتقنية', desc: 'رحلة تعليمية لمتحف العلوم — للصفوف الرابع والخامس والسادس.', date: '5 أبريل', seats: '45 / 60 مقعد', color: pc, c1: '#1a4a7a', c2: '#0f3566' },
              { type: 'بطولة رياضية', title: 'بطولة كرة القدم المدرسية', desc: 'بطولة داخلية بين فصول المدرسة — جائزة للفريق الفائز.', date: '12 أبريل', seats: 'مفتوح — التسجيل للجميع', color: '#10B981', c1: '#1a7a4a', c2: '#0f5c35' },
              { type: 'نادي الفنون', title: 'نادي الفنون والرسم', desc: 'كل أسبوع يتعلم الطلاب فن جديد — رسم، نحت، خط عربي.', date: 'أسبوعي', seats: '20 / 25 مقعد', color: '#A78BFA', c1: '#5a1a7a', c2: '#3d0f5c' },
            ].map((act, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${act.c1}, ${act.c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {i === 0 ? '👥' : i === 1 ? '⏰' : '🎨'}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEEF5' }}>{act.type}</div>
                  <span style={{ marginRight: 'auto', background: `${act.color}18`, color: act.color, border: `1px solid ${act.color}33`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>{act.date}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#EEEEF5', marginBottom: 6 }}>{act.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(238,238,245,0.4)', lineHeight: 1.6, marginBottom: 14 }}>{act.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(238,238,245,0.3)' }}>{act.seats}</span>
                  <button style={{ background: `${act.color}22`, border: `1px solid ${act.color}44`, borderRadius: 8, padding: '6px 14px', color: act.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>سجّل ابنك</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ ANNOUNCEMENTS ════ */}
      <section id="announcements" style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: 'rgba(238,238,245,0.5)', fontWeight: 700, marginBottom: 12 }}>📣 الإعلانات</div>
                <h2 style={{ fontSize: 30, fontWeight: 900 }}>آخر إعلانات <span style={{ color: pc }}>المدرسة</span></h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { title: 'بداية التسجيل للفصل الثالث', body: `يسعد إدارة ${schoolName} الإعلان عن فتح باب التسجيل للفصل الدراسي الثالث.`, date: '25 مارس 2026', author: 'إدارة المدرسة', dot: '#ef4444', pinned: true },
                  { title: 'الاختبارات النهائية — جدول مؤقت', body: 'سيبدأ الاختبار النهائي للفصل الثاني في 15 أبريل. الجدول التفصيلي متاح على البوابة.', date: '22 مارس 2026', author: 'شؤون الطلاب', dot: pc, pinned: false },
                  { title: 'يوم التقدير والتكريم السنوي', body: 'دعوة لأولياء الأمور لحفل التكريم السنوي لطلاب التفوق يوم 8 أبريل.', date: '18 مارس 2026', author: 'الإدارة', dot: '#10B981', pinned: false },
                  { title: 'تحديث نظام متين — ميزات جديدة', body: 'تم تحديث تطبيق متين وإضافة ميزة تتبع GPS المحسّنة وبنك الأسئلة الجديد.', date: '15 مارس 2026', author: 'تقنية المعلومات', dot: '#FB923C', pinned: false },
                ].map((ann, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: ann.dot, boxShadow: `0 0 6px ${ann.dot}`, marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#EEEEF5' }}>{ann.title}</div>
                        {ann.pinned && <span style={{ background: '#ef444422', border: '1px solid #ef444444', color: '#ef4444', fontSize: 9, fontWeight: 700, padding: '1px 7px', borderRadius: 6 }}>مثبّت</span>}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'rgba(238,238,245,0.5)', lineHeight: 1.6, marginBottom: 6 }}>{ann.body}</div>
                      <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.25)' }}>📅 {ann.date} · {ann.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Calendar */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEEF5', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>📅 التقويم الدراسي</div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                {[
                  { date: '5 أبريل', event: 'رحلة متحف العلوم' },
                  { date: '8 أبريل', event: 'حفل التكريم السنوي' },
                  { date: '12 أبريل', event: 'بطولة كرة القدم' },
                  { date: '15 أبريل', event: 'بداية الاختبارات النهائية' },
                  { date: '30 أبريل', event: 'آخر يوم دراسي' },
                ].map((cal, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 36, height: 36, background: `rgba(${parseInt(pc.slice(1, 3), 16)},${parseInt(pc.slice(3, 5), 16)},${parseInt(pc.slice(5, 7), 16)},0.1)`, border: `1px solid rgba(${parseInt(pc.slice(1, 3), 16)},${parseInt(pc.slice(3, 5), 16)},${parseInt(pc.slice(5, 7), 16)},0.2)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#60A5FA', textAlign: 'center', flexShrink: 0 }}>
                      {cal.date.split(' ')[0]}<br />{cal.date.split(' ')[1]}
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#EEEEF5' }}>{cal.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ REGISTRATION ════ */}
      <section id="register" style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: 'rgba(238,238,245,0.5)', fontWeight: 700, marginBottom: 12 }}>📝 التسجيل</div>
              <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 24 }}>
                سجّل ابنك <span style={{ color: pc }}>الآن</span><br />بدون مراجعة المدرسة
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(238,238,245,0.5)', marginBottom: 4, display: 'block' }}>اسم الطالب</label>
                    <input placeholder="الاسم الكامل" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(238,238,245,0.5)', marginBottom: 4, display: 'block' }}>تاريخ الميلاد</label>
                    <input type="date" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(238,238,245,0.5)', marginBottom: 4, display: 'block' }}>المرحلة المطلوبة</label>
                    <select style={{ width: '100%', background: '#0B0B16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', fontFamily: "'IBM Plex Sans Arabic', sans-serif", cursor: 'pointer' }}>
                      <option style={{ background: '#0B0B16', color: '#EEEEF5' }}>-- اختر --</option>
                      <option style={{ background: '#0B0B16', color: '#EEEEF5' }}>الروضة — KG1</option>
                      <option style={{ background: '#0B0B16', color: '#EEEEF5' }}>الروضة — KG2</option>
                      <option style={{ background: '#0B0B16', color: '#EEEEF5' }}>الصف الأول الابتدائي</option>
                      <option style={{ background: '#0B0B16', color: '#EEEEF5' }}>الصف الثاني الابتدائي</option>
                      <option style={{ background: '#0B0B16', color: '#EEEEF5' }}>الصف الثالث الابتدائي</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(238,238,245,0.5)', marginBottom: 4, display: 'block' }}>اسم ولي الأمر</label>
                    <input placeholder="الاسم الكامل" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(238,238,245,0.5)', marginBottom: 4, display: 'block' }}>رقم الجوال</label>
                    <input placeholder="05XXXXXXXX" type="tel" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(238,238,245,0.5)', marginBottom: 4, display: 'block' }}>البريد الإلكتروني</label>
                    <input placeholder="example@email.com" type="email" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(238,238,245,0.5)', marginBottom: 4, display: 'block' }}>رقم الهوية / الإقامة</label>
                  <input placeholder="10XXXXXXXX أو رقم الإقامة" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(238,238,245,0.5)', marginBottom: 4, display: 'block' }}>ملاحظات إضافية (اختياري)</label>
                  <textarea placeholder="أي معلومات تريد إضافتها..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', fontFamily: "'IBM Plex Sans Arabic', sans-serif", resize: 'vertical', minHeight: 65 }} />
                </div>
                <button style={{ background: `linear-gradient(135deg, ${pc}, ${sc})`, border: 'none', borderRadius: 12, padding: '14px 28px', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif", width: '100%' }}>
                  تقديم طلب التسجيل ←
                </button>
              </div>
            </div>
            {/* Registration Info */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#EEEEF5', marginBottom: 16 }}>كيف يعمل التسجيل؟</div>
              {[
                { n: '1', t: 'أرسل الطلب', s: 'أملأ النموذج وأرسله — يصل للمدرسة فوراً' },
                { n: '2', t: 'مراجعة المدرسة', s: 'القبول والتسجيل يراجع طلبك خلال 24 ساعة' },
                { n: '3', t: 'تأكيد القبول', s: 'تصلك رسالة SMS بالقبول وبيانات الدخول' },
                { n: '4', t: 'سداد الرسوم', s: 'ادفع إلكترونياً — مدى أو فيزا أو Apple Pay' },
                { n: '5', t: 'ابنك جاهز', s: 'تفعيل حساب الطالب وحسابك كولي أمر في متين' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${pc}18`, border: `1px solid ${pc}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: pc, flexShrink: 0 }}>{step.n}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEEF5', marginBottom: 2 }}>{step.t}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(238,238,245,0.4)', lineHeight: 1.4 }}>{step.s}</div>
                  </div>
                </div>
              ))}
              {/* Fees */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 14, marginTop: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEEF5', marginBottom: 10 }}>رسوم القبول</div>
                {[
                  ['رسوم التسجيل (لمرة واحدة)', '500 SAR'],
                  ['رسوم الفصل الدراسي', '3,200 SAR'],
                  ['رسوم النقل (اختياري)', '1,200 SAR/فصل'],
                ].map(([l, v], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'rgba(238,238,245,0.5)' }}>{l}</span>
                    <strong style={{ color: '#EEEEF5' }}>{v}</strong>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.3)', marginTop: 8 }}>* الأسعار للمرحلة الابتدائية</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ COMMUNITY ════ */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: 'rgba(238,238,245,0.5)', fontWeight: 700, marginBottom: 12 }}>🤝 الملتقى المجتمعي</div>
            <h2 style={{ fontSize: 30, fontWeight: 900 }}>ملتقى أسرة <span style={{ color: pc }}>{schoolName}</span></h2>
            <p style={{ fontSize: 13, color: 'rgba(238,238,245,0.4)', marginTop: 8 }}>تواصل مع أولياء الأمور والمعلمين والإدارة — اسأل، شارك، تابع</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { av: '🏫', name: 'إدارة المدرسة', role: 'إدارة رسمية', time: 'منذ 3 ساعات', body: `تذكير: موعد سداد رسوم الفصل الثالث قبل 10 أبريل. يمكن الدفع إلكترونياً من البوابة مباشرة.`, likes: 15, comments: 3, color: pc },
                { av: '👩‍👦', name: 'أم عبدالله المطيري', role: 'ولي أمر', time: 'منذ ساعتين', body: 'ماشاءالله التطبيق ممتاز، أقدر أتابع ابني من البيت وأشوف درجاته فوراً. شكراً للإدارة', likes: 24, comments: 8, color: '#FB923C' },
                { av: '👨‍👦', name: 'أبو سارة الشمري', role: 'ولي أمر', time: 'أمس', body: 'سؤال: هل الرحلة العلمية تتطلب موافقة مكتوبة؟ وأين أسجّل البنت؟', likes: 4, comments: 6, color: '#A78BFA' },
                { av: '👨‍🏫', name: 'أ. محمد الغامدي', role: 'معلم رياضيات', time: 'قبل يومين', body: 'نبّه أولياء الأمور: الواجب النهائي لمادة الرياضيات موعد تسليمه الأسبوع القادم. التفاصيل على التطبيق.', likes: 11, comments: 2, color: '#10B981' },
              ].map((post, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${post.color}18`, border: `1px solid ${post.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{post.av}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEEF5' }}>{post.name}</div>
                      <div style={{ fontSize: 10.5, color: 'rgba(238,238,245,0.4)' }}>{post.role} · {post.time}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(238,238,245,0.7)', lineHeight: 1.65, marginBottom: 14 }}>{post.body}</div>
                  <div style={{ display: 'flex', gap: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(238,238,245,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>&#128077; {post.likes}</button>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(238,238,245,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>&#128172; {post.comments} تعليق</button>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(238,238,245,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>مشاركة</button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 18, marginBottom: 14 }}>
                <textarea placeholder={`شارك رأيك مع أسرة ${schoolName}...`} style={{ width: '100%', background: 'none', border: 'none', color: '#EEEEF5', fontSize: 13, fontFamily: "'IBM Plex Sans Arabic', sans-serif", outline: 'none', resize: 'none', minHeight: 80 }} />
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={{ background: `linear-gradient(135deg, ${pc}, ${sc})`, border: 'none', borderRadius: 9, padding: '8px 20px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>نشر</button>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEEF5', marginBottom: 12 }}>الأكثر تفاعلاً</div>
                {[
                  { name: 'أم عبدالله', posts: 24, color: '#FB923C' },
                  { name: 'أ. محمد الغامدي', posts: 18, color: '#10B981' },
                  { name: 'إدارة المدرسة', posts: 15, color: pc },
                  { name: 'أبو سارة', posts: 12, color: '#A78BFA' },
                ].map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${u.color}18`, border: `1px solid ${u.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: u.color }}>{i + 1}</div>
                    <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#EEEEF5' }}>{u.name}</div>
                    <span style={{ fontSize: 11, color: 'rgba(238,238,245,0.35)' }}>{u.posts} مشاركة</span>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.3)', marginTop: 10, textAlign: 'center' }}>290 عضو في الملتقى</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${pc}, ${sc})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏫</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#EEEEF5' }}>{schoolName}</div>
                  <div style={{ fontSize: 10, color: 'rgba(238,238,245,0.3)' }}>matin.ink/school/{data.slug || 'school'}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(238,238,245,0.4)', lineHeight: 1.7, marginBottom: 12 }}>
                {data.description || 'مؤسسة تعليمية متكاملة — بيئة تعليمية متميزة مع تقنية متين المتكاملة.'}
              </p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#EEEEF5', marginBottom: 12 }}>الخدمات</div>
              {['خدمات المدرسة', 'المتجر الإلكتروني', 'المكتبة الرقمية', 'الأنشطة والفعاليات', 'الذكاء الاصطناعي'].map((l, i) => (
                <a key={i} href="#" style={{ display: 'block', fontSize: 12, color: 'rgba(238,238,245,0.4)', textDecoration: 'none', padding: '4px 0' }}>{l}</a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#EEEEF5', marginBottom: 12 }}>الوحدات</div>
              {['المدرسة الابتدائية', 'المدرسة المتوسطة', 'روضة', 'حضانة', 'التسجيل'].map((l, i) => (
                <a key={i} href="#" style={{ display: 'block', fontSize: 12, color: 'rgba(238,238,245,0.4)', textDecoration: 'none', padding: '4px 0' }}>{l}</a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#EEEEF5', marginBottom: 12 }}>تواصل معنا</div>
              <div style={{ fontSize: 12, color: 'rgba(238,238,245,0.4)', lineHeight: 2 }}>
                📞 {data.phone || '966-11-XXXXXXX+'}<br />
                📧 {data.email || 'info@school.edu.sa'}<br />
                📍 {data.address || 'حي النزهة، الرياض'}<br />
                ⏰ الأحد — الخميس 7:00-3:00
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 11, color: 'rgba(238,238,245,0.25)' }}>© {new Date().getFullYear()} {schoolName} — جميع الحقوق محفوظة</p>
            <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.25)' }}>مدعومة بـ <strong style={{ color: '#D4A843' }}>متين</strong> — نظام إدارة التعليم</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolTemplate;
