'use client';
export const dynamic = 'force-dynamic';
import { School, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, SearchBar, Modal, EmptyState, LoadingState } from '../_components';

const GRADES = ['الأول الابتدائي','الثاني الابتدائي','الثالث الابتدائي','الرابع الابتدائي','الخامس الابتدائي','السادس الابتدائي','الأول المتوسط','الثاني المتوسط','الثالث المتوسط','الأول الثانوي','الثاني الثانوي','الثالث الثانوي'];

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', grade: 'الأول الابتدائي', capacity: 30, teacher_id: '', teacher_name: '', room: '', track: 'عام', academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1) });
  const [filterGrade, setFilterGrade] = useState('');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try { const r = await fetch('/api/classes', { headers: getHeaders() }); const d = await r.json(); setClasses(Array.isArray(d) ? d : (d.classes || [])); }
    catch { setClasses([]); } finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm({ name: '', grade: 'الأول الابتدائي', capacity: 30, teacher_id: '', teacher_name: '', room: '', track: 'عام', academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1) }); setShowModal(true); };
  const openEdit = (c: any) => { setEditing(c); setForm({ name: c.name || '', grade: c.grade || 'الأول الابتدائي', capacity: c.capacity || 30, teacher_id: c.teacher_id || '', teacher_name: c.teacher_name || '', room: c.room || '', track: c.track || 'عام', academic_year: c.academic_year || '' }); setShowModal(true); };

  const save = async () => {
    setSaving(true);
    try { const method = editing ? 'PUT' : 'POST'; const url = editing ? '/api/classes?id=' + editing.id : '/api/classes'; const r = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); fetchData(); } }
    catch {} finally { setSaving(false); }
  };

  const del = async (id: number) => { if (!confirm('حذف هذا الفصل؟')) return; try { await fetch('/api/classes?id=' + id, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch {} };

  const filtered = classes.filter(c => (!filterGrade || c.grade === filterGrade) && (!search || c.name?.includes(search) || c.teacher_name?.includes(search)));

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="الفصول الدراسية"
        subtitle="إدارة الفصول الدراسية وتعيين المعلمين"
        icon={<School size={20} color="#D4A843" />}
        actions={<button className="btn-gold" onClick={openAdd}><Plus size={15} /> إضافة فصل</button>}
      />

      <div className="stat-grid">
        <StatCard value={classes.length} label="إجمالي الفصول" icon={<School size={17} color="#D4A843" />} color="#D4A843" />
        <StatCard value={classes.filter(c => c.grade?.includes('الابتدائي')).length} label="الابتدائية" icon={<School size={17} color="#3B82F6" />} color="#3B82F6" />
        <StatCard value={classes.filter(c => c.grade?.includes('المتوسط')).length} label="المتوسطة" icon={<School size={17} color="#10B981" />} color="#10B981" />
        <StatCard value={classes.filter(c => c.grade?.includes('الثانوي')).length} label="الثانوية" icon={<School size={17} color="#8B5CF6" />} color="#8B5CF6" />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="input-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث باسم الفصل أو المعلم..." style={{ width: 250 }} />
        <select className="select-field" value={filterGrade} onChange={e => setFilterGrade(e.target.value)} style={{ width: 200 }}>
          <option value="">كل الصفوف</option>
          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="dcard"><EmptyState icon={<School size={19} color="#D4A843" />} message="لا توجد فصول" action={<button className="btn-gold" onClick={openAdd}><Plus size={15} /> إضافة فصل</button>} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((c: any, i: number) => (
            <div key={i} className="dcard" style={{ marginBottom: 0 }}>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 18 }}>{c.name || '—'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 3 }}>{c.grade || '—'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-sm btn-sm-blue" onClick={() => openEdit(c)}><Pencil size={11} /> تعديل</button>
                    <button className="btn-sm btn-sm-red" onClick={() => del(c.id)}><Trash2 size={11} /> حذف</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '8px 12px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>المعلم المشرف</div>
                    <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, marginTop: 2 }}>{c.teacher_name || '—'}</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '8px 12px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>الطاقة الاستيعابية</div>
                    <div style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600, marginTop: 2 }}>{c.capacity || '—'} طالب</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '8px 12px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>رقم الغرفة</div>
                    <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, marginTop: 2 }}>{c.room || '—'}</div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '8px 12px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>المسار</div>
                    <div style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600, marginTop: 2 }}>{c.track || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'تعديل الفصل' : 'إضافة فصل جديد'} titleIcon={<School size={18} color="#D4A843" />}>
        <div className="form-row">
          <div><label className="form-label">اسم الفصل</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: 1أ" /></div>
          <div><label className="form-label">الطاقة الاستيعابية</label><input className="input-field" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} min={1} /></div>
          <div className="form-full"><label className="form-label">الصف الدراسي</label>
            <select className="select-field" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div><label className="form-label">المعلم المشرف</label><input className="input-field" value={form.teacher_name} onChange={e => setForm({ ...form, teacher_name: e.target.value })} placeholder="اسم المعلم" /></div>
          <div><label className="form-label">رقم الغرفة</label><input className="input-field" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="مثال: 101" /></div>
          <div><label className="form-label">المسار</label>
            <select className="select-field" value={form.track} onChange={e => setForm({ ...form, track: e.target.value })}>
              {['عام','علمي','أدبي','شرعي','علوم الحاسب','الصحة والحياة','إدارة الأعمال'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="form-label">العام الدراسي</label><input className="input-field" value={form.academic_year} onChange={e => setForm({ ...form, academic_year: e.target.value })} placeholder="1446-1447" /></div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={save} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
          <button className="btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
