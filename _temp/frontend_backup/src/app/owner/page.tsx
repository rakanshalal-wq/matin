'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// ─── Constants ────────────────────────────────────────────────────────────────
const G = '#C9A84C'; // Gold
const DARK = '#06060E'; // Background
const CARD_BG = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SVG_PATHS: Record<string, string> = {
  overview:      'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  schools:       'M3 21h18 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16',
  users:         'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  subscriptions: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  plans:         'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  services:      'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  store:         'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0',
  ads:           'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z',
  support:       'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  permissions:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  integrations:  'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  community:     'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87',
  notifications: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  settings:      'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4',
  activity:      'M22 12h-4l-3 9L9 3l-3 9H2',
  library:       'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z',
  revenue:       'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  taxes:         'M9 14l6-6M9 8l6 6M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
};

function SvgIcon({ id, size = 18, color = 'currentColor' }: { id: string; size?: number; color?: string }) {
  const d = SVG_PATHS[id] || 'M12 12m-4 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0';
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
}

const TABS = [
  { id: 'overview',       label: 'نظرة عامة',       icon: 'overview' },
  { id: 'schools',        label: 'المؤسسات',         icon: 'schools' },
  { id: 'users',          label: 'المستخدمون',       icon: 'users' },
  { id: 'subscriptions',  label: 'الاشتراكات',       icon: 'subscriptions' },
  { id: 'plans',          label: 'الباقات',          icon: 'plans' },
  { id: 'services',       label: 'الخدمات',          icon: 'services' },
  { id: 'store',          label: 'المتجر',           icon: 'store' },
  { id: 'ads',            label: 'الإعلانات',        icon: 'ads' },
  { id: 'support',        label: 'الدعم',            icon: 'support' },
  { id: 'permissions',    label: 'الصلاحيات',        icon: 'permissions' },
  { id: 'integrations',   label: 'التكاملات',        icon: 'integrations' },
  { id: 'community',      label: 'المجتمع',          icon: 'community' },
  { id: 'notifications',  label: 'الإشعارات',        icon: 'notifications' },
  { id: 'settings',       label: 'الإعدادات',        icon: 'settings' },
  { id: 'activity',       label: 'سجل النشاط',       icon: 'activity' },
  { id: 'library',        label: 'المكتبة الرقمية',    icon: 'library' },
  { id: 'revenue',        label: 'الإيرادات',         icon: 'revenue' },
  { id: 'taxes',          label: 'الضرائب',           icon: 'taxes' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getToken = () => { try { return localStorage.getItem('matin_token') || ''; } catch { return ''; } };
const api = (url: string, opts?: RequestInit) => {
  const token = getToken();
  return fetch(url, { 
    credentials: 'include', 
    ...opts, 
    headers: { 
      'Content-Type': 'application/json', 
      ...(token ? { 'Authorization': 'Bearer ' + token } : {}), 
      ...(opts?.headers || {}) 
    } 
  });
};
const fmt = (d: string) => { if (!d) return '—'; try { return new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }); } catch { return '—'; } };
const num = (n: any) => Number(n || 0).toLocaleString('ar-SA');

// ─── Components ───────────────────────────────────────────────────────────────
function Badge({ text, color = '#6B7280' }: { text: string; color?: string }) {
  return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: `${color}15`, color }}>{text}</span>;
}

function Btn({ children, onClick, variant = 'primary', size = 'md', disabled = false, type = 'button', className = '' }: any) {
  const variants: any = {
    primary: { background: `linear-gradient(135deg, #D4A843, #C9A84C)`, color: '#000' },
    danger:  { background: '#EF4444', color: 'white' },
    ghost:   { background: 'rgba(255,255,255,0.05)', color: 'white', border: `1px solid ${BORDER}` },
    success: { background: '#10B981', color: 'white' },
  };
  const sizes: any = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`rounded-xl transition-all font-bold flex items-center justify-center gap-2 ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'} ${className}`}
      style={variants[variant]}>
      {children}
    </button>
  );
}

