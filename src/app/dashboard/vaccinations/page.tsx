'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function VaccinationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ student_name: '', vaccine_name: '', dose_number: '1', date: '', next_dose_date: '', administered_by: '', status: 'completed' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/vaccinations', { headers: getHeaders() });
      const result = await res.json();
      setData(result || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.student_name || !form.vaccine_name) return alert('اسم الطالب واسم التطعيم مطلوبين');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/vaccinations', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ student_name: '', vaccine_name: '', dose_number: '1', date: '', next_dose_date: '', administered_by: '', status: 'completed' }); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await fetch(`/api/vaccinations?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ student_name: item.student_name || '', vaccine_name: item.vaccine_name || '', dose_number: item.dose_number?.toString() || '1', date: item.date ? item.date.split('T')[0] : '', next_dose_date: item.next_dose_date ? item.next_dose_date.split('T')[0] : '', administered_by: item.administered_by || '', status: item.status || 'completed' });
    setShowModal(true);
  };

  const isDueNow = (date: string) => { if (!date) return false; const diff = new Date(date).getTime() - new Date().getTime(); return diff > 0 && diff < 14 * 24 * 60 * 60 * 1000; };
  const isOverdue = (date: string) => { if (!date) return false; return new Date(date) < new Date(); };

  const filtered = data.filter((item: any) => item.student_name?.toLowerCase().includes(search.toLowerCase()) || item.vaccine_name?.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: data.length,
    completed: data.filter((d: any) => d.status === 'completed').length,
    pending: data.filter((d: any) => d.status === 'pending').length,
    overdue: data.filter((d: any) => d.status === 'pending' && isOverdue(d.next_dose_date)).length,
  };

  const statusLabels: any = { completed: 'مكتمل', pending: 'بانتظار جرعة', exempted: 'معفى', cancelled: 'ملغي' };
  const statusColors: any = { completed: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, exempted: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }, cancelled: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' } };

  const commonVaccines = ['الجدري المائي', 'الحصبة MMR', 'شلل الأطفال', 'الكبد الوبائي ب', 'الكبد الوبائي أ', 'السحائي', 'الإنفلونزا الموسمية', 'كورونا COVID-19', 'الثلاثي البكتيري DTP', 'المكورات الرئوية', 'الروتا'];

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Alert Boxes */}
      {stats.overdue > 0 && (
        <div style={{ background: 'rgba(185,28,28,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🚨</span>
          <div>
            <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 15 }}>تنبيه! يوجد {stats.overdue} تطعيم متأخر</div>
            <div style={{ color: 'rgba(239,68,68,0.8)', fontSize: 13, marginTop: 2 }}>يرجى متابعة التطعيمات المتأخرة فوراً</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>💉 التطعيمات</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>متابعة تطعيمات الطلاب والجرعات المطلوبة</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ student_name: '', vaccine_name: '', dose_number: '1', date: '', next_dose_date: '', administered_by: '', status: 'completed' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          ➕ تسجيل تطعيم
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي التطعيمات', value: stats.total, icon: '💉', color: '#C9A227' },
          { label: 'مكتمل', value: stats.completed, icon: '✅', color: '#10B981' },
          { label: 'بانتظار جرعة', value: stats.pending, icon: '⏳', color: '#F59E0B' },
          { label: 'متأخر', value: stats.overdue, icon: '🚨', color: '#EF4444' },
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
        <input placeholder="🔍 بحث بالاسم أو التطعيم..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💉</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد تطعيمات مسجلة</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "تسجيل تطعيم" لإضافة تطعيم جديد</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['الطالب', 'التطعيم', 'رقم الجرعة', 'تاريخ التطعيم', 'الجرعة القادمة', 'المسؤول', 'الحالة', 'إجراءات'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: item.status === 'pending' && isOverdue(item.next_dose_date) ? 'rgba(185,28,28,0.05)' : item.status === 'pending' && isDueNow(item.next_dose_date) ? 'rgba(245,158,11,0.03)' : 'transparent' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💉</div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.student_name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#C9A227', fontWeight: 600, fontSize: 14 }}>{item.vaccine_name}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '4px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                      الجرعة {item.dose_number || 1}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.date ? new Date(item.date).toLocaleDateString('ar-SA') : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {item.next_dose_date ? (
                      <span style={{ color: isOverdue(item.next_dose_date) ? '#EF4444' : isDueNow(item.next_dose_date) ? '#F59E0B' : 'rgba(255,255,255,0.6)', fontWeight: isOverdue(item.next_dose_date) || isDueNow(item.next_dose_date) ? 700 : 400, fontSize: 13 }}>
                        {new Date(item.next_dose_date).toLocaleDateString('ar-SA')}
                        {isOverdue(item.next_dose_date) && ' ⛔ متأخر'}
                        {isDueNow(item.next_dose_date) && ' ⚠️ قريباً'}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.administered_by || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✏️ تعديل</button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑️ حذف</button>
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
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? '✏️ تعديل تطعيم' : '➕ تسجيل تطعيم جديد'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الطالب *</label>
                <input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} style={inputStyle} placeholder="اسم الطالب" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم التطعيم *</label>
                <select value={form.vaccine_name} onChange={e => setForm({ ...form, vaccine_name: e.target.value })} style={inputStyle}>
                  <option value="">— اختر التطعيم —</option>
                  {commonVaccines.map(v => <option key={v} value={v}>{v}</option>)}
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الجرعة</label>
                <select value={form.dose_number} onChange={e => setForm({ ...form, dose_number: e.target.value })} style={inputStyle}>
                  <option value="1">الجرعة 1</option>
                  <option value="2">الجرعة 2</option>
                  <option value="3">الجرعة 3</option>
                  <option value="4">الجرعة 4 (تنشيطية)</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ التطعيم</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ الجرعة القادمة</label>
                <input type="date" value={form.next_dose_date} onChange={e => setForm({ ...form, next_dose_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المسؤول عن التطعيم</label>
                <input value={form.administered_by} onChange={e => setForm({ ...form, administered_by: e.target.value })} style={inputStyle} placeholder="اسم الممرض أو الطبيب" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="completed">مكتمل</option>
                  <option value="pending">بانتظار جرعة</option>
                  <option value="exempted">معفى</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? '💾 تحديث' : '➕ تسجيل'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
