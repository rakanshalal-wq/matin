'use client';
import { CheckCircle, ClipboardList, Pencil, Pill, Plus, Save, Search, Trash2, X } from "lucide-react";
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";

export default function ClinicPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ patient_name: '', visit_type: 'checkup', symptoms: '', diagnosis: '', treatment: '', doctor_name: '', visit_date: '', status: 'open' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/clinic', { headers: getHeaders() });
      const result = await res.json();
      setData(result || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.patient_name) return alert('اسم المريض مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/clinic', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ patient_name: '', visit_type: 'checkup', symptoms: '', diagnosis: '', treatment: '', doctor_name: '', visit_date: '', status: 'open' }); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await fetch(`/api/clinic?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ patient_name: item.patient_name || '', visit_type: item.visit_type || 'checkup', symptoms: item.symptoms || '', diagnosis: item.diagnosis || '', treatment: item.treatment || '', doctor_name: item.doctor_name || '', visit_date: item.visit_date ? item.visit_date.split('T')[0] : '', status: item.status || 'open' });
    setShowModal(true);
  };

  const filtered = data.filter((item: any) => item.patient_name?.toLowerCase().includes(search.toLowerCase()) || item.doctor_name?.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: data.length,
    open: data.filter((d: any) => d.status === 'open').length,
    in_progress: data.filter((d: any) => d.status === 'in_progress').length,
    closed: data.filter((d: any) => d.status === 'closed').length,
  };

  const visitLabels: any = { checkup: 'فحص عام', emergency: 'طوارئ', followup: 'متابعة', dental: 'أسنان', eye: 'عيون', other: 'أخرى' };
  const statusLabels: any = { open: 'مفتوحة', in_progress: 'جاري العلاج', closed: 'مغلقة' };
  const statusColors: any = { open: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, in_progress: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, closed: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' } };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_Hospital" size={18} /> العيادة المدرسية</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة زيارات العيادة والتشخيص والعلاج</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ patient_name: '', visit_type: 'checkup', symptoms: '', diagnosis: '', treatment: '', doctor_name: '', visit_date: '', status: 'open' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          Plus تسجيل زيارة
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الزيارات', value: stats.total, icon: '<IconRenderer name="ICON_Hospital" size={18} />', color: '#C9A227' },
          { label: 'مفتوحة', value: stats.open, icon: "ICON_ClipboardList", color: '#3B82F6' },
          { label: 'جاري العلاج', value: stats.in_progress, icon: "ICON_Pill", color: '#F59E0B' },
          { label: 'مغلقة', value: stats.closed, icon: "ICON_CheckCircle", color: '#10B981' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></div>
            <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input placeholder="Search بحث بالاسم أو الطبيب..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}><IconRenderer name="ICON_Hospital" size={18} /></div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد زيارات مسجلة</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "تسجيل زيارة" لإضافة زيارة جديدة</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['المريض', 'نوع الزيارة', 'الأعراض', 'التشخيص', 'العلاج', 'الطبيب', 'التاريخ', 'الحالة', 'إجراءات'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name="ICON_Hospital" size={18} /></div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.patient_name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{visitLabels[item.visit_type] || item.visit_type}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.symptoms ? item.symptoms.substring(0, 30) + (item.symptoms.length > 30 ? '...' : '') : '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.diagnosis ? item.diagnosis.substring(0, 30) + (item.diagnosis.length > 30 ? '...' : '') : '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.treatment ? item.treatment.substring(0, 30) + (item.treatment.length > 30 ? '...' : '') : '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.doctor_name || '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.visit_date ? new Date(item.visit_date).toLocaleDateString('ar-SA') : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Trash2" size={18} /> حذف</button>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل زيارة' : 'Plus تسجيل زيارة جديدة'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم المريض *</label>
                <input value={form.patient_name} onChange={e => setForm({ ...form, patient_name: e.target.value })} style={inputStyle} placeholder="اسم الطالب أو الموظف" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>نوع الزيارة</label>
                <select value={form.visit_type} onChange={e => setForm({ ...form, visit_type: e.target.value })} style={inputStyle}>
                  <option value="checkup">فحص عام</option>
                  <option value="emergency">طوارئ</option>
                  <option value="followup">متابعة</option>
                  <option value="dental">أسنان</option>
                  <option value="eye">عيون</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الطبيب</label>
                <input value={form.doctor_name} onChange={e => setForm({ ...form, doctor_name: e.target.value })} style={inputStyle} placeholder="اسم الطبيب المعالج" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ الزيارة</label>
                <input type="datetime-local" value={form.visit_date} onChange={e => setForm({ ...form, visit_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="open">مفتوحة</option>
                  <option value="in_progress">جاري العلاج</option>
                  <option value="closed">مغلقة</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الأعراض</label>
                <textarea value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="وصف الأعراض..." />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>التشخيص</label>
                <textarea value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="التشخيص الطبي..." />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>العلاج</label>
                <textarea value={form.treatment} onChange={e => setForm({ ...form, treatment: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="الأدوية والعلاج الموصوف..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Plus تسجيل'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
