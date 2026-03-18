'use client';
import { CheckCircle, ClipboardList, Mailbox, Megaphone, Palette, Plug, Save, Settings, ShoppingCart, XCircle } from "lucide-react";
const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";

interface Setting {
 id: number;
 key: string;
 value: string;
 category: string;
 description: string;
 updated_at: string;
}

const categoryLabels: Record<string, string> = {
 general: '<Settings size={16} /> عام',
 design: 'Palette التصميم',
 integrations: 'Plug التكاملات',
 ads: 'Megaphone الإعلانات',
 store: 'ShoppingCart المتجر',
};

const categoryIcons: Record<string, string> = {
 general: '<Settings size={16} />',
 design: "ICON_Palette",
 integrations: "ICON_Plug",
 ads: "ICON_Megaphone",
 store: "ICON_ShoppingCart",
};

export default function SettingsPage() {
 const [settings, setSettings] = useState<Setting[]>([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState<string | null>(null);
 const [showModal, setShowModal] = useState(false);
 const [errMsg, setErrMsg] = useState('');
 const [editValues, setEditValues] = useState<Record<string, string>>({});
 const [activeCategory, setActiveCategory] = useState('general');
 const [msg, setMsg] = useState('');
 const [msgType, setMsgType] = useState<'success' | 'error'>('success');
 const [user, setUser] = useState<any>(null);

 useEffect(() => {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 setUser(u);
 fetchSettings();
 }, []);

 const fetchSettings = async () => {
 try {
 const res = await fetch('/api/settings', { headers: getHeaders() });
 const data = await res.json();
 const arr = Array.isArray(data) ? data : [];
 setSettings(arr);
 // تهيئة قيم التعديل
 const vals: Record<string, string> = {};
 arr.forEach((s: Setting) => { vals[s.key] = s.value || ''; });
 setEditValues(vals);
 } catch (e) { console.error(e); } finally { setLoading(false); }
 };

 const handleSave = async (key: string) => {
 setSaving(key);
 try {
 const res = await fetch('/api/settings', {
 method: 'PUT',
 headers: getHeaders(),
 body: JSON.stringify({ key, value: editValues[key] || '' })
 });
 if (res.ok) {
 setMsg(`<CheckCircle size={18} color="#10B981" /> تم حفظ "${key}" بنجاح`);
 setMsgType('success');
 fetchSettings();
 } else {
 setMsg('XCircle فشل الحفظ');
 setMsgType('error');
 }
 } catch (e: any) { setMsg('XCircle ' + (e.message || 'خطأ في الاتصال')); setMsgType('error'); } finally {
 setSaving(null);
 setTimeout(() => setMsg(''), 3000);
 }
 };

 const handleSaveAll = async () => {
 setSaving('all');
 const filtered = settings.filter(s => s.category === activeCategory);
 let success = 0;
 for (const s of filtered) {
 try {
 const res = await fetch('/api/settings', {
 method: 'POST',
 headers: getHeaders(),
 body: JSON.stringify({ key: s.key, value: editValues[s.key] || '', category: s.category })
 });
 if (res.ok) success++;
 } catch {}
 }
 setMsg(`<CheckCircle size={18} color="#10B981" /> تم حفظ ${success} إعداد بنجاح`);
 setMsgType('success');
 setSaving(null);
 setTimeout(() => setMsg(''), 3000);
 fetchSettings();
 };

 const categories = [...new Set(settings.map(s => s.category))];
 const filteredSettings = settings.filter(s => s.category === activeCategory);

 const inputStyle: React.CSSProperties = {
 width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
 borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none',
 fontFamily: 'IBM Plex Sans Arabic, sans-serif',
 };

 if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A227', fontSize: 18 }}>⏳ جاري التحميل...</div>;

 return (
 <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 {/* الهيدر */}
 <div style={{ marginBottom: 28 }}>
 <h1 style={{ fontSize: 26, fontWeight: 800, color: '#C9A227', margin: 0 }}>إعدادات المنصة</h1>
 <p style={{ color: '#9CA3AF', fontSize: 14, margin: '6px 0 0' }}>تحكم في جميع إعدادات منصة متين</p>
 </div>

 {/* رسالة النجاح/الخطأ */}
 {msg && (
 <div style={{
 padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 600,
 background: msgType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
 border: `1px solid ${msgType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
 color: msgType === 'success' ? '#10B981' : '#EF4444',
 }}>{msg}</div>
 )}

 <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
 {/* الشريط الجانبي للفئات */}
 <div style={{ minWidth: 200, flex: '0 0 200px' }}>
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
 {(categories.length > 0 ? categories : Object.keys(categoryLabels)).map(cat => (
 <button key={cat} onClick={() => setActiveCategory(cat)} style={{
 width: '100%', padding: '14px 16px', background: activeCategory === cat ? 'rgba(201,162,39,0.1)' : 'transparent',
 border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', color: activeCategory === cat ? '#C9A227' : 'rgba(255,255,255,0.7)',
 fontSize: 14, fontWeight: activeCategory === cat ? 700 : 500, cursor: 'pointer', textAlign: 'right',
 fontFamily: 'IBM Plex Sans Arabic, sans-serif',
 }}>
 <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
 <span>{categoryLabels[cat]?.replace(/^\S+\s*/, '') || cat}</span>
 <IconRenderer name={categoryIcons[cat] || "ICON_ClipboardList"} size={18} />
 </span>
 </button>
 ))}
 </div>
 </div>

 {/* محتوى الإعدادات */}
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 24 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, margin: 0 }}>
 {categoryLabels[activeCategory] || activeCategory}
 </h2>
 <button onClick={handleSaveAll} disabled={saving === 'all'} style={{
 padding: '10px 24px', background: 'linear-gradient(135deg, #C9A227, #E8C547)',
 color: '#06060E', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
 cursor: saving === 'all' ? 'not-allowed' : 'pointer', opacity: saving === 'all' ? 0.7 : 1,
 fontFamily: 'IBM Plex Sans Arabic, sans-serif',
 }}>
 {saving === 'all' ? '⏳ جاري الحفظ...' : 'Save حفظ الكل'}
 </button>
 </div>

 {filteredSettings.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>
 <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><IconRenderer name="ICON_Settings" size={28} /></div>
 <p>لا توجد إعدادات في هذه الفئة</p>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
 {filteredSettings.map(s => (
 <div key={s.key} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
 <div>
 <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{s.description || s.key}</div>
 <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>{s.key}</div>
 </div>
 <button onClick={() => handleSave(s.key)} disabled={saving === s.key} style={{
 padding: '6px 16px', background: 'rgba(201,162,39,0.1)', color: '#C9A227',
 border: '1px solid rgba(201,162,39,0.3)', borderRadius: 8, fontSize: 12, fontWeight: 600,
 cursor: saving === s.key ? 'not-allowed' : 'pointer', opacity: saving === s.key ? 0.7 : 1,
 fontFamily: 'IBM Plex Sans Arabic, sans-serif',
 }}>
 {saving === s.key ? '⏳' : 'Save حفظ'}
 </button>
 </div>
 {s.key.includes('color') ? (
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <input
 type="color"
 value={editValues[s.key] || '#000000'}
 onChange={e => setEditValues({ ...editValues, [s.key]: e.target.value })}
 style={{ width: 50, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none' }}
 />
 <input
 type="text"
 value={editValues[s.key] || ''}
 onChange={e => setEditValues({ ...editValues, [s.key]: e.target.value })}
 style={{ ...inputStyle, flex: 1 }}
 placeholder="#C9A227"
 />
 </div>
 ) : s.key.includes('enabled') ? (
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <button
 onClick={() => setEditValues({ ...editValues, [s.key]: editValues[s.key] === 'true' ? 'false' : 'true' })}
 style={{
 padding: '8px 24px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
 background: editValues[s.key] === 'true' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
 color: editValues[s.key] === 'true' ? '#10B981' : '#EF4444',
 fontFamily: 'IBM Plex Sans Arabic, sans-serif',
 }}
 >
 {editValues[s.key] === 'true' ? 'CheckCircle مفعّل' : 'XCircle معطّل'}
 </button>
 </div>
 ) : (
 <input
 type={s.key.includes('password') || s.key.includes('secret') ? 'password' : 'text'}
 value={editValues[s.key] || ''}
 onChange={e => setEditValues({ ...editValues, [s.key]: e.target.value })}
 style={inputStyle}
 placeholder={s.description || s.key}
 dir="ltr"
 />
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
