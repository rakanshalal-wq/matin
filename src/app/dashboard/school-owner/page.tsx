'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SB_W = 266;
const BG = '#06060E';
const SB_BG = '#070F0A';
const C = '#34D399';
const GD = '#D4A843';
const TXT = '#EEEEF5';
const DIM = 'rgba(238,238,245,0.5)';
const MUT = 'rgba(238,238,245,0.3)';
const BD = 'rgba(255,255,255,0.08)';
const CD = 'rgba(255,255,255,0.03)';

const FONT = "'IBM Plex Sans Arabic', sans-serif";

export default function SchoolOwnerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState('school');
  const [reviewModal, setReviewModal] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        const [meRes, statsRes, schoolsRes, admRes, actRes] = await Promise.all([
          fetch('/api/auth/me', { credentials: 'include' }),
          fetch('/api/dashboard-stats', { credentials: 'include' }),
          fetch('/api/schools', { credentials: 'include' }),
          fetch('/api/admission', { credentials: 'include' }),
          fetch('/api/activity-log', { credentials: 'include' }),
        ]);
        if (meRes.ok) { const d = await meRes.json(); setUser(d.user || d); }
        if (statsRes.ok) setStats(await statsRes.json());
        if (schoolsRes.ok) { const d = await schoolsRes.json(); setSchool(Array.isArray(d) ? d[0] : d); }
        if (admRes.ok) setAdmissions(await admRes.json());
        if (actRes.ok) setActivities(await actRes.json());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleAdmission = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admission', {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action === 'approve' ? 'approved' : 'rejected' }),
      });
      if (res.ok) {
        setAdmissions(prev => prev.filter(a => a.id !== id));
        setReviewModal(null);
      }
    } catch (e) {}
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, color: C, fontFamily: FONT, direction: 'rtl' }}>
      جاري التحميل...
    </div>
  );

  const schoolName = school?.name || 'مدرسة الأمل الدولية';
  const ownerName = user?.name || 'مالك المدرسة';

  const units = [
    { id: 'all', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, name: 'جميع الوحدات', type: 'all' },
    { id: 'school', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, name: schoolName, type: 'school', students: stats.students || 320, staff: 45, capacity: 85 },
    { id: 'kg', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, name: 'روضة الأمل', type: 'kg', students: 96, staff: 22, capacity: 80 },
    { id: 'nursery', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, name: 'حضانة الأمل', type: 'nursery', students: 70, staff: 19, capacity: 90 },
  ];

  const navGroups = [
    { label: 'الرئيسية', items: [
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, name: 'لوحة التحكم', path: '/dashboard/school-owner' },
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, name: 'التقارير', path: '/dashboard/reports', badge: '' },
    ]},
    { label: 'إدارة الوحدات', items: [
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, name: 'المدارس والفروع', path: '/dashboard/schools' },
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, name: 'طلبات القبول', path: '/dashboard/admission', badge: `${admissions.length}` },
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>, name: 'الإعدادات المدرسية', path: '/dashboard/settings' },
    ]},
    { label: 'الموظفون', items: [
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, name: 'إدارة الموظفين', path: '/dashboard/employees' },
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>, name: 'العقود', path: '/dashboard/contracts', badge: '6' },
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, name: 'الرواتب', path: '/dashboard/salaries' },
    ]},
    { label: 'الطلاب', items: [
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, name: 'قائمة الطلاب', path: '/dashboard/students' },
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, name: 'الحضور والغياب', path: '/dashboard/attendance' },
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, name: 'الاختبارات', path: '/dashboard/exams' },
    ]},
    { label: 'المالية', items: [
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, name: 'الرسوم', path: '/dashboard/student-fees', badge: '38K' },
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, name: 'التقارير المالية', path: '/dashboard/finance' },
    ]},
    { label: 'النقل', items: [
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>, name: 'إدارة الباصات', path: '/dashboard/transport' },
      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, name: 'السائقين', path: '/dashboard/drivers' },
    ]},
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: FONT, direction: 'rtl', background: BG, color: TXT }}>
      
      {/* ═══ SIDEBAR ═══ */}
      <aside style={{ width: sidebarOpen ? SB_W : 0, background: SB_BG, borderLeft: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.3s', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C}, #047857)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>م</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: TXT }}>متين</div>
            <div style={{ fontSize: 9, color: MUT }}>لوحة مالك المدرسة</div>
          </div>
        </div>

        {/* Owner Card */}
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C}22`, border: `1px solid ${C}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: TXT }}>{ownerName}</div>
              <div style={{ fontSize: 10, color: C }}>مالك {schoolName}</div>
            </div>
          </div>
        </div>

        {/* Unit List */}
        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${BD}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUT, marginBottom: 8, letterSpacing: 0.5 }}>وحداتي التعليمية</div>
          {units.map(u => (
            <button key={u.id} onClick={() => setActiveView(u.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 600, background: activeView === u.id ? `${C}18` : 'transparent', color: activeView === u.id ? C : DIM, marginBottom: 2, textAlign: 'right' }}>
              <span>{u.icon}</span> {u.name}
            </button>
          ))}
          <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '8px 10px', borderRadius: 9, border: `1px dashed ${BD}`, cursor: 'pointer', fontFamily: FONT, fontSize: 11, fontWeight: 600, background: 'transparent', color: MUT, marginTop: 4 }}>
            + إضافة وحدة
          </button>
        </div>

        {/* Nav Groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px' }}>
          {navGroups.map((g, gi) => (
            <div key={gi} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: MUT, marginBottom: 6, letterSpacing: 0.5 }}>{g.label}</div>
              {g.items.map((item, ii) => (
                <button key={ii} onClick={() => router.push(item.path)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 500, background: 'transparent', color: DIM, marginBottom: 1, textAlign: 'right', justifyContent: 'flex-start' }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {item.badge && <span style={{ background: `${C}22`, color: C, fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 6, border: `1px solid ${C}33` }}>{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header */}
        <header style={{ height: 56, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BD}`, background: 'rgba(6,6,14,0.8)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: DIM, fontSize: 18, fontFamily: FONT }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3"/></svg></button>
            <h1 style={{ fontSize: 16, fontWeight: 700 }}>
              {activeView === 'all' ? 'نظرة عامة — جميع الوحدات' : 
               activeView === 'school' ? `إدارة ${schoolName}` : 
               activeView === 'kg' ? 'إدارة روضة الأمل' : 'إدارة حضانة الأمل'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ position: 'relative', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BD}`, borderRadius: 9, width: 36, height: 36, cursor: 'pointer', color: DIM, fontSize: 16 }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span style={{ position: 'absolute', top: -2, left: -2, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            </button>
            <button onClick={() => setShowAddModal(true)} style={{ background: C, border: 'none', borderRadius: 9, padding: '7px 16px', color: '#06060E', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 5 }}>
              + إضافة وحدة
            </button>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${C}22`, border: `1px solid ${C}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
          </div>
        </header>

        {/* Unit Tabs */}
        <div style={{ display: 'flex', gap: 2, padding: '10px 24px 0', borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
          {units.map(u => (
            <button key={u.id} onClick={() => setActiveView(u.id)} style={{ padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 600, background: activeView === u.id ? `${C}18` : 'transparent', color: activeView === u.id ? C : MUT, borderBottom: activeView === u.id ? `2px solid ${C}` : '2px solid transparent' }}>
              {u.icon} {u.name}
            </button>
          ))}
          <button onClick={() => setShowAddModal(true)} style={{ padding: '8px 14px', borderRadius: '8px 8px 0 0', border: `1px dashed ${BD}`, borderBottom: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 11, fontWeight: 600, background: 'transparent', color: MUT, marginRight: 4 }}>
            ＋
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          
          {/* ═══ ALL UNITS VIEW ═══ */}
          {activeView === 'all' && (
            <>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'إجمالي الطلاب', value: stats.students || 486, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, color: '#60A5FA' },
                  { label: 'إجمالي الموظفين', value: stats.teachers ? stats.teachers + 20 : 86, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, color: C },
                  { label: 'الإيرادات الشهرية', value: `${((stats.revenue || 1200000) / 1000).toFixed(0)}K`, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: GD },
                  { label: 'طلبات القبول المعلقة', value: admissions.length || 14, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, color: '#FB923C' },
                ].map((s, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: DIM, fontWeight: 600 }}>{s.label}</span>
                      <span style={{ fontSize: 20 }}>{s.icon}</span>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Unit Overview Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {units.filter(u => u.id !== 'all').map((u, i) => (
                  <div key={i} onClick={() => setActiveView(u.id)} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 24 }}>{u.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: MUT }}>{u.type === 'school' ? 'مدرسة' : u.type === 'kg' ? 'روضة أطفال' : 'حضانة'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#60A5FA' }}>{u.students}</div>
                        <div style={{ fontSize: 10, color: MUT }}>طالب</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: C }}>{u.staff}</div>
                        <div style={{ fontSize: 10, color: MUT }}>موظف</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: MUT }}>
                      <span>السعة</span>
                      <span style={{ color: C }}>{u.capacity}%</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${u.capacity}%`, background: `linear-gradient(90deg, ${C}, #047857)`, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
                <div onClick={() => setShowAddModal(true)} style={{ background: CD, border: `1px dashed ${BD}`, borderRadius: 14, padding: 16, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${C}12`, border: `1px dashed ${C}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: C }}>+</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: DIM }}>إضافة وحدة جديدة</div>
                  <div style={{ fontSize: 10, color: MUT }}>مدرسة · روضة · حضانة</div>
                </div>
              </div>

              {/* Two Column: Admissions + Revenue */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Pending Admissions */}
                <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg> طلبات القبول المعلقة</h3>
                    <button onClick={() => router.push('/dashboard/admission')} style={{ background: `${C}18`, border: `1px solid ${C}33`, borderRadius: 7, padding: '4px 12px', color: C, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>عرض الكل</button>
                  </div>
                  {(admissions.length > 0 ? admissions.slice(0, 5) : [
                    { id: '1', student_name: 'أحمد محمد', grade: 'الصف الأول', date: '2026-03-25' },
                    { id: '2', student_name: 'فاطمة عبدالله', grade: 'KG2', date: '2026-03-24' },
                    { id: '3', student_name: 'عمر خالد', grade: 'الصف الثالث', date: '2026-03-23' },
                  ]).map((a: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BD}` }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{a.student_name || a.name || 'طالب'}</div>
                        <div style={{ fontSize: 11, color: MUT }}>{a.grade || 'غير محدد'} · {a.date ? new Date(a.date).toLocaleDateString('ar-SA') : ''}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => handleAdmission(a.id, 'approve')} style={{ background: `${C}22`, border: `1px solid ${C}44`, borderRadius: 6, padding: '4px 10px', color: C, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>قبول</button>
                        <button onClick={() => handleAdmission(a.id, 'reject')} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '4px 10px', color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>رفض</button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Revenue Breakdown */}
                <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> الإيرادات حسب الوحدة</h3>
                  {[
                    { name: schoolName, amount: '720K', pct: 60, color: '#60A5FA' },
                    { name: 'روضة الأمل', amount: '310K', pct: 26, color: C },
                    { name: 'حضانة الأمل', amount: '170K', pct: 14, color: GD },
                  ].map((r, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                        <span style={{ color: DIM }}>{r.name}</span>
                        <span style={{ fontWeight: 700, color: r.color }}>{r.amount} SAR</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                    <span>الإجمالي</span>
                    <span style={{ color: GD }}>1,200,000 SAR</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══ SCHOOL VIEW ═══ */}
          {activeView === 'school' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'الطلاب', value: stats.students || 320, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, color: '#60A5FA' },
                  { label: 'المعلمين', value: stats.teachers || 45, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, color: C },
                  { label: 'الفصول', value: stats.classes || 18, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, color: '#A78BFA' },
                  { label: 'نسبة الحضور', value: `${stats.attendance_rate || 94}%`, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, color: '#FB923C' },
                ].map((s, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: DIM }}>{s.label}</span>
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg> الفصول الدراسية</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {['الأول ابتدائي', 'الثاني ابتدائي', 'الثالث ابتدائي', 'الرابع ابتدائي', 'الخامس ابتدائي', 'السادس ابتدائي', 'الأول متوسط', 'الثاني متوسط', 'الثالث متوسط'].map((c, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BD}`, borderRadius: 10, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c}</div>
                        <div style={{ fontSize: 10, color: MUT }}>3 شعب · {28 + i * 2} طالب</div>
                      </div>
                      <div style={{ fontSize: 10, color: C, fontWeight: 600 }}>⟵</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══ KG VIEW ═══ */}
          {activeView === 'kg' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'الأطفال', value: 96, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, color: '#F472B6' },
                  { label: 'المعلمات', value: 18, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, color: C },
                  { label: 'الفصول', value: 6, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, color: '#A78BFA' },
                  { label: 'المساعدات', value: 4, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, color: '#FB923C' },
                ].map((s, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: DIM }}>{s.label}</span>
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: `${C}08`, border: `1px solid ${C}22`, borderRadius: 14, padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg></span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>نظام تقرير النمو</div>
                  <div style={{ fontSize: 12, color: DIM }}>تقارير شهرية لكل طفل — نمو جسدي، اجتماعي، معرفي، لغوي</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {['KG1 — تمهيدي', 'KG2 — أول روضة', 'KG3 — ثاني روضة'].map((level, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{level}</div>
                    <div style={{ fontSize: 12, color: DIM }}>{28 + i * 4} طفل · شعبتان</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══ NURSERY VIEW ═══ */}
          {activeView === 'nursery' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'الأطفال', value: 70, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, color: '#F472B6' },
                  { label: 'المربيات', value: 15, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, color: C },
                  { label: 'الغرف', value: 5, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, color: '#A78BFA' },
                  { label: 'قائمة الانتظار', value: 8, icon: '⏳', color: '#FB923C' },
                ].map((s, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: DIM }}>{s.label}</span>
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#FB923C08', border: '1px solid #FB923C22', borderRadius: 14, padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg></span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>التقرير اليومي</div>
                  <div style={{ fontSize: 12, color: DIM }}>تقرير يومي لكل طفل — أكل، نوم، نشاط، ملاحظات</div>
                </div>
              </div>
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> الأطفال المسجّلين</h3>
                {[
                  { name: 'ليان أحمد', age: '2.5 سنة', room: 'غرفة النجوم' },
                  { name: 'فارس محمد', age: '1.8 سنة', room: 'غرفة القمر' },
                  { name: 'جنى خالد', age: '3 سنوات', room: 'غرفة الشمس' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BD}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F472B622', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: MUT }}>{c.age} · {c.room}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Quick Actions (all views) */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> اختصارات سريعة</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
              {[
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, label: 'طلبات القبول', path: '/dashboard/admission' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, label: 'التقارير', path: '/dashboard/reports' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: 'المالية', path: '/dashboard/finance' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, label: 'الموظفين', path: '/dashboard/employees' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, label: 'الطلاب', path: '/dashboard/students' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, label: 'الحضور', path: '/dashboard/attendance' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>, label: 'الاختبارات', path: '/dashboard/exams' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>, label: 'النقل', path: '/dashboard/transport' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, label: 'المكتبة', path: '/dashboard/library' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'الرسائل', path: '/dashboard/messages' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, label: 'الإعدادات', path: '/dashboard/settings' },
                { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: 'صفحة المدرسة', path: `/school/${school?.code || ''}` },
              ].map((qa, i) => (
                <button key={i} onClick={() => router.push(qa.path)} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 10, padding: '12px 8px', cursor: 'pointer', fontFamily: FONT, textAlign: 'center', color: DIM, fontSize: 11, fontWeight: 600 }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{qa.icon}</div>
                  {qa.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ═══ ADD UNIT MODAL ═══ */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0C0C18', border: `1px solid ${BD}`, borderRadius: 18, padding: 28, width: 440, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>إضافة وحدة تعليمية</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUT, fontSize: 18 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
            </div>
            <div style={{ fontSize: 12, color: DIM, marginBottom: 16 }}>اختر نوع الوحدة:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { type: 'school', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, label: 'مدرسة' },
                { type: 'kg', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, label: 'روضة' },
                { type: 'nursery', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, label: 'حضانة' },
              ].map(t => (
                <button key={t.type} onClick={() => setSelectedUnitType(t.type)} style={{ background: selectedUnitType === t.type ? `${C}18` : CD, border: `1px solid ${selectedUnitType === t.type ? C+'44' : BD}`, borderRadius: 12, padding: 16, cursor: 'pointer', fontFamily: FONT, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selectedUnitType === t.type ? C : TXT }}>{t.label}</div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>اسم الوحدة</label>
                <input placeholder="مثال: مدرسة النور الابتدائية" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 9, padding: '9px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>العنوان</label>
                <input placeholder="مثال: حي النزهة، الرياض" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 9, padding: '9px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <button style={{ width: '100%', background: C, border: 'none', borderRadius: 10, padding: 12, color: '#06060E', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: FONT }}>
              إنشاء الوحدة ←
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
