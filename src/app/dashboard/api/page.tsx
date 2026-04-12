'use client';
export const dynamic = 'force-dynamic';
import { Eye, Pencil, Plug, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, StatCard, SearchBar, DataTable, EmptyState, LoadingState, Modal } from '../_components';
import { getHeaders } from '@/lib/api';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', status: 'active' });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/developer-api', { headers: getHeaders() });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!formData.title) { setErrMsg('أدخل البيانات المطلوبة'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/developer-api?id=${editItem.id}` : '/api/developer-api';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
      setShowAddModal(false); setEditItem(null);
      setFormData({ title: '', description: '', status: 'active' });
      setErrMsg(''); fetchItems();
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setFormData({ ...{ title: '', description: '', status: 'active' }, ...item });
    setErrMsg('');
    setShowAddModal(true);
  };

  const handleDelete = async (id: any) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      await fetch(`/api/developer-api?id=${id}`, { method: 'DELETE', headers: getHeaders() });
      fetchItems();
    } catch (e) { console.error(e); }
  };

  const filteredItems = items.filter((i: any) => {
    const s = searchTerm.toLowerCase();
    return i.title?.toLowerCase().includes(s) || i.name?.toLowerCase().includes(s) ||
      i.description?.toLowerCase().includes(s);
  });

  const columns = [
    {
      key: 'title', label: 'العنوان',
      render: (v: any, item: any) => (
        <div className="cell-with-icon">
          <div className="cell-icon"><Plug size={16} /></div>
          <div>
            <div className="cell-title">{item.title || item.name || item.code || '—'}</div>
            {(item.description || item.content) && <div className="cell-sub">{item.description || item.content}</div>}
          </div>
        </div>
      )
    },
    {
      key: 'status', label: 'الحالة', align: 'center' as const,
      render: (v: any) => <span className="badge badge-green">{v || 'نشط'}</span>
    },
    {
      key: 'created_at', label: 'التاريخ', align: 'center' as const,
      render: (v: any) => v ? new Date(v).toLocaleDateString('ar-SA') : '—'
    },
    {
      key: 'actions', label: 'إجراءات', align: 'center' as const,
      render: (_: any, item: any) => (
        <div className="action-btns">
          <button className="btn-sm btn-sm-blue"><Eye size={13} /> عرض</button>
          <button className="btn-sm btn-sm-gold" onClick={() => handleEdit(item)}><Pencil size={13} /> تعديل</button>
          <button className="btn-sm btn-sm-red" onClick={() => handleDelete(item.id)}><Trash2 size={13} /> حذف</button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingState message="جاري تحميل بيانات API..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="API للمطورين"
        subtitle="واجهة برمجة التطبيقات"
        icon={<Plug size={22} />}
        action={
          <button className="btn-gold" onClick={() => { setEditItem(null); setFormData({ title: '', description: '', status: 'active' }); setErrMsg(''); setShowAddModal(true); }}>
            <Plus size={16} /> إضافة جديد
          </button>
        }
      />

      <div className="stat-grid">
        <StatCard label="الإجمالي" value={items.length} icon={<Plug size={20} />} color="#D4A843" />
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="بحث في API..." />

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<Plug size={32} />}
          title="لا توجد بيانات"
          description="أضف أول عنصر API"
          action={<button className="btn-gold" onClick={() => setShowAddModal(true)}><Plus size={16} /> إضافة</button>}
        />
      ) : (
        <DataTable columns={columns} data={filteredItems} />
      )}

      {showAddModal && (
        <Modal
          title={editItem ? 'تعديل' : 'إضافة جديد'}
          icon={editItem ? <Pencil size={18} /> : <Plug size={18} />}
          onClose={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }}
        >
          <div className="form-row">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">العنوان *</label>
              <input className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="أدخل العنوان" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">الوصف</label>
              <textarea className="input-field" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="الوصف" rows={3} style={{ resize: 'vertical' }} />
            </div>
          </div>
          {errMsg && <div className="error-msg">{errMsg}</div>}
          <div className="modal-footer">
            <button className="btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ جاري الحفظ...' : editItem ? <><Pencil size={15} /> حفظ التعديلات</> : <><Plug size={15} /> حفظ</>}
            </button>
            <button className="btn-ghost" onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }}>
              <X size={15} /> إلغاء
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
