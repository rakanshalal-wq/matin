'use client';
export const dynamic = 'force-dynamic';
import { Angry, Calendar, CheckCircle, ClipboardList, Headphones, HelpCircle, Lightbulb, Plus, Settings, Trash2, Unlock, Upload, User, Wrench, X, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, StatCard, SearchBar, EmptyState, LoadingState, Modal, FilterTabs } from '../_components';
import { getHeaders } from '@/lib/api';

const typeLabels: Record<string, string> = {
  complaint: 'شكوى', suggestion: 'اقتراح', inquiry: 'استفسار', technical: 'مشكلة تقنية'
};
const typeIcons: Record<string, any> = {
  complaint: <Angry size={13} />, suggestion: <Lightbulb size={13} />,
  inquiry: <HelpCircle size={13} />, technical: <Wrench size={13} />
};
const priorityLabels: Record<string, { label: string; color: string }> = {
  low: { label: 'منخفضة', color: '#10B981' },
  medium: { label: 'متوسطة', color: '#F59E0B' },
  high: { label: 'عالية', color: '#EF4444' },
  urgent: { label: 'عاجلة', color: '#DC2626' },
};
const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'مفتوحة', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  in_progress: { label: 'قيد المعالجة', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  closed: { label: 'مغلقة', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  rejected: { label: 'مرفوضة', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState({ subject: '', description: '', type: 'complaint', priority: 'medium' });

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/support', { headers: getHeaders() });
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.subject) { setErrMsg('أدخل عنوان التذكرة'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/support?id=${editItem.id}` : '/api/support';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
      setShowAdd(false); setEditItem(null);
      setForm({ subject: '', description: '', type: 'complaint', priority: 'medium' });
      setErrMsg(''); fetchTickets();
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ ...{ subject: '', description: '', type: 'complaint', priority: 'medium' }, ...item });
    setErrMsg('');
    setShowAdd(true);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/support', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ id, status }) });
      setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
    } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه التذكرة؟')) return;
    try {
      await fetch(`/api/support?id=${id}`, { method: 'DELETE', headers: getHeaders() });
      setTickets(tickets.filter(t => t.id !== id));
    } catch {}
  };

  const filtered = tickets.filter(t => {
    const matchSearch = (t.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.name || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusTabs = [
    { key: 'all', label: 'الكل' },
    { key: 'open', label: 'مفتوحة' },
    { key: 'in_progress', label: 'قيد المعالجة' },
    { key: 'closed', label: 'مغلقة' },
  ];

  if (loading) return <LoadingState message="جاري تحميل التذاكر..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="الدعم الفني"
        subtitle="تذاكر الدعم والشكاوى والاستفسارات"
        icon={<Headphones size={22} />}
        action={
          <button className={showAdd ? 'btn-ghost' : 'btn-gold'} onClick={() => { setShowAdd(!showAdd); setEditItem(null); }}>
            {showAdd ? <><X size={16} /> إلغاء</> : <><Plus size={16} /> تذكرة جديدة</>}
          </button>
        }
      />

      <div className="stat-grid">
        <StatCard label="الكل" value={tickets.length} icon={<ClipboardList size={20} />} color="#D4A843" />
        <StatCard label="مفتوحة" value={tickets.filter(t => t.status === 'open').length} icon={<Unlock size={20} />} color="#3B82F6" />
        <StatCard label="قيد المعالجة" value={tickets.filter(t => t.status === 'in_progress').length} icon={<Settings size={20} />} color="#F59E0B" />
        <StatCard label="مغلقة" value={tickets.filter(t => t.status === 'closed').length} icon={<CheckCircle size={20} />} color="#10B981" />
      </div>

      {showAdd && (
        <Modal
          title={editItem ? 'تعديل التذكرة' : 'تذكرة جديدة'}
          icon={editItem ? <Settings size={18} /> : <Plus size={18} />}
          onClose={() => { setShowAdd(false); setEditItem(null); setErrMsg(''); }}
          inline
        >
          <div className="form-row">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">الموضوع *</label>
              <input className="input-field" placeholder="وصف مختصر للمشكلة" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div>
              <label className="form-label">النوع</label>
              <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="complaint">شكوى</option>
                <option value="suggestion">اقتراح</option>
                <option value="inquiry">استفسار</option>
                <option value="technical">مشكلة تقنية</option>
              </select>
            </div>
            <div>
              <label className="form-label">الأولوية</label>
              <select className="input-field" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">التفاصيل</label>
              <textarea className="input-field" style={{ minHeight: 100, resize: 'vertical' }} placeholder="اشرح المشكلة بالتفصيل..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          {errMsg && <div className="error-msg">{errMsg}</div>}
          <div className="modal-footer">
            <button className="btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ جاري الإرسال...' : <><Upload size={15} /> إرسال التذكرة</>}
            </button>
          </div>
        </Modal>
      )}

      <div className="filters-bar">
        <SearchBar value={search} onChange={setSearch} placeholder="بحث في التذاكر..." />
        <FilterTabs tabs={statusTabs} active={statusFilter} onChange={setStatusFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Headphones size={32} />}
          title="لا توجد تذاكر"
          description="أضف تذكرة جديدة للدعم الفني"
        />
      ) : (
        <div className="posts-list">
          {filtered.map((ticket: any) => {
            const statusInfo = statusLabels[ticket.status] || statusLabels.open;
            const priorityInfo = priorityLabels[ticket.priority] || priorityLabels.medium;
            return (
              <div key={ticket.id} className="dcard">
                <div className="ticket-header">
                  <div className="ticket-meta">
                    <h3 className="cell-title">{ticket.subject || ticket.name}</h3>
                    <div className="ticket-badges">
                      <span className="badge" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                        {statusInfo.label}
                      </span>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: priorityInfo.color }}>
                        {priorityInfo.label}
                      </span>
                    </div>
                  </div>
                  <div className="action-btns">
                    {ticket.status === 'open' && (
                      <button className="btn-sm btn-sm-gold" onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}>
                        <Settings size={12} /> معالجة
                      </button>
                    )}
                    {ticket.status !== 'closed' && (
                      <button className="btn-sm btn-sm-green" onClick={() => handleUpdateStatus(ticket.id, 'closed')}>
                        <CheckCircle size={12} /> إغلاق
                      </button>
                    )}
                    <button className="btn-sm btn-sm-red" onClick={() => handleDelete(ticket.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {ticket.description && <p className="cell-sub" style={{ margin: '8px 0' }}>{ticket.description}</p>}
                <div className="ticket-footer">
                  <span className="cell-sub"><User size={12} /> {ticket.name || 'مجهول'}</span>
                  <span className="cell-sub">{typeIcons[ticket.type]} {typeLabels[ticket.type] || ticket.type}</span>
                  <span className="cell-sub"><Calendar size={12} /> {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('ar-SA') : ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
