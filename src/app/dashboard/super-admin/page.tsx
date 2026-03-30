'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ─── Design Tokens ────────────────────────────────────────
const GOLD='var(--gold)';
const BG='var(--bg)';
const BG_CARD = 'rgba(255,255,255,0.025)';
const BORDER = 'rgba(255,255,255,0.07)';
const BORDER2 = 'rgba(255,255,255,0.04)';
const TEXT = '#EEEEF5';
const TEXT_DIM = 'rgba(238,238,245,0.55)';
const TEXT_MUTED = 'rgba(238,238,245,0.28)';
const GREEN = '#10B981';
const RED = '#EF4444';
const BLUE = '#60A5FA';
const PURPLE = '#A78BFA';

const getH = () => {
  const t = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
  return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) };
};

// ─── SVG Icon ─────────────────────────────────────────────
const Ic = ({ d, size = 16, color = 'currentColor', sw = 1.75 }: { d: string | string[]; size?: number; color?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  building:    "M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16",
  students:    "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
  teachers:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  users:       "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  money:       "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  shield:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  activity:    "M22 12h-4l-3 9L9 3l-3 9H2",
  plus:        "M12 5v14 M5 12h14",
  pending:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
  active:      "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  edit:        "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  freeze:      "M12 2v20 M2 12h20 M4.93 4.93l14.14 14.14 M19.07 4.93L4.93 19.07",
  unfreeze:    "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  eye:         "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  alert:       "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  close:       "M18 6L6 18 M6 6l12 12",
  trending:    "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  check:       "M20 6L9 17l-5-5",
  bell:        "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  tax:         "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h3",
  ads:         "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18",
  store:       "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  settings:    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
};

// ─── Reusable Components ──────────────────────────────────
const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: BG_CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    padding: '14px 20px',
    borderBottom: `1px solid ${BORDER2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  }}>
    {children}
  </div>
);

const Badge = ({ children, color, bg, border }: { children: React.ReactNode; color: string; bg: string; border: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 600,
    color, background: bg, border: `1px solid ${border}`,
    whiteSpace: 'nowrap',
  }}>
    {children}
  </span>
);

const BtnSm = ({ children, color, bg, border, onClick, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '4px 11px', borderRadius: 6,
      fontSize: 11, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: `1px solid ${border}`,
      background: bg, color,
      fontFamily: 'var(--font)',
      opacity: disabled ? 0.5 : 1,
      transition: 'all 0.15s',
    }}
  >
    {children}
  </button>
);

// ─── Plan Badge ───────────────────────────────────────────
const planConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  enterprise: { label: 'مؤسسي',  color: GOLD,   bg: 'rgba(212,168,67,0.12)',   border: 'rgba(212,168,67,0.25)' },
  advanced:   { label: 'متقدم',   color: BLUE,   bg: 'rgba(96,165,250,0.1)',    border: 'rgba(96,165,250,0.22)' },
  basic:      { label: 'أساسي',   color: TEXT_DIM, bg: 'rgba(255,255,255,0.05)', border: BORDER },
  free:       { label: 'مجاني',   color: TEXT_DIM, bg: 'rgba(255,255,255,0.05)', border: BORDER },
  TRIAL:      { label: 'تجريبي', color: '#FB923C', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.22)' },
};

const typeLabels: Record<string, string> = {
  school: 'مدرسة', university: 'جامعة', institute: 'معهد',
  kindergarten: 'روضة', training: 'تدريب', mosque: 'مسجد',
};

// ─── Modal ────────────────────────────────────────────────
function Modal({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.82)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#0F0F1E',
        border: `1px solid rgba(212,168,67,0.2)`,
        borderRadius: 16, padding: 28,
        width: '100%', maxWidth: 480,
        direction: 'rtl',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ color: GOLD, fontSize: 17, fontWeight: 800, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: TEXT_DIM, cursor: 'pointer', fontSize: 20, display: 'flex' }}>
            <Ic d={Icons.close} size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg-card)',
  border: `1px solid ${BORDER}`, borderRadius: 8,
  padding: '10px 14px', color: TEXT, fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'var(--font)',
};

const labelStyle: React.CSSProperties = {
  color: TEXT_DIM, fontSize: 13, fontWeight: 600,
  display: 'block', marginBottom: 6,
};

// ─── Main Component ───────────────────────────────────────
export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({});
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ name: '', name_ar: '', email: '', phone: '', plan: 'basic', institution_type: 'school' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (u.role !== 'super_admin' && u.role !== 'owner') {
      router.replace('/dashboard');
      return;
    }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, scRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers: getH() }),
        fetch('/api/schools', { headers: getH() }),
      ]);
      const [sData, scData] = await Promise.all([sRes.json(), scRes.json()]);
      setStats(sData || {});
      setSchools(Array.isArray(scData) ? scData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.name_ar.trim() && !form.name.trim()) {
      setMsg({ text: 'اسم المؤسسة مطلوب', type: 'error' }); return;
    }
    setSaving(true); setMsg({ text: '', type: '' });
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/schools?id=${editItem.id}` : '/api/schools';
      const res = await fetch(url, { method, headers: getH(), body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        setEditItem(null);
        setForm({ name: '', name_ar: '', email: '', phone: '', plan: 'basic', institution_type: 'school' });
        setMsg({ text: editItem ? 'تم تعديل المؤسسة بنجاح' : 'تمت إضافة المؤسسة بنجاح', type: 'success' });
        fetchAll();
      } else {
        setMsg({ text: data.error || 'فشل الحفظ', type: 'error' });
      }
    } catch (e: any) {
      setMsg({ text: e.message || 'حدث خطأ', type: 'error' });
    } finally { setSaving(false); }
  };

  const handleToggle = async (id: string, status: string) => {
    setSaving(true);
    try {
      const newStatus = status === 'ACTIVE' || status === 'active' ? 'FROZEN' : 'ACTIVE';
      const res = await fetch(`/api/schools?id=${id}`, {
        method: 'PUT', headers: getH(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMsg({ text: newStatus === 'ACTIVE' ? 'تم تفعيل المؤسسة' : 'تم تجميد المؤسسة', type: 'success' });
        fetchAll();
      }
    } catch (e) { } finally { setSaving(false); }
  };

  const openEdit = (s: any) => {
    setEditItem(s);
    setForm({
      name: s.name || '',
      name_ar: s.name_ar || s.name || '',
      email: s.email || '',
      phone: s.phone || '',
      plan: s.plan || 'basic',
      institution_type: s.institution_type || 'school',
    });
    setShowModal(true);
  };

  // ── Filtered schools ──
  const filtered = schools.filter(s => {
    const matchFilter =
      filter === 'all' ? true :
      filter === 'active' ? (s.status === 'ACTIVE' || s.status === 'active') :
      filter === 'frozen' ? (s.status === 'FROZEN' || s.status === 'frozen') :
      filter === 'trial' ? s.plan === 'TRIAL' : true;
    const name = (s.name_ar || s.name || '').toLowerCase();
    const matchSearch = search ? name.includes(search.toLowerCase()) : true;
    return matchFilter && matchSearch;
  });

  const activeCount = schools.filter(s => s.status === 'ACTIVE' || s.status === 'active').length;
  const frozenCount = schools.filter(s => s.status === 'FROZEN' || s.status === 'frozen').length;
  const pendingCount = stats.pending || 0;

  // ── Loading ──
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `linear-gradient(135deg, ${GOLD}, #E8C060)`,
        animation: 'pulse 1.5s ease-in-out infinite',
        boxShadow: `0 0 30px rgba(212,168,67,0.3)`,
      }} />
      <p style={{ color: TEXT_DIM, fontSize: 14 }}>جاري التحميل...</p>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:0.75}}`}</style>
    </div>
  );

  return (
    <div style={{ direction: 'rtl', fontFamily: 'var(--font)' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .sa-fade { animation: fadeIn 0.3s ease forwards; }
        .sa-row:hover { background: rgba(255,255,255,0.02) !important; }
        .sa-quick:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.12) !important; transform: translateY(-2px); }
        .sa-stat:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.12) !important; }
        .sa-stat { transition: all 0.2s; }
        .sa-tab { transition: all 0.15s; }
        .sa-tab:hover { color: ${TEXT} !important; }
        .sa-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(212,168,67,0.35) !important; }
        input::placeholder { color: rgba(238,238,245,0.25); }
        select option { background: #0F0F1E; color: ${TEXT}; }
      `}</style>

      {/* ── Alert Banner ── */}
      {showAlert && pendingCount > 0 && (
        <div className="sa-fade" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(212,168,67,0.06)',
          border: `1px solid rgba(212,168,67,0.18)`,
          borderRadius: 12, padding: '11px 16px', marginBottom: 20,
          fontSize: 13,
        }}>
          <Ic d={Icons.alert} size={15} color={GOLD} />
          <span style={{ color: TEXT_DIM, flex: 1 }}>
            <strong style={{ color: GOLD }}>{pendingCount} مستخدم معلّق</strong> ينتظر المراجعة والتفعيل
          </span>
          <Link href="/dashboard/users" style={{ color: GOLD, fontWeight: 700, textDecoration: 'none', fontSize: 12 }}>مراجعة ←</Link>
          <button onClick={() => setShowAlert(false)} style={{ background: 'none', border: 'none', color: TEXT_MUTED, cursor: 'pointer', display: 'flex' }}>
            <Ic d={Icons.close} size={14} />
          </button>
        </div>
      )}

      {/* ── Global Message ── */}
      {msg.text && (
        <div className="sa-fade" style={{
          padding: '11px 16px', borderRadius: 10, marginBottom: 16,
          background: msg.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
          color: msg.type === 'success' ? GREEN : RED,
          fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ic d={msg.type === 'success' ? Icons.check : Icons.alert} size={15} color={msg.type === 'success' ? GREEN : RED} />
            {msg.text}
          </span>
          <button onClick={() => setMsg({ text: '', type: '' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <Ic d={Icons.close} size={14} />
          </button>
        </div>
      )}

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: GOLD, fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ic d={Icons.building} size={20} color={GOLD} />
            لوحة مالك المنصة
          </h1>
          <p style={{ color: TEXT_MUTED, fontSize: 13, margin: '5px 0 0', fontWeight: 400 }}>إدارة كاملة للمؤسسات والمستخدمين والمالية</p>
        </div>
        <button
          className="sa-btn-primary"
          onClick={() => { setShowModal(true); setEditItem(null); setForm({ name: '', name_ar: '', email: '', phone: '', plan: 'basic', institution_type: 'school' }); }}
          style={{
            background: `linear-gradient(135deg, ${GOLD}, #E8C060)`,
            border: 'none', borderRadius: 10, padding: '10px 20px',
            color: 'var(--bg)', fontWeight: 700, cursor: 'pointer', fontSize: 14,
            fontFamily: 'var(--font)',
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 4px 16px rgba(212,168,67,0.25)',
            transition: 'all 0.2s',
          }}
        >
          <Ic d={Icons.plus} size={15} color="#06060E" sw={2.5} />
          إضافة مؤسسة
        </button>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          {
            label: 'المؤسسات التعليمية', value: stats.schools || schools.length || 0,
            color: BLUE, icon: Icons.building,
            sub: `${activeCount} نشطة · ${frozenCount} متجمدة`,
          },
          {
            label: 'إجمالي الطلاب', value: (stats.students || 0).toLocaleString('ar-SA'),
            color: GREEN, icon: Icons.students,
            sub: 'عبر كل المؤسسات',
          },
          {
            label: 'المعلمون والموظفون', value: (stats.teachers || 0).toLocaleString('ar-SA'),
            color: PURPLE, icon: Icons.teachers,
            sub: `${stats.owners || 0} مالك مؤسسة`,
          },
          {
            label: 'المستخدمون النشطون', value: (stats.active_users || 0).toLocaleString('ar-SA'),
            color: GOLD, icon: Icons.users,
            sub: `${pendingCount} معلّق`,
          },
        ].map((s, i) => (
          <div key={i} className="sa-stat" style={{
            background: BG_CARD,
            border: `1px solid ${BORDER2}`,
            borderRadius: 14, padding: '18px 20px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, ${s.color}08 0%, transparent 60%)`,
              pointerEvents: 'none',
            }} />
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `${s.color}15`,
              border: `1px solid ${s.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <Ic d={s.icon} size={17} color={s.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 5 }}>{s.value}</div>
            <div style={{ color: TEXT_MUTED, fontSize: 12, fontWeight: 500 }}>{s.label}</div>
            <div style={{ color: `${s.color}90`, fontSize: 11, marginTop: 5, fontWeight: 500 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Secondary Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        <Link href="/dashboard/ads" style={{ textDecoration: 'none' }}>
          <div className="sa-stat" style={{
            background: BG_CARD, border: `1px solid ${BORDER2}`,
            borderRadius: 12, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic d={Icons.ads} size={16} color="#FB923C" />
            </div>
            <div>
              <div style={{ color: TEXT_MUTED, fontSize: 11, marginBottom: 2 }}>الإعلانات السيادية</div>
              <div style={{ color: '#FB923C', fontSize: 17, fontWeight: 800 }}>إدارة →</div>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/taxes" style={{ textDecoration: 'none' }}>
          <div className="sa-stat" style={{
            background: BG_CARD, border: `1px solid ${BORDER2}`,
            borderRadius: 12, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic d={Icons.tax} size={16} color={GREEN} />
            </div>
            <div>
              <div style={{ color: TEXT_MUTED, fontSize: 11, marginBottom: 2 }}>الضرائب السيادية</div>
              <div style={{ color: GREEN, fontSize: 17, fontWeight: 800 }}>عرض →</div>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/join-requests" style={{ textDecoration: 'none' }}>
          <div className="sa-stat" style={{
            background: BG_CARD, border: `1px solid rgba(239,68,68,0.15)`,
            borderRadius: 12, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic d={Icons.pending} size={16} color={RED} />
            </div>
            <div>
              <div style={{ color: TEXT_MUTED, fontSize: 11, marginBottom: 2 }}>طلبات الانضمام</div>
              <div style={{ color: RED, fontSize: 17, fontWeight: 800 }}>مراجعة →</div>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Institutions Table ── */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Ic d={Icons.building} size={16} color={GOLD} />
            <span style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>
              المؤسسات المسجلة
            </span>
            <span style={{
              background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.25)',
              color: GOLD, fontSize: 11, fontWeight: 700,
              padding: '2px 9px', borderRadius: 20,
            }}>
              {schools.length}
            </span>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 260, marginRight: 'auto', marginLeft: 16 }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-card)', border: `1px solid ${BORDER}`,
              borderRadius: 8, padding: '6px 12px',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text" value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="بحث..."
                style={{ background: 'none', border: 'none', outline: 'none', color: TEXT, fontSize: 12.5, width: '100%', fontFamily: 'var(--font)' }}
              />
            </div>
          </div>
        </CardHeader>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '10px 16px', borderBottom: `1px solid ${BORDER2}` }}>
          {[
            { key: 'all', label: `الكل (${schools.length})` },
            { key: 'active', label: `نشطة (${activeCount})` },
            { key: 'frozen', label: `متجمدة (${frozenCount})` },
          ].map(tab => (
            <button
              key={tab.key}
              className="sa-tab"
              onClick={() => setFilter(tab.key)}
              style={{
                background: filter === tab.key ? 'rgba(212,168,67,0.12)' : 'transparent',
                border: `1px solid ${filter === tab.key ? 'rgba(212,168,67,0.25)' : 'transparent'}`,
                borderRadius: 7, padding: '5px 14px',
                color: filter === tab.key ? GOLD : TEXT_DIM,
                fontSize: 12, fontWeight: filter === tab.key ? 700 : 400,
                cursor: 'pointer', fontFamily: 'var(--font)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: TEXT_MUTED, fontSize: 14 }}>
            {search ? 'لا توجد نتائج للبحث' : 'لا توجد مؤسسات مسجلة'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(212,168,67,0.04)' }}>
                  {['المؤسسة', 'النوع', 'الباقة', 'الحالة', 'المالك', 'تاريخ التسجيل', 'الإجراءات'].map(h => (
                    <th key={h} style={{
                      padding: '11px 16px', textAlign: 'right',
                      color: GOLD, fontWeight: 700, fontSize: 11.5,
                      borderBottom: `1px solid ${BORDER2}`, whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s: any) => {
                  const isActive = s.status === 'ACTIVE' || s.status === 'active';
                  const plan = planConfig[s.plan] || planConfig.basic;
                  const createdAt = s.created_at ? new Date(s.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
                  return (
                    <tr key={s.id} className="sa-row" style={{ borderBottom: `1px solid ${BORDER2}`, transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: TEXT, fontSize: 13 }}>{s.name_ar || s.name}</div>
                        {s.city && <div style={{ color: TEXT_MUTED, fontSize: 11, marginTop: 2 }}>{s.city}</div>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: TEXT_DIM, fontSize: 12 }}>
                          {typeLabels[s.institution_type] || s.institution_type || 'مدرسة'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge color={plan.color} bg={plan.bg} border={plan.border}>
                          {plan.label}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {isActive
                          ? <Badge color={GREEN} bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.2)">● نشط</Badge>
                          : <Badge color={RED} bg="rgba(239,68,68,0.1)" border="rgba(239,68,68,0.2)">● متجمد</Badge>
                        }
                      </td>
                      <td style={{ padding: '12px 16px', color: TEXT_DIM, fontSize: 12 }}>
                        {s.owner_name || '—'}
                      </td>
                      <td style={{ padding: '12px 16px', color: TEXT_MUTED, fontSize: 12, whiteSpace: 'nowrap' }}>
                        {createdAt}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <BtnSm
                            color={GOLD} bg="rgba(212,168,67,0.08)" border="rgba(212,168,67,0.2)"
                            onClick={() => openEdit(s)}
                          >تعديل</BtnSm>
                          <BtnSm
                            color={isActive ? RED : GREEN}
                            bg={isActive ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)'}
                            border={isActive ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}
                            onClick={() => handleToggle(s.id, s.status)}
                            disabled={saving}
                          >{isActive ? 'تجميد' : 'تفعيل'}</BtnSm>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Quick Actions ── */}
      <div style={{ marginTop: 20 }}>
        <div style={{ color: TEXT_MUTED, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>إجراءات سريعة</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
          {[
            { label: 'المستخدمون', icon: Icons.users, href: '/dashboard/users', color: BLUE },
            { label: 'الاشتراكات', icon: Icons.shield, href: '/dashboard/subscriptions', color: GOLD },
            { label: 'الإعلانات', icon: Icons.ads, href: '/dashboard/ads', color: '#FB923C' },
            { label: 'الضرائب', icon: Icons.tax, href: '/dashboard/taxes', color: GREEN },
            { label: 'المتجر', icon: Icons.store, href: '/dashboard/store', color: PURPLE },
            { label: 'الإعدادات', icon: Icons.settings, href: '/dashboard/settings', color: TEXT_DIM },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
              <div className="sa-quick" style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${BORDER2}`,
                borderRadius: 10, padding: '14px 10px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                cursor: 'pointer', transition: 'all 0.15s',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: `${item.color}12`,
                  border: `1px solid ${item.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ic d={item.icon} size={16} color={item.color} />
                </div>
                <span style={{ color: TEXT_DIM, fontSize: 11.5, fontWeight: 500 }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Modal: Add/Edit ── */}
      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setMsg({ text: '', type: '' }); }}
        title={editItem ? 'تعديل المؤسسة' : 'إضافة مؤسسة جديدة'}
      >
        {msg.text && showModal && (
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 16,
            background: msg.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: msg.type === 'success' ? GREEN : RED, fontSize: 13,
          }}>{msg.text}</div>
        )}

        {[
          { label: 'اسم المؤسسة بالعربي *', key: 'name_ar', type: 'text', ph: 'مثال: مدرسة الأمل الدولية' },
          { label: 'اسم المؤسسة بالإنجليزي', key: 'name', type: 'text', ph: 'Al Amal International School' },
          { label: 'البريد الإلكتروني', key: 'email', type: 'email', ph: 'info@school.com' },
          { label: 'رقم الهاتف', key: 'phone', type: 'tel', ph: '05xxxxxxxx' },
        ].map(({ label, key, type, ph }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type} value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              placeholder={ph} style={inputStyle}
            />
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>نوع المؤسسة</label>
            <select value={form.institution_type} onChange={e => setForm({ ...form, institution_type: e.target.value })} style={{ ...inputStyle }}>
              <option value="school">مدرسة</option>
              <option value="university">جامعة</option>
              <option value="institute">معهد</option>
              <option value="kindergarten">روضة</option>
              <option value="training">تدريب</option>
              <option value="mosque">مسجد</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>الباقة</label>
            <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} style={{ ...inputStyle }}>
              <option value="basic">أساسي</option>
              <option value="advanced">متقدم</option>
              <option value="enterprise">مؤسسي</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleSave} disabled={saving}
            style={{
              flex: 1,
              background: saving ? 'rgba(212,168,67,0.4)' : `linear-gradient(135deg, ${GOLD}, #E8C060)`,
              border: 'none', borderRadius: 10, padding: '12px 0',
              color: 'var(--bg)', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: 14, fontFamily: 'var(--font)',
            }}
          >
            {saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'إضافة المؤسسة'}
          </button>
          <button
            onClick={() => { setShowModal(false); setMsg({ text: '', type: '' }); }}
            style={{
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${BORDER}`,
              borderRadius: 10, color: TEXT_DIM,
              cursor: 'pointer', fontSize: 14,
              fontFamily: 'var(--font)',
            }}
          >إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
