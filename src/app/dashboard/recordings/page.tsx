'use client';
import { CheckCircle, Eye, Pencil, Plus, Save, Search, Trash2, Video, X } from "lucide-react";
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function RecordingsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', subject: '', teacher_name: '', class_name: '', duration: '', file_url: '', file_size: '', views_count: '0', date: '', status: 'available' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/recordings', { headers: getHeaders() });
      const result = await res.json();
      setData(result || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.title) return alert('عنوان التسجيل مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/recordings', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ title: '', subject: '', teacher_name: '', class_name: '', duration: '', file_url: '', file_size: '', views_count: '0', date: '', status: 'available' }); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await fetch(`/api/recordings?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ title: item.title || '', subject: item.subject || '', teacher_name: item.teacher_name || '', class_name: item.class_name || '', duration: item.duration || '', file_url: item.file_url || '', file_size: item.file_size || '', views_count: item.views_count?.toString() || '0', date: item.date ? item.date.split('T')[0] : '', status: item.status || 'available' });
    setShowModal(true);
  };

  const filtered = data.filter((item: any) => item.title?.toLowerCase().includes(search.toLowerCase()) || item.subject?.toLowerCase().includes(search.toLowerCase()) || item.teacher_name?.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: data.length,
    available: data.filter((d: any) => d.status === 'available').length,
    processing: data.filter((d: any) => d.status === 'processing').length,
    totalViews: data.reduce((sum: number, d: any) => sum + (parseInt(d.views_count) || 0), 0),
  };

  const statusLabels: any = { available: 'متاح', processing: 'جاري المعالجة', archived: 'مؤرشف', restricted: 'مقيّد' };
  const statusColors: any = { available: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, processing: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, archived: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, restricted: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>Video التسجيلات</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>أرشيف تسجيلات المحاضرات والبثوث المباشرة</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ title: '', subject: '', teacher_name: '', class_name: '', duration: '', file_url: '', file_size: '', views_count: '0', date: '', status: 'available' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          Plus إضافة تسجيل
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي التسجيلات', value: stats.total, icon: "ICON_Video", color: '#C9A227' },
          { label: 'متاح', value: stats.available, icon: "ICON_CheckCircle", color: '#10B981' },
          { label: 'جاري المعالجة', value: stats.processing, icon: '⏳', color: '#F59E0B' },
          { label: 'إجمالي المشاهدات', value: stats.totalViews, icon: 'Eye️', color: '#8B5CF6' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 28 }}>{stat.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input placeholder="Search بحث بالعنوان أو المادة أو المعلم..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>Video</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد تسجيلات</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إضافة تسجيل" لرفع تسجيل جديد</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['التسجيل', 'المادة', 'المعلم', 'الفصل', 'المدة', 'الحجم', 'المشاهدات', 'التاريخ', 'الحالة', 'إجراءات'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>Video</div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#C9A227', fontWeight: 600, fontSize: 14 }}>{item.subject || '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.teacher_name || '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.class_name || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {item.duration ? (
                      <span style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>⏱️ {item.duration}</span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.file_size || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: '#8B5CF6', fontWeight: 700, fontSize: 14 }}>{item.views_count || 0}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}> Eye️</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.date ? new Date(item.date).toLocaleDateString('ar-SA') : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {item.file_url && (
                        <button onClick={() => window.open(item.file_url, '_blank')} style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>▶️ تشغيل</button>
                      )}
                      <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Pencil️</button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Trash2️</button>
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
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil️ تعديل تسجيل' : 'Plus إضافة تسجيل جديد'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عنوان التسجيل *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="عنوان التسجيل" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المادة</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle} placeholder="اسم المادة" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المعلم</label>
                <input value={form.teacher_name} onChange={e => setForm({ ...form, teacher_name: e.target.value })} style={inputStyle} placeholder="اسم المعلم" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الفصل</label>
                <input value={form.class_name} onChange={e => setForm({ ...form, class_name: e.target.value })} style={inputStyle} placeholder="اسم الفصل" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المدة</label>
                <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={inputStyle} placeholder="مثال: 45 دقيقة" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>حجم الملف</label>
                <input value={form.file_size} onChange={e => setForm({ ...form, file_size: e.target.value })} style={inputStyle} placeholder="مثال: 250 MB" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عدد المشاهدات</label>
                <input type="number" value={form.views_count} onChange={e => setForm({ ...form, views_count: e.target.value })} style={inputStyle} placeholder="0" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ التسجيل</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="available">متاح</option>
                  <option value="processing">جاري المعالجة</option>
                  <option value="archived">مؤرشف</option>
                  <option value="restricted">مقيّد</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>رابط الملف</label>
                <input value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} style={inputStyle} placeholder="https://storage.example.com/recording.mp4" />
              </div>
            </div>
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
