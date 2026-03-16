'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
const EVENT_TYPES = [{ v: 'holiday', l: 'إجازة', c: '#10B981' }, { v: 'exam', l: 'اختبار', c: '#EF4444' }, { v: 'event', l: 'فعالية', c: '#3B82F6' }, { v: 'meeting', l: 'اجتماع', c: '#8B5CF6' }, { v: 'trip', l: 'رحلة', c: '#F59E0B' }, { v: 'other', l: 'أخرى', c: '#9CA3AF' }];
const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const DAYS_AR = ['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'event', start_date: '', end_date: '', description: '', all_day: true, location: '' });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/calendar', { headers: getH() }); const d = await r.json(); setEvents(Array.isArray(d) ? d : (d.events || [])); } catch { setEvents([]); } finally { setLoading(false); } };
  const handleSave = async () => { if (!form.title || !form.start_date) return alert('أدخل العنوان والتاريخ'); setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/calendar?id=' + editItem.id : '/api/calendar'; const r = await fetch(u, { method: m, headers: getH(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({ title: '', type: 'event', start_date: '', end_date: '', description: '', all_day: true, location: '' }); fetchData(); } } catch { } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/calendar?id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
  const openEdit = (item: any) => { setEditItem(item); setForm({ title: item.title || '', type: item.type || 'event', start_date: item.start_date || '', end_date: item.end_date || '', description: item.description || '', all_day: item.all_day !== false, location: item.location || '' }); setShowModal(true); };
  const year = currentDate.getFullYear(), month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const getEventsForDay = (day: number) => events.filter((e: any) => { const d = new Date(e.start_date); return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day; });
  const getTypeInfo = (type: string) => EVENT_TYPES.find(t => t.v === type) || EVENT_TYPES[EVENT_TYPES.length - 1];
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>📅 التقويم الدراسي</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>إدارة الأحداث والمناسبات والإجازات</p></div>
        <button onClick={() => { setEditItem(null); setForm({ ...form, start_date: `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDay||1).padStart(2,'0')}` }); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ إضافة حدث</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {EVENT_TYPES.map(t => <span key={t.v} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: `${t.c}22`, border: `1px solid ${t.c}44`, borderRadius: 20, fontSize: 13, color: t.c }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: t.c, display: 'inline-block' }} />{t.l}</span>)}
      </div>
      <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid ' + BR }}>
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 8, padding: '8px 16px', color: 'white', cursor: 'pointer', fontSize: 16 }}>‹</button>
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{MONTHS_AR[month]} {year}</h2>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 8, padding: '8px 16px', color: 'white', cursor: 'pointer', fontSize: 16 }}>›</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 0 }}>
          {DAYS_AR.map(d => <div key={d} style={{ padding: '12px 8px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, borderBottom: '1px solid ' + BR }}>{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={'empty-' + i} style={{ padding: '8px', minHeight: 80, borderBottom: '1px solid ' + BR, borderLeft: '1px solid ' + BR }} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
            return <div key={day} onClick={() => { setSelectedDay(day); setForm({ ...form, start_date: `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` }); }} style={{ padding: '8px', minHeight: 80, borderBottom: '1px solid ' + BR, borderLeft: '1px solid ' + BR, cursor: 'pointer', background: isToday ? 'rgba(201,168,76,0.08)' : 'transparent', transition: 'background 0.2s' }}>
              <div style={{ fontSize: 14, fontWeight: isToday ? 800 : 500, color: isToday ? GOLD : 'rgba(255,255,255,0.8)', marginBottom: 4, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isToday ? `${GOLD}22` : 'transparent' }}>{day}</div>
              {dayEvents.slice(0, 2).map((e: any, ei: number) => { const t = getTypeInfo(e.type); return <div key={ei} onClick={ev => { ev.stopPropagation(); openEdit(e); }} style={{ fontSize: 11, background: `${t.c}22`, color: t.c, padding: '2px 6px', borderRadius: 4, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>; })}
              {dayEvents.length > 2 && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>+{dayEvents.length - 2} أخرى</div>}
            </div>;
          })}
        </div>
      </div>
      <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, padding: 24 }}>
        <h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>أحداث {MONTHS_AR[month]}</h3>
        {loading ? <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 20 }}>جاري التحميل...</div> :
          events.filter((e: any) => { const d = new Date(e.start_date); return d.getFullYear() === year && d.getMonth() === month; }).length === 0 ? <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 20 }}>لا توجد أحداث هذا الشهر</div> :
          events.filter((e: any) => { const d = new Date(e.start_date); return d.getFullYear() === year && d.getMonth() === month; }).map((e: any, i: number) => { const t = getTypeInfo(e.type); return (
            <div key={e.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: t.c, flexShrink: 0 }} /><div><div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{e.title}</div><div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{new Date(e.start_date).toLocaleDateString('ar-SA')} {e.location ? '• ' + e.location : ''}</div></div></div>
              <div style={{ display: 'flex', gap: 8 }}><button onClick={() => openEdit(e)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 6, padding: '4px 10px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button><button onClick={() => handleDelete(e.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 10px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button></div>
            </div>
          ); })}
      </div>
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
        <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل الحدث' : 'إضافة حدث جديد'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>✕</button></div>
          <div style={{ display: 'grid', gap: 16 }}>
            <div><label style={lbl}>عنوان الحدث *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>النوع</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>{EVENT_TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={lbl}>تاريخ البداية *</label><input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inp} /></div>
              <div><label style={lbl}>تاريخ النهاية</label><input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} style={inp} /></div>
            </div>
            <div><label style={lbl}>الموقع</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>الوصف</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inp, height: 80, resize: 'vertical' as const }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'إضافة الحدث'}</button>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>إلغاء</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
