'use client';
export const dynamic = 'force-dynamic';
import { Handshake, Plus, Pencil, Trash2, Eye, ExternalLink } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, SearchBar, Modal, EmptyState, LoadingState } from '../_components';

export default function PartnersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', type: '', website: '', notes: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const res = await fetch('/api/partners', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const handleSave = async () => {
    if (!formData.name) { setErrMsg('أدخل اسم الشريك'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/partners?id=${editItem.id}` : '/api/partners';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
      setShowModal(false); setEditItem(null); setFormData({ name: '', email: '', phone: '', company: '', type: '', website: '', notes: '' }); fetchItems();
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const handleEdit = (item: any) => { setEditItem(item); setFormData({ name: item.name || '', email: item.email || '', phone: item.phone || '', company: item.company || '', type: item.type || '', website: item.website || '', notes: item.notes || '' }); setErrMsg(''); setShowModal(true); };
  const handleDelete = async (id: number) => { if (!confirm('هل أنت متأكد؟')) return; try { await fetch(`/api/partners?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); } };

  const filtered = items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.company?.toLowerCase().includes(searchTerm.toLowerCase()) || i.phone?.includes(searchTerm));

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="الشركاء والموردون" subtitle="إدارة الشركاء والموردين والجهات المتعاونة" icon={<Handshake size={20} color="#D4A843" />}
        actions={<button className="btn-gold" onClick={() => { setEditItem(null); setFormData({ name: '', email: '', phone: '', company: '', type: '', website: '', notes: '' }); setErrMsg(''); setShowModal(true); }}><Plus size={15} /> إضافة شريك</button>}
      />

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard value={items.length} label="إجمالي الشركاء" icon={<Handshake size={17} color="#D4A843" />} color="#D4A843" />
        <StatCard value={items.filter(i => i.type === 'supplier').length} label="موردون" icon={<Handshake size={17} color="#3B82F6" />} color="#3B82F6" />
        <StatCard value={items.filter(i => i.type === 'tech').length} label="تقنيون" icon={<Handshake size={17} color="#10B981" />} color="#10B981" />
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="بحث بالاسم، الشركة، أو الجوال..." />

      <div className="dcard">
        {filtered.length === 0 ? (
          <EmptyState icon={<Handshake size={19} color="#6B7280" />} message="لا يوجد شركاء" action={<button className="btn-gold" onClick={() => setShowModal(true)}><Plus size={15} /> إضافة أول شريك</button>} />
        ) : (
          <div className="table-wrap">
            <table className="dtable">
              <thead><tr>
                <th>الشريك</th><th style={{ textAlign: 'center' }}>الشركة</th><th style={{ textAlign: 'center' }}>النوع</th><th style={{ textAlign: 'center' }}>الجوال</th><th style={{ textAlign: 'center' }}>الموقع</th><th style={{ textAlign: 'center' }}>إجراءات</th>
              </tr></thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="stat-icon" style={{ width: 40, height: 40, background: 'rgba(139,92,246,0.1)', border: 'none' }}><Handshake size={16} color="#8B5CF6" /></div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{item.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.company || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{item.type || '—'}</td>
                    <td style={{ textAlign: 'center', direction: 'ltr' }}>{item.phone || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      {item.website ? <a href={item.website} target="_blank" rel="noreferrer" className="btn-sm btn-sm-blue"><ExternalLink size={11} /> زيارة</a> : '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                        <button className="btn-sm btn-sm-gold" onClick={() => handleEdit(item)}><Pencil size={11} /> تعديل</button>
                        <button className="btn-sm btn-sm-red" onClick={() => handleDelete(item.id)}><Trash2 size={11} /> حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditItem(null); setErrMsg(''); }} title={editItem ? 'تعديل الشريك' : 'إضافة شريك جديد'} titleIcon={<Handshake size={18} color="#D4A843" />} large>
        {errMsg && <div className="error-box">{errMsg}</div>}
        <div className="form-row">
          <div className="form-full"><label className="form-label">اسم الشريك *</label><input className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="اسم الشريك أو جهة الاتصال" /></div>
          <div><label className="form-label">البريد الإلكتروني</label><input className="input-field" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
          <div><label className="form-label">رقم الجوال</label><input className="input-field" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" /></div>
          <div><label className="form-label">الشركة</label><input className="input-field" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} /></div>
          <div><label className="form-label">النوع</label>
            <select className="select-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
              <option value="">اختر النوع</option><option value="supplier">مورد</option><option value="sponsor">راعي</option><option value="tech">تقني</option><option value="educational">تعليمي</option><option value="other">أخرى</option>
            </select>
          </div>
          <div className="form-full"><label className="form-label">الموقع الإلكتروني</label><input className="input-field" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://example.com" /></div>
          <div className="form-full"><label className="form-label">ملاحظات</label><textarea className="textarea-field" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="ملاحظات إضافية" /></div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
          <button className="btn-outline" onClick={() => { setShowModal(false); setEditItem(null); setErrMsg(''); }}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
