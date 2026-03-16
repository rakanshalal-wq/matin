'use client';
import { useState, useEffect } from 'react';
const getHeaders = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
const GRADES = ['الأول الابتدائي','الثاني الابتدائي','الثالث الابتدائي','الرابع الابتدائي','الخامس الابتدائي','السادس الابتدائي','الأول المتوسط','الثاني المتوسط','الثالث المتوسط','الأول الثانوي','الثاني الثانوي','الثالث الثانوي'];
const SECTIONS = ['أ','ب','ج','د','هـ','و','ز','ح'];
export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name_ar: '', grade: 'الأول الابتدائي', section: 'أ', capacity: '30', room: '', teacher_name: '', notes: '' });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/classes', { headers: getHeaders() }); const d = await r.json(); setClasses(Array.isArray(d) ? d : (d.classes || [])); } catch { setClasses([]); } finally { setLoading(false); } };
  const handleSave = async () => { if (!form.grade) return alert('اختر الصف'); setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/classes?id=' + editItem.id : '/api/classes'; const body = { ...form, name_ar: form.name_ar || (form.grade + ' - ' + form.section) }; const r = await fetch(u, { method: m, headers: getHeaders(), body: JSON.stringify(body) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({ name_ar: '', grade: 'الأول الابتدائي', section: 'أ', capacity: '30', room: '', teacher_name: '', notes: '' }); fetchData(); } else { const e = await r.json(); alert(e.error || 'فشل الحفظ'); } } catch { } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!confirm('هل أنت متأكد من حذف هذا الفصل؟')) return; try { await fetch('/api/classes?id=' + id, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch { } };
  const openEdit = (item: any) => { setEditItem(item); setForm({ name_ar: item.name_ar || '', grade: item.grade || 'الأول الابتدائي', section: item.section || 'أ', capacity: String(item.capacity || 30), room: item.room || '', teacher_name: item.teacher_name || '', notes: item.notes || '' }); setShowModal(true); };
  const filtered = classes.filter((r: any) => (!search || r.name_ar?.includes(search) || r.grade?.includes(search)) && (!filterGrade || r.grade === filterGrade));
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  const totalStudents = classes.reduce((s: number, c: any) => s + (Number(c.student_count) || 0), 0);
  const totalCapacity = classes.reduce((s: number, c: any) => s + (Number(c.capacity) || 30), 0);
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>🏫 الفصول الدراسية</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>إدارة فصول المدرسة وتوزيع الطلاب</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ إضافة فصل</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        {[{ l: 'إجمالي الفصول', v: classes.length, c: GOLD, i: '🏫' }, { l: 'إجمالي الطلاب', v: totalStudents, c: '#10B981', i: '👥' }, { l: 'الطاقة الاستيعابية', v: totalCapacity, c: '#3B82F6', i: '📊' }, { l: 'نسبة الامتلاء', v: totalCapacity > 0 ? Math.round(totalStudents / totalCapacity * 100) + '%' : '0%', c: '#8B5CF6', i: '📈' }].map((s, i) => (
          <div key={i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div><div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="🔍 بحث عن فصل..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: 260 }} />
        <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} style={{ ...inp, width: 200 }}>
          <option value="">جميع الصفوف</option>{GRADES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: 80, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div> :
        filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 80 }}><div style={{ fontSize: 56, marginBottom: 16 }}>🏫</div><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>لا توجد فصول مسجلة</p><button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ إضافة أول فصل</button></div> :
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {filtered.map((cls: any, i: number) => {
              const fill = cls.capacity > 0 ? Math.round((cls.student_count || 0) / cls.capacity * 100) : 0;
              const fillColor = fill >= 90 ? '#EF4444' : fill >= 70 ? '#F59E0B' : '#10B981';
              return (
                <div key={cls.id || i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, padding: 20, transition: 'border-color 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div><div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{cls.name_ar || cls.grade + ' - ' + cls.section}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{cls.grade}</div></div>
                    <span style={{ background: 'rgba(201,168,76,0.15)', color: GOLD, padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>فصل {cls.section}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>الطلاب</div><div style={{ fontSize: 18, fontWeight: 700, color: GOLD }}>{cls.student_count || 0}</div></div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>الطاقة</div><div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{cls.capacity || 30}</div></div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>نسبة الامتلاء</span><span style={{ fontSize: 12, color: fillColor, fontWeight: 700 }}>{fill}%</span></div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}><div style={{ height: '100%', width: fill + '%', background: fillColor, borderRadius: 3, transition: 'width 0.5s' }} /></div>
                  </div>
                  {cls.teacher_name && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>👨‍🏫 {cls.teacher_name}</div>}
                  {cls.room && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>🚪 غرفة {cls.room}</div>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(cls)} style={{ flex: 1, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '8px', color: GOLD, cursor: 'pointer', fontSize: 13 }}>تعديل</button>
                    <button onClick={() => handleDelete(cls.id)} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px', color: '#EF4444', cursor: 'pointer', fontSize: 13 }}>حذف</button>
                  </div>
                </div>
              );
            })}
          </div>}
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
        <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل الفصل' : 'إضافة فصل جديد'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>✕</button></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={lbl}>الصف الدراسي *</label><select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} style={inp}>{GRADES.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
            <div><label style={lbl}>الفصل</label><select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} style={inp}>{SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>اسم الفصل (اختياري)</label><input value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} placeholder="مثال: الأول الابتدائي أ" style={inp} /></div>
            <div><label style={lbl}>الطاقة الاستيعابية</label><input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>رقم الغرفة</label><input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="مثال: 101" style={inp} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>المعلم المسؤول</label><input value={form.teacher_name} onChange={e => setForm({ ...form, teacher_name: e.target.value })} placeholder="اسم المعلم" style={inp} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>ملاحظات</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, height: 70, resize: 'vertical' as const }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'إضافة الفصل'}</button>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>إلغاء</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
