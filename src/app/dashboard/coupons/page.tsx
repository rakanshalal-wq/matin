'use client';
export const dynamic = 'force-dynamic';
import { Tag, Plus, Pencil, Trash2, CheckCircle, Ban, Lock, Star, Copy, Dice5 } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, SearchBar, Modal, EmptyState, LoadingState, Badge } from '../_components';

export default function CouponsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ code: '', description: '', discount_type: 'percentage', discount_value: '', max_uses: '100', used_count: '0', start_date: '', end_date: '', status: 'active' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try { const res = await fetch('/api/coupons', { headers: getHeaders() }); const result = await res.json(); setData(result || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.code) return alert('كود الخصم مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/coupons', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ code: '', description: '', discount_type: 'percentage', discount_value: '', max_uses: '100', used_count: '0', start_date: '', end_date: '', status: 'active' }); }
      else { const err = await res.json(); alert(err.error || 'حدث خطأ'); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => { if (!confirm('هل أنت متأكد من الحذف؟')) return; try { await fetch(`/api/coupons?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (e) { console.error(e); } };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ code: item.code || '', description: item.description || '', discount_type: item.discount_type || 'percentage', discount_value: item.discount_value?.toString() || '', max_uses: item.max_uses?.toString() || '100', used_count: item.used_count?.toString() || '0', start_date: item.start_date ? item.start_date.split('T')[0] : '', end_date: item.end_date ? item.end_date.split('T')[0] : '', status: item.status || 'active' });
    setShowModal(true);
  };

  const generateCode = () => { const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let code = 'MATIN-'; for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length)); setForm({ ...form, code }); };
  const isExpired = (date: string) => date ? new Date(date) < new Date() : false;
  const isFullyUsed = (item: any) => parseInt(item.used_count) >= parseInt(item.max_uses);

  const filtered = data.filter((item: any) => item.code?.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase()));
  const stats = { total: data.length, active: data.filter((d: any) => d.status === 'active' && !isExpired(d.end_date) && !isFullyUsed(d)).length, expired: data.filter((d: any) => isExpired(d.end_date)).length, fullyUsed: data.filter((d: any) => isFullyUsed(d)).length };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="كوبونات الخصم" subtitle="إدارة أكواد الخصم والعروض الترويجية" icon={<Tag size={20} color="#D4A843" />}
        actions={<button className="btn-gold" onClick={() => { setEditItem(null); setForm({ code: '', description: '', discount_type: 'percentage', discount_value: '', max_uses: '100', used_count: '0', start_date: '', end_date: '', status: 'active' }); setShowModal(true); }}><Plus size={15} /> إنشاء كوبون</button>}
      />

      <div className="stat-grid">
        <StatCard value={stats.total} label="إجمالي الكوبونات" icon={<Tag size={17} color="#D4A843" />} color="#D4A843" />
        <StatCard value={stats.active} label="نشط" icon={<CheckCircle size={17} color="#10B981" />} color="#10B981" />
        <StatCard value={stats.expired} label="منتهي" icon={<Ban size={17} color="#EF4444" />} color="#EF4444" />
        <StatCard value={stats.fullyUsed} label="مستنفد" icon={<Lock size={17} color="#6B7280" />} color="#6B7280" />
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="بحث بالكود أو الوصف..." />

      <div className="dcard">
        {filtered.length === 0 ? (
          <EmptyState icon={<Star size={19} color="#D4A843" />} message="لا توجد كوبونات خصم" action={<button className="btn-gold" onClick={() => setShowModal(true)}><Plus size={15} /> إنشاء كوبون</button>} />
        ) : (
          <div className="table-wrap">
            <table className="dtable">
              <thead><tr>
                <th>الكود</th><th style={{ textAlign: 'center' }}>نوع الخصم</th><th style={{ textAlign: 'center' }}>القيمة</th><th style={{ textAlign: 'center' }}>الاستخدام</th><th style={{ textAlign: 'center' }}>النهاية</th><th style={{ textAlign: 'center' }}>الحالة</th><th style={{ textAlign: 'center' }}>إجراءات</th>
              </tr></thead>
              <tbody>
                {filtered.map((item: any) => {
                  const expired = isExpired(item.end_date);
                  const full = isFullyUsed(item);
                  const usagePercent = Math.min((parseInt(item.used_count) / parseInt(item.max_uses)) * 100, 100);
                  return (
                    <tr key={item.id} style={{ opacity: expired || full ? 0.6 : 1 }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="stat-icon" style={{ width: 40, height: 40, background: 'rgba(212,168,67,0.1)', border: 'none' }}><Tag size={16} color="#D4A843" /></div>
                          <div>
                            <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: 15, fontFamily: 'monospace', letterSpacing: 1, direction: 'ltr' as any }}>{item.code}</div>
                            {item.description && <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.description.substring(0, 30)}{item.description.length > 30 ? '...' : ''}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.discount_type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}</td>
                      <td style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 700, fontSize: 16 }}>
                        {item.discount_type === 'percentage' ? `${item.discount_value}%` : `${parseFloat(item.discount_value).toLocaleString()} ر.س`}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                          <div style={{ width: 60, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${usagePercent}%`, height: '100%', background: full ? 'var(--red)' : 'var(--green)', borderRadius: 3 }} />
                          </div>
                          <span style={{ color: full ? 'var(--red)' : 'var(--text-dim)', fontSize: 12, fontWeight: 600 }}>{item.used_count}/{item.max_uses}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', color: expired ? 'var(--red)' : 'var(--text-muted)', fontWeight: expired ? 700 : 400, fontSize: 13 }}>
                        {item.end_date ? new Date(item.end_date).toLocaleDateString('ar-SA') : '—'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge variant={expired ? 'red' : full ? 'purple' : item.status === 'active' ? 'green' : 'gold'}>
                          {expired ? 'منتهي' : full ? 'مستنفد' : item.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                          <button className="btn-sm btn-sm-blue" onClick={() => { navigator.clipboard.writeText(item.code); alert('تم نسخ الكود!'); }}><Copy size={11} /> نسخ</button>
                          <button className="btn-sm btn-sm-gold" onClick={() => handleEdit(item)}><Pencil size={11} /></button>
                          <button className="btn-sm btn-sm-red" onClick={() => handleDelete(item.id)}><Trash2 size={11} /></button>
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

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditItem(null); }} title={editItem ? 'تعديل كوبون' : 'إنشاء كوبون جديد'} titleIcon={<Tag size={18} color="#D4A843" />} large>
        <div className="form-row">
          <div className="form-full">
            <label className="form-label">كود الخصم *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input-field" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="MATIN-XXXXX" style={{ fontFamily: 'monospace', letterSpacing: 2, fontSize: 16 }} />
              <button className="btn-sm btn-sm-blue" onClick={generateCode} style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}><Dice5 size={14} /> توليد</button>
            </div>
          </div>
          <div><label className="form-label">نوع الخصم</label>
            <select className="select-field" value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })}>
              <option value="percentage">نسبة مئوية (%)</option><option value="fixed">مبلغ ثابت (ر.س)</option>
            </select>
          </div>
          <div><label className="form-label">قيمة الخصم {form.discount_type === 'percentage' ? '(%)' : '(ر.س)'}</label>
            <input className="input-field" type="number" step="0.01" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} placeholder={form.discount_type === 'percentage' ? '15' : '500'} />
          </div>
          <div><label className="form-label">الحد الأقصى للاستخدام</label><input className="input-field" type="number" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })} /></div>
          <div><label className="form-label">عدد مرات الاستخدام</label><input className="input-field" type="number" value={form.used_count} onChange={e => setForm({ ...form, used_count: e.target.value })} /></div>
          <div><label className="form-label">تاريخ البداية</label><input className="input-field" type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></div>
          <div><label className="form-label">تاريخ النهاية</label><input className="input-field" type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} /></div>
          <div className="form-full"><label className="form-label">الوصف</label><textarea className="textarea-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف الكوبون والعرض..." /></div>
          <div><label className="form-label">الحالة</label>
            <select className="select-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">نشط</option><option value="inactive">غير نشط</option><option value="expired">منتهي</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleSubmit}>{editItem ? 'تحديث' : 'إنشاء'}</button>
          <button className="btn-outline" onClick={() => { setShowModal(false); setEditItem(null); }}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
