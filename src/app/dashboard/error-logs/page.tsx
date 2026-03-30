'use client';
export const dynamic = 'force-dynamic';
import { Bug, Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, StatCard, SearchBar, DataTable, EmptyState, LoadingState, Modal } from '../_components';
import { getHeaders } from '@/lib/api';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'active' });
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/error-logs', { headers: getHeaders() });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!formData.title) { setErrMsg('أدخل البيانات المطلوبة'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/error-logs?id=${editItem.id}` : '/api/error-logs';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false); setEditItem(null);
        setFormData({ title: '', description: '', status: 'active' });
        fetchItems();
      } else setErrMsg(data.error || 'فشل الحفظ');
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: any) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      await fetch(`/api/error-logs?id=${id}`, { method: 'DELETE', headers: getHeaders() });
      fetchItems();
    } catch (e) { console.error(e); }
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setFormData({ title: item.title || item.name || '', description: item.description || '', status: item.status || 'active' });
    setErrMsg('');
    setShowAddModal(true);
  };

  const filteredItems = items.filter((i: any) => {
    const s = searchTerm.toLowerCase();
    return i.title?.toLowerCase().includes(s) || i.name?.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s);
  });

  const columns = [
    {
      key: 'title', label: 'العنوان',
      render: (v: any, item: any) => (
        <div className="cell-with-icon">
          <div className="cell-icon" style={{ background: 'rgba(239,68,68,0.1)' }}><Bug size={16} color="#EF4444" /></div>
          <div>
            <div className="cell-title">{item.title || item.name || item.code || '—'}</div>
            {(item.description || item.content) && <div className="cell-sub">{item.description || item.content}</div>}
          </div>
        </div>
      )
    },
    {
      key: 'status', label: 'الحالة', align: 'center' as const,
      render: (v: any) => {
        const isResolved = v === 'resolved' || v === 'closed';
        return <span className={`badge ${isResolved ? 'badge-green' : 'badge-red'}`}>{v || 'نشط'}</span>;
      }
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
          <button className="btn-sm btn-sm-gold" onClick={() => openEdit(item)}><Pencil size={13} /> تعديل</button>
          <button className="btn-sm btn-sm-red" onClick={() => handleDelete(item.id)}><Trash2 size={13} /> حذف</button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingState message="جاري تحميل سجل الأخطاء..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="سجل الأخطاء"
        subtitle="سجل الأخطاء والمشاكل"
        icon={<Bug size={22} />}
        action={
          <button className="btn-gold" onClick={() => { setEditItem(null); setFormData({ title: '', description: '', status: 'active' }); setErrMsg(''); setShowAddModal(true); }}>
            <Plus size={16} /> إضافة جديد
          </button>
        }
      />

      <div className="stat-grid">
        <StatCard label="الإجمالي" value={items.length} icon={<Bug size={20} />} color="#EF4444" />
        <StatCard label="نشطة" value={items.filter(i => i.status !== 'resolved' && i.status !== 'closed').length} icon={<Bug size={20} />} color="#F59E0B" />
        <StatCard label="محلولة" value={items.filter(i => i.status === 'resolved' || i.status === 'closed').length} icon={<Bug size={20} />} color="#10B981" />
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="بحث في سجل الأخطاء..." />

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<Bug size={32} />}
          title="لا توجد أخطاء مسجلة"
          description="النظام يعمل بشكل سليم"
        />
      ) : (
        <DataTable columns={columns} data={filteredItems} />
      )}

      {showAddModal && (
        <Modal
          title={editItem ? 'تعديل الخطأ' : 'إضافة خطأ جديد'}
          icon={editItem ? <Pencil size={18} /> : <Bug size={18} />}
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
            <button className="btn-gold" onClick={handleAdd} disabled={saving}>
              {saving ? '⏳ جاري الحفظ...' : editItem ? <><Pencil size={15} /> حفظ التعديلات</> : <><Bug size={15} /> حفظ</>}
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
