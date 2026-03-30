'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { Eye, Pencil, Plus, Save, School, Search, Trash2, User, X } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';

export default function TeachersPage() {
 const [teachers, setTeachers] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [showAddModal, setShowAddModal] = useState(false);
 const [showViewModal, setShowViewModal] = useState(false);
 const [showEditModal, setShowEditModal] = useState(false);
 const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
 const [saving, setSaving] = useState(false);
 const [formData, setFormData] = useState({
 name: '', email: '', phone: '', employee_id: '', department: '',
 specialization: '', salary: '', hire_date: '', school_id: '', password: ''
 });
 const [editData, setEditData] = useState({
 id: '', name: '', email: '', phone: '', employee_id: '', department: '',
 specialization: '', salary: '', hire_date: ''
 });

 useEffect(() => { fetchTeachers(); }, []);

 const fetchTeachers = async () => {
 try {
 const res = await fetch('/api/teachers', { headers: getHeaders(), credentials: 'include' });
 const data = await res.json();
 setTeachers(Array.isArray(data) ? data : []);
 } catch (error) { console.error('Error:', error); }
 finally { setLoading(false); }
 };

 const handleAdd = async () => {
 if (!formData.name) return alert('أدخل اسم المعلم');
 setSaving(true);
 try {
 const res = await fetch('/api/teachers', { method: 'POST', headers: getHeaders(), credentials: 'include', body: JSON.stringify(formData) });
 if (res.ok) {
 setShowAddModal(false);
 setFormData({ name: '', email: '', phone: '', employee_id: '', department: '', specialization: '', salary: '', hire_date: '', school_id: '', password: '' });
 fetchTeachers();
 alert('تم إضافة المعلم بنجاح! تم إرسال بيانات الدخول لبريده الإلكتروني');
 } else { const err = await res.json(); alert(err.error || 'فشل في الإضافة'); }
 } catch (error) { console.error('Error:', error); }
 finally { setSaving(false); }
 };

 const handleView = (teacher: any) => {
 setSelectedTeacher(teacher);
 setShowViewModal(true);
 };

 const handleEditOpen = (teacher: any) => {
 setEditData({
 id: teacher.id,
 name: teacher.name || '',
 email: teacher.email || '',
 phone: teacher.phone || '',
 employee_id: teacher.employee_id || '',
 department: teacher.department || '',
 specialization: teacher.specialization || '',
 salary: teacher.salary || '',
 hire_date: teacher.hire_date ? teacher.hire_date.split('T')[0] : '',
 });
 setShowEditModal(true);
 };

 const handleEditSave = async () => {
 if (!editData.name) return alert('أدخل اسم المعلم');
 setSaving(true);
 try {
 const res = await fetch('/api/teachers', {
 method: 'PUT',
 headers: getHeaders(),
 credentials: 'include',
 body: JSON.stringify(editData),
 });
 if (res.ok) {
 setShowEditModal(false);
 fetchTeachers();
 alert('تم تحديث بيانات المعلم بنجاح');
 } else { const err = await res.json(); alert(err.error || 'فشل التحديث'); }
 } catch (error) { console.error('Error:', error); }
 finally { setSaving(false); }
 };

 const handleDelete = async (id: string) => {
 if (!confirm('هل أنت متأكد من حذف هذا المعلم؟')) return;
 try {
 await fetch(`/api/teachers?id=${id}`, { method: 'DELETE', headers: getHeaders(), credentials: 'include' });
 fetchTeachers();
 } catch (error) { console.error('Error:', error); }
 };

 const filteredTeachers = teachers.filter(t =>
 t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 t.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 t.employee_id?.includes(searchTerm) ||
 t.phone?.includes(searchTerm)
 );

 const inputStyle: React.CSSProperties = {
 width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
 borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
 };

 const modalOverlay: React.CSSProperties = {
 position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)',
 display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
 };

 const modalBox: React.CSSProperties = {
 background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
 padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto',
 };

 const infoRow = (label: string, value: string) => (
 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
 <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{label}</span>
 <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{value || '—'}</span>
 </div>
 );

 return (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_School" size={18} /> المعلمين</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة بيانات المعلمين والمعلمات في جميع المدارس</p>
 </div>
 <button onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, #D4A843 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>
 Plus إضافة معلم
 </button>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <span style={{ fontSize: 28 }}>School</span>
 <span style={{ fontSize: 28, fontWeight: 800, color: '#D4A843' }}>{teachers.length}</span>
 </div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>إجمالي المعلمين</p>
 </div>
 </div>

 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
 <input type="text" placeholder="بحث بالاسم، التخصص، رقم الموظف، أو الجوال..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
 ) : filteredTeachers.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(59,130,246,0.15)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><School size={20} color="#3B82F6" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا يوجد معلمين مسجلين</p>
 <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, #D4A843 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة أول معلم</button>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
 <th style={{ padding: 16, textAlign: 'right', color: '#D4A843', fontWeight: 700 }}>المعلم</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#D4A843', fontWeight: 700 }}>رقم الموظف</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#D4A843', fontWeight: 700 }}>التخصص</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#D4A843', fontWeight: 700 }}>القسم</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#D4A843', fontWeight: 700 }}>الجوال</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#D4A843', fontWeight: 700 }}>المدرسة</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#D4A843', fontWeight: 700 }}>إجراءات</th>
 </tr>
 </thead>
 <tbody>
 {filteredTeachers.map((teacher) => (
 <tr key={teacher.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, background: 'rgba(201,162,39,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}> School</div>
 <div>
 <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{teacher.name}</p>
 <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{teacher.email}</p>
 </div>
 </div>
 </td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{teacher.employee_id}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{teacher.specialization || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{teacher.department || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13, direction: 'ltr' }}>{teacher.phone || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{teacher.school_name || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center' }}>
 <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
 <button onClick={() => handleView(teacher)} style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}><IconRenderer name="ICON_Eye" size={18} /> عرض</button>
 <button onClick={() => handleEditOpen(teacher)} style={{ background: 'rgba(201,162,39,0.1)', color: '#D4A843', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
 <button onClick={() => handleDelete(teacher.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}><IconRenderer name="ICON_Trash2" size={18} /> حذف</button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>

 {/* Add Modal */}
 {showAddModal && (
 <div style={modalOverlay}>
 <div style={modalBox}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: '#D4A843', fontSize: 22, fontWeight: 700, margin: 0 }}><IconRenderer name="ICON_School" size={18} /> إضافة معلم جديد</h2>
 <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
 </div>
 <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 20 }}>سيتم إرسال بيانات الدخول تلقائياً لبريد المعلم الإلكتروني</p>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1 / -1' }}>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم المعلم *</label>
 <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="أدخل اسم المعلم الكامل" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>البريد الإلكتروني *</label>
 <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="example@email.com" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الجوال</label>
 <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>التخصص</label>
 <input value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} placeholder="مثال: رياضيات، لغة عربية" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>القسم</label>
 <input value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="مثال: العلوم، اللغات" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الراتب</label>
 <input value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} placeholder="الراتب الشهري" style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ التعيين</label>
 <input type="date" value={formData.hire_date} onChange={e => setFormData({ ...formData, hire_date: e.target.value })} style={inputStyle} />
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={handleAdd} disabled={saving} style={{ background: 'linear-gradient(135deg, #D4A843 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
 {saving ? '⏳ جاري الحفظ...' : 'Save حفظ المعلم'}
 </button>
 <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}

 {/* View Modal */}
 {showViewModal && selectedTeacher && (
 <div style={modalOverlay}>
 <div style={modalBox}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: '#3B82F6', fontSize: 22, fontWeight: 700, margin: 0 }}><IconRenderer name="ICON_User" size={18} /> بيانات المعلم</h2>
 <button onClick={() => setShowViewModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
 </div>
 <div style={{ textAlign: 'center', marginBottom: 24 }}>
 <div style={{ width: 80, height: 80, background: 'rgba(201,162,39,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 12px' }}> <School size={18} color="#3B82F6" /></div>
 <h3 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{selectedTeacher.name}</h3>
 <p style={{ color: '#D4A843', fontSize: 14, marginTop: 4 }}>{selectedTeacher.employee_id}</p>
 </div>
 <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '8px 20px' }}>
 {infoRow('البريد الإلكتروني', selectedTeacher.email)}
 {infoRow('رقم الجوال', selectedTeacher.phone)}
 {infoRow('التخصص', selectedTeacher.specialization)}
 {infoRow('القسم', selectedTeacher.department)}
 {infoRow('الراتب', selectedTeacher.salary ? `${selectedTeacher.salary} ريال` : '—')}
 {infoRow('تاريخ التعيين', selectedTeacher.hire_date ? new Date(selectedTeacher.hire_date).toLocaleDateString('ar-SA') : '—')}
 {infoRow('المدرسة', selectedTeacher.school_name)}
 {infoRow('تاريخ الإضافة', selectedTeacher.created_at ? new Date(selectedTeacher.created_at).toLocaleDateString('ar-SA') : '—')}
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={() => { setShowViewModal(false); handleEditOpen(selectedTeacher); }} style={{ background: 'linear-gradient(135deg, #D4A843 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل البيانات</button>
 <button onClick={() => setShowViewModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إغلاق</button>
 </div>
 </div>
 </div>
 )}

 {/* Edit Modal */}
 {showEditModal && (
 <div style={modalOverlay}>
 <div style={modalBox}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: '#D4A843', fontSize: 22, fontWeight: 700, margin: 0 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل بيانات المعلم</h2>
 <button onClick={() => setShowEditModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1 / -1' }}>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم المعلم *</label>
 <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الموظف</label>
 <input value={editData.employee_id} onChange={e => setEditData({ ...editData, employee_id: e.target.value })} style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>البريد الإلكتروني</label>
 <input type="email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الجوال</label>
 <input value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>التخصص</label>
 <input value={editData.specialization} onChange={e => setEditData({ ...editData, specialization: e.target.value })} style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>القسم</label>
 <input value={editData.department} onChange={e => setEditData({ ...editData, department: e.target.value })} style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الراتب</label>
 <input value={editData.salary} onChange={e => setEditData({ ...editData, salary: e.target.value })} style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ التعيين</label>
 <input type="date" value={editData.hire_date} onChange={e => setEditData({ ...editData, hire_date: e.target.value })} style={inputStyle} />
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={handleEditSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #D4A843 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
 {saving ? '⏳ جاري الحفظ...' : 'Save حفظ التعديلات'}
 </button>
 <button onClick={() => setShowEditModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
