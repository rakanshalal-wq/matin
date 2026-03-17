'use client';
import { Check, Coins, CreditCard, Package, Receipt, Trophy } from "lucide-react";
import { useState, useEffect } from 'react';

const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };

const pkgConfig: any = {
  basic: { name: 'أساسي', price: 0, color: '#6B7280', icon: '🆓', features: ['مدرسة واحدة', '5 معلمين', '50 طالب'] },
  advanced: { name: 'متقدم', price: 299, color: '#C9A227', icon: '⭐', features: ['5 مدارس', '20 معلم', '500 طالب', 'بنك أسئلة AI', 'مراقبة اختبارات'] },
  enterprise: { name: 'مؤسسي', price: 599, color: '#8B5CF6', icon: "ICON_Trophy", features: ['مدارس غير محدودة', 'معلمين غير محدود', 'طلاب غير محدود', 'كل الميزات', 'دعم فني أولوية', 'تقارير متقدمة'] },
};

export default function FinancePage() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [upgrading, setUpgrading] = useState('');
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'card', description: '' });
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setUser(u);
    fetchAll(u);
  }, []);

  const fetchAll = async (u: any) => {
    try {
      const [subRes, payRes] = await Promise.all([
        fetch('/api/finance?type=my_subscription', { headers: getHeaders() }),
        fetch('/api/finance?type=my_payments', { headers: getHeaders() }),
      ]);
      const [subData, payData] = await Promise.all([subRes.json(), payRes.json()]);
      setSubscription(subData);
      setPayments(Array.isArray(payData) ? payData : []);

      if (['super_admin', 'owner'].includes(u?.role)) {
        const dashRes = await fetch('/api/finance?type=dashboard', { headers: getHeaders() });
        const dashData = await dashRes.json();
        if (!dashData.error) setDashboard(dashData);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleAddPayment = async () => {
    if (!paymentForm.amount) { return; }
    setSaving(true);
    try {
      const res = await fetch('/api/finance', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ type: 'add_payment', ...paymentForm }) });
      const data = await res.json();
      if (res.ok) { setShowModal(false); setPaymentForm({ amount: '', method: 'card', description: '' }); fetchAll(user); }
      else { /* ignore */ }
    } catch {} finally { setSaving(false); }
  };
  const updateSubscription = async (updates: any) => {
    try {
      const res = await fetch('/api/finance?type=subscription', { method: 'PUT', headers: getHeaders(), body: JSON.stringify(updates) });
      const data = await res.json();
      if (!res.ok) setErrMsg(data.error || 'فشل التحديث');
      else fetchAll(user);
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); }
  };
  const handleUpgrade = async (pkg: string) => {
    setErrMsg('');
    if (pkg === (subscription?.package || user?.package)) return;
    setUpgrading(pkg); setMsg('');
    try {
      const res = await fetch('/api/finance', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'upgrade', package: pkg }) });
      const data = await res.json();
      if (res.ok) setMsg(data.message || 'تم إنشاء الفاتورة');
      else setMsg(data.error || 'فشل');
    } catch { setMsg('خطأ'); } finally { setUpgrading(''); }
  };

  const currentPkg = subscription?.package || user?.package || 'basic';
  const inputStyle = { fontFamily: 'IBM Plex Sans Arabic, sans-serif' };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A227' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#C9A227', margin: '0 0 24px' }}>Coins المالية والاشتراكات</h1>

      {msg && <div style={{ padding: 12, background: msg.includes('فاتورة') || msg.includes('تم') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.includes('فاتورة') || msg.includes('تم') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 10, color: msg.includes('فاتورة') || msg.includes('تم') ? '#10B981' : '#EF4444', marginBottom: 16, fontSize: 14 }}>{msg}</div>}

      {/* لوحة مالية للمالك */}
      {dashboard && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 30 }}>
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: 20 }}>
            <p style={{ color: '#9CA3AF', fontSize: 13, margin: '0 0 6px' }}>إجمالي الإيرادات</p>
            <p style={{ color: '#10B981', fontSize: 28, fontWeight: 700, margin: 0 }}>{Number(dashboard.total_revenue).toLocaleString()} <span style={{ fontSize: 14 }}>ريال</span></p>
          </div>
          <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 14, padding: 20 }}>
            <p style={{ color: '#9CA3AF', fontSize: 13, margin: '0 0 6px' }}>إيرادات الشهر</p>
            <p style={{ color: '#3B82F6', fontSize: 28, fontWeight: 700, margin: 0 }}>{Number(dashboard.monthly_revenue).toLocaleString()} <span style={{ fontSize: 14 }}>ريال</span></p>
          </div>
          {(dashboard.subscriptions_by_package || []).map((s: any) => (
            <div key={s.package} style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 14, padding: 20 }}>
              <p style={{ color: '#9CA3AF', fontSize: 13, margin: '0 0 6px' }}>{pkgConfig[s.package]?.name || s.package}</p>
              <p style={{ color: '#C9A227', fontSize: 28, fontWeight: 700, margin: 0 }}>{s.count} <span style={{ fontSize: 14 }}>مشترك</span></p>
            </div>
          ))}
        </div>
      )}

      {/* الباقة الحالية */}
      <div style={{ padding: 16, background: `${pkgConfig[currentPkg]?.color}15`, border: `1px solid ${pkgConfig[currentPkg]?.color}30`, borderRadius: 12, marginBottom: 24 }}>
        <span style={{ color: pkgConfig[currentPkg]?.color, fontSize: 15, fontWeight: 700 }}>
          {pkgConfig[currentPkg]?.icon} باقتك الحالية: {pkgConfig[currentPkg]?.name}
          {currentPkg !== 'basic' && subscription?.expires_at && ` — تنتهي ${new Date(subscription.expires_at).toLocaleDateString('ar-SA')}`}
        </span>
      </div>

      {/* الباقات */}
      <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>[Package] الباقات المتاحة</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 30 }}>
        {Object.entries(pkgConfig).map(([key, pkg]: any) => {
          const isCurrent = key === currentPkg;
          return (
            <div key={key} style={{ background: isCurrent ? `${pkg.color}10` : 'rgba(255,255,255,0.03)', border: `2px solid ${isCurrent ? pkg.color : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: 24, position: 'relative' as const }}>
              {isCurrent && <div style={{ position: 'absolute' as const, top: -12, right: 20, padding: '4px 14px', background: pkg.color, color: '#fff', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>الحالية</div>}
              <div style={{ fontSize: 32, marginBottom: 8 }}>{pkg.icon}</div>
              <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>{pkg.name}</h3>
              <p style={{ color: pkg.color, fontSize: 28, fontWeight: 700, margin: '0 0 16px' }}>
                {pkg.price === 0 ? 'مجاناً' : `${pkg.price} ريال`}
                {pkg.price > 0 && <span style={{ fontSize: 13, color: '#9CA3AF' }}> /شهر</span>}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {pkg.features.map((f: string, i: number) => (
                  <span key={i} style={{ color: '#D4D4D8', fontSize: 13 }}>[Check] {f}</span>
                ))}
              </div>
              {!isCurrent && key !== 'basic' && (
                <button onClick={() => handleUpgrade(key)} disabled={upgrading === key} style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${pkg.color}, ${pkg.color}CC)`, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: upgrading === key ? 0.5 : 1, ...inputStyle }}>
                  {upgrading === key ? 'جاري...' : `ترقية لـ ${pkg.name}`}
                </button>
              )}
              {isCurrent && key !== 'basic' && (
                <div style={{ padding: 10, textAlign: 'center', color: '#6B7280', fontSize: 13 }}>باقتك الحالية Check</div>
              )}
            </div>
          );
        })}
      </div>

      {/* سجل المدفوعات */}
      <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>[Receipt] سجل المدفوعات</h2>
      {payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: '#6B7280', fontSize: 14 }}>لا توجد مدفوعات بعد</p>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          {payments.map((p: any, i: number) => {
            const statusColors: any = { paid: '#10B981', pending: '#F59E0B', failed: '#EF4444' };
            const statusLabels: any = { paid: 'مدفوعة', pending: 'بانتظار', failed: 'فشلت' };
            return (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < payments.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div>
                  <span style={{ color: '#fff', fontSize: 14 }}>{p.description || 'دفعة'}</span>
                  <span style={{ color: '#6B7280', fontSize: 12, marginRight: 12 }}>{p.created_at ? new Date(p.created_at).toLocaleDateString('ar-SA') : ''}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#C9A227', fontSize: 15, fontWeight: 700 }}>{p.amount} ريال</span>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: `${statusColors[p.status] || '#6B7280'}15`, color: statusColors[p.status] || '#6B7280' }}>{statusLabels[p.status] || p.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0F0F1A', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440, direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, margin: 0 }}>CreditCard إضافة دفعة</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>المبلغ *</label>
              <input type="number" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="0.00" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>طريقة الدفع</label>
              <select value={paymentForm.method} onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13 }}>
                <option value="card">بطاقة ائتمان</option>
                <option value="bank">تحويل بنكي</option>
                <option value="cash">نقدي</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>الوصف</label>
              <input type="text" value={paymentForm.description} onChange={e => setPaymentForm({ ...paymentForm, description: e.target.value })} placeholder="وصف الدفعة..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleAddPayment} disabled={saving} style={{ flex: 1, background: saving ? 'rgba(201,162,39,0.5)' : 'linear-gradient(135deg,#C9A227,#E8C547)', border: 'none', borderRadius: 10, padding: '12px 0', color: '#06060E', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14 }}>{saving ? 'جاري الحفظ...' : 'تسجيل الدفعة'}</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
