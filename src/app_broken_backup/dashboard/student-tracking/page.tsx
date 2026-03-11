'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function StudentTrackingPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const res = await fetch('/api/student-tracking', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'in_bus': return { text: 'في الباص', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' };
      case 'at_school': return { text: 'في المدرسة', color: '#10B981', bg: 'rgba(16,185,129,0.1)' };
      case 'at_home': return { text: 'في المنزل', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' };
      case 'absent': return { text: 'غائب', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
      default: return { text: s || 'غير محدد', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' };
    }
  };

  const filteredItems = items.filter(i => i.student_name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>📍 تتبع الطلاب GPS</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>تتبع مواقع الطلاب أثناء التنقل المدرسي</p>
        </div>
      </div>

      <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <p style={{ color: '#F59E0B', margin: 0, fontSize: 14 }}>⚠️ تنبيه: التتبع يعمل فقط في وقت الدوام. ولي الأمر فقط يشوف موقع ابنه. المالك لا يشوف موقع أي طالب (سرية تامة).</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الطلاب', value: items.length, icon: '📍', color: '#C9A227' },
          { label: 'في الباص', value: items.filter(i => i.status === 'in_bus').length, icon: '🚌', color: '#3B82F6' },
          { label: 'في المدرسة', value: items.filter(i => i.status === 'at_school').length, icon: '🏫', color: '#10B981' },
          { label: 'في المنزل', value: items.filter(i => i.status === 'at_home').length, icon: '🏠', color: '#8B5CF6' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}>{stat.icon}</span><span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span></div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <input type="text" placeholder="🔍 بحث باسم الطالب..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📍</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد بيانات تتبع</p>
          </div>
        ) : (
          <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>الطالب</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الحالة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>آخر تحديث</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الإحداثيات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, background: badge.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📍</div>
                        <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.student_name}</p>
                      </div>
                    </td>
                    <td style={{ padding: 16, textAlign: 'center' }}><span style={{ background: badge.bg, color: badge.color, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{badge.text}</span></td>
                    <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.last_update ? new Date(item.last_update).toLocaleString('ar-SA') : '—'}</td>
                    <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 12, direction: 'ltr' }}>{item.lat && item.lng ? `${item.lat}, ${item.lng}` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
