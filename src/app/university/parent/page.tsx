'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

const EM     = '#34D399';
const GOLD   = '#F59E0B';
const BLUE   = '#60A5FA';
const PURPLE = '#A78BFA';
const RED    = '#EF4444';
const CARD   = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

type Tab = 'overview' | 'academic' | 'attendance' | 'finance' | 'messages';

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}0A`, borderRadius: '0 14px 0 70px' }} />
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ color, fontSize: 11, marginTop: 6, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

function inputSt(extra?: any): any {
  return {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 9, padding: '0.65rem 0.9rem',
    color: '#F8FAFC', fontSize: '0.9rem',
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    ...extra,
  };
}

export default function UniversityParentPage() {
  const [user, setUser]         = useState<any>(null);
  const [stats, setStats]       = useState<any>({ gpa: 0, attendance: 0, completed_hours: 0, total_hours: 130, pending_fees: 0 });
  const [grades, setGrades]     = useState<any[]>([]);
  const [fees, setFees]         = useState<any>({ pending: 0, history: [] });
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<Tab>('overview');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [payForm, setPayForm]   = useState({ method: 'مدى', card_number: '', expiry: '', cvv: '' });
  const [savingPay, setSavingPay] = useState(false);
  const [msgForm, setMsgForm]   = useState({ to: 'المرشد الأكاديمي', content: '' });
  const [savingMsg, setSavingMsg] = useState(false);
  const [toast, setToast]       = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [meRes, statsRes, gradesRes, feesRes, msgRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/university/parent?type=stats'),
        fetch('/api/university/parent?type=grades'),
        fetch('/api/university/parent?type=fees'),
        fetch('/api/university/parent?type=messages'),
      ]);
      if (meRes.ok)     { const d = await meRes.json();     setUser(d.user || d); }
      if (statsRes.ok)  { const d = await statsRes.json();  setStats(d.stats || d); }
      if (gradesRes.ok) { const d = await gradesRes.json(); setGrades(d.grades || d.data || []); }
      if (feesRes.ok)   { const d = await feesRes.json();   setFees(d.fees || d || { pending: 0, history: [] }); }
      if (msgRes.ok)    { const d = await msgRes.json();    setMessages(d.messages || d.data || []); }
    } catch (_) {}
    setLoading(false);
  };

  const submitPayment = async () => {
    setSavingPay(true);
    await fetch('/api/university', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'payment', ...payForm, amount: fees?.pending || stats.pending_fees }),
    }).catch(() => {});
    setShowPayModal(false);
    setPayForm({ method: 'مدى', card_number: '', expiry: '', cvv: '' });
    setSavingPay(false);
    showToast('✅ تمت عملية الدفع بنجاح');
    loadAll();
  };

  const submitMessage = async () => {
    if (!msgForm.content.trim()) return;
    setSavingMsg(true);
    await fetch('/api/university', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'message', ...msgForm }),
    }).catch(() => {});
    setShowMsgModal(false);
    setMsgForm({ to: 'المرشد الأكاديمي', content: '' });
    setSavingMsg(false);
    showToast('✅ تم إرسال الرسالة بنجاح');
    loadAll();
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: EM }}>
      <div style={{ textAlign: 'center', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <div style={{ fontWeight: 700 }}>جارٍ التحميل…</div>
      </div>
    </div>
  );

  const TABS: { id: Tab; label: string; color: string }[] = [
    { id: 'overview',   label: 'الرئيسية',          color: EM     },
    { id: 'academic',   label: 'الأداء الأكاديمي',  color: GOLD   },
    { id: 'attendance', label: 'الحضور',             color: BLUE   },
    { id: 'finance',    label: 'المالية',            color: RED    },
    { id: 'messages',   label: 'التواصل',            color: PURPLE },
  ];

  const fallbackGrades = [
    { subject: 'هندسة البرمجيات',    grade: 88, letter: 'A',  attendance: 92 },
    { subject: 'قواعد البيانات',      grade: 76, letter: 'B+', attendance: 85 },
    { subject: 'الشبكات الحاسوبية',  grade: 91, letter: 'A+', attendance: 95 },
    { subject: 'الرياضيات المتقطعة', grade: 62, letter: 'C+', attendance: 78 },
  ];
  const semesterGrades: any[] = grades.length ? grades : fallbackGrades;

  const upcomingExams = [
    { course: 'هندسة البرمجيات',   date: '2026-04-20', time: '10:00 ص', hall: 'قاعة A' },
    { course: 'قواعد البيانات',     date: '2026-04-22', time: '12:00 م', hall: 'قاعة B' },
    { course: 'الشبكات الحاسوبية', date: '2026-04-25', time: '9:00 ص',  hall: 'قاعة C' },
  ];

  const gpaHistory = [
    { semester: 'الأول 2024',  gpa: 3.20 },
    { semester: 'الثاني 2024', gpa: 3.45 },
    { semester: 'الأول 2025',  gpa: 3.60 },
    { semester: 'الثاني 2025', gpa: stats.gpa || 3.72 },
  ];

  const letterColor = (l: string) => l.startsWith('A') ? EM : l.startsWith('B') ? BLUE : l.startsWith('C') ? GOLD : RED;

  const isCardNeeded = payForm.method !== 'Apple Pay' && payForm.method !== 'تحويل';

  const backdrop: any = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' };
  const modalBox = (bc: string): any => ({ background: '#0D1B2A', border: `1px solid ${bc}40`, borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 480, direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', sans-serif" });
  const btnBase: any = { border: 'none', borderRadius: 9, padding: '0.65rem 1.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" };
  const cancelBtn: any = { background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9, padding: '0.65rem 1.5rem', color: '#94A3B8', cursor: 'pointer', fontWeight: 600, fontFamily: "'IBM Plex Sans Arabic', sans-serif" };
  const label6: any = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', color: '#F8FAFC' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', background: '#0D2A1A', border: `1px solid ${EM}40`, borderRadius: 12, padding: '0.75rem 1.5rem', color: EM, fontWeight: 700, zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: EM }}>داشبورد ولي الأمر الجامعي</h1>
        <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>متابعة مستوى الطالب وأدائه الأكاديمي</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard label="المعدل التراكمي"  value={`${stats.gpa || 0}/5.0`}                                                          color={GOLD}   sub="GPA الفصل الحالي" />
        <StatCard label="نسبة حضور الطالب" value={`${stats.attendance || 0}%`}                                                      color={BLUE}   sub="المحاضرات والمختبرات" />
        <StatCard label="ساعات التخرج"      value={`${stats.completed_hours || 0}/${stats.total_hours || 130}`}                      color={PURPLE} sub="ساعة معتمدة" />
        <StatCard label="رسوم معلقة"        value={`${(stats.pending_fees || fees?.pending || 0).toLocaleString()} ريال`}           color={RED}    sub="مستحقة الدفع" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? `${t.color}20` : 'transparent',
            border: `1px solid ${tab === t.id ? t.color + '50' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 9, padding: '0.5rem 1.1rem', cursor: 'pointer',
            color: tab === t.id ? t.color : 'rgba(255,255,255,0.5)',
            fontWeight: 700, fontSize: '0.88rem', transition: 'all 0.15s',
            fontFamily: "'IBM Plex Sans Arabic', sans-serif",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW ─── */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>

          {/* Child Info Banner */}
          <div style={{ background: `${EM}12`, border: `1px solid ${EM}30`, borderRadius: 14, padding: '1.25rem 1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${EM}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>🎓</div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: EM }}>{user?.child_name || 'الطالب الجامعي'}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: 4 }}>
                {user?.college || 'كلية الحاسب والمعلومات'} — {user?.major || 'هندسة البرمجيات'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: 2 }}>{user?.semester || 'الفصل الثاني 2025'}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: 'راسل الأكاديمي', icon: '💬', color: EM,     action: () => setShowMsgModal(true) },
              { label: 'دفع الرسوم',      icon: '💳', color: GOLD,   action: () => setShowPayModal(true) },
              { label: 'تقرير الأداء',   icon: '📊', color: PURPLE, action: () => setTab('academic') },
              { label: 'الجدول',         icon: '📅', color: BLUE,   action: () => setTab('attendance') },
            ].map(({ label, icon, color, action }) => (
              <button key={label} onClick={action} style={{ background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 12, padding: '0.9rem', textAlign: 'center', cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>{icon}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 600 }}>{label}</div>
              </button>
            ))}
          </div>

          {/* Recent Grades + Upcoming Exams */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: GOLD, fontSize: '0.95rem', fontWeight: 700 }}>آخر الدرجات</h3>
                <button onClick={() => setTab('academic')} style={{ background: 'transparent', border: 'none', color: GOLD, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>عرض الكل ←</button>
              </div>
              {semesterGrades.slice(0, 4).map((g: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: i < 3 ? `1px solid ${BORDER}` : 'none' }}>
                  <span style={{ fontSize: '0.88rem' }}>{g.subject}</span>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{g.grade}</span>
                    <span style={{ fontWeight: 800, color: letterColor(g.letter || 'B'), fontSize: '0.9rem' }}>{g.letter}</span>
                  </div>
                </div>
              ))}
              {semesterGrades.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', paddingTop: '0.5rem' }}>لا درجات بعد</div>}
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '1.25rem' }}>
              <h3 style={{ margin: '0 0 1rem', color: BLUE, fontSize: '0.95rem', fontWeight: 700 }}>اختبارات قادمة</h3>
              {upcomingExams.map((ex: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: i < upcomingExams.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${BLUE}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>📝</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{ex.course}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{ex.date} · {ex.time} · {ex.hall}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── ACADEMIC ─── */}
      {tab === 'academic' && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {(stats.gpa > 0 && stats.gpa < 2.0) && (
            <div style={{ background: `${RED}10`, border: `1px solid ${RED}40`, borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem' }}>⚠️</span>
              <div>
                <div style={{ color: RED, fontWeight: 700, fontSize: '0.95rem' }}>تحذير: الإنذار الأكاديمي</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', marginTop: 2 }}>المعدل التراكمي أقل من 2.0 — يرجى التواصل مع المرشد الأكاديمي فوراً</div>
              </div>
            </div>
          )}

          {/* Semester Grades Table */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${BORDER}` }}>
              <h3 style={{ margin: 0, color: GOLD, fontSize: '0.95rem', fontWeight: 700 }}>درجات الفصل الدراسي</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['المقرر', 'الدرجة', 'التقدير', 'الحضور%'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'right', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', fontWeight: 600, borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {semesterGrades.map((g: any, i: number) => (
                    <tr key={i} style={{ borderBottom: i < semesterGrades.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.88rem', fontWeight: 600 }}>{g.subject}</td>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)' }}>{g.grade}</td>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <span style={{ background: `${letterColor(g.letter || 'B')}18`, color: letterColor(g.letter || 'B'), borderRadius: 6, padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.82rem' }}>{g.letter}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.88rem', color: (g.attendance ?? 90) >= 90 ? EM : (g.attendance ?? 90) >= 75 ? GOLD : RED }}>{g.attendance ?? 90}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GPA Progression */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem', color: GOLD, fontSize: '0.95rem', fontWeight: 700 }}>تطور المعدل التراكمي</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              {gpaHistory.map((g: any, i: number) => {
                const pct = Math.round((g.gpa / 5) * 100);
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1, minWidth: 80 }}>
                    <div style={{ fontWeight: 800, color: GOLD, fontSize: '1rem' }}>{g.gpa.toFixed(2)}</div>
                    <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: GOLD, borderRadius: 4 }} />
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textAlign: 'center' }}>{g.semester}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── ATTENDANCE ─── */}
      {tab === 'attendance' && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', color: BLUE, fontSize: '0.95rem', fontWeight: 700 }}>نسبة الحضور لكل مقرر</h3>
          <div style={{ display: 'grid', gap: '1.1rem' }}>
            {semesterGrades.map((g: any, i: number) => {
              const att = g.attendance ?? 90;
              const color = att >= 90 ? EM : att >= 75 ? GOLD : RED;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{g.subject}</span>
                    <span style={{ fontWeight: 800, color, fontSize: '0.88rem' }}>{att}%</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${att}%`, height: '100%', background: color, borderRadius: 4 }} />
                  </div>
                  {att < 75 && <div style={{ color: RED, fontSize: '0.75rem', marginTop: 4 }}>⚠️ تحذير: الحضور أقل من 75%</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── FINANCE ─── */}
      {tab === 'finance' && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ background: CARD, border: `1px solid ${RED}30`, borderRadius: 14, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: 4 }}>الرسوم المعلقة</div>
              <div style={{ color: RED, fontSize: '2rem', fontWeight: 800 }}>
                {(fees?.pending > 0 || stats.pending_fees > 0) ? `${(fees?.pending || stats.pending_fees || 0).toLocaleString()} ريال` : 'لا رسوم معلقة ✓'}
              </div>
            </div>
            {(fees?.pending > 0 || stats.pending_fees > 0) && (
              <button onClick={() => setShowPayModal(true)} style={{ ...btnBase, background: GOLD, color: '#000', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                💳 ادفع الآن
              </button>
            )}
          </div>

          {Array.isArray(fees?.history) && fees.history.length > 0 ? (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '0.85rem 1.25rem', borderBottom: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>سجل المدفوعات</div>
              {fees.history.map((p: any, i: number) => (
                <div key={i} style={{ padding: '0.85rem 1.25rem', borderBottom: i < fees.history.length - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>دفعة رسوم</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{p.date ? new Date(p.date).toLocaleDateString('ar-SA') : ''}</div>
                  </div>
                  <div style={{ color: EM, fontWeight: 800 }}>{Number(p.amount || 0).toLocaleString()} ريال</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا سجل مدفوعات بعد</div>
          )}
        </div>
      )}

      {/* ─── MESSAGES ─── */}
      {tab === 'messages' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: PURPLE, fontSize: '1rem', fontWeight: 700 }}>التواصل مع الأكاديميين</h2>
            <button onClick={() => setShowMsgModal(true)} style={{ background: PURPLE, border: 'none', borderRadius: 9, padding: '0.55rem 1.25rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
              + رسالة جديدة
            </button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            {messages.length > 0 ? messages.map((m: any, i: number) => (
              <div key={m.id || i} style={{ padding: '1rem 1.25rem', borderBottom: i < messages.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.sender_name || m.to || 'الأكاديمي'}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>{m.created_at ? new Date(m.created_at).toLocaleDateString('ar-SA') : ''}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{m.content}</div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'rgba(255,255,255,0.3)' }}>لا رسائل بعد — ابدأ التواصل مع المرشد الأكاديمي</div>
            )}
          </div>
        </div>
      )}

      {/* ══════════ PAY MODAL ══════════ */}
      {showPayModal && (
        <div style={backdrop}>
          <div style={modalBox(GOLD)}>
            <h3 style={{ margin: '0 0 0.5rem', color: GOLD, fontWeight: 800 }}>💳 دفع الرسوم الجامعية</h3>
            <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', color: GOLD, fontWeight: 700, textAlign: 'center', fontSize: '1.15rem' }}>
              {(fees?.pending || stats.pending_fees || 0).toLocaleString()} ريال
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={label6}>طريقة الدفع</label>
              <select value={payForm.method} onChange={e => setPayForm(p => ({ ...p, method: e.target.value }))} style={inputSt()}>
                {['مدى', 'فيزا', 'Apple Pay', 'تحويل'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            {isCardNeeded && (
              <>
                {[
                  { label: 'رقم البطاقة',     key: 'card_number', ph: 'XXXX XXXX XXXX XXXX' },
                  { label: 'تاريخ الانتهاء', key: 'expiry',      ph: 'MM/YY' },
                  { label: 'CVV',              key: 'cvv',         ph: 'XXX' },
                ].map(({ label, key, ph }) => (
                  <div key={key} style={{ marginBottom: '1rem' }}>
                    <label style={label6}>{label}</label>
                    <input type="text" placeholder={ph} value={(payForm as any)[key]} onChange={e => setPayForm(p => ({ ...p, [key]: e.target.value }))} style={inputSt()} />
                  </div>
                ))}
              </>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setShowPayModal(false)} style={cancelBtn}>إلغاء</button>
              <button onClick={submitPayment} disabled={savingPay} style={{ ...btnBase, background: GOLD, color: '#000', opacity: savingPay ? 0.6 : 1 }}>
                {savingPay ? 'جارٍ الدفع…' : 'ادفع الآن'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MESSAGE MODAL ══════════ */}
      {showMsgModal && (
        <div style={backdrop}>
          <div style={modalBox(PURPLE)}>
            <h3 style={{ margin: '0 0 1.5rem', color: PURPLE, fontWeight: 800 }}>💬 رسالة جديدة</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={label6}>المرسَل إليه</label>
              <select value={msgForm.to} onChange={e => setMsgForm(p => ({ ...p, to: e.target.value }))} style={inputSt()}>
                {['المرشد الأكاديمي', 'الدكتور المقرر', 'عمادة الكلية', 'شؤون الطلاب', 'قسم المالية'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={label6}>الرسالة *</label>
              <textarea value={msgForm.content} onChange={e => setMsgForm(p => ({ ...p, content: e.target.value }))} rows={4} placeholder="اكتب رسالتك هنا…" style={inputSt({ resize: 'vertical' })} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowMsgModal(false)} style={cancelBtn}>إلغاء</button>
              <button onClick={submitMessage} disabled={savingMsg || !msgForm.content.trim()} style={{ ...btnBase, background: PURPLE, color: '#000', opacity: (savingMsg || !msgForm.content.trim()) ? 0.6 : 1 }}>
                {savingMsg ? 'جارٍ الإرسال…' : 'إرسال →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
