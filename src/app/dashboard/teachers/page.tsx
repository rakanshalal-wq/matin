'use client';
export const dynamic = 'force-dynamic';
import { School, User, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, SearchBar, Modal, EmptyState, LoadingState } from '../_components';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', employee_id: '', department: '', specialization: '', salary: '', hire_date: '', school_id: '', password: '' });
  const [editData, setEditData] = useState({ id: '', name: '', email: '', phone: '', employee_id: '', department: '', specialization: '', salary: '', hire_date: '' });

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try { const res = await fetch('/api/teachers', { headers: getHeaders(), credentials: 'include' }); const data = await res.json(); setTeachers(Array.isArray(data) ? data : []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!formData.name) return alert('أدخل اسم المعلم');
    setSaving(true);
    try {
      const res = await fetch('/api/teachers', { method: 'POST', headers: getHeaders(), credentials: 'include', body: JSON.stringify(formData) });
      if (res.ok) { setShowAddModal(false); setFormData({ name: '', email: '', phone: '', employee_id: '', department: '', specialization: '', salary: '', hire_date: '', school_id: '', password: '' }); fetchTeachers(); alert('تم إضافة المعلم بنجاح! تم إرسال بيانات الدخول لبريده الإلكتروني'); }
      else { const err = await res.json(); alert(err.error || 'فشل في الإضافة'); }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleView = (teacher: any) => { setSelectedTeacher(teacher); setShowViewModal(true); };

  const handleEditOpen = (teacher: any) => {
    setEditData({ id: teacher.id, name: teacher.name || '', email: teacher.email || '', phone: teacher.phone || '', employee_id: teacher.employee_id || '', department: teacher.department || '', specialization: teacher.specialization || '', salary: teacher.salary || '', hire_date: teacher.hire_date ? teacher.hire_date.split('T')[0] : '' });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editData.name) return alert('أدخل اسم المعلم');
    setSaving(true);
    try {
      const res = await fetch('/api/teachers', { method: 'PUT', headers: getHeaders(), credentials: 'include', body: JSON.stringify(editData) });
      if (res.ok) { setShowEditModal(false); fetchTeachers(); alert('تم تحديث بيانات المعلم بنجاح'); }
      else { const err = await res.json(); alert(err.error || 'فشل التحديث'); }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد من حذف هذا المعلم؟')) return; await fetch(`/api/teachers?id=${id}`, { method: 'DELETE', headers: getHeaders(), credentials: 'include' }); fetchTeachers(); };

  const filtered = teachers.filter(t => { const term = searchTerm.toLowerCase(); return t.name?.toLowerCase().includes(term) || t.email?.toLowerCase().includes(term) || t.specialization?.toLowerCase().includes(term) || t.employee_id?.includes(searchTerm) || t.phone?.includes(searchTerm); });

  const infoRow = (label: string, value: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border2)' }}>
      <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>{label}</span>
      <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>{value || '—'}</span>
    </div>
  );

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="المعلمين"
        subtitle="إدارة بيانات المعلمين والمعلمات في جميع المدارس"
        icon={<School size={20} color="#D4A843" />}
        actions={<button className="btn-gold" onClick={() => setShowAddModal(true)}><Plus size={15} /> إضافة معلم</button>}
      />

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard value={teachers.length} label="إجمالي المعلمين" icon={<School size={17} color="#D4A843" />} color="#D4A843" />
        <StatCard value={new Set(teachers.map(t => t.department).filter(Boolean)).size} label="الأقسام" icon={<School size={17} color="#3B82F6" />} color="#3B82F6" />
        <StatCard value={new Set(teachers.map(t => t.specialization).filter(Boolean)).size} label="التخصصات" icon={<School size={17} color="#10B981" />} color="#10B981" />
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="بحث بالاسم، التخصص، رقم الموظف، أو الجوال..." />

      <div className="dcard">
        {filtered.length === 0 ? (
          <EmptyState icon={<School size={19} color="#3B82F6" />} message="لا يوجد معلمين مسجلين" action={<button className="btn-gold" onClick={() => setShowAddModal(true)}><Plus size={15} /> إضافة أول معلم</button>} />
        ) : (
          <div className="table-wrap">
            <table className="dtable">
              <thead><tr>
                <th>المعلم</th>
                <th style={{ textAlign: 'center' }}>رقم الموظف</th>
                <th style={{ textAlign: 'center' }}>التخصص</th>
                <th style={{ textAlign: 'center' }}>القسم</th>
                <th style={{ textAlign: 'center' }}>الجوال</th>
                <th style={{ textAlign: 'center' }}>المدرسة</th>
                <th style={{ textAlign: 'center' }}>إجراءات</th>
              </tr></thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="stat-icon" style={{ width: 40, height: 40, background: 'rgba(212,168,67,0.1)', border: 'none' }}><School size={16} color="#D4A843" /></div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{t.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{t.employee_id || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{t.specialization || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{t.department || '—'}</td>
                    <td style={{ textAlign: 'center', direction: 'ltr' }}>{t.phone || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{t.school_name || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button className="btn-sm btn-sm-blue" onClick={() => handleView(t)}><Eye size={12} /> عرض</button>
                        <button className="btn-sm btn-sm-gold" onClick={() => handleEditOpen(t)}><Pencil size={12} /> تعديل</button>
                        <button className="btn-sm btn-sm-red" onClick={() => handleDelete(t.id)}><Trash2 size={12} /> حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة معلم جديد" titleIcon={<School size={18} color="#D4A843" />} large>
        <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 20 }}>سيتم إرسال بيانات الدخول تلقائياً لبريد المعلم الإلكتروني</p>
        <div className="form-row">
          <div className="form-full"><label className="form-label">اسم المعلم *</label><input className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="الاسم الكامل" /></div>
          <div><label className="form-label">البريد الإلكتروني *</label><input className="input-field" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="example@email.com" /></div>
          <div><label className="form-label">رقم الجوال</label><input className="input-field" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" /></div>
          <div><label className="form-label">التخصص</label><input className="input-field" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} placeholder="رياضيات، لغة عربية" /></div>
          <div><label className="form-label">القسم</label><input className="input-field" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="العلوم، اللغات" /></div>
          <div><label className="form-label">الراتب</label><input className="input-field" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} placeholder="الراتب الشهري" /></div>
          <div><label className="form-label">تاريخ التعيين</label><input className="input-field" type="date" value={formData.hire_date} onChange={e => setFormData({ ...formData, hire_date: e.target.value })} /></div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleAdd} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : 'حفظ المعلم'}</button>
          <button className="btn-outline" onClick={() => setShowAddModal(false)}>إلغاء</button>
        </div>
      </Modal>

      <Modal open={showViewModal && !!selectedTeacher} onClose={() => setShowViewModal(false)} title="بيانات المعلم" titleIcon={<User size={18} color="#60A5FA" />} large>
        {selectedTeacher && (<>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, background: 'rgba(212,168,67,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><School size={32} color="#D4A843" /></div>
            <h3 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700, margin: 0 }}>{selectedTeacher.name}</h3>
            <p style={{ color: 'var(--gold)', fontSize: 14, marginTop: 4 }}>{selectedTeacher.employee_id}</p>
          </div>
          <div className="dcard" style={{ marginBottom: 0 }}><div className="dcard-body">
            {infoRow('البريد الإلكتروني', selectedTeacher.email)}
            {infoRow('رقم الجوال', selectedTeacher.phone)}
            {infoRow('التخصص', selectedTeacher.specialization)}
            {infoRow('القسم', selectedTeacher.department)}
            {infoRow('الراتب', selectedTeacher.salary ? `${selectedTeacher.salary} ريال` : '—')}
            {infoRow('تاريخ التعيين', selectedTeacher.hire_date ? new Date(selectedTeacher.hire_date).toLocaleDateString('ar-SA') : '—')}
            {infoRow('المدرسة', selectedTeacher.school_name)}
            {infoRow('تاريخ الإضافة', selectedTeacher.created_at ? new Date(selectedTeacher.created_at).toLocaleDateString('ar-SA') : '—')}
          </div></div>
          <div className="modal-footer">
            <button className="btn-gold" onClick={() => { setShowViewModal(false); handleEditOpen(selectedTeacher); }}><Pencil size={14} /> تعديل البيانات</button>
            <button className="btn-outline" onClick={() => setShowViewModal(false)}>إغلاق</button>
          </div>
        </>)}
      </Modal>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="تعديل بيانات المعلم" titleIcon={<Pencil size={18} color="#D4A843" />} large>
        <div className="form-row">
          <div className="form-full"><label className="form-label">اسم المعلم *</label><input className="input-field" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} /></div>
          <div><label className="form-label">رقم الموظف</label><input className="input-field" value={editData.employee_id} onChange={e => setEditData({ ...editData, employee_id: e.target.value })} /></div>
          <div><label className="form-label">البريد الإلكتروني</label><input className="input-field" type="email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} /></div>
          <div><label className="form-label">رقم الجوال</label><input className="input-field" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} /></div>
          <div><label className="form-label">التخصص</label><input className="input-field" value={editData.specialization} onChange={e => setEditData({ ...editData, specialization: e.target.value })} /></div>
          <div><label className="form-label">القسم</label><input className="input-field" value={editData.department} onChange={e => setEditData({ ...editData, department: e.target.value })} /></div>
          <div><label className="form-label">الراتب</label><input className="input-field" value={editData.salary} onChange={e => setEditData({ ...editData, salary: e.target.value })} /></div>
          <div><label className="form-label">تاريخ التعيين</label><input className="input-field" type="date" value={editData.hire_date} onChange={e => setEditData({ ...editData, hire_date: e.target.value })} /></div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleEditSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</button>
          <button className="btn-outline" onClick={() => setShowEditModal(false)}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
