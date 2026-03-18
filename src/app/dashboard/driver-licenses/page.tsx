'use client';
import { AlertTriangle, CheckCircle, Pencil, Plus, Save, Search, Siren, Trash2, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function DriverLicensesPage() {
 const [items, setItems] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [showAddModal, setShowAddModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [formData, setFormData] = useState({ driver_name: '', license_number: '', type: '', issue_date: '', expiry_date: '', status: 'active' });

 useEffect(() => { fetchItems(); }, []);
 const fetchItems = async () => { try { const res = await fetch('/api/driver-licenses', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

 const handleSave = async () => {
 if (!formData.driver_name) { setErrMsg('أدخل اسم السائق'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? `/api/driver-licenses?id=${editItem.id}` : '/api/driver-licenses';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
 const data = await res.json();
 if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
 setShowAddModal(false); setEditItem(null); setFormData({ driver_name: '', license_number: '', type: '', issue_date: '', expiry_date: '', status: 'active' }); setErrMsg(''); fetchItems();
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };
 const handleEdit = (item: any) => {
 setEditItem(item);
 setFormData({ ...{ driver_name: '', license_number: '', type: '', issue_date: '', expiry_date: '', status: 'active' }, ...item });
 setErrMsg('');
 setShowAddModal(true);
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد؟')) return;
 try { await fetch(`/api/driver-licenses?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); }
 };

 const isExpiringSoon = (date: string) => {
 if (!date) return false;
 const diff = new Date(date).getTime() - new Date().getTime();
 return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
 };

 const isExpired = (date: string) => {
 if (!date) return false;
 return new Date(date).getTime() < new Date().getTime();
 };

 const expiredCount = items.filter(i => isExpired(i.expiry_date)).length;
 const expiringSoonCount = items.filter(i => isExpiringSoon(i.expiry_date)).length;

 const filteredItems = items.filter(i => i.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.license_number?.toLowerCase().includes(searchTerm.toLowerCase()));
 const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>🪪 رخص السائقين</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>متابعة رخص القيادة وتواريخ الانتهاء</p>
 </div>
 <button onClick={() => { setEditItem(null); setFormData({ driver_name: '', license_number: '', type: '', issue_date: '', expiry_date: '', status: 'active' }); setErrMsg(''); setShowAddModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة رخصة</button>
 </div>

 {expiredCount > 0 && (
 <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
 <p style={{ color: '#EF4444', margin: 0, fontSize: 14 }}><IconRenderer name="ICON_Siren" size={18} /> تنبيه: يوجد {expiredCount} رخصة منتهية الصلاحية!</p>
 </div>
 )}
 {expiringSoonCount > 0 && (
 <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
 <p style={{ color: '#F59E0B', margin: 0, fontSize: 14 }}> تنبيه: يوجد {expiringSoonCount} رخصة تنتهي خلال 30 يوم!</p>
 </div>
 )}

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الرخص', value: items.length, icon: '🪪', color: '#C9A227' },
 { label: 'سارية', value: items.filter(i => i.status === 'active' && !isExpired(i.expiry_date)).length, icon: "ICON_CheckCircle", color: '#10B981' },
 { label: 'قاربت على الانتهاء', value: expiringSoonCount, icon: 'Alert<Triangle size={16} />', color: '#F59E0B' },
 { label: 'منتهية', value: expiredCount, icon: "ICON_Siren", color: '#EF4444' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></span><span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
 </div>
 ))}
 </div>

 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
 <input type="text" placeholder="بحث بالاسم أو رقم الرخصة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
 ) : filteredItems.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><CreditCard size={19} color="#3B82F6" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد رخص مسجلة</p>
 <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة أول رخصة</button>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
 <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>السائق</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>رقم الرخصة</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>النوع</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>تاريخ الإصدار</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>تاريخ الانتهاء</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الحالة</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>إجراءات</th>
 </tr>
 </thead>
 <tbody>
 {filteredItems.map((item) => {
 const expired = isExpired(item.expiry_date);
 const expiring = isExpiringSoon(item.expiry_date);
 return (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: expired ? 'rgba(239,68,68,0.03)' : expiring ? 'rgba(245,158,11,0.03)' : 'transparent' }}>
 <td style={{ padding: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, background: expired ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🪪</div>
 <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.driver_name}</p>
 </div>
 </td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13, direction: 'ltr' }}>{item.license_number || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.type || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.issue_date ? new Date(item.issue_date).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: expired ? '#EF4444' : expiring ? '#F59E0B' : 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: expired || expiring ? 700 : 400 }}>{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={{ padding: 16, textAlign: 'center' }}>
 <span style={{ background: expired ? 'rgba(239,68,68,0.1)' : expiring ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: expired ? '#EF4444' : expiring ? '#F59E0B' : '#10B981', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{expired ? 'منتهية' : expiring ? 'قاربت' : 'سارية'}</span>
 </td>
 <td style={{ padding: 16, textAlign: 'center' }}>
 <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
 <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
 <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}><IconRenderer name="ICON_Trash2" size={18} /> حذف</button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 )}
 </div>

 {showAddModal && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل' : '🪪 إضافة رخصة جديدة'}</h2>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم السائق *</label><input value={formData.driver_name} onChange={e => setFormData({ ...formData, driver_name: e.target.value })} placeholder="اسم السائق" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الرخصة</label><input value={formData.license_number} onChange={e => setFormData({ ...formData, license_number: e.target.value })} style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label><select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="" style={{ background: '#06060E' }}>اختر</option><option value="private" style={{ background: '#06060E' }}>خاصة</option><option value="public" style={{ background: '#06060E' }}>عامة</option><option value="heavy" style={{ background: '#06060E' }}>نقل ثقيل</option></select></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ الإصدار</label><input type="date" value={formData.issue_date} onChange={e => setFormData({ ...formData, issue_date: e.target.value })} style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ الانتهاء</label><input type="date" value={formData.expiry_date} onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} style={inputStyle} /></div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-start' }}>
 <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : 'Save حفظ الرخصة'}</button>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
