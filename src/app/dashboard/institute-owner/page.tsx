'use client';
import { useState } from 'react';

const PRIMARY = '#0EA5E9';
const GOLD = '#D4A843';
const BG = '#06060E';
const SIDEBAR_BG = '#06101A';
const TEXT = '#EEEEF5';
const BORDER = 'rgba(14,165,233,0.12)';
const CARD = 'rgba(255,255,255,0.025)';
const GREEN = '#10B981';
const RED = '#EF4444';
const PURPLE = '#8B5CF6';

// ── Sidebar menu definition ──
const sidebarGroups = [
  {
    label: 'الرئيسية',
    items: [
      { id: 'home', label: 'لوحتي', icon: '🏠', badge: null },
      { id: 'ads', label: 'إعلانات المنصة', icon: '📢', badge: 2 },
    ],
  },
  {
    label: 'البرامج والدورات',
    items: [
      { id: 'add-program', label: 'إضافة برنامج جديد', icon: '➕', badge: null, gold: true },
      { id: 'all-programs', label: 'جميع البرامج', icon: '📚', badge: null },
      { id: 'schedule', label: 'الجدول والمواعيد', icon: '📅', badge: null },
      { id: 'halls', label: 'قاعات التدريب', icon: '🏛️', badge: null },
    ],
  },
  {
    label: 'المتدربون',
    items: [
      { id: 'trainees', label: 'المتدربون المسجلون', icon: '👥', badge: 284 },
      { id: 'attendance', label: 'الحضور والغياب', icon: '📋', badge: null },
      { id: 'assessments', label: 'الاختبارات والتقييم', icon: '📝', badge: 5 },
      { id: 'issue-cert', label: 'إصدار شهادة', icon: '🏅', badge: null, gold: true },
      { id: 'issued-certs', label: 'الشهادات الصادرة', icon: '📜', badge: null },
    ],
  },
  {
    label: 'المدربون',
    items: [
      { id: 'trainers', label: 'فريق المدربين', icon: '👨‍🏫', badge: null },
      { id: 'contact-requests', label: 'طلبات التواصل', icon: '💬', badge: 3 },
    ],
  },
  {
    label: 'المالية',
    items: [
      { id: 'revenue', label: 'الإيرادات والمدفوعات', icon: '💰', badge: null },
      { id: 'invoices', label: 'الفواتير الضريبية', icon: '🧾', badge: null },
      { id: 'coupons', label: 'كوبونات الخصم', icon: '🎟️', badge: null },
    ],
  },
  {
    label: 'الإعدادات',
    items: [
      { id: 'page-settings', label: 'إعدادات صفحة المعهد', icon: '⚙️', badge: null },
      { id: 'subscription', label: 'الباقة والاشتراك', icon: '💎', badge: null },
      { id: 'security', label: 'الأمن والصلاحيات', icon: '🔐', badge: null },
      { id: 'support', label: 'الدعم الفني', icon: '🎧', badge: null },
    ],
  },
];

const activePrograms = [
  { name: 'تطوير الويب الشامل', trainees: 28, capacity: 30, fill: 93, color: PRIMARY },
  { name: 'الذكاء الاصطناعي التطبيقي', trainees: 22, capacity: 25, fill: 88, color: GOLD },
  { name: 'إدارة المشاريع PMP', trainees: 18, capacity: 25, fill: 72, color: GREEN },
  { name: 'التحليل المالي المتقدم', trainees: 15, capacity: 20, fill: 75, color: '#8B5CF6' },
  { name: 'الأمن السيبراني', trainees: 12, capacity: 15, fill: 80, color: RED },
];

const trainerPerformance = [
  { name: 'سارة القحطاني', program: 'تطوير الويب', rating: 4.9, sessions: 24, completion: 96 },
  { name: 'خالد المطيري', program: 'الذكاء الاصطناعي', rating: 4.8, sessions: 18, completion: 92 },
  { name: 'نورة العمري', program: 'PMP', rating: 4.9, sessions: 20, completion: 98 },
];

