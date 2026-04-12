'use client';
export const dynamic = 'force-dynamic';
import { GraduationCap, User, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, SearchBar, Modal, EmptyState, LoadingState } from '../_components';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', national_id: '', gender: 'MALE', date_of_birth: '', class_id: '' });
  const [classes, setClasses] = useState<any[]>([]);
  const [editData, setEditData] = useState({ id: '', name: '', email: '', phone: '', national_id: '', gender: 'MALE', date_of_birth: '', student_id: '', class_id: '' });

  useEffect(() => { fetchStudents(); fetchClasses(); }, []);

  const fetchClasses = async () => {
    try { const res = await fetch('/api/classes', { headers: getHeaders() }); const data = await res.json(); setClasses(Array.isArray(data) ? data : []); }
    catch (e) { console.error(e); }
  };
  const fetchStudents = async () => {
    try { const res = await fetch('/api/students', { headers: getHeaders(), credentials: 'include' }); const data = await res.json(); setStudents(Array.isArray(data) ? data : []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!formData.name) return alert('أدخل اسم الطالب');
    setSaving(true);
    try {
      const res = await fetch('/api/students', { method: 'POST', headers: getHeaders(), credentials: 'include', body: JSON.stringify(formData) });
      if (res.ok) { setShowAddModal(false); setFormData({ name: '', email: '', phone: '', national_id: '', gender: 'MALE', date_of_birth: '', class_id: '' }); fetchStudents(); alert('تم تسجيل الطالب بنجاح! تم إرسال بيانات الدخول لبريده الإلكتروني'); }
      else { const err = await res.json(); alert(err.error || 'فشل'); }
    } catch (e) { alert('خطأ في الاتصال'); } finally { setSaving(false); }
  };

  const handleView = (student: any) => { setSelectedStudent(student); setShowViewModal(true); };

  const handleEditOpen = (student: any) => {
    setEditData({
      id: student.id, name: student.name || '', email: student.email || '', phone: student.phone || '',
      national_id: student.national_id || '', gender: student.gender || 'MALE',
      date_of_birth: student.date_of_birth ? student.date_of_birth.split('T')[0] : '',
      student_id: student.student_id || '', class_id: student.class_id || '',
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editData.name) return alert('أدخل اسم الطالب');
    setSaving(true);
    try {
      const res = await fetch('/api/students', { method: 'PUT', headers: getHeaders(), credentials: 'include', body: JSON.stringify(editData) });
      if (res.ok) { setShowEditModal(false); fetchStudents(); alert('تم تحديث بيانات الطالب بنجاح'); }
      else { const err = await res.json(); alert(err.error || 'فشل التحديث'); }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) return; await fetch('/api/students?id=' + id, { method: 'DELETE', headers: getHeaders(), credentials: 'include' }); fetchStudents(); };

  const filtered = students.filter(t => { const term = searchTerm.toLowerCase(); return t.name?.toLowerCase().includes(term) || t.phone?.includes(searchTerm) || t.student_id?.includes(searchTerm) || t.email?.toLowerCase().includes(term); });

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
        title="الطلاب"
        subtitle="إدارة بيانات الطلاب"
        icon={<GraduationCap size={20} color="#D4A843" />}
        actions={
          <button className="btn-gold" onClick={() => setShowAddModal(true)}>
            <Plus size={15} /> إضافة طالب
          </button>
        }
      />

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard value={students.length} label="إجمالي الطلاب" icon={<GraduationCap size={17} color="#D4A843" />} color="#D4A843" />
        <StatCard value={students.filter(s => s.gender === 'MALE').length} label="ذكور" icon={<User size={17} color="#3B82F6" />} color="#3B82F6" />
        <StatCard value={students.filter(s => s.gender === 'FEMALE').length} label="إناث" icon={<User size={17} color="#EC4899" />} color="#EC4899" />
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="بحث بالاسم، رقم الطالب، أو الجوال..." />

      <div className="dcard">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<GraduationCap size={19} color="#D4A843" />}
            message="لا يوجد طلاب مسجلين"
            action={<button className="btn-gold" onClick={() => setShowAddModal(true)}><Plus size={15} /> إضافة أول طالب</button>}
          />
        ) : (
          <div className="table-wrap">
            <table className="dtable">
              <thead>
                <tr>
                  <th>الطالب</th>
                  <th style={{ textAlign: 'center' }}>رقم الطالب</th>
                  <th style={{ textAlign: 'center' }}>الجنس</th>
                  <th style={{ textAlign: 'center' }}>الجوال</th>
                  <th style={{ textAlign: 'center' }}>المدرسة</th>
                  <th style={{ textAlign: 'center' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((st) => (
                  <tr key={st.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="stat-icon" style={{ width: 40, height: 40, background: st.gender === 'FEMALE' ? 'rgba(236,72,153,0.1)' : 'rgba(59,130,246,0.1)', border: 'none' }}>
                          <User size={16} color={st.gender === 'FEMALE' ? '#EC4899' : '#3B82F6'} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{st.name || '—'}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{st.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 600 }}>{st.student_id}</td>
                    <td style={{ textAlign: 'center' }}>{st.gender === 'MALE' ? 'ذكر' : 'أنثى'}</td>
                    <td style={{ textAlign: 'center', direction: 'ltr' }}>{st.phone || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{st.school_name || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button className="btn-sm btn-sm-blue" onClick={() => handleView(st)}><Eye size={12} /> عرض</button>
                        <button className="btn-sm btn-sm-gold" onClick={() => handleEditOpen(st)}><Pencil size={12} /> تعديل</button>
                        <button className="btn-sm btn-sm-red" onClick={() => handleDelete(st.id)}><Trash2 size={12} /> حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة طالب جديد" titleIcon={<GraduationCap size={18} color="#D4A843" />} large>
        <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 20 }}>سيتم إرسال بيانات الدخول تلقائياً لبريد الطالب الإلكتروني</p>
        <div className="form-row">
          <div className="form-full">
            <label className="form-label">اسم الطالب *</label>
            <input className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="الاسم الكامل" />
          </div>
          <div>
            <label className="form-label">البريد الإلكتروني *</label>
            <input className="input-field" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="example@email.com" />
          </div>
          <div>
            <label className="form-label">رقم الجوال</label>
            <input className="input-field" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" />
          </div>
          <div>
            <label className="form-label">رقم الهوية</label>
            <input className="input-field" value={formData.national_id} onChange={e => setFormData({ ...formData, national_id: e.target.value })} placeholder="رقم الهوية" />
          </div>
          <div>
            <label className="form-label">الجنس</label>
            <select className="select-field" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
              <option value="MALE">ذكر</option><option value="FEMALE">أنثى</option>
            </select>
          </div>
          <div>
            <label className="form-label">تاريخ الميلاد</label>
            <input className="input-field" type="date" value={formData.date_of_birth} onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })} />
          </div>
          <div className="form-full">
            <label className="form-label">الفصل الدراسي</label>
            <select className="select-field" value={formData.class_id} onChange={e => setFormData({ ...formData, class_id: e.target.value })}>
              <option value="">-- بدون فصل --</option>
              {classes.map((cl: any) => <option key={cl.id} value={cl.id}>{cl.name_ar} - {cl.grade}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleAdd} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? 'جاري الحفظ...' : 'تسجيل الطالب'}
          </button>
          <button className="btn-outline" onClick={() => setShowAddModal(false)}>إلغاء</button>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={showViewModal && !!selectedStudent} onClose={() => setShowViewModal(false)} title="بيانات الطالب" titleIcon={<User size={18} color="#60A5FA" />} large>
        {selectedStudent && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 80, height: 80, background: selectedStudent.gender === 'FEMALE' ? 'rgba(236,72,153,0.15)' : 'rgba(59,130,246,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <User size={32} color={selectedStudent.gender === 'FEMALE' ? '#EC4899' : '#3B82F6'} />
              </div>
              <h3 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700, margin: 0 }}>{selectedStudent.name}</h3>
              <p style={{ color: 'var(--gold)', fontSize: 14, marginTop: 4 }}>{selectedStudent.student_id}</p>
            </div>
            <div className="dcard" style={{ marginBottom: 0 }}>
              <div className="dcard-body">
                {infoRow('البريد الإلكتروني', selectedStudent.email)}
                {infoRow('رقم الجوال', selectedStudent.phone)}
                {infoRow('رقم الهوية', selectedStudent.national_id)}
                {infoRow('الجنس', selectedStudent.gender === 'MALE' ? 'ذكر' : 'أنثى')}
                {infoRow('تاريخ الميلاد', selectedStudent.date_of_birth ? new Date(selectedStudent.date_of_birth).toLocaleDateString('ar-SA') : '—')}
                {infoRow('المدرسة', selectedStudent.school_name)}
                {infoRow('تاريخ التسجيل', selectedStudent.created_at ? new Date(selectedStudent.created_at).toLocaleDateString('ar-SA') : '—')}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-gold" onClick={() => { setShowViewModal(false); handleEditOpen(selectedStudent); }}><Pencil size={14} /> تعديل البيانات</button>
              <button className="btn-outline" onClick={() => setShowViewModal(false)}>إغلاق</button>
            </div>
          </>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="تعديل بيانات الطالب" titleIcon={<Pencil size={18} color="#D4A843" />} large>
        <div className="form-row">
          <div className="form-full">
            <label className="form-label">اسم الطالب *</label>
            <input className="input-field" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label">رقم الطالب</label>
            <input className="input-field" value={editData.student_id} onChange={e => setEditData({ ...editData, student_id: e.target.value })} />
          </div>
          <div>
            <label className="form-label">البريد الإلكتروني</label>
            <input className="input-field" type="email" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />
          </div>
          <div>
            <label className="form-label">رقم الجوال</label>
            <input className="input-field" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} />
          </div>
          <div>
            <label className="form-label">رقم الهوية</label>
            <input className="input-field" value={editData.national_id} onChange={e => setEditData({ ...editData, national_id: e.target.value })} />
          </div>
          <div>
            <label className="form-label">الجنس</label>
            <select className="select-field" value={editData.gender} onChange={e => setEditData({ ...editData, gender: e.target.value })}>
              <option value="MALE">ذكر</option><option value="FEMALE">أنثى</option>
            </select>
          </div>
          <div>
            <label className="form-label">تاريخ الميلاد</label>
            <input className="input-field" type="date" value={editData.date_of_birth} onChange={e => setEditData({ ...editData, date_of_birth: e.target.value })} />
          </div>
          <div className="form-full">
            <label className="form-label">الفصل الدراسي</label>
            <select className="select-field" value={editData.class_id} onChange={e => setEditData({ ...editData, class_id: e.target.value })}>
              <option value="">-- بدون فصل --</option>
              {classes.map((cl: any) => <option key={cl.id} value={cl.id}>{cl.name_ar} - {cl.grade}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleEditSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
          <button className="btn-outline" onClick={() => setShowEditModal(false)}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
