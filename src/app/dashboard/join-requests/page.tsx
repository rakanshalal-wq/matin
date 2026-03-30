'use client';
export const dynamic = 'force-dynamic';
import { UserPlus, Plus, Pencil, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, SearchBar, Modal, EmptyState, LoadingState, Badge } from '../_components';

const statusVariant: any = { 'معلق': 'gold', 'موافق': 'green', 'مرفوض': 'red', 'قيد التفعيل': 'blue' };

export default function JoinRequestsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ school_name: '', contact_name: '', email: '', phone: '', city: '', school_type: 'حكومية', students_count: 0, request_date: '', status: 'معلق', notes: '' });
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try { const r = await fetch('/api/join-requests', { headers: getHeaders() }); const d = await r.json(); setItems(Array.isArray(d) ? d : (d.requests || [])); }
    catch { setItems([]); } finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm({ school_name: '', contact_name: '', email: '', phone: '', city: '', school_type: 'حكومية', students_count: 0, request_date: '', status: 'معلق', notes: '' }); setShowModal(true); };
  const openEdit = (item: any) => { setEditing(item); setForm({ school_name: item.school_name || '', contact_name: item.contact_name || '', email: item.email || '', phone: item.phone || '', city: item.city || '', school_type: item.school_type || 'حكومية', students_count: item.students_count || 0, request_date: item.request_date ? item.request_date.split('T')[0] : '', status: item.status || 'معلق', notes: item.notes || '' }); setShowModal(true); };

  const save = async () => {
    setSaving(true);
    try { const method = editing ? 'PUT' : 'POST'; const url = editing ? '/api/join-requests?id=' + editing.id : '/api/join-requests'; const r = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); fetchData(); } }
    catch {} finally { setSaving(false); }
  };

  const del = async (id: number) => { if (!confirm('حذف هذا الطلب؟')) return; try { await fetch('/api/join-requests?id=' + id, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch {} };

  const filtered = items.filter(r => !search || JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
  const pending = items.filter(i => i.status === 'معلق').length;
  const approved = items.filter(i => i.status === 'موافق').length;
  const rejected = items.filter(i => i.status === 'مرفوض').length;

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="طلبات الانضمام" subtitle="إدارة طلبات انضمام المؤسسات للمنصة" icon={<UserPlus size={20} color="#D4A843" />}
        actions={<button className="btn-gold" onClick={openAdd}><Plus size={15} /> إضافة</button>}
      />

      <div className="stat-grid">
        <StatCard value={items.length} label="إجمالي الطلبات" icon={<UserPlus size={17} color="#D4A843" />} color="#D4A843" />
        <StatCard value={pending} label="معلقة" icon={<Clock size={17} color="#F59E0B" />} color="#F59E0B" />
        <StatCard value={approved} label="موافق عليها" icon={<CheckCircle size={17} color="#10B981" />} color="#10B981" />
        <StatCard value={rejected} label="مرفوضة" icon={<XCircle size={17} color="#EF4444" />} color="#EF4444" />
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="بحث..." />

      <div className="dcard">
        {filtered.length === 0 ? (
          <EmptyState icon={<UserPlus size={19} color="#6B7280" />} message="لا توجد طلبات" action={<button className="btn-gold" onClick={openAdd}><Plus size={15} /> إضافة طلب</button>} />
        ) : (
          <div className="table-wrap">
            <table className="dtable">
              <thead><tr>
                <th>المدرسة</th><th style={{ textAlign: 'center' }}>المسؤول</th><th style={{ textAlign: 'center' }}>المدينة</th><th style={{ textAlign: 'center' }}>النوع</th><th style={{ textAlign: 'center' }}>التاريخ</th><th style={{ textAlign: 'center' }}>الحالة</th><th style={{ textAlign: 'center' }}>إجراءات</th>
              </tr></thead>
              <tbody>
                {filtered.map((r: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: 'var(--gold)' }}>{r.school_name || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{r.contact_name || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{r.city || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{r.school_type || '—'}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{r.request_date ? new Date(r.request_date).toLocaleDateString('ar-SA') : '—'}</td>
                    <td style={{ textAlign: 'center' }}><Badge variant={statusVariant[r.status] || 'gold'}>{r.status || '—'}</Badge></td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                        <button className="btn-sm btn-sm-blue" onClick={() => openEdit(r)}><Pencil size={11} /> تعديل</button>
                        <button className="btn-sm btn-sm-red" onClick={() => del(r.id)}><Trash2 size={11} /> حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'تعديل الطلب' : 'إضافة طلب جديد'} titleIcon={<UserPlus size={18} color="#D4A843" />} large>
        <div className="form-row">
          <div className="form-full"><label className="form-label">اسم المدرسة</label><input className="input-field" value={form.school_name} onChange={e => setForm({ ...form, school_name: e.target.value })} /></div>
          <div><label className="form-label">اسم المسؤول</label><input className="input-field" value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} /></div>
          <div><label className="form-label">البريد الإلكتروني</label><input className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="form-label">رقم الجوال</label><input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="form-label">المدينة</label><input className="input-field" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
          <div><label className="form-label">نوع المدرسة</label>
            <select className="select-field" value={form.school_type} onChange={e => setForm({ ...form, school_type: e.target.value })}>
              <option value="حكومية">حكومية</option><option value="أهلية">أهلية</option><option value="دولية">دولية</option>
            </select>
          </div>
          <div><label className="form-label">عدد الطلاب المتوقع</label><input className="input-field" type="number" value={form.students_count} onChange={e => setForm({ ...form, students_count: Number(e.target.value) })} /></div>
          <div><label className="form-label">تاريخ الطلب</label><input className="input-field" type="date" value={form.request_date} onChange={e => setForm({ ...form, request_date: e.target.value })} /></div>
          <div><label className="form-label">الحالة</label>
            <select className="select-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="معلق">معلق</option><option value="موافق">موافق</option><option value="مرفوض">مرفوض</option><option value="قيد التفعيل">قيد التفعيل</option>
            </select>
          </div>
          <div className="form-full"><label className="form-label">ملاحظات</label><textarea className="textarea-field" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={save} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
          <button className="btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
