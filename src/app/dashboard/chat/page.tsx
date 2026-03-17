'use client';
import { Building, CheckCircle, Lock, Megaphone, MessageCircle, Pencil, Plus, Save, School, Search, Trash2, Users, X } from "lucide-react";
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function ChatPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ name: '', type: 'group', members_count: '', last_message: '', status: 'active' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/chat', { headers: getHeaders() });
      const result = await res.json();
      setData(result || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.name) return alert('اسم المجموعة مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/chat', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ name: '', type: 'group', members_count: '', last_message: '', status: 'active' }); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المحادثة؟')) return;
    try { await fetch(`/api/chat?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ name: item.name || '', type: item.type || 'group', members_count: item.members_count?.toString() || '', last_message: item.last_message || '', status: item.status || 'active' });
    setShowModal(true);
  };

  const filtered = data.filter((item: any) => item.name?.toLowerCase().includes(search.toLowerCase()) || item.last_message?.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: data.length,
    active: data.filter((d: any) => d.status === 'active').length,
    groups: data.filter((d: any) => d.type === 'group').length,
    direct: data.filter((d: any) => d.type === 'direct').length,
  };

  const typeLabels: any = { group: 'مجموعة', direct: 'محادثة خاصة', class: 'فصل', department: 'قسم', announcement: 'إعلانات' };
  const typeIcons: any = { group: '<Users className="w-5 h-5 inline-block" />', direct: '<MessageCircle className="w-5 h-5 inline-block" />', class: '<School className="w-5 h-5 inline-block" />', department: '<Building className="w-5 h-5 inline-block" />', announcement: '<Megaphone className="w-5 h-5 inline-block" />' };
  const typeColors: any = { group: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, direct: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, class: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }, department: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, announcement: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };
  const statusColors: any = { active: '#10B981', muted: '#F59E0B', archived: '#6B7280' };

  const timeAgo = (date: string) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `${mins}د`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}س`;
    const days = Math.floor(hours / 24);
    return `${days}ي`;
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><MessageCircle className="w-5 h-5 inline-block" /> الدردشة المباشرة</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة غرف الدردشة والمحادثات الجماعية</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ name: '', type: 'group', members_count: '', last_message: '', status: 'active' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          <Plus className="w-5 h-5 inline-block" /> إنشاء محادثة
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي المحادثات', value: stats.total, icon: '<MessageCircle className="w-5 h-5 inline-block" />', color: '#C9A227' },
          { label: 'نشطة', value: stats.active, icon: '<CheckCircle className="w-5 h-5 inline-block" />', color: '#10B981' },
          { label: 'مجموعات', value: stats.groups, icon: '<Users className="w-5 h-5 inline-block" />', color: '#3B82F6' },
          { label: 'محادثات خاصة', value: stats.direct, icon: '<Lock className="w-5 h-5 inline-block" />', color: '#8B5CF6' },
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
        <input placeholder="<Search className="w-5 h-5 inline-block" /> بحث في المحادثات..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      {/* Chat List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}><MessageCircle className="w-5 h-5 inline-block" /></div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد محادثات</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إنشاء محادثة" لبدء محادثة جديدة</p>
          </div>
        ) : filtered.map((item: any) => (
          <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 20px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1 }}>
                <div style={{ position: 'relative' as any }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: typeColors[item.type]?.bg || 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{typeIcons[item.type] || '<MessageCircle className="w-5 h-5 inline-block" />'}</div>
                  <div style={{ position: 'absolute' as any, bottom: -2, left: -2, width: 14, height: 14, borderRadius: '50%', background: statusColors[item.status] || '#6B7280', border: '2px solid #06060E' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{item.name}</span>
                    <span style={{ background: typeColors[item.type]?.bg, color: typeColors[item.type]?.color, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{typeLabels[item.type] || item.type}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>{item.last_message ? item.last_message.substring(0, 50) + (item.last_message.length > 50 ? '...' : '') : 'لا توجد رسائل بعد'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{item.last_message_at ? timeAgo(item.last_message_at) : ''}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}><Users className="w-5 h-5 inline-block" /> {item.members_count || 0}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}><Pencil className="w-5 h-5 inline-block" />️</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}><Trash2 className="w-5 h-5 inline-block" />️</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? '<Pencil className="w-5 h-5 inline-block" />️ تعديل محادثة' : '<Plus className="w-5 h-5 inline-block" /> إنشاء محادثة جديدة'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}><X className="w-5 h-5 inline-block" /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم المحادثة *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="مثال: مجموعة الفصل الأول" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                    <option value="group">مجموعة <Users className="w-5 h-5 inline-block" /></option>
                    <option value="direct">محادثة خاصة <MessageCircle className="w-5 h-5 inline-block" /></option>
                    <option value="class">فصل <School className="w-5 h-5 inline-block" /></option>
                    <option value="department">قسم <Building className="w-5 h-5 inline-block" /></option>
                    <option value="announcement">إعلانات <Megaphone className="w-5 h-5 inline-block" /></option>
                  </select>
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عدد الأعضاء</label>
                  <input type="number" value={form.members_count} onChange={e => setForm({ ...form, members_count: e.target.value })} style={inputStyle} placeholder="0" />
                </div>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="active">نشطة</option>
                  <option value="muted">مكتومة</option>
                  <option value="archived">مؤرشفة</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? '<Save className="w-5 h-5 inline-block" /> تحديث' : '<Plus className="w-5 h-5 inline-block" /> إنشاء'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
