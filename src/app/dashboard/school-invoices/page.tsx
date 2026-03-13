'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SchoolInvoicesPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [msg, setMsg] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ student_id: '', parent_id: '', title: '', due_date: '', items: [{ description: '', quantity: 1, unit_price: 0, period: '' }] });

  const getH = () => ({ 'Authorization': 'Bearer ' + localStorage.getItem('matin_token'), 'Content-Type': 'application/json' });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!['owner', 'admin'].includes(u.role)) { router.push('/login'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [i, s, p] = await Promise.all([
        fetch('/api/parent-payments?type=school_invoices', { headers: getH() }).then(r => r.json()),
        fetch('/api/students', { headers: getH() }).then(r => r.json()),
        fetch('/api/parents', { headers: getH() }).then(r => r.json()),
      ]);
      setData(i);
      setStudents(Array.isArray(s) ? s : s?.students || []);
      setParents(Array.isArray(p) ? p : p?.parents || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { description: '', quantity: 1, unit_price: 0, period: '' }] }));
  const removeItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i: number, field: string, value: any) => setForm(f => ({ ...f, items: f.items.map((item, idx) => idx === i ? { ...item, [field]: value } : item) }));
  const total = form.items.reduce((s, i) => s + (i.quantity * i.unit_price), 0);

  const createInvoice = async () => {
    if (!form.student_id || form.items.some(i => !i.description || !i.unit_price)) { setMsg({ text: 'يرجى تعبئة جميع الحقول', type: 'error' }); return; }
    setSaving(true);
    const res = await fetch('/api/parent-payments', { method: 'POST', headers: getH(), body: JSON.stringify({ action: 'create_invoice', ...form }) });
    const result = await res.json();
    if (res.ok) { setMsg({ text: result.message, type: 'success' }); setForm({ student_id: '', parent_id: '', title: '', due_date: '', items: [{ description: '', quantity: 1, unit_price: 0, period: '' }] }); setActiveTab('list'); fetchData(); }
    else setMsg({ text: result.error, type: 'error' });
    setSaving(false);
  };

  const confirmCash = async (invoice_id: string, amount: number) => {
    if (!confirm(`تأكيد استلام ${amount} ريال نقداً؟`)) return;
    const res = await fetch('/api/parent-payments', { method: 'POST', headers: getH(), body: JSON.stringify({ action: 'confirm_cash_payment', invoice_id, amount }) });
    const result = await res.json();
    setMsg({ text: result.message || result.error, type: res.ok ? 'success' : 'error' });
    if (res.ok) fetchData();
  };

  const SC: Record<string, any> = { pending: { c: '#F59E0B', l: 'معلّقة' }, overdue: { c: '#EF4444', l: 'متأخرة' }, partial: { c: '#3B82F6', l: 'جزئية' }, paid: { c: '#10B981', l: 'مدفوعة' }, cancelled: { c: '#6B7280', l: 'ملغية' } };
  const filtered = (data?.invoices || []).filter((i: any) => (filterStatus === 'all' || i.status === filterStatus) && (!searchQuery || i.student_name?.includes(searchQuery) || i.invoice_number?.includes(searchQuery)));
  const inp = { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' as const };

  if (loading) return <div style={{ padding: 24, direction: 'rtl', background: '#06060E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A227' }}>⏳ جاري التحميل...</div>;

  return (
    <div style={{ padding: 24, direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic,Arial,sans-serif', background: '#06060E', minHeight: '100vh' }}>
      <h1 style={{ color: '#C9A227', fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>💰 إدارة الفواتير</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>إنشاء وإدارة فواتير أولياء الأمور</p>

      {msg && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14, background: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msg.type === 'success' ? '#10B981' : '#EF4444', display: 'flex', justifyContent: 'space-between' }}><span>{msg.text}</span><button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button></div>}

      {data?.stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
          {[{ l: 'إجمالي', v: data.stats.total, c: '#3B82F6', i: '📋' }, { l: 'مدفوعة', v: data.stats.paid, c: '#10B981', i: '✅' }, { l: 'معلّقة', v: data.stats.pending, c: '#F59E0B', i: '⏳' }, { l: 'المحصّل', v: `${Number(data.stats.collected).toLocaleString()} ر`, c: '#10B981', i: '💰' }, { l: 'المستحق', v: `${Number(data.stats.outstanding).toLocaleString()} ر`, c: '#EF4444', i: '⚠️' }].map(st => (
            <div key={st.l} style={{ background: `${st.c}10`, border: `1px solid ${st.c}25`, borderRadius: 12, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22 }}>{st.i}</div>
              <div style={{ color: st.c, fontSize: 18, fontWeight: 800 }}>{st.v}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{st.l}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 6 }}>
        {[{ k: 'list', l: '📋 قائمة الفواتير' }, { k: 'create', l: '➕ إنشاء فاتورة' }].map(t => (
          <button key={t.k} onClick={() => setActiveTab(t.k as any)} style={{ flex: 1, padding: 10, borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, textAlign: 'center', background: activeTab === t.k ? 'rgba(201,162,39,0.15)' : 'transparent', color: activeTab === t.k ? '#C9A227' : 'rgba(255,255,255,0.5)', border: activeTab === t.k ? '1px solid rgba(201,162,39,0.3)' : '1px solid transparent' }}>{t.l}</button>
        ))}
      </div>

      {activeTab === 'list' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <input placeholder="🔍 بحث..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inp, flex: 1, minWidth: 200 }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inp, width: 'auto' }}>
              <option value="all">كل الحالات</option>
              {Object.entries(SC).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
            </select>
          </div>
          {filtered.length === 0 ? <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>📭 لا توجد فواتير</div>
          : <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead><tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{['رقم الفاتورة', 'الطالب', 'ولي الأمر', 'المبلغ', 'الاستحقاق', 'الحالة', 'إجراء'].map(h => <th key={h} style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.6)', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
              <tbody>{filtered.map((inv: any) => {
                const sc = SC[inv.status] || { c: '#6B7280', l: inv.status };
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', fontSize: 12 }}>{inv.invoice_number}</td>
                    <td style={{ padding: '12px 14px', color: 'white', fontWeight: 600 }}>{inv.student_name || '—'}</td>
                    <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.6)' }}><div>{inv.parent_name || '—'}</div>{inv.parent_phone && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{inv.parent_phone}</div>}</td>
                    <td style={{ padding: '12px 14px', color: '#C9A227', fontWeight: 700 }}>{Number(inv.total).toLocaleString()} ريال</td>
                    <td style={{ padding: '12px 14px', color: inv.status === 'overdue' ? '#EF4444' : 'rgba(255,255,255,0.6)', fontSize: 13 }}>{inv.due_date ? new Date(inv.due_date).toLocaleDateString('ar-SA') : '—'}</td>
                    <td style={{ padding: '12px 14px' }}><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${sc.c}20`, color: sc.c }}>{sc.l}</span></td>
                    <td style={{ padding: '12px 14px' }}>{['pending', 'overdue'].includes(inv.status) && inv.payment_method === 'cash' && <button onClick={() => confirmCash(inv.id, inv.total)} style={{ padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}>✅ تأكيد الاستلام</button>}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>}
        </div>
      )}

      {activeTab === 'create' && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
          <h3 style={{ color: '#C9A227', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>➕ فاتورة جديدة</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div><label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>الطالب *</label><select value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} style={inp}><option value="">اختر الطالب</option>{students.map((s: any) => <option key={s.id} value={s.id}>{s.name_ar || s.name || s.student_id}</option>)}</select></div>
            <div><label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>ولي الأمر</label><select value={form.parent_id} onChange={e => setForm(f => ({ ...f, parent_id: e.target.value }))} style={inp}><option value="">اختر ولي الأمر</option>{parents.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>عنوان الفاتورة</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="رسوم الفصل الأول" style={inp} /></div>
            <div><label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>تاريخ الاستحقاق</label><input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} style={inp} /></div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>بنود الفاتورة *</label>
              <button onClick={addItem} style={{ padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.3)', color: '#C9A227' }}>➕ إضافة بند</button>
            </div>
            {form.items.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input placeholder="وصف البند *" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} style={inp} />
                <input type="number" placeholder="الكمية" value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} style={inp} min={1} />
                <input type="number" placeholder="السعر *" value={item.unit_price || ''} onChange={e => updateItem(i, 'unit_price', Number(e.target.value))} style={inp} min={0} />
                <input placeholder="الفترة" value={item.period} onChange={e => updateItem(i, 'period', e.target.value)} style={inp} />
                {form.items.length > 1 && <button onClick={() => removeItem(i)} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>✕</button>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(201,162,39,0.08)', borderRadius: 12, marginBottom: 20 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>الإجمالي:</span>
            <span style={{ color: '#C9A227', fontSize: 24, fontWeight: 800 }}>{total.toLocaleString()} ريال</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setActiveTab('list')} style={{ flex: 1, padding: 12, borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>إلغاء</button>
            <button onClick={createInvoice} disabled={saving} style={{ flex: 2, padding: 12, borderRadius: 10, cursor: 'pointer', background: 'linear-gradient(135deg,#C9A227,#E8C547)', border: 'none', color: '#06060E', fontSize: 14, fontWeight: 700, opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الإنشاء...' : '✅ إنشاء الفاتورة'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
