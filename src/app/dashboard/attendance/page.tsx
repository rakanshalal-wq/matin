'use client';
import { useState, useEffect } from 'react';

const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };

export default function AttendancePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>({});
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setUser(u);
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes', { headers: getHeaders() });
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  };

  const fetchStudents = async (classId: string) => {
    try {
      const res = await fetch(`/api/students?class_id=${classId}`, { headers: getHeaders() });
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
      // جلب الحضور الموجود لهذا اليوم
      const attRes = await fetch(`/api/attendance?class_id=${classId}&date=${selectedDate}`, { headers: getHeaders() });
      const attData = await attRes.json();
      const attMap: any = {};
      if (Array.isArray(attData)) {
        attData.forEach((a: any) => { attMap[a.student_id] = a.status; });
      }
      setAttendance(attMap);
    } catch {}
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    if (classId) fetchStudents(classId);
    else { setStudents([]); setAttendance({}); }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (selectedClass) {
      setTimeout(() => fetchStudents(selectedClass), 100);
    }
  };

  const toggleStatus = (studentId: string) => {
    const current = attendance[studentId] || 'PRESENT';
    const order = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];
    const next = order[(order.indexOf(current) + 1) % order.length];
    setAttendance({ ...attendance, [studentId]: next });
  };

  const handleSave = async () => {
    if (!selectedClass || students.length === 0) return;
    setSaving(true); setMsg('');
    try {
      const records = students.map((s: any) => ({
        student_id: s.id,
        class_id: selectedClass,
        date: selectedDate,
        status: attendance[s.id] || 'PRESENT'
      }));
      const res = await fetch('/api/attendance', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ records })
      });
      const data = await res.json();
      if (res.ok) setMsg('تم حفظ الحضور بنجاح ✓');
      else setMsg(data.error || 'فشل');
    } catch { setMsg('خطأ بالاتصال'); } finally { setSaving(false); }
  };

  const statusConfig: any = {
    PRESENT: { label: 'حاضر', color: '#10B981', bg: 'rgba(16,185,129,0.15)', icon: '✓' },
    ABSENT: { label: 'غائب', color: '#EF4444', bg: 'rgba(239,68,68,0.15)', icon: '✕' },
    LATE: { label: 'متأخر', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: '⏰' },
    EXCUSED: { label: 'معذور', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', icon: '📋' },
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', direction: 'rtl' as const };
  const canEdit = ['super_admin', 'owner', 'admin', 'teacher'].includes(user?.role);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A227' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#C9A227', margin: '0 0 24px' }}>📋 الحضور والغياب</h1>

      {/* فلتر الفصل والتاريخ */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>اختر الفصل</label>
          <select style={{...inputStyle, cursor: 'pointer'}} value={selectedClass} onChange={e => handleClassChange(e.target.value)}>
            <option value="">-- اختر فصل --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name_ar || c.name} {c.grade ? `(${c.grade})` : ''}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>التاريخ</label>
          <input type="date" style={inputStyle} value={selectedDate} onChange={e => handleDateChange(e.target.value)} />
        </div>
      </div>

      {msg && <div style={{ padding: 12, background: msg.includes('✓') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.includes('✓') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 10, color: msg.includes('✓') ? '#10B981' : '#EF4444', marginBottom: 16, fontSize: 14 }}>{msg}</div>}

      {!selectedClass ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ color: '#fff', fontSize: 18, margin: '0 0 8px' }}>اختر فصل لتسجيل الحضور</h3>
        </div>
      ) : students.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <h3 style={{ color: '#fff', fontSize: 18, margin: '0 0 8px' }}>لا يوجد طلاب في هذا الفصل</h3>
        </div>
      ) : (
        <>
          {/* إحصائيات سريعة */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {Object.entries(statusConfig).map(([key, cfg]: any) => {
              const count = students.filter(s => (attendance[s.id] || 'PRESENT') === key).length;
              return (
                <div key={key} style={{ padding: '8px 16px', background: cfg.bg, borderRadius: 10, color: cfg.color, fontSize: 13, fontWeight: 600 }}>
                  {cfg.icon} {cfg.label}: {count}
                </div>
              );
            })}
          </div>

          {/* قائمة الطلاب */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            {students.map((s: any, i: number) => {
              const status = attendance[s.id] || 'PRESENT';
              const cfg = statusConfig[status];
              return (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < students.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#C9A227' }}>{i + 1}</span>
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{s.name || s.student_id}</span>
                  </div>
                  {canEdit ? (
                    <button onClick={() => toggleStatus(s.id)} style={{ padding: '6px 20px', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', minWidth: 90 }}>
                      {cfg.icon} {cfg.label}
                    </button>
                  ) : (
                    <span style={{ padding: '6px 20px', background: cfg.bg, color: cfg.color, borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{cfg.icon} {cfg.label}</span>
                  )}
                </div>
              );
            })}
          </div>

          {canEdit && (
            <button onClick={handleSave} disabled={saving} style={{ marginTop: 20, padding: '14px 40px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', opacity: saving ? 0.5 : 1 }}>
              {saving ? 'جاري الحفظ...' : '✓ حفظ الحضور'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
