'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';

const DEFAULT_PROGRAMS = [
  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, title: 'Excel المتقدم', duration: '3 أسابيع', price: '450 ريال', seats: 20, color: '#10B981' },
  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, title: 'Python للمبتدئين', duration: '6 أسابيع', price: '750 ريال', seats: 15, color: '#3B82F6' },
  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>, title: 'إدارة المشاريع PMP', duration: '8 أسابيع', price: '1200 ريال', seats: 12, color: '#A78BFA' },
  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, title: 'تصميم الجرافيك', duration: '4 أسابيع', price: '600 ريال', seats: 18, color: '#F59E0B' },
  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title: 'اللغة الإنجليزية', duration: '12 أسبوع', price: '900 ريال', seats: 25, color: '#0EA5E9' },
  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, title: 'الموارد البشرية', duration: '5 أسابيع', price: '850 ريال', seats: 10, color: '#EF4444' },
];

interface Program { icon?: React.ReactNode; title: string; duration?: string; price?: string; seats?: number; color?: string; }
interface Announcement { id: number; title: string; body?: string; created_at?: string; pinned?: boolean; }
interface Institute { name: string; description?: string; logo?: string; phone?: string; email?: string; address?: string; }
interface Stats { students?: number; programs?: number; years?: number; employment?: number; }

