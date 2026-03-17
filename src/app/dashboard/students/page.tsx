'use client';
import { Eye, GraduationCap, Pencil, Plus, Save, Search, Trash2, User, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";

const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };

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
      student_id: student.student_id || '',
      class_id: student.class_id || '',
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

  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const modalBox: React.CSSProperties = { background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' };

  const infoRow = (label: string, value: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{label}</span>
      <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{value || '—'}</span>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>GraduationCap الطلاب</h1><p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة بيانات الطلاب</p></div>
        <button onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Plus إضافة طالب</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[{ label: 'إجمالي الطلاب', value: students.length, icon: "ICON_GraduationCap", color: '#C9A227' }, { label: 'ذكور', value: students.filter(s => s.gender === 'MALE').length, icon: "ICON_User", color: '#3B82F6' }, { label: 'إناث', value: students.filter(s => s.gender === 'FEMALE').length, icon: "ICON_User", color: '#EC4899' }].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}><IconRenderer name={s.icon} /></span><span style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</span></div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <input type="text" placeholder="Search بحث بالاسم، رقم الطالب، أو الجوال..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
        : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>GraduationCap</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا يوجد طلاب مسجلين</p>
            <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Plus إضافة أول طالب</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>الطالب</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>رقم الطالب</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الجنس</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الجوال</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>المدرسة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st) => (
                <tr key={st.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: st.gender === 'FEMALE' ? 'rgba(236,72,153,0.1)' : 'rgba(59,130,246,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{st.gender === 'FEMALE' ? "ICON_User" : "ICON_User"}</div>
                      <div>
                        <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{st.name || '—'}</p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{st.email || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontSize: 13, fontWeight: 600 }}>{st.student_id}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{st.gender === 'MALE' ? 'ذكر' : 'أنثى'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13, direction: 'ltr' }}>{st.phone || '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{st.school_name || '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button onClick={() => handleView(st)} style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>Eye️ عرض</button>
                      <button onClick={() => handleEditOpen(st)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>Pencil️ تعديل</button>
                      <button onClick={() => handleDelete(st.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>Trash2️ حذف</button>
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
              <h2 style={{ color: '#C9A227', fontSize: 22, fontWeight: 700, margin: 0 }}>GraduationCap إضافة طالب جديد</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 20 }}>سيتم إرسال بيانات الدخول تلقائياً لبريد الطالب الإلكتروني</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الطالب *</label>
                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="الاسم الكامل" style={inputStyle} />
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
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الهوية</label>
                <input value={formData.national_id} onChange={e => setFormData({ ...formData, national_id: e.target.value })} placeholder="رقم الهوية" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الجنس</label>
                <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} style={{ ...inputStyle, appearance: 'auto' as any }}>
                  <option value="MALE">ذكر</option><option value="FEMALE">أنثى</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ الميلاد</label>
                <input type="date" value={formData.date_of_birth} onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الفصل الدراسي</label>
                <select value={formData.class_id} onChange={e => setFormData({ ...formData, class_id: e.target.value })} style={{ ...inputStyle, appearance: 'auto' as any }}>
                  <option value="">-- بدون فصل --</option>
                  {classes.map((cl: any) => <option key={cl.id} value={cl.id}>{cl.name_ar} - {cl.grade}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={handleAdd} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? '⏳ جاري الحفظ...' : 'Save تسجيل الطالب'}
              </button>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedStudent && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#3B82F6', fontSize: 22, fontWeight: 700, margin: 0 }}>Eye️ بيانات الطالب</h2>
              <button onClick={() => setShowViewModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 80, height: 80, background: selectedStudent.gender === 'FEMALE' ? 'rgba(236,72,153,0.15)' : 'rgba(59,130,246,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 12px' }}>{selectedStudent.gender === 'FEMALE' ? "ICON_User" : "ICON_User"}</div>
              <h3 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{selectedStudent.name}</h3>
              <p style={{ color: '#C9A227', fontSize: 14, marginTop: 4 }}>{selectedStudent.student_id}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '8px 20px' }}>
              {infoRow('البريد الإلكتروني', selectedStudent.email)}
              {infoRow('رقم الجوال', selectedStudent.phone)}
              {infoRow('رقم الهوية', selectedStudent.national_id)}
              {infoRow('الجنس', selectedStudent.gender === 'MALE' ? 'ذكر' : 'أنثى')}
              {infoRow('تاريخ الميلاد', selectedStudent.date_of_birth ? new Date(selectedStudent.date_of_birth).toLocaleDateString('ar-SA') : '—')}
              {infoRow('المدرسة', selectedStudent.school_name)}
              {infoRow('تاريخ التسجيل', selectedStudent.created_at ? new Date(selectedStudent.created_at).toLocaleDateString('ar-SA') : '—')}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => { setShowViewModal(false); handleEditOpen(selectedStudent); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Pencil️ تعديل البيانات</button>
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
              <h2 style={{ color: '#C9A227', fontSize: 22, fontWeight: 700, margin: 0 }}>Pencil️ تعديل بيانات الطالب</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الطالب *</label>
                <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الطالب</label>
                <input value={editData.student_id} onChange={e => setEditData({ ...editData, student_id: e.target.value })} style={inputStyle} />
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
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الهوية</label>
                <input value={editData.national_id} onChange={e => setEditData({ ...editData, national_id: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الجنس</label>
                <select value={editData.gender} onChange={e => setEditData({ ...editData, gender: e.target.value })} style={{ ...inputStyle, appearance: 'auto' as any }}>
                  <option value="MALE">ذكر</option><option value="FEMALE">أنثى</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ الميلاد</label>
                <input type="date" value={editData.date_of_birth} onChange={e => setEditData({ ...editData, date_of_birth: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الفصل الدراسي</label>
                <select value={editData.class_id} onChange={e => setEditData({ ...editData, class_id: e.target.value })} style={{ ...inputStyle, appearance: 'auto' as any }}>
                  <option value="">-- بدون فصل --</option>
                  {classes.map((cl: any) => <option key={cl.id} value={cl.id}>{cl.name_ar} - {cl.grade}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={handleEditSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
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
