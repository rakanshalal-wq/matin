'use client';
export const dynamic = 'force-dynamic';
import { Coins, CreditCard, Package, Receipt, Trophy, Diamond, Check, Plus } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, Modal, EmptyState, LoadingState, Badge } from '../_components';

const pkgConfig: any = {
  basic: { name: 'أساسي', price: 0, color: '#6B7280', features: ['مدرسة واحدة', '5 معلمين', '50 طالب'] },
  advanced: { name: 'متقدم', price: 299, color: '#D4A843', features: ['5 مدارس', '20 معلم', '500 طالب', 'بنك أسئلة AI', 'مراقبة اختبارات'] },
  enterprise: { name: 'مؤسسي', price: 599, color: '#8B5CF6', features: ['مدارس غير محدودة', 'معلمين غير محدود', 'طلاب غير محدود', 'كل الميزات', 'دعم فني أولوية', 'تقارير متقدمة'] },
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
    if (!paymentForm.amount) return;
    setSaving(true);
    try {
      const res = await fetch('/api/finance', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ type: 'add_payment', ...paymentForm }) });
      if (res.ok) { setShowModal(false); setPaymentForm({ amount: '', method: 'card', description: '' }); fetchAll(user); }
    } catch {} finally { setSaving(false); }
  };

  const handleUpgrade = async (pkg: string) => {
    setErrMsg('');
    if (pkg === currentPkg) return;
    setUpgrading(pkg); setMsg('');
    try {
      const res = await fetch('/api/finance', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'upgrade', package: pkg }) });
      const data = await res.json();
      if (res.ok) setMsg(data.message || 'تم إنشاء الفاتورة');
      else setMsg(data.error || 'فشل');
    } catch { setMsg('خطأ'); } finally { setUpgrading(''); }
  };

  const currentPkg = subscription?.package || user?.package || 'basic';
  const statusColors: any = { paid: 'green', pending: 'gold', failed: 'red' };
  const statusLabels: any = { paid: 'مدفوعة', pending: 'بانتظار', failed: 'فشلت' };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="المالية والاشتراكات"
        subtitle={<>باقتك الحالية: <span style={{ color: pkgConfig[currentPkg]?.color, fontWeight: 700 }}>{pkgConfig[currentPkg]?.name}</span>{currentPkg !== 'basic' && subscription?.expires_at && ` — تنتهي ${new Date(subscription.expires_at).toLocaleDateString('ar-SA')}`}</>}
        icon={<Coins size={20} color="#D4A843" />}
        actions={<button className="btn-gold" onClick={() => setShowModal(true)}><Plus size={15} /> إضافة دفعة</button>}
      />

      {msg && (
        <div className={msg.includes('فاتورة') || msg.includes('تم') ? 'alert-bar' : 'error-box'} style={{ marginBottom: 20 }}>
          {msg}
        </div>
      )}

      {/* لوحة مالية للمالك */}
      {dashboard && (
        <div className="stat-grid">
          <StatCard value={`${Number(dashboard.total_revenue).toLocaleString()} ر.س`} label="إجمالي الإيرادات" icon={<Coins size={17} color="#10B981" />} color="#10B981" />
          <StatCard value={`${Number(dashboard.monthly_revenue).toLocaleString()} ر.س`} label="إيرادات الشهر" icon={<Receipt size={17} color="#3B82F6" />} color="#3B82F6" />
          {(dashboard.subscriptions_by_package || []).map((s: any) => (
            <StatCard key={s.package} value={s.count} label={`${pkgConfig[s.package]?.name || s.package} مشترك`} icon={<Package size={17} color="#D4A843" />} color={pkgConfig[s.package]?.color || '#D4A843'} />
          ))}
        </div>
      )}

      {/* الباقات */}
      <div style={{ marginBottom: 12 }}>
        <div className="section-label">الباقات المتاحة</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 30 }}>
        {Object.entries(pkgConfig).map(([key, pkg]: any) => {
          const isCurrent = key === currentPkg;
          return (
            <div key={key} className="dcard" style={{ marginBottom: 0, borderColor: isCurrent ? pkg.color : undefined, borderWidth: isCurrent ? 2 : 1 }}>
              <div style={{ padding: 24, position: 'relative' }}>
                {isCurrent && (
                  <div style={{ position: 'absolute', top: -12, right: 20 }}>
                    <Badge variant={key === 'enterprise' ? 'purple' : key === 'advanced' ? 'gold' : 'green'}>الحالية</Badge>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div className="stat-icon" style={{ background: `${pkg.color}1a`, border: `1px solid ${pkg.color}33` }}>
                    {key === 'enterprise' ? <Trophy size={17} color={pkg.color} /> : key === 'advanced' ? <Diamond size={17} color={pkg.color} /> : <Package size={17} color={pkg.color} />}
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700, margin: 0 }}>{pkg.name}</h3>
                  </div>
                </div>
                <p style={{ color: pkg.color, fontSize: 28, fontWeight: 800, margin: '0 0 16px' }}>
                  {pkg.price === 0 ? 'مجاناً' : `${pkg.price} ر.س`}
                  {pkg.price > 0 && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}> /شهر</span>}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                  {pkg.features.map((f: string, i: number) => (
                    <span key={i} style={{ color: 'var(--text-dim)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={14} color={pkg.color} /> {f}
                    </span>
                  ))}
                </div>
                {!isCurrent && key !== 'basic' ? (
                  <button className="btn-gold" onClick={() => handleUpgrade(key)} disabled={upgrading === key}
                    style={{ width: '100%', justifyContent: 'center', background: `linear-gradient(135deg, ${pkg.color}, ${pkg.color}dd)`, opacity: upgrading === key ? 0.7 : 1 }}>
                    {upgrading === key ? 'جاري...' : `ترقية لـ ${pkg.name}`}
                  </button>
                ) : isCurrent ? (
                  <div style={{ padding: 10, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>باقتك الحالية</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* سجل المدفوعات */}
      <div style={{ marginBottom: 12 }}>
        <div className="section-label">سجل المدفوعات</div>
      </div>
      <div className="dcard">
        {payments.length === 0 ? (
          <EmptyState icon={<Receipt size={19} color="#6B7280" />} message="لا توجد مدفوعات بعد" />
        ) : (
          <div className="table-wrap">
            <table className="dtable">
              <thead><tr>
                <th>الوصف</th>
                <th style={{ textAlign: 'center' }}>المبلغ</th>
                <th style={{ textAlign: 'center' }}>الحالة</th>
                <th style={{ textAlign: 'center' }}>التاريخ</th>
              </tr></thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id}>
                    <td>{p.description || 'دفعة'}</td>
                    <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>{p.amount} ر.س</td>
                    <td style={{ textAlign: 'center' }}>
                      <Badge variant={statusColors[p.status] || 'gold'}>{statusLabels[p.status] || p.status}</Badge>
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('ar-SA') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal إضافة دفعة */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="إضافة دفعة" titleIcon={<CreditCard size={18} color="#D4A843" />}>
        <div className="form-row">
          <div className="form-full">
            <label className="form-label">المبلغ *</label>
            <input className="input-field" type="number" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="0.00" />
          </div>
          <div>
            <label className="form-label">طريقة الدفع</label>
            <select className="select-field" value={paymentForm.method} onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })}>
              <option value="card">بطاقة ائتمان</option>
              <option value="bank">تحويل بنكي</option>
              <option value="cash">نقدي</option>
            </select>
          </div>
          <div>
            <label className="form-label">الوصف</label>
            <input className="input-field" value={paymentForm.description} onChange={e => setPaymentForm({ ...paymentForm, description: e.target.value })} placeholder="وصف الدفعة..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleAddPayment} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? 'جاري الحفظ...' : 'تسجيل الدفعة'}
          </button>
          <button className="btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
