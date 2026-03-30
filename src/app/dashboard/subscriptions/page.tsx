'use client';
export const dynamic = 'force-dynamic';
import { Diamond, Package, ClipboardList, Check, School, User, GraduationCap, Trophy } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, FilterTabs, Modal, EmptyState, LoadingState, Badge } from '../_components';

const plans = [
  { id: 'basic', name: 'أساسي', price: 0, period: 'مجاني', color: '#6B7280', students: 50, teachers: 5, schools: 1, features: ['مدرسة واحدة', '5 معلمين', '50 طالب', 'الحضور والغياب', 'الدرجات الأساسية'] },
  { id: 'advanced', name: 'متقدم', price: 299, period: 'شهرياً', color: '#3B82F6', students: 500, teachers: 20, schools: 5, features: ['5 مدارس', '20 معلم', '500 طالب', 'بنك أسئلة AI', 'مراقبة اختبارات', 'التقارير المتقدمة', 'الدعم الفني'] },
  { id: 'enterprise', name: 'مؤسسي', price: 599, period: 'شهرياً', color: '#D4A843', students: -1, teachers: -1, schools: -1, features: ['مدارس غير محدودة', 'معلمين غير محدود', 'طلاب غير محدود', 'كل الميزات', 'دعم 24/7', 'مدير حساب خاص', 'API مخصص'] },
];

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('plans');
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [mySubscription, setMySubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setUser(u);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, mySubRes] = await Promise.all([
        fetch('/api/finance?type=my_payments', { headers: getHeaders() }),
        fetch('/api/finance?type=my_subscription', { headers: getHeaders() }),
      ]);
      const [subData, mySubData] = await Promise.all([subRes.json(), mySubRes.json()]);
      setSubscriptions(Array.isArray(subData) ? subData : []);
      setMySubscription(mySubData);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) return;
    setUpgrading(planId); setMsg('');
    try {
      const res = await fetch('/api/finance', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'upgrade', package: planId }) });
      const data = await res.json();
      if (res.ok) { setMsg('تم الترقية بنجاح'); setMsgType('success'); fetchData(); }
      else { setMsg(data.error || 'فشل الترقية'); setMsgType('error'); }
    } catch { setMsg('خطأ في الاتصال'); setMsgType('error'); }
    finally { setUpgrading(''); setTimeout(() => setMsg(''), 4000); }
  };

  const currentPlan = mySubscription?.package || user?.package || 'basic';
  const currentPlanData = plans.find(p => p.id === currentPlan);

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="الباقات والاشتراكات"
        subtitle={<>باقتك الحالية: <span style={{ color: currentPlanData?.color || 'var(--gold)', fontWeight: 700 }}>{currentPlanData?.name || 'أساسي'}</span></>}
        icon={<Diamond size={20} color="#D4A843" />}
      />

      {msg && (
        <div className={msgType === 'success' ? 'alert-bar' : 'error-box'} style={{ marginBottom: 20 }}>
          {msgType === 'success' ? <Check size={15} color="#10B981" /> : null}
          <span>{msg}</span>
        </div>
      )}

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard value={subscriptions.length} label="إجمالي المدفوعات" icon={<ClipboardList size={17} color="#D4A843" />} color="#D4A843" />
        <StatCard value={subscriptions.filter(s => s.status === 'paid').length} label="مدفوعة" icon={<Check size={17} color="#10B981" />} color="#10B981" />
        <StatCard value={`${subscriptions.reduce((a, s) => a + (Number(s.amount) || 0), 0)} ر.س`} label="إجمالي المبلغ" icon={<Diamond size={17} color="#3B82F6" />} color="#3B82F6" />
        <StatCard value={currentPlanData?.name || 'أساسي'} label="الباقة الحالية" icon={<Trophy size={17} color={currentPlanData?.color || '#D4A843'} />} color={currentPlanData?.color || '#D4A843'} />
      </div>

      <FilterTabs
        tabs={[
          { key: 'plans', label: 'الباقات المتاحة' },
          { key: 'history', label: 'سجل المدفوعات', count: subscriptions.length },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'plans' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 20 }}>
          {plans.map(plan => {
            const isCurrent = plan.id === currentPlan;
            return (
              <div key={plan.id} className="dcard" style={{ marginBottom: 0, borderColor: isCurrent ? plan.color : undefined, borderWidth: isCurrent ? 2 : 1 }}>
                <div style={{ padding: 24, position: 'relative' }}>
                  {isCurrent && (
                    <div style={{ position: 'absolute', top: -12, right: 20 }}>
                      <Badge variant={plan.id === 'enterprise' ? 'gold' : plan.id === 'advanced' ? 'blue' : 'green'}>باقتك الحالية</Badge>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div className="stat-icon" style={{ background: `${plan.color}1a`, border: `1px solid ${plan.color}33` }}>
                      {plan.id === 'enterprise' ? <Trophy size={17} color={plan.color} /> : plan.id === 'advanced' ? <Diamond size={17} color={plan.color} /> : <Package size={17} color={plan.color} />}
                    </div>
                    <div>
                      <h3 style={{ color: plan.color, fontSize: 20, fontWeight: 800, margin: 0 }}>{plan.name}</h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{plan.period}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <span style={{ color: 'var(--text)', fontSize: 36, fontWeight: 800 }}>{plan.price === 0 ? 'مجاني' : plan.price}</span>
                    {plan.price > 0 && <span style={{ color: 'var(--text-muted)', fontSize: 14 }}> ر.س/شهر</span>}
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                    <span className="badge bgo" style={{ fontSize: 11 }}>
                      <School size={12} /> {plan.schools === -1 ? 'غير محدود' : plan.schools} مدرسة
                    </span>
                    <span className="badge bb" style={{ fontSize: 11 }}>
                      <User size={12} /> {plan.teachers === -1 ? 'غير محدود' : plan.teachers} معلم
                    </span>
                    <span className="badge bp" style={{ fontSize: 11 }}>
                      <GraduationCap size={12} /> {plan.students === -1 ? 'غير محدود' : plan.students} طالب
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ color: 'var(--text-dim)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Check size={14} color={plan.color} /> {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => !isCurrent && handleUpgrade(plan.id)}
                    disabled={isCurrent || upgrading === plan.id}
                    className={isCurrent ? 'btn-outline' : 'btn-gold'}
                    style={{
                      width: '100%', justifyContent: 'center',
                      background: isCurrent ? undefined : `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`,
                      opacity: upgrading === plan.id ? 0.7 : 1,
                      cursor: isCurrent ? 'default' : 'pointer',
                      color: isCurrent ? 'var(--text-muted)' : plan.id === 'basic' ? 'white' : '#06060E',
                    }}
                  >
                    {isCurrent ? 'باقتك الحالية' : upgrading === plan.id ? 'جاري الترقية...' : plan.price === 0 ? 'اختر هذه الباقة' : `ترقية إلى ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="dcard" style={{ marginTop: 20 }}>
          {subscriptions.length === 0 ? (
            <EmptyState icon={<ClipboardList size={19} color="#6B7280" />} message="لا توجد مدفوعات بعد" />
          ) : (
            <div className="table-wrap">
              <table className="dtable">
                <thead><tr>
                  <th>الباقة</th>
                  <th style={{ textAlign: 'center' }}>المبلغ</th>
                  <th style={{ textAlign: 'center' }}>الحالة</th>
                  <th style={{ textAlign: 'center' }}>التاريخ</th>
                </tr></thead>
                <tbody>
                  {subscriptions.map((s: any) => (
                    <tr key={s.id}>
                      <td>{s.package || s.description || 'اشتراك'}</td>
                      <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>{s.amount} ر.س</td>
                      <td style={{ textAlign: 'center' }}>
                        <Badge variant={s.status === 'paid' ? 'green' : 'gold'}>
                          {s.status === 'paid' ? 'مدفوع' : 'معلق'}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        {s.created_at ? new Date(s.created_at).toLocaleDateString('ar-SA') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
