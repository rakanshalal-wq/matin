'use client';
export const dynamic = 'force-dynamic';
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, Modal, EmptyState, LoadingState, Badge } from '../_components';

const TAX_TYPES = [
  { value: 'vat', label: 'ضريبة القيمة المضافة (VAT)' },
  { value: 'income', label: 'ضريبة الدخل' },
  { value: 'withholding', label: 'ضريبة الاستقطاع' },
  { value: 'zakat', label: 'الزكاة' },
  { value: 'municipal', label: 'رسوم بلدية' },
  { value: 'other', label: 'أخرى' },
];

const statusMap: Record<string, { label: string; variant: 'green' | 'blue' | 'gold' | 'red' | 'purple' }> = {
  active: { label: 'نشطة', variant: 'green' },
  collected: { label: 'محصّلة', variant: 'blue' },
  pending: { label: 'معلقة', variant: 'gold' },
  overdue: { label: 'متأخرة', variant: 'red' },
  cancelled: { label: 'ملغاة', variant: 'purple' },
};

export default function TaxesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({ name: '', type: 'vat', rate: '', amount: '', description: '', school_id: '', status: 'active', due_date: '' });
  const [editData, setEditData] = useState<any>({});
  const [schools, setSchools] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, totalAmount: 0, collected: 0 });

  useEffect(() => { fetchItems(); fetchSchools(); }, [page, filterStatus, filterType]);

  const fetchSchools = async () => {
    try { const r = await fetch('/api/schools', { headers: getHeaders() }); const d = await r.json(); setSchools(Array.isArray(d) ? d : d.data || []); } catch {}
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filterStatus) params.set('status', filterStatus);
      if (filterType) params.set('type', filterType);
      const r = await fetch(`/api/taxes?${params}`, { headers: getHeaders() });
      const d = await r.json();
      const arr = d.data || [];
      setItems(arr);
      setPagination(d.pagination);
      setStats({
        total: d.pagination?.total || arr.length,
        active: arr.filter((i: any) => i.status === 'active').length,
        totalAmount: arr.reduce((s: number, i: any) => s + Number(i.amount || 0), 0),
        collected: arr.filter((i: any) => i.status === 'collected').reduce((s: number, i: any) => s + Number(i.amount || 0), 0),
      });
    } catch {} finally { setLoading(false); }
  };

  const filtered = items.filter(i => !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!formData.name) return alert('أدخل اسم الضريبة');
    setSaving(true);
    try {
      const r = await fetch('/api/taxes', { method: 'POST', headers: getHeaders(), body: JSON.stringify(formData) });
      if (r.ok) { setShowAddModal(false); setFormData({ name: '', type: 'vat', rate: '', amount: '', description: '', school_id: '', status: 'active', due_date: '' }); fetchItems(); }
      else { const e = await r.json(); alert(e.error || 'فشل'); }
    } catch { alert('خطأ في الاتصال'); } finally { setSaving(false); }
  };

  const handleEditOpen = (item: any) => {
    setEditData({ ...item, rate: item.rate || '', amount: item.amount || '', due_date: item.due_date ? item.due_date.split('T')[0] : '' });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editData.name) return alert('أدخل اسم الضريبة');
    setSaving(true);
    try {
      const r = await fetch('/api/taxes', { method: 'PUT', headers: getHeaders(), body: JSON.stringify(editData) });
      if (r.ok) { setShowEditModal(false); fetchItems(); }
      else { const e = await r.json(); alert(e.error || 'فشل'); }
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الضريبة؟')) return;
    try { await fetch(`/api/taxes?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch {}
  };

  const TaxFormFields = ({ data, setData }: { data: any; setData: any }) => (
    <div className="form-row">
      <div className="form-full"><label className="form-label">اسم الضريبة *</label><input className="input-field" value={data.name || ''} onChange={e => setData({ ...data, name: e.target.value })} placeholder="مثال: ضريبة القيمة المضافة 15%" /></div>
      <div><label className="form-label">نوع الضريبة *</label>
        <select className="select-field" value={data.type || 'vat'} onChange={e => setData({ ...data, type: e.target.value })}>
          {TAX_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div><label className="form-label">الحالة</label>
        <select className="select-field" value={data.status || 'active'} onChange={e => setData({ ...data, status: e.target.value })}>
          <option value="active">نشطة</option><option value="pending">معلقة</option><option value="collected">محصّلة</option><option value="overdue">متأخرة</option><option value="cancelled">ملغاة</option>
        </select>
      </div>
      <div><label className="form-label">النسبة (%)</label><input className="input-field" type="number" value={data.rate || ''} onChange={e => setData({ ...data, rate: e.target.value })} placeholder="15" /></div>
      <div><label className="form-label">المبلغ (ر.س)</label><input className="input-field" type="number" value={data.amount || ''} onChange={e => setData({ ...data, amount: e.target.value })} placeholder="0.00" /></div>
      <div><label className="form-label">المؤسسة (اختياري)</label>
        <select className="select-field" value={data.school_id || ''} onChange={e => setData({ ...data, school_id: e.target.value })}>
          <option value="">كل المؤسسات</option>
          {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div><label className="form-label">تاريخ الاستحقاق</label><input className="input-field" type="date" value={data.due_date || ''} onChange={e => setData({ ...data, due_date: e.target.value })} /></div>
      <div className="form-full"><label className="form-label">الوصف</label><textarea className="textarea-field" value={data.description || ''} onChange={e => setData({ ...data, description: e.target.value })} placeholder="تفاصيل إضافية..." /></div>
    </div>
  );

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="الضرائب السيادية"
        subtitle="إدارة الضرائب والرسوم الحكومية للمؤسسات"
        icon={<Building2 size={20} color="#D4A843" />}
        actions={<button className="btn-gold" onClick={() => setShowAddModal(true)}><Plus size={15} /> إضافة ضريبة</button>}
      />

      <div className="stat-grid">
        <StatCard value={stats.total} label="إجمالي الضرائب" icon={<Building2 size={17} color="#D4A843" />} color="#D4A843" />
        <StatCard value={stats.active} label="ضرائب نشطة" icon={<Building2 size={17} color="#10B981" />} color="#10B981" />
        <StatCard value={`${stats.totalAmount.toLocaleString()} ر.س`} label="إجمالي المبالغ" icon={<Building2 size={17} color="#3B82F6" />} color="#3B82F6" />
        <StatCard value={`${stats.collected.toLocaleString()} ر.س`} label="المحصّل" icon={<Building2 size={17} color="#8B5CF6" />} color="#8B5CF6" />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="input-field" style={{ maxWidth: 280 }} placeholder="بحث بالاسم أو الوصف..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="select-field" style={{ maxWidth: 200 }} value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
          <option value="">كل الأنواع</option>
          {TAX_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className="select-field" style={{ maxWidth: 160 }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="">كل الحالات</option>
          <option value="active">نشطة</option><option value="pending">معلقة</option><option value="collected">محصّلة</option><option value="overdue">متأخرة</option>
        </select>
      </div>

      <div className="dcard">
        {filtered.length === 0 ? (
          <EmptyState icon={<Building2 size={19} color="#D4A843" />} message="لا توجد ضرائب مسجّلة" action={<button className="btn-gold" onClick={() => setShowAddModal(true)}><Plus size={15} /> إضافة أول ضريبة</button>} />
        ) : (
          <div className="table-wrap">
            <table className="dtable">
              <thead><tr>
                <th>اسم الضريبة</th>
                <th style={{ textAlign: 'center' }}>النوع</th>
                <th style={{ textAlign: 'center' }}>النسبة</th>
                <th style={{ textAlign: 'center' }}>المبلغ</th>
                <th style={{ textAlign: 'center' }}>ينطبق على</th>
                <th style={{ textAlign: 'center' }}>الحالة</th>
                <th style={{ textAlign: 'center' }}>الإجراءات</th>
              </tr></thead>
              <tbody>
                {filtered.map((item: any) => {
                  const st = statusMap[item.status] || { label: item.status, variant: 'gold' as const };
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td style={{ textAlign: 'center' }}>{TAX_TYPES.find(x => x.value === item.type)?.label || item.type}</td>
                      <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>{item.rate ? `${item.rate}%` : '—'}</td>
                      <td style={{ textAlign: 'center', color: 'var(--blue)', fontWeight: 700 }}>{item.amount ? `${Number(item.amount).toLocaleString()} ر.س` : '—'}</td>
                      <td style={{ textAlign: 'center' }}>{item.school_name || 'كل المؤسسات'}</td>
                      <td style={{ textAlign: 'center' }}><Badge variant={st.variant}>{st.label}</Badge></td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button className="btn-sm btn-sm-gold" onClick={() => handleEditOpen(item)}><Pencil size={11} /> تعديل</button>
                          <button className="btn-sm btn-sm-red" onClick={() => handleDelete(item.id)}><Trash2 size={11} /> حذف</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button className="btn-outline" disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)} style={{ opacity: pagination.hasPrev ? 1 : 0.4 }}>السابق</button>
          <span style={{ padding: '10px 16px', color: 'var(--text-muted)', fontSize: 14 }}>صفحة {pagination.page} من {pagination.totalPages}</span>
          <button className="btn-outline" disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)} style={{ opacity: pagination.hasNext ? 1 : 0.4 }}>التالي</button>
        </div>
      )}

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة ضريبة جديدة" titleIcon={<Building2 size={18} color="#D4A843" />} large>
        <TaxFormFields data={formData} setData={setFormData} />
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleAdd} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
          <button className="btn-outline" onClick={() => setShowAddModal(false)}>إلغاء</button>
        </div>
      </Modal>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="تعديل الضريبة" titleIcon={<Pencil size={18} color="#D4A843" />} large>
        <TaxFormFields data={editData} setData={setEditData} />
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleEditSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</button>
          <button className="btn-outline" onClick={() => setShowEditModal(false)}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
