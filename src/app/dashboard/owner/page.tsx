'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const GOLD = '#C9A84C';
const GOLD2 = '#E2C46A';
const BG = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';
const GREEN = '#10B981';
const RED = '#EF4444';
const BLUE = '#3B82F6';
const PURPLE = '#8B5CF6';

// ====== الأقسام الـ 14 لمالك المنصة وفق الدستور ======
const TABS = [
  { id: 'overview',       label: 'نظرة عامة',          icon: '🏛' },
  { id: 'finance',        label: 'المالية والإيرادات',  icon: '💰' },
  { id: 'institutions',   label: 'مراقبة المؤسسات',    icon: '🏫' },
  { id: 'taxes',          label: 'الضرائب السيادية',   icon: '⚖️' },
  { id: 'subscriptions',  label: 'الاشتراكات والباقات', icon: '📦' },
  { id: 'ads',            label: 'الإعلانات السيادية',  icon: '📣' },
  { id: 'coupons',        label: 'الكوبونات',           icon: '🎟' },
  { id: 'store',          label: 'المتجر والعمولات',    icon: '🛒' },
  { id: 'notifications',  label: 'الإشعارات الجماعية', icon: '🔔' },
  { id: 'ai_auditor',     label: 'AI Auditor',          icon: '🤖' },
  { id: 'audit_log',      label: 'سجل الأمان',         icon: '🔐' },
  { id: 'integrations',   label: 'التكاملات',           icon: '🔗' },
  { id: 'library',        label: 'المكتبة الرقمية',    icon: '📚' },
  { id: 'support',        label: 'الدعم الفني',         icon: '🎧' },
];

const StatCard = ({ title, value, sub, color, icon }: any) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
    border: `1px solid ${color}20`,
    borderRadius: 16,
    padding: '20px 22px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`, borderRadius: '0 16px 0 0' }} />
    <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
    <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{title}</div>
    <div style={{ color: color, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11, marginTop: 6 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ title, icon, desc }: any) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <h2 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 800, margin: 0 }}>{title}</h2>
    </div>
    {desc && <p style={{ color: 'rgba(238,238,245,0.45)', fontSize: 13, margin: 0, paddingRight: 32 }}>{desc}</p>}
  </div>
);

const Badge = ({ label, color }: any) => (
  <span style={{ background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
    {label}
  </span>
);

const ActionBtn = ({ label, color, onClick }: any) => (
  <button onClick={onClick} style={{
    background: `${color}15`, color, border: `1px solid ${color}30`,
    borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s',
  }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}25`; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}15`; }}
  >{label}</button>
);

// بيانات تجريبية للعرض
const MOCK_INSTITUTIONS = [
  { id: 1, name: 'مدرسة النور الأهلية', type: 'مدرسة', plan: 'احترافية', students: 487, limit: 500, status: 'active', paid: true, days_late: 0 },
  { id: 2, name: 'أكاديمية المستقبل', type: 'معهد', plan: 'أساسية', students: 198, limit: 200, status: 'active', paid: false, days_late: 12 },
  { id: 3, name: 'روضة الأمل', type: 'روضة', plan: 'أساسية', students: 45, limit: 200, status: 'active', paid: true, days_late: 0 },
  { id: 4, name: 'جامعة الإبداع', type: 'جامعة', plan: 'مؤسسية', students: 2340, limit: 5000, status: 'pending', paid: false, days_late: 3 },
  { id: 5, name: 'مركز التميز للتدريب', type: 'تدريب', plan: 'احترافية', students: 312, limit: 1000, status: 'frozen', paid: false, days_late: 45 },
];

const MOCK_AUDIT = [
  { id: 1, time: '2026-03-13 14:22', user: 'مالك المنصة', action: 'تجميد مؤسسة', target: 'مركز التميز', ip: '192.168.1.1', severity: 'high' },
  { id: 2, time: '2026-03-13 13:15', user: 'admin@matin.ink', action: 'تعديل باقة', target: 'الباقة الاحترافية', ip: '192.168.1.2', severity: 'medium' },
  { id: 3, time: '2026-03-13 11:40', user: 'مالك المنصة', action: 'إنشاء كوبون', target: 'MATIN20', ip: '192.168.1.1', severity: 'low' },
  { id: 4, time: '2026-03-13 10:05', user: 'مالك المنصة', action: 'قبول مؤسسة', target: 'روضة الأمل', ip: '192.168.1.1', severity: 'low' },
  { id: 5, time: '2026-03-13 09:30', user: 'system', action: 'استقطاع ضريبة سيادية', target: 'مدرسة النور', ip: 'system', severity: 'info' },
];

const MOCK_AI_ALERTS = [
  { id: 1, institution: 'مدرسة النور الأهلية', type: 'تلاعب بالدرجات', desc: 'رُصد نمط غير طبيعي في رفع درجات الفصل الثالث — 15 طالب بزيادة مفاجئة', severity: 'high', time: '2026-03-13 08:00' },
  { id: 2, institution: 'أكاديمية المستقبل', type: 'غياب متكرر للأستاذ', desc: 'الأستاذ محمد العمري: 8 غيابات في 30 يوماً — تجاوز الحد المسموح', severity: 'medium', time: '2026-03-12 16:30' },
  { id: 3, institution: 'جامعة الإبداع', type: 'تسجيل مشبوه', desc: 'محاولات تسجيل دخول متعددة فاشلة من IP غير معروف', severity: 'high', time: '2026-03-12 14:00' },
];

