'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ─── Constants ────────────────────────────────────────────────────────────────
const G = '#C9A84C';
const DARK = '#06060E';
const CARD = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

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
  refresh:       'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  bell:          'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
};
function SvgIcon({ id, size = 16, color = 'currentColor' }: { id: string; size?: number; color?: string }) {
  const d = SVG_PATHS[id] || 'M12 12m-4 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0';
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
}

const TABS: { id: string; label: string; icon: string; badge?: string }[] = [
  { id: 'overview',       label: 'نظرة عامة',       icon: 'overview' },
  { id: 'schools',        label: 'المؤسسات',         icon: 'schools' },
  { id: 'users',          label: 'المستخدمون',       icon: 'users' },
  { id: 'subscriptions',  label: 'الاشتراكات',       icon: 'subscriptions' },
  { id: 'plans',          label: 'الباقات',          icon: 'plans' },
  { id: 'services',       label: 'الخدمات',          icon: 'services' },
  { id: 'store',          label: 'المتجر',           icon: 'store' },
  { id: 'ads',            label: 'الإعلانات',        icon: 'ads' },
  { id: 'support',        label: 'الدعم',            icon: 'support', badge: 'support' },
  { id: 'permissions',    label: 'الصلاحيات',        icon: 'permissions', badge: 'join' },
  { id: 'integrations',   label: 'التكاملات',        icon: 'integrations' },
  { id: 'community',      label: 'المجتمع',          icon: 'community' },
  { id: 'notifications',  label: 'الإشعارات',        icon: 'notifications', badge: 'notif' },
  { id: 'settings',       label: 'الإعدادات',        icon: 'settings' },
  { id: 'activity',       label: 'سجل النشاط',       icon: 'activity' },
];

type TabId = string;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getToken = () => { try { return localStorage.getItem('matin_token') || ''; } catch { return ''; } };
const api = (url: string, opts?: RequestInit) => {
  const token = getToken();
  return fetch(url, { credentials: 'include', ...opts, headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': 'Bearer ' + token } : {}), ...(opts?.headers || {}) } });
};
const fmt = (d: string) => { if (!d) return '—'; try { return new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }); } catch { return '—'; } };
const ago = (d: string) => { if (!d) return '—'; const diff = Date.now() - new Date(d).getTime(); const m = Math.floor(diff / 60000); if (m < 1) return 'الآن'; if (m < 60) return `منذ ${m}د`; const h = Math.floor(m / 60); if (h < 24) return `منذ ${h}س`; return `منذ ${Math.floor(h / 24)} يوم`; };
const num = (n: any) => Number(n || 0).toLocaleString('ar-SA');

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold shadow-2xl transition-all"
      style={{ background: ok ? '#16A34A' : '#DC2626', color: 'white', minWidth: 200, textAlign: 'center' }}>
      {msg}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl overflow-hidden w-full" style={{ background: '#0D0D1A', border: `1px solid ${BORDER}`, maxWidth: wide ? 800 : 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Inp({ label, value, onChange, type = 'text', placeholder = '', required = false, textarea = false, rows = 3 }: any) {
  const cls = "w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-yellow-500/50";
  const sty = { background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` };
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-gray-400 font-medium">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>}
      {textarea
        ? <textarea className={cls} style={sty} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} />
        : <input className={cls} style={sty} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
function Sel({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-gray-400 font-medium">{label}</label>}
      <select className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}
        value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value} style={{ background: '#0D0D1A' }}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Btn ──────────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = 'primary', size = 'md', disabled = false, type = 'button' }: any) {
  const variants: any = {
    primary: { background: `linear-gradient(135deg, ${G}, #A07830)`, color: '#000', fontWeight: 700 },
    danger:  { background: '#DC2626', color: 'white', fontWeight: 600 },
    ghost:   { background: 'rgba(255,255,255,0.06)', color: 'white', fontWeight: 500, border: `1px solid ${BORDER}` },
    success: { background: '#16A34A', color: 'white', fontWeight: 600 },
  };
  const sizes: any = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`rounded-xl transition-all ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}
      style={variants[variant]}>
      {children}
    </button>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = G }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
      <div className="text-xs text-gray-400 mb-2 font-medium">{label}</div>
      <div className="text-3xl font-black" style={{ color }}>{typeof value === 'number' ? num(value) : value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ text, color = '#6B7280' }: { text: string; color?: string }) {
  return <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${color}22`, color }}>{text}</span>;
}

