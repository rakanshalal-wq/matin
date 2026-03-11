'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function ParentsCouncilPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', type: 'meeting', date: '', location: '', attendees_count: '', agenda: '', notes: '', status: 'scheduled' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/parents-council', { headers: getHeaders() });
      const result = await res.json();
      setData(result || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.title) return alert('العنوان مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/parents-council', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ title: '', type: 'meeting', date: '', location: '', attendees_count: '', agenda: '', notes: '', status: 'scheduled' }); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await fetch(`/api/parents-council?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ title: item.title || '', type: item.type || 'meeting', date: item.date ? item.date.split('T')[0] + 'T' + (item.date.split('T')[1]?.substring(0,5) || '10:00') : '', location: item.location || '', attendees_count: item.attendees_count?.toString() || '', agenda: item.agenda || '', notes: item.notes || '', status: item.status || 'scheduled' });
    setShowModal(true);
  };

  const isUpcoming = (date: string) => { if (!date) return false; return new Date(date) > new Date(); };
  const isPast = (date: string) => { if (!date) return false; return new Date(date) < new Date(); };

  const filtered = data.filter((item: any) => item.title?.toLowerCase().includes(search.toLowerCase()) || item.location?.toLowerCase().includes(search.toLowerCase()));

  const nextMeeting = data.find((d: any) => isUpcoming(d.date) && (d.status === 'scheduled' || d.status === 'confirmed'));

  const stats = {
    total: data.length,
    upcoming: data.filter((d: any) => isUpcoming(d.date) && d.status !== 'cancelled').length,
    completed: data.filter((d: any) => d.status === 'completed').length,
    totalAttendees: data.reduce((sum: number, d: any) => sum + (parseInt(d.attendees_count) || 0), 0),
  };

  const typeLabels: any = { meeting: 'اجتماع', workshop: 'ورشة عمل', seminar: 'ندوة', election: 'انتخابات', event: 'فعالية', training: 'تدريب' };
  const typeIcons: any = { meeting: '🤝', workshop: '🛠️', seminar: '🎤', election: '🗳️', event: '🎉', training: '📋' };
  const typeColors: any = { meeting: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, workshop: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, seminar: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }, election: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, event: { bg: 'rgba(236,72,153,0.1)', color: '#EC4899' }, training: { bg: 'rgba(201,162,39,0.1)', color: '#C9A227' } };
  const statusLabels: any = { scheduled: 'مجدول', confirmed: 'مؤكد', in_progress: 'جاري', completed: 'مكتمل', cancelled: 'ملغي', postponed: 'مؤجل' };
  const statusColors: any = { scheduled: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, confirmed: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, in_progress: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, completed: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, postponed: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' } };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Next Meeting Alert */}
      {nextMeeting && (
        <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>📅</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#10B981', fontWeight: 700, fontSize: 15 }}>الاجتماع القادم: {nextMeeting.title}</div>
            <div style={{ color: 'rgba(16,185,129,0.8)', fontSize: 13, marginTop: 2 }}>
              {nextMeeting.date ? new Date(nextMeeting.date).toLocaleString('ar-SA', { dateStyle: 'long', timeStyle: 'short' }) : ''}
              {nextMeeting.location && ` — 📍 ${nextMeeting.location}`}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>👨‍👩‍👧 مجلس الآباء</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة اجتماعات وفعاليات مجلس الآباء والأمهات</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ title: '', type: 'meeting', date: '', location: '', attendees_count: '', agenda: '', notes: '', status: 'scheduled' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          ➕ إضافة اجتماع
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'الإجمالي', value: stats.total, icon: '👨‍👩‍👧', color: '#C9A227' },
          { label: 'قادمة', value: stats.upcoming, icon: '📅', color: '#3B82F6' },
          { label: 'مكتملة', value: stats.completed, icon: '✅', color: '#10B981' },
          { label: 'إجمالي الحضور', value: stats.totalAttendees, icon: '👥', color: '#8B5CF6' },
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
        <input placeholder="🔍 بحث بالعنوان أو الموقع..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍👩‍👧</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد اجتماعات</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إضافة اجتماع" لجدولة أول اجتماع</p>
          </div>
        ) : filtered.map((item: any) => (
          <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 22px', borderRight: `4px solid ${isUpcoming(item.date) && item.status !== 'cancelled' ? '#10B981' : item.status === 'cancelled' ? '#EF4444' : '#6B7280'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 14, flex: 1 }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: typeColors[item.type]?.bg || 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{typeIcons[item.type] || '🤝'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{item.title}</span>
                    <span style={{ background: typeColors[item.type]?.bg, color: typeColors[item.type]?.color, padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{typeLabels[item.type] || item.type}</span>
                    <span style={{ background: statusColors[item.status]?.bg, color: statusColors[item.status]?.color, padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{statusLabels[item.status] || item.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 6 }}>
                    {item.date && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>📅 {new Date(item.date).toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' })}</span>}
                    {item.location && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>📍 {item.location}</span>}
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>👥 {item.attendees_count || 0} حاضر</span>
                  </div>
                  {item.agenda && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '6px 0 0 0' }}>📋 {item.agenda.substring(0, 80) + (item.agenda.length > 80 ? '...' : '')}</p>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✏️ تعديل</button>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑️ حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? '✏️ تعديل' : '➕ إضافة اجتماع/فعالية'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>العنوان *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="عنوان الاجتماع أو الفعالية" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  <option value="meeting">اجتماع 🤝</option>
                  <option value="workshop">ورشة عمل 🛠️</option>
                  <option value="seminar">ندوة 🎤</option>
                  <option value="election">انتخابات 🗳️</option>
                  <option value="event">فعالية 🎉</option>
                  <option value="training">تدريب 📋</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>التاريخ والوقت</label>
                <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الموقع</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="مثال: قاعة الاجتماعات" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عدد الحضور</label>
                <input type="number" value={form.attendees_count} onChange={e => setForm({ ...form, attendees_count: e.target.value })} style={inputStyle} placeholder="0" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>جدول الأعمال</label>
                <textarea value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="بنود جدول الأعمال..." />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>ملاحظات / محضر</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="ملاحظات أو محضر الاجتماع..." />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="scheduled">مجدول</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="in_progress">جاري</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                  <option value="postponed">مؤجل</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? '💾 تحديث' : '➕ إضافة'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
