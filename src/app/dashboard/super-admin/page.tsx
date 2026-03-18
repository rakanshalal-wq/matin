'use client';
import { Building2, CheckCircle, Circle, Diamond, GraduationCap, Pencil, School, User } from "lucide-react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import IconRenderer from "@/components/IconRenderer";
const getH = () => { const t = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null; return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) }; };
export default function SuperAdminDashboard() {
 const router = useRouter();
 const [stats, setStats] = useState<any>({});
 const [schools, setSchools] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [form, setForm] = useState({ name: '', email: '', phone: '', plan: 'basic' });
 const [msg, setMsg] = useState('');
 useEffect(() => {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 if (u.role !== 'super_admin' && u.role !== 'owner') { router.replace('/dashboard'); return; }
 fetchAll();
 }, []);
 const fetchAll = async () => {
 setLoading(true);
 try {
 const [statsRes, schoolsRes] = await Promise.all([
 fetch('/api/dashboard-stats', { headers: getH() }),
 fetch('/api/schools', { headers: getH() }),
 ]);
 const [statsData, schoolsData] = await Promise.all([statsRes.json(), schoolsRes.json()]);
 setStats(statsData || {});
 setSchools(Array.isArray(schoolsData) ? schoolsData : []);
 } catch (e) { console.error(e); } finally { setLoading(false); }
 };
 const handleSave = async () => {
 if (!form.name.trim()) { setErrMsg('اسم المؤسسة مطلوب'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? `/api/schools?id=${editItem.id}` : '/api/schools';
 const res = await fetch(url, { method, headers: getH(), body: JSON.stringify(form) });
 const data = await res.json();
 if (res.ok) { setShowModal(false); setEditItem(null); setForm({ name: '', email: '', phone: '', plan: 'basic' }); fetchAll(); setMsg(method === 'PUT' ? 'CheckCircle تم تعديل المؤسسة' : '[CheckCircle] تم إضافة المؤسسة'); }
 else setErrMsg(data.error || 'فشل الحفظ');
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };
 const handleToggleStatus = async (id: number, status: string) => {
 setSaving(true); setErrMsg('');
 try {
 const res = await fetch(`/api/schools?id=${id}`, { method: 'PUT', headers: getH(), body: JSON.stringify({ status: status === 'active' ? 'frozen' : 'active' }) });
 const data = await res.json();
 if (res.ok) fetchAll();
 else setErrMsg(data.error || 'فشل التحديث');
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };
 if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#C9A227', fontSize: 18 }}>⏳ جاري التحميل...</div>;
 return (
 <div style={{ padding: 24, direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#06060E', minHeight: '100vh' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ color: '#C9A227', fontSize: 26, fontWeight: 800, margin: 0 }}><IconRenderer name="ICON_Building" size={18} />2 لوحة السوبر أدمن</h1>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '4px 0 0' }}>إدارة كاملة للمنصة والمؤسسات</p>
 </div>
 <button onClick={() => { setShowModal(true); setEditItem(null); setForm({ name: '', email: '', phone: '', plan: 'basic' }); }} style={{ background: 'linear-gradient(135deg,#C9A227,#E8C547)', border: 'none', borderRadius: 10, padding: '10px 20px', color: '#06060E', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ إضافة مؤسسة</button>
 </div>
 {msg && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: 14 }}>{msg} <button onClick={() => setMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', float: 'left' }}>×</button></div>}
 {errMsg && !showModal && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 14 }}>{errMsg} <button onClick={() => setErrMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', float: 'left' }}>×</button></div>}
 {/* إحصائيات */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
 {[
 { label: 'المؤسسات', value: stats.schools || schools.length || 0, color: '#3B82F6', icon: "ICON_School" },
 { label: 'الطلاب', value: stats.students || stats.total_students || 0, color: '#10B981', icon: "ICON_GraduationCap" },
 { label: 'المعلمون', value: stats.teachers || stats.total_teachers || 0, color: '#8B5CF6', icon: '<User size={16} />[School]' },
 { label: 'الاشتراكات النشطة', value: stats.active_subscriptions || 0, color: '#C9A227', icon: "ICON_Diamond" },
 ].map((s, i) => (
 <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}25`, borderRadius: 14, padding: 20 }}>
 <div style={{ fontSize: 28, marginBottom: 8 }}><IconRenderer name={s.icon} /></div>
 <div style={{ color: s.color, fontSize: 28, fontWeight: 800 }}>{(s.value || 0).toLocaleString()}</div>
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
 </div>
 ))}
 </div>
 {/* جدول المؤسسات */}
 <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}><IconRenderer name="ICON_School" size={18} /> المؤسسات المسجلة ({schools.length})</h2>
 </div>
 {schools.length === 0 ? (
 <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>لا توجد مؤسسات مسجلة</div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.05)' }}>
 {['المؤسسة', 'النوع', 'الحالة', 'الطلاب', 'الإجراءات'].map(h => (
 <th key={h} style={{ padding: '12px 16px', textAlign: 'right', color: '#C9A227', fontWeight: 700, fontSize: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {schools.map((s: any) => (
 <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
 <td style={{ padding: '12px 16px', color: '#fff', fontSize: 13, fontWeight: 600 }}>{s.name_ar || s.name}</td>
 <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{s.institution_type || 'مدرسة'}</td>
 <td style={{ padding: '12px 16px' }}>
 <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: s.status === 'active' ? '#10B981' : '#EF4444' }}>
 {s.status === 'active' ? 'CheckCircle نشط' : '[Circle] متجمد'}
 </span>
 </td>
 <td style={{ padding: '12px 16px', color: '#C9A227', fontSize: 13, fontWeight: 700 }}>{s.student_count || 0}</td>
 <td style={{ padding: '12px 16px' }}>
 <div style={{ display: 'flex', gap: 6 }}>
 <button onClick={() => { setEditItem(s); setForm({ name: s.name_ar || s.name, email: s.email || '', phone: s.phone || '', plan: s.plan || 'basic' }); setShowModal(true); }} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(201,162,39,0.2)', cursor: 'pointer', fontWeight: 600 }}>تعديل</button>
 <button onClick={() => handleToggleStatus(s.id, s.status)} disabled={saving} style={{ background: s.status === 'active' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: s.status === 'active' ? '#EF4444' : '#10B981', fontSize: 11, padding: '4px 10px', borderRadius: 6, border: `1px solid ${s.status === 'active' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`, cursor: 'pointer', fontWeight: 600 }}>{s.status === 'active' ? 'تجميد' : 'تفعيل'}</button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 {/* Modal */}
 {showModal && (
 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: '#0F0F1A', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, direction: 'rtl' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل المؤسسة' : '+ إضافة مؤسسة جديدة'}</h2>
 <button onClick={() => { setShowModal(false); setErrMsg(''); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>×</button>
 </div>
 {errMsg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 13 }}>{errMsg}</div>}
 {[
 { label: 'اسم المؤسسة *', key: 'name', type: 'text', placeholder: 'مثال: مدرسة الأمل' },
 { label: 'البريد الإلكتروني', key: 'email', type: 'email', placeholder: 'info@school.com' },
 { label: 'رقم الهاتف', key: 'phone', type: 'tel', placeholder: '05xxxxxxxx' },
 ].map(({ label, key, type, placeholder }) => (
 <div key={key} style={{ marginBottom: 16 }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
 <input type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
 </div>
 ))}
 <div style={{ marginBottom: 20 }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>الباقة</label>
 <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none' }}>
 <option value="basic">أساسي</option>
 <option value="advanced">متقدم</option>
 <option value="enterprise">مؤسسي</option>
 </select>
 </div>
 <div style={{ display: 'flex', gap: 10 }}>
 <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: saving ? 'rgba(201,162,39,0.5)' : 'linear-gradient(135deg,#C9A227,#E8C547)', border: 'none', borderRadius: 10, padding: '12px 0', color: '#06060E', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'إضافة المؤسسة'}</button>
 <button onClick={() => { setShowModal(false); setErrMsg(''); }} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
