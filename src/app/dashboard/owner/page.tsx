'use client';
import { AlertTriangle, BadgeDollarSign, BarChart3, Bell, Bot, Building2, Check, CheckCircle, Coins, Headphones, Lock, Megaphone, Package, Pencil, Scale, School, Settings, ShoppingCart, Sparkles, Ticket, TrendingUp, Trophy, Users, X, Zap } from "lucide-react";
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import IconRenderer from "@/components/IconRenderer";

const GOLD = '#C9A84C';
const GOLD2 = '#E2C46A';
const BG = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';
const GREEN = '#10B981';
const RED = '#EF4444';
const BLUE = '#3B82F6';
const PURPLE = '#8B5CF6';

const TABS = [
  { id: 'overview',       label: 'نظرة عامة',          icon: "ICON_Building2" },
  { id: 'finance',        label: 'المالية والإيرادات',  icon: "ICON_Coins" },
  { id: 'institutions',   label: 'مراقبة المؤسسات',    icon: "ICON_School" },
  { id: 'taxes',          label: 'الضرائب السيادية',   icon: 'Scale️' },
  { id: 'subscriptions',  label: 'الاشتراكات والباقات', icon: "ICON_Package" },
  { id: 'ads',            label: 'الإعلانات السيادية',  icon: "ICON_Megaphone" },
  { id: 'coupons',        label: 'الكوبونات',           icon: "ICON_Ticket" },
  { id: 'store',          label: 'المتجر والعمولات',    icon: "ICON_ShoppingCart" },
  { id: 'notifications',  label: 'الإشعارات الجماعية', icon: "ICON_Bell" },
  { id: 'ai_auditor',     label: 'AI Auditor',          icon: "ICON_Bot" },
  { id: 'audit_log',      label: 'سجل الأمان',         icon: "ICON_Lock" },
  { id: 'support',        label: 'الدعم الفني',         icon: "ICON_Headphones" },
];

