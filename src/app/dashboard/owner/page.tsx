'use client';
export const dynamic = 'force-dynamic';
import { Activity, AlertTriangle, ArrowDown, ArrowUp, Award, BadgeDollarSign, Banknote, BarChart3, Bell, Bot, Building2, Calendar, Check, CheckCircle, ChevronDown, ChevronRight, Clock, Coins, CreditCard, Crown, DollarSign, Download, ExternalLink, Eye, FileText, Filter, Flag, Globe, Hash, Headphones, Layers, Link, Lock, Mail, MapPin, Megaphone, Minus, MoreVertical, Package, Pencil, Percent, Phone, PieChart, Plus, RefreshCw, Scale, School, Search, Settings, Shield, ShoppingCart, Sparkles, Star, Target, Ticket, Trash2, TrendingUp, Trophy, Upload, Users, X, Zap } from "lucide-react";
import { useEffect, useState, useCallback } from 'react';
import NextLink from 'next/link';
import IconRenderer from "@/components/IconRenderer";

/* ═══════════════════════════════════════════════════
 MATIN OWNER DASHBOARD — Design System v7
 Primary: #D4A843 (Gold) Secondary: #10B981 (Green)
 Background: #06060E Cards: rgba(255,255,255,0.03)
 Font: Cairo / IBM Plex Sans Arabic
 Direction: RTL
═══════════════════════════════════════════════════ */

const G = '#D4A843'; // Gold
const G2 = '#E2C46A'; // Gold Light
const BG='var(--bg)'; // Deep Black
const BG2 = '#0D0D1A'; // Card BG
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT = '#EEEEF5';
const TEXT2 = 'rgba(238,238,245,0.55)';
const TEXT3 = 'rgba(238,238,245,0.35)';
const GREEN = '#10B981';
const RED = '#EF4444';
const BLUE = '#3B82F6';
const PURPLE = '#8B5CF6';
const AMBER = '#F59E0B';

const TABS = [
 { id: 'overview', label: 'نظرة عامة', Icon: Building2 },
 { id: 'finance', label: 'المالية والإيرادات', Icon: Coins },
 { id: 'institutions', label: 'مراقبة المؤسسات', Icon: School },
 { id: 'taxes', label: 'الضرائب السيادية', Icon: Scale },
 { id: 'subscriptions', label: 'الاشتراكات والباقات', Icon: Package },
 { id: 'ads', label: 'الإعلانات السيادية', Icon: Megaphone },
 { id: 'coupons', label: 'الكوبونات', Icon: Ticket },
 { id: 'store', label: 'المتجر والعمولات', Icon: ShoppingCart },
 { id: 'notifications', label: 'الإشعارات الجماعية', Icon: Bell },
 { id: 'ai_auditor', label: 'AI Auditor', Icon: Bot },
 { id: 'audit_log', label: 'سجل الأمان', Icon: Lock },
 { id: 'support', label: 'الدعم الفني', Icon: Headphones },
];

/* ─── Reusable Components ─── */

const StatCard = ({ title, value, sub, color, Icon: IconComp }: any) => (
 <div style={{
 background: `linear-gradient(135deg, ${color}0A 0%, ${color}04 100%)`,
 border: `1px solid ${color}22`,
 borderRadius: 16,
 padding: '20px 22px',
 position: 'relative',
 overflow: 'hidden',
 transition: 'all 0.25s',
 }}>
 <div style={{
 position: 'absolute', top: -20, left: -20,
 width: 100, height: 100,
 background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
 borderRadius: '50%',
 }} />
 <div style={{
 width: 44, height: 44, borderRadius: 12,
 background: `${color}18`,
 border: `1px solid ${color}30`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 marginBottom: 14,
 }}>
 {IconComp && <IconComp size={20} color={color} />}
 </div>
 <div style={{ color: TEXT3, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3 }}>{title}</div>
 <div style={{ color, fontSize: 26, fontWeight: 800, lineHeight: 1, letterSpacing: -0.5 }}>{value ?? '—'}</div>
 {sub && <div style={{ color: TEXT3, fontSize: 11, marginTop: 6 }}>{sub}</div>}
 </div>
);

