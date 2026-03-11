'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const API = (path: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
  return fetch(path, { headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) } });
};

const GOLD = '#C9A84C';
const GOLD2 = '#E2C46A';
const BG = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';

const StatCard = ({ title, value, sub, color, icon, href }: any) => (
  <Link href={href || '#'} style={{ textDecoration: 'none' }}>
    <div style={{
      background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
      border: `1px solid ${color}20`,
      borderRadius: 16,
      padding: '20px 22px',
      cursor: 'pointer',
      transition: 'all 0.25s',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${color}20`;
        (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.borderColor = `${color}20`;
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`, borderRadius: '0 16px 0 0' }} />
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3 }}>{title}</div>
      <div style={{ color: color, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value ?? '—'}</div>
      {sub && <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11, marginTop: 6 }}>{sub}</div>}
    </div>
  </Link>
);

const SectionHeader = ({ title, icon, action, onAction }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <h2 style={{ color: '#EEEEF5', fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h2>
    </div>
    {action && (
      <button onClick={onAction} style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        {action}
      </button>
    )}
  </div>
);

const Badge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    active: '#10B981', inactive: '#EF4444', pending: '#F59E0B', paid: '#10B981',
    unpaid: '#EF4444', present: '#10B981', absent: '#EF4444', late: '#F59E0B',
    open: '#3B82F6', closed: '#6B7280', resolved: '#10B981',
  };
  const labels: Record<string, string> = {
    active: 'نشط', inactive: 'غير نشط', pending: 'معلق', paid: 'مدفوع',
    unpaid: 'غير مدفوع', present: 'حاضر', absent: 'غائب', late: 'متأخر',
    open: 'مفتوح', closed: 'مغلق', resolved: 'محلول',
  };
  const c = colors[status] || '#6B7280';
  return (
    <span style={{ background: `${c}15`, color: c, border: `1px solid ${c}30`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
      {labels[status] || status}
    </span>
  );
};

const Modal = ({ title, onClose, children }: any) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
    <div style={{ background: '#0D0D1A', border: `1px solid ${BORDER}`, borderRadius: 20, padding: 28, width: '90%', maxWidth: 520, maxHeight: '80vh', overflowY: 'auto', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ color: '#EEEEF5', fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(238,238,245,0.5)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
    />
  </div>
);

const Btn = ({ label, onClick, color = GOLD, disabled = false }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`, color: '#06060E', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, width: '100%' }}
  >
    {label}
  </button>
);

// ============================================================
// TABS
// ============================================================
const TABS = [
  { id: 'overview', label: 'نظرة عامة', icon: '🏠' },
  { id: 'students', label: 'الطلاب', icon: '👨‍🎓' },
  { id: 'teachers', label: 'المعلمون', icon: '👩‍🏫' },
  { id: 'classes', label: 'الفصول', icon: '🏛' },
  { id: 'exams', label: 'الاختبارات', icon: '📝' },
  { id: 'attendance', label: 'الحضور', icon: '✋' },
  { id: 'grades', label: 'الدرجات', icon: '📊' },
  { id: 'homework', label: 'الواجبات', icon: '📌' },
  { id: 'announcements', label: 'الإعلانات', icon: '📢' },
  { id: 'finance', label: 'المالية', icon: '💰' },
  { id: 'payroll', label: 'الرواتب', icon: '💵' },
  { id: 'schedules', label: 'الجداول', icon: '🗓' },
  { id: 'subjects', label: 'المواد', icon: '📚' },
  { id: 'parents', label: 'أولياء الأمور', icon: '👨‍👩‍👧' },
  { id: 'join_requests', label: 'طلبات الانضمام', icon: '📋' },
  { id: 'library', label: 'المكتبة', icon: '📖' },
  { id: 'reports', label: 'التقارير', icon: '📈' },
  { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
];

export default function InstitutionOwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [modal, setModal] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('matin_user');
    if (stored) setUser(JSON.parse(stored));
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const r = await API('/api/dashboard-stats');
      const d = await r.json();
      setStats(d.stats || d);
    } catch {}
    setLoading(false);
  };

  const loadTab = useCallback(async (tab: string) => {
    if (data[tab]) return;
    const endpoints: Record<string, string> = {
      students: '/api/students',
      teachers: '/api/teachers',
      classes: '/api/classes',
      exams: '/api/exams',
      attendance: '/api/attendance',
      grades: '/api/grades',
      homework: '/api/homework',
      announcements: '/api/announcements',
      finance: '/api/finance?type=fees',
      payroll: '/api/payroll',
      schedules: '/api/schedules',
      subjects: '/api/subjects',
      parents: '/api/parents',
      join_requests: '/api/join-requests',
      library: '/api/library',
      reports: '/api/reports',
      settings: '/api/settings',
    };
    const ep = endpoints[tab];
    if (!ep) return;
    try {
      const r = await API(ep);
      const d = await r.json();
      setData((prev: any) => ({ ...prev, [tab]: d.data || d.items || d.rows || d }));
    } catch {}
  }, [data]);

  useEffect(() => {
    if (activeTab !== 'overview') loadTab(activeTab);
  }, [activeTab]);

  const handleSubmit = async (endpoint: string, body: any, successMsg: string) => {
    try {
      const r = await API(endpoint);
      // POST
      const token = localStorage.getItem('matin_token');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (res.ok) {
        setMsg(successMsg);
        setModal(null);
        setForm({});
        setData((prev: any) => ({ ...prev, [activeTab]: undefined }));
        setTimeout(() => setMsg(''), 3000);
        loadTab(activeTab);
      } else {
        setMsg(d.error || 'حدث خطأ');
      }
    } catch {
      setMsg('حدث خطأ في الاتصال');
    }
  };

  const postData = async (endpoint: string, body: any, successMsg: string) => {
    const token = localStorage.getItem('matin_token');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (res.ok) {
        setMsg(successMsg);
        setModal(null);
        setForm({});
        setData((prev: any) => ({ ...prev, [activeTab]: undefined }));
        setTimeout(() => setMsg(''), 3000);
        setTimeout(() => loadTab(activeTab), 300);
      } else {
        setMsg(d.error || 'حدث خطأ');
      }
    } catch {
      setMsg('حدث خطأ في الاتصال');
    }
  };

  const deleteItem = async (endpoint: string, id: any) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    const token = localStorage.getItem('matin_token');
    try {
      await fetch(`${endpoint}?id=${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
      });
      setData((prev: any) => ({ ...prev, [activeTab]: undefined }));
      setTimeout(() => loadTab(activeTab), 300);
    } catch {}
  };

  const tabData = data[activeTab] || [];
  const filtered = Array.isArray(tabData) ? tabData.filter((item: any) => {
    if (!search) return true;
    return JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
  }) : tabData;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, borderRadius: 16, margin: '0 auto 16px', animation: 'pulse 2s infinite' }} />
        <p style={{ color: GOLD, fontSize: 16, fontWeight: 700 }}>جاري التحميل...</p>
      </div>
    </div>
  );

  return (
    <div style={{ direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ color: '#EEEEF5', fontSize: 22, fontWeight: 800, margin: 0 }}>
              مرحباً، {user?.name || 'مالك المؤسسة'} 👋
            </h1>
            <p style={{ color: 'rgba(238,238,245,0.4)', fontSize: 13, margin: '4px 0 0' }}>
              لوحة تحكم المؤسسة التعليمية
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={loadStats} style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              🔄 تحديث
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {msg && (
        <div style={{ background: msg.includes('خطأ') ? '#EF444415' : '#10B98115', border: `1px solid ${msg.includes('خطأ') ? '#EF4444' : '#10B981'}30`, borderRadius: 10, padding: '10px 16px', marginBottom: 16, color: msg.includes('خطأ') ? '#EF4444' : '#10B981', fontSize: 13, fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)` : 'rgba(255,255,255,0.04)',
              color: activeTab === tab.id ? '#06060E' : 'rgba(238,238,245,0.6)',
              border: `1px solid ${activeTab === tab.id ? 'transparent' : BORDER}`,
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ============ OVERVIEW ============ */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
            <StatCard title="إجمالي الطلاب" value={stats.students || stats.total_students || 0} icon="👨‍🎓" color="#3B82F6" href="/dashboard/students" />
            <StatCard title="المعلمون" value={stats.teachers || stats.total_teachers || 0} icon="👩‍🏫" color="#8B5CF6" href="/dashboard/teachers" />
            <StatCard title="الفصول" value={stats.classes || stats.total_classes || 0} icon="🏛" color="#10B981" href="/dashboard/classes" />
            <StatCard title="الاختبارات النشطة" value={stats.active_exams || 0} icon="📝" color="#EF4444" href="/dashboard/exams" />
            <StatCard title="الحضور اليوم" value={stats.attendance_today ? `${stats.attendance_today}%` : '—'} icon="✋" color="#06B6D4" href="/dashboard/attendance" />
            <StatCard title="الواجبات المعلقة" value={stats.pending_homework || 0} icon="📌" color="#F59E0B" href="/dashboard/homework" />
            <StatCard title="الإيرادات الشهرية" value={stats.monthly_revenue ? `${Number(stats.monthly_revenue).toLocaleString('ar-SA')} ر.س` : '—'} icon="💰" color="#C9A84C" href="/dashboard/finance" />
            <StatCard title="طلبات الانضمام" value={stats.pending_requests || 0} icon="📋" color="#A78BFA" href="/dashboard/join-requests" />
          </div>

          {/* Quick Actions */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <SectionHeader title="الإجراءات السريعة" icon="⚡" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {[
                { label: 'إضافة طالب', icon: '👨‍🎓', tab: 'students' },
                { label: 'إضافة معلم', icon: '👩‍🏫', tab: 'teachers' },
                { label: 'إضافة فصل', icon: '🏛', tab: 'classes' },
                { label: 'إضافة اختبار', icon: '📝', tab: 'exams' },
                { label: 'إعلان جديد', icon: '📢', tab: 'announcements' },
                { label: 'واجب جديد', icon: '📌', tab: 'homework' },
              ].map((action, i) => (
                <button key={i} onClick={() => setActiveTab(action.tab)} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '12px 8px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${GOLD}10`; (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}30`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{action.icon}</div>
                  <div style={{ color: 'rgba(238,238,245,0.7)', fontSize: 11, fontWeight: 600 }}>{action.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
              <SectionHeader title="آخر الطلاب المسجلين" icon="👨‍🎓" action="عرض الكل" onAction={() => setActiveTab('students')} />
              <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                اضغط على "عرض الكل" لرؤية الطلاب
              </div>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
              <SectionHeader title="الاختبارات القادمة" icon="📝" action="عرض الكل" onAction={() => setActiveTab('exams')} />
              <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                اضغط على "عرض الكل" لرؤية الاختبارات
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ STUDENTS ============ */}
      {activeTab === 'students' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
            <SectionHeader title="إدارة الطلاب" icon="👨‍🎓" />
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', width: 200 }} />
              <button onClick={() => setModal('add_student')} style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, color: '#06060E', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                + إضافة طالب
              </button>
            </div>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الاسم', 'البريد', 'الصف', 'الحالة', 'تاريخ التسجيل', 'إجراءات'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد بيانات</td></tr>
                ) : filtered.slice(0, 50).map((s: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 13, fontWeight: 600 }}>{s.name || s.student_name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{s.email || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{s.class_name || s.grade || s.class_id || '—'}</td>
                    <td style={{ padding: '12px 16px' }}><Badge status={s.status || 'active'} /></td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 11 }}>{s.created_at ? new Date(s.created_at).toLocaleDateString('ar-SA') : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => deleteItem('/api/students', s.id)} style={{ background: '#EF444415', color: '#EF4444', border: '1px solid #EF444430', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* ============ TEACHERS ============ */}
      {activeTab === 'teachers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
            <SectionHeader title="إدارة المعلمين" icon="👩‍🏫" />
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', width: 200 }} />
              <button onClick={() => setModal('add_teacher')} style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, color: '#06060E', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                + إضافة معلم
              </button>
            </div>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الاسم', 'البريد', 'التخصص', 'الحالة', 'تاريخ الانضمام', 'إجراءات'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد بيانات</td></tr>
                ) : filtered.slice(0, 50).map((t: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 13, fontWeight: 600 }}>{t.name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{t.email || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{t.subject || t.specialization || '—'}</td>
                    <td style={{ padding: '12px 16px' }}><Badge status={t.status || 'active'} /></td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 11 }}>{t.created_at ? new Date(t.created_at).toLocaleDateString('ar-SA') : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => deleteItem('/api/teachers', t.id)} style={{ background: '#EF444415', color: '#EF4444', border: '1px solid #EF444430', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* ============ CLASSES ============ */}
      {activeTab === 'classes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
            <SectionHeader title="إدارة الفصول" icon="🏛" />
            <button onClick={() => setModal('add_class')} style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, color: '#06060E', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              + إضافة فصل
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {Array.isArray(filtered) && filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد فصول</div>
            ) : Array.isArray(filtered) && filtered.map((cls: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}30`; (e.currentTarget as HTMLElement).style.background = `${GOLD}05`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = CARD; }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>🏛</div>
                <div style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{cls.name || cls.class_name || `فصل ${i + 1}`}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>المرحلة: {cls.grade || cls.level || '—'}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginTop: 4 }}>الطلاب: {cls.student_count || cls.students_count || 0}</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                  <button onClick={() => deleteItem('/api/classes', cls.id)} style={{ background: '#EF444415', color: '#EF4444', border: '1px solid #EF444430', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ EXAMS ============ */}
      {activeTab === 'exams' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
            <SectionHeader title="إدارة الاختبارات" icon="📝" />
            <button onClick={() => setModal('add_exam')} style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, color: '#06060E', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              + إضافة اختبار
            </button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الاختبار', 'المادة', 'الفصل', 'التاريخ', 'الحالة', 'إجراءات'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد اختبارات</td></tr>
                ) : filtered.slice(0, 50).map((e: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}
                    onMouseEnter={el => (el.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={el => (el.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 13, fontWeight: 600 }}>{e.title || e.name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{e.subject || e.subject_name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{e.class_name || e.class_id || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{e.exam_date || e.date ? new Date(e.exam_date || e.date).toLocaleDateString('ar-SA') : '—'}</td>
                    <td style={{ padding: '12px 16px' }}><Badge status={e.status || 'active'} /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => deleteItem('/api/exams', e.id)} style={{ background: '#EF444415', color: '#EF4444', border: '1px solid #EF444430', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* ============ ATTENDANCE ============ */}
      {activeTab === 'attendance' && (
        <div>
          <SectionHeader title="سجل الحضور والغياب" icon="✋" />
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الطالب', 'الفصل', 'التاريخ', 'الحالة', 'ملاحظات'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filtered) && filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد سجلات حضور</td></tr>
                ) : Array.isArray(filtered) && filtered.slice(0, 50).map((a: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 13 }}>{a.student_name || a.name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{a.class_name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{a.date ? new Date(a.date).toLocaleDateString('ar-SA') : '—'}</td>
                    <td style={{ padding: '12px 16px' }}><Badge status={a.status || 'present'} /></td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{a.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* ============ GRADES ============ */}
      {activeTab === 'grades' && (
        <div>
          <SectionHeader title="الدرجات والنتائج" icon="📊" />
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الطالب', 'المادة', 'الاختبار', 'الدرجة', 'النسبة', 'التقدير'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filtered) && filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد درجات</td></tr>
                ) : Array.isArray(filtered) && filtered.slice(0, 50).map((g: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 13 }}>{g.student_name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{g.subject || g.subject_name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{g.exam_title || g.exam_name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: GOLD, fontSize: 14, fontWeight: 700 }}>{g.score ?? g.grade ?? '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{g.percentage ? `${g.percentage}%` : '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#10B981', fontSize: 12, fontWeight: 600 }}>{g.letter_grade || g.grade_letter || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* ============ HOMEWORK ============ */}
      {activeTab === 'homework' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionHeader title="الواجبات المنزلية" icon="📌" />
            <button onClick={() => setModal('add_homework')} style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, color: '#06060E', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              + إضافة واجب
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {Array.isArray(filtered) && filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد واجبات</div>
            ) : Array.isArray(filtered) && filtered.map((hw: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700 }}>{hw.title || '—'}</div>
                  <Badge status={hw.status || 'active'} />
                </div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginBottom: 6 }}>المادة: {hw.subject || '—'}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginBottom: 6 }}>الفصل: {hw.class_name || '—'}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>الموعد النهائي: {hw.due_date ? new Date(hw.due_date).toLocaleDateString('ar-SA') : '—'}</div>
                <div style={{ marginTop: 12 }}>
                  <button onClick={() => deleteItem('/api/homework', hw.id)} style={{ background: '#EF444415', color: '#EF4444', border: '1px solid #EF444430', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ ANNOUNCEMENTS ============ */}
      {activeTab === 'announcements' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionHeader title="الإعلانات" icon="📢" />
            <button onClick={() => setModal('add_announcement')} style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, color: '#06060E', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              + إعلان جديد
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.isArray(filtered) && filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد إعلانات</div>
            ) : Array.isArray(filtered) && filtered.map((ann: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700 }}>{ann.title || '—'}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Badge status={ann.status || 'active'} />
                    <button onClick={() => deleteItem('/api/announcements', ann.id)} style={{ background: '#EF444415', color: '#EF4444', border: '1px solid #EF444430', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>حذف</button>
                  </div>
                </div>
                <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 13, lineHeight: 1.6 }}>{ann.content || ann.body || '—'}</div>
                <div style={{ color: 'rgba(238,238,245,0.3)', fontSize: 11, marginTop: 8 }}>{ann.created_at ? new Date(ann.created_at).toLocaleDateString('ar-SA') : '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ FINANCE ============ */}
      {activeTab === 'finance' && (
        <div>
          <SectionHeader title="الإدارة المالية" icon="💰" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
            <StatCard title="إجمالي الرسوم" value="—" icon="💵" color={GOLD} />
            <StatCard title="المدفوعات" value="—" icon="✅" color="#10B981" />
            <StatCard title="المتأخرات" value="—" icon="⚠️" color="#EF4444" />
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الطالب', 'نوع الرسوم', 'المبلغ', 'الحالة', 'تاريخ الاستحقاق'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filtered) && filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد سجلات مالية</td></tr>
                ) : Array.isArray(filtered) && filtered.slice(0, 50).map((f: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 13 }}>{f.student_name || f.name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{f.fee_type || f.type || '—'}</td>
                    <td style={{ padding: '12px 16px', color: GOLD, fontSize: 13, fontWeight: 700 }}>{f.amount ? `${Number(f.amount).toLocaleString('ar-SA')} ر.س` : '—'}</td>
                    <td style={{ padding: '12px 16px' }}><Badge status={f.status || 'pending'} /></td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{f.due_date ? new Date(f.due_date).toLocaleDateString('ar-SA') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* ============ PAYROLL ============ */}
      {activeTab === 'payroll' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionHeader title="إدارة الرواتب" icon="💵" />
            <button onClick={() => setModal('add_payroll')} style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, color: '#06060E', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              + إضافة راتب
            </button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الموظف', 'الدور', 'الراتب الأساسي', 'البدلات', 'الخصومات', 'الصافي', 'الشهر', 'الحالة', 'إجراءات'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 11, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filtered) && filtered.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد سجلات رواتب</td></tr>
                ) : Array.isArray(filtered) && filtered.slice(0, 50).map((p: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '10px 14px', color: '#EEEEF5', fontSize: 13 }}>{p.employee_name || p.employee_name_full || '—'}</td>
                    <td style={{ padding: '10px 14px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{p.role || p.employee_role || '—'}</td>
                    <td style={{ padding: '10px 14px', color: GOLD, fontSize: 12 }}>{p.basic_salary ? `${Number(p.basic_salary).toLocaleString()} ر.س` : '—'}</td>
                    <td style={{ padding: '10px 14px', color: '#10B981', fontSize: 12 }}>{p.allowances ? `${Number(p.allowances).toLocaleString()} ر.س` : '—'}</td>
                    <td style={{ padding: '10px 14px', color: '#EF4444', fontSize: 12 }}>{p.deductions ? `${Number(p.deductions).toLocaleString()} ر.س` : '—'}</td>
                    <td style={{ padding: '10px 14px', color: GOLD2, fontSize: 13, fontWeight: 700 }}>{p.net_salary ? `${Number(p.net_salary).toLocaleString()} ر.س` : '—'}</td>
                    <td style={{ padding: '10px 14px', color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{p.month && p.year ? `${p.month}/${p.year}` : '—'}</td>
                    <td style={{ padding: '10px 14px' }}><Badge status={p.status || 'pending'} /></td>
                    <td style={{ padding: '10px 14px' }}>
                      <button onClick={() => deleteItem('/api/payroll', p.id)} style={{ background: '#EF444415', color: '#EF4444', border: '1px solid #EF444430', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}>حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* ============ SCHEDULES ============ */}
      {activeTab === 'schedules' && (
        <div>
          <SectionHeader title="الجداول الدراسية" icon="🗓" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {Array.isArray(filtered) && filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد جداول</div>
            ) : Array.isArray(filtered) && filtered.map((s: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
                <div style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{s.subject || s.title || `جدول ${i + 1}`}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginBottom: 4 }}>الفصل: {s.class_name || '—'}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginBottom: 4 }}>اليوم: {s.day || '—'}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>الوقت: {s.start_time || '—'} - {s.end_time || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ SUBJECTS ============ */}
      {activeTab === 'subjects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionHeader title="المواد الدراسية" icon="📚" />
            <button onClick={() => setModal('add_subject')} style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, color: '#06060E', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              + إضافة مادة
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {Array.isArray(filtered) && filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد مواد</div>
            ) : Array.isArray(filtered) && filtered.map((sub: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
                <div style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{sub.name || sub.subject_name || '—'}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{sub.grade || sub.level || '—'}</div>
                <button onClick={() => deleteItem('/api/subjects', sub.id)} style={{ marginTop: 10, background: '#EF444415', color: '#EF4444', border: '1px solid #EF444430', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ PARENTS ============ */}
      {activeTab === 'parents' && (
        <div>
          <SectionHeader title="أولياء الأمور" icon="👨‍👩‍👧" />
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الاسم', 'البريد', 'الهاتف', 'الأبناء', 'الحالة'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filtered) && filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا يوجد أولياء أمور</td></tr>
                ) : Array.isArray(filtered) && filtered.slice(0, 50).map((p: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 13 }}>{p.name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{p.email || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{p.phone || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{p.children_count || p.students_count || '—'}</td>
                    <td style={{ padding: '12px 16px' }}><Badge status={p.status || 'active'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* ============ JOIN REQUESTS ============ */}
      {activeTab === 'join_requests' && (
        <div>
          <SectionHeader title="طلبات الانضمام" icon="📋" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.isArray(filtered) && filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد طلبات انضمام</div>
            ) : Array.isArray(filtered) && filtered.map((req: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{req.name || req.student_name || '—'}</div>
                    <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>البريد: {req.email || '—'}</div>
                    <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginTop: 2 }}>الصف المطلوب: {req.requested_grade || req.grade || '—'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Badge status={req.status || 'pending'} />
                    {req.status === 'pending' && (
                      <>
                        <button onClick={async () => {
                          const token = localStorage.getItem('matin_token');
                          await fetch(`/api/join-requests?id=${req.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: JSON.stringify({ status: 'approved' }) });
                          setData((prev: any) => ({ ...prev, join_requests: undefined }));
                          setTimeout(() => loadTab('join_requests'), 300);
                        }} style={{ background: '#10B98115', color: '#10B981', border: '1px solid #10B98130', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>قبول</button>
                        <button onClick={async () => {
                          const token = localStorage.getItem('matin_token');
                          await fetch(`/api/join-requests?id=${req.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }, body: JSON.stringify({ status: 'rejected' }) });
                          setData((prev: any) => ({ ...prev, join_requests: undefined }));
                          setTimeout(() => loadTab('join_requests'), 300);
                        }} style={{ background: '#EF444415', color: '#EF4444', border: '1px solid #EF444430', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>رفض</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ LIBRARY ============ */}
      {activeTab === 'library' && (
        <div>
          <SectionHeader title="المكتبة الرقمية" icon="📖" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {Array.isArray(filtered) && filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد كتب أو مواد</div>
            ) : Array.isArray(filtered) && filtered.map((book: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📖</div>
                <div style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{book.title || book.name || '—'}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>المؤلف: {book.author || '—'}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginTop: 4 }}>النوع: {book.type || book.category || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ REPORTS ============ */}
      {activeTab === 'reports' && (
        <div>
          <SectionHeader title="التقارير والإحصائيات" icon="📈" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
            <StatCard title="الطلاب الكلي" value={stats.students || 0} icon="👨‍🎓" color="#3B82F6" />
            <StatCard title="المعلمون" value={stats.teachers || 0} icon="👩‍🏫" color="#8B5CF6" />
            <StatCard title="الفصول" value={stats.classes || 0} icon="🏛" color="#10B981" />
            <StatCard title="الاختبارات" value={stats.active_exams || 0} icon="📝" color="#EF4444" />
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                  {['التقرير', 'النوع', 'التاريخ', 'الحالة'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filtered) && filtered.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.3)', fontSize: 14 }}>لا توجد تقارير</td></tr>
                ) : Array.isArray(filtered) && filtered.slice(0, 50).map((r: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 13 }}>{r.title || r.name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{r.type || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : '—'}</td>
                    <td style={{ padding: '12px 16px' }}><Badge status={r.status || 'active'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* ============ SETTINGS ============ */}
      {activeTab === 'settings' && (
        <div>
          <SectionHeader title="إعدادات المؤسسة" icon="⚙️" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.isArray(filtered) && filtered.map((setting: any, i: number) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#EEEEF5', fontSize: 13, fontWeight: 600 }}>{setting.key || '—'}</div>
                  <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginTop: 4 }}>{setting.description || '—'}</div>
                </div>
                <div style={{ color: GOLD, fontSize: 13, fontWeight: 600 }}>{String(setting.value || '—')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============ MODALS ============ */}
      {modal === 'add_student' && (
        <Modal title="إضافة طالب جديد" onClose={() => { setModal(null); setForm({}); }}>
          <Input label="الاسم الكامل" value={form.name || ''} onChange={(v: string) => setForm({ ...form, name: v })} placeholder="محمد أحمد" />
          <Input label="البريد الإلكتروني" value={form.email || ''} onChange={(v: string) => setForm({ ...form, email: v })} type="email" placeholder="student@school.com" />
          <Input label="كلمة المرور" value={form.password || ''} onChange={(v: string) => setForm({ ...form, password: v })} type="password" placeholder="••••••••" />
          <Input label="الصف الدراسي" value={form.grade || ''} onChange={(v: string) => setForm({ ...form, grade: v })} placeholder="الأول الابتدائي" />
          <Btn label="إضافة الطالب" onClick={() => postData('/api/students', { ...form, role: 'student' }, 'تم إضافة الطالب بنجاح')} />
        </Modal>
      )}

      {modal === 'add_teacher' && (
        <Modal title="إضافة معلم جديد" onClose={() => { setModal(null); setForm({}); }}>
          <Input label="الاسم الكامل" value={form.name || ''} onChange={(v: string) => setForm({ ...form, name: v })} placeholder="أحمد محمد" />
          <Input label="البريد الإلكتروني" value={form.email || ''} onChange={(v: string) => setForm({ ...form, email: v })} type="email" placeholder="teacher@school.com" />
          <Input label="كلمة المرور" value={form.password || ''} onChange={(v: string) => setForm({ ...form, password: v })} type="password" placeholder="••••••••" />
          <Input label="التخصص" value={form.subject || ''} onChange={(v: string) => setForm({ ...form, subject: v })} placeholder="الرياضيات" />
          <Btn label="إضافة المعلم" onClick={() => postData('/api/teachers', { ...form, role: 'teacher' }, 'تم إضافة المعلم بنجاح')} />
        </Modal>
      )}

      {modal === 'add_class' && (
        <Modal title="إضافة فصل جديد" onClose={() => { setModal(null); setForm({}); }}>
          <Input label="اسم الفصل" value={form.name || ''} onChange={(v: string) => setForm({ ...form, name: v })} placeholder="الأول أ" />
          <Input label="المرحلة الدراسية" value={form.grade || ''} onChange={(v: string) => setForm({ ...form, grade: v })} placeholder="الأول الابتدائي" />
          <Input label="السعة القصوى" value={form.capacity || ''} onChange={(v: string) => setForm({ ...form, capacity: v })} type="number" placeholder="30" />
          <Btn label="إضافة الفصل" onClick={() => postData('/api/classes', form, 'تم إضافة الفصل بنجاح')} />
        </Modal>
      )}

      {modal === 'add_exam' && (
        <Modal title="إضافة اختبار جديد" onClose={() => { setModal(null); setForm({}); }}>
          <Input label="عنوان الاختبار" value={form.title || ''} onChange={(v: string) => setForm({ ...form, title: v })} placeholder="اختبار الفصل الأول" />
          <Input label="المادة" value={form.subject || ''} onChange={(v: string) => setForm({ ...form, subject: v })} placeholder="الرياضيات" />
          <Input label="تاريخ الاختبار" value={form.exam_date || ''} onChange={(v: string) => setForm({ ...form, exam_date: v })} type="date" />
          <Input label="الدرجة الكاملة" value={form.total_marks || ''} onChange={(v: string) => setForm({ ...form, total_marks: v })} type="number" placeholder="100" />
          <Btn label="إضافة الاختبار" onClick={() => postData('/api/exams', form, 'تم إضافة الاختبار بنجاح')} />
        </Modal>
      )}

      {modal === 'add_homework' && (
        <Modal title="إضافة واجب جديد" onClose={() => { setModal(null); setForm({}); }}>
          <Input label="عنوان الواجب" value={form.title || ''} onChange={(v: string) => setForm({ ...form, title: v })} placeholder="واجب الرياضيات" />
          <Input label="المادة" value={form.subject || ''} onChange={(v: string) => setForm({ ...form, subject: v })} placeholder="الرياضيات" />
          <Input label="الموعد النهائي" value={form.due_date || ''} onChange={(v: string) => setForm({ ...form, due_date: v })} type="date" />
          <Input label="التفاصيل" value={form.description || ''} onChange={(v: string) => setForm({ ...form, description: v })} placeholder="تفاصيل الواجب..." />
          <Btn label="إضافة الواجب" onClick={() => postData('/api/homework', form, 'تم إضافة الواجب بنجاح')} />
        </Modal>
      )}

      {modal === 'add_announcement' && (
        <Modal title="إضافة إعلان جديد" onClose={() => { setModal(null); setForm({}); }}>
          <Input label="عنوان الإعلان" value={form.title || ''} onChange={(v: string) => setForm({ ...form, title: v })} placeholder="إعلان هام" />
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>محتوى الإعلان</label>
            <textarea value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="محتوى الإعلان..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 14, outline: 'none', boxSizing: 'border-box', minHeight: 100, resize: 'vertical' }} />
          </div>
          <Btn label="نشر الإعلان" onClick={() => postData('/api/announcements', form, 'تم نشر الإعلان بنجاح')} />
        </Modal>
      )}

      {modal === 'add_subject' && (
        <Modal title="إضافة مادة دراسية" onClose={() => { setModal(null); setForm({}); }}>
          <Input label="اسم المادة" value={form.name || ''} onChange={(v: string) => setForm({ ...form, name: v })} placeholder="الرياضيات" />
          <Input label="المرحلة الدراسية" value={form.grade || ''} onChange={(v: string) => setForm({ ...form, grade: v })} placeholder="الأول الابتدائي" />
          <Input label="عدد الحصص أسبوعياً" value={form.hours_per_week || ''} onChange={(v: string) => setForm({ ...form, hours_per_week: v })} type="number" placeholder="5" />
          <Btn label="إضافة المادة" onClick={() => postData('/api/subjects', form, 'تم إضافة المادة بنجاح')} />
        </Modal>
      )}

      {modal === 'add_payroll' && (
        <Modal title="إضافة راتب" onClose={() => { setModal(null); setForm({}); }}>
          <Input label="اسم الموظف" value={form.employee_name || ''} onChange={(v: string) => setForm({ ...form, employee_name: v })} placeholder="محمد أحمد" />
          <Input label="الدور الوظيفي" value={form.role || ''} onChange={(v: string) => setForm({ ...form, role: v })} placeholder="معلم" />
          <Input label="الراتب الأساسي (ر.س)" value={form.basic_salary || ''} onChange={(v: string) => setForm({ ...form, basic_salary: v })} type="number" placeholder="5000" />
          <Input label="البدلات (ر.س)" value={form.allowances || ''} onChange={(v: string) => setForm({ ...form, allowances: v })} type="number" placeholder="500" />
          <Input label="الخصومات (ر.س)" value={form.deductions || ''} onChange={(v: string) => setForm({ ...form, deductions: v })} type="number" placeholder="0" />
          <Input label="الشهر" value={form.month || ''} onChange={(v: string) => setForm({ ...form, month: v })} type="number" placeholder="3" />
          <Input label="السنة" value={form.year || ''} onChange={(v: string) => setForm({ ...form, year: v })} type="number" placeholder="2026" />
          <Btn label="إضافة الراتب" onClick={() => postData('/api/payroll', form, 'تم إضافة الراتب بنجاح')} />
        </Modal>
      )}
    </div>
  );
}
