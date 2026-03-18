'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { Bird, Camera, CheckCircle, Eye, FileText, Ghost, Pencil, Phone, Plus, Rocket, Save, School, Smartphone, X } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';


export default function SchoolPageEditor() {
 const [pages, setPages] = useState<any[]>([]);
 const [selected, setSelected] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [success, setSuccess] = useState('');
 const [showAdd, setShowAdd] = useState(false);
 const [newSlug, setNewSlug] = useState('');
 const [newName, setNewName] = useState('');
 const [form, setForm] = useState<any>({});

 useEffect(() => { fetchPages(); }, []);

 const fetchPages = async () => {
 try {
 const res = await fetch('/api/school-page', { headers: getHeaders() });
 const data = await res.json();
 setPages(Array.isArray(data) ? data : []);
 } catch (e) { console.error(e); }
 finally { setLoading(false); }
 };

 const openEditor = (page: any) => {
 setSelected(page);
 setForm({ ...page });
 };

 const handleSave = async () => {
 setSaving(true);
 try {
 const res = await fetch('/api/school-page', { method: 'PUT', headers: getHeaders(), body: JSON.stringify(form) });
 if (res.ok) {
 await fetchPages();
 setSuccess('تم الحفظ CheckCircle');
 setTimeout(() => setSuccess(''), 3000);
 }
 } catch (e) { console.error(e); }
 finally { setSaving(false); }
 };

 const handleCreate = async () => {
 if (!newSlug || !newName) return alert('أدخل الاسم والرابط');
 try {
 const user = JSON.parse(localStorage.getItem('matin_user') || '{}');
 const res = await fetch('/api/school-page', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ slug: newSlug, school_name: newName, school_id: user.school_id }) });
 if (res.ok) { setShowAdd(false); setNewSlug(''); setNewName(''); await fetchPages(); }
 else { const err = await res.json(); alert(err.error || 'فشل'); }
 } catch (e) { console.error(e); }
 };

 const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

 return (
 <div style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_School" size={18} /> صفحة المدرسة</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>تخصيص الصفحة العامة لمدرستك</p>
 </div>
 <button onClick={() => setShowAdd(true)} style={{ background: 'linear-gradient(135deg, #C9A227, #D4B03D)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إنشاء صفحة</button>
 </div>

 {success && <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '12px 20px', marginBottom: 24, color: '#22C55E', fontWeight: 600 }}>{success}</div>}

 {loading ? (
 <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 60 }}>جاري التحميل...</div>
 ) : pages.length === 0 && !selected ? (
 <div style={{ textAlign: 'center', padding: 60 }}>
 <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(201,162,39,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><IconRenderer name="ICON_School" size={36} /></div>
 <h3 style={{ color: 'white', marginBottom: 8 }}>لا توجد صفحة بعد</h3>
 <p style={{ color: 'rgba(255,255,255,0.5)' }}>أنشئ صفحة عامة لمدرستك</p>
 </div>
 ) : !selected ? (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
 {pages.map(page => (
 <div key={page.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
 <h3 style={{ color: 'white', fontWeight: 700, margin: 0 }}>{page.school_name}</h3>
 <span style={{ background: page.is_published ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: page.is_published ? '#22C55E' : '#EF4444', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>{page.is_published ? 'CheckCircle منشور' : 'مخفي'}</span>
 </div>
 <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 16px' }}>matin.ink/school/{page.slug}</p>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => openEditor(page)} style={{ flex: 1, background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
 <a href={`/school/${page.slug}`} target="_blank" rel="noreferrer" style={{ flex: 1, background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}><IconRenderer name="ICON_Eye" size={18} /> معاينة</a>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div>
 <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', marginBottom: 24 }}>← رجوع</button>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
 {/* المعلومات الأساسية */}
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
 <h3 style={{ color: '#C9A227', fontWeight: 700, marginBottom: 20 }}><IconRenderer name="ICON_FileText" size={18} /> المعلومات الأساسية</h3>
 {[
 { key: 'school_name', label: 'اسم المدرسة' },
 { key: 'description', label: 'وصف المدرسة' },
 { key: 'vision', label: 'الرؤية' },
 { key: 'mission', label: 'الرسالة' },
 { key: 'logo', label: 'رابط الشعار' },
 { key: 'cover_image', label: 'رابط صورة الغلاف' },
 ].map(f => (
 <div key={f.key} style={{ marginBottom: 16 }}>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label}</label>
 <textarea value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ ...inputStyle, minHeight: f.key === 'description' || f.key === 'vision' || f.key === 'mission' ? 80 : 44, resize: 'vertical' }} />
 </div>
 ))}
 </div>

 {/* التواصل والسوشيال */}
 <div>
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
 <h3 style={{ color: '#C9A227', fontWeight: 700, marginBottom: 20 }}><IconRenderer name="ICON_Phone" size={18} /> معلومات التواصل</h3>
 {[
 { key: 'phone', label: 'الجوال' },
 { key: 'email', label: 'البريد الإلكتروني' },
 { key: 'address', label: 'العنوان' },
 ].map(f => (
 <div key={f.key} style={{ marginBottom: 16 }}>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label}</label>
 <input value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} />
 </div>
 ))}
 </div>

 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
 <h3 style={{ color: '#C9A227', fontWeight: 700, marginBottom: 20 }}><IconRenderer name="ICON_Smartphone" size={18} /> التواصل الاجتماعي</h3>
 {[
 { key: 'social_twitter', label: 'Bird تويتر' },
 { key: 'social_instagram', label: 'Camera انستقرام' },
 { key: 'social_snapchat', label: 'Ghost سناب شات' },
 ].map(f => (
 <div key={f.key} style={{ marginBottom: 16 }}>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label}</label>
 <input value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder="https://..." style={{ ...inputStyle }} dir="ltr" />
 </div>
 ))}
 </div>

 {/* نشر */}
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
 <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>نشر الصفحة للعموم</span>
 <div onClick={() => setForm({ ...form, is_published: !form.is_published })} style={{ width: 48, height: 26, background: form.is_published ? '#22C55E' : 'rgba(255,255,255,0.15)', borderRadius: 13, cursor: 'pointer', position: 'relative', transition: 'all 0.3s', marginRight: 'auto' }}>
 <div style={{ position: 'absolute', top: 3, right: form.is_published ? 3 : 'auto', left: form.is_published ? 'auto' : 3, width: 20, height: 20, background: 'white', borderRadius: '50%', transition: 'all 0.3s' }} />
 </div>
 </div>

 <div style={{ display: 'flex', gap: 12 }}>
 <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: 'linear-gradient(135deg, #C9A227, #D4B03D)', color: '#06060E', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
 {saving ? '⏳ جاري الحفظ...' : '<Save size={18} color="#6B7280" /> حفظ التغييرات'}
 </button>
 <a href={`/school/${selected.slug}`} target="_blank" rel="noreferrer" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: '14px 20px', fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}><IconRenderer name="ICON_Eye" size={18} /> معاينة</a>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Modal إنشاء صفحة */}
 {showAdd && (
 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
 <div style={{ background: '#1B263B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 440 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontWeight: 800, margin: 0 }}><IconRenderer name="ICON_School" size={18} /> إنشاء صفحة جديدة</h2>
 <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, cursor: 'pointer' }}>X</button>
 </div>
 <div style={{ marginBottom: 16 }}>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>اسم المدرسة *</label>
 <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="مدرسة النجوم" style={inputStyle} />
 </div>
 <div style={{ marginBottom: 24 }}>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>رابط الصفحة * (انجليزي بدون مسافات)</label>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>matin.ink/school/</span>
 <input value={newSlug} onChange={e => setNewSlug(e.target.value.toLowerCase().replace(/\s/g, '-'))} placeholder="al-nujoom" style={{ ...inputStyle, flex: 1 }} dir="ltr" />
 </div>
 </div>
 <button onClick={handleCreate} style={{ width: '100%', background: 'linear-gradient(135deg, #C9A227, #D4B03D)', color: '#06060E', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Rocket إنشاء الصفحة</button>
 </div>
 </div>
 )}
 </div>
 );
}