const SectionHeader = ({ title, Icon: IconComp, desc, color = G }: any) => (
 <div style={{ marginBottom: 24 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
 <div style={{
 width: 38, height: 38, borderRadius: 10,
 background: `${color}18`,
 border: `1px solid ${color}30`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 flexShrink: 0,
 }}>
 {IconComp && <IconComp size={18} color={color} />}
 </div>
 <h2 style={{ color: TEXT, fontSize: 18, fontWeight: 800, margin: 0 }}>{title}</h2>
 </div>
 {desc && <p style={{ color: TEXT3, fontSize: 13, margin: 0, paddingRight: 50 }}>{desc}</p>}
 </div>
);

const Badge = ({ label, color }: any) => (
 <span style={{
 background: `${color}15`, color,
 border: `1px solid ${color}30`,
 borderRadius: 6, padding: '3px 10px',
 fontSize: 11, fontWeight: 700,
 display: 'inline-flex', alignItems: 'center', gap: 4,
 }}>{label}</span>
);

const Btn = ({ label, color, onClick, disabled, Icon: IconComp, size = 'sm' }: any) => (
 <button
 disabled={disabled}
 onClick={onClick}
 style={{
 background: `${color}12`,
 color,
 border: `1px solid ${color}30`,
 borderRadius: 8,
 padding: size === 'md' ? '10px 20px' : '6px 14px',
 fontSize: size === 'md' ? 13 : 12,
 fontWeight: 600,
 cursor: disabled ? 'not-allowed' : 'pointer',
 opacity: disabled ? 0.5 : 1,
 transition: 'all 0.2s',
 display: 'inline-flex',
 alignItems: 'center',
 gap: 6,
 fontFamily: "'Cairo', sans-serif",
 }}
 >
 {IconComp && <IconComp size={14} />}
 {label}
 </button>
);

const GoldBtn = ({ label, onClick, disabled, Icon: IconComp }: any) => (
 <button
 disabled={disabled}
 onClick={onClick}
 style={{
 background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)`,
 color: BG,
 border: 'none',
 borderRadius: 10,
 padding: '10px 22px',
 fontSize: 13,
 fontWeight: 700,
 cursor: disabled ? 'not-allowed' : 'pointer',
 opacity: disabled ? 0.6 : 1,
 transition: 'all 0.25s',
 display: 'inline-flex',
 alignItems: 'center',
 gap: 8,
 fontFamily: "'Cairo', sans-serif",
 boxShadow: `0 4px 20px ${G}30`,
 }}
 >
 {IconComp && <IconComp size={15} />}
 {label}
 </button>
);

const Toast = ({ msg, onClose }: any) => msg ? (
 <div style={{
 position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
 background: BG2, border: `1px solid ${G}40`,
 borderRadius: 12, padding: '12px 24px',
 color: TEXT, fontSize: 13, fontWeight: 600,
 zIndex: 9999, boxShadow: `0 8px 40px rgba(0,0,0,0.6)`,
 display: 'flex', alignItems: 'center', gap: 12,
 backdropFilter: 'blur(20px)',
 }}>
 <CheckCircle size={16} color={GREEN} />
 {msg}
 <button onClick={onClose} style={{ background: 'none', border: 'none', color: TEXT3, cursor: 'pointer', padding: 0, display: 'flex' }}>
 <X size={14} />
 </button>
 </div>
) : null;

const inputStyle: any = {
 background: 'var(--bg-card)',
 border: `1px solid ${BORDER}`,
 borderRadius: 8,
 padding: '10px 14px',
 color: TEXT,
 fontSize: 13,
 outline: 'none',
 width: '100%',
 boxSizing: 'border-box',
 fontFamily: "'Cairo', sans-serif",
 transition: 'border-color 0.2s',
};

const cellStyle: any = {
 padding: '13px 16px',
 borderBottom: `1px solid rgba(255,255,255,0.04)`,
 color: TEXT2,
 fontSize: 13,
};

const headStyle: any = {
 padding: '11px 16px',
 color: TEXT3,
 fontSize: 11,
 fontWeight: 700,
 textTransform: 'uppercase' as any,
 letterSpacing: 0.8,
 borderBottom: `1px solid ${BORDER}`,
 background: 'rgba(255,255,255,0.02)',
 textAlign: 'right' as any,
};

/* ─── Main Component ─── */

export default function OwnerDashboard() {
 const [activeTab, setActiveTab] = useState('overview');
 const [toast, setToast] = useState('');
 const [saving, setSaving] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [loading, setLoading] = useState(false);

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

 const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'percentage', max_uses: '', expires_at: '' });
 const [notifForm, setNotifForm] = useState({ title: '', message: '', target: 'all' });
 const [adForm, setAdForm] = useState({ title: '', body: '', start_date: '', end_date: '' });
 const [planForm, setPlanForm] = useState({ name: '', price: '', student_limit: '', features: '' });

 const getH = useCallback(() => {
 const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
 return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
 }, []);

 const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

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

 /* ─── Actions (unchanged logic) ─── */
 const handleJoinRequest = async (id: number, action: 'approve' | 'reject') => {
 try {
 const r = await fetch(`/api/join-requests`, { method: 'PUT', headers: getH(), body: JSON.stringify({ id, action }) });
 const d = await r.json();
 if (r.ok) { showToast(action === 'approve' ? 'تم قبول المؤسسة بنجاح' : 'تم رفض المؤسسة'); loadAll(); }
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
 if (r.ok) { showToast('تم إنشاء الكوبون بنجاح'); setNewCoupon({ code: '', discount: '', type: 'percentage', max_uses: '', expires_at: '' }); loadAll(); }
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
 if (r.ok) { showToast(method === 'PUT' ? 'تم تعديل الباقة' : 'تم إنشاء الباقة'); setPlanForm({ name: '', price: '', student_limit: '', features: '' }); setEditItem(null); loadAll(); }
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
 if (r.ok) { showToast(method === 'PUT' ? 'تم تعديل الإعلان' : 'تم نشر الإعلان'); setAdForm({ title: '', body: '', start_date: '', end_date: '' }); setEditItem(null); loadAll(); }
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
 if (r.ok) { showToast('تم إرسال الإشعار بنجاح'); setNotifForm({ title: '', message: '', target: 'all' }); }
 else showToast(d.error || 'فشل');
 } catch { showToast('خطأ'); }
 };

 const handleSupportReply = async (id: number) => {
 const reply = prompt('اكتب الرد:');
 if (!reply) return;
 try {
 const r = await fetch('/api/support', { method: 'PUT', headers: getH(), body: JSON.stringify({ id, reply, status: 'in_progress' }) });
 if (r.ok) { showToast('تم إرسال الرد'); loadAll(); }
 } catch { showToast('خطأ'); }
 };

 /* ─── Loading State ─── */
 if (loading) return (
 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: BG }}>
 <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
 <div style={{ textAlign: 'center' }}>
 <div style={{
 width: 52, height: 52, borderRadius: '50%',
 border: `3px solid ${G}20`, borderTopColor: G,
 animation: 'spin 0.8s linear infinite',
 margin: '0 auto 16px',
 }} />
 <div style={{ color: G, fontSize: 14, fontWeight: 700 }}>جاري التحميل...</div>
 <div style={{ color: TEXT3, fontSize: 12, marginTop: 4 }}>لوحة مالك المنصة</div>
 </div>
 </div>
 );

 /* ─── Main Render ─── */
 return (
 <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif", direction: 'rtl' }}>
 <Toast msg={toast} onClose={() => setToast('')} />
 <style>{`
 @keyframes spin { to { transform: rotate(360deg); } }
 .owner-tab-btn:hover { background: rgba(201,168,76,0.08) !important; color: ${G} !important; }
 .owner-row:hover { background: rgba(255,255,255,0.025) !important; }
 .stat-card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
 input:focus, select:focus, textarea:focus { border-color: ${G} !important; box-shadow: 0 0 0 3px ${G}15 !important; }
 ::-webkit-scrollbar { width: 5px; height: 5px; }
 ::-webkit-scrollbar-track { background: transparent; }
 ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
 ::-webkit-scrollbar-thumb:hover { background: ${G}50; }
 `}</style>

 {/* ═══ TOP HEADER ═══ */}
 <div style={{
 background: 'rgba(6,6,14,0.85)',
 borderBottom: `1px solid ${BORDER}`,
 padding: '0 28px',
 height: 60,
 display: 'flex', alignItems: 'center', justifyContent: 'space-between',
 position: 'sticky', top: 0, zIndex: 200,
 backdropFilter: 'blur(20px)',
 }}>
 {/* Logo + Title */}
 <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
 <div style={{
 width: 38, height: 38, borderRadius: 10,
 background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontWeight: 900, fontSize: 17, color: BG,
 boxShadow: `0 4px 16px ${G}40`,
 }}>م</div>
 <div>
 <div style={{ color: TEXT, fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>لوحة مالك المنصة</div>
 <div style={{ color: G, fontSize: 11, fontWeight: 600, letterSpacing: 0.3 }}>السلطة السيادية — متين</div>
 </div>
 </div>

 {/* Right Actions */}
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <div style={{
 background: `${GREEN}12`, color: GREEN,
 border: `1px solid ${GREEN}25`,
 borderRadius: 20, padding: '4px 12px',
 fontSize: 11, fontWeight: 600,
 display: 'flex', alignItems: 'center', gap: 6,
 }}>
 <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
 النظام يعمل
 </div>
 <button
 onClick={loadAll}
 style={{
 background: 'var(--bg-card)', color: TEXT2,
 border: `1px solid ${BORDER}`, borderRadius: 8,
 padding: '6px 10px', cursor: 'pointer',
 display: 'flex', alignItems: 'center', gap: 6,
 fontSize: 12,
 }}
 >
 <RefreshCw size={13} />
 تحديث
 </button>
 <NextLink href="/dashboard" style={{
 background: 'var(--bg-card)', color: TEXT2,
 border: `1px solid ${BORDER}`, borderRadius: 8,
 padding: '6px 14px', fontSize: 12, textDecoration: 'none',
 display: 'flex', alignItems: 'center', gap: 6,
 }}>
 <Building2 size={13} />
 الرئيسية
 </NextLink>
 </div>
 </div>

 {/* ═══ BODY: Sidebar + Content ═══ */}
 <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>

 {/* ── Sidebar ── */}
 <div style={{
 width: 230,
 background: 'rgba(255,255,255,0.015)',
 borderLeft: `1px solid ${BORDER}`,
 padding: '16px 0',
 flexShrink: 0,
 position: 'sticky',
 top: 60,
 height: 'calc(100vh - 60px)',
 overflowY: 'auto',
 }}>
 {/* Sidebar Header */}
 <div style={{ padding: '0 16px 16px', borderBottom: `1px solid ${BORDER}` }}>
 <div style={{ color: TEXT3, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
 لوحة التحكم
 </div>
 </div>

 <div style={{ padding: '8px 0' }}>
 {TABS.map(tab => {
 const active = activeTab === tab.id;
 return (
 <button
 key={tab.id}
 className="owner-tab-btn"
 onClick={() => setActiveTab(tab.id)}
 style={{
 width: '100%',
 textAlign: 'right',
 padding: '10px 16px',
 background: active ? `${G}10` : 'transparent',
 borderRight: active ? `3px solid ${G}` : '3px solid transparent',
 border: 'none',
 borderLeft: 'none',
 color: active ? G : TEXT2,
 fontSize: 13,
 fontWeight: active ? 700 : 500,
 cursor: 'pointer',
 display: 'flex',
 alignItems: 'center',
 gap: 10,
 transition: 'all 0.2s',
 fontFamily: "'Cairo', sans-serif",
 }}
 >
 <div style={{
 width: 32, height: 32, borderRadius: 8,
 background: active ? `${G}18` : 'rgba(255,255,255,0.04)',
 border: `1px solid ${active ? G + '30' : BORDER}`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 flexShrink: 0,
 transition: 'all 0.2s',
 }}>
 <tab.Icon size={15} color={active ? G : TEXT3} />
 </div>
 <span>{tab.label}</span>
 {active && <ChevronRight size={12} color={G} style={{ marginRight: 'auto' }} />}
 </button>
 );
 })}
 </div>

 {/* Sidebar Footer */}
 <div style={{ padding: '16px', borderTop: `1px solid ${BORDER}`, marginTop: 8 }}>
 <div style={{
 background: `${G}08`, border: `1px solid ${G}20`,
 borderRadius: 10, padding: '12px',
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
 <Crown size={14} color={G} />
 <span style={{ color: G, fontSize: 12, fontWeight: 700 }}>راكان شلال منصور</span>
 </div>
 <div style={{ color: TEXT3, fontSize: 11 }}>مالك المنصة</div>
 </div>
 </div>
 </div>

 {/* ── Main Content ── */}
 <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: 'calc(100vw - 230px)' }}>

 {/* ═══════════ نظرة عامة ═══════════ */}
 {activeTab === 'overview' && (
 <div>
 <SectionHeader
 title="نظرة عامة على المنصة"
 Icon={Building2}
 desc="إحصائيات شاملة ومباشرة من قاعدة البيانات"
 />

 {/* Stats Grid */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
 <div className="stat-card-hover" style={{ transition: 'all 0.25s' }}>
 <StatCard title="إجمالي المؤسسات" value={stats.total_schools ?? schools.length} sub="مؤسسة مسجلة" color={G} Icon={School} />
 </div>
 <div className="stat-card-hover" style={{ transition: 'all 0.25s' }}>
 <StatCard title="إجمالي المستخدمين" value={stats.total_users ?? '—'} sub="مستخدم نشط" color={BLUE} Icon={Users} />
 </div>
 <div className="stat-card-hover" style={{ transition: 'all 0.25s' }}>
 <StatCard title="الإيرادات الشهرية" value={stats.monthly_revenue ? `${stats.monthly_revenue} ر.س` : '—'} color={GREEN} Icon={Coins} />
 </div>
 <div className="stat-card-hover" style={{ transition: 'all 0.25s' }}>
 <StatCard title="طلبات انتظار" value={joinRequests.length} sub="تحتاج مراجعة" color={AMBER} Icon={Clock} />
 </div>
 <div className="stat-card-hover" style={{ transition: 'all 0.25s' }}>
 <StatCard title="الضرائب السيادية" value={stats.total_taxes ? `${stats.total_taxes} ر.س` : '—'} sub="هذا الشهر" color={PURPLE} Icon={Scale} />
 </div>
 <div className="stat-card-hover" style={{ transition: 'all 0.25s' }}>
 <StatCard title="تذاكر دعم مفتوحة" value={support.filter((s: any) => s.status === 'open').length} color={RED} Icon={Headphones} />
 </div>
 </div>

 {/* طلبات الانضمام */}
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <div style={{ width: 36, height: 36, borderRadius: 9, background: `${AMBER}18`, border: `1px solid ${AMBER}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Clock size={16} color={AMBER} />
 </div>
 <div>
 <div style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>طلبات الانضمام المعلقة</div>
 <div style={{ color: TEXT3, fontSize: 12 }}>مؤسسات تنتظر القبول أو الرفض</div>
 </div>
 </div>
 <Badge label={`${joinRequests.length} طلب`} color={AMBER} />
 </div>
 {joinRequests.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '32px 0' }}>
 <CheckCircle size={36} color={GREEN} style={{ margin: '0 auto 12px', display: 'block' }} />
 <div style={{ color: TEXT3, fontSize: 13 }}>لا توجد طلبات معلقة</div>
 </div>
 ) : (
 <div style={{ overflowX: 'auto' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr>
 <th style={headStyle}>المؤسسة</th>
 <th style={headStyle}>النوع</th>
 <th style={headStyle}>الباقة</th>
 <th style={headStyle}>تاريخ الطلب</th>
 <th style={headStyle}>الإجراء</th>
 </tr>
 </thead>
 <tbody>
 {joinRequests.map((r: any) => (
 <tr key={r.id} className="owner-row">
 <td style={{ ...cellStyle, color: TEXT, fontWeight: 600 }}>{r.school_name || r.name}</td>
 <td style={cellStyle}>{r.school_type || r.type || '—'}</td>
 <td style={cellStyle}><Badge label={r.plan || 'أساسية'} color={G} /></td>
 <td style={cellStyle}>{r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={cellStyle}>
 <div style={{ display: 'flex', gap: 6 }}>
 <Btn label="قبول" color={GREEN} Icon={Check} onClick={() => handleJoinRequest(r.id, 'approve')} />
 <Btn label="رفض" color={RED} Icon={X} onClick={() => handleJoinRequest(r.id, 'reject')} />
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

 {/* ═══════════ المالية والإيرادات ═══════════ */}
 {activeTab === 'finance' && (
 <div>
 <SectionHeader title="المالية والإيرادات" Icon={Coins} desc="إجمالي الإيرادات والمتأخرات وعمولات المتاجر" />
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
 <StatCard title="إيرادات هذا الشهر" value={stats.monthly_revenue ? `${stats.monthly_revenue} ر.س` : '—'} color={GREEN} Icon={TrendingUp} />
 <StatCard title="إيرادات هذا العام" value={stats.yearly_revenue ? `${stats.yearly_revenue} ر.س` : '—'} color={G} Icon={Trophy} />
 <StatCard title="المتأخرات" value={stats.overdue_amount ? `${stats.overdue_amount} ر.س` : '—'} color={RED} Icon={AlertTriangle} />
 <StatCard title="عمولات المتاجر" value={stats.store_commissions ? `${stats.store_commissions} ر.س` : '—'} color={PURPLE} Icon={ShoppingCart} />
 </div>

 <div style={{ background: CARD, border: `1px solid ${RED}20`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
 <div style={{ width: 36, height: 36, borderRadius: 9, background: `${RED}18`, border: `1px solid ${RED}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <AlertTriangle size={16} color={RED} />
 </div>
 <div style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>المؤسسات المتأخرة عن الدفع</div>
 </div>
 {schools.filter((s: any) => s.payment_status === 'overdue' || s.days_late > 0).length === 0 ? (
 <div style={{ textAlign: 'center', padding: '24px 0' }}>
 <CheckCircle size={32} color={GREEN} style={{ margin: '0 auto 10px', display: 'block' }} />
 <div style={{ color: TEXT3, fontSize: 13 }}>لا توجد مؤسسات متأخرة</div>
 </div>
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
 <tr key={s.id} className="owner-row">
 <td style={{ ...cellStyle, color: TEXT, fontWeight: 600 }}>{s.name_ar || s.name}</td>
 <td style={cellStyle}><Badge label={s.plan || 'أساسية'} color={G} /></td>
 <td style={cellStyle}>
 <span style={{ color: (s.days_late || 0) > 30 ? RED : AMBER, fontWeight: 700 }}>
 {s.days_late || 0} يوم
 </span>
 </td>
 <td style={cellStyle}>
 <Btn label="إرسال تذكير" color={G} Icon={Bell} onClick={() => showToast('تم إرسال التذكير')} />
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>

 {/* عمولات المتاجر */}
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
 <div style={{ width: 36, height: 36, borderRadius: 9, background: `${PURPLE}18`, border: `1px solid ${PURPLE}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <ShoppingCart size={16} color={PURPLE} />
 </div>
 <div style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>آخر العمولات</div>
 </div>
 {commissions.length === 0 ? (
 <div style={{ color: TEXT3, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا توجد عمولات مسجلة</div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead><tr>
 <th style={headStyle}>المؤسسة</th>
 <th style={headStyle}>المبلغ</th>
 <th style={headStyle}>النسبة</th>
 <th style={headStyle}>التاريخ</th>
 </tr></thead>
 <tbody>
 {commissions.map((c: any) => (
 <tr key={c.id} className="owner-row">
 <td style={{ ...cellStyle, color: TEXT }}>{c.school_name || c.institution || '—'}</td>
 <td style={{ ...cellStyle, color: GREEN, fontWeight: 700 }}>{c.amount} ر.س</td>
 <td style={cellStyle}>{c.rate || c.percentage || '—'}%</td>
 <td style={cellStyle}>{c.created_at ? new Date(c.created_at).toLocaleDateString('ar-SA') : '—'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </div>
 )}

 {/* ═══════════ مراقبة المؤسسات ═══════════ */}
 {activeTab === 'institutions' && (
 <div>
 <SectionHeader title="مراقبة المؤسسات" Icon={School} desc="جميع المؤسسات المسجلة في المنصة" />
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>المؤسسات ({schools.length})</div>
 <Badge label={`${schools.filter((s: any) => s.status === 'active').length} نشطة`} color={GREEN} />
 </div>
 <div style={{ overflowX: 'auto' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead><tr>
 <th style={headStyle}>المؤسسة</th>
 <th style={headStyle}>النوع</th>
 <th style={headStyle}>الباقة</th>
 <th style={headStyle}>الحالة</th>
 <th style={headStyle}>إجراء</th>
 </tr></thead>
 <tbody>
 {schools.map((s: any) => (
 <tr key={s.id} className="owner-row">
 <td style={{ ...cellStyle, color: TEXT, fontWeight: 600 }}>{s.name_ar || s.name}</td>
 <td style={cellStyle}>{s.type || s.school_type || '—'}</td>
 <td style={cellStyle}><Badge label={s.plan || 'أساسية'} color={G} /></td>
 <td style={cellStyle}>
 <Badge
 label={s.status === 'active' ? 'نشطة' : s.status === 'frozen' ? 'مجمدة' : s.status || '—'}
 color={s.status === 'active' ? GREEN : s.status === 'frozen' ? BLUE : AMBER}
 />
 </td>
 <td style={cellStyle}>
 <div style={{ display: 'flex', gap: 6 }}>
 {s.status === 'active'
 ? <Btn label="تجميد" color={AMBER} Icon={Lock} onClick={() => handleSchoolAction(s.id, 'freeze')} />
 : <Btn label="تفعيل" color={GREEN} Icon={Check} onClick={() => handleSchoolAction(s.id, 'unfreeze')} />
 }
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {schools.length === 0 && (
 <div style={{ textAlign: 'center', padding: '32px', color: TEXT3, fontSize: 13 }}>لا توجد مؤسسات مسجلة</div>
 )}
 </div>
 </div>
 </div>
 )}

 {/* ═══════════ الضرائب السيادية ═══════════ */}
 {activeTab === 'taxes' && (
 <div>
 <SectionHeader title="الضرائب السيادية" Icon={Scale} desc="إدارة الضرائب المفروضة على المؤسسات" />
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
 <div style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>سجل الضرائب</div>
 </div>
 {taxes.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '40px', color: TEXT3, fontSize: 13 }}>لا توجد ضرائب مسجلة</div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead><tr>
 <th style={headStyle}>المؤسسة</th>
 <th style={headStyle}>النوع</th>
 <th style={headStyle}>المبلغ</th>
 <th style={headStyle}>الحالة</th>
 <th style={headStyle}>التاريخ</th>
 </tr></thead>
 <tbody>
 {taxes.map((t: any) => (
 <tr key={t.id} className="owner-row">
 <td style={{ ...cellStyle, color: TEXT }}>{t.school_name || t.institution || '—'}</td>
 <td style={cellStyle}>{t.type || '—'}</td>
 <td style={{ ...cellStyle, color: G, fontWeight: 700 }}>{t.amount} ر.س</td>
 <td style={cellStyle}><Badge label={t.status || 'معلق'} color={t.status === 'paid' ? GREEN : AMBER} /></td>
 <td style={cellStyle}>{t.created_at ? new Date(t.created_at).toLocaleDateString('ar-SA') : '—'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </div>
 )}

 {/* ═══════════ الاشتراكات والباقات ═══════════ */}
 {activeTab === 'subscriptions' && (
 <div>
 <SectionHeader title="الاشتراكات والباقات" Icon={Package} desc="إدارة باقات الاشتراك المتاحة للمؤسسات" />

 {/* الباقات الحالية */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
 {plans.map((plan: any) => (
 <div key={plan.id} style={{
 background: CARD,
 border: `1px solid ${G}20`,
 borderRadius: 16, padding: 22,
 position: 'relative',
 }}>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
 <div style={{ width: 38, height: 38, borderRadius: 10, background: `${G}18`, border: `1px solid ${G}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Package size={18} color={G} />
 </div>
 <Badge label="نشطة" color={GREEN} />
 </div>
 <div style={{ color: TEXT, fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{plan.name}</div>
 <div style={{ color: G, fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{plan.price} <span style={{ fontSize: 13, color: TEXT3 }}>ر.س / شهر</span></div>
 <div style={{ color: TEXT3, fontSize: 12, marginBottom: 6 }}>الحد: {plan.student_limit || 'غير محدود'} طالب</div>
 {plan.features && <div style={{ color: TEXT3, fontSize: 12, marginBottom: 16 }}>{plan.features}</div>}
 <div style={{ display: 'flex', gap: 8 }}>
 <Btn label="تعديل" color={G} Icon={Pencil} onClick={() => { setEditItem({ type: 'plan', id: plan.id }); setPlanForm({ name: plan.name, price: plan.price, student_limit: plan.student_limit || '', features: plan.features || '' }); }} />
 <Btn label="حذف" color={RED} Icon={Trash2} onClick={() => handleDeletePlan(plan.id)} />
 </div>
 </div>
 ))}
 {plans.length === 0 && (
 <div style={{ color: TEXT3, fontSize: 13, padding: '20px 0' }}>لا توجد باقات مسجلة</div>
 )}
 </div>

 {/* إنشاء باقة جديدة */}
 <div style={{ background: CARD, border: `1px solid ${G}20`, borderRadius: 16, padding: 24 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
 <div style={{ width: 36, height: 36, borderRadius: 9, background: `${G}18`, border: `1px solid ${G}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Plus size={16} color={G} />
 </div>
 <div style={{ color: G, fontSize: 15, fontWeight: 700 }}>
 {editItem?.type === 'plan' ? 'تعديل الباقة' : 'إنشاء باقة جديدة'}
 </div>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>اسم الباقة</label>
 <input value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} placeholder="مثال: ذهبية خاصة" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>السعر الشهري (ر.س)</label>
 <input value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: e.target.value })} placeholder="مثال: 1500" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>حد الطلاب</label>
 <input value={planForm.student_limit} onChange={e => setPlanForm({ ...planForm, student_limit: e.target.value })} placeholder="مثال: 2000" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>المميزات</label>
 <input value={planForm.features} onChange={e => setPlanForm({ ...planForm, features: e.target.value })} placeholder="مثال: AI + متجر + تقارير" style={inputStyle} />
 </div>
 </div>
 {errMsg && <div style={{ color: RED, fontSize: 12, marginBottom: 12, background: `${RED}10`, border: `1px solid ${RED}20`, borderRadius: 8, padding: '8px 12px' }}>{errMsg}</div>}
 <div style={{ display: 'flex', gap: 10 }}>
 <GoldBtn
 label={saving ? 'جاري الحفظ...' : editItem?.type === 'plan' ? 'حفظ التعديلات' : 'إنشاء الباقة'}
 Icon={editItem?.type === 'plan' ? Pencil : Plus}
 onClick={handleCreatePlan}
 disabled={saving}
 />
 {editItem?.type === 'plan' && (
 <Btn label="إلغاء" color={TEXT2} onClick={() => { setEditItem(null); setPlanForm({ name: '', price: '', student_limit: '', features: '' }); }} />
 )}
 </div>
 </div>
 </div>
 )}

 {/* ═══════════ الإعلانات السيادية ═══════════ */}
 {activeTab === 'ads' && (
 <div>
 <SectionHeader title="الإعلانات السيادية" Icon={Megaphone} desc="إعلانات متين الرسمية تظهر في جميع لوحات التحكم" />

 {/* نموذج الإنشاء */}
 <div style={{ background: CARD, border: `1px solid ${G}20`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
 <div style={{ width: 36, height: 36, borderRadius: 9, background: `${G}18`, border: `1px solid ${G}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Plus size={16} color={G} />
 </div>
 <div style={{ color: G, fontSize: 15, fontWeight: 700 }}>
 {editItem?.type === 'ad' ? 'تعديل الإعلان' : 'إنشاء إعلان سيادي جديد'}
 </div>
 </div>
 <div style={{ display: 'grid', gap: 16, marginBottom: 16 }}>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>عنوان الإعلان</label>
 <input value={adForm.title} onChange={e => setAdForm({ ...adForm, title: e.target.value })} placeholder="مثال: تحديث جديد في منصة متين" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>نص الإعلان</label>
 <textarea value={adForm.body} onChange={e => setAdForm({ ...adForm, body: e.target.value })} placeholder="نص الإعلان..." style={{ ...inputStyle, minHeight: 80, resize: 'vertical' as any }} />
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>تاريخ البدء</label>
 <input type="date" value={adForm.start_date} onChange={e => setAdForm({ ...adForm, start_date: e.target.value })} style={inputStyle} />
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>تاريخ الانتهاء</label>
 <input type="date" value={adForm.end_date} onChange={e => setAdForm({ ...adForm, end_date: e.target.value })} style={inputStyle} />
 </div>
 </div>
 </div>
 {errMsg && <div style={{ color: RED, fontSize: 12, marginBottom: 12, background: `${RED}10`, border: `1px solid ${RED}20`, borderRadius: 8, padding: '8px 12px' }}>{errMsg}</div>}
 <div style={{ display: 'flex', gap: 10 }}>
 <GoldBtn
 label={saving ? 'جاري الحفظ...' : editItem?.type === 'ad' ? 'حفظ التعديلات' : 'نشر الإعلان السيادي'}
 Icon={editItem?.type === 'ad' ? Pencil : Megaphone}
 onClick={handleCreateAd}
 disabled={saving}
 />
 {editItem?.type === 'ad' && (
 <Btn label="إلغاء" color={TEXT2} onClick={() => { setEditItem(null); setAdForm({ title: '', body: '', start_date: '', end_date: '' }); }} />
 )}
 </div>
 </div>

 {/* قائمة الإعلانات */}
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
 <div style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>الإعلانات الحالية</div>
 </div>
 {ads.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '40px', color: TEXT3, fontSize: 13 }}>لا توجد إعلانات</div>
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
 <tr key={ad.id} className="owner-row">
 <td style={{ ...cellStyle, color: TEXT, fontWeight: 600 }}>{ad.title}</td>
 <td style={cellStyle}>{ad.start_date ? new Date(ad.start_date).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={cellStyle}>{ad.end_date ? new Date(ad.end_date).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={cellStyle}><Badge label={ad.is_active ? 'نشط' : 'غير نشط'} color={ad.is_active ? GREEN : RED} /></td>
 <td style={cellStyle}>
 <div style={{ display: 'flex', gap: 6 }}>
 <Btn label="تعديل" color={G} Icon={Pencil} onClick={() => { setEditItem({ type: 'ad', id: ad.id }); setAdForm({ title: ad.title, body: ad.body, start_date: ad.start_date || '', end_date: ad.end_date || '' }); }} />
 <Btn label="حذف" color={RED} Icon={Trash2} onClick={() => handleDeleteAd(ad.id)} />
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </div>
 )}

 {/* ═══════════ الكوبونات ═══════════ */}
 {activeTab === 'coupons' && (
 <div>
 <SectionHeader title="الكوبونات" Icon={Ticket} desc="إنشاء كودات خصم للمؤسسات" />

 <div style={{ background: CARD, border: `1px solid ${G}20`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
 <div style={{ width: 36, height: 36, borderRadius: 9, background: `${G}18`, border: `1px solid ${G}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Plus size={16} color={G} />
 </div>
 <div style={{ color: G, fontSize: 15, fontWeight: 700 }}>إنشاء كوبون جديد</div>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>كود الخصم</label>
 <input value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="MATIN20" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>قيمة الخصم</label>
 <input value={newCoupon.discount} onChange={e => setNewCoupon({ ...newCoupon, discount: e.target.value })} placeholder="20" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>نوع الخصم</label>
 <select value={newCoupon.type} onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value })} style={inputStyle}>
 <option value="percentage">نسبة (%)</option>
 <option value="fixed">مبلغ ثابت (ر.س)</option>
 </select>
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>الحد الأقصى للاستخدام</label>
 <input value={newCoupon.max_uses} onChange={e => setNewCoupon({ ...newCoupon, max_uses: e.target.value })} placeholder="100" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>تاريخ الانتهاء</label>
 <input type="date" value={newCoupon.expires_at} onChange={e => setNewCoupon({ ...newCoupon, expires_at: e.target.value })} style={inputStyle} />
 </div>
 </div>
 <GoldBtn label="إنشاء الكوبون" Icon={Ticket} onClick={handleCreateCoupon} />
 </div>

 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
 <div style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>الكوبونات الحالية ({coupons.length})</div>
 </div>
 {coupons.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '40px', color: TEXT3, fontSize: 13 }}>لا توجد كوبونات</div>
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
 <tr key={c.id} className="owner-row">
 <td style={{ ...cellStyle, color: G, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 1 }}>{c.code}</td>
 <td style={{ ...cellStyle, fontWeight: 700 }}>{c.discount}{c.type === 'percentage' ? '%' : ' ر.س'}</td>
 <td style={cellStyle}>{c.used_count || 0} / {c.max_uses || '∞'}</td>
 <td style={cellStyle}>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={cellStyle}><Badge label={c.is_active ? 'نشط' : 'منتهي'} color={c.is_active ? GREEN : RED} /></td>
 <td style={cellStyle}><Btn label="حذف" color={RED} Icon={Trash2} onClick={() => handleDeleteCoupon(c.id)} /></td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </div>
 )}

 {/* ═══════════ المتجر والعمولات ═══════════ */}
 {activeTab === 'store' && (
 <div>
 <SectionHeader title="المتجر والعمولات" Icon={ShoppingCart} desc="الإشراف على متاجر المؤسسات وعمولات المبيعات" />
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
 <StatCard title="إجمالي المبيعات" value={stats.store_sales ? `${stats.store_sales} ر.س` : '—'} color={G} Icon={ShoppingCart} />
 <StatCard title="عمولات المنصة" value={stats.store_commissions ? `${stats.store_commissions} ر.س` : '—'} color={PURPLE} Icon={Percent} />
 <StatCard title="المتاجر النشطة" value={stats.active_stores ?? '—'} color={GREEN} Icon={Building2} />
 </div>
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
 <div style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>آخر العمولات</div>
 </div>
 {commissions.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '40px', color: TEXT3, fontSize: 13 }}>لا توجد عمولات</div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead><tr>
 <th style={headStyle}>المؤسسة</th>
 <th style={headStyle}>المبلغ</th>
 <th style={headStyle}>النسبة</th>
 <th style={headStyle}>التاريخ</th>
 </tr></thead>
 <tbody>
 {commissions.map((c: any) => (
 <tr key={c.id} className="owner-row">
 <td style={{ ...cellStyle, color: TEXT }}>{c.school_name || c.institution || '—'}</td>
 <td style={{ ...cellStyle, color: GREEN, fontWeight: 700 }}>{c.amount} ر.س</td>
 <td style={cellStyle}>{c.rate || c.percentage || '—'}%</td>
 <td style={cellStyle}>{c.created_at ? new Date(c.created_at).toLocaleDateString('ar-SA') : '—'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </div>
 )}

 {/* ═══════════ الإشعارات الجماعية ═══════════ */}
 {activeTab === 'notifications' && (
 <div>
 <SectionHeader title="الإشعارات الجماعية" Icon={Bell} desc="إرسال إشعارات لجميع مستخدمي المنصة أو فئة محددة" />
 <div style={{ background: CARD, border: `1px solid ${G}20`, borderRadius: 16, padding: 24, maxWidth: 600 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
 <div style={{ width: 36, height: 36, borderRadius: 9, background: `${G}18`, border: `1px solid ${G}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Bell size={16} color={G} />
 </div>
 <div style={{ color: G, fontSize: 15, fontWeight: 700 }}>إرسال إشعار جماعي</div>
 </div>
 <div style={{ display: 'grid', gap: 16, marginBottom: 20 }}>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>عنوان الإشعار</label>
 <input value={notifForm.title} onChange={e => setNotifForm({ ...notifForm, title: e.target.value })} placeholder="عنوان الإشعار" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>نص الإشعار *</label>
 <textarea value={notifForm.message} onChange={e => setNotifForm({ ...notifForm, message: e.target.value })} placeholder="اكتب نص الإشعار هنا..." style={{ ...inputStyle, minHeight: 100, resize: 'vertical' as any }} />
 </div>
 <div>
 <label style={{ color: TEXT2, fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>الجمهور المستهدف</label>
 <select value={notifForm.target} onChange={e => setNotifForm({ ...notifForm, target: e.target.value })} style={inputStyle}>
 <option value="all">الجميع</option>
 <option value="admins">المدراء فقط</option>
 <option value="teachers">المعلمون فقط</option>
 <option value="students">الطلاب فقط</option>
 <option value="parents">أولياء الأمور فقط</option>
 </select>
 </div>
 </div>
 <GoldBtn label="إرسال الإشعار الجماعي" Icon={Bell} onClick={handleSendNotification} />
 </div>
 </div>
 )}

 {/* ═══════════ AI Auditor ═══════════ */}
 {activeTab === 'ai_auditor' && (
 <div>
 <SectionHeader title="AI Auditor" Icon={Bot} desc="مراقبة ذكية للمنصة بالذكاء الاصطناعي" color={PURPLE} />
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
 <StatCard title="تنبيهات أمنية" value={stats.security_alerts ?? '—'} color={RED} Icon={AlertTriangle} />
 <StatCard title="عمليات مشبوهة" value={stats.suspicious_ops ?? '—'} color={AMBER} Icon={Eye} />
 <StatCard title="نقاط الأمان" value={stats.security_score ?? '98'} sub="من 100" color={GREEN} Icon={Shield} />
 </div>
 <div style={{ background: CARD, border: `1px solid ${PURPLE}20`, borderRadius: 16, padding: 32, textAlign: 'center' }}>
 <div style={{ width: 64, height: 64, borderRadius: 18, background: `${PURPLE}18`, border: `1px solid ${PURPLE}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
 <Bot size={28} color={PURPLE} />
 </div>
 <div style={{ color: TEXT, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>AI Auditor نشط</div>
 <div style={{ color: TEXT3, fontSize: 13, maxWidth: 400, margin: '0 auto' }}>
 يراقب النظام تلقائياً ويرصد أي نشاط غير اعتيادي في المنصة على مدار الساعة
 </div>
 </div>
 </div>
 )}

 {/* ═══════════ سجل الأمان ═══════════ */}
 {activeTab === 'audit_log' && (
 <div>
 <SectionHeader title="سجل الأمان" Icon={Lock} desc="جميع العمليات الحساسة المسجلة في المنصة" />
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
 <div style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>آخر العمليات ({auditLog.length})</div>
 </div>
 {auditLog.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '40px', color: TEXT3, fontSize: 13 }}>لا توجد سجلات</div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead><tr>
 <th style={headStyle}>العملية</th>
 <th style={headStyle}>المستخدم</th>
 <th style={headStyle}>IP</th>
 <th style={headStyle}>التاريخ</th>
 </tr></thead>
 <tbody>
 {auditLog.map((log: any, i: number) => (
 <tr key={log.id || i} className="owner-row">
 <td style={{ ...cellStyle, color: TEXT }}>{log.action || log.event || '—'}</td>
 <td style={cellStyle}>{log.user_name || log.username || '—'}</td>
 <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: 12 }}>{log.ip_address || log.ip || '—'}</td>
 <td style={cellStyle}>{log.created_at ? new Date(log.created_at).toLocaleString('ar-SA') : '—'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 </div>
 )}

 {/* ═══════════ الدعم الفني ═══════════ */}
 {activeTab === 'support' && (
 <div>
 <SectionHeader title="الدعم الفني" Icon={Headphones} desc="تذاكر الدعم الواردة من المؤسسات" />
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 <StatCard title="مفتوحة" value={support.filter((s: any) => s.status === 'open').length} color={RED} Icon={AlertTriangle} />
 <StatCard title="قيد المعالجة" value={support.filter((s: any) => s.status === 'in_progress').length} color={AMBER} Icon={Clock} />
 <StatCard title="مغلقة" value={support.filter((s: any) => s.status === 'closed').length} color={GREEN} Icon={CheckCircle} />
 </div>
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
 <div style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>تذاكر الدعم ({support.length})</div>
 </div>
 {support.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '40px', color: TEXT3, fontSize: 13 }}>لا توجد تذاكر دعم</div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead><tr>
 <th style={headStyle}>الموضوع</th>
 <th style={headStyle}>المؤسسة</th>
 <th style={headStyle}>الأولوية</th>
 <th style={headStyle}>الحالة</th>
 <th style={headStyle}>التاريخ</th>
 <th style={headStyle}>إجراء</th>
 </tr></thead>
 <tbody>
 {support.map((ticket: any) => (
 <tr key={ticket.id} className="owner-row">
 <td style={{ ...cellStyle, color: TEXT, fontWeight: 600, maxWidth: 200 }}>{ticket.subject || ticket.title || '—'}</td>
 <td style={cellStyle}>{ticket.school_name || ticket.institution || '—'}</td>
 <td style={cellStyle}>
 <Badge
 label={ticket.priority === 'high' ? 'عالية' : ticket.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
 color={ticket.priority === 'high' ? RED : ticket.priority === 'medium' ? AMBER : GREEN}
 />
 </td>
 <td style={cellStyle}>
 <Badge
 label={ticket.status === 'open' ? 'مفتوحة' : ticket.status === 'in_progress' ? 'قيد المعالجة' : 'مغلقة'}
 color={ticket.status === 'open' ? RED : ticket.status === 'in_progress' ? AMBER : GREEN}
 />
 </td>
 <td style={cellStyle}>{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={cellStyle}>
 <Btn label="رد" color={G} Icon={Headphones} onClick={() => handleSupportReply(ticket.id)} />
 </td>
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