export default function InstituteLandingPage({ params }: { params: { code: string } }) {
  const { code } = params;
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [stats, setStats] = useState<Stats>({});
  const [programs, setPrograms] = useState<Program[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinForm, setJoinForm] = useState({ applicant_name: '', program: '', phone: '', email: '', notes: '' });
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMsg, setJoinMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/institutes/public/${code}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setInstitute(d.institute);
          setStats(d.stats || {});
          setPrograms(d.programs || []);
          setAnnouncements(d.announcements || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code]);

  const displayPrograms: Program[] = programs.length > 0 ? programs : DEFAULT_PROGRAMS;

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  }

  async function handleJoinSubmit(e: React.FormEvent) {
    e.preventDefault();
    setJoinLoading(true);
    setJoinMsg(null);
    try {
      const res = await fetch(`/api/institutes/public/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joinForm),
      });
      const data = await res.json();
      if (res.ok) {
        setJoinMsg({ type: 'success', text: data.message || 'تم إرسال طلب التسجيل بنجاح' });
        setJoinForm({ applicant_name: '', program: '', phone: '', email: '', notes: '' });
      } else {
        setJoinMsg({ type: 'error', text: data.error || 'حدث خطأ أثناء الإرسال' });
      }
    } catch {
      setJoinMsg({ type: 'error', text: 'تعذّر الاتصال بالخادم' });
    } finally {
      setJoinLoading(false);
    }
  }

  const instituteName = institute?.name || 'المعهد';
  const primaryColor = '#0EA5E9';
  const secondaryColor = '#0369A1';
  const accentColor = '#F59E0B';

  const navLinks = [
    { label: 'برامجنا', target: 'programs' },
    { label: 'الإعلانات', target: 'announcements' },
    { label: 'التسجيل', target: 'register' },
  ];

  const statItems = [
    { value: stats.students ?? 0, label: 'طالب مسجّل', suffix: '+' },
    { value: stats.programs ?? displayPrograms.length, label: 'برنامج تدريبي', suffix: '' },
    { value: stats.years ?? 10, label: 'سنوات خبرة', suffix: '' },
    { value: stats.employment ?? 87, label: 'نسبة التوظيف', suffix: '%' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06060E', color: primaryColor, fontSize: '1.2rem', fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif", direction: 'rtl' }}>
        <div>
          <div style={{ width: 48, height: 48, border: `3px solid ${primaryColor}30`, borderTopColor: primaryColor, borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
          جارٍ تحميل بيانات المعهد...
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06060E', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif", direction: 'rtl' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        .prog-card:hover{transform:translateY(-4px);transition:transform 0.2s;}
        .nav-link:hover{color:${primaryColor}!important;}
        .btn-primary:hover{background:${secondaryColor}!important;}
        .btn-outline:hover{background:rgba(14,165,233,0.1)!important;}
        * { box-sizing: border-box; }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6,6,14,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid rgba(14,165,233,0.15)`,
        padding: '0 1.5rem', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {institute?.logo ? (
            <img src={institute.logo} alt="logo" style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${primaryColor},${secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
          )}
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>{instituteName}</span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {navLinks.map(l => (
            <button key={l.target} className="nav-link" onClick={() => scrollTo(l.target)}
              style={{ background: 'none', border: 'none', color: 'rgba(238,238,245,0.75)', fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s' }}>
              {l.label}
            </button>
          ))}
          <a href="/login" style={{ color: 'rgba(238,238,245,0.55)', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 500 }}>تسجيل الدخول</a>
          <button className="btn-primary" onClick={() => scrollTo('register')}
            style={{ background: primaryColor, color: '#fff', border: 'none', borderRadius: 10, padding: '0.5rem 1.25rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}>
            سجّل الآن
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(v => !v)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}
          aria-label="قائمة"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3"/></svg></button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ background: 'rgba(6,6,14,0.97)', borderBottom: `1px solid rgba(14,165,233,0.15)`, padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {navLinks.map(l => (
            <button key={l.target} onClick={() => scrollTo(l.target)}
              style={{ background: 'none', border: 'none', color: 'rgba(238,238,245,0.8)', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'right' }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => scrollTo('register')}
            style={{ background: primaryColor, color: '#fff', border: 'none', borderRadius: 10, padding: '0.6rem 1rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            سجّل الآن
          </button>
        </div>
      )}

      {/* ===== HERO ===== */}
      <section style={{ padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden', animation: 'fadeIn 0.6s ease' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ display: 'inline-block', background: `rgba(14,165,233,0.12)`, border: `1px solid rgba(14,165,233,0.3)`, borderRadius: 50, padding: '0.35rem 1.1rem', color: primaryColor, fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg> منصة متين للتدريب المهني
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1.2rem', background: `linear-gradient(135deg, #fff 40%, ${primaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {instituteName}
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(238,238,245,0.65)', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.7 }}>
          {institute?.description || 'معهد تدريبي متخصص يقدم برامج احترافية لتطوير المهارات وتعزيز فرص التوظيف'}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <button className="btn-primary" onClick={() => scrollTo('register')}
            style={{ background: `linear-gradient(135deg,${primaryColor},${secondaryColor})`, color: '#fff', border: 'none', borderRadius: 12, padding: '0.8rem 2rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 0 24px ${primaryColor}40`, transition: 'background 0.2s' }}>
            سجّل الآن →
          </button>
          <button className="btn-outline" onClick={() => scrollTo('programs')}
            style={{ background: 'transparent', color: primaryColor, border: `1.5px solid ${primaryColor}50`, borderRadius: 12, padding: '0.8rem 2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}>
            تعرّف علينا
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, maxWidth: 680, margin: '0 auto' }}>
          {statItems.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.2rem 1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: primaryColor, lineHeight: 1 }}>
                {s.value.toLocaleString('ar-SA')}{s.suffix}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(238,238,245,0.5)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROGRAMS ===== */}
      <section id="programs" style={{ padding: '4rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ color: accentColor, fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8"/></svg> ما نقدّمه</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, marginBottom: 10 }}>برامجنا التدريبية</h2>
          <p style={{ color: 'rgba(238,238,245,0.55)', fontSize: '1rem' }}>برامج متخصصة مصممة لمتطلبات سوق العمل</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {displayPrograms.map((p, i) => {
            const color = p.color || primaryColor;
            return (
              <div key={i} className="prog-card" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}25`, borderRadius: 16, padding: 22, position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'transform 0.2s' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${color},${color}60)`, borderRadius: '16px 16px 0 0' }} />
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 14 }}>
                  {p.icon || <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{p.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(238,238,245,0.5)', marginBottom: 14 }}>
                  <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3"/></svg> {p.duration || '—'}</span>
                  <span style={{ color, fontWeight: 700 }}>{p.price || '—'}</span>
                </div>
                {p.seats && (
                  <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.35)', marginBottom: 12 }}>
                    المقاعد المتاحة: {p.seats}
                  </div>
                )}
                <button onClick={() => scrollTo('register')}
                  style={{ width: '100%', background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 9, padding: '0.6rem', color, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit', transition: 'background 0.2s' }}>
                  سجّل الآن
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== ANNOUNCEMENTS ===== */}
      <section id="announcements" style={{ padding: '4rem 1.5rem', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ color: primaryColor, fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg> آخر الأخبار</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, marginBottom: 10 }}>إعلانات المعهد</h2>
          </div>

          {announcements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {announcements.map((a) => (
                <div key={a.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${a.pinned ? accentColor + '40' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '1.2rem 1.4rem', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{a.pinned ? <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8h.01 M12 12v4"/></svg> : <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg>}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.97rem', marginBottom: 4 }}>{a.title}</div>
                    {a.body && <div style={{ color: 'rgba(238,238,245,0.55)', fontSize: '0.88rem', lineHeight: 1.6 }}>{a.body}</div>}
                    {a.created_at && (
                      <div style={{ color: 'rgba(238,238,245,0.3)', fontSize: '0.78rem', marginTop: 8 }}>
                        {new Date(a.created_at).toLocaleDateString('ar-SA')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(238,238,245,0.3)', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"/></svg></div>
              <div>لا توجد إعلانات حالياً</div>
            </div>
          )}
        </div>
      </section>

      {/* ===== REGISTRATION FORM ===== */}
      <section id="register" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ color: accentColor, fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> ابدأ رحلتك</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, marginBottom: 10 }}>سجّل اهتمامك الآن</h2>
            <p style={{ color: 'rgba(238,238,245,0.55)', fontSize: '0.95rem' }}>أرسل بياناتك وسيتواصل معك فريقنا في أقرب وقت</p>
          </div>

          <form onSubmit={handleJoinSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'rgba(238,238,245,0.7)' }}>اسم المتقدم *</label>
                <input required value={joinForm.applicant_name} onChange={e => setJoinForm(f => ({ ...f, applicant_name: e.target.value }))}
                  placeholder="الاسم الكامل"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.7rem 1rem', color: '#EEEEF5', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', direction: 'rtl' }} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'rgba(238,238,245,0.7)' }}>البرنامج المطلوب</label>
                <select value={joinForm.program} onChange={e => setJoinForm(f => ({ ...f, program: e.target.value }))}
                  style={{ width: '100%', background: '#0F1117', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.7rem 1rem', color: '#EEEEF5', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', direction: 'rtl' }}>
                  <option value="">اختر البرنامج...</option>
                  {displayPrograms.map((p, i) => <option key={i} value={p.title}>{p.title}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'rgba(238,238,245,0.7)' }}>رقم الجوال *</label>
                <input required value={joinForm.phone} onChange={e => setJoinForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="05xxxxxxxx" type="tel"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.7rem 1rem', color: '#EEEEF5', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', direction: 'ltr', textAlign: 'right' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'rgba(238,238,245,0.7)' }}>البريد الإلكتروني</label>
                <input value={joinForm.email} onChange={e => setJoinForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="example@email.com" type="email"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.7rem 1rem', color: '#EEEEF5', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', direction: 'ltr', textAlign: 'right' }} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'rgba(238,238,245,0.7)' }}>ملاحظات</label>
                <textarea value={joinForm.notes} onChange={e => setJoinForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="أي معلومات إضافية تودّ إضافتها..." rows={3}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.7rem 1rem', color: '#EEEEF5', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', direction: 'rtl', resize: 'vertical' }} />
              </div>
            </div>

            {joinMsg && (
              <div style={{ background: joinMsg.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${joinMsg.type === 'success' ? '#10B981' : '#EF4444'}40`, borderRadius: 10, padding: '0.75rem 1rem', marginBottom: 16, color: joinMsg.type === 'success' ? '#10B981' : '#EF4444', fontSize: '0.9rem', textAlign: 'center' }}>
                {joinMsg.type === 'success' ? <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> : <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01"/></svg>} {joinMsg.text}
              </div>
            )}

            <button type="submit" disabled={joinLoading}
              style={{ width: '100%', background: joinLoading ? 'rgba(14,165,233,0.4)' : `linear-gradient(135deg,${primaryColor},${secondaryColor})`, color: '#fff', border: 'none', borderRadius: 12, padding: '0.85rem', fontWeight: 800, fontSize: '1rem', cursor: joinLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: joinLoading ? 'none' : `0 0 20px ${primaryColor}30`, transition: 'all 0.2s' }}>
              {joinLoading ? 'جارٍ الإرسال...' : 'إرسال طلب التسجيل'}
            </button>
          </form>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '2.5rem 1.5rem', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${primaryColor},${secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{instituteName}</span>
            </div>
            {institute?.description && (
              <p style={{ color: 'rgba(238,238,245,0.4)', fontSize: '0.85rem', maxWidth: 280, lineHeight: 1.6 }}>{institute.description}</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'rgba(238,238,245,0.6)', marginBottom: 4 }}>التواصل</div>
            {institute?.phone && <a href={`tel:${institute.phone}`} style={{ color: 'rgba(238,238,245,0.5)', fontSize: '0.85rem', textDecoration: 'none' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2.68h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> {institute.phone}</a>}
            {institute?.email && <a href={`mailto:${institute.email}`} style={{ color: 'rgba(238,238,245,0.5)', fontSize: '0.85rem', textDecoration: 'none' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"/></svg> {institute.email}</a>}
            {institute?.address && <span style={{ color: 'rgba(238,238,245,0.5)', fontSize: '0.85rem' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8h.01 M12 12v4"/></svg> {institute.address}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'rgba(238,238,245,0.6)', marginBottom: 4 }}>روابط سريعة</div>
            {navLinks.map(l => (
              <button key={l.target} onClick={() => scrollTo(l.target)}
                style={{ background: 'none', border: 'none', color: 'rgba(238,238,245,0.45)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'right', padding: 0 }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(238,238,245,0.25)', fontSize: '0.8rem' }}>
          مدعوم بـ <span style={{ color: primaryColor, fontWeight: 700 }}>منصة متين</span> — جميع الحقوق محفوظة © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
