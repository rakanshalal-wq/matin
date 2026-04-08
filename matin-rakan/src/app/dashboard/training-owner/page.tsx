'use client';
import { useState } from 'react';

const ACCENT = '#E65100';
const BG = '#06060E';
const SIDEBAR_BG = '#08081A';
const GOLD = '#D4A843';
const BD = 'rgba(255,255,255,0.07)';
const CARD = 'rgba(255,255,255,0.03)';
const TEXT = '#EEEEF5';
const DIM = 'rgba(238,238,245,0.6)';
const MUT = 'rgba(238,238,245,0.3)';

const revenueData = [180, 220, 195, 285, 260, 310];
const revMonths = ['نوف', 'ديس', 'يناير', 'فبراير', 'مارس', 'أبريل'];
const MAX_REV = 310;

export default function TrainingOwnerDashboard() {
  const [activeMenu, setActiveMenu] = useState('لوحة التحكم');
  const [showModal, setShowModal] = useState(false);

  const sidebarGroups = [
    {
      label: 'الرئيسية',
      items: [
        { label: 'لوحة التحكم', icon: '🏠', badge: null },
        { label: 'التقارير', icon: '📊', badge: null },
      ],
    },
    {
      label: 'التدريب',
      items: [
        { label: 'البرامج', icon: '📚', badge: 24 },
        { label: 'الجدول', icon: '📅', badge: null },
        { label: 'الشهادات', icon: '🎓', badge: null },
        { label: 'التقييمات', icon: '⭐', badge: null },
      ],
    },
    {
      label: 'الكوادر',
      items: [
        { label: 'المدربون', icon: '👨‍🏫', badge: 18 },
        { label: 'المتدربون', icon: '👥', badge: 340 },
        { label: 'الموظفون', icon: '🏢', badge: null },
      ],
    },
    {
      label: 'المالية',
      items: [
        { label: 'الإيرادات', icon: '💰', badge: 3 },
        { label: 'الفواتير', icon: '🧾', badge: null },
        { label: 'المدفوعات', icon: '💳', badge: null },
      ],
    },
    {
      label: 'المرافق',
      items: [
        { label: 'القاعات', icon: '🏛️', badge: null },
        { label: 'المختبرات', icon: '🔬', badge: null },
      ],
    },
    {
      label: 'التواصل',
      items: [
        { label: 'الإعلانات', icon: '📣', badge: 2 },
        { label: 'الرسائل', icon: '💬', badge: null },
        { label: 'الإعدادات', icon: '⚙️', badge: null },
      ],
    },
  ];

  const stats = [
    { label: 'برنامج تدريبي', value: '24', icon: '📚', color: ACCENT, sub: '+3 هذا الشهر' },
    { label: 'متدرب مسجل', value: '340', icon: '👥', color: '#3B82F6', sub: '+28 هذا الشهر' },
    { label: 'إيرادات (ر.س)', value: '285K', icon: '💰', color: GOLD, sub: '+18% عن الشهر الماضي' },
    { label: 'شهادة صادرة', value: '56', icon: '🎓', color: '#10B981', sub: 'هذا الشهر' },
  ];

  const activities = [
    { text: 'تسجيل متدرب جديد: أحمد العمري في دورة تطوير الويب', time: 'منذ 15 دقيقة', color: ACCENT },
    { text: 'انتهت الدفعة الأولى لبرنامج PMP · 45 متدرباً أتموا البرنامج', time: 'منذ ساعة', color: '#10B981' },
    { text: 'مدرب جديد: م. نورة الشمري · مسار الذكاء الاصطناعي', time: 'منذ 3 ساعات', color: '#8B5CF6' },
    { text: 'تحديث جدول قاعة B3 · تعارض في المواعيد تم حله', time: 'أمس 4:30م', color: '#F59E0B' },
    { text: 'صدور 8 شهادات جديدة · برنامج الأمن السيبراني', time: 'أمس 2:00م', color: GOLD },
  ];

  const programs = [
    { name: 'تطوير ويب متكامل', trainer: 'خالد الحربي', enrolled: 42, capacity: 45, sessions: 36, status: 'نشط' },
    { name: 'إدارة المشاريع PMP', trainer: 'عبدالرحمن السالم', enrolled: 38, capacity: 40, sessions: 24, status: 'نشط' },
    { name: 'الذكاء الاصطناعي', trainer: 'نورة الشمري', enrolled: 30, capacity: 35, sessions: 18, status: 'نشط' },
    { name: 'الأمن السيبراني', trainer: 'فيصل العتيبي', enrolled: 25, capacity: 30, sessions: 20, status: 'نشط' },
    { name: 'القيادة وإدارة الفرق', trainer: 'محمد الحربي', enrolled: 18, capacity: 20, sessions: 12, status: 'ينتهي قريباً' },
  ];

  const trainerPerf = [
    { name: 'خالد الحربي', courses: 3, trainees: 110, rating: 4.9, completion: 96, status: 'ممتاز' },
    { name: 'عبدالرحمن السالم', courses: 2, trainees: 78, rating: 4.8, completion: 94, status: 'ممتاز' },
    { name: 'نورة الشمري', courses: 2, trainees: 65, rating: 4.9, completion: 98, status: 'ممتاز' },
    { name: 'فيصل العتيبي', courses: 2, trainees: 55, rating: 4.7, completion: 91, status: 'جيد جداً' },
    { name: 'محمد الحربي', courses: 1, trainees: 32, rating: 4.5, completion: 88, status: 'جيد' },
  ];

  const halls = [
    { name: 'قاعة A1 – الرئيسية', capacity: 50, current: 'تطوير ويب', status: 'مشغولة', color: ACCENT },
    { name: 'قاعة B2 – متعددة الأغراض', capacity: 35, current: 'PMP', status: 'مشغولة', color: ACCENT },
    { name: 'مختبر C1 – الحاسب', capacity: 25, current: '—', status: 'متاحة', color: '#10B981' },
    { name: 'قاعة D3 – المحاضرات', capacity: 60, current: 'أمن سيبراني', status: 'مشغولة', color: ACCENT },
    { name: 'قاعة E2 – صغيرة', capacity: 20, current: '—', status: 'صيانة', color: '#F59E0B' },
  ];

  return (
    <div style={{ display: 'flex', fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: BG, color: TEXT, minHeight: '100vh', direction: 'rtl' }}>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${ACCENT}30;border-radius:4px}` }} />

      {/* ===== SIDEBAR ===== */}
      <aside style={{ width: 230, background: SIDEBAR_BG, borderLeft: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '20px 18px', borderBottom: `1px solid ${BD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${ACCENT},#BF360C)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff' }}>م</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: TEXT }}>مركز الإبداع</div>
              <div style={{ fontSize: 10, color: MUT }}>للتدريب المهني</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {sidebarGroups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 9, color: MUT, fontWeight: 700, padding: '8px 18px 4px', letterSpacing: 1.5, textTransform: 'uppercase' }}>{group.label}</div>
              {group.items.map((item, ii) => {
                const active = activeMenu === item.label;
                return (
                  <button key={ii} onClick={() => setActiveMenu(item.label)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px', background: active ? `${ACCENT}18` : 'transparent', border: 'none', borderRight: active ? `3px solid ${ACCENT}` : '3px solid transparent', color: active ? ACCENT : DIM, fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s', textAlign: 'right' }}>
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && <span style={{ background: ACCENT, color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 10, padding: '1px 7px', minWidth: 20, textAlign: 'center' }}>{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '14px 18px', borderTop: `1px solid ${BD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${ACCENT}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: ACCENT }}>س</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>أ. سلطان الدوسري</div>
              <div style={{ fontSize: 10, color: MUT }}>مدير مركز التدريب</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: TEXT }}>لوحة التحكم</h1>
            <div style={{ fontSize: 12, color: MUT, marginTop: 3 }}>مركز الإبداع للتدريب · أبريل 2026</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 9, padding: '8px 16px', color: DIM, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>📊 تصدير التقرير</button>
            <button onClick={() => setShowModal(true)} style={{ background: `linear-gradient(135deg,${ACCENT},#BF360C)`, border: 'none', borderRadius: 9, padding: '9px 18px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ برنامج جديد</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: CARD, border: `1px solid ${s.color}25`, borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.borderColor = s.color + '50'; el.style.boxShadow = `0 8px 28px ${s.color}15`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = s.color + '25'; el.style.boxShadow = 'none'; }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, background: `${s.color}06`, borderRadius: '0 0 80px 0' }} />
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: s.color, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: DIM, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Revenue Chart + Activities */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 22 }}>
          {/* Chart */}
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>الإيرادات الشهرية</div>
              <div style={{ fontSize: 11, color: GOLD, background: `${GOLD}15`, padding: '4px 12px', borderRadius: 6, fontWeight: 700 }}>آخر 6 أشهر</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
              {revenueData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 10, color: MUT, fontWeight: 700 }}>{v}K</div>
                  <div style={{ width: '100%', borderRadius: 6, background: i === 5 ? `linear-gradient(180deg,${ACCENT},#BF360C)` : `${ACCENT}30`, height: `${(v / MAX_REV) * 100}px`, transition: 'all .3s', cursor: 'pointer' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }} />
                  <div style={{ fontSize: 10, color: MUT }}>{revMonths[i]}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${BD}` }}>
              {[['إجمالي الإيرادات', '285,000 ر.س', GOLD], ['المصروفات', '142,000 ر.س', '#EF4444'], ['صافي الربح', '143,000 ر.س', '#10B981']].map(([l, v, c], i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: c }}>{v}</div>
                  <div style={{ fontSize: 10, color: MUT, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>النشاطات الأخيرة</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {activities.map((act, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: act.color, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: DIM, lineHeight: 1.5 }}>{act.text}</div>
                    <div style={{ fontSize: 10, color: MUT, marginTop: 3 }}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Programs Table */}
        <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 22, marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>البرامج التدريبية النشطة</div>
            <button style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}30`, borderRadius: 8, padding: '6px 14px', color: ACCENT, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>عرض الكل</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BD}` }}>
                  {['البرنامج', 'المدرب', 'المسجلون', 'الطاقة الاستيعابية', 'الجلسات', 'الحالة'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', fontSize: 11, color: MUT, fontWeight: 700, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {programs.map((p, i) => {
                  const pct = Math.round((p.enrolled / p.capacity) * 100);
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                      <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: DIM }}>{p.trainer}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: pct > 90 ? '#EF4444' : ACCENT, borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: pct > 90 ? '#EF4444' : TEXT, minWidth: 28 }}>{p.enrolled}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: DIM }}>{p.capacity}</td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: DIM }}>{p.sessions}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: p.status === 'نشط' ? '#10B981' : '#F59E0B', background: p.status === 'نشط' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', padding: '4px 10px', borderRadius: 6 }}>{p.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trainer Perf + Halls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20, marginBottom: 22 }}>
          {/* Trainer Performance */}
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>أداء المدربين</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BD}` }}>
                  {['المدرب', 'المتدربون', 'التقييم', 'الإنجاز', 'المستوى'].map((h, i) => (
                    <th key={i} style={{ padding: '8px 10px', fontSize: 10, color: MUT, fontWeight: 700, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainerPerf.map((t, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    <td style={{ padding: '11px 10px', fontSize: 12, fontWeight: 700 }}>{t.name}</td>
                    <td style={{ padding: '11px 10px', fontSize: 12, color: DIM }}>{t.trainees}</td>
                    <td style={{ padding: '11px 10px', fontSize: 12, color: GOLD, fontWeight: 700 }}>⭐ {t.rating}</td>
                    <td style={{ padding: '11px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                          <div style={{ width: `${t.completion}%`, height: '100%', background: t.completion >= 95 ? '#10B981' : ACCENT, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 10, color: DIM, minWidth: 32 }}>{t.completion}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 10px' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: t.status === 'ممتاز' ? '#10B981' : t.status === 'جيد جداً' ? GOLD : DIM, background: t.status === 'ممتاز' ? 'rgba(16,185,129,0.12)' : 'rgba(212,168,67,0.12)', padding: '3px 8px', borderRadius: 5 }}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Halls */}
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>حالة القاعات والمرافق</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {halls.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', background: 'rgba(255,255,255,0.025)', border: `1px solid ${BD}`, borderRadius: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{h.name}</div>
                    <div style={{ fontSize: 10, color: MUT, marginTop: 2 }}>الطاقة: {h.capacity} · {h.current !== '—' ? `البرنامج: ${h.current}` : 'فارغة'}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: h.color, background: `${h.color}15`, border: `1px solid ${h.color}25`, padding: '4px 10px', borderRadius: 6 }}>{h.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div style={{ background: CARD, border: `1px solid ${GOLD}20`, borderRadius: 16, padding: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>الملخص المالي · أبريل 2026</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { label: 'إجمالي الإيرادات', value: '285,000', unit: 'ر.س', color: GOLD, icon: '📈', pct: '+18%' },
              { label: 'إجمالي المصروفات', value: '142,000', unit: 'ر.س', color: '#EF4444', icon: '📉', pct: '+5%' },
              { label: 'صافي الربح', value: '143,000', unit: 'ر.س', color: '#10B981', icon: '💹', pct: '+32%' },
            ].map((f, i) => (
              <div key={i} style={{ background: `${f.color}08`, border: `1px solid ${f.color}20`, borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontSize: 22 }}>{f.icon}</div>
                  <div style={{ fontSize: 11, color: f.color, background: `${f.color}18`, padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>{f.pct}</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: f.color }}>{f.value}</div>
                <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>{f.unit} · {f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#0D0D1A', border: `1px solid ${BD}`, borderRadius: 20, padding: 32, width: '100%', maxWidth: 440, direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>إضافة برنامج جديد</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: MUT, fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            {[['اسم البرنامج', 'text', 'مثال: تطوير ويب متكامل'], ['المدرب المسؤول', 'text', 'اختر المدرب'], ['السعر (ر.س)', 'number', '2500'], ['المدة', 'text', 'مثال: 3 أشهر']].map(([label, type, ph], i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: DIM, fontWeight: 600, display: 'block', marginBottom: 5 }}>{label}</label>
                <input type={type} placeholder={ph} style={{ width: '100%', background: CARD, border: `1px solid ${BD}`, borderRadius: 9, padding: '10px 14px', color: TEXT, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, background: `linear-gradient(135deg,${ACCENT},#BF360C)`, border: 'none', borderRadius: 10, padding: '12px 0', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>إضافة البرنامج</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '12px 16px', background: CARD, border: `1px solid ${BD}`, borderRadius: 10, color: MUT, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