function Card({ children, className = '', title, action }: { children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }) {
  return (
    <div className={`rounded-2xl p-6 transition-all ${className}`} style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-6">
          {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="rounded-2xl overflow-hidden w-full animate-in fade-in zoom-in duration-200" style={{ background: '#0D0D1A', border: `1px solid ${BORDER}`, maxWidth: wide ? 900 : 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Inp({ label, value, onChange, type = 'text', placeholder = '', required = false, textarea = false, rows = 3 }: any) {
  const cls = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#C9A84C]/30 transition-all";
  const sty = { background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}` };
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-gray-400 font-bold mr-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      {textarea
        ? <textarea className={cls} style={sty} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} />
        : <input className={cls} style={sty} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

function Sel({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-gray-400 font-bold mr-1">{label}</label>}
      <select className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}` }}
        value={value} onChange={e => onChange(e.target.value)}>
        {options.map((o: any) => <option key={o.value} value={o.value} className="bg-[#0D0D1A]">{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OwnerDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('overview');
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Forms State
  const [sf, setSf] = useState<any>({}); // School Form
  const [uf, setUf] = useState<any>({}); // User Form
  const [planF, setPlanF] = useState<any>({}); // Plan Form
  const [af, setAf] = useState<any>({}); // Ad Form
  const [taxF, setTaxF] = useState<any>({}); // Tax Form

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // ⚡ Data Fetching
  const { data: stats } = useQuery({
    queryKey: ['owner-stats'],
    queryFn: async () => {
      const r = await api('/api/dashboard-stats');
      return r.json();
    },
    enabled: !!me,
  });

  const { data: schools = [] } = useQuery({
    queryKey: ['owner-schools'],
    queryFn: async () => {
      const r = await api('/api/schools');
      return r.json();
    },
    enabled: !!me,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['owner-users'],
    queryFn: async () => {
      const r = await api('/api/users');
      return r.json();
    },
    enabled: !!me,
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['owner-plans'],
    queryFn: async () => {
      const r = await api('/api/plans');
      return r.json();
    },
    enabled: !!me,
  });

  const { data: subs = [] } = useQuery({
    queryKey: ['owner-subs'],
    queryFn: async () => {
      const r = await api('/api/subscriptions');
      return r.json();
    },
    enabled: !!me,
  });

  const { data: ads = [] } = useQuery({
    queryKey: ['owner-ads'],
    queryFn: async () => {
      const r = await api('/api/ads');
      return r.json();
    },
    enabled: !!me,
  });

  const { data: support = [] } = useQuery({
    queryKey: ['owner-support'],
    queryFn: async () => {
      const r = await api('/api/support');
      return r.json();
    },
    enabled: !!me,
  });

  const { data: taxes = [] } = useQuery({
    queryKey: ['owner-taxes'],
    queryFn: async () => {
      const r = await api('/api/taxes');
      return r.json();
    },
    enabled: !!me,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const r = await api('/api/auth/me');
        if (!r.ok) { router.push('/login'); return; }
        const d = await r.json();
        if (d.user?.role !== 'super_admin' && d.user?.role !== 'owner') { router.push('/login'); return; }
        setMe(d.user);
      } catch { router.push('/login'); }
      finally { setLoading(false); }
    };
    checkAuth();
  }, [router]);

  // ⚡ Actions
  const handleLogout = async () => {
    await api('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('matin_token');
    router.push('/login');
  };

  const saveSchool = async () => {
    setSaving(true);
    try {
      const r = await api('/api/schools', {
        method: editItem ? 'PUT' : 'POST',
        body: JSON.stringify(editItem ? { id: editItem.id, ...sf } : sf),
      });
      if (r.ok) {
        showToast(editItem ? 'تم التحديث' : 'تمت الإضافة');
        setModal(null); setEditItem(null); setSf({});
        queryClient.invalidateQueries({ queryKey: ['owner-schools'] });
      } else {
        const d = await r.json();
        showToast(d.error || 'فشل الحفظ', false);
      }
    } catch { showToast('خطأ في الاتصال', false); }
    setSaving(false);
  };

  const deleteSchool = async (id: string) => {
    if (!confirm('حذف هذه المؤسسة؟')) return;
    const r = await api(`/api/schools?id=${id}`, { method: 'DELETE' });
    if (r.ok) { showToast('تم الحذف'); queryClient.invalidateQueries({ queryKey: ['owner-schools'] }); }
  };

  const toggleSchool = async (id: string, status: string) => {
    const r = await api('/api/schools', { method: 'PUT', body: JSON.stringify({ id, status: status === 'active' ? 'inactive' : 'active' }) });
    if (r.ok) { showToast('تم التحديث'); queryClient.invalidateQueries({ queryKey: ['owner-schools'] }); }
  };

  const toggleAds = async (id: string, current: boolean) => {
    const r = await api('/api/schools', { method: 'PUT', body: JSON.stringify({ id, show_matin_ads: !current }) });
    if (r.ok) { showToast('تم تحديث الإعلانات'); queryClient.invalidateQueries({ queryKey: ['owner-schools'] }); }
  };

  const savePlan = async () => {
    setSaving(true);
    const r = await api('/api/plans', { method: editItem ? 'PUT' : 'POST', body: JSON.stringify(editItem ? { id: editItem.id, ...planF } : planF) });
    if (r.ok) { setModal(null); setPlanF({}); queryClient.invalidateQueries({ queryKey: ['owner-plans'] }); showToast('تم الحفظ'); }
    setSaving(false);
  };

  const saveAd = async () => {
    setSaving(true);
    const r = await api('/api/ads', { method: editItem ? 'PUT' : 'POST', body: JSON.stringify(editItem ? { id: editItem.id, ...af } : af) });
    if (r.ok) { setModal(null); setAf({}); queryClient.invalidateQueries({ queryKey: ['owner-ads'] }); showToast('تم الحفظ'); }
    setSaving(false);
  };

  const saveTax = async () => {
    setSaving(true);
    const r = await api('/api/taxes', { method: editItem ? 'PUT' : 'POST', body: JSON.stringify(editItem ? { id: editItem.id, ...taxF } : taxF) });
    if (r.ok) { setModal(null); setTaxF({}); queryClient.invalidateQueries({ queryKey: ['owner-taxes'] }); showToast('تم الحفظ'); }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#06060E] flex items-center justify-center text-white font-bold">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#06060E] text-white flex flex-row-reverse font-sans" dir="rtl">
      {/* ─── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="w-72 border-r border-white/5 bg-[#06060E] sticky top-0 h-screen overflow-y-auto z-50">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A843] to-[#C9A84C] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#C9A84C]/20">M</div>
          <span className="text-xl font-black tracking-tight">متين <span className="text-[#C9A84C]">SaaS</span></span>
        </div>
        <nav className="p-4 space-y-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${tab === t.id ? 'bg-[#C9A84C] text-black font-bold shadow-lg shadow-[#C9A84C]/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <SvgIcon id={t.icon} color={tab === t.id ? 'black' : 'currentColor'} />
              <span className="text-sm">{t.label}</span>
              {tab === t.id && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-black/30" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* ─── Main Content ───────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#06060E]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C9A84C] font-bold">
              {me?.name?.[0] || 'U'}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{me?.name}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{me?.role === 'super_admin' ? 'المدير العام' : 'مالك المنصة'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Btn variant="ghost" size="sm" onClick={() => setModal('password')}>تغيير كلمة المرور</Btn>
            <Btn variant="danger" size="sm" onClick={handleLogout}>تسجيل الخروج</Btn>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Overview Tab */}
          {tab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'إجمالي المؤسسات', value: stats?.schools_count || 0, icon: 'schools', color: '#C9A84C' },
                  { label: 'المستخدمون النشطون', value: stats?.users_count || 0, icon: 'users', color: '#3B82F6' },
                  { label: 'الاشتراكات النشطة', value: stats?.active_subs || 0, icon: 'subscriptions', color: '#10B981' },
                  { label: 'إجمالي الإيرادات', value: `${num(stats?.total_revenue || 0)} ر.س`, icon: 'revenue', color: '#F59E0B' },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl p-6 relative overflow-hidden group transition-all hover:scale-[1.02]" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-110" />
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `${s.color}15`, color: s.color }}>
                        <SvgIcon id={s.icon} size={24} />
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</span>
                    </div>
                    <div className="text-3xl font-black text-white">{s.value}</div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="آخر المؤسسات المسجلة" action={<Btn variant="ghost" size="sm" onClick={() => setTab('schools')}>الكل</Btn>}>
                  <div className="space-y-4">
                    {schools.slice(0, 5).map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] font-bold">{s.name_ar?.[0]}</div>
                          <div>
                            <div className="text-sm font-bold text-white">{s.name_ar}</div>
                            <div className="text-[10px] text-gray-500">{fmt(s.created_at)}</div>
                          </div>
                        </div>
                        <Badge text={s.status} color={s.status === 'active' ? '#10B981' : '#F59E0B'} />
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="تذاكر الدعم المفتوحة" action={<Btn variant="ghost" size="sm" onClick={() => setTab('support')}>الكل</Btn>}>
                  <div className="space-y-4">
                    {support.filter((t: any) => t.status === 'open').slice(0, 5).map((t: any) => (
                      <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5">
                        <div>
                          <div className="text-sm font-bold text-white">{t.subject}</div>
                          <div className="text-[10px] text-gray-500">{t.user_name} · {ago(t.created_at)}</div>
                        </div>
                        <Btn variant="ghost" size="sm">رد</Btn>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Schools Tab */}
          {tab === 'schools' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">إدارة المؤسسات التعليمية</h2>
                <Btn onClick={() => { setEditItem(null); setSf({}); setModal('school'); }}>إضافة مؤسسة جديدة</Btn>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-white/5">
                        <th className="px-4 py-4">المؤسسة</th>
                        <th className="px-4 py-4">النوع</th>
                        <th className="px-4 py-4">الباقة</th>
                        <th className="px-4 py-4">الحالة</th>
                        <th className="px-4 py-4">الإعلانات</th>
                        <th className="px-4 py-4">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {schools.map((s: any) => (
                        <tr key={s.id} className="hover:bg-white/2 transition-colors group">
                          <td className="px-4 py-4">
                            <div className="font-bold text-white">{s.name_ar}</div>
                            <div className="text-[10px] text-gray-500">{s.email}</div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-400">{s.institution_type}</td>
                          <td className="px-4 py-4"><Badge text={s.plan || 'مجانية'} color="#C9A84C" /></td>
                          <td className="px-4 py-4"><Badge text={s.status} color={s.status === 'active' ? '#10B981' : '#EF4444'} /></td>
                          <td className="px-4 py-4">
                            <button onClick={() => toggleAds(s.id, s.show_matin_ads)} className={`w-10 h-5 rounded-full transition-all relative ${s.show_matin_ads ? 'bg-[#C9A84C]' : 'bg-white/10'}`}>
                              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${s.show_matin_ads ? 'right-1' : 'left-1'}`} />
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => { setEditItem(s); setSf(s); setModal('school'); }} className="p-2 rounded-lg bg-white/5 hover:bg-[#C9A84C]/20 text-[#C9A84C] transition-all"><SvgIcon id="settings" size={14} /></button>
                              <button onClick={() => toggleSchool(s.id, s.status)} className={`p-2 rounded-lg bg-white/5 transition-all ${s.status === 'active' ? 'hover:bg-red-500/20 text-red-500' : 'hover:bg-green-500/20 text-green-500'}`}><SvgIcon id="refresh" size={14} /></button>
                              <button onClick={() => deleteSchool(s.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-500 transition-all"><SvgIcon id="support" size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Plans Tab */}
          {tab === 'plans' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">باقات الاشتراك</h2>
                <Btn onClick={() => { setEditItem(null); setPlanF({}); setModal('plan'); }}>إضافة باقة</Btn>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((p: any) => (
                  <Card key={p.id} className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#C9A84C]" />
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-black text-white">{p.name_ar}</h3>
                        <p className="text-xs text-gray-500">{p.name}</p>
                      </div>
                      <Badge text={p.is_active ? 'نشطة' : 'معطلة'} color={p.is_active ? '#10B981' : '#6B7280'} />
                    </div>
                    <div className="mb-6">
                      <span className="text-3xl font-black text-[#C9A84C]">{num(p.price_monthly)}</span>
                      <span className="text-xs text-gray-500 mr-1">ر.س / شهر</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      <li className="text-xs flex items-center gap-2 text-gray-300"><div className="w-1 h-1 rounded-full bg-[#C9A84C]" /> {p.max_students} طالب</li>
                      <li className="text-xs flex items-center gap-2 text-gray-300"><div className="w-1 h-1 rounded-full bg-[#C9A84C]" /> {p.max_teachers} معلم</li>
                    </ul>
                    <div className="flex gap-2">
                      <Btn variant="ghost" size="sm" className="flex-1" onClick={() => { setEditItem(p); setPlanF(p); setModal('plan'); }}>تعديل</Btn>
                      <Btn variant="danger" size="sm" onClick={async () => { if(confirm('حذف الباقة؟')) { await api(`/api/plans?id=${p.id}`, {method:'DELETE'}); queryClient.invalidateQueries({queryKey:['owner-plans']}); } }}>حذف</Btn>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Subscriptions Tab */}
          {tab === 'subscriptions' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">إدارة الاشتراكات</h2>
                <Btn variant="ghost" onClick={() => setModal('assign_plan')}>تعيين باقة يدوياً</Btn>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="text-gray-500 text-xs font-bold border-b border-white/5">
                        <th className="px-4 py-4">المؤسسة</th>
                        <th className="px-4 py-4">الباقة</th>
                        <th className="px-4 py-4">تاريخ البدء</th>
                        <th className="px-4 py-4">تاريخ الانتهاء</th>
                        <th className="px-4 py-4">الحالة</th>
                        <th className="px-4 py-4">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {subs.map((s: any) => (
                        <tr key={s.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-4 font-bold text-white">{s.school_name_ar || s.school_name}</td>
                          <td className="px-4 py-4 text-sm text-[#C9A84C] font-bold">{s.package_name_ar}</td>
                          <td className="px-4 py-4 text-xs text-gray-400">{fmt(s.started_at)}</td>
                          <td className="px-4 py-4 text-xs text-gray-400">{fmt(s.expires_at)}</td>
                          <td className="px-4 py-4"><Badge text={s.status} color={s.status === 'active' ? '#10B981' : '#EF4444'} /></td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <Btn variant="ghost" size="sm">تجديد</Btn>
                              <Btn variant="danger" size="sm">إلغاء</Btn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Ads Tab */}
          {tab === 'ads' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">إدارة الإعلانات</h2>
                <Btn onClick={() => { setEditItem(null); setAf({}); setModal('ad'); }}>إضافة إعلان</Btn>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ads.map((a: any) => (
                  <Card key={a.id} title={a.title} action={<Badge text={a.is_active ? 'نشط' : 'معطل'} color={a.is_active ? '#10B981' : '#6B7280'} />}>
                    <p className="text-sm text-gray-400 mb-6 line-clamp-2">{a.content}</p>
                    <div className="flex gap-2">
                      <Btn variant="ghost" size="sm" onClick={() => { setEditItem(a); setAf(a); setModal('ad'); }}>تعديل</Btn>
                      <Btn variant="danger" size="sm" onClick={async () => { if(confirm('حذف الإعلان؟')) { await api(`/api/ads?id=${a.id}`, {method:'DELETE'}); queryClient.invalidateQueries({queryKey:['owner-ads']}); } }}>حذف</Btn>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Support Tab */}
          {tab === 'support' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">تذاكر الدعم الفني</h2>
                <div className="flex gap-2">
                  <Btn variant="ghost" size="sm">تصفية</Btn>
                </div>
              </div>
              <Card>
                <div className="space-y-4">
                  {support.map((t: any) => (
                    <div key={t.id} className="p-6 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between group hover:border-[#C9A84C]/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${t.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                        <div>
                          <h4 className="font-bold text-white mb-1">{t.subject}</h4>
                          <p className="text-xs text-gray-500">{t.user_name} · {t.school_name} · {ago(t.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Btn variant="primary" size="sm">رد</Btn>
                        <Btn variant="ghost" size="sm">إغلاق</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Permissions Tab */}
          {tab === 'permissions' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-2xl font-black">طلبات الانضمام والصلاحيات</h2>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="text-gray-500 text-xs font-bold border-b border-white/5">
                        <th className="px-4 py-4">المستخدم</th>
                        <th className="px-4 py-4">المؤسسة</th>
                        <th className="px-4 py-4">الدور المطلوب</th>
                        <th className="px-4 py-4">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.filter((u: any) => u.status === 'pending').map((u: any) => (
                        <tr key={u.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-4">
                            <div className="font-bold text-white">{u.name}</div>
                            <div className="text-[10px] text-gray-500">{u.email}</div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-400">{u.school_name || '—'}</td>
                          <td className="px-4 py-4"><Badge text={u.role} color="#3B82F6" /></td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <Btn variant="success" size="sm">موافقة</Btn>
                              <Btn variant="danger" size="sm">رفض</Btn>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Taxes Tab */}
          {tab === 'taxes' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">إدارة الضرائب والرسوم</h2>
                <Btn onClick={() => { setEditItem(null); setTaxF({}); setModal('tax'); }}>إضافة ضريبة</Btn>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="text-gray-500 text-xs font-bold border-b border-white/5">
                        <th className="px-4 py-4">الاسم</th>
                        <th className="px-4 py-4">النسبة</th>
                        <th className="px-4 py-4">النوع</th>
                        <th className="px-4 py-4">الحالة</th>
                        <th className="px-4 py-4">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {taxes.map((t: any) => (
                        <tr key={t.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-4 font-bold text-white">{t.name_ar || t.name}</td>
                          <td className="px-4 py-4 font-black text-[#C9A84C]">{t.rate}%</td>
                          <td className="px-4 py-4 text-sm text-gray-400">{t.type}</td>
                          <td className="px-4 py-4"><Badge text={t.is_active ? 'نشطة' : 'معطلة'} color={t.is_active ? '#10B981' : '#6B7280'} /></td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => { setEditItem(t); setTaxF(t); setModal('tax'); }} className="p-2 rounded-lg bg-white/5 hover:bg-[#C9A84C]/20 text-[#C9A84C] transition-all"><SvgIcon id="settings" size={14} /></button>
                              <button onClick={async () => { if(confirm('حذف؟')) { await api(`/api/taxes?id=${t.id}`, {method:'DELETE'}); queryClient.invalidateQueries({queryKey:['owner-taxes']}); } }} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-500 transition-all"><SvgIcon id="support" size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {!['overview', 'schools', 'plans', 'subscriptions', 'ads', 'support', 'permissions', 'taxes'].includes(tab) && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-in fade-in duration-500">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600">
                <SvgIcon id={TABS.find(t => t.id === tab)?.icon || 'overview'} size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-400">قسم {TABS.find(t => t.id === tab)?.label} قيد التطوير</h3>
              <p className="text-sm text-gray-600">سيتم تفعيل كافة الوظائف في التحديث القادم</p>
            </div>
          )}
        </div>
      </main>

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}
      {modal === 'school' && (
        <Modal title={editItem ? 'تعديل المؤسسة' : 'إضافة مؤسسة جديدة'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Inp label="اسم المؤسسة (عربي)" value={sf.name_ar || ''} onChange={(v: string) => setSf({ ...sf, name_ar: v })} required />
              <Inp label="اسم المؤسسة (إنجليزي)" value={sf.name || ''} onChange={(v: string) => setSf({ ...sf, name: v })} />
            </div>
            <Inp label="البريد الإلكتروني" value={sf.email || ''} onChange={(v: string) => setSf({ ...sf, email: v })} type="email" />
            <Sel label="نوع المؤسسة" value={sf.institution_type || 'school'} onChange={(v: string) => setSf({ ...sf, institution_type: v })} options={[
              { value: 'school', label: 'مدرسة' },
              { value: 'university', label: 'جامعة' },
              { value: 'institute', label: 'معهد' },
              { value: 'kindergarten', label: 'روضة' },
            ]} />
            <Btn className="w-full mt-4" onClick={saveSchool} disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ البيانات'}</Btn>
          </div>
        </Modal>
      )}

      {modal === 'plan' && (
        <Modal title={editItem ? 'تعديل الباقة' : 'إضافة باقة'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Inp label="اسم الباقة (عربي)" value={planF.name_ar || ''} onChange={(v: string) => setPlanF({ ...planF, name_ar: v })} required />
            <div className="grid grid-cols-2 gap-4">
              <Inp label="السعر الشهري" value={planF.price_monthly || ''} onChange={(v: string) => setPlanF({ ...planF, price_monthly: v })} type="number" />
              <Inp label="السعر السنوي" value={planF.price_yearly || ''} onChange={(v: string) => setPlanF({ ...planF, price_yearly: v })} type="number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Inp label="أقصى عدد طلاب" value={planF.max_students || ''} onChange={(v: string) => setPlanF({ ...planF, max_students: v })} type="number" />
              <Inp label="أقصى عدد معلمين" value={planF.max_teachers || ''} onChange={(v: string) => setPlanF({ ...planF, max_teachers: v })} type="number" />
            </div>
            <Btn className="w-full mt-4" onClick={savePlan} disabled={saving}>حفظ الباقة</Btn>
          </div>
        </Modal>
      )}

      {modal === 'ad' && (
        <Modal title={editItem ? 'تعديل الإعلان' : 'إضافة إعلان'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Inp label="عنوان الإعلان" value={af.title || ''} onChange={(v: string) => setAf({ ...af, title: v })} required />
            <Inp label="المحتوى" value={af.content || ''} onChange={(v: string) => setAf({ ...af, content: v })} textarea rows={4} />
            <Btn className="w-full mt-4" onClick={saveAd} disabled={saving}>نشر الإعلان</Btn>
          </div>
        </Modal>
      )}

      {modal === 'tax' && (
        <Modal title={editItem ? 'تعديل الضريبة' : 'إضافة ضريبة'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Inp label="اسم الضريبة" value={taxF.name_ar || ''} onChange={(v: string) => setTaxF({ ...taxF, name_ar: v })} required />
            <Inp label="النسبة (%)" value={taxF.rate || ''} onChange={(v: string) => setTaxF({ ...taxF, rate: v })} type="number" />
            <Sel label="النوع" value={taxF.type || 'vat'} onChange={(v: string) => setTaxF({ ...taxF, type: v })} options={[
              { value: 'vat', label: 'ضريبة قيمة مضافة' },
              { value: 'service', label: 'رسوم خدمة' },
              { value: 'other', label: 'أخرى' },
            ]} />
            <Btn className="w-full mt-4" onClick={saveTax} disabled={saving}>حفظ الضريبة</Btn>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-8 z-[200] animate-in slide-in-from-left-8 duration-300">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.ok ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${toast.ok ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-bold">{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