const MOCK_COUPONS = [
  { id: 1, code: 'MATIN20', discount: '20%', type: 'نسبة', uses: 45, max: 100, expires: '2026-04-01', status: 'active' },
  { id: 2, code: 'SCHOOL50', discount: '50 ر.س', type: 'مبلغ', uses: 12, max: 50, expires: '2026-03-31', status: 'active' },
  { id: 3, code: 'SUMMER30', discount: '30%', type: 'نسبة', uses: 50, max: 50, expires: '2026-06-30', status: 'expired' },
];

const MOCK_SUPPORT = [
  { id: 1, institution: 'مدرسة النور', subject: 'مشكلة في رفع الدرجات', priority: 'high', status: 'open', created: '2026-03-13' },
  { id: 2, institution: 'أكاديمية المستقبل', subject: 'عدم ظهور الجدول الدراسي', priority: 'medium', status: 'in_progress', created: '2026-03-12' },
  { id: 3, institution: 'روضة الأمل', subject: 'استفسار عن الترقية للباقة الاحترافية', priority: 'low', status: 'resolved', created: '2026-03-11' },
];

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'نسبة', max: '', expires: '' });
  const [notifMsg, setNotifMsg] = useState('');
  const [notifTarget, setNotifTarget] = useState('all');
  const [adTitle, setAdTitle] = useState('');
  const [adBody, setAdBody] = useState('');
  const [taxRate, setTaxRate] = useState('2.5');
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planLimit, setPlanLimit] = useState('');

  const cellStyle: any = { padding: '12px 14px', borderBottom: `1px solid ${BORDER}`, color: 'rgba(238,238,245,0.75)', fontSize: 13 };
  const headStyle: any = { padding: '10px 14px', color: 'rgba(238,238,245,0.4)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1px solid ${BORDER}` };

  const inputStyle: any = {
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 8,
    padding: '10px 14px', color: '#EEEEF5', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif", direction: 'rtl' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${BORDER}`, padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: BG }}>م</div>
          <div>
            <div style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 800 }}>لوحة مالك المنصة</div>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 600 }}>السلطة السيادية المطلقة</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600 }}>● النظام يعمل 99.9%</div>
          <Link href="/dashboard" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(238,238,245,0.6)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '6px 14px', fontSize: 12, textDecoration: 'none' }}>الرئيسية</Link>
        </div>
      </div>

      {/* Sovereign Banner */}
      <div style={{ background: `linear-gradient(135deg, ${GOLD}10 0%, transparent 100%)`, borderBottom: `1px solid ${GOLD}15`, padding: '10px 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 14 }}>⚡</span>
        <span style={{ color: GOLD, fontSize: 12, fontWeight: 600 }}>إعلان سيادي: </span>
        <span style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12 }}>هذا الإعلان يظهر إجبارياً على جميع لوحات تحكم المؤسسات — يمكن تعديله من قسم الإعلانات السيادية</span>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: 'rgba(255,255,255,0.015)', borderLeft: `1px solid ${BORDER}`, padding: '20px 0', flexShrink: 0, position: 'sticky', top: 100, height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width: '100%', textAlign: 'right', padding: '11px 20px', background: activeTab === tab.id ? `${GOLD}12` : 'transparent',
              borderRight: activeTab === tab.id ? `3px solid ${GOLD}` : '3px solid transparent',
              border: 'none', borderLeft: 'none', color: activeTab === tab.id ? GOLD : 'rgba(238,238,245,0.55)',
              fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
            }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          {/* ===== نظرة عامة ===== */}
          {activeTab === 'overview' && (
            <div>
              <SectionTitle title="نظرة عامة — السلطة المطلقة" icon="🏛" desc="إحصائيات شاملة للمنصة بالكامل — تتحدث تلقائياً" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                <StatCard title="إجمالي المؤسسات" value="47" sub="5 معلقة للمراجعة" color={GOLD} icon="🏫" />
                <StatCard title="إجمالي المستخدمين" value="18,432" sub="↑ 234 هذا الشهر" color={BLUE} icon="👥" />
                <StatCard title="الإيرادات الشهرية" value="82,400 ر.س" sub="↑ 12% عن الشهر الماضي" color={GREEN} icon="💰" />
                <StatCard title="طلبات انتظار" value="5" sub="تحتاج مراجعة فورية" color="#F59E0B" icon="⏳" />
                <StatCard title="الضرائب السيادية" value="4,120 ر.س" sub="هذا الشهر" color={PURPLE} icon="⚖️" />
                <StatCard title="تنبيهات AI Auditor" value="3" sub="تحتاج تدخلاً" color={RED} icon="🤖" />
              </div>

              {/* طلبات الانضمام المعلقة */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <SectionTitle title="طلبات الانضمام المعلقة" icon="⏳" desc="مؤسسات تنتظر القبول أو الرفض من مالك المنصة" />
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={headStyle}>المؤسسة</th>
                        <th style={headStyle}>النوع</th>
                        <th style={headStyle}>الباقة المطلوبة</th>
                        <th style={headStyle}>تاريخ الطلب</th>
                        <th style={headStyle}>الإجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'جامعة الإبداع', type: 'جامعة', plan: 'مؤسسية', date: '2026-03-10' },
                        { name: 'مدرسة الرياض الدولية', type: 'مدرسة', plan: 'احترافية', date: '2026-03-11' },
                        { name: 'معهد البرمجة', type: 'معهد', plan: 'أساسية', date: '2026-03-12' },
                      ].map((r, i) => (
                        <tr key={i}>
                          <td style={cellStyle}>{r.name}</td>
                          <td style={cellStyle}>{r.type}</td>
                          <td style={cellStyle}><Badge label={r.plan} color={GOLD} /></td>
                          <td style={cellStyle}>{r.date}</td>
                          <td style={cellStyle}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <ActionBtn label="قبول" color={GREEN} onClick={() => alert(`تم قبول ${r.name}`)} />
                              <ActionBtn label="رفض" color={RED} onClick={() => alert(`تم رفض ${r.name}`)} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* تنبيهات تجاوز الحد */}
              <div style={{ background: CARD, border: `1px solid ${RED}20`, borderRadius: 16, padding: 24 }}>
                <SectionTitle title="تنبيهات تجاوز حد الباقة" icon="⚠️" desc="مؤسسات اقتربت من حد طلابها — إيقاف تلقائي عند التجاوز" />
                {MOCK_INSTITUTIONS.filter(i => i.students / i.limit > 0.9).map(inst => (
                  <div key={inst.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${BORDER}` }}>
                    <div>
                      <div style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 600 }}>{inst.name}</div>
                      <div style={{ color: 'rgba(238,238,245,0.45)', fontSize: 12 }}>{inst.students} / {inst.limit} طالب</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ width: 120, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${(inst.students / inst.limit) * 100}%`, height: '100%', background: inst.students / inst.limit > 0.95 ? RED : '#F59E0B', borderRadius: 3 }} />
                      </div>
                      <span style={{ color: inst.students / inst.limit > 0.95 ? RED : '#F59E0B', fontSize: 12, fontWeight: 700 }}>{Math.round((inst.students / inst.limit) * 100)}%</span>
                      <ActionBtn label="ترقية الباقة" color={GOLD} onClick={() => alert(`ترقية باقة ${inst.name}`)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== المالية والإيرادات ===== */}
          {activeTab === 'finance' && (
            <div>
              <SectionTitle title="المالية والإيرادات" icon="💰" desc="إجمالي الإيرادات الشهرية والسنوية مع تفصيل حسب كل باقة ومؤسسة" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <StatCard title="إيرادات هذا الشهر" value="82,400 ر.س" sub="↑ 12% عن الشهر الماضي" color={GREEN} icon="📈" />
                <StatCard title="إيرادات هذا العام" value="743,200 ر.س" sub="الهدف: 1,000,000 ر.س" color={GOLD} icon="🏆" />
                <StatCard title="المتأخرات" value="23,100 ر.س" sub="3 مؤسسات متأخرة" color={RED} icon="⚠️" />
                <StatCard title="عمولات المتاجر" value="8,340 ر.س" sub="هذا الشهر" color={PURPLE} icon="🛒" />
              </div>

              {/* إيرادات حسب الباقة */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>الإيرادات حسب الباقة</h3>
                {[
                  { plan: 'الباقة الأساسية', count: 18, revenue: '32,400 ر.س', color: BLUE },
                  { plan: 'الباقة الاحترافية', count: 22, revenue: '38,500 ر.س', color: GOLD },
                  { plan: 'الباقة المؤسسية', count: 5, revenue: '8,750 ر.س', color: PURPLE },
                  { plan: 'الباقة الذهبية', count: 2, revenue: '2,750 ر.س', color: '#F59E0B' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                      <span style={{ color: '#EEEEF5', fontSize: 14 }}>{r.plan}</span>
                      <Badge label={`${r.count} مؤسسة`} color={r.color} />
                    </div>
                    <span style={{ color: r.color, fontSize: 16, fontWeight: 700 }}>{r.revenue}</span>
                  </div>
                ))}
              </div>

              {/* المؤسسات المتأخرة */}
              <div style={{ background: CARD, border: `1px solid ${RED}20`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>المؤسسات المتأخرة عن الدفع</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={headStyle}>المؤسسة</th>
                        <th style={headStyle}>الباقة</th>
                        <th style={headStyle}>المبلغ المستحق</th>
                        <th style={headStyle}>أيام التأخير</th>
                        <th style={headStyle}>الإجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_INSTITUTIONS.filter(i => !i.paid).map(inst => (
                        <tr key={inst.id}>
                          <td style={cellStyle}>{inst.name}</td>
                          <td style={cellStyle}><Badge label={inst.plan} color={GOLD} /></td>
                          <td style={cellStyle}>{inst.plan === 'أساسية' ? '299' : inst.plan === 'احترافية' ? '699' : '2,500'} ر.س</td>
                          <td style={cellStyle}><span style={{ color: inst.days_late > 30 ? RED : '#F59E0B', fontWeight: 700 }}>{inst.days_late} يوم</span></td>
                          <td style={cellStyle}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <ActionBtn label="إرسال تذكير" color={GOLD} onClick={() => alert('تم إرسال التذكير')} />
                              {inst.days_late > 30 && <ActionBtn label="تجميد" color={RED} onClick={() => alert('تم تجميد المؤسسة')} />}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30`, borderRadius: 10, padding: '12px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  📊 تصدير تقرير Excel
                </button>
                <button style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30`, borderRadius: 10, padding: '12px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  📄 تصدير تقرير PDF
                </button>
              </div>
            </div>
          )}

          {/* ===== مراقبة المؤسسات ===== */}
          {activeTab === 'institutions' && (
            <div>
              <SectionTitle title="مراقبة المؤسسات" icon="🏫" desc="عدد الطلاب في كل مؤسسة يتحدث تلقائياً — قبول / رفض / تجميد أي مؤسسة" />
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={headStyle}>المؤسسة</th>
                      <th style={headStyle}>النوع</th>
                      <th style={headStyle}>الباقة</th>
                      <th style={headStyle}>الطلاب / الحد</th>
                      <th style={headStyle}>الدفع</th>
                      <th style={headStyle}>الحالة</th>
                      <th style={headStyle}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_INSTITUTIONS.map(inst => (
                      <tr key={inst.id}>
                        <td style={cellStyle}><span style={{ color: '#EEEEF5', fontWeight: 600 }}>{inst.name}</span></td>
                        <td style={cellStyle}>{inst.type}</td>
                        <td style={cellStyle}><Badge label={inst.plan} color={GOLD} /></td>
                        <td style={cellStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: inst.students / inst.limit > 0.9 ? RED : '#EEEEF5' }}>{inst.students}</span>
                            <span style={{ color: 'rgba(238,238,245,0.3)' }}>/ {inst.limit}</span>
                            <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: `${(inst.students / inst.limit) * 100}%`, height: '100%', background: inst.students / inst.limit > 0.9 ? RED : GREEN, borderRadius: 2 }} />
                            </div>
                          </div>
                        </td>
                        <td style={cellStyle}><Badge label={inst.paid ? 'مدفوع' : `متأخر ${inst.days_late}ي`} color={inst.paid ? GREEN : RED} /></td>
                        <td style={cellStyle}><Badge label={inst.status === 'active' ? 'نشط' : inst.status === 'pending' ? 'معلق' : 'مجمد'} color={inst.status === 'active' ? GREEN : inst.status === 'pending' ? '#F59E0B' : RED} /></td>
                        <td style={cellStyle}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {inst.status === 'pending' && <ActionBtn label="قبول" color={GREEN} onClick={() => alert(`قبول ${inst.name}`)} />}
                            {inst.status !== 'frozen' && <ActionBtn label="تجميد" color={RED} onClick={() => alert(`تجميد ${inst.name}`)} />}
                            {inst.status === 'frozen' && <ActionBtn label="إلغاء التجميد" color={BLUE} onClick={() => alert(`إلغاء تجميد ${inst.name}`)} />}
                            <ActionBtn label="عرض" color={GOLD} onClick={() => alert(`عرض ${inst.name}`)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== الضرائب السيادية ===== */}
          {activeTab === 'taxes' && (
            <div>
              <SectionTitle title="الضرائب السيادية" icon="⚖️" desc="استقطاع نسبة مئوية آلية من كل عملية مالية تمر عبر المنصة — رسوم دراسية + مبيعات المتجر + الإعلانات" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <StatCard title="الضريبة السيادية اليوم" value="412 ر.س" sub="من 38 عملية" color={GOLD} icon="⚡" />
                <StatCard title="الضريبة هذا الشهر" value="4,120 ر.س" sub="من 847 عملية" color={PURPLE} icon="📊" />
                <StatCard title="الضريبة هذا العام" value="38,450 ر.س" sub="↑ 18% عن العام الماضي" color={GREEN} icon="🏆" />
              </div>

              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>إعداد نسبة الاستقطاع</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  {[
                    { label: 'رسوم دراسية', rate: taxRate, key: 'tuition' },
                    { label: 'مبيعات المتجر', rate: '3.0', key: 'store' },
                    { label: 'إيرادات الإعلانات', rate: '5.0', key: 'ads' },
                    { label: 'عمولات الإحالة', rate: '1.5', key: 'referral' },
                  ].map((item, i) => (
                    <div key={i}>
                      <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{item.label}</label>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="number" defaultValue={item.rate} style={{ ...inputStyle, width: 80 }} />
                        <span style={{ color: 'rgba(238,238,245,0.4)', fontSize: 13 }}>%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  حفظ نسب الاستقطاع
                </button>
              </div>

              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>آخر عمليات الاستقطاع</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={headStyle}>المؤسسة</th>
                      <th style={headStyle}>نوع العملية</th>
                      <th style={headStyle}>المبلغ الأصلي</th>
                      <th style={headStyle}>الاستقطاع</th>
                      <th style={headStyle}>الوقت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { inst: 'مدرسة النور', type: 'رسوم دراسية', amount: '2,400 ر.س', tax: '60 ر.س', time: '14:22' },
                      { inst: 'أكاديمية المستقبل', type: 'مبيعات متجر', amount: '450 ر.س', tax: '13.5 ر.س', time: '13:15' },
                      { inst: 'جامعة الإبداع', type: 'رسوم دراسية', amount: '8,500 ر.س', tax: '212.5 ر.س', time: '11:40' },
                    ].map((r, i) => (
                      <tr key={i}>
                        <td style={cellStyle}>{r.inst}</td>
                        <td style={cellStyle}>{r.type}</td>
                        <td style={cellStyle}>{r.amount}</td>
                        <td style={{ ...cellStyle, color: GOLD, fontWeight: 700 }}>{r.tax}</td>
                        <td style={cellStyle}>{r.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== الاشتراكات والباقات ===== */}
          {activeTab === 'subscriptions' && (
            <div>
              <SectionTitle title="الاشتراكات والباقات" icon="📦" desc="إنشاء وتعديل الباقات والحدود والأسعار — مالك المنصة يمتلك حق إنشاء باقات مخصصة بأي سعر وأي صلاحيات" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 28 }}>
                {[
                  { name: 'مجانية', price: '0', limit: '50 طالب', features: 'حضور، درجات، رسائل، جداول', color: '#6B7280', count: 0 },
                  { name: 'أساسية', price: '299 ر.س/شهر', limit: '200 طالب', features: '+ اختبارات، تقارير، مكتبة', color: BLUE, count: 18 },
                  { name: 'احترافية', price: '699 ر.س/شهر', limit: '1000 طالب', features: '+ متجر، AI، تصدير، Matin Coin', color: GOLD, count: 22 },
                  { name: 'مؤسسية', price: 'تفاوض', limit: 'غير محدود', features: '+ نقل، مقصف، صحة، GPS، API', color: PURPLE, count: 5 },
                  { name: 'ذهبية', price: 'تفاوض', limit: 'غير محدود', features: 'كل المميزات + إخفاء إعلانات متين', color: '#F59E0B', count: 2 },
                ].map((plan, i) => (
                  <div key={i} style={{ background: `${plan.color}06`, border: `1px solid ${plan.color}20`, borderRadius: 16, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ color: plan.color, fontSize: 16, fontWeight: 800 }}>{plan.name}</div>
                        <div style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, marginTop: 4 }}>{plan.price}</div>
                      </div>
                      <Badge label={`${plan.count} مؤسسة`} color={plan.color} />
                    </div>
                    <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, marginBottom: 8 }}>الحد: {plan.limit}</div>
                    <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, marginBottom: 16 }}>{plan.features}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <ActionBtn label="تعديل" color={plan.color} onClick={() => alert(`تعديل باقة ${plan.name}`)} />
                      <ActionBtn label="حذف" color={RED} onClick={() => alert(`حذف باقة ${plan.name}`)} />
                    </div>
                  </div>
                ))}
              </div>

              {/* إنشاء باقة جديدة */}
              <div style={{ background: CARD, border: `1px solid ${GOLD}20`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: GOLD, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>إنشاء باقة مخصصة جديدة</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>اسم الباقة</label>
                    <input value={planName} onChange={e => setPlanName(e.target.value)} placeholder="مثال: ذهبية خاصة" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>السعر الشهري (ر.س)</label>
                    <input value={planPrice} onChange={e => setPlanPrice(e.target.value)} placeholder="مثال: 1500" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>حد الطلاب</label>
                    <input value={planLimit} onChange={e => setPlanLimit(e.target.value)} placeholder="مثال: 2000" style={inputStyle} />
                  </div>
                </div>
                <button onClick={() => { alert(`تم إنشاء باقة: ${planName}`); setPlanName(''); setPlanPrice(''); setPlanLimit(''); }} style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  ✨ إنشاء الباقة
                </button>
              </div>
            </div>
          )}

          {/* ===== الإعلانات السيادية ===== */}
          {activeTab === 'ads' && (
            <div>
              <SectionTitle title="الإعلانات السيادية" icon="📣" desc="إعلانات متين الرسمية تظهر إجبارياً في جميع لوحات التحكم — الباقات الذهبية تملك حق شراء إخفاء الإعلانات" />
              <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20`, borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>⚡</span>
                <div>
                  <div style={{ color: GOLD, fontSize: 13, fontWeight: 700 }}>الإعلان الحالي النشط</div>
                  <div style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, marginTop: 2 }}>هذا الإعلان يظهر إجبارياً على جميع لوحات تحكم المؤسسات</div>
                </div>
              </div>

              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>إنشاء إعلان سيادي جديد</h3>
                <div style={{ display: 'grid', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>عنوان الإعلان</label>
                    <input value={adTitle} onChange={e => setAdTitle(e.target.value)} placeholder="مثال: تحديث جديد في منصة متين" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>نص الإعلان</label>
                    <textarea value={adBody} onChange={e => setAdBody(e.target.value)} placeholder="نص الإعلان الذي سيظهر لجميع المؤسسات..." style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>تاريخ البدء</label>
                      <input type="date" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>تاريخ الانتهاء</label>
                      <input type="date" style={inputStyle} />
                    </div>
                  </div>
                </div>
                <button onClick={() => alert('تم نشر الإعلان السيادي')} style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  📣 نشر الإعلان السيادي
                </button>
              </div>

              {/* إدارة عقود الإعلانات */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>عقود إخفاء الإعلانات (الباقة الذهبية)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={headStyle}>المؤسسة</th>
                      <th style={headStyle}>تاريخ البدء</th>
                      <th style={headStyle}>تاريخ الانتهاء</th>
                      <th style={headStyle}>المبلغ</th>
                      <th style={headStyle}>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { inst: 'جامعة الإبداع', start: '2026-01-01', end: '2026-12-31', amount: '5,000 ر.س', status: 'active' },
                    ].map((r, i) => (
                      <tr key={i}>
                        <td style={cellStyle}>{r.inst}</td>
                        <td style={cellStyle}>{r.start}</td>
                        <td style={cellStyle}>{r.end}</td>
                        <td style={{ ...cellStyle, color: GOLD, fontWeight: 700 }}>{r.amount}</td>
                        <td style={cellStyle}><Badge label="نشط" color={GREEN} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== الكوبونات ===== */}
          {activeTab === 'coupons' && (
            <div>
              <SectionTitle title="الكوبونات" icon="🎟" desc="إنشاء كودات خصم للمؤسسات — تحديد الاستخدام والمدة والنوع" />
              <div style={{ background: CARD, border: `1px solid ${GOLD}20`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: GOLD, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>إنشاء كوبون جديد</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>كود الخصم</label>
                    <input value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })} placeholder="مثال: MATIN20" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>قيمة الخصم</label>
                    <input value={newCoupon.discount} onChange={e => setNewCoupon({ ...newCoupon, discount: e.target.value })} placeholder="20 أو 50" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>نوع الخصم</label>
                    <select value={newCoupon.type} onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value })} style={{ ...inputStyle }}>
                      <option>نسبة (%)</option>
                      <option>مبلغ (ر.س)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>الحد الأقصى للاستخدام</label>
                    <input value={newCoupon.max} onChange={e => setNewCoupon({ ...newCoupon, max: e.target.value })} placeholder="100" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>تاريخ الانتهاء</label>
                    <input type="date" value={newCoupon.expires} onChange={e => setNewCoupon({ ...newCoupon, expires: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <button onClick={() => { alert(`تم إنشاء الكوبون: ${newCoupon.code}`); setNewCoupon({ code: '', discount: '', type: 'نسبة', max: '', expires: '' }); }} style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  🎟 إنشاء الكوبون
                </button>
              </div>

              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>الكوبونات الحالية</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={headStyle}>الكود</th>
                      <th style={headStyle}>الخصم</th>
                      <th style={headStyle}>الاستخدام</th>
                      <th style={headStyle}>الانتهاء</th>
                      <th style={headStyle}>الحالة</th>
                      <th style={headStyle}>إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_COUPONS.map(c => (
                      <tr key={c.id}>
                        <td style={{ ...cellStyle, color: GOLD, fontWeight: 700, fontFamily: 'monospace' }}>{c.code}</td>
                        <td style={cellStyle}>{c.discount}</td>
                        <td style={cellStyle}>{c.uses} / {c.max}</td>
                        <td style={cellStyle}>{c.expires}</td>
                        <td style={cellStyle}><Badge label={c.status === 'active' ? 'نشط' : 'منتهي'} color={c.status === 'active' ? GREEN : RED} /></td>
                        <td style={cellStyle}><ActionBtn label="إلغاء" color={RED} onClick={() => alert(`إلغاء ${c.code}`)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== المتجر والعمولات ===== */}
          {activeTab === 'store' && (
            <div>
              <SectionTitle title="المتجر والعمولات" icon="🛒" desc="الإشراف على متاجر المؤسسات وعمولات المبيعات — كل شيء يمر عبر متين = عمولة تلقائية لمالك المنصة" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <StatCard title="متاجر نشطة" value="23" sub="من أصل 47 مؤسسة" color={GOLD} icon="🏪" />
                <StatCard title="عمولات هذا الشهر" value="8,340 ر.س" sub="متوسط 3% من المبيعات" color={GREEN} icon="💸" />
                <StatCard title="إجمالي المبيعات" value="278,000 ر.س" sub="عبر جميع المتاجر" color={BLUE} icon="📊" />
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>أعلى المتاجر مبيعاً</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={headStyle}>المؤسسة</th>
                      <th style={headStyle}>المبيعات</th>
                      <th style={headStyle}>العمولة (3%)</th>
                      <th style={headStyle}>المنتجات</th>
                      <th style={headStyle}>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { inst: 'مدرسة النور', sales: '45,200 ر.س', commission: '1,356 ر.س', products: 34, status: 'active' },
                      { inst: 'جامعة الإبداع', sales: '128,500 ر.س', commission: '3,855 ر.س', products: 87, status: 'active' },
                      { inst: 'أكاديمية المستقبل', sales: '23,400 ر.س', commission: '702 ر.س', products: 18, status: 'active' },
                    ].map((r, i) => (
                      <tr key={i}>
                        <td style={cellStyle}>{r.inst}</td>
                        <td style={cellStyle}>{r.sales}</td>
                        <td style={{ ...cellStyle, color: GOLD, fontWeight: 700 }}>{r.commission}</td>
                        <td style={cellStyle}>{r.products} منتج</td>
                        <td style={cellStyle}><Badge label="نشط" color={GREEN} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== الإشعارات الجماعية ===== */}
          {activeTab === 'notifications' && (
            <div>
              <SectionTitle title="الإشعارات الجماعية" icon="🔔" desc="إرسال إشعارات جماعية لجميع المستخدمين أو فئة محددة" />
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>إرسال إشعار جماعي</h3>
                <div style={{ display: 'grid', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>المستهدفون</label>
                    <select value={notifTarget} onChange={e => setNotifTarget(e.target.value)} style={inputStyle}>
                      <option value="all">جميع المستخدمين (18,432)</option>
                      <option value="owners">مالكو المؤسسات فقط (47)</option>
                      <option value="teachers">المعلمون فقط</option>
                      <option value="students">الطلاب فقط</option>
                      <option value="parents">أولياء الأمور فقط</option>
                      <option value="basic">مشتركو الباقة الأساسية</option>
                      <option value="pro">مشتركو الباقة الاحترافية</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>نص الإشعار</label>
                    <textarea value={notifMsg} onChange={e => setNotifMsg(e.target.value)} placeholder="اكتب نص الإشعار هنا..." style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => alert(`تم إرسال الإشعار لـ: ${notifTarget}`)} style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      🔔 إرسال الإشعار
                    </button>
                    <button style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30`, borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      📱 Push Notification
                    </button>
                    <button style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30`, borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      💬 واتساب
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== AI Auditor ===== */}
          {activeTab === 'ai_auditor' && (
            <div>
              <SectionTitle title="AI Auditor — المفتش الرقمي الآلي" icon="🤖" desc="ذكاء اصطناعي يراقب السجلات والدرجات والحضور عشوائياً — كشف أي تلاعب أو أنماط مشبوهة في أي مؤسسة" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <StatCard title="تنبيهات نشطة" value="3" sub="تحتاج تدخلاً فورياً" color={RED} icon="🚨" />
                <StatCard title="فحوصات هذا الأسبوع" value="1,247" sub="عشوائية تلقائية" color={BLUE} icon="🔍" />
                <StatCard title="حالات محلولة" value="28" sub="هذا الشهر" color={GREEN} icon="✅" />
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                {MOCK_AI_ALERTS.map(alert => (
                  <div key={alert.id} style={{ background: alert.severity === 'high' ? `${RED}06` : `${GOLD}06`, border: `1px solid ${alert.severity === 'high' ? RED : GOLD}20`, borderRadius: 16, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <Badge label={alert.severity === 'high' ? 'خطر عالي' : 'تحذير'} color={alert.severity === 'high' ? RED : '#F59E0B'} />
                          <span style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700 }}>{alert.type}</span>
                        </div>
                        <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, marginBottom: 4 }}>المؤسسة: {alert.institution}</div>
                        <div style={{ color: 'rgba(238,238,245,0.7)', fontSize: 13 }}>{alert.desc}</div>
                      </div>
                      <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11 }}>{alert.time}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <ActionBtn label="تحقيق فوري" color={RED} onClick={() => window.alert('بدء التحقيق')} />
                      <ActionBtn label="تجميد المؤسسة" color={GOLD} onClick={() => window.alert('تجميد المؤسسة')} />
                      <ActionBtn label="تجاهل" color="#6B7280" onClick={() => window.alert('تم التجاهل')} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== سجل الأمان ===== */}
          {activeTab === 'audit_log' && (
            <div>
              <SectionTitle title="سجل الأمان — Audit Log" icon="🔐" desc="غير قابل للحذف — كل حركة في النظام موثقة بالتفصيل" />
              <div style={{ background: `${RED}06`, border: `1px solid ${RED}15`, borderRadius: 12, padding: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>🔒</span>
                <span style={{ color: 'rgba(238,238,245,0.7)', fontSize: 13 }}>هذا السجل محمي ومشفر — لا يمكن لأي مستخدم حذف أو تعديل أي سجل حتى مالك المنصة</span>
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <input placeholder="بحث في السجل..." style={{ ...inputStyle, maxWidth: 300 }} />
                  <select style={{ ...inputStyle, maxWidth: 150 }}>
                    <option>جميع المستويات</option>
                    <option>خطر عالي</option>
                    <option>متوسط</option>
                    <option>منخفض</option>
                  </select>
                  <button style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30`, borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    📥 تصدير
                  </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={headStyle}>الوقت</th>
                      <th style={headStyle}>المستخدم</th>
                      <th style={headStyle}>الإجراء</th>
                      <th style={headStyle}>الهدف</th>
                      <th style={headStyle}>IP</th>
                      <th style={headStyle}>المستوى</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_AUDIT.map(log => (
                      <tr key={log.id}>
                        <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: 12 }}>{log.time}</td>
                        <td style={cellStyle}>{log.user}</td>
                        <td style={cellStyle}>{log.action}</td>
                        <td style={cellStyle}>{log.target}</td>
                        <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: 11 }}>{log.ip}</td>
                        <td style={cellStyle}>
                          <Badge
                            label={log.severity === 'high' ? 'عالي' : log.severity === 'medium' ? 'متوسط' : log.severity === 'low' ? 'منخفض' : 'معلومات'}
                            color={log.severity === 'high' ? RED : log.severity === 'medium' ? '#F59E0B' : log.severity === 'low' ? GREEN : BLUE}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== التكاملات ===== */}
          {activeTab === 'integrations' && (
            <div>
              <SectionTitle title="التكاملات" icon="🔗" desc="ربط APIs: دفع، شحن، رسائل، جهات حكومية — إدارة التكاملات مع الجهات الحكومية والشركات" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {[
                  { name: 'نفاذ', desc: 'التحقق من الهوية الوطنية', status: 'active', type: 'حكومي', color: GREEN },
                  { name: 'نور', desc: 'ربط بيانات وزارة التعليم', status: 'active', type: 'حكومي', color: GREEN },
                  { name: 'صحتي', desc: 'التحقق من الأعذار الطبية', status: 'active', type: 'حكومي', color: GREEN },
                  { name: 'Moyasar', desc: 'بوابة الدفع الإلكتروني', status: 'active', type: 'مالي', color: GOLD },
                  { name: 'Tabby', desc: 'التقسيط بدون فوائد', status: 'active', type: 'مالي', color: GOLD },
                  { name: 'STC Pay', desc: 'محفظة STC للدفع', status: 'active', type: 'مالي', color: GOLD },
                  { name: 'واتساب Business', desc: 'إشعارات واتساب', status: 'active', type: 'تواصل', color: BLUE },
                  { name: 'SMS Gateway', desc: 'رسائل SMS', status: 'active', type: 'تواصل', color: BLUE },
                  { name: 'Firebase', desc: 'Push Notifications', status: 'active', type: 'تقني', color: PURPLE },
                  { name: 'Google Maps', desc: 'تتبع GPS للنقل', status: 'active', type: 'تقني', color: PURPLE },
                ].map((integ, i) => (
                  <div key={i} style={{ background: `${integ.color}06`, border: `1px solid ${integ.color}20`, borderRadius: 14, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700 }}>{integ.name}</div>
                      <Badge label={integ.status === 'active' ? 'متصل' : 'غير متصل'} color={integ.status === 'active' ? GREEN : RED} />
                    </div>
                    <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, marginBottom: 8 }}>{integ.desc}</div>
                    <Badge label={integ.type} color={integ.color} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== المكتبة الرقمية ===== */}
          {activeTab === 'library' && (
            <div>
              <SectionTitle title="المكتبة الرقمية" icon="📚" desc="عقود مزودي المحتوى والشراكات — إدارة المحتوى الرقمي المتاح لجميع المؤسسات" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <StatCard title="الكتب الرقمية" value="12,450" sub="متاحة لجميع المؤسسات" color={GOLD} icon="📖" />
                <StatCard title="مزودو المحتوى" value="8" sub="شركاء نشر معتمدون" color={BLUE} icon="🤝" />
                <StatCard title="تحميلات هذا الشهر" value="34,200" sub="عبر جميع المؤسسات" color={GREEN} icon="⬇️" />
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>عقود مزودي المحتوى</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={headStyle}>المزود</th>
                      <th style={headStyle}>نوع المحتوى</th>
                      <th style={headStyle}>عدد الكتب</th>
                      <th style={headStyle}>انتهاء العقد</th>
                      <th style={headStyle}>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { provider: 'دار المعرفة', type: 'كتب مدرسية', books: 3400, expires: '2026-12-31', status: 'active' },
                      { provider: 'مكتبة الرياض', type: 'كتب عامة', books: 5200, expires: '2026-06-30', status: 'active' },
                      { provider: 'Springer', type: 'أبحاث علمية', books: 2800, expires: '2027-01-01', status: 'active' },
                      { provider: 'دار الفكر', type: 'كتب إسلامية', books: 1050, expires: '2026-09-30', status: 'active' },
                    ].map((r, i) => (
                      <tr key={i}>
                        <td style={cellStyle}>{r.provider}</td>
                        <td style={cellStyle}>{r.type}</td>
                        <td style={cellStyle}>{r.books.toLocaleString('ar-SA')} كتاب</td>
                        <td style={cellStyle}>{r.expires}</td>
                        <td style={cellStyle}><Badge label="نشط" color={GREEN} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== الدعم الفني ===== */}
          {activeTab === 'support' && (
            <div>
              <SectionTitle title="الدعم الفني" icon="🎧" desc="تذاكر الدعم من المؤسسات — تعيين الفريق ومتابعة الحل" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <StatCard title="تذاكر مفتوحة" value="2" sub="تحتاج رداً" color={RED} icon="🎫" />
                <StatCard title="قيد المعالجة" value="1" sub="يعمل عليها الفريق" color="#F59E0B" icon="⚙️" />
                <StatCard title="محلولة هذا الشهر" value="34" sub="متوسط وقت الحل: 4 ساعات" color={GREEN} icon="✅" />
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={headStyle}>#</th>
                      <th style={headStyle}>المؤسسة</th>
                      <th style={headStyle}>الموضوع</th>
                      <th style={headStyle}>الأولوية</th>
                      <th style={headStyle}>الحالة</th>
                      <th style={headStyle}>تاريخ الإنشاء</th>
                      <th style={headStyle}>إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_SUPPORT.map(ticket => (
                      <tr key={ticket.id}>
                        <td style={{ ...cellStyle, color: GOLD, fontWeight: 700 }}>#{ticket.id}</td>
                        <td style={cellStyle}>{ticket.institution}</td>
                        <td style={cellStyle}>{ticket.subject}</td>
                        <td style={cellStyle}>
                          <Badge
                            label={ticket.priority === 'high' ? 'عاجل' : ticket.priority === 'medium' ? 'متوسط' : 'منخفض'}
                            color={ticket.priority === 'high' ? RED : ticket.priority === 'medium' ? '#F59E0B' : GREEN}
                          />
                        </td>
                        <td style={cellStyle}>
                          <Badge
                            label={ticket.status === 'open' ? 'مفتوح' : ticket.status === 'in_progress' ? 'قيد المعالجة' : 'محلول'}
                            color={ticket.status === 'open' ? RED : ticket.status === 'in_progress' ? '#F59E0B' : GREEN}
                          />
                        </td>
                        <td style={cellStyle}>{ticket.created}</td>
                        <td style={cellStyle}>
                          <ActionBtn label="رد" color={GOLD} onClick={() => alert(`الرد على تذكرة #${ticket.id}`)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
