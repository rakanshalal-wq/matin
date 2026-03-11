'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: '', max_uses: '', expires_at: '', description: '' });
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/coupons', { credentials: 'include' });
      const data = await r.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };
  const addCoupon = async () => {
    if (!form.code || !form.discount_value) return;
    try {
      await fetch('/api/coupons', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setShowAdd(false); setForm({ code: '', discount_type: 'percentage', discount_value: '', max_uses: '', expires_at: '', description: '' });
      fetchData();
    } catch {}
  };
  const deleteCoupon = async (id: string) => {
    if (!confirm('حذف الكوبون؟')) return;
    try {
      await fetch(`/api/coupons?id=${id}`, { method: 'DELETE', credentials: 'include' });
      fetchData();
    } catch {}
  };
  const filtered = coupons.filter(c => !search || c.code?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()));

  const s: any = {
    page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    title: { fontSize: 28, fontWeight: 700 },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
    btn: { background: GOLD, color: '#000', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' },
    card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 },
    statCard: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' },
    statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 },
    statValue: { fontSize: 28, fontWeight: 700, color: GOLD },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}`, fontWeight: 500 },
    td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` },
    modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalBox: { background: '#0D0D1A', border: `1px solid ${BORDER}`, borderRadius: 20, padding: 32, width: 480 },
    input: { width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 12 },
    select: { width: '100%', background: '#0D0D1A', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 12 },
  };

  const active = coupons.filter(c => c.is_active).length;
  const totalUses = coupons.reduce((s: number, c: any) => s + Number(c.used_count || 0), 0);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.title}>كوبونات الخصم</div>
          <div style={s.subtitle}>إدارة كوبونات الخصم والعروض الترويجية</div>
        </div>
        <button style={s.btn} onClick={() => setShowAdd(true)}>+ إضافة كوبون</button>
      </div>

      <div style={s.statsGrid}>
        {[
          { label: 'إجمالي الكوبونات', value: coupons.length },
          { label: 'كوبونات نشطة', value: active },
          { label: 'إجمالي الاستخدامات', value: totalUses },
          { label: 'منتهية الصلاحية', value: coupons.length - active },
        ].map((st, i) => (
          <div key={i} style={s.statCard}>
            <div style={s.statLabel}>{st.label}</div>
            <div style={s.statValue}>{st.value}</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>قائمة الكوبونات</h3>
          <input style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 14px', color: '#fff', fontSize: 14, outline: 'none', width: 220, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }} placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد كوبونات</div>
        ) : (
          <div style={{overflowX:"auto"}}><table style={s.table}>
            <thead><tr>{['الكود','الوصف','نوع الخصم','القيمة','الاستخدامات','الصلاحية','الحالة','إجراءات'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id}>
                  <td style={s.td}><span style={{ background: 'rgba(201,168,76,0.15)', color: GOLD, borderRadius: 8, padding: '4px 12px', fontWeight: 700, letterSpacing: 1 }}>{c.code}</span></td>
                  <td style={{ ...s.td, color: 'rgba(255,255,255,0.6)' }}>{c.description || '-'}</td>
                  <td style={s.td}>{c.discount_type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}</td>
                  <td style={{ ...s.td, color: GOLD, fontWeight: 700 }}>{c.discount_value}{c.discount_type === 'percentage' ? '%' : ' ر.س'}</td>
                  <td style={s.td}>{c.used_count || 0} / {c.max_uses || '∞'}</td>
                  <td style={{ ...s.td, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('ar-SA') : 'بلا حد'}</td>
                  <td style={s.td}><span style={{ background: c.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: c.is_active ? '#22c55e' : '#ef4444', borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{c.is_active ? 'نشط' : 'غير نشط'}</span></td>
                  <td style={s.td}><button onClick={() => deleteCoupon(c.id)} style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>حذف</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <div style={s.modal} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={s.modalBox}>
            <h3 style={{ marginBottom: 20, color: '#fff' }}>إضافة كوبون جديد</h3>
            <input style={s.input} placeholder="كود الكوبون (مثال: SAVE20)" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
            <input style={s.input} placeholder="الوصف" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <select style={s.select} value={form.discount_type} onChange={e => setForm({...form, discount_type: e.target.value})}>
              <option value="percentage">نسبة مئوية (%)</option>
              <option value="fixed">مبلغ ثابت (ر.س)</option>
            </select>
            <input style={s.input} placeholder="قيمة الخصم" type="number" value={form.discount_value} onChange={e => setForm({...form, discount_value: e.target.value})} />
            <input style={s.input} placeholder="الحد الأقصى للاستخدام (اتركه فارغاً للاستخدام غير المحدود)" type="number" value={form.max_uses} onChange={e => setForm({...form, max_uses: e.target.value})} />
            <input style={s.input} type="date" placeholder="تاريخ الانتهاء" value={form.expires_at} onChange={e => setForm({...form, expires_at: e.target.value})} />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button style={{ ...s.btn, flex: 1 }} onClick={addCoupon}>حفظ</button>
              <button style={{ ...s.btn, background: CARD, color: '#fff', border: `1px solid ${BORDER}`, flex: 1 }} onClick={() => setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
