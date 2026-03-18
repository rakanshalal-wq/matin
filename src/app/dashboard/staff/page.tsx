'use client';
import { ClipboardList, GraduationCap, Key, Pencil, Plus, Save, School, Search, Trash2, User, Users, Wrench, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";

export default function StaffPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'teacher', school_id: '', national_id: '' });

  useEffect(() => {
    try { setCurrentUser(JSON.parse(localStorage.getItem('matin_user') || '{}')); } catch {}
    fetchSchools();
  }, []);

  useEffect(() => { if (currentUser) fetchUsers(); }, [currentUser, roleFilter]);

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools-list');
      setSchools(await res.json() || []);
    } catch {}
  };

  const fetchUsers = async () => {
    try {
      let url = '/api/manage-staff?';
      if (currentUser?.role === 'owner' || currentUser?.role === 'admin') {
        url += `school_id=${currentUser.school_id || ''}`;
      }
      if (roleFilter !== 'all') url += `&role=${roleFilter}`;
      const res = await fetch(url);
      setUsers(await res.json() || []);
    } catch {} finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || (!editItem && !form.password)) { alert('الاسم والإيميل والباسورد مطلوبين'); return; }
    if (!form.school_id) { alert('اختر المدرسة'); return; }
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { id: editItem.id, name: form.name, phone: form.phone, role: form.role, status: 'active' } : form;
      const res = await fetch('/api/manage-staff', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'فشلت العملية'); return; }
      fetchUsers(); setShowModal(false); setEditItem(null);
      setForm({ name: '', email: '', password: '', phone: '', role: 'teacher', school_id: '', national_id: '' });
    } catch { alert('خطأ بالاتصال'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    await fetch(`/api/manage-staff?id=${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ name: item.name, email: item.email, password: '', phone: item.phone || '', role: item.role, school_id: item.school_id || '', national_id: '' });
    setShowModal(true);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let pass = '';
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setForm({ ...form, password: pass });
  };

  const filtered = users.filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleLabels: any = { admin: 'مدير', teacher: 'معلم', parent: 'ولي أمر', student: 'طالب' };
  const roleColors: any = { admin: '#3B82F6', teacher: '#10B981', parent: '#F59E0B', student: '#EC4899' };
  const statusLabels: any = { active: 'مفعّل', pending: 'قيد المراجعة', suspended: 'موقوف' };
  const statusColors: any = { active: '#10B981', pending: '#F59E0B', suspended: '#6B7280' };

  const stats = {
    total: users.length,
    teachers: users.filter((u: any) => u.role === 'teacher').length,
    admins: users.filter((u: any) => u.role === 'admin').length,
    students: users.filter((u: any) => u.role === 'student').length,
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_Star" size={18} /><IconRenderer name="ICON_School" size={18} /> إدارة الطاقم</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إضافة وإدارة المعلمين والمدراء والموظفين</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ name: '', email: '', password: '', phone: '', role: 'teacher', school_id: '', national_id: '' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 12, padding: '12px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
          Plus إضافة جديد
        </button>
      </div>

      {/* الإحصائيات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الطاقم', value: stats.total, icon: "ICON_Users", color: '#3B82F6' },
          { label: 'المعلمين', value: stats.teachers, icon: 'User<IconRenderer name="ICON_Star" size={18} />School', color: '#10B981' },
          { label: 'المدراء', value: stats.admins, icon: "ICON_Wrench", color: '#8B5CF6' },
          { label: 'الطلاب', value: stats.students, icon: "ICON_GraduationCap", color: '#EC4899' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 6 }}>{s.label}</div>
                <div style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>{s.value}</div>
              </div>
              <div style={{ fontSize: 28 }}><IconRenderer name={s.icon} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* الفلاتر */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search بحث بالاسم أو الإيميل..." style={{ flex: 1, minWidth: 250, ...inputStyle }} />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="all" style={{background:'#06060E'}}>كل الأدوار</option>
          <option value="admin" style={{background:'#06060E'}}>مدراء</option>
          <option value="teacher" style={{background:'#06060E'}}>معلمين</option>
          <option value="student" style={{background:'#06060E'}}>طلاب</option>
          <option value="parent" style={{background:'#06060E'}}>أولياء أمور</option>
        </select>
      </div>

      {/* الجدول */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>⏳ جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}><IconRenderer name="ICON_Star" size={18} />[School]</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>لا يوجد أعضاء بعد</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 8 }}>اضغط "إضافة جديد" لإضافة معلم أو مدير</div>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['الاسم', 'الإيميل', 'الجوال', 'الدور', 'الحالة', 'إجراءات'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{u.email}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{u.phone || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: `rgba(${roleColors[u.role] === '#3B82F6' ? '59,130,246' : roleColors[u.role] === '#10B981' ? '16,185,129' : roleColors[u.role] === '#F59E0B' ? '245,158,11' : '236,72,153'},0.1)`, color: roleColors[u.role] || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {roleLabels[u.role] || u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: `rgba(${statusColors[u.status] === '#10B981' ? '16,185,129' : statusColors[u.status] === '#F59E0B' ? '245,158,11' : '107,114,128'},0.1)`, color: statusColors[u.status] || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {statusLabels[u.status] || u.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleEdit(u)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
                      <button onClick={() => handleDelete(u.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Trash2" size={18} /> حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal إضافة/تعديل */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل' : 'Plus إضافة عضو جديد'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الاسم الكامل *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} placeholder="الاسم الثلاثي" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الدور *</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{...inputStyle, cursor: 'pointer'}}>
                  <option value="teacher" style={{background:'#06060E'}}><IconRenderer name="ICON_Star" size={18} /><IconRenderer name="ICON_School" size={18} /> معلم</option>
                  <option value="admin" style={{background:'#06060E'}}><IconRenderer name="ICON_Wrench" size={18} /> مدير مدرسة</option>
                  <option value="student" style={{background:'#06060E'}}><IconRenderer name="ICON_GraduationCap" size={18} /> طالب</option>
                  <option value="parent" style={{background:'#06060E'}}><IconRenderer name="ICON_Star" size={18} /><IconRenderer name="ICON_User" size={18} /> ولي أمر</option>
                </select>
              </div>
              {!editItem && (
                <>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>البريد الإلكتروني *</label>
                    <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} placeholder="example@email.com" dir="ltr" />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>كلمة المرور *</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{...inputStyle, flex: 1}} placeholder="كلمة المرور" dir="ltr" />
                      <button onClick={generatePassword} style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: 'none', borderRadius: 8, padding: '0 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}><IconRenderer name="ICON_Key" size={18} /> توليد</button>
                    </div>
                  </div>
                </>
              )}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الجوال</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} placeholder="05XXXXXXXX" dir="ltr" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المدرسة *</label>
                <select value={form.school_id} onChange={e => setForm({...form, school_id: e.target.value})} style={{...inputStyle, cursor: 'pointer'}}>
                  <option value="" style={{background:'#06060E'}}>-- اختر المدرسة --</option>
                  {schools.map((s: any) => (
                    <option key={s.id} value={s.id} style={{background:'#06060E'}}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {!editItem && form.password && (
              <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '12px 16px', marginTop: 16 }}>
                <div style={{ color: '#3B82F6', fontSize: 13, fontWeight: 600 }}><IconRenderer name="ICON_ClipboardList" size={18} /> بيانات الدخول (انسخها وأرسلها للمعلم):</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 6, direction: 'ltr', fontFamily: 'monospace' }}>
                  Email: {form.email}<br />Password: {form.password}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Plus إضافة'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
