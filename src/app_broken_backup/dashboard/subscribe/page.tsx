'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function SubscribePage() {
  const [sub, setSub] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([fetch('/api/subscriptions', { credentials: 'include' }), fetch('/api/plans', { credentials: 'include' })]);
      const s = await r1.json(); const p = await r2.json();
      setSub(Array.isArray(s) ? s[0] : s);
      setPlans(Array.isArray(p) ? p : []);
    } catch {}
    setLoading(false);
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 32, marginBottom: 24 }, planCard: (active: boolean) => ({ background: active ? 'rgba(201,168,76,0.1)' : CARD, border: `2px solid ${active ? GOLD : BORDER}`, borderRadius: 20, padding: 28, cursor: 'pointer', transition: 'all 0.2s' }), btn: { background: GOLD, color: '#000', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 15, fontFamily: 'IBM Plex Sans Arabic, sans-serif' } };
  if (loading) return <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div></div>;
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 28, fontWeight: 700 }}>الاشتراك والباقات</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>إدارة اشتراك المؤسسة وترقية الباقة</div></div>
      {sub && (<div style={s.card}>
        <h3 style={{ margin: '0 0 20px', color: GOLD }}>الاشتراك الحالي</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[{ label: 'الباقة', v: sub.plan_name || sub.plan || '-' }, { label: 'الحالة', v: sub.status === 'active' ? 'نشط ✓' : 'غير نشط' }, { label: 'تاريخ التجديد', v: sub.expires_at ? new Date(sub.expires_at).toLocaleDateString('ar-SA') : '-' }, { label: 'المبلغ الشهري', v: `${Number(sub.amount||0).toLocaleString()} ر.س` }].map((st, i) => (<div key={i}><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{st.label}</div><div style={{ fontSize: 18, fontWeight: 700, color: GOLD }}>{st.v}</div></div>))}
        </div>
      </div>)}
      <h3 style={{ marginBottom: 20 }}>الباقات المتاحة</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {plans.map((plan: any) => (
          <div key={plan.id} style={s.planCard(sub?.plan_id === plan.id)}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name_ar || plan.name}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: GOLD, marginBottom: 16 }}>{Number(plan.price||0).toLocaleString()} <span style={{ fontSize: 16, fontWeight: 400 }}>ر.س/شهر</span></div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 20 }}>{plan.description || ''}</div>
            <div style={{ marginBottom: 20 }}>
              {[`${plan.max_students || '∞'} طالب`, `${plan.max_teachers || '∞'} معلم`, `${plan.max_classes || '∞'} فصل`].map((f, i) => (<div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}><span style={{ color: '#22c55e' }}>✓</span>{f}</div>))}
            </div>
            {sub?.plan_id !== plan.id && <button style={{ ...s.btn, width: '100%' }}>ترقية للباقة</button>}
            {sub?.plan_id === plan.id && <div style={{ textAlign: 'center', color: GOLD, fontWeight: 700 }}>✓ الباقة الحالية</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
