'use client';
import { Building2, Calendar, Check, MapPin, School, Trash2, User, X } from "lucide-react";
import { useState, useEffect } from 'react';

const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };

const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [form, setForm] = useState({ day_of_week: '0', start_time: '08:00', end_time: '08:45', room: '', class_id: '', teacher_id: '', course_id: '' });
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setUser(u);
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [schRes, clsRes, tchRes, subRes] = await Promise.all([
        fetch('/api/schedules', { headers: getHeaders() }),
        fetch('/api/classes', { headers: getHeaders() }),
        fetch('/api/teachers', { headers: getHeaders() }),
        fetch('/api/subjects', { headers: getHeaders() }),
      ]);
      const [schData, clsData, tchData, subData] = await Promise.all([schRes.json(), clsRes.json(), tchRes.json(), subRes.json()]);
      setSchedules(Array.isArray(schData) ? schData : []);
      setClasses(Array.isArray(clsData) ? clsData : []);
      setTeachers(Array.isArray(tchData) ? tchData : []);
      setSubjects(Array.isArray(subData) ? subData : []);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!form.class_id || !form.teacher_id) { setMsg('الفصل والمعلم مطلوبين'); return; }
    setSaving(true); setMsg('');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/schedules?id=${editItem.id}` : '/api/schedules';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify({...form, day_of_week: parseInt(form.day_of_week)}) });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || 'فشل'); setSaving(false); return; }
      fetchAll();
      setForm({ day_of_week: '0', start_time: '08:00', end_time: '08:45', room: '', class_id: '', teacher_id: '', course_id: '' });
      setShowAdd(false);
    } catch { setMsg('خطأ'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذه الحصة؟')) return;
    await fetch(`/api/schedules?id=${id}`, { method: 'DELETE', headers: getHeaders() });
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const canAdd = ['super_admin', 'owner', 'admin'].includes(user?.role);
  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', direction: 'rtl' as const };
  const dayColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  const filtered = selectedClass ? schedules.filter(s => s.class_id === selectedClass) : schedules;

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A227' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#C9A227', margin: 0 }}><Calendar className="w-5 h-5 inline-block" /> الجدول الدراسي</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, margin: '4px 0 0' }}>{filtered.length} حصة</p>
        </div>
        {canAdd && (
          <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '10px 24px', background: showAdd ? '#374151' : 'linear-gradient(135deg, #C9A227, #E8C547)', color: showAdd ? '#fff' : '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
            {showAdd ? '<X className="w-5 h-5 inline-block" /> إلغاء' : '+ إضافة حصة'}
          </button>
        )}
      </div>

      {/* فلتر الفصل */}
      <div style={{ marginBottom: 20 }}>
        <select style={{...inputStyle, maxWidth: 300, cursor: 'pointer'}} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          <option value="">كل الفصول</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name_ar || c.name} {c.grade ? `(${c.grade})` : ''}</option>)}
        </select>
      </div>

      {msg && <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#EF4444', marginBottom: 16, fontSize: 14 }}>{msg}</div>}

      {showAdd && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: '#C9A227', fontSize: 18, margin: '0 0 20px', fontWeight: 700 }}>إضافة حصة جديدة</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>اليوم *</label>
              <select style={{...inputStyle, cursor: 'pointer'}} value={form.day_of_week} onChange={e => setForm({...form, day_of_week: e.target.value})}>
                {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>من *</label>
              <input type="time" style={inputStyle} value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} />
            </div>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>إلى *</label>
              <input type="time" style={inputStyle} value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} />
            </div>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>الفصل *</label>
              <select style={{...inputStyle, cursor: 'pointer'}} value={form.class_id} onChange={e => setForm({...form, class_id: e.target.value})}>
                <option value="">اختر الفصل</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name_ar || c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>المعلم *</label>
              <select style={{...inputStyle, cursor: 'pointer'}} value={form.teacher_id} onChange={e => setForm({...form, teacher_id: e.target.value})}>
                <option value="">اختر المعلم</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name || t.employee_id}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>القاعة</label>
              <input style={inputStyle} placeholder="مثال: قاعة 101" value={form.room} onChange={e => setForm({...form, room: e.target.value})} />
            </div>
          </div>
          {errMsg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 13 }}>{errMsg}</div>}
          <button onClick={handleAdd} disabled={saving} style={{ marginTop: 20, padding: '12px 32px', background: 'linear-gradient(135deg, #C9A227, #E8C547)', color: '#000', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', opacity: saving ? 0.5 : 1 }}>
            {saving ? 'جاري الحفظ...' : '<Check className="w-5 h-5 inline-block" /> حفظ الحصة'}
          </button>
        </div>
      )}

      {/* عرض الجدول حسب الأيام */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}><Calendar className="w-5 h-5 inline-block" /></div>
          <h3 style={{ color: '#fff', fontSize: 18, margin: '0 0 8px' }}>لا توجد حصص بعد</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {days.map((day, dayIdx) => {
            const daySchedules = filtered.filter(s => s.day_of_week === dayIdx).sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
            if (daySchedules.length === 0) return null;
            return (
              <div key={dayIdx} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 20px', background: `${dayColors[dayIdx]}15`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ color: dayColors[dayIdx], fontSize: 16, fontWeight: 700, margin: 0 }}>{day}</h3>
                </div>
                {daySchedules.map((s: any, i: number) => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: i < daySchedules.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ color: dayColors[dayIdx], fontSize: 14, fontWeight: 700, minWidth: 100 }}>{s.start_time} - {s.end_time}</span>
                      <span style={{ color: '#fff', fontSize: 14 }}>{s.subject_name || 'بدون مادة'}</span>
                      <span style={{ color: '#9CA3AF', fontSize: 12 }}><User className="w-5 h-5 inline-block" />‍<School className="w-5 h-5 inline-block" /> {s.teacher_name || 'بدون معلم'}</span>
                      <span style={{ color: '#9CA3AF', fontSize: 12 }}><Building2 className="w-5 h-5 inline-block" />️ {s.class_name || ''}</span>
                      {s.room && <span style={{ color: '#6B7280', fontSize: 12 }}><MapPin className="w-5 h-5 inline-block" /> {s.room}</span>}
                    </div>
                    {canAdd && (
                      <button onClick={() => handleDelete(s.id)} style={{ padding: '4px 12px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}><Trash2 className="w-5 h-5 inline-block" />️</button>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
