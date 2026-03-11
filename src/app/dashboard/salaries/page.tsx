'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function SalariesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ employee_name: '', position: '', department: 'administration', basic_salary: '', allowances: '', deductions: '', month: '', payment_date: '', status: 'pending' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/salaries', { headers: getHeaders() });
      const result = await res.json();
      setData(result || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.employee_name) return alert('اسم الموظف مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/salaries', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ employee_name: '', position: '', department: 'administration', basic_salary: '', allowances: '', deductions: '', month: '', payment_date: '', status: 'pending' }); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await fetch(`/api/salaries?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ employee_name: item.employee_name || '', position: item.position || '', department: item.department || 'administration', basic_salary: item.basic_salary?.toString() || '', allowances: item.allowances?.toString() || '', deductions: item.deductions?.toString() || '', month: item.month || '', payment_date: item.payment_date ? item.payment_date.split('T')[0] : '', status: item.status || 'pending' });
    setShowModal(true);
  };

  const filtered = data.filter((item: any) => item.employee_name?.toLowerCase().includes(search.toLowerCase()) || item.position?.toLowerCase().includes(search.toLowerCase()) || item.department?.toLowerCase().includes(search.toLowerCase()));

  const totalNet = data.reduce((sum: number, d: any) => sum + (parseFloat(d.net_salary) || 0), 0);
  const totalPaid = data.filter((d: any) => d.status === 'paid').reduce((sum: number, d: any) => sum + (parseFloat(d.net_salary) || 0), 0);
  const totalPending = data.filter((d: any) => d.status === 'pending').reduce((sum: number, d: any) => sum + (parseFloat(d.net_salary) || 0), 0);

  const stats = {
    total: data.length,
    totalNet: totalNet,
    paid: totalPaid,
    pending: totalPending,
  };

  const deptLabels: any = { administration: 'إدارة', finance: 'مالية', it: 'تقنية', hr: 'موارد بشرية', academic: 'أكاديمي', maintenance: 'صيانة', transport: 'نقل', other: 'أخرى' };
  const statusLabels: any = { paid: 'تم الصرف', pending: 'معلّق', processing: 'جاري المعالجة', cancelled: 'ملغي' };
  const statusColors: any = { paid: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, processing: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  const formatMoney = (val: number) => val.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calcNet = () => { const b = parseFloat(form.basic_salary) || 0; const a = parseFloat(form.allowances) || 0; const d = parseFloat(form.deductions) || 0; return b + a - d; };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Pending Alert */}
      {stats.pending > 0 && (
        <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <div style={{ color: '#F59E0B', fontWeight: 700, fontSize: 15 }}>يوجد رواتب معلّقة بمبلغ {formatMoney(stats.pending)} ر.س</div>
            <div style={{ color: 'rgba(245,158,11,0.8)', fontSize: 13, marginTop: 2 }}>يرجى مراجعة الرواتب المعلّقة وصرفها</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>💵 الرواتب</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة رواتب الموظفين والبدلات والخصومات</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ employee_name: '', position: '', department: 'administration', basic_salary: '', allowances: '', deductions: '', month: '', payment_date: '', status: 'pending' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          ➕ إضافة راتب
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي السجلات', value: stats.total.toString(), icon: '💵', color: '#C9A227', suffix: '' },
          { label: 'إجمالي الرواتب', value: formatMoney(stats.totalNet), icon: '💰', color: '#3B82F6', suffix: ' ر.س' },
          { label: 'تم الصرف', value: formatMoney(stats.paid), icon: '✅', color: '#10B981', suffix: ' ر.س' },
          { label: 'معلّق', value: formatMoney(stats.pending), icon: '⏳', color: '#F59E0B', suffix: ' ر.س' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 28 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, marginTop: 4, direction: 'ltr' as any, textAlign: 'right' as any }}>{stat.value}<span style={{ fontSize: 13, fontWeight: 400 }}>{stat.suffix}</span></div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input placeholder="🔍 بحث بالاسم أو المنصب أو القسم..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💵</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد سجلات رواتب</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إضافة راتب" لتسجيل راتب جديد</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['الموظف', 'القسم', 'الأساسي', 'البدلات', 'الخصومات', 'الصافي', 'الشهر', 'الحالة', 'إجراءات'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
                      <div>
                        <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.employee_name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{item.position || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{deptLabels[item.department] || item.department || '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13, direction: 'ltr' as any }}>{formatMoney(parseFloat(item.basic_salary) || 0)}</td>
                  <td style={{ padding: '14px 16px', color: '#10B981', fontSize: 13, fontWeight: 600, direction: 'ltr' as any }}>+{formatMoney(parseFloat(item.allowances) || 0)}</td>
                  <td style={{ padding: '14px 16px', color: '#EF4444', fontSize: 13, fontWeight: 600, direction: 'ltr' as any }}>-{formatMoney(parseFloat(item.deductions) || 0)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: '#C9A227', fontWeight: 700, fontSize: 15, direction: 'ltr' as any }}>{formatMoney(parseFloat(item.net_salary) || 0)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}> ر.س</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.month || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✏️ تعديل</button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑️ حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? '✏️ تعديل راتب' : '➕ إضافة راتب جديد'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الموظف *</label>
                <input value={form.employee_name} onChange={e => setForm({ ...form, employee_name: e.target.value })} style={inputStyle} placeholder="اسم الموظف" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المنصب</label>
                <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={inputStyle} placeholder="مثال: معلم، محاسب" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>القسم</label>
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={inputStyle}>
                  <option value="administration">إدارة</option>
                  <option value="finance">مالية</option>
                  <option value="it">تقنية</option>
                  <option value="hr">موارد بشرية</option>
                  <option value="academic">أكاديمي</option>
                  <option value="maintenance">صيانة</option>
                  <option value="transport">نقل</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الراتب الأساسي (ر.س)</label>
                <input type="number" step="0.01" value={form.basic_salary} onChange={e => setForm({ ...form, basic_salary: e.target.value })} style={inputStyle} placeholder="0.00" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>البدلات (ر.س)</label>
                <input type="number" step="0.01" value={form.allowances} onChange={e => setForm({ ...form, allowances: e.target.value })} style={{ ...inputStyle, borderColor: 'rgba(16,185,129,0.3)' }} placeholder="0.00" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الخصومات (ر.س)</label>
                <input type="number" step="0.01" value={form.deductions} onChange={e => setForm({ ...form, deductions: e.target.value })} style={{ ...inputStyle, borderColor: 'rgba(239,68,68,0.3)' }} placeholder="0.00" />
              </div>

              {/* Net Salary Preview */}
              <div style={{ gridColumn: 'span 2', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>💰 صافي الراتب:</span>
                <span style={{ color: '#C9A227', fontWeight: 800, fontSize: 20, direction: 'ltr' as any }}>{formatMoney(calcNet())} <span style={{ fontSize: 13, fontWeight: 400 }}>ر.س</span></span>
              </div>

              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الشهر</label>
                <select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} style={inputStyle}>
                  <option value="">— اختر الشهر —</option>
                  {months.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ الصرف</label>
                <input type="date" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="pending">معلّق</option>
                  <option value="processing">جاري المعالجة</option>
                  <option value="paid">تم الصرف</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? '💾 تحديث' : '➕ إضافة'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
