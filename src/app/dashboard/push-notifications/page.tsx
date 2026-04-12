'use client';
export const dynamic = 'force-dynamic';
import { Eye, Pencil, Plus, Smartphone, Trash2, X } from "lucide-react";
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
      const res = await fetch('/api/push-notifications', { headers: getHeaders() });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!formData.title) { setErrMsg('أدخل البيانات المطلوبة'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/push-notifications?id=${editItem.id}` : '/api/push-notifications';
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
      await fetch(`/api/push-notifications?id=${id}`, { method: 'DELETE', headers: getHeaders() });
      fetchItems();
    } catch (e) { console.error(e); }
  };

  const filteredItems = items.filter((i: any) => {
    const s = searchTerm.toLowerCase();
    return i.title?.toLowerCase().includes(s) || i.name?.toLowerCase().includes(s) ||
      i.student_name?.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s);
  });

  const columns = [
    {
      key: 'title', label: 'العنوان',
      render: (val: any, item: any) => (
        <div className="cell-with-icon">
          <div className="cell-icon"><Smartphone size={16} /></div>
          <div>
            <div className="cell-title">{item.title || item.name || item.student_name || item.code || '—'}</div>
            {(item.description || item.content) && <div className="cell-sub">{item.description || item.content}</div>}
          </div>
        </div>
      )
    },
    {
      key: 'status', label: 'الحالة', align: 'center' as const,
      render: (val: any) => <span className="badge badge-green">{val || 'نشط'}</span>
    },
    {
      key: 'created_at', label: 'التاريخ', align: 'center' as const,
      render: (val: any) => val ? new Date(val).toLocaleDateString('ar-SA') : '—'
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

  if (loading) return <LoadingState message="جاري تحميل الإشعارات..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="إشعارات الجوال"
        subtitle="إدارة إشعارات الجوال"
        icon={<Smartphone size={22} />}
        action={
          <button className="btn-gold" onClick={() => { setEditItem(null); setFormData({ title: '', description: '', status: 'active' }); setErrMsg(''); setShowAddModal(true); }}>
            <Plus size={16} /> إضافة جديد
          </button>
        }
      />

      <div className="stat-grid">
        <StatCard label="الإجمالي" value={items.length} icon={<Smartphone size={20} />} color="#D4A843" />
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="بحث في الإشعارات..." />

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<Smartphone size={32} />}
          title="لا توجد إشعارات بعد"
          description="أضف أول إشعار لإرساله للمستخدمين"
          action={<button className="btn-gold" onClick={() => setShowAddModal(true)}><Plus size={16} /> إضافة</button>}
        />
      ) : (
        <DataTable columns={columns} data={filteredItems} />
      )}

      {showAddModal && (
        <Modal
          title={editItem ? 'تعديل الإشعار' : 'إضافة إشعار جديد'}
          icon={editItem ? <Pencil size={18} /> : <Smartphone size={18} />}
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
              {saving ? '⏳ جاري الحفظ...' : editItem ? <><Pencil size={15} /> حفظ التعديلات</> : <><Smartphone size={15} /> حفظ</>}
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
