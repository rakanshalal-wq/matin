'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { Ban, Check, CheckCircle, Mail, MapPin, Pencil, Plus, School, Search, Smartphone, Trash2, User, X, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';

export default function SchoolsPage() {
 const [schools, setSchools] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [showAdd, setShowAdd] = useState(false);
 const [editSchool, setEditSchool] = useState<any>(null);
 const [user, setUser] = useState<any>(null);
 const [form, setForm] = useState({ name_ar: '', email: '', phone: '', city: '', address: '', status: 'TRIAL' });
 const [saving, setSaving] = useState(false);
 const [errMsg, setErrMsg] = useState('');
 const [msg, setMsg] = useState('');
 const [msgType, setMsgType] = useState<'success' | 'error'>('success');
 const [search, setSearch] = useState('');

 useEffect(() => {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 setUser(u);
 fetchSchools();
 }, []);

 const fetchSchools = async () => {
 setLoading(true);
 try {
 const res = await fetch('/api/schools', { headers: getHeaders() });
 const data = await res.json();
 setSchools(Array.isArray(data) ? data : []);
 } catch {} finally { setLoading(false); }
 };

 const handleSave = async () => {
 if (!form.name_ar) { setErrMsg('أدخل اسم المؤسسة'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editSchool ? 'PUT' : 'POST';
 const url = editSchool ? `/api/schools?id=${editSchool.id}` : '/api/schools';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
 const data = await res.json();
 if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
 setShowAdd(false); setEditSchool(null); setForm({ name_ar: '', email: '', phone: '', city: '', address: '', status: 'TRIAL' }); setErrMsg('');
 fetchSchools();
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };

 const handleEdit = (school: any) => {
 setEditSchool(school);
 setForm({ name_ar: school.name_ar || school.name || '', email: school.email || '', phone: school.phone || '', city: school.city || '', address: school.address || '', status: school.status || 'TRIAL' });
 setShowAdd(true);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handleDelete = async (id: string) => {
 if (!confirm('هل أنت متأكد من حذف هذه المدرسة؟ سيتم حذف جميع بياناتها.')) return;
 try {
 await fetch(`/api/schools?id=${id}`, { method: 'DELETE', headers: getHeaders() });
 setSchools(schools.filter(s => s.id !== id));
 setMsg('CheckCircle تم حذف المدرسة');
 setMsgType('success');
 } catch { setMsg('XCircle فشل الحذف'); setMsgType('error'); }
 setTimeout(() => setMsg(''), 3000);
 };

 const handleApprove = async (id: string) => {
 try {
 const res = await fetch('/api/schools', {
 method: 'PUT',
 headers: getHeaders(),
 body: JSON.stringify({ id, status: 'ACTIVE' })
 });
 if (res.ok) {
 setSchools(schools.map(s => s.id === id ? { ...s, status: 'ACTIVE' } : s));
 setMsg('CheckCircle تم تفعيل المدرسة');
 setMsgType('success');
 }
 } catch { setMsg('XCircle فشل التفعيل'); setMsgType('error'); }
 setTimeout(() => setMsg(''), 3000);
 };

 const canAdd = user?.role === 'owner' || user?.role === 'super_admin';
 const filtered = schools.filter(s =>
 (s.name_ar || s.name || '').toLowerCase().includes(search.toLowerCase()) ||
 (s.city || '').toLowerCase().includes(search.toLowerCase()) ||
 (s.email || '').toLowerCase().includes(search.toLowerCase())
 );

 const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', direction: 'rtl' };
 const labelStyle: React.CSSProperties = { color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block', fontFamily: 'IBM Plex Sans Arabic, sans-serif' };

 if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#D4A843', fontSize: 18 }}>⏳ جاري التحميل...</div>;

 return (
 <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 {/* الهيدر */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
 <div>
 <h1 style={{ fontSize: 24, fontWeight: 700, color: '#D4A843', margin: 0 }}><IconRenderer name="ICON_School" size={18} /> المدارس والمؤسسات</h1>
 <p style={{ color: '#9CA3AF', fontSize: 14, margin: '4px 0 0' }}>
 {schools.length} مؤسسة مسجلة | {schools.filter(s => s.status === 'ACTIVE').length} نشطة
 </p>
 </div>
 {canAdd && (
 <button onClick={() => { setShowAdd(!showAdd); setEditSchool(null); setForm({ name_ar: '', email: '', phone: '', city: '', address: '', status: 'TRIAL' }); }} style={{
 padding: '10px 24px', background: showAdd ? '#374151' : 'linear-gradient(135deg, #D4A843, #E8C547)',
 color: showAdd ? '#fff' : '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer',
 fontFamily: 'IBM Plex Sans Arabic, sans-serif'
 }}>
 {showAdd ? ' إلغاء' : '+ إضافة مؤسسة'}
 </button>
 )}
 </div>

 {/* رسالة */}
 {msg && (
 <div style={{ padding: 12, background: msgType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msgType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 10, color: msgType === 'success' ? '#10B981' : '#EF4444', marginBottom: 16, fontSize: 14 }}>{msg}</div>
 )}

 {/* فورم الإضافة/التعديل */}
 {showAdd && (
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
 <h3 style={{ color: '#D4A843', fontSize: 18, margin: '0 0 20px', fontWeight: 700 }}>
 {editSchool ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل المؤسسة' : 'Plus إضافة مؤسسة جديدة'}
 </h3>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
 <div style={{ gridColumn: '1 / -1' }}>
 <label style={labelStyle}>اسم المؤسسة *</label>
 <input style={inputStyle} placeholder="مثال: مدارس النور الأهلية" value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} />
 </div>
 <div>
 <label style={labelStyle}>البريد الإلكتروني</label>
 <input style={inputStyle} type="email" placeholder="info@school.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
 </div>
 <div>
 <label style={labelStyle}>رقم الجوال</label>
 <input style={inputStyle} placeholder="05xxxxxxxx" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
 </div>
 <div>
 <label style={labelStyle}>المدينة</label>
 <input style={inputStyle} placeholder="الرياض" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
 </div>
 <div>
 <label style={labelStyle}>العنوان</label>
 <input style={inputStyle} placeholder="حي النرجس، شارع الملك فهد" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
 </div>
 {editSchool && user?.role === 'super_admin' && (
 <div>
 <label style={labelStyle}>الحالة</label>
 <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
 <option value="TRIAL">تجريبية</option>
 <option value="ACTIVE">نشطة</option>
 <option value="SUSPENDED">موقوفة</option>
 </select>
 </div>
 )}
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
 <button onClick={handleSave} disabled={saving} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #D4A843, #E8C547)', color: '#000', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', opacity: saving ? 0.5 : 1 }}>
 {saving ? '⏳ جاري الحفظ...' : editSchool ? 'Check تحديث المؤسسة' : 'Check حفظ المؤسسة'}
 </button>
 <button onClick={() => { setShowAdd(false); setEditSchool(null); }} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 إلغاء
 </button>
 </div>
 </div>
 )}

 {/* بحث */}
 <div style={{ marginBottom: 20 }}>
 <input
 type="text"
 placeholder="بحث بالاسم أو المدينة أو البريد..."
 value={search}
 onChange={e => setSearch(e.target.value)}
 style={{ ...inputStyle, maxWidth: 400 }}
 />
 </div>

 {/* قائمة المدارس */}
 {filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(59,130,246,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><School size={19} color="#3B82F6" /></div>
 <h3 style={{ color: '#fff', fontSize: 18, margin: '0 0 8px' }}>{search ? 'لا توجد نتائج' : 'لا توجد مؤسسات بعد'}</h3>
 <p style={{ color: '#9CA3AF', fontSize: 14 }}>{search ? 'جرب بحثاً مختلفاً' : 'أضف أول مؤسسة بالضغط على "إضافة مؤسسة"'}</p>
 </div>
 ) : (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
 {filtered.map((school: any) => (
 <div key={school.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, transition: 'border-color 0.2s' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
 <div style={{ flex: 1, minWidth: 0 }}>
 <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.name_ar || school.name}</h3>
 <span style={{ color: '#6B7280', fontSize: 12 }}>#{school.code}</span>
 </div>
 <span style={{
 padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0, marginRight: 8,
 background: school.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : school.status === 'SUSPENDED' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
 color: school.status === 'ACTIVE' ? '#10B981' : school.status === 'SUSPENDED' ? '#EF4444' : '#F59E0B'
 }}>
 {school.status === 'ACTIVE' ? 'Check نشطة' : school.status === 'SUSPENDED' ? 'Ban موقوفة' : '⏳ تجريبية'}
 </span>
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
 {school.city && <span style={{ color: '#9CA3AF', fontSize: 13 }}><IconRenderer name="ICON_Globe" size={18} /><IconRenderer name="ICON_Pin" size={18} /> {school.city}</span>}
 {school.phone && <span style={{ color: '#9CA3AF', fontSize: 13 }}><IconRenderer name="ICON_Smartphone" size={18} /> {school.phone}</span>}
 {school.email && <span style={{ color: '#9CA3AF', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.email}</span>}
 {school.owner_name && <span style={{ color: '#9CA3AF', fontSize: 13 }}><IconRenderer name="ICON_User" size={18} /> {school.owner_name}</span>}
 </div>
 {canAdd && (
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
 <button onClick={() => handleEdit(school)} style={{ padding: '6px 14px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل
 </button>
 {school.status !== 'ACTIVE' && user?.role === 'super_admin' && (
 <button onClick={() => handleApprove(school.id)} style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 CheckCircle تفعيل
 </button>
 )}
 <button onClick={() => handleDelete(school.id)} style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 Trash2<IconRenderer name="ICON_Trash2" size={18} /> حذف
 </button>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