const STATUS_COLORS: Record<string, string> = {
  active: '#22C55E', inactive: '#6B7280', pending: '#F59E0B', suspended: '#EF4444',
  trial: '#3B82F6', expired: '#EF4444', open: '#EF4444', closed: '#22C55E',
  in_progress: '#F59E0B', resolved: '#22C55E', cancelled: '#6B7280',
};
const STATUS_LABELS: Record<string, string> = {
  active: 'نشط', inactive: 'غير نشط', pending: 'معلق', suspended: 'موقوف',
  trial: 'تجريبي', expired: 'منتهي', open: 'مفتوح', closed: 'مغلق',
  in_progress: 'قيد المعالجة', resolved: 'محلول', cancelled: 'ملغي',
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OwnerDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [me, setMe] = useState<any>(null);

  // Data states
  const [stats, setStats] = useState<any>({});
  const [schools, setSchools] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [storeOrders, setStoreOrders] = useState<any[]>([]);
  const [shippingCompanies, setShippingCompanies] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [support, setSupport] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [actLog, setActLog] = useState<any[]>([]);
  const [platformSettings, setPlatformSettings] = useState<any[]>([]);
  const [communityStats, setCommunityStats] = useState<any>({});
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [communityReports, setCommunityReports] = useState<any[]>([]);
  const [communityBanned, setCommunityBanned] = useState<any[]>([]);

  // UI states
  const [modal, setModal] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [schoolStatus, setSchoolStatus] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('all');
  const [subsSearch, setSubsSearch] = useState('');
  const [supportFilter, setSupportFilter] = useState('all');
  const [storeTab, setStoreTab] = useState<'products' | 'orders' | 'shipping' | 'coupons'>('products');
  const [communityTab, setCommunityTab] = useState<'overview' | 'posts' | 'reports' | 'banned'>('overview');
  const [settingsCategory, setSettingsCategory] = useState('general');
  const [permSearch, setPermSearch] = useState('');
  const [permRole, setPermRole] = useState('all');
  const [notifSearch, setNotifSearch] = useState('');
  const [selectedSchoolServices, setSelectedSchoolServices] = useState<any>(null);
  const [schoolServicesData, setSchoolServicesData] = useState<any[]>([]);
  const [storeOrdersTotal, setStoreOrdersTotal] = useState(0);
  const [storeProductsTotal, setStoreProductsTotal] = useState(0);

  // Form states
  const [sf, setSf] = useState<any>({});
  const [uf, setUf] = useState<any>({});
  const [pf, setPf] = useState<any>({});
  const [af, setAf] = useState<any>({});
  const [spf, setSpf] = useState<any>({});
  const [planF, setPlanF] = useState<any>({});
  const [settingF, setSettingF] = useState<any>({});
  const [supportReply, setSupportReply] = useState('');
  const [couponF, setCouponF] = useState<any>({});
  const [shippingF, setShippingF] = useState<any>({});
  const [integF, setIntegF] = useState<any>({});
  const [notifF, setNotifF] = useState<any>({});

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Fetch Functions ─────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const r = await api('/api/dashboard-stats');
      const d = await r.json();
      setStats(d);
    } catch {}
  }, []);

  const fetchSchools = useCallback(async () => {
    try {
      const r = await api('/api/schools');
      const d = await r.json();
      setSchools(Array.isArray(d) ? d : []);
    } catch {}
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const r = await api('/api/users');
      const d = await r.json();
      setUsers(Array.isArray(d) ? d : []);
    } catch {}
  }, []);

  const fetchPlans = useCallback(async () => {
    try {
      const r = await api('/api/plans');
      const d = await r.json();
      setPlans(Array.isArray(d) ? d : []);
    } catch {}
  }, []);

  const fetchSubs = useCallback(async () => {
    try {
      const r = await api('/api/subscriptions');
      const d = await r.json();
      setSubs(Array.isArray(d) ? d : []);
    } catch {}
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const r = await api('/api/services?type=platform');
      const d = await r.json();
      setServices(Array.isArray(d) ? d : []);
    } catch {}
  }, []);

  const fetchAds = useCallback(async () => {
    try {
      const r = await api('/api/ads/manage');
      const d = await r.json();
      setAds(Array.isArray(d) ? d : (d?.ads || []));
    } catch {}
  }, []);

  const fetchStore = useCallback(async () => {
    try {
      const [pr, or, sr, cr] = await Promise.all([
        api('/api/store/products'),
        api('/api/store/orders'),
        api('/api/store/shipping'),
        api('/api/coupons'),
      ]);
      const pd = await pr.json(); const od = await or.json();
      const sd = await sr.json(); const cd = await cr.json();
      setStoreProducts(pd?.products || (Array.isArray(pd) ? pd : []));
      setStoreProductsTotal(pd?.total || 0);
      setStoreOrders(od?.orders || (Array.isArray(od) ? od : []));
      setStoreOrdersTotal(od?.total || 0);
      setShippingCompanies(Array.isArray(sd) ? sd : []);
      setCoupons(Array.isArray(cd) ? cd : []);
    } catch {}
  }, []);

  const fetchSupport = useCallback(async () => {
    try {
      const r = await api('/api/support');
      const d = await r.json();
      setSupport(Array.isArray(d) ? d : []);
    } catch {}
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const r = await api('/api/notifications');
      const d = await r.json();
      setNotifications(Array.isArray(d) ? d : (d?.notifications || []));
    } catch {}
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const r = await api('/api/permissions');
      const d = await r.json();
      setPermissions(Array.isArray(d) ? d : []);
    } catch {}
  }, []);

  const fetchJoinRequests = useCallback(async () => {
    try {
      const r = await api('/api/join-requests');
      const d = await r.json();
      setJoinRequests(Array.isArray(d) ? d : (d?.requests || []));
    } catch {}
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      const r = await api('/api/leads');
      const d = await r.json();
      setLeads(Array.isArray(d) ? d : (d?.data || []));
    } catch {}
  }, []);

  const fetchIntegrations = useCallback(async () => {
    try {
      const r = await api('/api/integrations');
      const d = await r.json();
      setIntegrations(Array.isArray(d) ? d : (d?.data || []));
    } catch {}
  }, []);

  const fetchActLog = useCallback(async () => {
    try {
      const r = await api('/api/activity-log');
      const d = await r.json();
      setActLog(Array.isArray(d) ? d : []);
    } catch {}
  }, []);

  const fetchPlatformSettings = useCallback(async () => {
    try {
      const r = await api('/api/platform-settings');
      const d = await r.json();
      setPlatformSettings(d?.settings || []);
    } catch {}
  }, []);

  const fetchCommunity = useCallback(async () => {
    try {
      const [dr, pr, rr, br] = await Promise.all([
        api('/api/moderation?type=dashboard'),
        api('/api/moderation?type=posts&filter=all'),
        api('/api/moderation?type=reports'),
        api('/api/moderation?type=banned_users'),
      ]);
      const dd = await dr.json(); const pd = await pr.json();
      const rd = await rr.json(); const bd = await br.json();
      setCommunityStats(dd?.stats || {});
      setCommunityPosts(pd?.posts || []);
      setCommunityReports(rd?.reports || []);
      setCommunityBanned(bd?.users || []);
    } catch {}
  }, []);

  const fetchSchoolServices = useCallback(async (schoolId: string) => {
    try {
      const r = await api(`/api/services?type=school&school_id=${schoolId}`);
      const d = await r.json();
      setSchoolServicesData(Array.isArray(d) ? d : []);
    } catch {}
  }, []);

  // ─── Init ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const r = await api('/api/auth/me');
        if (!r.ok) { router.push('/login'); return; }
        const u = await r.json();
        const userData = u?.user || u;
        if (userData?.role !== 'super_admin') { router.push('/login'); return; }
        setMe(userData);
        await Promise.all([
          fetchStats(), fetchSchools(), fetchUsers(), fetchPlans(),
          fetchSubs(), fetchServices(), fetchAds(), fetchStore(),
          fetchSupport(), fetchNotifications(), fetchPermissions(),
          fetchJoinRequests(), fetchLeads(), fetchIntegrations(),
          fetchActLog(), fetchPlatformSettings(),
        ]);
      } catch { router.push('/login'); }
      finally { setLoading(false); }
    };
    init();
  }, []);

  useEffect(() => {
    if (tab === 'community') fetchCommunity();
  }, [tab]);

  // ─── Filtered Data ────────────────────────────────────────────────────────────
  const filteredSchools = schools.filter(s =>
    (s.name || s.name_ar || '').toLowerCase().includes(schoolSearch.toLowerCase()) &&
    (schoolStatus === 'all' || s.status === schoolStatus)
  );
  const filteredUsers = users.filter(u =>
    ((u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
     (u.email || '').toLowerCase().includes(userSearch.toLowerCase())) &&
    (userRole === 'all' || u.role === userRole)
  );
  const filteredSubs = subs.filter(s =>
    (s.school_name || s.school_name_ar || '').toLowerCase().includes(subsSearch.toLowerCase()) ||
    (s.owner_name || '').toLowerCase().includes(subsSearch.toLowerCase())
  );
  const filteredPerms = permissions.filter(u =>
    ((u.name || '').toLowerCase().includes(permSearch.toLowerCase()) ||
     (u.email || '').toLowerCase().includes(permSearch.toLowerCase()) ||
     (u.school_name || '').toLowerCase().includes(permSearch.toLowerCase())) &&
    (permRole === 'all' || u.role === permRole)
  );
  const filteredNotifs = notifications.filter(n =>
    (n.title || '').toLowerCase().includes(notifSearch.toLowerCase())
  );
  const filteredSupport = support.filter(s => supportFilter === 'all' || s.status === supportFilter);
  const unreadNotifs = notifications.filter(n => !n.is_read).length;
  const openSupport = support.filter(s => s.status === 'open').length;

  // ─── Actions ──────────────────────────────────────────────────────────────────
  const saveSchool = async () => {
    if (!sf.name_ar) { showToast('اسم المؤسسة مطلوب', false); return; }
    setSaving(true);
    try {
      const r = await api('/api/schools', {
        method: editItem ? 'PUT' : 'POST',
        body: JSON.stringify(editItem ? { id: editItem.id, ...sf } : sf),
      });
      const d = await r.json();
      if (!r.ok) { showToast(d.error || 'فشل الحفظ', false); return; }
      showToast(editItem ? 'تم تحديث المؤسسة' : 'تمت إضافة المؤسسة');
      setModal(null); setEditItem(null); setSf({});
      await fetchSchools(); await fetchStats();
    } catch { showToast('خطأ في الاتصال', false); }
    setSaving(false);
  };

  const deleteSchool = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المؤسسة؟')) return;
    try {
      const r = await api(`/api/schools?id=${id}`, { method: 'DELETE' });
      if (r.ok) { showToast('تم حذف المؤسسة'); await fetchSchools(); await fetchStats(); }
      else showToast('فشل الحذف', false);
    } catch { showToast('خطأ', false); }
  };

  const toggleSchoolStatus = async (school: any) => {
    const newStatus = school.status === 'active' ? 'inactive' : 'active';
    try {
      const r = await api('/api/schools', { method: 'PUT', body: JSON.stringify({ id: school.id, status: newStatus }) });
      if (r.ok) { showToast(`تم ${newStatus === 'active' ? 'تفعيل' : 'تعطيل'} المؤسسة`); await fetchSchools(); }
      else showToast('فشل التحديث', false);
    } catch { showToast('خطأ', false); }
  };

  const toggleSchoolAds = async (school: any) => {
    try {
      const r = await api('/api/schools', { method: 'PUT', body: JSON.stringify({ id: school.id, show_matin_ads: !school.show_matin_ads }) });
      if (r.ok) { showToast('تم تحديث إعداد الإعلانات'); await fetchSchools(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const toggleSchoolStore = async (school: any) => {
    try {
      const r = await api('/api/schools', { method: 'PUT', body: JSON.stringify({ id: school.id, show_matin_store: !school.show_matin_store }) });
      if (r.ok) { showToast('تم تحديث إعداد المتجر'); await fetchSchools(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const saveUser = async () => {
    if (!uf.name || !uf.email) { showToast('الاسم والبريد مطلوبان', false); return; }
    setSaving(true);
    try {
      const r = await api('/api/users', {
        method: editItem ? 'PUT' : 'POST',
        body: JSON.stringify(editItem ? { id: editItem.id, ...uf } : uf),
      });
      const d = await r.json();
      if (!r.ok) { showToast(d.error || 'فشل', false); return; }
      showToast(editItem ? 'تم تحديث المستخدم' : 'تمت إضافة المستخدم');
      setModal(null); setEditItem(null); setUf({});
      await fetchUsers();
    } catch { showToast('خطأ', false); }
    setSaving(false);
  };

  const deleteUser = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      const r = await api(`/api/users?id=${id}`, { method: 'DELETE' });
      if (r.ok) { showToast('تم الحذف'); await fetchUsers(); }
      else showToast('فشل الحذف', false);
    } catch { showToast('خطأ', false); }
  };

  const savePlan = async () => {
    if (!planF.name_ar) { showToast('اسم الباقة مطلوب', false); return; }
    setSaving(true);
    try {
      const body = {
        ...planF,
        price_monthly: Number(planF.price_monthly || 0),
        price_yearly: Number(planF.price_yearly || 0),
        max_students: Number(planF.max_students || 100),
        max_teachers: Number(planF.max_teachers || 10),
        features: planF.features_text ? planF.features_text.split('\n').filter(Boolean) : [],
      };
      const r = await api('/api/plans', {
        method: editItem ? 'PUT' : 'POST',
        body: JSON.stringify(editItem ? { id: editItem.id, ...body } : body),
      });
      if (!r.ok) { showToast('فشل', false); return; }
      showToast(editItem ? 'تم تحديث الباقة' : 'تمت إضافة الباقة');
      setModal(null); setEditItem(null); setPlanF({});
      await fetchPlans();
    } catch { showToast('خطأ', false); }
    setSaving(false);
  };

  const assignPlanToSchool = async () => {
    if (!pf.school_id || !pf.plan_id) { showToast('اختر المؤسسة والباقة', false); return; }
    setSaving(true);
    try {
      const r = await api('/api/plans', {
        method: 'PUT',
        body: JSON.stringify({ action: 'assign_to_school', plan_id: pf.plan_id, school_id: pf.school_id, duration_months: pf.duration_months || 12 }),
      });
      const d = await r.json();
      if (!r.ok) { showToast(d.error || 'فشل', false); return; }
      showToast('تم تعيين الباقة للمؤسسة');
      setModal(null); setPf({});
      await fetchSubs(); await fetchSchools();
    } catch { showToast('خطأ', false); }
    setSaving(false);
  };

  const saveAd = async () => {
    if (!af.title) { showToast('عنوان الإعلان مطلوب', false); return; }
    setSaving(true);
    try {
      const r = await api('/api/ads/manage', {
        method: editItem ? 'PUT' : 'POST',
        body: JSON.stringify(editItem ? { id: editItem.id, ...af } : af),
      });
      if (!r.ok) { showToast('فشل', false); return; }
      showToast(editItem ? 'تم تحديث الإعلان' : 'تمت إضافة الإعلان');
      setModal(null); setEditItem(null); setAf({});
      await fetchAds();
    } catch { showToast('خطأ', false); }
    setSaving(false);
  };

  const deleteAd = async (id: number) => {
    if (!confirm('حذف هذا الإعلان؟')) return;
    try {
      const r = await api(`/api/ads/manage?id=${id}`, { method: 'DELETE' });
      if (r.ok) { showToast('تم الحذف'); await fetchAds(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const saveProduct = async () => {
    if (!spf.name || !spf.price) { showToast('الاسم والسعر مطلوبان', false); return; }
    setSaving(true);
    try {
      const r = await api('/api/store/products', {
        method: editItem ? 'PUT' : 'POST',
        body: JSON.stringify(editItem ? { id: editItem.id, ...spf } : spf),
      });
      if (!r.ok) { showToast('فشل', false); return; }
      showToast(editItem ? 'تم تحديث المنتج' : 'تمت إضافة المنتج');
      setModal(null); setEditItem(null); setSpf({});
      await fetchStore();
    } catch { showToast('خطأ', false); }
    setSaving(false);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('حذف هذا المنتج؟')) return;
    try {
      const r = await api(`/api/store/products?id=${id}`, { method: 'DELETE' });
      if (r.ok) { showToast('تم الحذف'); await fetchStore(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      const r = await api('/api/store/orders', { method: 'PUT', body: JSON.stringify({ id, status }) });
      if (r.ok) { showToast('تم تحديث حالة الطلب'); await fetchStore(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const saveShipping = async () => {
    if (!shippingF.name) { showToast('اسم شركة الشحن مطلوب', false); return; }
    setSaving(true);
    try {
      const r = await api('/api/store/shipping', {
        method: editItem ? 'PUT' : 'POST',
        body: JSON.stringify(editItem ? { id: editItem.id, ...shippingF } : shippingF),
      });
      if (!r.ok) { showToast('فشل', false); return; }
      showToast(editItem ? 'تم التحديث' : 'تمت الإضافة');
      setModal(null); setEditItem(null); setShippingF({});
      await fetchStore();
    } catch { showToast('خطأ', false); }
    setSaving(false);
  };

  const saveCoupon = async () => {
    if (!couponF.code) { showToast('كود الكوبون مطلوب', false); return; }
    setSaving(true);
    try {
      const r = await api('/api/coupons', {
        method: editItem ? 'PUT' : 'POST',
        body: JSON.stringify(editItem ? { id: editItem.id, ...couponF } : couponF),
      });
      if (!r.ok) { showToast('فشل', false); return; }
      showToast(editItem ? 'تم التحديث' : 'تمت الإضافة');
      setModal(null); setEditItem(null); setCouponF({});
      await fetchStore();
    } catch { showToast('خطأ', false); }
    setSaving(false);
  };

  const replySupport = async (id: number) => {
    if (!supportReply.trim()) { showToast('الرد مطلوب', false); return; }
    try {
      const r = await api('/api/support', { method: 'PUT', body: JSON.stringify({ id, response: supportReply, status: 'in_progress' }) });
      if (r.ok) { showToast('تم إرسال الرد'); setSupportReply(''); setModal(null); await fetchSupport(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const closeSupportTicket = async (id: number) => {
    try {
      const r = await api('/api/support', { method: 'PUT', body: JSON.stringify({ id, status: 'closed' }) });
      if (r.ok) { showToast('تم إغلاق التذكرة'); await fetchSupport(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const approveJoinRequest = async (id: number) => {
    try {
      const r = await api('/api/join-requests', { method: 'PUT', body: JSON.stringify({ id, status: 'approved' }) });
      if (r.ok) { showToast('تمت الموافقة'); await fetchJoinRequests(); await fetchSchools(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const rejectJoinRequest = async (id: number) => {
    try {
      const r = await api('/api/join-requests', { method: 'PUT', body: JSON.stringify({ id, status: 'rejected' }) });
      if (r.ok) { showToast('تم الرفض'); await fetchJoinRequests(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const toggleService = async (serviceKey: string, isEnabled: boolean) => {
    try {
      const r = await api('/api/services', { method: 'PUT', body: JSON.stringify({ key: serviceKey, is_active: !isEnabled }) });
      if (r.ok) { showToast('تم تحديث الخدمة'); await fetchServices(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const toggleSchoolService = async (schoolId: string, serviceKey: string, isEnabled: boolean) => {
    try {
      const r = await api('/api/services', {
        method: 'POST',
        body: JSON.stringify({ school_id: schoolId, service_key: serviceKey, is_enabled: !isEnabled }),
      });
      if (r.ok) { showToast('تم تحديث الخدمة'); await fetchSchoolServices(schoolId); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const markNotifRead = async (id: string) => {
    try {
      await api('/api/notifications/mark-read', { method: 'POST', body: JSON.stringify({ id }) });
      await fetchNotifications();
    } catch {}
  };

  const markAllNotifsRead = async () => {
    try {
      await api('/api/notifications/mark-read', { method: 'POST', body: JSON.stringify({ all: true }) });
      await fetchNotifications();
      showToast('تم تعليم الكل كمقروء');
    } catch { showToast('خطأ', false); }
  };

  const sendNotification = async () => {
    if (!notifF.title || !notifF.message) { showToast('العنوان والرسالة مطلوبان', false); return; }
    setSaving(true);
    try {
      const r = await api('/api/notifications', { method: 'POST', body: JSON.stringify(notifF) });
      if (r.ok) { showToast('تم إرسال الإشعار'); setModal(null); setNotifF({}); await fetchNotifications(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
    setSaving(false);
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      const r = await api('/api/platform-settings', { method: 'PUT', body: JSON.stringify({ key, value }) });
      if (r.ok) { showToast('تم حفظ الإعداد'); await fetchPlatformSettings(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const saveIntegration = async () => {
    if (!integF.name || !integF.type) { showToast('الاسم والنوع مطلوبان', false); return; }
    setSaving(true);
    try {
      const r = await api('/api/integrations', {
        method: editItem ? 'PUT' : 'POST',
        body: JSON.stringify(editItem ? { id: editItem.id, ...integF } : integF),
      });
      if (!r.ok) { showToast('فشل', false); return; }
      showToast(editItem ? 'تم التحديث' : 'تمت الإضافة');
      setModal(null); setEditItem(null); setIntegF({});
      await fetchIntegrations();
    } catch { showToast('خطأ', false); }
    setSaving(false);
  };

  const updatePermission = async (userId: string, field: string, value: any) => {
    try {
      const r = await api('/api/permissions', { method: 'PUT', body: JSON.stringify({ id: userId, [field]: value }) });
      if (r.ok) { showToast('تم تحديث الصلاحية'); await fetchPermissions(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const communityAction = async (action: string, params: any) => {
    try {
      const r = await api('/api/moderation', { method: 'POST', body: JSON.stringify({ action, ...params }) });
      const d = await r.json();
      if (d.success) { showToast(d.message || 'تم'); await fetchCommunity(); }
      else showToast(d.error || 'فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      const r = await api('/api/leads', { method: 'PUT', body: JSON.stringify({ id, status }) });
      if (r.ok) { showToast('تم التحديث'); await fetchLeads(); }
      else showToast('فشل', false);
    } catch { showToast('خطأ', false); }
  };

  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/login');
  };

  // ─── Loading Screen ───────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-4" style={{ background: DARK }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-black"
        style={{ background: `linear-gradient(135deg, ${G}, #A07830)` }}>م</div>
      <p className="text-sm font-bold" style={{ color: G }}>جاري تحميل لوحة التحكم...</p>
      <div className="w-32 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full rounded-full animate-pulse" style={{ background: G, width: '60%' }} />
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="flex min-h-screen" style={{ background: DARK, color: '#F1F5F9', fontFamily: 'system-ui, "Segoe UI", sans-serif' }}>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* ── Sidebar ── */}
      <aside className="flex flex-col sticky top-0 h-screen overflow-y-auto flex-shrink-0" style={{ width: 220, background: 'rgba(255,255,255,0.03)', borderLeft: `1px solid ${BORDER}` }}>
        {/* Logo */}
        <div className="px-4 py-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-black"
              style={{ background: `linear-gradient(135deg, ${G}, #A07830)` }}>م</div>
            <div>
              <div className="font-black text-white text-sm">متين</div>
              <div className="text-xs text-gray-500">لوحة المالك</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {TABS.map(t => {
            const isActive = tab === t.id;
            const badgeCount = t.badge === 'support' ? openSupport : t.badge === 'join' ? joinRequests.length : t.badge === 'notif' ? unreadNotifs : 0;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-right transition-all text-sm"
                style={{
                  background: isActive ? `${G}18` : 'transparent',
                  color: isActive ? G : '#94A3B8',
                  fontWeight: isActive ? 700 : 500,
                  borderRight: isActive ? `3px solid ${G}` : '3px solid transparent',
                }}>
                <SvgIcon id={t.icon} size={15} color={isActive ? G : '#94A3B8'} />
                <span className="flex-1">{t.label}</span>
                {badgeCount > 0 && (
                  <span className="text-white text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: t.badge === 'notif' ? '#3B82F6' : '#EF4444', minWidth: 18, textAlign: 'center' }}>
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
              style={{ background: `${G}44` }}>
              {(me?.name || 'م')[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{me?.name || 'المالك'}</div>
              <div className="text-xs text-gray-500">مالك المنصة</div>
            </div>
            <button onClick={logout} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded-lg transition-colors" style={{ background: 'rgba(239,68,68,0.1)' }}>
              خروج
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{ background: `${DARK}EE`, borderBottom: `1px solid ${BORDER}`, backdropFilter: 'blur(10px)' }}>
          <div>
            <h1 className="text-lg font-black text-white">{TABS.find(t => t.id === tab)?.label}</h1>
            <p className="text-xs text-gray-500">منصة متين التعليمية</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTab('notifications')} className="relative p-2 rounded-xl transition-colors hover:bg-white/5">
              <SvgIcon id="bell" size={18} color="#94A3B8" />
              {unreadNotifs > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#3B82F6' }} />}
            </button>
            <button onClick={async () => {
              setLoading(true);
              await Promise.all([fetchStats(), fetchSchools(), fetchUsers(), fetchSubs(), fetchSupport(), fetchNotifications(), fetchJoinRequests()]);
              setLoading(false);
              showToast('تم تحديث البيانات');
            }} className="text-xs px-3 py-1.5 rounded-xl font-medium transition-colors hover:bg-white/5" style={{ color: G, border: `1px solid ${G}44` }}>
              تحديث
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* ════ OVERVIEW ════ */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="المؤسسات" value={stats.schools || schools.length} color={G} />
                <StatCard label="الملاك" value={stats.owners || 0} color="#3B82F6" />
                <StatCard label="الطلاب" value={stats.students || 0} color="#22C55E" />
                <StatCard label="المعلمون" value={stats.teachers || 0} color="#A855F7" />
                <StatCard label="المعلقون" value={stats.pending || 0} color="#F59E0B" />
                <StatCard label="المستخدمون النشطون" value={stats.active_users || 0} color="#06B6D4" />
              </div>

              {/* Revenue & Store */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="text-xs text-gray-400 mb-3 font-medium">إحصائيات المتجر</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">المنتجات</span>
                      <span className="text-sm font-bold text-white">{num(storeProductsTotal || storeProducts.length)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">الطلبات</span>
                      <span className="text-sm font-bold text-white">{num(storeOrdersTotal || storeOrders.length)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">الطلبات المعلقة</span>
                      <span className="text-sm font-bold" style={{ color: '#F59E0B' }}>{num(storeOrders.filter(o => o.status === 'pending').length)}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="text-xs text-gray-400 mb-3 font-medium">الدعم والشكاوى</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">مفتوحة</span>
                      <span className="text-sm font-bold text-red-400">{num(support.filter(s => s.status === 'open').length)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">قيد المعالجة</span>
                      <span className="text-sm font-bold text-yellow-400">{num(support.filter(s => s.status === 'in_progress').length)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">محلولة</span>
                      <span className="text-sm font-bold text-green-400">{num(support.filter(s => s.status === 'closed' || s.status === 'resolved').length)}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="text-xs text-gray-400 mb-3 font-medium">الاشتراكات</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">نشطة</span>
                      <span className="text-sm font-bold text-green-400">{num(subs.filter(s => s.status === 'active').length)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">تجريبية</span>
                      <span className="text-sm font-bold text-blue-400">{num(subs.filter(s => s.status === 'trial').length)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">منتهية</span>
                      <span className="text-sm font-bold text-red-400">{num(subs.filter(s => s.status === 'expired').length)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Schools */}
              <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <h3 className="font-bold text-white text-sm">آخر المؤسسات المسجلة</h3>
                  <button onClick={() => setTab('schools')} className="text-xs font-medium" style={{ color: G }}>عرض الكل</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {['المؤسسة', 'النوع', 'الباقة', 'الحالة', 'تاريخ التسجيل'].map(h => (
                          <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {schools.slice(0, 5).map(s => (
                        <tr key={s.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3 font-medium text-white">{s.name_ar || s.name || '—'}</td>
                          <td className="px-4 py-3 text-gray-400">{s.institution_type || '—'}</td>
                          <td className="px-4 py-3"><Badge text={s.plan || 'مجاني'} color={G} /></td>
                          <td className="px-4 py-3"><Badge text={STATUS_LABELS[s.status] || s.status} color={STATUS_COLORS[s.status] || '#6B7280'} /></td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{fmt(s.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Join Requests */}
              {joinRequests.length > 0 && (
                <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <h3 className="font-bold text-white text-sm">طلبات التسجيل الجديدة</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#F59E0B22', color: '#F59E0B' }}>{joinRequests.length}</span>
                  </div>
                  <div className="divide-y" style={{ borderColor: BORDER }}>
                    {joinRequests.slice(0, 3).map(r => (
                      <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white">{r.school_name || r.owner_name}</div>
                          <div className="text-xs text-gray-400">{r.email} · {r.city}</div>
                        </div>
                        <div className="flex gap-2">
                          <Btn size="sm" onClick={() => approveJoinRequest(r.id)}>موافقة</Btn>
                          <Btn size="sm" variant="danger" onClick={() => rejectJoinRequest(r.id)}>رفض</Btn>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ SCHOOLS ════ */}
          {tab === 'schools' && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-2 flex-1 min-w-0">
                  <input
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none min-w-0"
                    style={{ background: CARD, border: `1px solid ${BORDER}` }}
                    placeholder="بحث عن مؤسسة..."
                    value={schoolSearch}
                    onChange={e => setSchoolSearch(e.target.value)}
                  />
                  <Sel value={schoolStatus} onChange={setSchoolStatus} options={[
                    { value: 'all', label: 'كل الحالات' },
                    { value: 'active', label: 'نشطة' },
                    { value: 'inactive', label: 'غير نشطة' },
                    { value: 'pending', label: 'معلقة' },
                    { value: 'trial', label: 'تجريبية' },
                    { value: 'suspended', label: 'موقوفة' },
                  ]} />
                </div>
                <Btn onClick={() => { setEditItem(null); setSf({}); setModal('school'); }}>إضافة مؤسسة</Btn>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'الكل', count: schools.length, color: G },
                  { label: 'نشطة', count: schools.filter(s => s.status === 'active').length, color: '#22C55E' },
                  { label: 'تجريبية', count: schools.filter(s => s.status === 'trial').length, color: '#3B82F6' },
                  { label: 'معلقة', count: schools.filter(s => s.status === 'pending').length, color: '#F59E0B' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="text-xl font-black" style={{ color: s.color }}>{s.count}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                        {['المؤسسة', 'المالك', 'النوع', 'الباقة', 'الحالة', 'الإعلانات', 'المتجر', 'الإجراءات'].map(h => (
                          <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchools.map(s => (
                        <tr key={s.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-white">{s.name_ar || s.name || '—'}</div>
                            <div className="text-xs text-gray-500">{s.city || ''} {s.code ? `· ${s.code}` : ''}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-300">{s.owner_name || '—'}</div>
                            <div className="text-xs text-gray-500">{s.owner_email || ''}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{s.institution_type || '—'}</td>
                          <td className="px-4 py-3"><Badge text={s.plan || 'مجاني'} color={G} /></td>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleSchoolStatus(s)}>
                              <Badge text={STATUS_LABELS[s.status] || s.status} color={STATUS_COLORS[s.status] || '#6B7280'} />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleSchoolAds(s)} className={`w-10 h-5 rounded-full transition-all relative ${s.show_matin_ads ? 'bg-green-500' : 'bg-gray-600'}`}>
                              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${s.show_matin_ads ? 'right-0.5' : 'left-0.5'}`} />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleSchoolStore(s)} className={`w-10 h-5 rounded-full transition-all relative ${s.show_matin_store ? 'bg-green-500' : 'bg-gray-600'}`}>
                              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${s.show_matin_store ? 'right-0.5' : 'left-0.5'}`} />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => {
                                setEditItem(s);
                                setSf({ name: s.name, name_ar: s.name_ar, email: s.email, phone: s.phone, city: s.city, institution_type: s.institution_type, status: s.status, plan: s.plan });
                                setModal('school');
                              }} className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: `${G}22`, color: G }}>تعديل</button>
                              <button onClick={() => {
                                setSelectedSchoolServices(s);
                                fetchSchoolServices(s.id);
                                setModal('school_services');
                              }} className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#3B82F622', color: '#3B82F6' }}>الخدمات</button>
                              <button onClick={() => deleteSchool(s.id)} className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#EF444422', color: '#EF4444' }}>حذف</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredSchools.length === 0 && (
                    <div className="text-center py-12 text-gray-500 text-sm">لا توجد مؤسسات</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════ USERS ════ */}
          {tab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-2 flex-1 min-w-0">
                  <input
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none min-w-0"
                    style={{ background: CARD, border: `1px solid ${BORDER}` }}
                    placeholder="بحث عن مستخدم..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                  />
                  <Sel value={userRole} onChange={setUserRole} options={[
                    { value: 'all', label: 'كل الأدوار' },
                    { value: 'owner', label: 'مالك مؤسسة' },
                    { value: 'admin', label: 'مدير' },
                    { value: 'teacher', label: 'معلم' },
                    { value: 'student', label: 'طالب' },
                    { value: 'parent', label: 'ولي أمر' },
                  ]} />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: 'الكل', count: users.length, color: G },
                  { label: 'ملاك', count: users.filter(u => u.role === 'owner').length, color: '#A855F7' },
                  { label: 'معلمون', count: users.filter(u => u.role === 'teacher').length, color: '#3B82F6' },
                  { label: 'طلاب', count: users.filter(u => u.role === 'student').length, color: '#22C55E' },
                  { label: 'معلقون', count: users.filter(u => u.status === 'pending').length, color: '#F59E0B' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="text-xl font-black" style={{ color: s.color }}>{s.count}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                        {['الاسم', 'البريد', 'الدور', 'المؤسسة', 'الحالة', 'تاريخ التسجيل', 'الإجراءات'].map(h => (
                          <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3 font-medium text-white">{u.name || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{u.email}</td>
                          <td className="px-4 py-3">
                            <Badge text={
                              u.role === 'owner' ? 'مالك' : u.role === 'admin' ? 'مدير' :
                              u.role === 'teacher' ? 'معلم' : u.role === 'student' ? 'طالب' :
                              u.role === 'parent' ? 'ولي أمر' : u.role
                            } color={
                              u.role === 'owner' ? '#A855F7' : u.role === 'admin' ? G :
                              u.role === 'teacher' ? '#3B82F6' : u.role === 'student' ? '#22C55E' : '#6B7280'
                            } />
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{u.school_name || '—'}</td>
                          <td className="px-4 py-3"><Badge text={STATUS_LABELS[u.status] || u.status || 'نشط'} color={STATUS_COLORS[u.status] || '#22C55E'} /></td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{fmt(u.created_at)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => {
                                setEditItem(u);
                                setUf({ name: u.name, email: u.email, role: u.role, status: u.status, phone: u.phone });
                                setModal('user');
                              }} className="text-xs px-2 py-1 rounded-lg" style={{ background: `${G}22`, color: G }}>تعديل</button>
                              {u.status === 'pending' && (
                                <button onClick={() => updatePermission(u.id, 'status', 'active')} className="text-xs px-2 py-1 rounded-lg" style={{ background: '#22C55E22', color: '#22C55E' }}>تفعيل</button>
                              )}
                              <button onClick={() => deleteUser(u.id)} className="text-xs px-2 py-1 rounded-lg" style={{ background: '#EF444422', color: '#EF4444' }}>حذف</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500 text-sm">لا يوجد مستخدمون</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════ SUBSCRIPTIONS ════ */}
          {tab === 'subscriptions' && (
            <div className="space-y-4">
              <div className="flex gap-3 items-center justify-between">
                <input
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}
                  placeholder="بحث في الاشتراكات..."
                  value={subsSearch}
                  onChange={e => setSubsSearch(e.target.value)}
                />
                <Btn onClick={() => { setEditItem(null); setPf({}); setModal('assign_plan'); }}>تعيين باقة لمؤسسة</Btn>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'الكل', count: subs.length, color: G },
                  { label: 'نشطة', count: subs.filter(s => s.status === 'active').length, color: '#22C55E' },
                  { label: 'تجريبية', count: subs.filter(s => s.status === 'trial').length, color: '#3B82F6' },
                  { label: 'منتهية', count: subs.filter(s => s.status === 'expired').length, color: '#EF4444' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="text-xl font-black" style={{ color: s.color }}>{s.count}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                        {['المؤسسة', 'المالك', 'الباقة', 'الحالة', 'دورة الفوترة', 'تاريخ البداية', 'تاريخ الانتهاء', 'الإجراءات'].map(h => (
                          <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubs.map(s => (
                        <tr key={s.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3 font-medium text-white">{s.school_name_ar || s.school_name || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{s.owner_name || '—'}</td>
                          <td className="px-4 py-3"><Badge text={s.plan_name || '—'} color={G} /></td>
                          <td className="px-4 py-3"><Badge text={STATUS_LABELS[s.status] || s.status} color={STATUS_COLORS[s.status] || '#6B7280'} /></td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{s.billing_cycle === 'yearly' ? 'سنوي' : 'شهري'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{fmt(s.starts_at)}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{fmt(s.ends_at)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => {
                                setPf({ school_id: s.school_id, plan_id: s.plan_id });
                                setEditItem(s);
                                setModal('assign_plan');
                              }} className="text-xs px-2 py-1 rounded-lg" style={{ background: `${G}22`, color: G }}>تجديد</button>
                              {s.status === 'active' && (
                                <button onClick={async () => {
                                  const r = await api('/api/subscriptions', { method: 'PUT', body: JSON.stringify({ id: s.id, status: 'suspended' }) });
                                  if (r.ok) { showToast('تم تعليق الاشتراك'); await fetchSubs(); }
                                }} className="text-xs px-2 py-1 rounded-lg" style={{ background: '#EF444422', color: '#EF4444' }}>تعليق</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredSubs.length === 0 && (
                    <div className="text-center py-12 text-gray-500 text-sm">لا توجد اشتراكات</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ════ PLANS ════ */}
          {tab === 'plans' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-white">إدارة الباقات</h2>
                <Btn onClick={() => { setEditItem(null); setPlanF({}); setModal('plan'); }}>إضافة باقة</Btn>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map(p => (
                  <div key={p.id} className="rounded-2xl p-5 relative" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-bold text-white text-base">{p.name_ar || p.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{p.name}</div>
                      </div>
                      <Badge text={p.is_active ? 'نشطة' : 'معطلة'} color={p.is_active ? '#22C55E' : '#6B7280'} />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">شهري</span>
                        <span className="text-sm font-bold" style={{ color: G }}>{num(p.price_monthly)} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">سنوي</span>
                        <span className="text-sm font-bold" style={{ color: G }}>{num(p.price_yearly)} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">الطلاب</span>
                        <span className="text-sm text-white">{num(p.max_students)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">المعلمون</span>
                        <span className="text-sm text-white">{num(p.max_teachers)}</span>
                      </div>
                    </div>
                    {Array.isArray(p.features) && p.features.length > 0 && (
                      <div className="space-y-1 mb-4">
                        {p.features.slice(0, 4).map((f: string, i: number) => (
                          <div key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                            <span style={{ color: G }}>✓</span> {f}
                          </div>
                        ))}
                        {p.features.length > 4 && <div className="text-xs text-gray-500">+{p.features.length - 4} ميزة أخرى</div>}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Btn size="sm" onClick={() => {
                        setEditItem(p);
                        setPlanF({ ...p, features_text: Array.isArray(p.features) ? p.features.join('\n') : '' });
                        setModal('plan');
                      }}>تعديل</Btn>
                      <Btn size="sm" variant="ghost" onClick={async () => {
                        const r = await api('/api/plans', { method: 'PUT', body: JSON.stringify({ id: p.id, is_active: !p.is_active }) });
                        if (r.ok) { showToast('تم التحديث'); await fetchPlans(); }
                      }}>{p.is_active ? 'تعطيل' : 'تفعيل'}</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* ════ SERVICES ════ */}
          {tab === 'services' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-white">إدارة خدمات المنصة</h2>
                <div className="text-xs text-gray-400">التحكم في الخدمات المتاحة لجميع المؤسسات</div>
              </div>
              {['academic', 'ai', 'analytics', 'branding', 'communication', 'engagement', 'financial', 'services', 'technical', 'transport'].map(cat => {
                const catServices = services.filter(s => s.category === cat);
                if (catServices.length === 0) return null;
                const catNames: Record<string, string> = {
                  academic: 'الأكاديمية', ai: 'الذكاء الاصطناعي', analytics: 'التحليلات',
                  branding: 'العلامة التجارية', communication: 'التواصل', engagement: 'التفاعل',
                  financial: 'المالية', services: 'الخدمات', technical: 'التقنية', transport: 'النقل',
                };
                return (
                  <div key={cat} className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="px-5 py-3 font-bold text-sm" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}`, color: G }}>
                      {catNames[cat] || cat}
                    </div>
                    <div className="divide-y" style={{ borderColor: BORDER }}>
                      {catServices.map(s => (
                        <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <SvgIcon id="services" size={18} color={G} />
                            <div>
                              <div className="text-sm font-medium text-white">{s.name_ar}</div>
                              <div className="text-xs text-gray-500">
                                {s.is_core ? 'خدمة أساسية' : `يتطلب: ${s.requires_plan}`}
                                {s.enabled_count > 0 && ` · ${s.enabled_count} مؤسسة`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {s.is_core && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#3B82F622', color: '#3B82F6' }}>أساسية</span>}
                            <button onClick={() => toggleService(s.key, s.is_active)}
                              className={`w-12 h-6 rounded-full transition-all relative ${s.is_active ? 'bg-green-500' : 'bg-gray-600'}`}>
                              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${s.is_active ? 'right-0.5' : 'left-0.5'}`} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ════ STORE ════ */}
          {tab === 'store' && (
            <div className="space-y-4">
              {/* Sub-tabs */}
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}`, width: 'fit-content' }}>
                {[
                  { id: 'products', label: 'المنتجات' },
                  { id: 'orders', label: 'الطلبات' },
                  { id: 'shipping', label: 'الشحن' },
                  { id: 'coupons', label: 'الكوبونات' },
                ].map(t => (
                  <button key={t.id} onClick={() => setStoreTab(t.id as any)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ background: storeTab === t.id ? G : 'transparent', color: storeTab === t.id ? '#000' : '#94A3B8' }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Products */}
              {storeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">{storeProductsTotal || storeProducts.length} منتج</div>
                    <Btn onClick={() => { setEditItem(null); setSpf({}); setModal('product'); }}>إضافة منتج</Btn>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {storeProducts.map(p => (
                      <div key={p.id} className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                        {p.image && (
                          <div className="h-32 overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => { (e.target as any).style.display = 'none'; }} />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="font-medium text-white mb-1">{p.name}</div>
                          <div className="text-xs text-gray-400 mb-2">{p.category || '—'} · مخزون: {p.stock || 0}</div>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              {p.sale_price && p.sale_price < p.price ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold" style={{ color: G }}>{num(p.sale_price)} ر.س</span>
                                  <span className="text-xs text-gray-500 line-through">{num(p.price)}</span>
                                </div>
                              ) : (
                                <span className="font-bold" style={{ color: G }}>{num(p.price)} ر.س</span>
                              )}
                            </div>
                            <Badge text={p.is_active !== false ? 'نشط' : 'معطل'} color={p.is_active !== false ? '#22C55E' : '#6B7280'} />
                          </div>
                          <div className="flex gap-2">
                            <Btn size="sm" onClick={() => {
                              setEditItem(p);
                              setSpf({ name: p.name, description: p.description, price: p.price, sale_price: p.sale_price, category: p.category, stock: p.stock, image: p.image });
                              setModal('product');
                            }}>تعديل</Btn>
                            <Btn size="sm" variant="danger" onClick={() => deleteProduct(p.id)}>حذف</Btn>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders */}
              {storeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'الكل', count: storeOrders.length, color: G },
                      { label: 'معلقة', count: storeOrders.filter(o => o.status === 'pending').length, color: '#F59E0B' },
                      { label: 'مكتملة', count: storeOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length, color: '#22C55E' },
                      { label: 'ملغية', count: storeOrders.filter(o => o.status === 'cancelled').length, color: '#EF4444' },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                        <div className="text-xl font-black" style={{ color: s.color }}>{s.count}</div>
                        <div className="text-xs text-gray-400">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                            {['العميل', 'الهاتف', 'المجموع', 'طريقة الدفع', 'الحالة', 'التاريخ', 'الإجراءات'].map(h => (
                              <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {storeOrders.map(o => (
                            <tr key={o.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/2 transition-colors">
                              <td className="px-4 py-3">
                                <div className="font-medium text-white">{o.customer_name}</div>
                                <div className="text-xs text-gray-500">{o.customer_email}</div>
                              </td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{o.customer_phone || '—'}</td>
                              <td className="px-4 py-3 font-bold" style={{ color: G }}>{num(o.total)} ر.س</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{o.payment_method || '—'}</td>
                              <td className="px-4 py-3"><Badge text={STATUS_LABELS[o.status] || o.status} color={STATUS_COLORS[o.status] || '#6B7280'} /></td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{fmt(o.created_at)}</td>
                              <td className="px-4 py-3">
                                <Sel value={o.status} onChange={v => updateOrderStatus(o.id, v)} options={[
                                  { value: 'pending', label: 'معلق' },
                                  { value: 'processing', label: 'قيد التجهيز' },
                                  { value: 'shipped', label: 'تم الشحن' },
                                  { value: 'delivered', label: 'تم التسليم' },
                                  { value: 'completed', label: 'مكتمل' },
                                  { value: 'cancelled', label: 'ملغي' },
                                ]} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {storeOrders.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">لا توجد طلبات</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping */}
              {storeTab === 'shipping' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">شركات الشحن</h3>
                    <Btn onClick={() => { setEditItem(null); setShippingF({}); setModal('shipping'); }}>إضافة شركة شحن</Btn>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shippingCompanies.map(sc => (
                      <div key={sc.id} className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-medium text-white">{sc.name}</div>
                          <Badge text={sc.is_active ? 'نشطة' : 'معطلة'} color={sc.is_active ? '#22C55E' : '#6B7280'} />
                        </div>
                        <div className="text-xs text-gray-400 mb-3">تكلفة أساسية: {sc.rates?.base_cost || 0} ر.س</div>
                        <div className="flex gap-2">
                          <Btn size="sm" onClick={() => {
                            setEditItem(sc);
                            setShippingF({ name: sc.name, api_key: sc.api_key, is_active: sc.is_active, base_cost: sc.rates?.base_cost });
                            setModal('shipping');
                          }}>تعديل</Btn>
                          <Btn size="sm" variant="ghost" onClick={async () => {
                            const r = await api('/api/store/shipping', { method: 'PUT', body: JSON.stringify({ id: sc.id, is_active: !sc.is_active }) });
                            if (r.ok) { showToast('تم التحديث'); await fetchStore(); }
                          }}>{sc.is_active ? 'تعطيل' : 'تفعيل'}</Btn>
                        </div>
                      </div>
                    ))}
                    {shippingCompanies.length === 0 && (
                      <div className="col-span-3 text-center py-12 text-gray-500 text-sm">لا توجد شركات شحن</div>
                    )}
                  </div>
                </div>
              )}

              {/* Coupons */}
              {storeTab === 'coupons' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">كوبونات الخصم</h3>
                    <Btn onClick={() => { setEditItem(null); setCouponF({}); setModal('coupon'); }}>إضافة كوبون</Btn>
                  </div>
                  <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                            {['الكود', 'نوع الخصم', 'القيمة', 'الاستخدامات', 'الصلاحية', 'الحالة', 'الإجراءات'].map(h => (
                              <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {coupons.map(c => (
                            <tr key={c.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/2 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold" style={{ color: G }}>{c.code}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{c.discount_type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}</td>
                              <td className="px-4 py-3 text-white">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `${c.discount_value} ر.س`}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{c.used_count || 0} / {c.max_uses || '∞'}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{fmt(c.valid_from)} - {fmt(c.valid_until)}</td>
                              <td className="px-4 py-3"><Badge text={c.is_active ? 'نشط' : 'معطل'} color={c.is_active ? '#22C55E' : '#6B7280'} /></td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1.5">
                                  <button onClick={() => {
                                    setEditItem(c);
                                    setCouponF({ code: c.code, discount_type: c.discount_type, discount_value: c.discount_value, max_uses: c.max_uses, valid_from: c.valid_from?.split('T')[0], valid_until: c.valid_until?.split('T')[0], is_active: c.is_active });
                                    setModal('coupon');
                                  }} className="text-xs px-2 py-1 rounded-lg" style={{ background: `${G}22`, color: G }}>تعديل</button>
                                  <button onClick={async () => {
                                    if (!confirm('حذف هذا الكوبون؟')) return;
                                    const r = await api(`/api/coupons?id=${c.id}`, { method: 'DELETE' });
                                    if (r.ok) { showToast('تم الحذف'); await fetchStore(); }
                                  }} className="text-xs px-2 py-1 rounded-lg" style={{ background: '#EF444422', color: '#EF4444' }}>حذف</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {coupons.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">لا توجد كوبونات</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ ADS ════ */}
          {tab === 'ads' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white">إدارة الإعلانات</h2>
                  <p className="text-xs text-gray-400 mt-0.5">الإعلانات تظهر في داشبوردات المؤسسات التي لم تشترك بالباقة المميزة</p>
                </div>
                <Btn onClick={() => { setEditItem(null); setAf({}); setModal('ad'); }}>إضافة إعلان</Btn>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'الكل', count: ads.length, color: G },
                  { label: 'نشطة', count: ads.filter(a => a.is_active).length, color: '#22C55E' },
                  { label: 'معطلة', count: ads.filter(a => !a.is_active).length, color: '#6B7280' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="text-xl font-black" style={{ color: s.color }}>{s.count}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ads.map(a => (
                  <div key={a.id} className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    {a.image_url && (
                      <div className="h-32 overflow-hidden">
                        <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" onError={e => { (e.target as any).style.display = 'none'; }} />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-white text-sm">{a.title}</div>
                        <Badge text={a.is_active ? 'نشط' : 'معطل'} color={a.is_active ? '#22C55E' : '#6B7280'} />
                      </div>
                      {a.content && <div className="text-xs text-gray-400 mb-2 line-clamp-2">{a.content}</div>}
                      <div className="text-xs text-gray-500 mb-3">
                        {a.advertiser && <span>المعلن: {a.advertiser} · </span>}
                        {a.start_date && <span>{fmt(a.start_date)} - {fmt(a.end_date)}</span>}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">على المؤسسات:</span>
                          <button onClick={async () => {
                            const r = await api('/api/ads/manage', { method: 'PUT', body: JSON.stringify({ id: a.id, show_on_schools: !a.show_on_schools }) });
                            if (r.ok) { showToast('تم التحديث'); await fetchAds(); }
                          }} className={`w-8 h-4 rounded-full transition-all relative ${a.show_on_schools ? 'bg-green-500' : 'bg-gray-600'}`}>
                            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${a.show_on_schools ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Btn size="sm" onClick={() => {
                          setEditItem(a);
                          setAf({ title: a.title, content: a.content, image_url: a.image_url, link_url: a.link_url, advertiser: a.advertiser, start_date: a.start_date?.split('T')[0], end_date: a.end_date?.split('T')[0], is_active: a.is_active, show_on_schools: a.show_on_schools });
                          setModal('ad');
                        }}>تعديل</Btn>
                        <Btn size="sm" variant="ghost" onClick={async () => {
                          const r = await api('/api/ads/manage', { method: 'PUT', body: JSON.stringify({ id: a.id, is_active: !a.is_active }) });
                          if (r.ok) { showToast('تم التحديث'); await fetchAds(); }
                        }}>{a.is_active ? 'تعطيل' : 'تفعيل'}</Btn>
                        <Btn size="sm" variant="danger" onClick={() => deleteAd(a.id)}>حذف</Btn>
                      </div>
                    </div>
                  </div>
                ))}
                {ads.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-500 text-sm">لا توجد إعلانات</div>
                )}
              </div>
            </div>
          )}

          {/* ════ SUPPORT ════ */}
          {tab === 'support' && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'all', label: 'الكل' },
                  { value: 'open', label: 'مفتوحة' },
                  { value: 'in_progress', label: 'قيد المعالجة' },
                  { value: 'resolved', label: 'محلولة' },
                  { value: 'closed', label: 'مغلقة' },
                ].map(f => (
                  <button key={f.value} onClick={() => setSupportFilter(f.value)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{ background: supportFilter === f.value ? G : CARD, color: supportFilter === f.value ? '#000' : '#94A3B8', border: `1px solid ${BORDER}` }}>
                    {f.label}
                    {f.value !== 'all' && (
                      <span className="mr-1.5 text-xs">({support.filter(s => s.status === f.value).length})</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredSupport.map(s => (
                  <div key={s.id} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">{s.subject || s.title}</span>
                          <Badge text={STATUS_LABELS[s.status] || s.status} color={STATUS_COLORS[s.status] || '#6B7280'} />
                          <Badge text={s.priority === 'high' ? 'عالية' : s.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                            color={s.priority === 'high' ? '#EF4444' : s.priority === 'medium' ? '#F59E0B' : '#6B7280'} />
                        </div>
                        <div className="text-xs text-gray-400">{s.user_name} · {ago(s.created_at)}</div>
                      </div>
                    </div>
                    {s.description && <div className="text-sm text-gray-300 mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>{s.description}</div>}
                    {s.response && (
                      <div className="text-sm text-gray-300 mb-3 p-3 rounded-xl" style={{ background: `${G}11`, border: `1px solid ${G}33` }}>
                        <div className="text-xs font-bold mb-1" style={{ color: G }}>الرد:</div>
                        {s.response}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => { setEditItem(s); setSupportReply(s.response || ''); setModal('support_reply'); }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: `${G}22`, color: G }}>
                        {s.response ? 'تعديل الرد' : 'رد'}
                      </button>
                      {s.status !== 'closed' && (
                        <button onClick={() => closeSupportTicket(s.id)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: '#22C55E22', color: '#22C55E' }}>
                          إغلاق
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {filteredSupport.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">لا توجد تذاكر دعم</div>}
              </div>
            </div>
          )}

          {/* ════ PERMISSIONS ════ */}
          {tab === 'permissions' && (
            <div className="space-y-4">
              {/* Join Requests */}
              {joinRequests.length > 0 && (
                <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${G}44` }}>
                  <div className="px-5 py-3 font-bold text-sm flex items-center gap-2" style={{ background: `${G}11`, borderBottom: `1px solid ${G}33`, color: G }}>
                    طلبات التسجيل الجديدة
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: G, color: '#000' }}>{joinRequests.length}</span>
                  </div>
                  <div className="divide-y" style={{ borderColor: BORDER }}>
                    {joinRequests.map(r => (
                      <div key={r.id} className="px-5 py-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{r.school_name || r.owner_name}</div>
                          <div className="text-xs text-gray-400">{r.email} · {r.phone} · {r.city}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{r.type} · {ago(r.created_at)}</div>
                        </div>
                        <div className="flex gap-2">
                          <Btn onClick={() => approveJoinRequest(r.id)}>موافقة</Btn>
                          <Btn variant="danger" onClick={() => rejectJoinRequest(r.id)}>رفض</Btn>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leads */}
              {leads.length > 0 && (
                <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="px-5 py-3 font-bold text-sm" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}`, color: '#94A3B8' }}>
                    العملاء المحتملون (Leads)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                          {['الاسم', 'البريد', 'الهاتف', 'المؤسسة', 'المصدر', 'الحالة', 'التاريخ', 'الإجراءات'].map(h => (
                            <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map(l => (
                          <tr key={l.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/2 transition-colors">
                            <td className="px-4 py-3 font-medium text-white">{l.name}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{l.email}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{l.phone}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{l.institution}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{l.source}</td>
                            <td className="px-4 py-3"><Badge text={STATUS_LABELS[l.status] || l.status || 'جديد'} color={STATUS_COLORS[l.status] || '#3B82F6'} /></td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{fmt(l.created_at)}</td>
                            <td className="px-4 py-3">
                              <Sel value={l.status || 'new'} onChange={v => updateLeadStatus(l.id, v)} options={[
                                { value: 'new', label: 'جديد' },
                                { value: 'contacted', label: 'تم التواصل' },
                                { value: 'qualified', label: 'مؤهل' },
                                { value: 'converted', label: 'تحول عميل' },
                                { value: 'lost', label: 'خسارة' },
                              ]} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* User Permissions */}
              <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <h3 className="font-bold text-white text-sm">صلاحيات المستخدمين</h3>
                  <div className="flex gap-2">
                    <input
                      className="rounded-xl px-3 py-2 text-sm text-white outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}
                      placeholder="بحث..."
                      value={permSearch}
                      onChange={e => setPermSearch(e.target.value)}
                    />
                    <Sel value={permRole} onChange={setPermRole} options={[
                      { value: 'all', label: 'كل الأدوار' },
                      { value: 'owner', label: 'مالك' },
                      { value: 'admin', label: 'مدير' },
                      { value: 'teacher', label: 'معلم' },
                    ]} />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                        {['المستخدم', 'الدور', 'المؤسسة', 'الحالة', 'الإجراءات'].map(h => (
                          <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPerms.map(u => (
                        <tr key={u.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-white">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <Sel value={u.role} onChange={v => updatePermission(u.id, 'role', v)} options={[
                              { value: 'owner', label: 'مالك' },
                              { value: 'admin', label: 'مدير' },
                              { value: 'teacher', label: 'معلم' },
                              { value: 'student', label: 'طالب' },
                              { value: 'parent', label: 'ولي أمر' },
                            ]} />
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{u.school_name || '—'}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => updatePermission(u.id, 'is_active', !u.is_active)}
                              className={`w-10 h-5 rounded-full transition-all relative ${u.is_active ? 'bg-green-500' : 'bg-gray-600'}`}>
                              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${u.is_active ? 'right-0.5' : 'left-0.5'}`} />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            {u.status === 'pending' && (
                              <button onClick={() => updatePermission(u.id, 'status', 'active')}
                                className="text-xs px-2 py-1 rounded-lg" style={{ background: '#22C55E22', color: '#22C55E' }}>تفعيل</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredPerms.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">لا يوجد مستخدمون</div>}
                </div>
              </div>
            </div>
          )}
          {/* ════ INTEGRATIONS ════ */}
          {tab === 'integrations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-white">التكاملات والربط الخارجي</h2>
                <Btn onClick={() => { setEditItem(null); setIntegF({}); setModal('integration'); }}>إضافة تكامل</Btn>
              </div>
              {['payment', 'shipping', 'communication', 'government', 'notification', 'analytics', 'maps', 'other'].map(cat => {
                const catInteg = integrations.filter(i => i.category === cat);
                if (catInteg.length === 0) return null;
                const catNames: Record<string, string> = {
                  payment: 'بوابات الدفع', shipping: 'الشحن', communication: 'التواصل',
                  government: 'الحكومية', notification: 'الإشعارات', analytics: 'التحليلات',
                  maps: 'الخرائط', other: 'أخرى',
                };
                return (
                  <div key={cat} className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="px-5 py-3 font-bold text-sm" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}`, color: G }}>
                      {catNames[cat] || cat}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {catInteg.map(integ => (
                        <div key={integ.id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <SvgIcon id="integrations" size={18} color={G} />
                              <div>
                                <div className="text-sm font-medium text-white">{integ.display_name || integ.name}</div>
                                <div className="text-xs text-gray-500">{integ.type}</div>
                              </div>
                            </div>
                            <Badge text={integ.is_active ? 'نشط' : 'معطل'} color={integ.is_active ? '#22C55E' : '#6B7280'} />
                          </div>
                          {integ.description && <div className="text-xs text-gray-400 mb-3">{integ.description}</div>}
                          <div className="flex gap-2">
                            <button onClick={() => {
                              setEditItem(integ);
                              setIntegF({ name: integ.name, type: integ.type, display_name: integ.display_name, description: integ.description, category: integ.category, is_active: integ.is_active, api_key: integ.api_key, api_secret: integ.api_secret });
                              setModal('integration');
                            }} className="text-xs px-2 py-1 rounded-lg" style={{ background: `${G}22`, color: G }}>تعديل</button>
                            <button onClick={async () => {
                              const r = await api('/api/integrations', { method: 'PUT', body: JSON.stringify({ id: integ.id, is_active: !integ.is_active }) });
                              if (r.ok) { showToast('تم التحديث'); await fetchIntegrations(); }
                            }} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: '#94A3B8', border: `1px solid ${BORDER}` }}>
                              {integ.is_active ? 'تعطيل' : 'تفعيل'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ════ COMMUNITY ════ */}
          {tab === 'community' && (
            <div className="space-y-4">
              {/* Sub-tabs */}
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}`, width: 'fit-content' }}>
                {[
                  { id: 'overview', label: 'نظرة عامة' },
                  { id: 'posts', label: 'المنشورات' },
                  { id: 'reports', label: 'البلاغات' },
                  { id: 'banned', label: 'المحظورون' },
                ].map(t => (
                  <button key={t.id} onClick={() => setCommunityTab(t.id as any)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ background: communityTab === t.id ? G : 'transparent', color: communityTab === t.id ? '#000' : '#94A3B8' }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {communityTab === 'overview' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatCard label="المنشورات النشطة" value={communityStats.active_posts || 0} color="#22C55E" />
                  <StatCard label="المنشورات المخفية" value={communityStats.hidden_posts || 0} color="#EF4444" />
                  <StatCard label="المنشورات المشبوهة" value={communityStats.flagged_posts || 0} color="#F59E0B" />
                  <StatCard label="البلاغات المعلقة" value={communityStats.pending_reports || 0} color="#EF4444" />
                  <StatCard label="تنبيهات الذكاء الاصطناعي اليوم" value={communityStats.ai_flags_today || 0} color="#A855F7" />
                  <StatCard label="المستخدمون المحظورون" value={communityStats.banned_users || 0} color="#EF4444" />
                </div>
              )}

              {communityTab === 'posts' && (
                <div className="space-y-3">
                  {communityPosts.map(p => (
                    <div key={p.id} className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{p.author_name || 'مجهول'}</div>
                          <div className="text-xs text-gray-400">{ago(p.created_at)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {p.ai_verdict && p.ai_verdict !== 'safe' && (
                            <Badge text={`AI: ${p.ai_verdict}`} color="#F59E0B" />
                          )}
                          <Badge text={p.is_hidden ? 'مخفي' : 'ظاهر'} color={p.is_hidden ? '#EF4444' : '#22C55E'} />
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 mb-3">{p.content}</div>
                      <div className="flex gap-2">
                        <button onClick={() => communityAction(p.is_hidden ? 'unhide_post' : 'hide_post', { post_id: p.id })}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: p.is_hidden ? '#22C55E22' : '#EF444422', color: p.is_hidden ? '#22C55E' : '#EF4444' }}>
                          {p.is_hidden ? 'إظهار' : 'إخفاء'}
                        </button>
                        <button onClick={() => communityAction('delete_post', { post_id: p.id })}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: '#EF444422', color: '#EF4444' }}>
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                  {communityPosts.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">لا توجد منشورات</div>}
                </div>
              )}

              {communityTab === 'reports' && (
                <div className="space-y-3">
                  {communityReports.map(r => (
                    <div key={r.id} className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium text-white">بلاغ من: {r.reporter_name || 'مجهول'}</div>
                          <div className="text-xs text-gray-400">السبب: {r.reason} · {ago(r.created_at)}</div>
                        </div>
                        <Badge text={STATUS_LABELS[r.status] || r.status} color={STATUS_COLORS[r.status] || '#6B7280'} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => communityAction('resolve_report', { report_id: r.id })}
                          className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#22C55E22', color: '#22C55E' }}>حل</button>
                        <button onClick={() => communityAction('dismiss_report', { report_id: r.id })}
                          className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#6B728022', color: '#6B7280' }}>رفض</button>
                      </div>
                    </div>
                  ))}
                  {communityReports.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">لا توجد بلاغات</div>}
                </div>
              )}

              {communityTab === 'banned' && (
                <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                          {['المستخدم', 'سبب الحظر', 'حتى تاريخ', 'الإجراءات'].map(h => (
                            <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {communityBanned.map(u => (
                          <tr key={u.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/2 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-medium text-white">{u.name}</div>
                              <div className="text-xs text-gray-500">{u.email}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{u.community_ban_reason || '—'}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{u.community_ban_until ? fmt(u.community_ban_until) : 'دائم'}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => communityAction('unban_user', { user_id: u.id })}
                                className="text-xs px-2 py-1 rounded-lg" style={{ background: '#22C55E22', color: '#22C55E' }}>رفع الحظر</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {communityBanned.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">لا يوجد مستخدمون محظورون</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ NOTIFICATIONS ════ */}
          {tab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <input
                    className="rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                    style={{ background: CARD, border: `1px solid ${BORDER}` }}
                    placeholder="بحث في الإشعارات..."
                    value={notifSearch}
                    onChange={e => setNotifSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {unreadNotifs > 0 && (
                    <Btn variant="ghost" onClick={markAllNotifsRead}>تعليم الكل كمقروء</Btn>
                  )}
                  <Btn onClick={() => { setNotifF({}); setModal('send_notif'); }}>إرسال إشعار</Btn>
                </div>
              </div>

              <div className="space-y-2">
                {filteredNotifs.map(n => (
                  <div key={n.id} className="rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-colors hover:bg-white/2"
                    style={{ background: n.is_read ? CARD : `${G}0A`, border: `1px solid ${n.is_read ? BORDER : G + '44'}` }}
                    onClick={() => markNotifRead(n.id)}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.is_read ? '#4B5563' : G }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{n.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{n.message || n.description}</div>
                    </div>
                    <div className="text-xs text-gray-500 flex-shrink-0">{ago(n.created_at)}</div>
                  </div>
                ))}
                {filteredNotifs.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">لا توجد إشعارات</div>}
              </div>
            </div>
          )}

          {/* ════ SETTINGS ════ */}
          {tab === 'settings' && (
            <div className="space-y-4">
              {/* Category Tabs */}
              <div className="flex gap-1 flex-wrap">
                {['general', 'payment', 'email', 'security', 'appearance', 'other'].map(cat => {
                  const catNames: Record<string, string> = {
                    general: 'عام', payment: 'الدفع', email: 'البريد',
                    security: 'الأمان', appearance: 'المظهر', other: 'أخرى',
                  };
                  const catSettings = platformSettings.filter(s => s.category === cat);
                  if (catSettings.length === 0 && cat !== 'general') return null;
                  return (
                    <button key={cat} onClick={() => setSettingsCategory(cat)}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                      style={{ background: settingsCategory === cat ? G : CARD, color: settingsCategory === cat ? '#000' : '#94A3B8', border: `1px solid ${BORDER}` }}>
                      {catNames[cat] || cat}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                {platformSettings.filter(s => s.category === settingsCategory).map(s => (
                  <div key={s.id} className="rounded-xl p-4 flex items-center justify-between gap-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{s.key}</div>
                      {s.description && <div className="text-xs text-gray-400 mt-0.5">{s.description}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        className="rounded-xl px-3 py-2 text-sm text-white outline-none w-48"
                        style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}
                        defaultValue={s.value}
                        onBlur={e => { if (e.target.value !== s.value) saveSetting(s.key, e.target.value); }}
                        key={s.id + s.value}
                      />
                      <button onClick={e => {
                        const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                        saveSetting(s.key, input.value);
                      }} className="text-xs px-3 py-2 rounded-lg font-medium" style={{ background: `${G}22`, color: G }}>حفظ</button>
                    </div>
                  </div>
                ))}
                {platformSettings.filter(s => s.category === settingsCategory).length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-sm">لا توجد إعدادات في هذه الفئة</div>
                )}
              </div>
            </div>
          )}

          {/* ════ ACTIVITY LOG ════ */}
          {tab === 'activity' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-white">سجل النشاط</h2>
                <button onClick={fetchActLog} className="text-xs px-3 py-1.5 rounded-xl font-medium" style={{ color: G, border: `1px solid ${G}44` }}>تحديث</button>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${BORDER}` }}>
                        {['الإجراء', 'الكيان', 'المعرف', 'المستخدم', 'عنوان IP', 'التاريخ'].map(h => (
                          <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {actLog.map(l => (
                        <tr key={l.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3"><Badge text={l.action || '—'} color={G} /></td>
                          <td className="px-4 py-3 text-gray-300 text-xs">{l.entity || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs font-mono">{l.entity_id || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{l.user_id || l.admin_id || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs font-mono">{l.ip_address || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{fmt(l.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {actLog.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">لا يوجد سجل نشاط</div>}
                </div>
              </div>
            </div>
          )}

        </div>{/* end content */}
      </main>

      {/* ════════════════════════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════════════════════════ */}

      {/* School Modal */}
      {modal === 'school' && (
        <Modal title={editItem ? 'تعديل المؤسسة' : 'إضافة مؤسسة جديدة'} onClose={() => { setModal(null); setEditItem(null); setSf({}); }}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Inp label="اسم المؤسسة (عربي)" value={sf.name_ar || ''} onChange={(v: string) => setSf({ ...sf, name_ar: v })} required />
              <Inp label="اسم المؤسسة (إنجليزي)" value={sf.name || ''} onChange={(v: string) => setSf({ ...sf, name: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Inp label="البريد الإلكتروني" value={sf.email || ''} onChange={(v: string) => setSf({ ...sf, email: v })} type="email" />
              <Inp label="الهاتف" value={sf.phone || ''} onChange={(v: string) => setSf({ ...sf, phone: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Inp label="المدينة" value={sf.city || ''} onChange={(v: string) => setSf({ ...sf, city: v })} />
              <Sel label="نوع المؤسسة" value={sf.institution_type || ''} onChange={(v: string) => setSf({ ...sf, institution_type: v })} options={[
                { value: '', label: 'اختر النوع' },
                { value: 'school', label: 'مدرسة' },
                { value: 'university', label: 'جامعة' },
                { value: 'institute', label: 'معهد' },
                { value: 'kindergarten', label: 'روضة' },
                { value: 'training', label: 'مركز تدريب' },
              ]} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Sel label="الحالة" value={sf.status || 'active'} onChange={(v: string) => setSf({ ...sf, status: v })} options={[
                { value: 'active', label: 'نشطة' },
                { value: 'inactive', label: 'غير نشطة' },
                { value: 'pending', label: 'معلقة' },
                { value: 'trial', label: 'تجريبية' },
                { value: 'suspended', label: 'موقوفة' },
              ]} />
              <Sel label="الباقة" value={sf.plan || ''} onChange={(v: string) => setSf({ ...sf, plan: v })} options={[
                { value: '', label: 'بدون باقة' },
                ...plans.map(p => ({ value: p.name || p.name_ar, label: p.name_ar || p.name })),
              ]} />
            </div>
            <div className="flex gap-2 pt-2">
              <Btn onClick={saveSchool} disabled={saving}>{saving ? 'جاري الحفظ...' : editItem ? 'تحديث' : 'إضافة'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setEditItem(null); setSf({}); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* School Services Modal */}
      {modal === 'school_services' && selectedSchoolServices && (
        <Modal title={`خدمات: ${selectedSchoolServices.name_ar || selectedSchoolServices.name}`} onClose={() => { setModal(null); setSelectedSchoolServices(null); }} wide>
          <div className="space-y-2">
            {schoolServicesData.map(s => (
              <div key={s.key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2">
                  <SvgIcon id="settings" size={16} color={G} />
                  <div>
                    <div className="text-sm font-medium text-white">{s.name_ar}</div>
                    <div className="text-xs text-gray-500">{s.category} · {s.is_core ? 'أساسية' : s.requires_plan}</div>
                  </div>
                </div>
                <button onClick={() => toggleSchoolService(selectedSchoolServices.id, s.key, s.is_enabled)}
                  className={`w-12 h-6 rounded-full transition-all relative ${s.is_enabled ? 'bg-green-500' : 'bg-gray-600'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${s.is_enabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* User Modal */}
      {modal === 'user' && (
        <Modal title={editItem ? 'تعديل المستخدم' : 'إضافة مستخدم'} onClose={() => { setModal(null); setEditItem(null); setUf({}); }}>
          <div className="space-y-3">
            <Inp label="الاسم" value={uf.name || ''} onChange={(v: string) => setUf({ ...uf, name: v })} required />
            <Inp label="البريد الإلكتروني" value={uf.email || ''} onChange={(v: string) => setUf({ ...uf, email: v })} type="email" required />
            <Inp label="الهاتف" value={uf.phone || ''} onChange={(v: string) => setUf({ ...uf, phone: v })} />
            <Sel label="الدور" value={uf.role || 'teacher'} onChange={(v: string) => setUf({ ...uf, role: v })} options={[
              { value: 'owner', label: 'مالك مؤسسة' },
              { value: 'admin', label: 'مدير' },
              { value: 'teacher', label: 'معلم' },
              { value: 'student', label: 'طالب' },
              { value: 'parent', label: 'ولي أمر' },
            ]} />
            <Sel label="الحالة" value={uf.status || 'active'} onChange={(v: string) => setUf({ ...uf, status: v })} options={[
              { value: 'active', label: 'نشط' },
              { value: 'inactive', label: 'غير نشط' },
              { value: 'pending', label: 'معلق' },
              { value: 'suspended', label: 'موقوف' },
            ]} />
            <div className="flex gap-2 pt-2">
              <Btn onClick={saveUser} disabled={saving}>{saving ? 'جاري الحفظ...' : editItem ? 'تحديث' : 'إضافة'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setEditItem(null); setUf({}); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Plan Modal */}
      {modal === 'plan' && (
        <Modal title={editItem ? 'تعديل الباقة' : 'إضافة باقة جديدة'} onClose={() => { setModal(null); setEditItem(null); setPlanF({}); }}>
          <div className="space-y-3">
            <Inp label="اسم الباقة (عربي)" value={planF.name_ar || ''} onChange={(v: string) => setPlanF({ ...planF, name_ar: v })} required />
            <Inp label="اسم الباقة (إنجليزي)" value={planF.name || ''} onChange={(v: string) => setPlanF({ ...planF, name: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Inp label="السعر الشهري (ر.س)" value={planF.price_monthly || ''} onChange={(v: string) => setPlanF({ ...planF, price_monthly: v })} type="number" />
              <Inp label="السعر السنوي (ر.س)" value={planF.price_yearly || ''} onChange={(v: string) => setPlanF({ ...planF, price_yearly: v })} type="number" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Inp label="الحد الأقصى للطلاب" value={planF.max_students || ''} onChange={(v: string) => setPlanF({ ...planF, max_students: v })} type="number" />
              <Inp label="الحد الأقصى للمعلمين" value={planF.max_teachers || ''} onChange={(v: string) => setPlanF({ ...planF, max_teachers: v })} type="number" />
            </div>
            <Inp label="المميزات (سطر لكل ميزة)" value={planF.features_text || ''} onChange={(v: string) => setPlanF({ ...planF, features_text: v })} textarea rows={5} placeholder="ميزة 1&#10;ميزة 2&#10;ميزة 3" />
            <div className="flex gap-2 pt-2">
              <Btn onClick={savePlan} disabled={saving}>{saving ? 'جاري الحفظ...' : editItem ? 'تحديث' : 'إضافة'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setEditItem(null); setPlanF({}); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign Plan Modal */}
      {modal === 'assign_plan' && (
        <Modal title="تعيين باقة لمؤسسة" onClose={() => { setModal(null); setEditItem(null); setPf({}); }}>
          <div className="space-y-3">
            <Sel label="المؤسسة" value={pf.school_id || ''} onChange={(v: string) => setPf({ ...pf, school_id: v })} options={[
              { value: '', label: 'اختر المؤسسة' },
              ...schools.map(s => ({ value: s.id, label: s.name_ar || s.name })),
            ]} />
            <Sel label="الباقة" value={pf.plan_id || ''} onChange={(v: string) => setPf({ ...pf, plan_id: v })} options={[
              { value: '', label: 'اختر الباقة' },
              ...plans.map(p => ({ value: String(p.id), label: `${p.name_ar} - ${p.price_monthly} ر.س/شهر` })),
            ]} />
            <Inp label="المدة (أشهر)" value={pf.duration_months || '12'} onChange={(v: string) => setPf({ ...pf, duration_months: v })} type="number" />
            <div className="flex gap-2 pt-2">
              <Btn onClick={assignPlanToSchool} disabled={saving}>{saving ? 'جاري التعيين...' : 'تعيين الباقة'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setEditItem(null); setPf({}); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Ad Modal */}
      {modal === 'ad' && (
        <Modal title={editItem ? 'تعديل الإعلان' : 'إضافة إعلان جديد'} onClose={() => { setModal(null); setEditItem(null); setAf({}); }}>
          <div className="space-y-3">
            <Inp label="عنوان الإعلان" value={af.title || ''} onChange={(v: string) => setAf({ ...af, title: v })} required />
            <Inp label="المحتوى" value={af.content || ''} onChange={(v: string) => setAf({ ...af, content: v })} textarea />
            <Inp label="رابط الصورة" value={af.image_url || ''} onChange={(v: string) => setAf({ ...af, image_url: v })} />
            <Inp label="رابط الإعلان" value={af.link_url || ''} onChange={(v: string) => setAf({ ...af, link_url: v })} />
            <Inp label="المعلن" value={af.advertiser || ''} onChange={(v: string) => setAf({ ...af, advertiser: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Inp label="تاريخ البداية" value={af.start_date || ''} onChange={(v: string) => setAf({ ...af, start_date: v })} type="date" />
              <Inp label="تاريخ الانتهاء" value={af.end_date || ''} onChange={(v: string) => setAf({ ...af, end_date: v })} type="date" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={af.is_active !== false} onChange={e => setAf({ ...af, is_active: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-300">نشط</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={af.show_on_schools !== false} onChange={e => setAf({ ...af, show_on_schools: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-300">يظهر في المؤسسات</span>
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <Btn onClick={saveAd} disabled={saving}>{saving ? 'جاري الحفظ...' : editItem ? 'تحديث' : 'إضافة'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setEditItem(null); setAf({}); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Product Modal */}
      {modal === 'product' && (
        <Modal title={editItem ? 'تعديل المنتج' : 'إضافة منتج جديد'} onClose={() => { setModal(null); setEditItem(null); setSpf({}); }}>
          <div className="space-y-3">
            <Inp label="اسم المنتج" value={spf.name || ''} onChange={(v: string) => setSpf({ ...spf, name: v })} required />
            <Inp label="الوصف" value={spf.description || ''} onChange={(v: string) => setSpf({ ...spf, description: v })} textarea />
            <div className="grid grid-cols-2 gap-3">
              <Inp label="السعر (ر.س)" value={spf.price || ''} onChange={(v: string) => setSpf({ ...spf, price: v })} type="number" required />
              <Inp label="سعر التخفيض (ر.س)" value={spf.sale_price || ''} onChange={(v: string) => setSpf({ ...spf, sale_price: v })} type="number" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Inp label="الفئة" value={spf.category || ''} onChange={(v: string) => setSpf({ ...spf, category: v })} />
              <Inp label="المخزون" value={spf.stock || ''} onChange={(v: string) => setSpf({ ...spf, stock: v })} type="number" />
            </div>
            <Inp label="رابط الصورة" value={spf.image || ''} onChange={(v: string) => setSpf({ ...spf, image: v })} />
            <div className="flex gap-2 pt-2">
              <Btn onClick={saveProduct} disabled={saving}>{saving ? 'جاري الحفظ...' : editItem ? 'تحديث' : 'إضافة'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setEditItem(null); setSpf({}); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Shipping Modal */}
      {modal === 'shipping' && (
        <Modal title={editItem ? 'تعديل شركة الشحن' : 'إضافة شركة شحن'} onClose={() => { setModal(null); setEditItem(null); setShippingF({}); }}>
          <div className="space-y-3">
            <Inp label="اسم الشركة" value={shippingF.name || ''} onChange={(v: string) => setShippingF({ ...shippingF, name: v })} required />
            <Inp label="مفتاح API" value={shippingF.api_key || ''} onChange={(v: string) => setShippingF({ ...shippingF, api_key: v })} />
            <Inp label="التكلفة الأساسية (ر.س)" value={shippingF.base_cost || ''} onChange={(v: string) => setShippingF({ ...shippingF, base_cost: v })} type="number" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={shippingF.is_active !== false} onChange={e => setShippingF({ ...shippingF, is_active: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-300">نشطة</span>
            </label>
            <div className="flex gap-2 pt-2">
              <Btn onClick={saveShipping} disabled={saving}>{saving ? 'جاري الحفظ...' : editItem ? 'تحديث' : 'إضافة'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setEditItem(null); setShippingF({}); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Coupon Modal */}
      {modal === 'coupon' && (
        <Modal title={editItem ? 'تعديل الكوبون' : 'إضافة كوبون خصم'} onClose={() => { setModal(null); setEditItem(null); setCouponF({}); }}>
          <div className="space-y-3">
            <Inp label="كود الكوبون" value={couponF.code || ''} onChange={(v: string) => setCouponF({ ...couponF, code: v.toUpperCase() })} required />
            <Sel label="نوع الخصم" value={couponF.discount_type || 'percentage'} onChange={(v: string) => setCouponF({ ...couponF, discount_type: v })} options={[
              { value: 'percentage', label: 'نسبة مئوية (%)' },
              { value: 'fixed', label: 'مبلغ ثابت (ر.س)' },
            ]} />
            <Inp label="قيمة الخصم" value={couponF.discount_value || ''} onChange={(v: string) => setCouponF({ ...couponF, discount_value: v })} type="number" />
            <Inp label="الحد الأقصى للاستخدام" value={couponF.max_uses || ''} onChange={(v: string) => setCouponF({ ...couponF, max_uses: v })} type="number" placeholder="اتركه فارغاً للاستخدام غير المحدود" />
            <div className="grid grid-cols-2 gap-3">
              <Inp label="صالح من" value={couponF.valid_from || ''} onChange={(v: string) => setCouponF({ ...couponF, valid_from: v })} type="date" />
              <Inp label="صالح حتى" value={couponF.valid_until || ''} onChange={(v: string) => setCouponF({ ...couponF, valid_until: v })} type="date" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={couponF.is_active !== false} onChange={e => setCouponF({ ...couponF, is_active: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-300">نشط</span>
            </label>
            <div className="flex gap-2 pt-2">
              <Btn onClick={saveCoupon} disabled={saving}>{saving ? 'جاري الحفظ...' : editItem ? 'تحديث' : 'إضافة'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setEditItem(null); setCouponF({}); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Support Reply Modal */}
      {modal === 'support_reply' && editItem && (
        <Modal title="الرد على التذكرة" onClose={() => { setModal(null); setEditItem(null); setSupportReply(''); }}>
          <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}>
              <div className="text-xs text-gray-400 mb-1">الموضوع:</div>
              <div className="text-sm text-white">{editItem.subject || editItem.title}</div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}>
              <div className="text-xs text-gray-400 mb-1">الرسالة:</div>
              <div className="text-sm text-gray-300">{editItem.description}</div>
            </div>
            <Inp label="ردك" value={supportReply} onChange={setSupportReply} textarea rows={5} required />
            <div className="flex gap-2 pt-2">
              <Btn onClick={() => replySupport(editItem.id)} disabled={saving}>{saving ? 'جاري الإرسال...' : 'إرسال الرد'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setEditItem(null); setSupportReply(''); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Send Notification Modal */}
      {modal === 'send_notif' && (
        <Modal title="إرسال إشعار" onClose={() => { setModal(null); setNotifF({}); }}>
          <div className="space-y-3">
            <Inp label="العنوان" value={notifF.title || ''} onChange={(v: string) => setNotifF({ ...notifF, title: v })} required />
            <Inp label="الرسالة" value={notifF.message || ''} onChange={(v: string) => setNotifF({ ...notifF, message: v })} textarea required />
            <Sel label="النوع" value={notifF.type || 'info'} onChange={(v: string) => setNotifF({ ...notifF, type: v })} options={[
              { value: 'info', label: 'معلومة' },
              { value: 'warning', label: 'تحذير' },
              { value: 'success', label: 'نجاح' },
              { value: 'error', label: 'خطأ' },
            ]} />
            <Inp label="الرابط (اختياري)" value={notifF.link || ''} onChange={(v: string) => setNotifF({ ...notifF, link: v })} />
            <div className="flex gap-2 pt-2">
              <Btn onClick={sendNotification} disabled={saving}>{saving ? 'جاري الإرسال...' : 'إرسال'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setNotifF({}); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Integration Modal */}
      {modal === 'integration' && (
        <Modal title={editItem ? 'تعديل التكامل' : 'إضافة تكامل جديد'} onClose={() => { setModal(null); setEditItem(null); setIntegF({}); }}>
          <div className="space-y-3">
            <Inp label="الاسم (بالإنجليزية)" value={integF.name || ''} onChange={(v: string) => setIntegF({ ...integF, name: v })} required />
            <Inp label="الاسم المعروض" value={integF.display_name || ''} onChange={(v: string) => setIntegF({ ...integF, display_name: v })} />
            <Inp label="الوصف" value={integF.description || ''} onChange={(v: string) => setIntegF({ ...integF, description: v })} textarea />
            <div className="grid grid-cols-2 gap-3">
              <Sel label="النوع" value={integF.type || 'api'} onChange={(v: string) => setIntegF({ ...integF, type: v })} options={[
                { value: 'api', label: 'API' },
                { value: 'webhook', label: 'Webhook' },
                { value: 'oauth', label: 'OAuth' },
              ]} />
              <Sel label="الفئة" value={integF.category || 'other'} onChange={(v: string) => setIntegF({ ...integF, category: v })} options={[
                { value: 'payment', label: 'دفع' },
                { value: 'shipping', label: 'شحن' },
                { value: 'communication', label: 'تواصل' },
                { value: 'government', label: 'حكومية' },
                { value: 'notification', label: 'إشعارات' },
                { value: 'analytics', label: 'تحليلات' },
                { value: 'maps', label: 'خرائط' },
                { value: 'other', label: 'أخرى' },
              ]} />
            </div>
            <Inp label="مفتاح API" value={integF.api_key || ''} onChange={(v: string) => setIntegF({ ...integF, api_key: v })} />
            <Inp label="المفتاح السري" value={integF.api_secret || ''} onChange={(v: string) => setIntegF({ ...integF, api_secret: v })} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={integF.is_active !== false} onChange={e => setIntegF({ ...integF, is_active: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-300">نشط</span>
            </label>
            <div className="flex gap-2 pt-2">
              <Btn onClick={saveIntegration} disabled={saving}>{saving ? 'جاري الحفظ...' : editItem ? 'تحديث' : 'إضافة'}</Btn>
              <Btn variant="ghost" onClick={() => { setModal(null); setEditItem(null); setIntegF({}); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
