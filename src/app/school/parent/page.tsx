'use client';
import { useEffect, useState } from 'react';

const EM = '#34D399';  // emerald
const BLUE = '#60A5FA';
const ORANGE = '#FB923C';
const PURPLE = '#A78BFA';
const GOLD = '#F59E0B';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

type Tab = 'overview' | 'attendance' | 'grades' | 'behavior' | 'messages' | 'finance';

interface Modal { type: 'excuse' | 'message' | 'payment' | null }

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

export default function ParentPage() {
  const [user, setUser] = useState<any>(null);
  const [child, setChild] = useState<any>(null);
  const [stats, setStats] = useState({ attendance: 0, avg_grade: 0, behavior_points: 0, pending_hw: 0 });
  const [grades, setGrades] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [behavior, setBehavior] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [fees, setFees] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [modal, setModal] = useState<Modal>({ type: null });

  // Excuse form
  const [excuse, setExcuse] = useState({ reason_type: 'مرض', date: '', details: '' });
  // Message form
  const [msgForm, setMsgForm] = useState({ teacher: '', content: '' });
  // Payment form
  const [payForm, setPayForm] = useState({ method: 'مدى', card_number: '', expiry: '', cvv: '' });

  const [savingExcuse, setSavingExcuse] = useState(false);
  const [savingMsg, setSavingMsg] = useState(false);
  const [savingPay, setSavingPay] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [meRes, statsRes, gradesRes, hwRes, behaviorRes, msgRes, feesRes] = await Promise.all([
      fetch('/api/auth/me'),
      fetch('/api/school/parent?type=stats'),
      fetch('/api/school/parent?type=grades'),
      fetch('/api/school/parent?type=homework'),
      fetch('/api/school/parent?type=behavior'),
      fetch('/api/school/parent?type=messages'),
      fetch('/api/school/parent?type=fees'),
    ]);
    if (meRes.ok) { const d = await meRes.json(); setUser(d.user); }
    if (statsRes.ok) { const d = await statsRes.json(); setStats(d.stats || {}); setChild(d.child || null); }
    if (gradesRes.ok) { const d = await gradesRes.json(); setGrades(d.grades || []); }
    if (hwRes.ok) { const d = await hwRes.json(); setHomework(d.homework || []); }
    if (behaviorRes.ok) { const d = await behaviorRes.json(); setBehavior(d.records || []); }
    if (msgRes.ok) { const d = await msgRes.json(); setMessages(d.messages || []); }
    if (feesRes.ok) { const d = await feesRes.json(); setFees(d.fees || null); }
    setLoading(false);
  };

  const submitExcuse = async () => {
    if (!excuse.date) return;
    setSavingExcuse(true);
    await fetch('/api/school/parent', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'excuse', ...excuse }),
    }).catch(() => {});
    setModal({ type: null });
    showSuccess('✅ تم إرسال عذر الغياب بنجاح');
    setSavingExcuse(false);
  };

  const submitMessage = async () => {
    if (!msgForm.content) return;
    setSavingMsg(true);
    await fetch('/api/school/parent', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'message', ...msgForm }),
    }).catch(() => {});
    setModal({ type: null });
    setMsgForm({ teacher: '', content: '' });
    showSuccess('✅ تم إرسال الرسالة بنجاح');
    setSavingMsg(false);
  };

  const submitPayment = async () => {
    if (!payForm.method) return;
    setSavingPay(true);
    await fetch('/api/school/parent', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'payment', ...payForm, amount: fees?.pending }),
    }).catch(() => {});
    setModal({ type: null });
    showSuccess('✅ تمت عملية الدفع بنجاح');
    setSavingPay(false);
    loadAll();
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: EM }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <div style={{ fontWeight: 700 }}>جارٍ التحميل…</div>
      </div>
    </div>
  );

  const TABS: { id: Tab; label: string; color: string }[] = [
    { id: 'overview', label: 'الرئيسية', color: EM },
    { id: 'attendance', label: 'الحضور', color: BLUE },
    { id: 'grades', label: 'الدرجات', color: PURPLE },
    { id: 'behavior', label: 'السلوك', color: GOLD },
    { id: 'messages', label: 'التواصل', color: ORANGE },
    { id: 'finance', label: 'المالية', color: '#EF4444' },
  ];

  const STATS = [
    { label: 'نسبة الحضور', value: `${stats.attendance || 0}%`, sub: 'هذا الشهر', color: EM },
    { label: 'متوسط الدرجات', value: `${stats.avg_grade || 0}%`, sub: 'جميع المواد', color: BLUE },
    { label: 'نقاط السلوك', value: stats.behavior_points || 0, sub: 'درجة التقييم', color: PURPLE },
    { label: 'واجبات معلقة', value: stats.pending_hw || 0, sub: 'تحتاج تسليم', color: ORANGE },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', color: '#F8FAFC' }}>

      {/* ── Success Toast ── */}
      {successMsg && (
        <div style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', background: '#0D2A1A', border: `1px solid ${EM}40`, borderRadius: 12, padding: '0.75rem 1.5rem', color: EM, fontWeight: 700, zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          {successMsg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: EM }}>
          متابعة {child?.name || 'ابنك/ابنتك'} 👨‍👩‍👧
        </h1>
        <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          {child?.school_name || 'المدرسة'} — {child?.class_name || 'الفصل الدراسي'}
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'تقديم عذر غياب', icon: '📋', color: BLUE, action: () => setModal({ type: 'excuse' }) },
          { label: 'راسل المعلم', icon: '💬', color: EM, action: () => setModal({ type: 'message' }) },
          { label: 'دفع الرسوم', icon: '💳', color: GOLD, action: () => setModal({ type: 'payment' }) },
          { label: 'الدرجات', icon: '📊', color: PURPLE, action: () => setTab('grades') },
          { label: 'الواجبات', icon: '📚', color: ORANGE, action: () => setTab('grades') },
          { label: 'السلوك', icon: '⭐', color: GOLD, action: () => setTab('behavior') },
        ].map(({ label, icon, color, action }) => (
          <button key={label} onClick={action} style={{ background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 12, padding: '0.85rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}20`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}12`; }}
          >
            <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>{icon}</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 600 }}>{label}</div>
          </button>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? `${t.color}20` : 'transparent',
            border: `1px solid ${tab === t.id ? t.color + '50' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 9, padding: '0.5rem 1.1rem', cursor: 'pointer',
            color: tab === t.id ? t.color : 'rgba(255,255,255,0.5)',
            fontWeight: 700, fontSize: '0.88rem', transition: 'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>

          {/* Attendance Summary */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: BLUE, fontSize: '0.95rem', fontWeight: 700 }}>الحضور هذا الشهر</h3>
              <button onClick={() => setModal({ type: 'excuse' })} style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}30`, borderRadius: 8, padding: '0.35rem 0.85rem', color: BLUE, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                + عذر
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', border: `4px solid ${stats.attendance >= 90 ? EM : ORANGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: stats.attendance >= 90 ? EM : ORANGE }}>
                {stats.attendance || 0}%
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {stats.attendance >= 90 ? 'ممتاز' : stats.attendance >= 75 ? 'جيد' : 'يحتاج تحسين'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: 3 }}>
                  الحد الأدنى المطلوب: 75%
                </div>
              </div>
            </div>
          </div>

          {/* Recent Grades */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h3 style={{ margin: 0, color: PURPLE, fontSize: '0.95rem', fontWeight: 700 }}>آخر الدرجات</h3>
              <button onClick={() => setTab('grades')} style={{ background: 'transparent', border: 'none', color: PURPLE, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                عرض الكل ←
              </button>
            </div>
            {grades.slice(0, 4).map(g => (
              <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                <span style={{ fontSize: '0.88rem' }}>{g.subject}</span>
                <span style={{ fontWeight: 700, color: g.grade >= 85 ? EM : g.grade >= 70 ? BLUE : ORANGE, fontSize: '0.88rem' }}>
                  {g.grade}%
                </span>
              </div>
            ))}
            {grades.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', paddingTop: '0.5rem' }}>لا درجات بعد</div>}
          </div>

          {/* Pending Homework */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.85rem', color: ORANGE, fontSize: '0.95rem', fontWeight: 700 }}>واجبات معلقة ({homework.filter(h => h.status === 'active').length})</h3>
            {homework.filter(h => h.status === 'active').slice(0, 4).map(hw => (
              <div key={hw.id} style={{ padding: '0.45rem 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{hw.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                  {hw.subject} · تسليم: {hw.due_date ? new Date(hw.due_date).toLocaleDateString('ar-SA') : '—'}
                </div>
              </div>
            ))}
            {homework.filter(h => h.status === 'active').length === 0 && (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center' }}>لا واجبات معلقة ✓</div>
            )}
          </div>

          {/* Behavior Points */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.85rem', color: GOLD, fontSize: '0.95rem', fontWeight: 700 }}>نقاط السلوك والانضباط</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: GOLD }}>{stats.behavior_points || 0}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: stats.behavior_points >= 40 ? EM : ORANGE }}>
                  {(stats.behavior_points || 0) >= 40 ? 'ممتاز ⭐' : 'يحتاج تحسين'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: 2 }}>
                  من أصل 50 نقطة
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ATTENDANCE ── */}
      {tab === 'attendance' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: BLUE, fontSize: '1rem', fontWeight: 700 }}>سجل الحضور والغياب</h2>
            <button onClick={() => setModal({ type: 'excuse' })} style={{ background: BLUE, border: 'none', borderRadius: 9, padding: '0.55rem 1.25rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>
              + تقديم عذر
            </button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📅</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stats.attendance >= 90 ? EM : ORANGE, marginBottom: '0.5rem' }}>
              {stats.attendance || 0}%
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              نسبة الحضور الشهرية — الحد الأدنى المطلوب 75%
            </div>
          </div>
        </div>
      )}

      {/* ── GRADES ── */}
      {tab === 'grades' && (
        <div>
          <h2 style={{ color: PURPLE, fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>الدرجات والنتائج</h2>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${BORDER}` }}>
                  {['المادة', 'الدرجة', 'التقدير'].map(h => (
                    <th key={h} style={{ padding: '0.9rem 1.25rem', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grades.map((g, i) => (
                  <tr key={g.id} style={{ borderBottom: i < grades.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, fontSize: '0.9rem' }}>{g.subject}</td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: g.grade >= 85 ? EM : g.grade >= 70 ? BLUE : ORANGE }}>
                      {g.grade}%
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span style={{ background: `${g.grade >= 85 ? EM : g.grade >= 70 ? BLUE : ORANGE}20`, border: `1px solid ${g.grade >= 85 ? EM : g.grade >= 70 ? BLUE : ORANGE}40`, borderRadius: 20, padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: g.grade >= 85 ? EM : g.grade >= 70 ? BLUE : ORANGE }}>
                        {g.letter || (g.grade >= 90 ? 'ممتاز' : g.grade >= 75 ? 'جيد جداً' : g.grade >= 60 ? 'جيد' : 'مقبول')}
                      </span>
                    </td>
                  </tr>
                ))}
                {grades.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)' }}>لا درجات مسجلة بعد</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Homework section */}
          <h2 style={{ color: ORANGE, fontSize: '1rem', fontWeight: 700, margin: '1.5rem 0 1rem' }}>الواجبات المنزلية</h2>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            {homework.map((hw, i) => (
              <div key={hw.id} style={{ padding: '0.9rem 1.25rem', borderBottom: i < homework.length - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{hw.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: 2 }}>{hw.subject} · {hw.due_date ? `تسليم: ${new Date(hw.due_date).toLocaleDateString('ar-SA')}` : '—'}</div>
                </div>
                <span style={{ background: `${hw.status === 'active' ? ORANGE : EM}18`, border: `1px solid ${hw.status === 'active' ? ORANGE : EM}40`, borderRadius: 20, padding: '0.2rem 0.75rem', color: hw.status === 'active' ? ORANGE : EM, fontSize: '0.78rem', fontWeight: 700 }}>
                  {hw.status === 'active' ? 'معلق' : 'مسلّم'}
                </span>
              </div>
            ))}
            {homework.length === 0 && <div style={{ textAlign: 'center', padding: '1.5rem', color: 'rgba(255,255,255,0.3)' }}>لا واجبات</div>}
          </div>
        </div>
      )}

      {/* ── BEHAVIOR ── */}
      {tab === 'behavior' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: GOLD, fontSize: '1rem', fontWeight: 700 }}>السلوك والانضباط</h2>
            <div style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40`, borderRadius: 12, padding: '0.5rem 1.25rem', color: GOLD, fontWeight: 800 }}>
              {stats.behavior_points || 0} نقطة ⭐
            </div>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            {behavior.map((b, i) => (
              <div key={b.id} style={{ padding: '0.9rem 1.25rem', borderBottom: i < behavior.length - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.note}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: 2 }}>
                    {b.created_at ? new Date(b.created_at).toLocaleDateString('ar-SA') : ''}
                  </div>
                </div>
                <span style={{ color: b.points > 0 ? EM : '#EF4444', fontWeight: 800, fontSize: '0.95rem' }}>
                  {b.points > 0 ? '+' : ''}{b.points}
                </span>
              </div>
            ))}
            {behavior.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)' }}>لا سجلات سلوك بعد</div>
            )}
          </div>
        </div>
      )}

      {/* ── MESSAGES ── */}
      {tab === 'messages' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: ORANGE, fontSize: '1rem', fontWeight: 700 }}>التواصل مع المعلمين</h2>
            <button onClick={() => setModal({ type: 'message' })} style={{ background: ORANGE, border: 'none', borderRadius: 9, padding: '0.55rem 1.25rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>
              💬 رسالة جديدة
            </button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            {messages.map((m, i) => (
              <div key={m.id} style={{ padding: '1rem 1.25rem', borderBottom: i < messages.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.sender_name || 'المعلم'}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
                    {m.created_at ? new Date(m.created_at).toLocaleDateString('ar-SA') : ''}
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{m.content}</div>
              </div>
            ))}
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)' }}>لا رسائل بعد — ابدأ محادثة مع المعلم</div>
            )}
          </div>
        </div>
      )}

      {/* ── FINANCE ── */}
      {tab === 'finance' && (
        <div>
          <h2 style={{ color: '#EF4444', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>الرسوم الدراسية</h2>
          <div style={{ background: CARD, border: `1px solid #EF444430`, borderRadius: 14, padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: 4 }}>المبلغ المستحق</div>
                <div style={{ color: '#EF4444', fontSize: '2rem', fontWeight: 800 }}>
                  {fees?.pending ? `${Number(fees.pending).toLocaleString()} ريال` : 'لا رسوم معلقة ✓'}
                </div>
              </div>
              {fees?.pending > 0 && (
                <button onClick={() => setModal({ type: 'payment' })} style={{ background: GOLD, border: 'none', borderRadius: 12, padding: '0.75rem 1.75rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>
                  💳 ادفع الآن
                </button>
              )}
            </div>
          </div>
          {fees?.history?.length > 0 && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1.25rem', borderBottom: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>سجل المدفوعات</div>
              {fees.history.map((p: any, i: number) => (
                <div key={i} style={{ padding: '0.85rem 1.25rem', borderBottom: i < fees.history.length - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>دفعة رسوم</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{p.date ? new Date(p.date).toLocaleDateString('ar-SA') : ''}</div>
                  </div>
                  <div style={{ color: EM, fontWeight: 800 }}>{Number(p.amount).toLocaleString()} ريال</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════ MODALS ══════════ */}

      {/* Excuse Modal */}
      {modal.type === 'excuse' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#0D1B2A', border: `1px solid ${BLUE}40`, borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 460, direction: 'rtl' }}>
            <h3 style={{ margin: '0 0 1.5rem', color: BLUE, fontWeight: 800 }}>تقديم عذر غياب</h3>
            {[
              { label: 'نوع العذر', key: 'reason_type', type: 'select', opts: ['مرض', 'ظرف عائلي', 'سفر', 'موعد طبي', 'أخرى'] },
              { label: 'تاريخ الغياب', key: 'date', type: 'date', opts: [] },
            ].map(({ label, key, type, opts }) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 }}>{label}</label>
                {type === 'select' ? (
                  <select value={excuse[key as keyof typeof excuse]} onChange={e => setExcuse(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem' }}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={type} value={excuse[key as keyof typeof excuse]} onChange={e => setExcuse(p => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                )}
              </div>
            ))}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 }}>التفاصيل</label>
              <textarea value={excuse.details} onChange={e => setExcuse(p => ({ ...p, details: e.target.value }))} rows={3}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setModal({ type: null })} style={{ background: 'transparent', border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 9, padding: '0.65rem 1.5rem', color: '#94A3B8', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={submitExcuse} disabled={savingExcuse || !excuse.date} style={{ background: BLUE, border: 'none', borderRadius: 9, padding: '0.65rem 1.75rem', color: '#000', fontWeight: 800, cursor: 'pointer', opacity: (savingExcuse || !excuse.date) ? 0.6 : 1 }}>
                {savingExcuse ? 'جارٍ الإرسال…' : 'إرسال العذر ←'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {modal.type === 'message' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#0D1B2A', border: `1px solid ${EM}40`, borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 460, direction: 'rtl' }}>
            <h3 style={{ margin: '0 0 1.5rem', color: EM, fontWeight: 800 }}>💬 رسالة للمعلم</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 }}>المعلم</label>
              <input type="text" value={msgForm.teacher} placeholder="اسم المعلم أو المادة" onChange={e => setMsgForm(p => ({ ...p, teacher: e.target.value }))}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 }}>الرسالة *</label>
              <textarea value={msgForm.content} onChange={e => setMsgForm(p => ({ ...p, content: e.target.value }))} rows={4} placeholder="اكتب رسالتك هنا…"
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setModal({ type: null })} style={{ background: 'transparent', border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 9, padding: '0.65rem 1.5rem', color: '#94A3B8', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={submitMessage} disabled={savingMsg || !msgForm.content} style={{ background: EM, border: 'none', borderRadius: 9, padding: '0.65rem 1.75rem', color: '#000', fontWeight: 800, cursor: 'pointer', opacity: (savingMsg || !msgForm.content) ? 0.6 : 1 }}>
                {savingMsg ? 'جارٍ الإرسال…' : 'إرسال ←'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {modal.type === 'payment' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#0D1B2A', border: `1px solid ${GOLD}40`, borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 460, direction: 'rtl' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: GOLD, fontWeight: 800 }}>💳 دفع الرسوم الدراسية</h3>
            <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', color: GOLD, fontWeight: 700, textAlign: 'center', fontSize: '1.1rem' }}>
              {fees?.pending ? `${Number(fees.pending).toLocaleString()} ريال سعودي` : '—'}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 }}>طريقة الدفع</label>
              <select value={payForm.method} onChange={e => setPayForm(p => ({ ...p, method: e.target.value }))}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem' }}>
                {['مدى', 'فيزا / ماستركارد', 'Apple Pay', 'تحويل بنكي'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            {payForm.method !== 'تحويل بنكي' && payForm.method !== 'Apple Pay' && (
              <>
                {[
                  { label: 'رقم البطاقة', key: 'card_number', placeholder: 'XXXX XXXX XXXX XXXX' },
                  { label: 'تاريخ الانتهاء', key: 'expiry', placeholder: 'MM/YY' },
                  { label: 'CVV', key: 'cvv', placeholder: 'XXX' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 }}>{label}</label>
                    <input type="text" placeholder={placeholder} value={payForm[key as keyof typeof payForm]} onChange={e => setPayForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setModal({ type: null })} style={{ background: 'transparent', border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 9, padding: '0.65rem 1.5rem', color: '#94A3B8', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={submitPayment} disabled={savingPay} style={{ background: GOLD, border: 'none', borderRadius: 9, padding: '0.65rem 1.75rem', color: '#000', fontWeight: 800, cursor: 'pointer', opacity: savingPay ? 0.6 : 1 }}>
                {savingPay ? 'جارٍ الدفع…' : 'ادفع الآن ←'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
