'use client';
import { useState, useEffect } from 'react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'normal', target_audience: 'all' });

  const getHeaders = () => {
    const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements', { headers: getHeaders() });
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const addAnnouncement = async () => {
    if (!form.title || !form.content) return alert('أدخل العنوان والمحتوى');
    try {
      await fetch('/api/announcements', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setForm({ title: '', content: '', priority: 'normal', target_audience: 'all' });
      fetchAnnouncements();
    } catch (e) { console.error(e); }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    await fetch(`/api/announcements?id=${id}`, { method: 'DELETE', headers: getHeaders() });
    fetchAnnouncements();
  };

  const priorityColors: Record<string, string> = { high: '#EF4444', normal: '#3B82F6', low: '#10B981' };
  const priorityLabels: Record<string, string> = { high: '🔴 عاجل', normal: '🔵 عادي', low: '🟢 منخفض' };
  const audienceLabels: Record<string, string> = { all: '👥 الجميع', students: '🎓 الطلاب', teachers: '👨‍🏫 المعلمين', parents: '👨‍👩‍👧 أولياء الأمور' };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#C9A227' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#C9A227', margin: 0 }}>📢 الإعلانات</h1>
          <p style={{ color: '#94A3B8', margin: '5px 0 0' }}>إدارة إعلانات المدرسة والتعاميم</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#C9A227', color: '#0F172A', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          ➕ إعلان جديد
        </button>
      </div>

      {/* إحصائيات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'إجمالي الإعلانات', value: announcements.length, icon: '📢', color: '#3B82F6' },
          { label: 'عاجل', value: announcements.filter(a => a.priority === 'high').length, icon: '🔴', color: '#EF4444' },
          { label: 'للجميع', value: announcements.filter(a => a.target_audience === 'all').length, icon: '👥', color: '#10B981' },
          { label: 'نشط', value: announcements.filter(a => a.is_active !== false).length, icon: '✅', color: '#C9A227' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              <div style={{ color: '#94A3B8', fontSize: '14px' }}>{stat.label}</div>
            </div>
            <div style={{ fontSize: '30px' }}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* نموذج إضافة */}
      {showForm && (
        <div style={{ background: '#1E293B', borderRadius: '12px', padding: '25px', marginBottom: '30px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#C9A227', marginBottom: '20px' }}>إعلان جديد</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ color: '#94A3B8', display: 'block', marginBottom: '5px' }}>العنوان</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="عنوان الإعلان" style={{ width: '100%', padding: '10px', background: '#0F172A', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ color: '#94A3B8', display: 'block', marginBottom: '5px' }}>الأولوية</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0F172A', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }}>
                  <option value="high">عاجل</option>
                  <option value="normal">عادي</option>
                  <option value="low">منخفض</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#94A3B8', display: 'block', marginBottom: '5px' }}>الجمهور المستهدف</label>
                <select value={form.target_audience} onChange={e => setForm({ ...form, target_audience: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0F172A', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }}>
                  <option value="all">الجميع</option>
                  <option value="students">الطلاب</option>
                  <option value="teachers">المعلمين</option>
                  <option value="parents">أولياء الأمور</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#94A3B8', display: 'block', marginBottom: '5px' }}>المحتوى</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="محتوى الإعلان..." rows={4} style={{ width: '100%', padding: '10px', background: '#0F172A', color: '#fff', border: '1px solid #334155', borderRadius: '8px', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addAnnouncement} style={{ padding: '10px 25px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>نشر الإعلان</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 25px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>إلغاء</button>
          </div>
        </div>
      )}

      {/* قائمة الإعلانات */}
      {announcements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#1E293B', borderRadius: '12px', color: '#94A3B8' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📢</div>
          <p>لا توجد إعلانات حالياً</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {announcements.map((a: any) => (
            <div key={a.id} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', borderRight: `4px solid ${priorityColors[a.priority] || '#3B82F6'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ color: '#E2E8F0', margin: 0, fontSize: '18px' }}>{a.title}</h3>
                    <span style={{ padding: '2px 10px', background: priorityColors[a.priority] || '#3B82F6', color: '#fff', borderRadius: '12px', fontSize: '12px' }}>
                      {priorityLabels[a.priority] || a.priority}
                    </span>
                    <span style={{ padding: '2px 10px', background: '#334155', color: '#94A3B8', borderRadius: '12px', fontSize: '12px' }}>
                      {audienceLabels[a.target_audience] || a.target_audience}
                    </span>
                  </div>
                  <p style={{ color: '#94A3B8', margin: '0 0 10px', lineHeight: '1.6' }}>{a.content}</p>
                  <div style={{ display: 'flex', gap: '15px', color: '#64748B', fontSize: '13px' }}>
                    <span>✍️ {a.author_name || 'المدير'}</span>
                    <span>📅 {new Date(a.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
                <button onClick={() => deleteAnnouncement(a.id)} style={{ padding: '5px 12px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '10px' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
