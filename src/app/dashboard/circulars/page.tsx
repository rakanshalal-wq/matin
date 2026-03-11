'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function CircularsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [viewItem, setViewItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', type: 'general', content: '', sender: '', target_audience: 'all', priority: 'normal', publish_date: '', status: 'draft' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/circulars', { headers: getHeaders() });
      const result = await res.json();
      setData(result || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.title) return alert('عنوان التعميم مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/circulars', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ title: '', type: 'general', content: '', sender: '', target_audience: 'all', priority: 'normal', publish_date: '', status: 'draft' }); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await fetch(`/api/circulars?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ title: item.title || '', type: item.type || 'general', content: item.content || '', sender: item.sender || '', target_audience: item.target_audience || 'all', priority: item.priority || 'normal', publish_date: item.publish_date ? item.publish_date.split('T')[0] : '', status: item.status || 'draft' });
    setShowModal(true);
  };

  const filtered = data.filter((item: any) => item.title?.toLowerCase().includes(search.toLowerCase()) || item.sender?.toLowerCase().includes(search.toLowerCase()) || item.content?.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: data.length,
    published: data.filter((d: any) => d.status === 'published').length,
    draft: data.filter((d: any) => d.status === 'draft').length,
    urgent: data.filter((d: any) => d.priority === 'urgent').length,
  };

  const typeLabels: any = { general: 'عام', academic: 'أكاديمي', administrative: 'إداري', financial: 'مالي', event: 'فعالية', holiday: 'إجازة', policy: 'سياسة', safety: 'أمان' };
  const typeIcons: any = { general: '📄', academic: '📚', administrative: '🏢', financial: '💰', event: '🎉', holiday: '🏖️', policy: '📜', safety: '🛡️' };
  const typeColors: any = { general: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, academic: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }, administrative: { bg: 'rgba(201,162,39,0.1)', color: '#C9A227' }, financial: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, event: { bg: 'rgba(236,72,153,0.1)', color: '#EC4899' }, holiday: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, policy: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, safety: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };
  const priorityLabels: any = { low: 'منخفض', normal: 'عادي', high: 'مرتفع', urgent: 'عاجل' };
  const priorityColors: any = { low: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, normal: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, high: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, urgent: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };
  const statusLabels: any = { draft: 'مسودة', published: 'منشور', archived: 'مؤرشف' };
  const statusColors: any = { draft: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, published: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, archived: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' } };
  const audienceLabels: any = { all: 'الجميع', students: 'الطلاب', teachers: 'المعلمين', parents: 'أولياء الأمور', employees: 'الموظفين' };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Urgent Alert */}
      {stats.urgent > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🚨</span>
          <div>
            <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 15 }}>يوجد {stats.urgent} تعميم عاجل</div>
            <div style={{ color: 'rgba(239,68,68,0.8)', fontSize: 13, marginTop: 2 }}>يرجى الاطلاع على التعاميم العاجلة</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>📢 التعاميم</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة ونشر التعاميم والقرارات الرسمية</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ title: '', type: 'general', content: '', sender: '', target_audience: 'all', priority: 'normal', publish_date: '', status: 'draft' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          ➕ تعميم جديد
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي التعاميم', value: stats.total, icon: '📢', color: '#C9A227' },
          { label: 'منشور', value: stats.published, icon: '✅', color: '#10B981' },
          { label: 'مسودة', value: stats.draft, icon: '📝', color: '#6B7280' },
          { label: 'عاجل', value: stats.urgent, icon: '🚨', color: '#EF4444' },
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
        <input placeholder="🔍 بحث بالعنوان أو المرسل أو المحتوى..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      {/* Circulars List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📢</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد تعاميم</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "تعميم جديد" لإنشاء أول تعميم</p>
          </div>
        ) : filtered.map((item: any) => (
          <div key={item.id} onClick={() => setViewItem(item)} style={{ background: item.priority === 'urgent' ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.03)', border: `1px solid ${item.priority === 'urgent' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, padding: '18px 22px', cursor: 'pointer', borderRight: `4px solid ${typeColors[item.type]?.color || '#3B82F6'}` }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = item.priority === 'urgent' ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.03)')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 14, flex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: typeColors[item.type]?.bg || 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{typeIcons[item.type] || '📄'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{item.title}</span>
                    {item.priority === 'urgent' && <span style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>🔴 عاجل</span>}
                    <span style={{ background: typeColors[item.type]?.bg, color: typeColors[item.type]?.color, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{typeLabels[item.type] || item.type}</span>
                    <span style={{ background: statusColors[item.status]?.bg, color: statusColors[item.status]?.color, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{statusLabels[item.status] || item.status}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 8px 0' }}>{item.content ? item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '') : 'لا يوجد محتوى'}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {item.sender && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>✍️ {item.sender}</span>}
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>👥 {audienceLabels[item.target_audience] || item.target_audience}</span>
                    {item.publish_date && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>📅 {new Date(item.publish_date).toLocaleDateString('ar-SA')}</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✏️</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {viewItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 650, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>{typeIcons[viewItem.type] || '📄'}</span>
                <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{viewItem.title}</h2>
              </div>
              <button onClick={() => setViewItem(null)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ background: typeColors[viewItem.type]?.bg, color: typeColors[viewItem.type]?.color, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{typeLabels[viewItem.type] || viewItem.type}</span>
              <span style={{ background: priorityColors[viewItem.priority]?.bg, color: priorityColors[viewItem.priority]?.color, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{priorityLabels[viewItem.priority] || viewItem.priority}</span>
              <span style={{ background: statusColors[viewItem.status]?.bg, color: statusColors[viewItem.status]?.color, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{statusLabels[viewItem.status] || viewItem.status}</span>
            </div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
              {viewItem.sender && <div><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>من: </span><span style={{ color: '#C9A227', fontWeight: 600 }}>{viewItem.sender}</span></div>}
              <div><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>إلى: </span><span style={{ color: 'white' }}>{audienceLabels[viewItem.target_audience] || viewItem.target_audience}</span></div>
              {viewItem.publish_date && <div><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>📅 </span><span style={{ color: 'rgba(255,255,255,0.7)' }}>{new Date(viewItem.publish_date).toLocaleDateString('ar-SA')}</span></div>}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 1.9, padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'pre-wrap' }}>{viewItem.content || 'لا يوجد محتوى'}</div>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? '✏️ تعديل تعميم' : '➕ تعميم جديد'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عنوان التعميم *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="عنوان التعميم" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  <option value="general">عام 📄</option>
                  <option value="academic">أكاديمي 📚</option>
                  <option value="administrative">إداري 🏢</option>
                  <option value="financial">مالي 💰</option>
                  <option value="event">فعالية 🎉</option>
                  <option value="holiday">إجازة 🏖️</option>
                  <option value="policy">سياسة 📜</option>
                  <option value="safety">أمان 🛡️</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الأولوية</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={inputStyle}>
                  <option value="low">منخفض</option>
                  <option value="normal">عادي</option>
                  <option value="high">مرتفع</option>
                  <option value="urgent">عاجل 🔴</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المرسل</label>
                <input value={form.sender} onChange={e => setForm({ ...form, sender: e.target.value })} style={inputStyle} placeholder="مثال: إدارة المدرسة" />
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
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ النشر</label>
                <input type="date" value={form.publish_date} onChange={e => setForm({ ...form, publish_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المحتوى</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }} placeholder="نص التعميم..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? '💾 تحديث' : '📢 نشر'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