const StatCard = ({ title, value, sub, color, icon }: any) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
    border: `1px solid ${color}20`, borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`, borderRadius: '0 16px 0 0' }} />
    <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
    <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{title}</div>
    <div style={{ color: color, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value ?? '—'}</div>
    {sub && <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11, marginTop: 6 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ title, icon, desc }: any) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <h2 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 800, margin: 0 }}>{title}</h2>
    </div>
    {desc && <p style={{ color: 'rgba(238,238,245,0.45)', fontSize: 13, margin: 0, paddingRight: 32 }}>{desc}</p>}
  </div>
);

const Badge = ({ label, color }: any) => (
  <span style={{ background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{label}</span>
);

const Btn = ({ label, color, onClick, disabled }: any) => (
  <button disabled={disabled} onClick={onClick} style={{
    background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: 8,
    padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, transition: 'all 0.2s',
  }}>{label}</button>
);

const Toast = ({ msg, onClose }: any) => msg ? (
  <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', border: `1px solid ${GOLD}40`, borderRadius: 12, padding: '12px 24px', color: '#EEEEF5', fontSize: 13, fontWeight: 600, zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
    {msg} <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(238,238,245,0.4)', cursor: 'pointer', marginRight: 8 }}>[X]</button>
  </div>
) : null;

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // البيانات
  const [stats, setStats] = useState<any>({});
  const [schools, setSchools] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [taxes, setTaxes] = useState<any[]>([]);
  const [support, setSupport] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Forms
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'percentage', max_uses: '', expires_at: '' });
  const [notifForm, setNotifForm] = useState({ title: '', message: '', target: 'all' });
  const [adForm, setAdForm] = useState({ title: '', body: '', start_date: '', end_date: '' });
  const [planForm, setPlanForm] = useState({ name: '', price: '', student_limit: '', features: '' });

  const inputStyle: any = {
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8,
    padding: '10px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box',
  };
  const cellStyle: any = { padding: '12px 14px', borderBottom: `1px solid ${BORDER}`, color: 'rgba(238,238,245,0.75)', fontSize: 13 };
  const headStyle: any = { padding: '10px 14px', color: 'rgba(238,238,245,0.4)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1px solid ${BORDER}` };

  const getH = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const h = getH();
      const [statsR, schoolsR, joinR, plansR, couponsR, taxesR, supportR, auditR, adsR, commissionsR] = await Promise.all([
        fetch('/api/dashboard-stats', { headers: h }),
        fetch('/api/schools?limit=50', { headers: h }),
        fetch('/api/join-requests?status=pending&limit=20', { headers: h }),
        fetch('/api/plans', { headers: h }),
        fetch('/api/coupons', { headers: h }),
        fetch('/api/taxes', { headers: h }),
        fetch('/api/support?limit=20', { headers: h }),
        fetch('/api/activity-log?limit=20', { headers: h }),
        fetch('/api/advertisements', { headers: h }),
        fetch('/api/commissions?limit=10', { headers: h }),
      ]);
      const [statsD, schoolsD, joinD, plansD, couponsD, taxesD, supportD, auditD, adsD, commissionsD] = await Promise.all([
        statsR.json(), schoolsR.json(), joinR.json(), plansR.json(), couponsR.json(),
        taxesR.json(), supportR.json(), auditR.json(), adsR.json(), commissionsR.json(),
      ]);
      setStats(statsD || {});
      setSchools(Array.isArray(schoolsD) ? schoolsD : schoolsD?.schools || []);
      setJoinRequests(Array.isArray(joinD) ? joinD : joinD?.requests || []);
      setPlans(Array.isArray(plansD) ? plansD : plansD?.plans || []);
      setCoupons(Array.isArray(couponsD) ? couponsD : couponsD?.coupons || []);
      setTaxes(Array.isArray(taxesD) ? taxesD : taxesD?.taxes || []);
      setSupport(Array.isArray(supportD) ? supportD : supportD?.tickets || []);
      setAuditLog(Array.isArray(auditD) ? auditD : auditD?.logs || []);
      setAds(Array.isArray(adsD) ? adsD : adsD?.ads || []);
      setCommissions(Array.isArray(commissionsD) ? commissionsD : commissionsD?.commissions || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [getH]);

  useEffect(() => {
    const token = localStorage.getItem('matin_token');
    if (!token) { window.location.href = '/login'; return; }
    fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (!d.valid || d.user?.role !== 'super_admin') { window.location.href = '/login'; return; }
        loadAll();
      }).catch(() => { window.location.href = '/login'; });
  }, [loadAll]);

  // ===== Actions =====
  const handleJoinRequest = async (id: number, action: 'approve' | 'reject') => {
    try {
      const r = await fetch(`/api/join-requests`, { method: 'PUT', headers: getH(), body: JSON.stringify({ id, action }) });
      const d = await r.json();
      if (r.ok) { showToast(action === 'approve' ? 'تم قبول المؤسسة [Check]' : 'تم رفض المؤسسة'); loadAll(); }
      else showToast(d.error || 'فشل');
    } catch { showToast('خطأ في الشبكة'); }
  };

  const handleSchoolAction = async (id: number, action: 'freeze' | 'unfreeze') => {
    try {
      const r = await fetch(`/api/schools`, { method: 'PUT', headers: getH(), body: JSON.stringify({ id, status: action === 'freeze' ? 'frozen' : 'active' }) });
      if (r.ok) { showToast(action === 'freeze' ? 'تم تجميد المؤسسة' : 'تم إلغاء التجميد'); loadAll(); }
      else showToast('فشل');
    } catch { showToast('خطأ'); }
  };

  const handleCreateCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount) { showToast('أدخل الكود والخصم'); return; }
    try {
      const r = await fetch('/api/coupons', { method: 'POST', headers: getH(), body: JSON.stringify(newCoupon) });
      const d = await r.json();
      if (r.ok) { showToast('تم إنشاء الكوبون [Check]'); setNewCoupon({ code: '', discount: '', type: 'percentage', max_uses: '', expires_at: '' }); loadAll(); }
      else showToast(d.error || 'فشل');
    } catch { showToast('خطأ'); }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!confirm('حذف الكوبون؟')) return;
    try {
      const r = await fetch(`/api/coupons?id=${id}`, { method: 'DELETE', headers: getH() });
      if (r.ok) { showToast('تم حذف الكوبون'); loadAll(); }
    } catch { showToast('خطأ'); }
  };

  const handleCreatePlan = async () => {
    if (!planForm.name || !planForm.price) { showToast('أدخل اسم الباقة والسعر'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem?.type === 'plan' ? 'PUT' : 'POST';
      const url = editItem?.type === 'plan' ? `/api/plans?id=${editItem.id}` : '/api/plans';
      const r = await fetch(url, { method, headers: getH(), body: JSON.stringify(planForm) });
      const d = await r.json();
      if (r.ok) { showToast(method === 'PUT' ? 'تم تعديل الباقة Check' : 'تم إنشاء الباقة [Check]'); setPlanForm({ name: '', price: '', student_limit: '', features: '' }); setEditItem(null); loadAll(); }
      else { showToast(d.error || 'فشل'); setErrMsg(d.error || 'فشل'); }
    } catch (e: any) { showToast('خطأ'); setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const handleDeletePlan = async (id: number) => {
    if (!confirm('حذف الباقة؟')) return;
    try {
      const r = await fetch(`/api/plans?id=${id}`, { method: 'DELETE', headers: getH() });
      if (r.ok) { showToast('تم حذف الباقة'); loadAll(); }
    } catch { showToast('خطأ'); }
  };

  const handleCreateAd = async () => {
    if (!adForm.title || !adForm.body) { showToast('أدخل العنوان والنص'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem?.type === 'ad' ? 'PUT' : 'POST';
      const url = editItem?.type === 'ad' ? `/api/advertisements?id=${editItem.id}` : '/api/advertisements';
      const r = await fetch(url, { method, headers: getH(), body: JSON.stringify(adForm) });
      const d = await r.json();
      if (r.ok) { showToast(method === 'PUT' ? 'تم تعديل الإعلان Check' : 'تم نشر الإعلان [Check]'); setAdForm({ title: '', body: '', start_date: '', end_date: '' }); setEditItem(null); loadAll(); }
      else { showToast(d.error || 'فشل'); setErrMsg(d.error || 'فشل'); }
    } catch (e: any) { showToast('خطأ'); setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const handleDeleteAd = async (id: number) => {
    if (!confirm('حذف الإعلان؟')) return;
    try {
      const r = await fetch(`/api/advertisements?id=${id}`, { method: 'DELETE', headers: getH() });
      if (r.ok) { showToast('تم حذف الإعلان'); loadAll(); }
    } catch { showToast('خطأ'); }
  };

  const handleSendNotification = async () => {
    if (!notifForm.message) { showToast('أدخل نص الإشعار'); return; }
    try {
      const r = await fetch('/api/push-notifications', { method: 'POST', headers: getH(), body: JSON.stringify(notifForm) });
      const d = await r.json();
      if (r.ok) { showToast('تم إرسال الإشعار Check'); setNotifForm({ title: '', message: '', target: 'all' }); }
      else showToast(d.error || 'فشل');
    } catch { showToast('خطأ'); }
  };

  const handleSupportReply = async (id: number) => {
    const reply = prompt('اكتب الرد:');
    if (!reply) return;
    try {
      const r = await fetch('/api/support', { method: 'PUT', headers: getH(), body: JSON.stringify({ id, reply, status: 'in_progress' }) });
      if (r.ok) { showToast('تم إرسال الرد [Check]'); loadAll(); }
    } catch { showToast('خطأ'); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: BG }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${GOLD}20`, borderTopColor: GOLD, animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 13, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>جاري التحميل...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif", direction: 'rtl' }}>
      <Toast msg={toast} onClose={() => setToast('')} />

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${BORDER}`, padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: BG }}>م</div>
          <div>
            <div style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 800 }}>لوحة مالك المنصة</div>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 600 }}>السلطة السيادية المطلقة</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600 }}>● النظام يعمل</div>
          <Link href="/dashboard" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(238,238,245,0.6)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 14px', fontSize: 12, textDecoration: 'none' }}>الرئيسية</Link>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: 'rgba(255,255,255,0.015)', borderLeft: `1px solid ${BORDER}`, padding: '20px 0', flexShrink: 0, position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width: '100%', textAlign: 'right', padding: '11px 20px',
              background: activeTab === tab.id ? `${GOLD}12` : 'transparent',
              borderRight: activeTab === tab.id ? `3px solid ${GOLD}` : '3px solid transparent',
              border: 'none', borderLeft: 'none',
              color: activeTab === tab.id ? GOLD : 'rgba(238,238,245,0.55)',
              fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
            }}>
              <span><IconRenderer name={tab.icon} /></span><span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          {/* ===== نظرة عامة ===== */}
          {activeTab === 'overview' && (
            <div>
              <SectionTitle title="نظرة عامة" icon="ICON_Building2" desc="إحصائيات شاملة للمنصة — تتحدث تلقائياً من قاعدة البيانات" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                <StatCard title="إجمالي المؤسسات" value={stats.total_schools ?? schools.length} sub="مؤسسة مسجلة" color={GOLD} icon="ICON_School" />
                <StatCard title="إجمالي المستخدمين" value={stats.total_users ?? '—'} sub="مستخدم نشط" color={BLUE} icon="ICON_Users" />
                <StatCard title="الإيرادات الشهرية" value={stats.monthly_revenue ? `${stats.monthly_revenue} ر.س` : '—'} color={GREEN} icon="ICON_Coins" />
                <StatCard title="طلبات انتظار" value={joinRequests.length} sub="تحتاج مراجعة" color="#F59E0B" icon="⏳" />
                <StatCard title="الضرائب السيادية" value={stats.total_taxes ? `${stats.total_taxes} ر.س` : '—'} sub="هذا الشهر" color={PURPLE} icon="[Scale]️" />
                <StatCard title="تذاكر دعم مفتوحة" value={support.filter((s: any) => s.status === 'open').length} color={RED} icon="ICON_Headphones" />
              </div>

              {/* طلبات الانضمام المعلقة */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <SectionTitle title="طلبات الانضمام المعلقة" icon="⏳" desc="مؤسسات تنتظر القبول أو الرفض" />
                {joinRequests.length === 0 ? (
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>لا توجد طلبات معلقة</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr>
                        <th style={headStyle}>المؤسسة</th>
                        <th style={headStyle}>النوع</th>
                        <th style={headStyle}>الباقة</th>
                        <th style={headStyle}>تاريخ الطلب</th>
                        <th style={headStyle}>الإجراء</th>
                      </tr></thead>
                      <tbody>
                        {joinRequests.map((r: any) => (
                          <tr key={r.id}>
                            <td style={cellStyle}>{r.school_name || r.name}</td>
                            <td style={cellStyle}>{r.school_type || r.type || '—'}</td>
                            <td style={cellStyle}><Badge label={r.plan || 'أساسية'} color={GOLD} /></td>
                            <td style={cellStyle}>{r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : '—'}</td>
                            <td style={cellStyle}>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <Btn label="قبول" color={GREEN} onClick={() => handleJoinRequest(r.id, 'approve')} />
                                <Btn label="رفض" color={RED} onClick={() => handleJoinRequest(r.id, 'reject')} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== المالية والإيرادات ===== */}
          {activeTab === 'finance' && (
            <div>
              <SectionTitle title="المالية والإيرادات" icon="ICON_Coins" desc="إجمالي الإيرادات والمتأخرات" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <StatCard title="إيرادات هذا الشهر" value={stats.monthly_revenue ? `${stats.monthly_revenue} ر.س` : '—'} color={GREEN} icon="ICON_TrendingUp" />
                <StatCard title="إيرادات هذا العام" value={stats.yearly_revenue ? `${stats.yearly_revenue} ر.س` : '—'} color={GOLD} icon="ICON_Trophy" />
                <StatCard title="المتأخرات" value={stats.overdue_amount ? `${stats.overdue_amount} ر.س` : '—'} color={RED} icon="[AlertTriangle]️" />
                <StatCard title="عمولات المتاجر" value={stats.store_commissions ? `${stats.store_commissions} ر.س` : '—'} color={PURPLE} icon="ICON_ShoppingCart" />
              </div>

              {/* المؤسسات المتأخرة */}
              <div style={{ background: CARD, border: `1px solid ${RED}20`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>المؤسسات المتأخرة عن الدفع</h3>
                {schools.filter((s: any) => s.payment_status === 'overdue' || s.days_late > 0).length === 0 ? (
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>لا توجد مؤسسات متأخرة</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                      <th style={headStyle}>المؤسسة</th>
                      <th style={headStyle}>الباقة</th>
                      <th style={headStyle}>أيام التأخير</th>
                      <th style={headStyle}>الإجراء</th>
                    </tr></thead>
                    <tbody>
                      {schools.filter((s: any) => s.payment_status === 'overdue' || s.days_late > 0).map((s: any) => (
                        <tr key={s.id}>
                          <td style={cellStyle}>{s.name_ar || s.name}</td>
                          <td style={cellStyle}><Badge label={s.plan || 'أساسية'} color={GOLD} /></td>
                          <td style={cellStyle}><span style={{ color: (s.days_late || 0) > 30 ? RED : '#F59E0B', fontWeight: 700 }}>{s.days_late || 0} يوم</span></td>
                          <td style={cellStyle}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <Btn label="إرسال تذكير" color={GOLD} onClick={() => showToast('تم إرسال التذكير')} />
                              {(s.days_late || 0) > 30 && <Btn label="تجميد" color={RED} onClick={() => handleSchoolAction(s.id, 'freeze')} />}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <Link href="/dashboard/reports" style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30`, borderRadius: 10, padding: '12px 24px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>[BarChart3] تقارير مالية</Link>
                <Link href="/dashboard/taxes" style={{ background: `${PURPLE}15`, color: PURPLE, border: `1px solid ${PURPLE}30`, borderRadius: 10, padding: '12px 24px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Scale️ الضرائب التفصيلية</Link>
              </div>
            </div>
          )}

          {/* ===== مراقبة المؤسسات ===== */}
          {activeTab === 'institutions' && (
            <div>
              <SectionTitle title="مراقبة المؤسسات" icon="ICON_School" desc="جميع المؤسسات المسجلة في المنصة" />
              {schools.length === 0 ? (
                <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>لا توجد مؤسسات</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                      <th style={headStyle}>المؤسسة</th>
                      <th style={headStyle}>النوع</th>
                      <th style={headStyle}>الباقة</th>
                      <th style={headStyle}>الطلاب</th>
                      <th style={headStyle}>الحالة</th>
                      <th style={headStyle}>الإجراءات</th>
                    </tr></thead>
                    <tbody>
                      {schools.map((s: any) => (
                        <tr key={s.id}>
                          <td style={cellStyle}><span style={{ color: '#EEEEF5', fontWeight: 600 }}>{s.name_ar || s.name}</span></td>
                          <td style={cellStyle}>{s.school_type || s.type || '—'}</td>
                          <td style={cellStyle}><Badge label={s.plan || 'أساسية'} color={GOLD} /></td>
                          <td style={cellStyle}>{s.student_count ?? '—'}</td>
                          <td style={cellStyle}><Badge label={s.status === 'active' ? 'نشط' : s.status === 'pending' ? 'معلق' : 'مجمد'} color={s.status === 'active' ? GREEN : s.status === 'pending' ? '#F59E0B' : RED} /></td>
                          <td style={cellStyle}>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {s.status === 'pending' && <Btn label="قبول" color={GREEN} onClick={() => handleSchoolAction(s.id, 'unfreeze')} />}
                              {s.status !== 'frozen' && <Btn label="تجميد" color={RED} onClick={() => handleSchoolAction(s.id, 'freeze')} />}
                              {s.status === 'frozen' && <Btn label="إلغاء التجميد" color={BLUE} onClick={() => handleSchoolAction(s.id, 'unfreeze')} />}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===== الضرائب السيادية ===== */}
          {activeTab === 'taxes' && (
            <div>
              <SectionTitle title="الضرائب السيادية" icon="[Scale]️" desc="استقطاع نسبة مئوية آلية من كل عملية مالية" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <StatCard title="الضريبة هذا الشهر" value={stats.monthly_tax ? `${stats.monthly_tax} ر.س` : '—'} color={GOLD} icon="ICON_Zap" />
                <StatCard title="الضريبة هذا العام" value={stats.yearly_tax ? `${stats.yearly_tax} ر.س` : '—'} color={PURPLE} icon="ICON_BarChart3" />
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>سجل الضرائب</h3>
                {taxes.length === 0 ? (
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>لا توجد سجلات ضريبية</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                      <th style={headStyle}>المؤسسة</th>
                      <th style={headStyle}>نوع العملية</th>
                      <th style={headStyle}>المبلغ</th>
                      <th style={headStyle}>الضريبة</th>
                      <th style={headStyle}>التاريخ</th>
                    </tr></thead>
                    <tbody>
                      {taxes.map((t: any) => (
                        <tr key={t.id}>
                          <td style={cellStyle}>{t.school_name || t.school_id}</td>
                          <td style={cellStyle}>{t.transaction_type || t.type}</td>
                          <td style={cellStyle}>{t.amount} ر.س</td>
                          <td style={{ ...cellStyle, color: GOLD, fontWeight: 700 }}>{t.tax_amount} ر.س</td>
                          <td style={cellStyle}>{t.created_at ? new Date(t.created_at).toLocaleDateString('ar-SA') : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <Link href="/dashboard/taxes" style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>[Scale]️ إدارة الضرائب التفصيلية</Link>
            </div>
          )}

          {/* ===== الاشتراكات والباقات ===== */}
          {activeTab === 'subscriptions' && (
            <div>
              <SectionTitle title="الاشتراكات والباقات" icon="ICON_Package" desc="إنشاء وتعديل الباقات والحدود والأسعار" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginBottom: 28 }}>
                {plans.map((plan: any) => (
                  <div key={plan.id} style={{ background: `${GOLD}06`, border: `1px solid ${GOLD}20`, borderRadius: 16, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ color: GOLD, fontSize: 16, fontWeight: 800 }}>{plan.name}</div>
                        <div style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, marginTop: 4 }}>{plan.price} ر.س/شهر</div>
                      </div>
                      <Badge label={`${plan.school_count || 0} مؤسسة`} color={GOLD} />
                    </div>
                    <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, marginBottom: 8 }}>الحد: {plan.student_limit || 'غير محدود'} طالب</div>
                    {plan.features && <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, marginBottom: 16 }}>{plan.features}</div>}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Btn label="تعديل" color={GOLD} onClick={() => { setEditItem({ type: 'plan', id: plan.id }); setPlanForm({ name: plan.name, price: plan.price, student_limit: plan.student_limit || '', features: plan.features || '' }); }} />
                      <Btn label="حذف" color={RED} onClick={() => handleDeletePlan(plan.id)} />
                    </div>
                  </div>
                ))}
                {plans.length === 0 && <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 13 }}>لا توجد باقات مسجلة</div>}
              </div>

              <div style={{ background: CARD, border: `1px solid ${GOLD}20`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: GOLD, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>إنشاء باقة جديدة</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>اسم الباقة</label>
                    <input value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} placeholder="مثال: ذهبية خاصة" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>السعر الشهري (ر.س)</label>
                    <input value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: e.target.value })} placeholder="مثال: 1500" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>حد الطلاب</label>
                    <input value={planForm.student_limit} onChange={e => setPlanForm({ ...planForm, student_limit: e.target.value })} placeholder="مثال: 2000" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>المميزات</label>
                    <input value={planForm.features} onChange={e => setPlanForm({ ...planForm, features: e.target.value })} placeholder="مثال: AI + متجر + تقارير" style={inputStyle} />
                  </div>
                </div>
                <Btn label={saving ? 'جاري الحفظ...' : editItem?.type === 'plan' ? 'Pencil️ تعديل الباقة' : '[Sparkles] إنشاء الباقة'} color={GOLD} onClick={handleCreatePlan} disabled={saving} />
              </div>
            </div>
          )}

          {/* ===== الإعلانات السيادية ===== */}
          {activeTab === 'ads' && (
            <div>
              <SectionTitle title="الإعلانات السيادية" icon="ICON_Megaphone" desc="إعلانات متين الرسمية تظهر في جميع لوحات التحكم" />
              <div style={{ background: CARD, border: `1px solid ${GOLD}20`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: GOLD, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>إنشاء إعلان سيادي جديد</h3>
                <div style={{ display: 'grid', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>عنوان الإعلان</label>
                    <input value={adForm.title} onChange={e => setAdForm({ ...adForm, title: e.target.value })} placeholder="مثال: تحديث جديد في منصة متين" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>نص الإعلان</label>
                    <textarea value={adForm.body} onChange={e => setAdForm({ ...adForm, body: e.target.value })} placeholder="نص الإعلان..." style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>تاريخ البدء</label>
                      <input type="date" value={adForm.start_date} onChange={e => setAdForm({ ...adForm, start_date: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>تاريخ الانتهاء</label>
                      <input type="date" value={adForm.end_date} onChange={e => setAdForm({ ...adForm, end_date: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                </div>
                <Btn label={saving ? 'جاري الحفظ...' : editItem?.type === 'ad' ? 'Pencil️ تعديل الإعلان' : '[Megaphone] نشر الإعلان السيادي'} color={GOLD} onClick={handleCreateAd} disabled={saving} />
              </div>

              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>الإعلانات الحالية</h3>
                {ads.length === 0 ? (
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>لا توجد إعلانات</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                      <th style={headStyle}>العنوان</th>
                      <th style={headStyle}>تاريخ البدء</th>
                      <th style={headStyle}>تاريخ الانتهاء</th>
                      <th style={headStyle}>الحالة</th>
                      <th style={headStyle}>إجراء</th>
                    </tr></thead>
                    <tbody>
                      {ads.map((ad: any) => (
                        <tr key={ad.id}>
                          <td style={cellStyle}>{ad.title}</td>
                          <td style={cellStyle}>{ad.start_date ? new Date(ad.start_date).toLocaleDateString('ar-SA') : '—'}</td>
                          <td style={cellStyle}>{ad.end_date ? new Date(ad.end_date).toLocaleDateString('ar-SA') : '—'}</td>
                          <td style={cellStyle}><Badge label={ad.is_active ? 'نشط' : 'غير نشط'} color={ad.is_active ? GREEN : RED} /></td>
                          <td style={cellStyle}><div style={{ display: 'flex', gap: 6 }}><Btn label="تعديل" color={GOLD} onClick={() => { setEditItem({ type: 'ad', id: ad.id }); setAdForm({ title: ad.title, body: ad.body, start_date: ad.start_date || '', end_date: ad.end_date || '' }); }} /><Btn label="حذف" color={RED} onClick={() => handleDeleteAd(ad.id)} /></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ===== الكوبونات ===== */}
          {activeTab === 'coupons' && (
            <div>
              <SectionTitle title="الكوبونات" icon="ICON_Ticket" desc="إنشاء كودات خصم للمؤسسات" />
              <div style={{ background: CARD, border: `1px solid ${GOLD}20`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: GOLD, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>إنشاء كوبون جديد</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>كود الخصم</label>
                    <input value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="MATIN20" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>قيمة الخصم</label>
                    <input value={newCoupon.discount} onChange={e => setNewCoupon({ ...newCoupon, discount: e.target.value })} placeholder="20" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>نوع الخصم</label>
                    <select value={newCoupon.type} onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value })} style={inputStyle}>
                      <option value="percentage">نسبة (%)</option>
                      <option value="fixed">مبلغ ثابت (ر.س)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>الحد الأقصى للاستخدام</label>
                    <input value={newCoupon.max_uses} onChange={e => setNewCoupon({ ...newCoupon, max_uses: e.target.value })} placeholder="100" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>تاريخ الانتهاء</label>
                    <input type="date" value={newCoupon.expires_at} onChange={e => setNewCoupon({ ...newCoupon, expires_at: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <Btn label="[Ticket] إنشاء الكوبون" color={GOLD} onClick={handleCreateCoupon} />
              </div>

              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>الكوبونات الحالية</h3>
                {coupons.length === 0 ? (
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>لا توجد كوبونات</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                      <th style={headStyle}>الكود</th>
                      <th style={headStyle}>الخصم</th>
                      <th style={headStyle}>الاستخدام</th>
                      <th style={headStyle}>الانتهاء</th>
                      <th style={headStyle}>الحالة</th>
                      <th style={headStyle}>إجراء</th>
                    </tr></thead>
                    <tbody>
                      {coupons.map((c: any) => (
                        <tr key={c.id}>
                          <td style={{ ...cellStyle, color: GOLD, fontWeight: 700, fontFamily: 'monospace' }}>{c.code}</td>
                          <td style={cellStyle}>{c.discount}{c.type === 'percentage' ? '%' : ' ر.س'}</td>
                          <td style={cellStyle}>{c.used_count || 0} / {c.max_uses || '∞'}</td>
                          <td style={cellStyle}>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('ar-SA') : '—'}</td>
                          <td style={cellStyle}><Badge label={c.is_active ? 'نشط' : 'منتهي'} color={c.is_active ? GREEN : RED} /></td>
                          <td style={cellStyle}><Btn label="حذف" color={RED} onClick={() => handleDeleteCoupon(c.id)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ===== المتجر والعمولات ===== */}
          {activeTab === 'store' && (
            <div>
              <SectionTitle title="المتجر والعمولات" icon="ICON_ShoppingCart" desc="الإشراف على متاجر المؤسسات وعمولات المبيعات" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <StatCard title="عمولات هذا الشهر" value={stats.store_commissions ? `${stats.store_commissions} ر.س` : '—'} color={GREEN} icon="ICON_BadgeDollarSign" />
                <StatCard title="إجمالي المبيعات" value={stats.total_sales ? `${stats.total_sales} ر.س` : '—'} color={BLUE} icon="ICON_BarChart3" />
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>أحدث العمولات</h3>
                {commissions.length === 0 ? (
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>لا توجد عمولات</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                      <th style={headStyle}>المؤسسة</th>
                      <th style={headStyle}>المبيعات</th>
                      <th style={headStyle}>العمولة</th>
                      <th style={headStyle}>التاريخ</th>
                    </tr></thead>
                    <tbody>
                      {commissions.map((c: any) => (
                        <tr key={c.id}>
                          <td style={cellStyle}>{c.school_name || c.school_id}</td>
                          <td style={cellStyle}>{c.sale_amount} ر.س</td>
                          <td style={{ ...cellStyle, color: GOLD, fontWeight: 700 }}>{c.commission_amount} ر.س</td>
                          <td style={cellStyle}>{c.created_at ? new Date(c.created_at).toLocaleDateString('ar-SA') : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ===== الإشعارات الجماعية ===== */}
          {activeTab === 'notifications' && (
            <div>
              <SectionTitle title="الإشعارات الجماعية" icon="ICON_Bell" desc="إرسال إشعارات لجميع المستخدمين أو فئة محددة" />
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>إرسال إشعار جماعي</h3>
                <div style={{ display: 'grid', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>عنوان الإشعار</label>
                    <input value={notifForm.title} onChange={e => setNotifForm({ ...notifForm, title: e.target.value })} placeholder="عنوان الإشعار" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>المستهدفون</label>
                    <select value={notifForm.target} onChange={e => setNotifForm({ ...notifForm, target: e.target.value })} style={inputStyle}>
                      <option value="all">جميع المستخدمين</option>
                      <option value="owners">مالكو المؤسسات</option>
                      <option value="teachers">المعلمون</option>
                      <option value="students">الطلاب</option>
                      <option value="parents">أولياء الأمور</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>نص الإشعار</label>
                    <textarea value={notifForm.message} onChange={e => setNotifForm({ ...notifForm, message: e.target.value })} placeholder="اكتب نص الإشعار هنا..." style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
                  </div>
                  <Btn label="[Bell] إرسال الإشعار" color={GOLD} onClick={handleSendNotification} />
                </div>
              </div>
            </div>
          )}

          {/* ===== AI Auditor ===== */}
          {activeTab === 'ai_auditor' && (
            <div>
              <SectionTitle title="AI Auditor — المفتش الرقمي الآلي" icon="ICON_Bot" desc="ذكاء اصطناعي يراقب السجلات والدرجات والحضور" />
              <div style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}20`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>[Bot]</div>
                <div style={{ color: '#EEEEF5', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>AI Auditor</div>
                <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 13, marginBottom: 20 }}>نظام المراقبة الذكي يعمل في الخلفية ويرصد الأنماط المشبوهة تلقائياً</div>
                <Link href="/dashboard/super-admin/platform-settings" style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30`, borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>إعدادات AI Auditor</Link>
              </div>
            </div>
          )}

          {/* ===== سجل الأمان ===== */}
          {activeTab === 'audit_log' && (
            <div>
              <SectionTitle title="سجل الأمان — Audit Log" icon="ICON_Lock" desc="كل حركة في النظام موثقة — غير قابل للحذف" />
              <div style={{ background: `${RED}06`, border: `1px solid ${RED}15`, borderRadius: 12, padding: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>[Lock]</span>
                <span style={{ color: 'rgba(238,238,245,0.7)', fontSize: 13 }}>هذا السجل محمي ومشفر — لا يمكن لأي مستخدم حذف أو تعديل أي سجل</span>
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                {auditLog.length === 0 ? (
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>لا توجد سجلات</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                      <th style={headStyle}>الوقت</th>
                      <th style={headStyle}>المستخدم</th>
                      <th style={headStyle}>الإجراء</th>
                      <th style={headStyle}>الهدف</th>
                    </tr></thead>
                    <tbody>
                      {auditLog.map((log: any) => (
                        <tr key={log.id}>
                          <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: 12 }}>{log.created_at ? new Date(log.created_at).toLocaleString('ar-SA') : '—'}</td>
                          <td style={cellStyle}>{log.user_name || log.user_id || 'system'}</td>
                          <td style={cellStyle}>{log.action || log.activity_type}</td>
                          <td style={cellStyle}>{log.target || log.description || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ===== الدعم الفني ===== */}
          {activeTab === 'support' && (
            <div>
              <SectionTitle title="الدعم الفني" icon="ICON_Headphones" desc="تذاكر الدعم من المؤسسات" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <StatCard title="تذاكر مفتوحة" value={support.filter((s: any) => s.status === 'open').length} color={RED} icon="ICON_Ticket" />
                <StatCard title="قيد المعالجة" value={support.filter((s: any) => s.status === 'in_progress').length} color="#F59E0B" icon="[Settings]️" />
                <StatCard title="محلولة" value={support.filter((s: any) => s.status === 'resolved').length} color={GREEN} icon="ICON_CheckCircle" />
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                {support.length === 0 ? (
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>لا توجد تذاكر</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>
                      <th style={headStyle}>#</th>
                      <th style={headStyle}>المؤسسة</th>
                      <th style={headStyle}>الموضوع</th>
                      <th style={headStyle}>الأولوية</th>
                      <th style={headStyle}>الحالة</th>
                      <th style={headStyle}>إجراء</th>
                    </tr></thead>
                    <tbody>
                      {support.map((ticket: any) => (
                        <tr key={ticket.id}>
                          <td style={{ ...cellStyle, color: GOLD, fontWeight: 700 }}>#{ticket.id}</td>
                          <td style={cellStyle}>{ticket.school_name || ticket.school_id || '—'}</td>
                          <td style={cellStyle}>{ticket.subject || ticket.title}</td>
                          <td style={cellStyle}>
                            <Badge label={ticket.priority === 'high' ? 'عاجل' : ticket.priority === 'medium' ? 'متوسط' : 'منخفض'} color={ticket.priority === 'high' ? RED : ticket.priority === 'medium' ? '#F59E0B' : GREEN} />
                          </td>
                          <td style={cellStyle}>
                            <Badge label={ticket.status === 'open' ? 'مفتوح' : ticket.status === 'in_progress' ? 'قيد المعالجة' : 'محلول'} color={ticket.status === 'open' ? RED : ticket.status === 'in_progress' ? '#F59E0B' : GREEN} />
                          </td>
                          <td style={cellStyle}><Btn label="رد" color={GOLD} onClick={() => handleSupportReply(ticket.id)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
