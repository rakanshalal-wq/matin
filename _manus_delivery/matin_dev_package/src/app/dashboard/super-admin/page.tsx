"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
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
  money:       "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  activity:    "M22 12h-4l-3 9L9 3l-3 9H2",
  plus:        "M12 5v14 M5 12h14",
  edit:        "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  eye:         "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  alert:       "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  close:       "M18 6L6 18 M6 6l12 12",
  check:       "M20 6L9 17l-5-5",
  ads:         "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18",
  store:       "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  settings:    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06-.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div style={{
    background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20,
    display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s'
  }}>
    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Ic d={icon} size={20} color={color} />
    </div>
    <div>
      <div style={{ color: TEXT_MUTED, fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: TEXT }}>{value}</div>
    </div>
  </div>
);

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({ institutions: 12, students: '4.5k', revenue: '12,400 ر.س', store: '3,200 ر.س' });
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (u.role !== 'super_admin' && u.role !== 'owner') {
      router.replace('/dashboard');
      return;
    }
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools', { headers: getH() });
      const data = await res.json();
      setSchools(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: GOLD }}>جاري التحميل...</div>;

  return (
    <div style={{ direction: 'rtl', fontFamily: 'var(--font)', padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: GOLD, fontSize: 24, fontWeight: 900, margin: 0 }}>لوحة تحكم السلطة العليا</h1>
          <p style={{ color: TEXT_MUTED, fontSize: 13, marginTop: 4 }}>إدارة مركزية للمنصة وكافة المؤسسات التعليمية</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/dashboard/super-admin/platform-settings" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'rgba(255,255,255,0.05)', color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Ic d={Icons.ads} size={16} /> إعدادات المنصة
            </button>
          </Link>
          <button style={{ background: GOLD, color: '#000', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ic d={Icons.plus} size={16} /> إضافة مؤسسة
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        <StatCard title="إجمالي المؤسسات" value={schools.length} icon={Icons.building} color={BLUE} />
        <StatCard title="الطلاب النشطين" value={stats.students} icon={Icons.students} color={GREEN} />
        <StatCard title="إيرادات الباقات" value={stats.revenue} icon={Icons.money} color={GOLD} />
        <StatCard title="مبيعات المتجر المركزي" value={stats.store} icon={Icons.store} color={PURPLE} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Schools Table */}
        <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 20 }}>المؤسسات المسجلة</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER2}` }}>
                <th style={{ textAlign: 'right', padding: '12px', color: TEXT_MUTED, fontSize: 12 }}>المؤسسة</th>
                <th style={{ textAlign: 'right', padding: '12px', color: TEXT_MUTED, fontSize: 12 }}>الحالة</th>
                <th style={{ textAlign: 'right', padding: '12px', color: TEXT_MUTED, fontSize: 12 }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {schools.map(s => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${BORDER2}` }}>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 700, color: TEXT }}>{s.name_ar || s.name}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED }}>{s.institution_type}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ background: s.status === 'ACTIVE' ? `${GREEN}15` : `${RED}15`, color: s.status === 'ACTIVE' ? GREEN : RED, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{s.status}</span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Ic d={Icons.edit} size={16} color={TEXT_MUTED} />
                      <Ic d={Icons.eye} size={16} color={TEXT_MUTED} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Ic d={Icons.activity} size={18} color={GOLD} /> نشاط المنصة
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { t: 'انضمام مدرسة جديدة', s: 'منذ 10 د', c: BLUE },
              { t: 'عملية شراء في المتجر', s: 'منذ 25 د', c: PURPLE },
              { t: 'تحديث إعدادات مؤسسة', s: 'منذ 1 ساعة', c: GREEN },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${a.c}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ic d={Icons.activity} size={14} color={a.c} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{a.t}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>{a.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
