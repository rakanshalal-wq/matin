'use client';
import { useState } from 'react';

const ACCENT = '#22D3EE';
const BG = '#06060E';
const SIDEBAR_BG = '#08081A';
const BD = 'rgba(255,255,255,0.07)';
const CARD = 'rgba(255,255,255,0.03)';
const TEXT = '#EEEEF5';
const DIM = 'rgba(238,238,245,0.6)';
const MUT = 'rgba(238,238,245,0.3)';
const GREEN = '#10B981';
const GOLD = '#D4A843';

export default function TraineeDashboard() {
  const [activeMenu, setActiveMenu] = useState('الرئيسية');
  const [taskDone, setTaskDone] = useState<number[]>([]);

  const sidebarGroups = [
    {
      label: 'الرئيسية',
      items: [
        { label: 'الرئيسية', icon: '🏠', badge: null },
        { label: 'جدولي', icon: '📅', badge: null },
      ],
    },
    {
      label: 'التعلم',
      items: [
        { label: 'دوراتي', icon: '📚', badge: 2 },
        { label: 'الواجبات', icon: '📝', badge: 3 },
        { label: 'الاختبارات', icon: '📋', badge: null },
        { label: 'المواد', icon: '📂', badge: null },
      ],
    },
    {
      label: 'الإنجازات',
      items: [
        { label: 'شهاداتي', icon: '🎓', badge: 1 },
        { label: 'ملف الإنجاز', icon: '💼', badge: null },
        { label: 'تقدمي', icon: '📈', badge: null },
      ],
    },
    {
      label: 'المالية',
      items: [
        { label: 'الرسوم', icon: '💰', badge: null },
        { label: 'فواتيري', icon: '🧾', badge: null },
      ],
    },
    {
      label: 'أخرى',
      items: [
        { label: 'الرسائل', icon: '💬', badge: 2 },
        { label: 'الإعلانات', icon: '📣', badge: null },
        { label: 'ملفي', icon: '👤', badge: null },
        { label: 'الإعدادات', icon: '⚙️', badge: null },
      ],
    },
  ];

  const stats = [
    { label: 'دورة مسجلة', value: '2', icon: '📚', color: ACCENT },
    { label: 'معدل الدراسة', value: '90%', icon: '📊', color: GREEN },
    { label: 'نسبة الحضور', value: '95%', icon: '✅', color: GOLD },
    { label: 'شهادة مكتسبة', value: '1', icon: '🎓', color: '#A78BFA' },
  ];

  const courses = [
    { name: 'تطوير تطبيقات الويب', trainer: 'م. خالد الحربي', sessions: 36, done: 22, nextSession: 'الثلاثاء 12م – 2م', hall: 'قاعة A1', color: ACCENT },
    { name: 'أساسيات قواعد البيانات', trainer: 'م. نورة الشمري', sessions: 20, done: 10, nextSession: 'الأربعاء 10ص – 12م', hall: 'مختبر C1', color: '#8B5CF6' },
  ];

  const assignments = [
    { title: 'مشروع صفحة HTML/CSS متجاوبة', course: 'تطوير الويب', due: 'اليوم 11:59م', urgency: 'عاجل', color: '#EF4444', status: 'معلق' },
    { title: 'تمارين SQL – الوحدة 3', course: 'قواعد البيانات', due: 'الخميس 11:59م', urgency: 'مهم', color: '#F59E0B', status: 'قيد التنفيذ' },
    { title: 'اختبار JavaScript الأساسي', course: 'تطوير الويب', due: 'الأحد 10:00ص', urgency: 'عادي', color: ACCENT, status: 'معلق' },
  ];

  const weekSchedule = [
    { day: 'الأحد', sessions: [{ time: '10ص-12م', course: 'تطوير الويب', hall: 'A1' }] },
    { day: 'الاثنين', sessions: [] },
    { day: 'الثلاثاء', sessions: [{ time: '12م-2م', course: 'تطوير الويب', hall: 'A1' }] },
    { day: 'الأربعاء', sessions: [{ time: '10ص-12م', course: 'قواعد البيانات', hall: 'C1' }] },
    { day: 'الخميس', sessions: [{ time: '2م-4م', course: 'قواعد البيانات', hall: 'C1' }] },
  ];

  return (
    <div style={{ display: 'flex', fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: BG, color: TEXT, minHeight: '100vh', direction: 'rtl' }}>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${ACCENT}30;border-radius:4px}` }} />

      {/* ===== SIDEBAR ===== */}
      <aside style={{ width: 214, background: SIDEBAR_BG, borderLeft: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
        <div style={{ padding: '18px 15px', borderBottom: `1px solid ${BD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${ACCENT},#0891B2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>م</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: TEXT }}>بوابة المتدرب</div>
              <div style={{ fontSize: 10, color: MUT }}>متين للتدريب</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {sidebarGroups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 2 }}>
              <div style={{ fontSize: 9, color: MUT, fontWeight: 700, padding: '7px 15px 3px', letterSpacing: 1.5, textTransform: 'uppercase' }}>{group.label}</div>
              {group.items.map((item, ii) => {
                const active = activeMenu === item.label;
                return (
                  <button key={ii} onClick={() => setActiveMenu(item.label)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 15px', background: active ? `${ACCENT}15` : 'transparent', border: 'none', borderRight: active ? `3px solid ${ACCENT}` : '3px solid transparent', color: active ? ACCENT : DIM, fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s', textAlign: 'right' }}>
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && <span style={{ background: ACCENT, color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: 9, padding: '1px 6px' }}>{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px 15px', borderTop: `1px solid ${BD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${ACCENT}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: ACCENT }}>ع</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT }}>عبدالله المالكي</div>
              <div style={{ fontSize: 9, color: MUT }}>متدرب · تطوير الويب</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '26px 26px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div>
            <h1 style={{ fontSize: 21, fontWeight: 900, color: TEXT }}>مرحباً، عبدالله 👋</h1>
            <div style={{ fontSize: 12, color: MUT, marginTop: 3 }}>الثلاثاء، 8 أبريل 2026 · لديك واجب مستحق اليوم</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}28`, borderRadius: 9, padding: '7px 14px', fontSize: 12, color: ACCENT, fontWeight: 700 }}>🔥 5 أيام متتالية</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: CARD, border: `1px solid ${s.color}20`, borderRadius: 14, padding: '18px 18px', transition: 'all .2s' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: DIM, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>دوراتي الحالية</div>
            <div style={{ fontSize: 11, color: ACCENT, background: `${ACCENT}15`, padding: '3px 10px', borderRadius: 6, fontWeight: 700 }}>2 دورات نشطة</div>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {courses.map((c, i) => {
              const pct = Math.round((c.done / c.sessions) * 100);
              return (
                <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${c.color}25`, borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: DIM }}>{c.trainer} · {c.hall}</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{pct}%</div>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg,${c.color},${c.color}99)`, borderRadius: 5 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: MUT }}>{c.done} من {c.sessions} جلسة مكتملة</div>
                    <div style={{ fontSize: 11, color: c.color, background: `${c.color}15`, padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>🕐 {c.nextSession}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assignments + Certificate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18, marginBottom: 20 }}>
          {/* Assignments */}
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>الواجبات والمهام</div>
              <div style={{ fontSize: 11, color: '#EF4444', background: 'rgba(239,68,68,0.12)', padding: '3px 10px', borderRadius: 6, fontWeight: 700 }}>3 معلقة</div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {assignments.map((a, i) => (
                <div key={i} onClick={() => setTaskDone(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                  style={{ padding: '13px 14px', background: taskDone.includes(i) ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.025)', border: `1px solid ${taskDone.includes(i) ? GREEN + '30' : a.color + '25'}`, borderRadius: 10, cursor: 'pointer', opacity: taskDone.includes(i) ? 0.6 : 1, transition: 'all .2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, textDecoration: taskDone.includes(i) ? 'line-through' : 'none' }}>{a.title}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: a.color, background: `${a.color}18`, padding: '3px 8px', borderRadius: 5, flexShrink: 0, marginRight: 8 }}>{a.urgency}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: DIM }}>{a.course}</div>
                    <div style={{ fontSize: 10, color: a.color, fontWeight: 600 }}>⏰ {a.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate */}
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>شهادتي المكتسبة</div>
            <div style={{ background: `linear-gradient(135deg,${GOLD}18,rgba(34,211,238,0.08))`, border: `2px solid ${GOLD}35`, borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🎓</div>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>شهادة HTML & CSS الأساسية</div>
              <div style={{ fontSize: 11, color: DIM, marginBottom: 10 }}>مُصدرة في: مارس 2026</div>
              <div style={{ width: 50, height: 50, background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`, borderRadius: 8, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: DIM }}>QR</div>
              <div style={{ fontSize: 10, color: GOLD, fontWeight: 700, background: `${GOLD}15`, padding: '4px 12px', borderRadius: 6, display: 'inline-block' }}>معتمد · TVTC</div>
            </div>
            <button style={{ width: '100%', background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`, borderRadius: 10, padding: '10px 0', color: ACCENT, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>تحميل الشهادة</button>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>الجدول الأسبوعي</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BD}` }}>
                  {weekSchedule.map((d, i) => (
                    <th key={i} style={{ padding: '10px 12px', fontSize: 12, color: i === 1 ? ACCENT : DIM, fontWeight: i === 1 ? 800 : 600, textAlign: 'center' }}>{d.day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {weekSchedule.map((d, i) => (
                    <td key={i} style={{ padding: '12px 8px', verticalAlign: 'top', textAlign: 'center' }}>
                      {d.sessions.length === 0
                        ? <div style={{ fontSize: 11, color: MUT, padding: '8px 0' }}>—</div>
                        : d.sessions.map((s, j) => (
                          <div key={j} style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}25`, borderRadius: 8, padding: '8px 6px', marginBottom: 6 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT }}>{s.time}</div>
                            <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>{s.course}</div>
                            <div style={{ fontSize: 9, color: MUT, marginTop: 2 }}>{s.hall}</div>
                          </div>
                        ))
                      }
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fees Summary */}
        <div style={{ background: CARD, border: `1px solid ${GOLD}20`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>ملخص الرسوم الدراسية</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 16 }}>
            {[
              { label: 'المبلغ المدفوع', value: '3,700', unit: 'ر.س', color: GREEN, icon: '✅' },
              { label: 'المبلغ المتبقي', value: '2,000', unit: 'ر.س', color: '#EF4444', icon: '⏳' },
              { label: 'الإجمالي', value: '5,700', unit: 'ر.س', color: GOLD, icon: '💳' },
            ].map((f, i) => (
              <div key={i} style={{ background: `${f.color}08`, border: `1px solid ${f.color}20`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: f.color }}>{f.value}</div>
                <div style={{ fontSize: 11, color: MUT, marginTop: 3 }}>{f.unit} · {f.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${BD}`, borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>الدفعة القادمة</div>
                <div style={{ fontSize: 11, color: DIM, marginTop: 3 }}>استحقاق: 1 مايو 2026 · 1,000 ر.س</div>
              </div>
              <button style={{ background: `linear-gradient(135deg,${ACCENT},#0891B2)`, border: 'none', borderRadius: 9, padding: '9px 18px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>سداد الآن</button>
            </div>
          </div>
        </div>

        {/* ===== SECTION: mycourses ===== */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: TEXT, marginBottom: 16 }}>دوراتي المسجلة</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { name: 'تطوير تطبيقات الويب', trainer: 'م. خالد الحربي', progress: 61, remaining: 14, next: 'الثلاثاء 12م – 2م', color: '#E65100' },
              { name: 'أساسيات قواعد البيانات', trainer: 'م. نورة الشمري', progress: 50, remaining: 10, next: 'الأربعاء 10ص – 12م', color: '#8B5CF6' },
              { name: 'JavaScript المتقدم', trainer: 'م. عمر الغامدي', progress: 28, remaining: 18, next: 'الأحد 4م – 6م', color: '#3B82F6' },
              { name: 'UI/UX التصميم', trainer: 'م. هيا الدوسري', progress: 15, remaining: 22, next: 'الخميس 2م – 4م', color: '#10B981' },
            ].map((c, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${c.color}28`, borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: DIM }}>👨‍🏫 {c.trainer}</div>
                  </div>
                  <div style={{ fontSize: 21, fontWeight: 900, color: c.color }}>{c.progress}%</div>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ width: `${c.progress}%`, height: '100%', background: `linear-gradient(90deg,${c.color},${c.color}99)`, borderRadius: 5 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: MUT }}>{c.remaining} جلسة متبقية</span>
                  <span style={{ fontSize: 11, color: c.color, background: `${c.color}15`, padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>🕐 {c.next}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION: assignments ===== */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: TEXT }}>الواجبات والتكاليف</div>
            <div style={{ fontSize: 11, color: '#EF4444', background: 'rgba(239,68,68,0.12)', padding: '4px 12px', borderRadius: 7, fontWeight: 700 }}>2 معلق</div>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { title: 'مشروع صفحة HTML/CSS متجاوبة', course: 'تطوير الويب', deadline: 'اليوم 11:59م', status: 'معلق', grade: null, color: '#EF4444' },
              { title: 'تمارين SQL – الوحدة 3', course: 'قواعد البيانات', deadline: 'الخميس 11:59م', status: 'قيد التنفيذ', grade: null, color: '#F59E0B' },
              { title: 'اختبار JavaScript الأساسي', course: 'تطوير الويب', deadline: 'الأحد 10:00ص', status: 'معلق', grade: null, color: '#EF4444' },
              { title: 'تقرير تصميم قاعدة بيانات', course: 'قواعد البيانات', deadline: '10 أبريل', status: 'مُسلَّم', grade: '88%', color: '#E65100' },
              { title: 'مشروع React Component', course: 'JS المتقدم', deadline: '15 أبريل', status: 'متأخر', grade: null, color: '#EF4444' },
            ].map((a, i) => {
              const statusColor = a.status === 'مُسلَّم' ? GREEN : a.status === 'متأخر' ? '#EF4444' : a.status === 'قيد التنفيذ' ? '#F59E0B' : '#E65100';
              const statusBg = a.status === 'مُسلَّم' ? 'rgba(16,185,129,0.12)' : a.status === 'متأخر' ? 'rgba(239,68,68,0.12)' : a.status === 'قيد التنفيذ' ? 'rgba(245,158,11,0.12)' : 'rgba(230,81,0,0.12)';
              return (
                <div key={i} style={{ background: CARD, border: `1px solid ${a.color}22`, borderRadius: 13, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>{a.title}</div>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: DIM }}>{a.course}</span>
                      <span style={{ fontSize: 11, color: a.color }}>⏰ {a.deadline}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {a.grade && <span style={{ fontSize: 13, fontWeight: 800, color: GREEN }}>{a.grade}</span>}
                    <span style={{ fontSize: 11, fontWeight: 700, color: statusColor, background: statusBg, padding: '5px 12px', borderRadius: 7 }}>{a.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== SECTION: certificates ===== */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: TEXT, marginBottom: 16 }}>شهاداتي</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
            {[
              { name: 'شهادة HTML & CSS الأساسية', date: 'مارس 2026', grade: '94%', color: '#E65100' },
              { name: 'شهادة SQL للمبتدئين', date: 'يناير 2026', grade: '89%', color: '#8B5CF6' },
              { name: 'شهادة JavaScript Essentials', date: 'نوفمبر 2025', grade: '91%', color: '#3B82F6' },
            ].map((c, i) => (
              <div key={i} style={{ background: `linear-gradient(145deg,${c.color}12,rgba(255,255,255,0.02))`, border: `1.5px solid ${c.color}35`, borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎓</div>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>صادرة: {c.date}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: c.color, marginBottom: 14 }}>{c.grade}</div>
                <button style={{ width: '100%', background: `${c.color}18`, border: `1px solid ${c.color}35`, borderRadius: 9, padding: '8px 0', color: c.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>⬇️ تحميل الشهادة</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { name: 'تطوير تطبيقات الويب المتكامل', progress: 61, color: '#E65100' },
              { name: 'أساسيات قواعد البيانات', progress: 50, color: '#8B5CF6' },
            ].map((c, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 13, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 28 }}>📋</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{c.name}</div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ width: `${c.progress}%`, height: '100%', background: `linear-gradient(90deg,${c.color},${c.color}88)`, borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 10, color: MUT }}>{c.progress}% مكتمل · قيد الإنجاز</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION: schedule ===== */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: TEXT, marginBottom: 16 }}>الجدول الأسبوعي التفصيلي</div>
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 20, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BD}` }}>
                  <th style={{ padding: '10px 14px', fontSize: 11, color: MUT, fontWeight: 700, textAlign: 'right', minWidth: 90 }}>الوقت</th>
                  {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((d, i) => (
                    <th key={i} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: d === 'الثلاثاء' ? '#E65100' : DIM, textAlign: 'center' }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { time: '10ص – 12م', slots: ['تطوير الويب · A1', '', '', 'قواعد البيانات · C1', ''] },
                  { time: '12م – 2م', slots: ['', '', 'تطوير الويب · A1', '', ''] },
                  { time: '2م – 4م', slots: ['', '', '', '', 'قواعد البيانات · C1'] },
                  { time: '4م – 6م', slots: ['', 'JS المتقدم · B1', '', '', ''] },
                  { time: '6م – 8م', slots: ['', '', '', 'UI/UX · D2', ''] },
                ].map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    <td style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#E65100' }}>{row.time}</td>
                    {row.slots.map((slot, si) => (
                      <td key={si} style={{ padding: '8px 10px', textAlign: 'center' }}>
                        {slot
                          ? <div style={{ background: 'rgba(230,81,0,0.12)', border: '1px solid rgba(230,81,0,0.28)', borderRadius: 8, padding: '7px 8px' }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#E65100' }}>{slot.split(' · ')[0]}</div>
                              <div style={{ fontSize: 10, color: MUT, marginTop: 2 }}>{slot.split(' · ')[1]}</div>
                            </div>
                          : <span style={{ fontSize: 12, color: MUT }}>—</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== SECTION: messages ===== */}
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: TEXT }}>صندوق الرسائل</div>
            <div style={{ fontSize: 11, color: '#E65100', background: 'rgba(230,81,0,0.12)', padding: '4px 12px', borderRadius: 7, fontWeight: 700 }}>4 رسائل</div>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { from: 'م. خالد الحربي', course: 'تطوير الويب', message: 'تذكير: موعد تسليم مشروع HTML/CSS اليوم الساعة 11:59م. تأكد من رفع ملفاتك على المنصة.', time: 'منذ ساعتين', read: false, avatar: 'خ', color: '#E65100' },
              { from: 'م. نورة الشمري', course: 'قواعد البيانات', message: 'أحسنت في اختبار الوحدة 2! درجتك 88%. سنبدأ الوحدة 3 يوم الأربعاء القادم.', time: 'منذ 5 ساعات', read: false, avatar: 'ن', color: '#8B5CF6' },
              { from: 'م. عمر الغامدي', course: 'JS المتقدم', message: 'تم رفع محاضرة Async/Await على المنصة. يرجى مراجعتها قبل الجلسة القادمة يوم الأحد.', time: 'أمس', read: true, avatar: 'ع', color: '#3B82F6' },
              { from: 'م. هيا الدوسري', course: 'UI/UX التصميم', message: 'مرحباً! نموذج التقييم لمشروع Wireframe متاح الآن. يُرجى إكماله قبل نهاية الأسبوع.', time: 'منذ يومين', read: true, avatar: 'ه', color: '#10B981' },
            ].map((msg, i) => (
              <div key={i} style={{ background: msg.read ? CARD : 'rgba(230,81,0,0.06)', border: `1px solid ${msg.read ? BD : 'rgba(230,81,0,0.25)'}`, borderRadius: 14, padding: '16px 18px', display: 'flex', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${msg.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: msg.color, flexShrink: 0 }}>{msg.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800 }}>{msg.from}</span>
                      <span style={{ fontSize: 10, color: msg.color, background: `${msg.color}15`, padding: '2px 8px', borderRadius: 5, fontWeight: 600 }}>{msg.course}</span>
                      {!msg.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E65100', display: 'inline-block' }} />}
                    </div>
                    <span style={{ fontSize: 10, color: MUT }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: DIM, lineHeight: 1.6 }}>{msg.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