const activeTrainees = [
  { name: 'محمد العتيبي', program: 'تطوير الويب', progress: 78, status: 'نشط', payment: 'مدفوع' },
  { name: 'فاطمة الحربي', program: 'الذكاء الاصطناعي', progress: 65, status: 'نشط', payment: 'قسط' },
  { name: 'عبدالله الشمري', program: 'PMP', progress: 90, status: 'نشط', payment: 'مدفوع' },
  { name: 'نورة الدوسري', program: 'التحليل المالي', progress: 45, status: 'متأخر', payment: 'قسط' },
  { name: 'سعد المالكي', program: 'الأمن السيبراني', progress: 82, status: 'نشط', payment: 'مدفوع' },
];

const certsByProgram = [
  { program: 'تطوير الويب', count: 18, color: PRIMARY },
  { program: 'PMP', count: 15, color: GREEN },
  { program: 'التحليل المالي', count: 14, color: GOLD },
];

export default function InstituteOwnerDashboard() {
  const [activeItem, setActiveItem] = useState('home');
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showIssueCert, setShowIssueCert] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [quickToggles, setQuickToggles] = useState({ registration: true, payments: true, certificates: false, notifications: true });
  const [newProgram, setNewProgram] = useState({ title: '', price: '', duration: '', level: '', method: '' });
  const [certForm, setCertForm] = useState({ trainee: '', program: '', date: '', serial: '' });

  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <div onClick={onChange} style={{ width: 42, height: 24, borderRadius: 12, background: on ? PRIMARY : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0, border: `1px solid ${on ? PRIMARY : 'rgba(255,255,255,0.15)'}` }}>
      <div style={{ position: 'absolute', top: 3, right: on ? 3 : undefined, left: on ? undefined : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </div>
  );

  const FillBar = ({ pct, color }: { pct: number; color: string }) => (
    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, width: '100%', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s' }} />
    </div>
  );

  const Stars = ({ rating }: { rating: number }) => (
    <span style={{ color: GOLD, fontSize: 12 }}>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))} {rating}</span>
  );

  const sidebarW = sidebarCollapsed ? 64 : 240;

  return (
    <div style={{ direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: BG, color: TEXT, minHeight: '100vh', display: 'flex' }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: sidebarW, background: SIDEBAR_BG, borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', transition: 'width 0.25s', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Sidebar header */}
        <div style={{ padding: sidebarCollapsed ? '20px 12px' : '20px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${PRIMARY},#0369A1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 14, flexShrink: 0 }}>إ</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ color: TEXT, fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>معهد الإتقان</div>
                <div style={{ color: GOLD, fontSize: 10, fontWeight: 600 }}>للتدريب المهني</div>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(v => !v)} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 7, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(238,238,245,0.5)', fontSize: 14, flexShrink: 0 }}>{sidebarCollapsed ? '◀' : '▶'}</button>
        </div>
        {/* User card */}
        {!sidebarCollapsed && (
          <div style={{ margin: '14px 14px 0', background: `${PRIMARY}0D`, border: `1px solid ${PRIMARY}20`, borderRadius: 12, padding: '14px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${GOLD},#b8942e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 15, flexShrink: 0 }}>أ</div>
              <div>
                <div style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>أحمد المحيسن</div>
                <div style={{ color: GOLD, fontSize: 11, fontWeight: 600 }}>مدير المعهد</div>
                <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10 }}>معهد الإتقان للتدريب</div>
              </div>
            </div>
          </div>
        )}
        {/* Nav groups */}
        <div style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {sidebarGroups.map(group => (
            <div key={group.label} style={{ marginBottom: 4 }}>
              {!sidebarCollapsed && (
                <div style={{ color: 'rgba(238,238,245,0.25)', fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '10px 18px 6px', textTransform: 'uppercase' }}>{group.label}</div>
              )}
              {group.items.map(item => {
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveItem(item.id);
                      if (item.id === 'add-program') setShowAddProgram(true);
                      if (item.id === 'issue-cert') setShowIssueCert(true);
                    }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: sidebarCollapsed ? '10px 0' : '9px 16px', background: isActive ? `${PRIMARY}18` : 'transparent', border: 'none', borderRight: isActive ? `3px solid ${item.gold ? GOLD : PRIMARY}` : '3px solid transparent', cursor: 'pointer', transition: 'all 0.15s', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    {!sidebarCollapsed && (
                      <>
                        <span style={{ flex: 1, color: item.gold ? GOLD : isActive ? PRIMARY : 'rgba(238,238,245,0.65)', fontSize: 13, fontWeight: isActive || item.gold ? 700 : 500, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                        {item.badge != null && (
                          <span style={{ background: item.badge === 5 ? RED : PRIMARY, color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 10, flexShrink: 0 }}>{item.badge}</span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxHeight: '100vh' }}>

        {/* ── Period Bar ── */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', background: `${GOLD}08`, border: `1px solid ${GOLD}20`, borderRadius: 14, padding: '14px 22px', marginBottom: 24, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', align: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>📆</span>
            <span style={{ color: GOLD, fontWeight: 700, fontSize: 14 }}>ذو القعدة 1446</span>
          </div>
          {[{ v: '5', l: 'دفعات نشطة', c: PRIMARY }, { v: '47', l: 'شهادة أُصدرت', c: GREEN }, { v: '88.7%', l: 'امتلاء البرامج', c: GOLD }].map(s => (
            <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 10, background: `${s.c}10`, border: `1px solid ${s.c}20`, borderRadius: 10, padding: '8px 16px' }}>
              <span style={{ color: s.c, fontSize: 18, fontWeight: 900 }}>{s.v}</span>
              <span style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{s.l}</span>
            </div>
          ))}
          <button style={{ background: `${PRIMARY}15`, border: `1px solid ${PRIMARY}30`, color: PRIMARY, fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 9, cursor: 'pointer' }}>تصدير التقرير</button>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 26 }}>
          {[
            { title: 'إجمالي المتدربين', value: '284', sub: '+12 هذا الشهر', color: PRIMARY, icon: '👥' },
            { title: 'البرامج النشطة', value: '18', sub: '5 دفعات جارية', color: GOLD, icon: '📚' },
            { title: 'الشهادات الصادرة', value: '47', sub: 'هذا الشهر', color: GREEN, icon: '🏅' },
            { title: 'الإيرادات', value: '128,400', sub: 'ريال سعودي', color: PURPLE, icon: '💰' },
          ].map(s => (
            <div key={s.title} style={{ background: CARD, border: `1px solid ${s.color}20`, borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 28px ${s.color}18`; el.style.borderColor = `${s.color}45`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = `${s.color}20`; }}>
              <div style={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, background: `${s.color}06`, borderRadius: '50%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 12, fontWeight: 600 }}>{s.title}</div>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
              </div>
              <div style={{ color: TEXT, fontSize: 32, fontWeight: 900, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
              <div style={{ color: s.color, fontSize: 11, fontWeight: 600 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Active Programs Table + Revenue Summary ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 22 }}>
          {/* Programs Table */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>البرامج النشطة</div>
              <button onClick={() => setShowAddProgram(true)} style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30`, color: GOLD, fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8, cursor: 'pointer' }}>+ إضافة برنامج</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.6fr 0.6fr 1.4fr', gap: 0, marginBottom: 10, padding: '0 4px' }}>
              {['البرنامج', 'متدرب', 'ظرفية', 'الامتلاء'].map(h => (
                <div key={h} style={{ color: 'rgba(238,238,245,0.3)', fontSize: 11, fontWeight: 700 }}>{h}</div>
              ))}
            </div>
            {activePrograms.map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 0.6fr 0.6fr 1.4fr', alignItems: 'center', gap: 0, padding: '10px 4px', borderBottom: i < activePrograms.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ color: p.color, fontSize: 13, fontWeight: 700 }}>{p.trainees}</div>
                <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{p.capacity}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FillBar pct={p.fill} color={p.color} />
                  <span style={{ color: p.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{p.fill}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Summary */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 }}>ملخص الإيرادات</div>
            {[
              { label: 'إيرادات اليوم', value: '4,200 ر.س', color: GREEN, up: true },
              { label: 'إيرادات الأسبوع', value: '22,800 ر.س', color: PRIMARY, up: true },
              { label: 'إيرادات الشهر', value: '128,400 ر.س', color: GOLD, up: true },
              { label: 'عمولة المنصة', value: '6,420 ر.س', color: RED, up: false },
              { label: 'صافي الإيرادات', value: '121,980 ر.س', color: GREEN, up: true },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                <span style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12 }}>{r.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: r.up ? '▲' : '▼', fontSize: 10 }}>{r.up ? '▲' : '▼'}</span>
                  <span style={{ color: r.color, fontWeight: 800, fontSize: 14 }}>{r.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trainer Performance + Active Trainees ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20, marginBottom: 22 }}>
          {/* Trainer Performance */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 }}>أداء المدربين</div>
            {trainerPerformance.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < trainerPerformance.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${PRIMARY}80,${GOLD}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 15, flexShrink: 0 }}>{t.name.charAt(0)}</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ color: TEXT, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11 }}>{t.program}</div>
                  <Stars rating={t.rating} />
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ color: GREEN, fontWeight: 800, fontSize: 13 }}>{t.completion}%</div>
                  <div style={{ color: 'rgba(238,238,245,0.3)', fontSize: 10 }}>إنجاز</div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Trainees Table */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>المتدربون النشطون</div>
              <span style={{ background: `${PRIMARY}15`, color: PRIMARY, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 8, border: `1px solid ${PRIMARY}25` }}>284 متدرب</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 0.8fr 0.7fr 0.7fr', gap: 0, marginBottom: 10, padding: '0 4px' }}>
              {['المتدرب', 'البرنامج', 'التقدم', 'الحالة', 'الدفع'].map(h => (
                <div key={h} style={{ color: 'rgba(238,238,245,0.3)', fontSize: 11, fontWeight: 700 }}>{h}</div>
              ))}
            </div>
            {activeTrainees.map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 0.8fr 0.7fr 0.7fr', alignItems: 'center', gap: 0, padding: '10px 4px', borderBottom: i < activeTrainees.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                <div style={{ color: TEXT, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                <div style={{ color: 'rgba(238,238,245,0.45)', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.program}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${t.progress}%`, height: '100%', background: t.progress > 75 ? GREEN : t.progress > 50 ? GOLD : RED, borderRadius: 3 }} />
                  </div>
                  <span style={{ color: 'rgba(238,238,245,0.4)', fontSize: 10, flexShrink: 0 }}>{t.progress}%</span>
                </div>
                <span style={{ background: t.status === 'نشط' ? `${GREEN}18` : `${RED}18`, color: t.status === 'نشط' ? GREEN : RED, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5 }}>{t.status}</span>
                <span style={{ background: t.payment === 'مدفوع' ? `${PRIMARY}15` : `${GOLD}15`, color: t.payment === 'مدفوع' ? PRIMARY : GOLD, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5 }}>{t.payment}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Certificates This Month + Quick Settings ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 22 }}>
          {/* Certs this month */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>شهادات الشهر الحالي</div>
              <button onClick={() => setShowIssueCert(true)} style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30`, color: GOLD, fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8, cursor: 'pointer' }}>🏅 إصدار شهادة</button>
            </div>
            {certsByProgram.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < certsByProgram.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.color}15`, border: `1px solid ${c.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: TEXT, fontSize: 13, fontWeight: 700 }}>{c.program}</div>
                  <div style={{ marginTop: 6 }}><FillBar pct={(c.count / 47) * 100} color={c.color} /></div>
                </div>
                <div style={{ color: c.color, fontSize: 20, fontWeight: 900, flexShrink: 0 }}>{c.count}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTop: `1px solid rgba(255,255,255,0.06)` }}>
              <span style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>الإجمالي هذا الشهر</span>
              <span style={{ color: GREEN, fontSize: 18, fontWeight: 900 }}>47 شهادة</span>
            </div>
          </div>

          {/* Quick Settings */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 }}>الإعدادات السريعة</div>
            {[
              { key: 'registration', label: 'التسجيل في البرامج', desc: 'السماح بتلقي طلبات تسجيل جديدة', color: PRIMARY },
              { key: 'payments', label: 'نظام الأقساط', desc: 'تفعيل خيار الدفع بالأقساط', color: GOLD },
              { key: 'certificates', label: 'إصدار تلقائي للشهادات', desc: 'إصدار الشهادة عند إتمام البرنامج', color: GREEN },
              { key: 'notifications', label: 'الإشعارات الفورية', desc: 'إرسال تنبيهات للمتدربين', color: PURPLE },
            ].map(t => (
              <div key={t.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                <div>
                  <div style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{t.label}</div>
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11, marginTop: 2 }}>{t.desc}</div>
                </div>
                <Toggle on={(quickToggles as any)[t.key]} onChange={() => setQuickToggles(prev => ({ ...prev, [t.key]: !(prev as any)[t.key] }))} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODAL: Add Program ── */}
      {showAddProgram && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#080814', border: `1px solid ${GOLD}30`, borderRadius: 22, padding: 36, width: '100%', maxWidth: 480, direction: 'rtl', position: 'relative' }}>
            <button onClick={() => setShowAddProgram(false)} style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(238,238,245,0.5)', width: 32, height: 32, borderRadius: 8, fontSize: 18, cursor: 'pointer' }}>×</button>
            <div style={{ color: GOLD, fontSize: 20, fontWeight: 800, marginBottom: 6 }}>➕ إضافة برنامج جديد</div>
            <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 12, marginBottom: 26 }}>أدخل تفاصيل البرنامج التدريبي الجديد</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'اسم البرنامج', key: 'title', ph: 'مثال: تطوير الويب', span: true },
                { label: 'السعر (ر.س)', key: 'price', ph: '0000' },
                { label: 'المدة (ساعة)', key: 'duration', ph: '48' },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: f.span ? '1/-1' : undefined }}>
                  <label style={{ display: 'block', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>{f.label}</label>
                  <input placeholder={f.ph} value={(newProgram as any)[f.key]} onChange={e => setNewProgram(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '11px 14px', color: TEXT, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>المستوى</label>
                <select value={newProgram.level} onChange={e => setNewProgram(p => ({ ...p, level: e.target.value }))} style={{ width: '100%', background: '#0A0A18', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '11px 14px', color: TEXT, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}>
                  <option value="">اختر</option>
                  {['مبتدئ', 'متوسط', 'متقدم'].map(v => <option key={v} value={v} style={{ background: '#0A0A18' }}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>طريقة التدريب</label>
                <select value={newProgram.method} onChange={e => setNewProgram(p => ({ ...p, method: e.target.value }))} style={{ width: '100%', background: '#0A0A18', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '11px 14px', color: TEXT, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}>
                  <option value="">اختر</option>
                  {['حضوري', 'أونلاين', 'مدمج'].map(v => <option key={v} value={v} style={{ background: '#0A0A18' }}>{v}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button style={{ flex: 1, background: `linear-gradient(135deg,${GOLD},#b8942e)`, border: 'none', color: '#fff', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>حفظ البرنامج</button>
              <button onClick={() => setShowAddProgram(false)} style={{ padding: '13px 22px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 12, color: 'rgba(238,238,245,0.45)', fontSize: 13, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Issue Certificate ── */}
      {showIssueCert && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#080814', border: `1px solid ${GREEN}30`, borderRadius: 22, padding: 36, width: '100%', maxWidth: 440, direction: 'rtl', position: 'relative' }}>
            <button onClick={() => setShowIssueCert(false)} style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(238,238,245,0.5)', width: 32, height: 32, borderRadius: 8, fontSize: 18, cursor: 'pointer' }}>×</button>
            <div style={{ color: GREEN, fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🏅 إصدار شهادة</div>
            <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 12, marginBottom: 26 }}>أدخل بيانات الشهادة للمتدرب</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'اسم المتدرب', key: 'trainee', ph: 'الاسم الكامل' },
                { label: 'البرنامج', key: 'program', ph: 'اسم البرنامج' },
                { label: 'تاريخ الإصدار', key: 'date', ph: 'YYYY-MM-DD', type: 'date' },
                { label: 'الرقم التسلسلي', key: 'serial', ph: 'CERT-2025-XXXX' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 7 }}>{f.label}</label>
                  <input type={f.type || 'text'} placeholder={f.ph} value={(certForm as any)[f.key]} onChange={e => setCertForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '11px 14px', color: TEXT, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button style={{ flex: 1, background: `linear-gradient(135deg,${GREEN},#059669)`, border: 'none', color: '#fff', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>إصدار الشهادة</button>
              <button onClick={() => setShowIssueCert(false)} style={{ padding: '13px 22px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 12, color: 'rgba(238,238,245,0.45)', fontSize: 13, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
