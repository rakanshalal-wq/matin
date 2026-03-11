'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function SurveysPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', target_audience: 'all', questions_count: '', responses_count: '0', start_date: '', end_date: '', status: 'draft' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/surveys', { headers: getHeaders() });
      const result = await res.json();
      setData(result || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.title) return alert('عنوان الاستبيان مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/surveys', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ title: '', description: '', target_audience: 'all', questions_count: '', responses_count: '0', start_date: '', end_date: '', status: 'draft' }); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await fetch(`/api/surveys?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ title: item.title || '', description: item.description || '', target_audience: item.target_audience || 'all', questions_count: item.questions_count?.toString() || '', responses_count: item.responses_count?.toString() || '0', start_date: item.start_date ? item.start_date.split('T')[0] : '', end_date: item.end_date ? item.end_date.split('T')[0] : '', status: item.status || 'draft' });
    setShowModal(true);
  };

  const isExpired = (date: string) => { if (!date) return false; return new Date(date) < new Date(); };
  const isActive = (item: any) => item.status === 'active' && !isExpired(item.end_date);

  const filtered = data.filter((item: any) => item.title?.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase()));

  const totalResponses = data.reduce((sum: number, d: any) => sum + (parseInt(d.responses_count) || 0), 0);

  const stats = {
    total: data.length,
    active: data.filter((d: any) => isActive(d)).length,
    draft: data.filter((d: any) => d.status === 'draft').length,
    totalResponses,
  };

  const audienceLabels: any = { all: 'الجميع', students: 'الطلاب', teachers: 'المعلمين', parents: 'أولياء الأمور', employees: 'الموظفين' };
  const audienceIcons: any = { all: '👥', students: '🎓', teachers: '👨‍🏫', parents: '👨‍👩‍👧', employees: '👔' };
  const statusLabels: any = { draft: 'مسودة', active: 'نشط', closed: 'مغلق', archived: 'مؤرشف' };
  const statusColors: any = { draft: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, active: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, closed: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, archived: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' } };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>📊 الاستبيانات</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إنشاء وإدارة الاستبيانات واستطلاعات الرأي</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ title: '', description: '', target_audience: 'all', questions_count: '', responses_count: '0', start_date: '', end_date: '', status: 'draft' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          ➕ إنشاء استبيان
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الاستبيانات', value: stats.total, icon: '📊', color: '#C9A227' },
          { label: 'نشط', value: stats.active, icon: '✅', color: '#10B981' },
          { label: 'مسودة', value: stats.draft, icon: '📝', color: '#6B7280' },
          { label: 'إجمالي الردود', value: stats.totalResponses, icon: '💬', color: '#3B82F6' },
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
        <input placeholder="🔍 بحث بالعنوان أو الوصف..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      {/* Survey Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12, gridColumn: '1 / -1' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12, gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد استبيانات</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إنشاء استبيان" لإنشاء أول استبيان</p>
          </div>
        ) : filtered.map((item: any) => (
          <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, borderRight: `4px solid ${isActive(item) ? '#10B981' : isExpired(item.end_date) ? '#EF4444' : '#6B7280'}` }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{item.title}</span>
                  {isActive(item) && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>{item.description ? item.description.substring(0, 70) + (item.description.length > 70 ? '...' : '') : 'لا يوجد وصف'}</p>
              </div>
              <span style={{ background: isExpired(item.end_date) && item.status === 'active' ? 'rgba(239,68,68,0.1)' : statusColors[item.status]?.bg, color: isExpired(item.end_date) && item.status === 'active' ? '#EF4444' : statusColors[item.status]?.color, padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {isExpired(item.end_date) && item.status === 'active' ? 'منتهي' : statusLabels[item.status] || item.status}
              </span>
            </div>

            {/* Info Row */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>{audienceIcons[item.target_audience] || '👥'}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{audienceLabels[item.target_audience] || item.target_audience}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>❓</span>
                <span style={{ color: '#C9A227', fontWeight: 700, fontSize: 13 }}>{item.questions_count || 0}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>سؤال</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>💬</span>
                <span style={{ color: '#3B82F6', fontWeight: 700, fontSize: 13 }}>{item.responses_count || 0}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>رد</span>
              </div>
            </div>

            {/* Response Progress */}
            {parseInt(item.questions_count) > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>معدل المشاركة</span>
                  <span style={{ color: '#10B981', fontSize: 11, fontWeight: 600 }}>{item.responses_count || 0} رد</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(((parseInt(item.responses_count) || 0) / 100) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #C9A227, #10B981)', borderRadius: 3 }} />
                </div>
              </div>
            )}

            {/* Dates */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
              {item.start_date && (
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>📅 من: {new Date(item.start_date).toLocaleDateString('ar-SA')}</div>
              )}
              {item.end_date && (
                <div style={{ color: isExpired(item.end_date) ? '#EF4444' : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: isExpired(item.end_date) ? 700 : 400 }}>📅 إلى: {new Date(item.end_date).toLocaleDateString('ar-SA')}{isExpired(item.end_date) && ' ⛔'}</div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
              <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✏️ تعديل</button>
              <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑️ حذف</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? '✏️ تعديل استبيان' : '➕ إنشاء استبيان جديد'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عنوان الاستبيان *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="عنوان الاستبيان" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الفئة المستهدفة</label>
                <select value={form.target_audience} onChange={e => setForm({ ...form, target_audience: e.target.value })} style={inputStyle}>
                  <option value="all">الجميع 👥</option>
                  <option value="students">الطلاب 🎓</option>
                  <option value="teachers">المعلمين 👨‍🏫</option>
                  <option value="parents">أولياء الأمور 👨‍👩‍👧</option>
                  <option value="employees">الموظفين 👔</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عدد الأسئلة</label>
                <input type="number" value={form.questions_count} onChange={e => setForm({ ...form, questions_count: e.target.value })} style={inputStyle} placeholder="0" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ البداية</label>
                <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ النهاية</label>
                <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="وصف الاستبيان والهدف منه..." />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="draft">مسودة</option>
                  <option value="active">نشط</option>
                  <option value="closed">مغلق</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? '💾 تحديث' : '➕ إنشاء'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
