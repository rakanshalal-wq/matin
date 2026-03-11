'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function FinancePage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_income: 0, total_expenses: 0, balance: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all'|'income'|'expense'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: 'income', amount: '', description: '', category: '', date: new Date().toISOString().split('T')[0] });
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/finance', { credentials: 'include' });
      const data = await r.json();
      const rows = Array.isArray(data) ? data : [];
      setTransactions(rows);
      const income = rows.filter((t:any) => t.type === 'income').reduce((s:number,t:any) => s + Number(t.amount||0), 0);
      const expenses = rows.filter((t:any) => t.type === 'expense').reduce((s:number,t:any) => s + Number(t.amount||0), 0);
      const pending = rows.filter((t:any) => t.status === 'pending').reduce((s:number,t:any) => s + Number(t.amount||0), 0);
      setStats({ total_income: income, total_expenses: expenses, balance: income - expenses, pending });
    } catch {}
    setLoading(false);
  };
  const addTransaction = async () => {
    if (!form.amount || !form.description) return;
    try {
      await fetch('/api/finance', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setShowAdd(false); setForm({ type: 'income', amount: '', description: '', category: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch {}
  };
  const filtered = transactions.filter(t => {
    if (tab !== 'all' && t.type !== tab) return false;
    if (search && !t.description?.toLowerCase().includes(search.toLowerCase()) && !t.category?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const s: any = {
    page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    title: { fontSize: 28, fontWeight: 700, color: '#fff' },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
    btn: { background: GOLD, color: '#000', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 },
    statCard: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' },
    statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 },
    statValue: { fontSize: 28, fontWeight: 700 },
    tabs: { display: 'flex', gap: 8, marginBottom: 24 },
    tab: (active: boolean) => ({ background: active ? GOLD : CARD, color: active ? '#000' : 'rgba(255,255,255,0.6)', border: `1px solid ${active ? GOLD : BORDER}`, borderRadius: 10, padding: '8px 20px', cursor: 'pointer', fontWeight: active ? 700 : 400, fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }),
    searchBar: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 16px', color: '#fff', fontSize: 14, width: 280, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}`, fontWeight: 500 },
    td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` },
    badge: (type: string) => ({ background: type === 'income' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: type === 'income' ? '#22c55e' : '#ef4444', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }),
    modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalBox: { background: '#0D0D1A', border: `1px solid ${BORDER}`, borderRadius: 20, padding: 32, width: 480 },
    input: { width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 12 },
    select: { width: '100%', background: '#0D0D1A', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 12 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.title}>الإدارة المالية</div>
          <div style={s.subtitle}>إدارة الإيرادات والمصروفات والمعاملات المالية</div>
        </div>
        <button style={s.btn} onClick={() => setShowAdd(true)}>+ إضافة معاملة</button>
      </div>

      <div style={s.statsGrid}>
        {[
          { label: 'إجمالي الإيرادات', value: stats.total_income, color: '#22c55e' },
          { label: 'إجمالي المصروفات', value: stats.total_expenses, color: '#ef4444' },
          { label: 'الرصيد الصافي', value: stats.balance, color: stats.balance >= 0 ? '#22c55e' : '#ef4444' },
          { label: 'معاملات معلقة', value: stats.pending, color: GOLD },
        ].map((s2, i) => (
          <div key={i} style={s.statCard}>
            <div style={s.statLabel}>{s2.label}</div>
            <div style={{ ...s.statValue, color: s2.color }}>{s2.value.toLocaleString('ar-SA')} ر.س</div>
          </div>
        ))}
      </div>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={s.tabs}>
            {[['all','الكل'],['income','إيرادات'],['expense','مصروفات']].map(([v,l]) => (
              <button key={v} style={s.tab(tab === v)} onClick={() => setTab(v as any)}>{l}</button>
            ))}
          </div>
          <input style={s.searchBar} placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد معاملات</div>
        ) : (
          <div style={{overflowX:"auto"}}><table style={s.table}>
            <thead>
              <tr>
                {['الوصف','الفئة','النوع','المبلغ','التاريخ','الحالة'].map(h => <th key={h} style={s.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td style={s.td}>{t.description || '-'}</td>
                  <td style={s.td}><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{t.category || '-'}</span></td>
                  <td style={s.td}><span style={s.badge(t.type)}>{t.type === 'income' ? 'إيراد' : 'مصروف'}</span></td>
                  <td style={{ ...s.td, color: t.type === 'income' ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{Number(t.amount||0).toLocaleString('ar-SA')} ر.س</td>
                  <td style={{ ...s.td, color: 'rgba(255,255,255,0.5)' }}>{t.date ? new Date(t.date).toLocaleDateString('ar-SA') : '-'}</td>
                  <td style={s.td}><span style={{ background: t.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(201,168,76,0.15)', color: t.status === 'completed' ? '#22c55e' : GOLD, borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{t.status === 'completed' ? 'مكتملة' : 'معلقة'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <div style={s.modal} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={s.modalBox}>
            <h3 style={{ marginBottom: 20, color: '#fff' }}>إضافة معاملة مالية</h3>
            <select style={s.select} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="income">إيراد</option>
              <option value="expense">مصروف</option>
            </select>
            <input style={s.input} placeholder="المبلغ (ر.س)" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
            <input style={s.input} placeholder="الوصف" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <input style={s.input} placeholder="الفئة (رسوم، راتب، ...)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
            <input style={s.input} type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button style={{ ...s.btn, flex: 1 }} onClick={addTransaction}>حفظ</button>
              <button style={{ ...s.btn, background: CARD, color: '#fff', border: `1px solid ${BORDER}`, flex: 1 }} onClick={() => setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
