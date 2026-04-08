'use client';
import { useState } from 'react';

const ACCENT = '#FB923C';
const BG = '#06060E';
const SIDEBAR_BG = '#08081A';
const BD = 'rgba(255,255,255,0.07)';
const CARD = 'rgba(255,255,255,0.03)';
const TEXT = '#EEEEF5';
const DIM = 'rgba(238,238,245,0.6)';
const MUT = 'rgba(238,238,245,0.3)';
const GREEN = '#10B981';
const BLUE = '#3B82F6';

export default function TrainerDashboard() {
  const [activeMenu, setActiveMenu] = useState('لوحة التحكم');
  const [taskDone, setTaskDone] = useState<number[]>([]);

  const sidebarGroups = [
    {
      label: 'الرئيسية',
      items: [
        { label: 'لوحة التحكم', icon: '🏠', badge: null },
        { label: 'جدولي', icon: '📅', badge: null },
      ],
    },
    {
      label: 'الدورات',
      items: [
        { label: 'دوراتي', icon: '📚', badge: 3 },
        { label: 'أرشيف الدورات', icon: '🗂️', badge: null },
        { label: 'المحتوى', icon: '🎬', badge: null },
      ],
    },
    {
      label: 'المتدربون',
      items: [
        { label: 'المتدربين', icon: '👥', badge: 52 },
        { label: 'الحضور', icon: '✅', badge: null },
        { label: 'التقييمات', icon: '📝', badge: 8 },
        { label: 'الشهادات', icon: '🎓', badge: null },
      ],
    },
    {
      label: 'التواصل',
      items: [
        { label: 'الرسائل', icon: '💬', badge: 4 },
        { label: 'الإعلانات', icon: '📣', badge: null },
        { label: 'تقييمات المتدربين', icon: '⭐', badge: null },
      ],
    },
    {
      label: 'الملف الشخصي',
      items: [
        { label: 'ملفي', icon: '👤', badge: null },
        { label: 'شهاداتي', icon: '🏆', badge: null },
        { label: 'الإعدادات', icon: '⚙️', badge: null },
      ],
    },
  ];

  const stats = [
    { label: 'دورات نشطة', value: '3', icon: '📚', color: ACCENT },
    { label: 'متدرب مسجل', value: '52', icon: '👥', color: BLUE },
    { label: 'متوسط التقييم', value: '4.9', icon: '⭐', color: '#FBBF24' },
    { label: 'معدل النجاح', value: '96%', icon: '🏆', color: GREEN },
  ];

  const schedule = [
    { time: '09:00 – 11:00', course: 'تطوير الويب المتكامل', hall: 'قاعة A1', trainees: 42, status: 'قادم' },
    { time: '12:00 – 02:00', course: 'إدارة المشاريع PMP', hall: 'قاعة B2', trainees: 38, status: 'الآن' },
    { time: '04:00 – 06:00', course: 'تطوير تطبيقات الجوال', hall: 'قاعة C1', trainees: 30, status: 'قادم' },
  ];

  const courses = [
    { name: 'تطوير الويب المتكامل', trainees: 42, sessions: 24, done: 18, color: ACCENT },
    { name: 'إدارة المشاريع PMP', trainees: 38, sessions: 20, done: 12, color: BLUE },
    { name: 'تطوير تطبيقات الجوال', trainees: 30, sessions: 16, done: 8, color: '#8B5CF6' },
  ];

  const tasks = [
    { text: 'رفع محتوى الوحدة 5 · تطوير الويب', due: 'اليوم', urgency: 'عاجل', color: '#EF4444' },
    { text: 'تصحيح اختبار الوحدة 3 · PMP (38 ورقة)', due: 'غداً', urgency: 'مهم', color: '#F59E0B' },
    { text: 'إعداد خطة الوحدة 6 · الويب', due: 'الأربعاء', urgency: 'عادي', color: ACCENT },
    { text: 'رصد درجات الاختبار التطبيقي', due: 'الخميس', urgency: 'عادي', color: ACCENT },
    { text: 'مراجعة مشاريع المتدربين النهائية', due: 'الأحد', urgency: 'مهم', color: '#F59E0B' },
    { text: 'إعداد شهادات دورة PMP الجديدة', due: 'الأسبوع القادم', urgency: 'عادي', color: MUT },
  ];

  const students = [
    { name: 'أحمد العمري', course: 'تطوير الويب', attendance: 95, grade: 92, tasks: 8, status: 'متميز' },
    { name: 'سارة المالكي', course: 'تطوير الويب', attendance: 100, grade: 98, tasks: 8, status: 'متميز' },
    { name: 'محمد الشهري', course: 'PMP', attendance: 88, grade: 79, tasks: 7, status: 'جيد' },
    { name: 'نوف القحطاني', course: 'تطوير الجوال', attendance: 92, grade: 85, tasks: 8, status: 'جيد جداً' },
    { name: 'فهد الدوسري', course: 'PMP', attendance: 75, grade: 66, tasks: 5, status: 'يحتاج متابعة' },
    { name: 'ريم السالم', course: 'تطوير الجوال', attendance: 97, grade: 94, tasks: 8, status: 'متميز' },
  ];

  const statusColor = (s: string) => s === 'متميز' ? GREEN : s === 'جيد جداً' ? ACCENT : s === 'جيد' ? BLUE : '#EF4444';
  const statusBg = (s: string) => s === 'متميز' ? 'rgba(16,185,129,0.12)' : s === 'جيد جداً' ? `${ACCENT}18` : s === 'جيد' ? 'rgba(59,130,246,0.12)' : 'rgba(239,68,68,0.12)';

  return (
    <div style={{ display: 'flex', fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: BG, color: TEXT, minHeight: '100vh', direction: 'rtl' }}>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${ACCENT}30;border-radius:4px}` }} />

      {/* ===== SIDEBAR ===== */}
      <aside style={{ width: 220, background: SIDEBAR_BG, borderLeft: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
        <div style={{ padding: '18px 16px', borderBottom: `1px solid ${BD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${ACCENT},#EA580C)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>م</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: TEXT }}>لوحة المدرب</div>
              <div style={{ fontSize: 10, color: MUT }}>متين للتدريب</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {sidebarGroups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 2 }}>
              <div style={{ fontSize: 9, color: MUT, fontWeight: 700, padding: '7px 16px 3px', letterSpacing: 1.5, textTransform: 'uppercase' }}>{group.label}</div>
              {group.items.map((item, ii) => {
                const active = activeMenu === item.label;
                return (
                  <button key={ii} onClick={() => setActiveMenu(item.label)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 16px', background: active ? `${ACCENT}18` : 'transparent', border: 'none', borderRight: active ? `3px solid ${ACCENT}` : '3px solid transparent', color: active ? ACCENT : DIM, fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s', textAlign: 'right' }}>
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && <span style={{ background: ACCENT, color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: 9, padding: '1px 6px' }}>{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: `1px solid ${BD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${ACCENT}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: ACCENT }}>خ</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT }}>م. خالد الحربي</div>
              <div style={{ fontSize: 9, color: MUT }}>مدرب معتمد</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '26px 26px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 21, fontWeight: 900, color: TEXT }}>مرحباً، م. خالد 👋</h1>
            <div style={{ fontSize: 12, color: MUT, marginTop: 3 }}>الثلاثاء، 8 أبريل 2026 · لديك 3 جلسات اليوم</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`, borderRadius: 9, padding: '7px 14px', fontSize: 12, color: ACCENT, fontWeight: 700 }}>⭐ 4.9 التقييم</div>
            <button style={{ background: `linear-gradient(135deg,${ACCENT},#EA580C)`, border: 'none', borderRadius: 9, padding: '9px 16px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ رفع محتوى</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: CARD, border: `1px solid ${s.color}22`, borderRadius: 14, padding: '18px 20px', transition: 'all .2s', cursor: 'default' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: DIM, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Today's Schedule */}
        <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>جدول اليوم · الثلاثاء</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {schedule.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', background: s.status === 'الآن' ? `${ACCENT}12` : 'rgba(255,255,255,0.025)', border: `1px solid ${s.status === 'الآن' ? ACCENT + '40' : BD}`, borderRadius: 11 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: s.status === 'الآن' ? ACCENT : TEXT }}>{s.time}</div>
                    <div style={{ fontSize: 10, color: MUT, marginTop: 2 }}>{s.hall}</div>
                  </div>
                  <div style={{ width: 1, height: 30, background: BD }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.course}</div>
                    <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{s.trainees} متدرب</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.status === 'الآن' ? '#fff' : DIM, background: s.status === 'الآن' ? ACCENT : 'rgba(255,255,255,0.06)', padding: '5px 12px', borderRadius: 7 }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Progress + Tasks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Course Progress */}
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>تقدم الدورات</div>
            <div style={{ display: 'grid', gap: 16 }}>
              {courses.map((c, i) => {
                const pct = Math.round((c.done / c.sessions) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{c.trainees} متدرب · {c.done}/{c.sessions} جلسة</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: c.color }}>{pct}%</div>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg,${c.color},${c.color}CC)`, borderRadius: 6, transition: 'width .4s' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks */}
          <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>المهام والمستحقات</div>
              <div style={{ fontSize: 11, color: ACCENT, background: `${ACCENT}18`, padding: '3px 10px', borderRadius: 6, fontWeight: 700 }}>{tasks.length - taskDone.length} متبقية</div>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {tasks.map((t, i) => (
                <div key={i} onClick={() => setTaskDone(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                  style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: taskDone.includes(i) ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.025)', border: `1px solid ${taskDone.includes(i) ? GREEN + '30' : BD}`, borderRadius: 9, cursor: 'pointer', opacity: taskDone.includes(i) ? 0.55 : 1 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 5, border: `2px solid ${taskDone.includes(i) ? GREEN : t.color}`, background: taskDone.includes(i) ? GREEN : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    {taskDone.includes(i) && <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, textDecoration: taskDone.includes(i) ? 'line-through' : 'none', color: taskDone.includes(i) ? MUT : TEXT }}>{t.text}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: t.color, background: `${t.color}18`, padding: '2px 7px', borderRadius: 5, fontWeight: 700 }}>{t.urgency}</span>
                      <span style={{ fontSize: 10, color: MUT }}>موعد التسليم: {t.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Performance Table */}
        <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>أداء المتدربين</div>
            <button style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}30`, borderRadius: 8, padding: '6px 14px', color: ACCENT, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>عرض الكل (52)</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BD}` }}>
                  {['المتدرب', 'الدورة', 'الحضور', 'المعدل', 'المهام', 'المستوى'].map((h, i) => (
                    <th key={i} style={{ padding: '9px 12px', fontSize: 11, color: MUT, fontWeight: 700, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    <td style={{ padding: '11px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${ACCENT}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: ACCENT }}>{s.name.charAt(0)}</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '11px 12px', fontSize: 12, color: DIM }}>{s.course}</td>
                    <td style={{ padding: '11px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 40, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${s.attendance}%`, height: '100%', background: s.attendance >= 90 ? GREEN : '#F59E0B', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, color: s.attendance >= 90 ? GREEN : '#F59E0B', fontWeight: 700 }}>{s.attendance}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 12px', fontSize: 13, fontWeight: 800, color: s.grade >= 90 ? GREEN : s.grade >= 75 ? ACCENT : '#EF4444' }}>{s.grade}%</td>
                    <td style={{ padding: '11px 12px', fontSize: 12, color: DIM }}>{s.tasks}/8</td>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(s.status), background: statusBg(s.status), padding: '4px 9px', borderRadius: 6 }}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
