'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT_DIM = 'rgba(238,238,245,0.6)';
const TEXT_MUTED = 'rgba(238,238,245,0.3)';

export default function SchoolLandingPage({ params }: { params: { code: string } }) {
  const { code } = params;
  const [school, setSchool] = useState<any>(null);
  const [stats, setStats] = useState({ students: 380, teachers: 54, years: 15, satisfaction: 98 });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinForm, setJoinForm] = useState({ parent_name: '', student_name: '', grade: '', phone: '', email: '' });
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMsg, setJoinMsg] = useState('');
  const [activeSection, setActiveSection] = useState('hero');

  const PRIMARY = school?.primary_color || '#1E88E5';
  const SECONDARY = school?.secondary_color || '#0D47A1';
  const ACCENT = school?.accent_color || '#FFB300';

  useEffect(() => {
    fetch(`/api/schools/public/${code}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setSchool(d.school);
          if (d.stats) setStats(d.stats);
          if (d.announcements) setAnnouncements(d.announcements);
          if (d.activities) setActivities(d.activities);
          if (d.services) setServices(d.services);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code]);

  const submitJoin = async () => {
    if (!joinForm.parent_name || !joinForm.student_name || !joinForm.phone) return;
    setJoinLoading(true);
    setJoinMsg('');
    try {
      const res = await fetch(`/api/schools/public/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'join-request', ...joinForm }),
      });
      if (res.ok) {
        setJoinMsg('تم إرسال طلب التسجيل بنجاح! سنتواصل معك قريباً.');
        setJoinForm({ parent_name: '', student_name: '', grade: '', phone: '', email: '' });
      } else {
        setJoinMsg('حدث خطأ، يرجى المحاولة مجدداً.');
      }
    } catch {
      setJoinMsg('حدث خطأ، يرجى المحاولة مجدداً.');
    }
    setJoinLoading(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const DEFAULT_SERVICES = [
    { icon: '📚', title: 'التعليم الرقمي', desc: 'منهج متكامل مع كتب رقمية ومقاطع تعليمية تفاعلية', color: '#3B82F6', tag: 'متاح' },
    { icon: '📊', title: 'تتبع التقدم الأكاديمي', desc: 'اطلع على درجات ابنك وتقدمه في الوقت الفعلي', color: '#10B981', tag: 'مباشر' },
    { icon: '🚌', title: 'تتبع GPS للباص', desc: 'تعرف أين ابنك في أي وقت مع تنبيهات فورية', color: '#F59E0B', tag: 'مباشر' },
    { icon: '💬', title: 'التواصل المباشر', desc: 'محادثة مباشرة مع المعلمين وإدارة المدرسة', color: '#A78BFA', tag: 'متاح' },
    { icon: '🏆', title: 'الأنشطة والمسابقات', desc: 'برامج إثرائية متنوعة لتنمية مهارات الطالب', color: PRIMARY, tag: 'متاح' },
    { icon: '💳', title: 'الدفع الإلكتروني', desc: 'سدّد الرسوم الدراسية بأمان عبر بوابة الدفع', color: '#EF4444', tag: 'آمن' },
  ];

  const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;

  const DEFAULT_ANNOUNCEMENTS = [
    { title: 'بداية التسجيل للعام الدراسي القادم', body: 'يُسعد إدارة المدرسة الإعلان عن فتح باب التسجيل للعام الدراسي القادم. الأماكن محدودة.', date: '2026-01-15', pinned: true, color: PRIMARY },
    { title: 'اجتماع أولياء الأمور الفصلي', body: 'يُعقد اجتماع أولياء الأمور يوم الخميس القادم لمناقشة التقدم الأكاديمي للطلاب.', date: '2026-01-10', pinned: false, color: ACCENT },
  ];

  const DEFAULT_ACTIVITIES = [
    { icon: '🎨', title: 'معرض الفنون السنوي', desc: 'يتشرف الطلاب بعرض أعمالهم الفنية المبدعة', date: 'يناير 2026', color: '#A78BFA' },
    { icon: '⚽', title: 'دوري كرة القدم', desc: 'بطولة رياضية بين الفصول الدراسية', date: 'فبراير 2026', color: '#10B981' },
    { icon: '🔬', title: 'يوم العلوم', desc: 'تجارب علمية تفاعلية مفتوحة لجميع المراحل', date: 'مارس 2026', color: PRIMARY },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#06060E', color: '#fff', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏫</div>
          <div style={{ fontSize: '1.1rem', color: TEXT_DIM }}>جارٍ تحميل بوابة المدرسة…</div>
        </div>
      </div>
    );
  }

  const schoolName = school?.name || 'مدرسة الأمل الدولية';
  const schoolDesc = school?.description || 'سجّل ابنك، تابع دراسته، تواصل مع معلميه — كل شيء من مكان واحد بدون أي مراجعة.';

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', background: '#06060E', color: '#EEEEF5', minHeight: '100vh' }}>

      {/* ─── NAVBAR ─── */}
      <nav style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 200, backdropFilter: 'blur(20px)', background: 'rgba(6,6,14,0.9)', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>
              🏫
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{schoolName}</div>
              <div style={{ fontSize: 10, color: TEXT_MUTED }}>{`matin.ink/school/${code}`}</div>
            </div>
          </div>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-links">
            {['services', 'activities', 'announcements', 'register'].map(id => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ padding: '7px 14px', borderRadius: 8, background: 'transparent', border: 'none', color: TEXT_DIM, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                {{ services: 'خدماتنا', activities: 'الأنشطة', announcements: 'الإعلانات', register: 'التسجيل' }[id]}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/login">
              <button style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '8px 16px', color: TEXT_DIM, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                تسجيل الدخول
              </button>
            </Link>
            <button onClick={() => scrollTo('register')}
              style={{ background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', borderRadius: 9, padding: '8px 18px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 14px ${PRIMARY}40` }}>
              سجّل ابنك الآن
            </button>
            <button onClick={() => setMobileOpen(true)} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 9, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: TEXT_DIM }}>
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileOpen(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 280, height: '100%', background: '#090E16', borderLeft: `1px solid ${BORDER}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 6 }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setMobileOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, width: 36, height: 36, marginBottom: 12, cursor: 'pointer', color: TEXT_DIM }}>✕</button>
            {['services', 'activities', 'announcements', 'register'].map(id => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ padding: '11px 14px', borderRadius: 9, background: 'transparent', border: 'none', color: TEXT_DIM, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'right', fontFamily: 'inherit' }}>
                {{ services: 'خدماتنا', activities: 'الأنشطة', announcements: 'الإعلانات', register: 'التسجيل' }[id]}
              </button>
            ))}
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/login"><button style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: 11, color: TEXT_DIM, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>تسجيل الدخول</button></Link>
              <button onClick={() => scrollTo('register')} style={{ background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', borderRadius: 9, padding: 11, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>سجّل ابنك الآن</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '80px 24px 60px' }}>
        {/* BG */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 40%,${PRIMARY}18 0%,transparent 55%),radial-gradient(circle at 75% 60%,${ACCENT}10 0%,transparent 45%)` }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr min(480px,45%)', gap: 60, alignItems: 'center', position: 'relative', zIndex: 2, width: '100%' }}>
          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${PRIMARY}18`, border: `1px solid ${PRIMARY}30`, borderRadius: 20, padding: '6px 14px', fontSize: 12, color: '#60A5FA', fontWeight: 600, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60A5FA', display: 'inline-block' }} />
              مدرسة معتمدة على منصة متين
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: -1 }}>
              بوابتك الكاملة لـ
              <br />
              <span style={{ background: `linear-gradient(135deg,${PRIMARY},${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {schoolName}
              </span>
            </h1>
            <p style={{ fontSize: 16, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>{schoolDesc}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => scrollTo('register')}
                style={{ background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', borderRadius: 12, padding: '13px 28px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 8px 28px ${PRIMARY}30`, display: 'flex', alignItems: 'center', gap: 8 }}>
                + سجّل ابنك الآن
              </button>
              <button onClick={() => scrollTo('services')}
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '13px 24px', color: TEXT_DIM, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                ▶ تعرّف على المدرسة
              </button>
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: 28, marginTop: 32, flexWrap: 'wrap' }}>
              {[
                { v: `${stats.students}+`, l: 'طالب مسجّل' },
                { v: stats.teachers, l: 'معلم متخصص' },
                { v: `${stats.years}+`, l: 'سنة خبرة' },
                { v: `${stats.satisfaction}%`, l: 'رضا الأهالي' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Feature Card */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 20, padding: 20, backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏫</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{schoolName}</div>
                <div style={{ fontSize: 11, color: PRIMARY, fontWeight: 600, marginTop: 2 }}>● مفتوح للتسجيل — الفصل القادم</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { icon: '📚', label: 'منهج دراسي معتمد', sub: 'مدرسة + روضة + حضانة', color: PRIMARY },
                { icon: '🚌', label: 'تتبع GPS للباص', sub: 'تعرف أين ابنك في أي وقت', color: '#10B981' },
                { icon: '💬', label: 'تواصل مع المعلم', sub: 'رسائل ومكالمات مباشرة', color: ACCENT },
                { icon: '💳', label: 'دفع الرسوم إلكترونياً', sub: 'آمن وسريع وبدون طوابير', color: '#A78BFA' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: TEXT_DIM }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${f.color}15`, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#EEEEF5' }}>{f.label}</div>
                    <div style={{ fontSize: 10.5, color: TEXT_MUTED, marginTop: 1 }}>{f.sub}</div>
                  </div>
                  <span style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>متاح</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 20, padding: '5px 14px', fontSize: 11.5, color: TEXT_DIM, fontWeight: 600, marginBottom: 14 }}>
              خدمات المدرسة
            </div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,34px)', fontWeight: 800, marginBottom: 12 }}>
              كل ما تحتاجه{' '}
              <span style={{ background: `linear-gradient(135deg,${PRIMARY},${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                في مكان واحد
              </span>
            </h2>
            <p style={{ fontSize: 15, color: TEXT_DIM, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
              منصة متكاملة تجمع كل خدمات المدرسة — من التعليم إلى النقل والدفع
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {displayServices.map((s: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${s.color || PRIMARY}18`, border: `1px solid ${s.color || PRIMARY}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 24 }}>
                  {s.icon || '📚'}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: TEXT_DIM, lineHeight: 1.6 }}>{s.desc || s.description}</div>
                <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8, marginTop: 10, background: `${s.color || PRIMARY}18`, color: s.color || PRIMARY, border: `1px solid ${s.color || PRIMARY}30` }}>
                  {s.tag || 'متاح'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ANNOUNCEMENTS ─── */}
      <section id="announcements" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 800, marginBottom: 8 }}>📢 الإعلانات والأخبار</h2>
            <p style={{ fontSize: 14, color: TEXT_DIM }}>آخر الأخبار والإعلانات من إدارة المدرسة</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(announcements.length > 0 ? announcements : DEFAULT_ANNOUNCEMENTS).map((a: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.color || PRIMARY, flexShrink: 0, marginTop: 4 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{a.title}</div>
                    {a.pinned && <span style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>مثبّت</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: TEXT_DIM, lineHeight: 1.6 }}>{a.body}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 6 }}>{a.date ? new Date(a.date).toLocaleDateString('ar-SA') : a.created_at ? new Date(a.created_at).toLocaleDateString('ar-SA') : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ACTIVITIES ─── */}
      <section id="activities" style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 800, marginBottom: 8 }}>🏆 الأنشطة والفعاليات</h2>
            <p style={{ fontSize: 14, color: TEXT_DIM }}>برامج متنوعة لتنمية مهارات الطالب</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {(activities.length > 0 ? activities : DEFAULT_ACTIVITIES).map((a: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18, cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: `${a.color || PRIMARY}18`, border: `1px solid ${a.color || PRIMARY}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {a.icon || '🏆'}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 8, background: `${a.color || PRIMARY}18`, color: a.color || PRIMARY, border: `1px solid ${a.color || PRIMARY}30`, marginRight: 'auto' }}>
                    {a.date || a.event_date || 'قادماً'}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.6 }}>{a.desc || a.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REGISTER FORM ─── */}
      <section id="register" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ background: `linear-gradient(135deg,${PRIMARY}10,${SECONDARY}08)`, border: `1px solid ${PRIMARY}20`, borderRadius: 20, padding: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'min(400px,100%) 1fr', gap: 40, alignItems: 'start' }}>
              {/* Form */}
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>سجّل ابنك الآن</h2>
                <p style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 24, lineHeight: 1.7 }}>أرسل طلب التسجيل وسنتواصل معك خلال 24 ساعة</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { key: 'parent_name', ph: 'اسم ولي الأمر *' },
                      { key: 'student_name', ph: 'اسم الطالب *' },
                    ].map(({ key, ph }) => (
                      <input key={key} type="text" placeholder={ph} value={(joinForm as any)[key]}
                        onChange={e => setJoinForm(p => ({ ...p, [key]: e.target.value }))}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.1)`, color: '#EEEEF5', fontSize: 13, padding: '11px 14px', borderRadius: 10, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                    ))}
                  </div>
                  <select value={joinForm.grade} onChange={e => setJoinForm(p => ({ ...p, grade: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.1)`, color: joinForm.grade ? '#EEEEF5' : 'rgba(238,238,245,0.3)', fontSize: 13, padding: '11px 14px', borderRadius: 10, fontFamily: 'inherit', outline: 'none' }}>
                    <option value="">المرحلة الدراسية</option>
                    {['الروضة', 'الأول الابتدائي', 'الثاني الابتدائي', 'الثالث الابتدائي', 'الرابع الابتدائي', 'الخامس الابتدائي', 'السادس الابتدائي', 'الأول المتوسط', 'الثاني المتوسط', 'الثالث المتوسط', 'الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { key: 'phone', ph: 'رقم الجوال *', type: 'tel' },
                      { key: 'email', ph: 'البريد الإلكتروني', type: 'email' },
                    ].map(({ key, ph, type }) => (
                      <input key={key} type={type} placeholder={ph} value={(joinForm as any)[key]}
                        onChange={e => setJoinForm(p => ({ ...p, [key]: e.target.value }))}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.1)`, color: '#EEEEF5', fontSize: 13, padding: '11px 14px', borderRadius: 10, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                    ))}
                  </div>
                  {joinMsg && (
                    <div style={{ padding: '10px 14px', borderRadius: 9, background: joinMsg.includes('نجاح') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${joinMsg.includes('نجاح') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: joinMsg.includes('نجاح') ? '#10B981' : '#EF4444', fontSize: 13 }}>
                      {joinMsg}
                    </div>
                  )}
                  <button onClick={submitJoin} disabled={joinLoading || !joinForm.parent_name || !joinForm.student_name || !joinForm.phone}
                    style={{ background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', borderRadius: 12, padding: 13, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', width: '100%', boxShadow: `0 6px 20px ${PRIMARY}30`, opacity: (joinLoading || !joinForm.parent_name || !joinForm.student_name || !joinForm.phone) ? 0.6 : 1, marginTop: 4 }}>
                    {joinLoading ? 'جارٍ الإرسال…' : 'إرسال طلب التسجيل ←'}
                  </button>
                </div>
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 48 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT_DIM, marginBottom: 8 }}>كيف تسجّل ابنك؟</h3>
                {[
                  { n: '1', t: 'أرسل الطلب', s: 'أكمل النموذج بجانبك وأرسله في أقل من دقيقة' },
                  { n: '2', t: 'انتظر التواصل', s: 'سيتصل بك المسؤول خلال 24 ساعة لتأكيد الطلب' },
                  { n: '3', t: 'أكمل الأوراق', s: 'أحضر الوثائق المطلوبة لإتمام التسجيل الرسمي' },
                  { n: '4', t: 'ابدأ الدراسة', s: 'يحصل ابنك على حساب المنصة ويبدأ رحلته التعليمية' },
                ].map(step => (
                  <div key={step.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${PRIMARY}18`, border: `1px solid ${PRIMARY}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#60A5FA', flexShrink: 0 }}>{step.n}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 3 }}>{step.t}</div>
                      <div style={{ fontSize: 12, color: TEXT_DIM }}>{step.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#09111A', borderTop: `1px solid ${BORDER}`, padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏫</div>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{schoolName}</span>
              </div>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 16 }}>
                مدرسة معتمدة على منصة متين للتعليم الرقمي المتكامل
              </p>
            </div>
            {[
              { title: 'روابط سريعة', links: ['خدماتنا', 'الأنشطة', 'الإعلانات', 'التسجيل'] },
              { title: 'التواصل', links: [school?.phone || '920-XXX-XXX', school?.email || 'info@school.sa', school?.address || 'المملكة العربية السعودية'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#EEEEF5', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 8, cursor: 'pointer' }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid rgba(255,255,255,0.04)`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>© {new Date().getFullYear()} {schoolName}. جميع الحقوق محفوظة.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: TEXT_MUTED }}>
              مدعوم بـ <strong style={{ color: '#D4A843' }}>متين</strong> للتعليم الذكي
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
