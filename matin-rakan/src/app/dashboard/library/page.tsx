'use client';
export const dynamic = 'force-dynamic';
import { Book, BookOpen, CheckCircle, HelpCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, StatCard, SearchBar, DataTable, EmptyState, LoadingState, Modal, FilterTabs } from '../_components';
import { getHeaders } from '@/lib/api';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: 'متاح', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  borrowed: { label: 'مستعار', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  reserved: { label: 'محجوز', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  lost: { label: 'مفقود', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' }
};

const defaultForm = { title: '', author: '', isbn: '', category: 'علوم', quantity: '1', available_quantity: '1', status: 'available', publisher: '', year: '', description: '' };

export default function LibraryPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/library', { headers: getHeaders() });
      const d = await r.json();
      setBooks(Array.isArray(d) ? d : []);
    } catch { setBooks([]); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.title) return alert('ادخل عنوان الكتاب');
    setSaving(true);
    try {
      const m = editItem ? 'PUT' : 'POST';
      const u = editItem ? '/api/library?id=' + editItem.id : '/api/library';
      const r = await fetch(u, { method: m, headers: getHeaders(), body: JSON.stringify(form) });
      if (r.ok) {
        setShowModal(false); setEditItem(null); setForm(defaultForm); fetchBooks();
      } else {
        const e = await r.json(); alert(e.error || 'فشل الحفظ');
      }
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل انت متاكد؟')) return;
    try {
      await fetch('/api/library?id=' + id, { method: 'DELETE', headers: getHeaders() });
      fetchBooks();
    } catch {}
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({ title: item.title || '', author: item.author || '', isbn: item.isbn || '', category: item.category || 'علوم', quantity: String(item.quantity || 1), available_quantity: String(item.available_quantity || 1), status: item.status || 'available', publisher: item.publisher || '', year: String(item.year || ''), description: item.description || '' });
    setShowModal(true);
  };

  const filtered = books.filter((r: any) =>
    (!search || r.title?.includes(search) || r.author?.includes(search)) &&
    (!filterStatus || r.status === filterStatus)
  );

  const statusTabs = [
    { key: '', label: 'الكل' },
    ...Object.entries(STATUS_MAP).map(([k, v]) => ({ key: k, label: v.label }))
  ];

  const columns = [
    { key: 'title', label: 'العنوان', render: (_: any, r: any) => <span className="cell-title">{r.title}</span> },
    { key: 'author', label: 'المؤلف', render: (v: any) => <span className="cell-sub">{v || '—'}</span> },
    { key: 'category', label: 'الفئة', render: (v: any) => <span className="cell-sub">{v || '—'}</span> },
    { key: 'quantity', label: 'الكمية', align: 'center' as const, render: (v: any) => v || 1 },
    { key: 'available_quantity', label: 'المتاح', align: 'center' as const, render: (v: any) => <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{v || 0}</span> },
    {
      key: 'status', label: 'الحالة', align: 'center' as const,
      render: (v: any) => {
        const st = STATUS_MAP[v] || { label: v, color: '#9CA3AF', bg: 'rgba(156,163,175,0.15)' };
        return <span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>;
      }
    },
    {
      key: 'actions', label: 'إجراءات', align: 'center' as const,
      render: (_: any, r: any) => (
        <div className="action-btns">
          <button className="btn-sm btn-sm-gold" onClick={() => openEdit(r)}><Pencil size={13} /> تعديل</button>
          <button className="btn-sm btn-sm-red" onClick={() => handleDelete(r.id)}><Trash2 size={13} /> حذف</button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingState message="جاري تحميل المكتبة..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="المكتبة المدرسية"
        subtitle="ادارة الكتب والاستعارات"
        icon={<BookOpen size={22} />}
        action={
          <button className="btn-gold" onClick={() => { setEditItem(null); setForm(defaultForm); setShowModal(true); }}>
            <Plus size={16} /> اضافة كتاب
          </button>
        }
      />

      <div className="stat-grid">
        <StatCard label="اجمالي الكتب" value={books.length} icon={<BookOpen size={20} />} color="#D4A843" />
        <StatCard label="متاح" value={books.filter(r => r.status === 'available').length} icon={<CheckCircle size={20} />} color="#10B981" />
        <StatCard label="مستعار" value={books.filter(r => r.status === 'borrowed').length} icon={<Book size={20} />} color="#F59E0B" />
        <StatCard label="مفقود" value={books.filter(r => r.status === 'lost').length} icon={<HelpCircle size={20} />} color="#EF4444" />
      </div>

      <div className="filters-bar">
        <SearchBar value={search} onChange={setSearch} placeholder="بحث عن كتاب او مؤلف..." />
        <FilterTabs tabs={statusTabs} active={filterStatus} onChange={setFilterStatus} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Book size={32} />}
          title="لا توجد كتب مسجلة"
          description="أضف أول كتاب للمكتبة"
          action={<button className="btn-gold" onClick={() => setShowModal(true)}><Plus size={16} /> اضافة اول كتاب</button>}
        />
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}

      {showModal && (
        <Modal
          title={editItem ? 'تعديل الكتاب' : 'اضافة كتاب جديد'}
          icon={editItem ? <Pencil size={18} /> : <BookOpen size={18} />}
          onClose={() => { setShowModal(false); setEditItem(null); }}
        >
          <div className="form-row">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">عنوان الكتاب *</label>
              <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="ادخل عنوان الكتاب" />
            </div>
            <div>
              <label className="form-label">المؤلف</label>
              <input className="input-field" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="اسم المؤلف" />
            </div>
            <div>
              <label className="form-label">الفئة</label>
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {['علوم', 'ادب', 'تاريخ', 'رياضيات', 'دين', 'قصص', 'اخرى'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">الكمية الكلية</label>
              <input type="number" className="input-field" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div>
              <label className="form-label">الكمية المتاحة</label>
              <input type="number" className="input-field" value={form.available_quantity} onChange={e => setForm({ ...form, available_quantity: e.target.value })} />
            </div>
            <div>
              <label className="form-label">الحالة</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">دار النشر</label>
              <input className="input-field" value={form.publisher} onChange={e => setForm({ ...form, publisher: e.target.value })} />
            </div>
            <div>
              <label className="form-label">سنة النشر</label>
              <input type="number" className="input-field" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2024" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">ملاحظات</label>
              <textarea className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ height: 70, resize: 'vertical' }} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? 'جاري الحفظ...' : editItem ? <><Pencil size={15} /> حفظ التعديلات</> : <><BookOpen size={15} /> اضافة الكتاب</>}
            </button>
            <button className="btn-ghost" onClick={() => { setShowModal(false); setEditItem(null); }}>
              <X size={15} /> الغاء
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
