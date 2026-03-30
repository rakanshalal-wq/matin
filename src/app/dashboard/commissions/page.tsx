'use client';
export const dynamic = 'force-dynamic';
import { BadgeDollarSign, Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, SearchBar, Modal, EmptyState, LoadingState, Badge } from '../_components';

const typeLabels: any = { fixed: 'مبلغ ثابت', percentage: 'نسبة مئوية', tiered: 'متدرّج', bonus: 'مكافأة' };
const roleLabels: any = { sales_rep: 'مندوب مبيعات', referral: 'مُحيل', partner: 'شريك', employee: 'موظف', affiliate: 'مسوّق بالعمولة' };
const statusVariant: any = { paid: 'green', pending: 'gold', processing: 'blue', cancelled: 'red' };
const statusLabels: any = { paid: 'تم الصرف', pending: 'معلّق', processing: 'جاري المعالجة', cancelled: 'ملغي' };
const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const formatMoney = (val: number) => val.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CommissionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ person_name: '', role: '', type: 'fixed', amount: '', percentage: '', source: '', month: '', status: 'pending' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try { const res = await fetch('/api/commissions', { headers: getHeaders() }); const result = await res.json(); setData(result || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.person_name) return alert('اسم المستفيد مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/commissions', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ person_name: '', role: '', type: 'fixed', amount: '', percentage: '', source: '', month: '', status: 'pending' }); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => { if (!confirm('هل أنت متأكد من الحذف؟')) return; try { await fetch(`/api/commissions?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (e) { console.error(e); } };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ person_name: item.person_name || '', role: item.role || '', type: item.type || 'fixed', amount: item.amount?.toString() || '', percentage: item.percentage?.toString() || '', source: item.source || '', month: item.month || '', status: item.status || 'pending' });
    setShowModal(true);
  };

  const filtered = data.filter((item: any) => item.person_name?.toLowerCase().includes(search.toLowerCase()) || item.role?.toLowerCase().includes(search.toLowerCase()) || item.source?.toLowerCase().includes(search.toLowerCase()));
  const totalPaid = data.filter((d: any) => d.status === 'paid').reduce((s: number, d: any) => s + (parseFloat(d.amount) || 0), 0);
  const totalPending = data.filter((d: any) => d.status === 'pending').reduce((s: number, d: any) => s + (parseFloat(d.amount) || 0), 0);

  if (loading) return <LoadingState />;

  return (
    <div>
      {totalPending > 0 && (
        <div className="alert-bar" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)' }}>
          <span style={{ color: '#F59E0B', fontWeight: 700 }}>عمولات معلّقة بمبلغ {formatMoney(totalPending)} ر.س</span>
          <span style={{ color: 'var(--text-dim)' }}>يرجى مراجعتها وصرفها</span>
        </div>
      )}

      <PageHeader title="العمولات والإحالات" subtitle="إدارة عمولات المندوبين والشركاء" icon={<BadgeDollarSign size={20} color="#D4A843" />}
        actions={<button className="btn-gold" onClick={() => { setEditItem(null); setForm({ person_name: '', role: '', type: 'fixed', amount: '', percentage: '', source: '', month: '', status: 'pending' }); setShowModal(true); }}><Plus size={15} /> إضافة عمولة</button>}
      />

      <div className="stat-grid">
        <StatCard value={data.length} label="إجمالي السجلات" icon={<BadgeDollarSign size={17} color="#D4A843" />} color="#D4A843" />
        <StatCard value={`${formatMoney(totalPaid)} ر.س`} label="تم الصرف" icon={<CheckCircle size={17} color="#10B981" />} color="#10B981" />
        <StatCard value={`${formatMoney(totalPending)} ر.س`} label="معلّق" icon={<BadgeDollarSign size={17} color="#F59E0B" />} color="#F59E0B" />
        <StatCard value={data.filter((d: any) => d.status === 'cancelled').length} label="ملغي" icon={<XCircle size={17} color="#EF4444" />} color="#EF4444" />
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="بحث بالاسم أو الدور أو المصدر..." />

      <div className="dcard">
        {filtered.length === 0 ? (
          <EmptyState icon={<BadgeDollarSign size={19} color="#6B7280" />} message="لا توجد عمولات مسجلة" action={<button className="btn-gold" onClick={() => setShowModal(true)}><Plus size={15} /> إضافة عمولة</button>} />
        ) : (
          <div className="table-wrap">
            <table className="dtable">
              <thead><tr>
                <th>المستفيد</th><th style={{ textAlign: 'center' }}>الدور</th><th style={{ textAlign: 'center' }}>النوع</th><th style={{ textAlign: 'center' }}>المبلغ</th><th style={{ textAlign: 'center' }}>النسبة</th><th style={{ textAlign: 'center' }}>الشهر</th><th style={{ textAlign: 'center' }}>الحالة</th><th style={{ textAlign: 'center' }}>إجراءات</th>
              </tr></thead>
              <tbody>
                {filtered.map((item: any) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="stat-icon" style={{ width: 40, height: 40, background: 'rgba(212,168,67,0.1)', border: 'none' }}><BadgeDollarSign size={16} color="#D4A843" /></div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{item.person_name}</div>
                          {item.source && <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.source}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}><Badge variant="purple">{roleLabels[item.role] || item.role || '—'}</Badge></td>
                    <td style={{ textAlign: 'center' }}>{typeLabels[item.type] || item.type}</td>
                    <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>{formatMoney(parseFloat(item.amount) || 0)} ر.س</td>
                    <td style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 700 }}>{parseFloat(item.percentage) > 0 ? `${item.percentage}%` : '—'}</td>
                    <td style={{ textAlign: 'center' }}>{item.month || '—'}</td>
                    <td style={{ textAlign: 'center' }}><Badge variant={statusVariant[item.status] || 'gold'}>{statusLabels[item.status] || item.status}</Badge></td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                        <button className="btn-sm btn-sm-gold" onClick={() => handleEdit(item)}><Pencil size={11} /></button>
                        <button className="btn-sm btn-sm-red" onClick={() => handleDelete(item.id)}><Trash2 size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditItem(null); }} title={editItem ? 'تعديل عمولة' : 'إضافة عمولة جديدة'} titleIcon={<BadgeDollarSign size={18} color="#D4A843" />} large>
        <div className="form-row">
          <div className="form-full"><label className="form-label">اسم المستفيد *</label><input className="input-field" value={form.person_name} onChange={e => setForm({ ...form, person_name: e.target.value })} placeholder="اسم المستفيد" /></div>
          <div><label className="form-label">الدور</label>
            <select className="select-field" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="">— اختر —</option><option value="sales_rep">مندوب مبيعات</option><option value="referral">مُحيل</option><option value="partner">شريك</option><option value="employee">موظف</option><option value="affiliate">مسوّق بالعمولة</option>
            </select>
          </div>
          <div><label className="form-label">نوع العمولة</label>
            <select className="select-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="fixed">مبلغ ثابت</option><option value="percentage">نسبة مئوية</option><option value="tiered">متدرّج</option><option value="bonus">مكافأة</option>
            </select>
          </div>
          <div><label className="form-label">المبلغ (ر.س)</label><input className="input-field" type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" /></div>
          <div><label className="form-label">النسبة (%)</label><input className="input-field" type="number" step="0.01" max={100} value={form.percentage} onChange={e => setForm({ ...form, percentage: e.target.value })} placeholder="10" /></div>
          <div><label className="form-label">المصدر</label><input className="input-field" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="اشتراك مدرسة الأمل" /></div>
          <div><label className="form-label">الشهر</label>
            <select className="select-field" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })}>
              <option value="">— اختر —</option>{months.map((m, i) => <option key={i} value={m}>{m}</option>)}
            </select>
          </div>
          <div><label className="form-label">الحالة</label>
            <select className="select-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="pending">معلّق</option><option value="processing">جاري المعالجة</option><option value="paid">تم الصرف</option><option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleSubmit}>{editItem ? 'تحديث' : 'إضافة'}</button>
          <button className="btn-outline" onClick={() => { setShowModal(false); setEditItem(null); }}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
