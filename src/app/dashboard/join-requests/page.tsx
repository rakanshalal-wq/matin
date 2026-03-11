'use client';
import { useState, useEffect } from 'react';

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

interface JoinRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  national_id: string;
  status: string;
  requested_grade: string;
  created_at: string;
  school_name: string;
}

export default function JoinRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<Record<number, string>>({});

  useEffect(() => { fetchRequests(); fetchClasses(); }, []);

  const fetchClasses = async () => {
    try { const res = await fetch('/api/classes', { headers: getHeaders() }); const data = await res.json(); setClasses(Array.isArray(data) ? data : []); }
    catch (e) { console.error(e); }
  };
  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/join-requests', { headers: getHeaders() });
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAction = async (userId: number, action: 'approve' | 'reject') => {
    setActionLoading(userId);
    try {
      const res = await fetch('/api/join-requests', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ userId, action, class_id: selectedClass[userId] || '' }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests(prev => prev.filter(r => r.id !== userId));
      }
    } catch (e) { console.error(e); }
    setActionLoading(null);
  };

  const roleLabel = (role: string) => {
    const map: Record<string, string> = { teacher: 'معلم', student: 'طالب', parent: 'ولي أمر' };
    return map[role] || role;
  };

  const roleColor = (role: string) => {
    const map: Record<string, string> = {
      teacher: '#3B82F6', student: '#8B5CF6', parent: '#10B981'
    };
    return map[role] || '#6B7280';
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('ar-SA') + ' ' + date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  const cardStyle = {
    background: 'white', borderRadius: 16, border: '1px solid #E5E7EB',
    padding: 24, marginBottom: 16, transition: 'all 0.2s'
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' as const }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0D1B2A', margin: 0 }}>📋 طلبات الانضمام</h1>
          <p style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>إدارة طلبات المعلمين والطلاب وأولياء الأمور</p>
        </div>
        <div style={{ background: '#FEF3C7', color: '#92400E', padding: '8px 20px', borderRadius: 12, fontWeight: 700, fontSize: 15 }}>
          {requests.length} طلب معلّق
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6B7280' }}>⏳ جاري التحميل...</div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ fontSize: 64 }}>✅</div>
          <h3 style={{ color: '#0D1B2A', fontSize: 20, fontWeight: 700, marginTop: 16 }}>لا توجد طلبات معلّقة</h3>
          <p style={{ color: '#6B7280', fontSize: 14 }}>جميع الطلبات تمت معالجتها</p>
        </div>
      ) : (
        requests.map(req => (
          <div key={req.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 250 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: roleColor(req.role) + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {req.role === 'teacher' ? '👨‍🏫' : req.role === 'student' ? '🎓' : '👨‍👩‍👧'}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 17, color: '#0D1B2A', margin: 0 }}>{req.name}</h3>
                    <span style={{ background: roleColor(req.role) + '20', color: roleColor(req.role), padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {roleLabel(req.role)}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, fontSize: 13, color: '#6B7280' }}>
                  <div>📧 {req.email}</div>
                  {req.phone && <div>📱 {req.phone}</div>}
                  {req.national_id && <div>🪪 {req.national_id}</div>}
                  <div>🏫 {req.school_name}</div>
                  <div>🕐 {formatDate(req.created_at)}</div>
                  {req.requested_grade && <div>📖 الصف المطلوب: {req.requested_grade}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, alignItems: 'flex-end' }}>
                {req.role === 'student' && (
                  <select value={selectedClass[req.id] || ''} onChange={e => setSelectedClass({...selectedClass, [req.id]: e.target.value})}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'white', fontSize: 13, minWidth: 180 }}>
                    <option value="">-- اختر الفصل --</option>
                    {classes.filter((cl: any) => !req.requested_grade || cl.grade === req.requested_grade).map((cl: any) => (
                      <option key={cl.id} value={cl.id}>{cl.name_ar} ({cl.students_count || 0}/{cl.capacity})</option>
                    ))}
                  </select>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => handleAction(req.id, 'approve')}
                  disabled={actionLoading === req.id}
                  style={{ background: '#059669', color: 'white', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic', opacity: actionLoading === req.id ? 0.5 : 1 }}>
                  ✅ قبول
                </button>
                <button
                  onClick={() => handleAction(req.id, 'reject')}
                  disabled={actionLoading === req.id}
                  style={{ background: '#DC2626', color: 'white', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic', opacity: actionLoading === req.id ? 0.5 : 1 }}>
                  ❌ رفض
                </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
