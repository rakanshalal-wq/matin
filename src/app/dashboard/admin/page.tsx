'use client';
import { useState } from 'react';

/* ─── Colors ─── */
const BG = '#06060E';
const SIDEBAR_BG = '#08091A';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT = '#EEEEF5';
const MUTED = 'rgba(238,238,245,0.45)';
const CARD = 'rgba(255,255,255,0.025)';

/* ─── Role Tab Config ─── */
type RoleKey = 'hr' | 'finance' | 'admissions' | 'it' | 'students' | 'secretary';

const ROLE_TABS: { id: RoleKey; label: string; color: string }[] = [
  { id: 'hr',         label: 'الموارد البشرية',  color: '#10B981' },
  { id: 'finance',    label: 'المالية',           color: '#F59E0B' },
  { id: 'admissions', label: 'القبول',            color: '#60A5FA' },
  { id: 'it',         label: 'تقنية المعلومات',   color: '#A78BFA' },
  { id: 'students',   label: 'شؤون الطلاب',      color: '#FB923C' },
  { id: 'secretary',  label: 'السكرتارية',        color: '#22D3EE' },
];

/* ─── HR Data ─── */
const HR_EMPLOYEES = [
  { name: 'سارة القحطاني',   role: 'أستاذ مساعد',     dept: 'كلية العلوم',     type: 'دوام كامل', status: 'نشط' },
  { name: 'فهد العتيبي',     role: 'محاضر',            dept: 'كلية الهندسة',    type: 'دوام كامل', status: 'نشط' },
  { name: 'نورة السبيعي',    role: 'موظفة إدارية',     dept: 'شؤون الطلاب',    type: 'دوام جزئي', status: 'نشط' },
  { name: 'عبدالله الدوسري', role: 'مسؤول تقنية',      dept: 'تقنية المعلومات', type: 'دوام كامل', status: 'إجازة' },
  { name: 'منى الشهري',      role: 'أستاذ',            dept: 'كلية الآداب',     type: 'دوام كامل', status: 'نشط' },
  { name: 'خالد الرشيد',     role: 'أمن',              dept: 'الأمن والحراسة',  type: 'دوام كامل', status: 'نشط' },
  { name: 'ريم الحربي',      role: 'سكرتيرة',          dept: 'الرئاسة',         type: 'دوام كامل', status: 'نشط' },
  { name: 'تركي الشمري',     role: 'سائق',             dept: 'النقل الجامعي',   type: 'دوام كامل', status: 'نشط' },
  { name: 'هند المالكي',     role: 'عاملة نظافة',      dept: 'الخدمات',         type: 'دوام جزئي', status: 'نشط' },
];

const HR_DISTRIBUTION = [
  { label: 'هيئة تدريس', count: 154, color: '#60A5FA' },
  { label: 'إداريون',    count: 12,  color: '#10B981' },
  { label: 'أمن',        count: 24,  color: '#F59E0B' },
  { label: 'نظافة',      count: 18,  color: '#A78BFA' },
  { label: 'سائقون',     count: 8,   color: '#FB923C' },
];

const HR_QUICK = [
  'إضافة موظف', 'طلب إجازة', 'تجديد عقد', 'كشف الرواتب',
  'تقرير الحضور', 'تقييم الأداء', 'مخطط الهيكل', 'الإجازات المعلقة',
  'العقود المنتهية', 'إضافة قسم', 'طباعة البطاقات', 'الدليل الوظيفي',
];

/* ─── Finance Data ─── */
const FIN_TRANSACTIONS = [
  { desc: 'رسوم الفصل الثاني',   amount: '2,400,000', type: 'وارد',  date: '01/04/2026' },
  { desc: 'رواتب شهر مارس',      amount: '1,850,000', type: 'صادر',  date: '28/03/2026' },
  { desc: 'صيانة المباني',        amount: '340,000',   type: 'صادر',  date: '25/03/2026' },
  { desc: 'منح دراسية',          amount: '180,000',   type: 'صادر',  date: '20/03/2026' },
  { desc: 'عائدات الكافتيريا',    amount: '56,000',    type: 'وارد',  date: '15/03/2026' },
];

/* ─── Admissions Data ─── */
const ADM_APPS = [
  { name: 'ماجد الحميدي',    prog: 'هندسة الحاسب',   status: 'قيد المراجعة', score: 94 },
  { name: 'لمى الزيد',       prog: 'طب بشري',         status: 'مقبول',        score: 97 },
  { name: 'سلطان المري',     prog: 'إدارة الأعمال',   status: 'رفض',          score: 62 },
  { name: 'عهود الأحمدي',    prog: 'علم النفس',        status: 'قيد المراجعة', score: 88 },
  { name: 'أنس الغامدي',     prog: 'هندسة الكهرباء',  status: 'مقبول',        score: 91 },
];

/* ─── IT Data ─── */
const IT_TICKETS = [
  { title: 'انقطاع الشبكة — قاعة A',  priority: 'حرج',   status: 'مفتوح',    assignee: 'فريق الشبكات' },
  { title: 'تحديث نظام البريد',        priority: 'متوسط', status: 'جاري',     assignee: 'فريق التطوير' },
  { title: 'صيانة السيرفر الرئيسي',   priority: 'عالي',  status: 'مجدول',    assignee: 'البنية التحتية' },
  { title: 'دعم فني — مكتب القبول',    priority: 'منخفض', status: 'مغلق',     assignee: 'الدعم الفني' },
];

/* ─── Students Affairs Data ─── */
const STU_REQUESTS = [
  { student: 'يوسف السالم',    type: 'شهادة قيد',     date: '07/04/2026', status: 'معالجة' },
  { student: 'دانة الحمد',     type: 'عذر طبي',       date: '06/04/2026', status: 'موافق' },
  { student: 'راشد الكثيري',   type: 'نقل قسم',       date: '05/04/2026', status: 'معلق' },
  { student: 'نجود العصيمي',   type: 'استئناف درجة',   date: '04/04/2026', status: 'رفض' },
  { student: 'محمد الشراري',   type: 'إلغاء مقرر',    date: '03/04/2026', status: 'موافق' },
];

/* ─── Secretary Data ─── */
const SEC_TASKS = [
  { task: 'اجتماع مجلس الكلية',         time: '10:00', date: '09/04/2026', done: false },
  { task: 'رسالة الوزارة — جدول الامتحانات', time: '12:00', date: '09/04/2026', done: false },
  { task: 'تسجيل محاضر الاجتماع السابق', time: '09:00', date: '08/04/2026', done: true },
  { task: 'إرسال التقرير الفصلي',         time: '14:00', date: '07/04/2026', done: true },
];

/* ─── Sidebar Nav ─── */
const SIDEBAR_SECTIONS = [
  {
    title: 'الرئيسية',
    items: ['لوحة التحكم', 'التقارير والإحصاءات', 'الإشعارات'],
  },
  {
    title: 'الموارد البشرية',
    items: ['الموظفون', 'الحضور والغياب', 'الرواتب', 'الإجازات'],
  },
  {
    title: 'المالية',
    items: ['الميزانية', 'المصروفات', 'الرسوم الدراسية', 'التقارير المالية'],
  },
  {
    title: 'القبول والتسجيل',
    items: ['طلبات القبول', 'المقبولون', 'التسجيل الأكاديمي'],
  },
  {
    title: 'خدمات الطلاب',
    items: ['الطلبات والمعاملات', 'الشكاوى', 'المنح الدراسية'],
  },
  {
    title: 'النظام',
    items: ['الإعدادات', 'الأذونات', 'سجل النشاط'],
  },
];

/* ─── Helpers ─── */
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${color}18`, color }}>
      {label}
    </span>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div style={{ background: `${color}0A`, border: `1px solid ${color}22`, borderRadius: 16, padding: '18px 20px' }}>
      <div style={{ color: MUTED, fontSize: 12, marginBottom: 8 }}>{label}</div>
      <div style={{ color, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ color: `${color}80`, fontSize: 11, marginTop: 6 }}>{sub}</div>
    </div>
  );
}

/* ─── Tab Content Components ─── */
function HRTab({ accent }: { accent: string }) {
  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard label="إجمالي الموظفين" value={186} sub="جميع الأقسام" color={accent} />
        <StatCard label="إجازات معلقة" value={12} sub="بانتظار الموافقة" color="#F59E0B" />
        <StatCard label="عقود تنتهي" value={8} sub="خلال 30 يوم" color="#EF4444" />
        <StatCard label="معدل الحضور" value="96%" sub="هذا الشهر" color="#60A5FA" />
      </div>

      {/* Employee Table */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', marginBottom: 22 }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 15 }}>قائمة الموظفين</span>
          <button style={{ padding: '7px 16px', background: `linear-gradient(135deg,${accent},${accent}CC)`, border: 'none', borderRadius: 9, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>+ إضافة موظف</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['الاسم', 'المسمى الوظيفي', 'القسم', 'نوع الدوام', 'الحالة'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', color: MUTED, fontSize: 12, fontWeight: 600, textAlign: 'right', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HR_EMPLOYEES.map((e, i) => (
                <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                  <td style={{ padding: '11px 16px', color: TEXT, fontWeight: 600, fontSize: 13 }}>{e.name}</td>
                  <td style={{ padding: '11px 16px', color: MUTED, fontSize: 13 }}>{e.role}</td>
                  <td style={{ padding: '11px 16px', color: MUTED, fontSize: 12 }}>{e.dept}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <Badge label={e.type} color={e.type === 'دوام كامل' ? '#60A5FA' : '#A78BFA'} />
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <Badge label={e.status} color={e.status === 'نشط' ? '#10B981' : '#F59E0B'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Distribution */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 16 }}>توزيع الكوادر البشرية</div>
          {HR_DISTRIBUTION.map((d, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ color: TEXT, fontSize: 13 }}>{d.label}</span>
                <span style={{ color: d.color, fontWeight: 700, fontSize: 13 }}>{d.count}</span>
              </div>
              <div style={{ height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${Math.round(d.count / 216 * 100)}%`, height: '100%', background: d.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 14 }}>إجراءات سريعة</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {HR_QUICK.map((q, i) => (
              <button key={i} style={{ padding: '9px 10px', background: `${accent}0A`, border: `1px solid ${accent}22`, borderRadius: 10, cursor: 'pointer', color: accent, fontSize: 12, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'center' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}18`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}0A`; }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinanceTab({ accent }: { accent: string }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard label="إيرادات الفصل" value="4.2M" sub="ريال سعودي" color={accent} />
        <StatCard label="المصروفات" value="2.8M" sub="هذا الشهر" color="#EF4444" />
        <StatCard label="الرسوم المعلقة" value={247} sub="طالب" color="#F59E0B" />
        <StatCard label="صافي الفائض" value="1.4M" sub="هذا الفصل" color="#10B981" />
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 15 }}>آخر المعاملات المالية</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['البيان', 'المبلغ (ر.س)', 'النوع', 'التاريخ'].map(h => (
                <th key={h} style={{ padding: '11px 16px', color: MUTED, fontSize: 12, fontWeight: 600, textAlign: 'right', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIN_TRANSACTIONS.map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                <td style={{ padding: '11px 16px', color: TEXT, fontSize: 13, fontWeight: 600 }}>{t.desc}</td>
                <td style={{ padding: '11px 16px', color: TEXT, fontSize: 13 }}>{t.amount}</td>
                <td style={{ padding: '11px 16px' }}><Badge label={t.type} color={t.type === 'وارد' ? '#10B981' : '#EF4444'} /></td>
                <td style={{ padding: '11px 16px', color: MUTED, fontSize: 12 }}>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdmissionsTab({ accent }: { accent: string }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard label="طلبات جديدة" value={318} sub="هذا الموسم" color={accent} />
        <StatCard label="مقبولون" value={204} sub="حتى الآن" color="#10B981" />
        <StatCard label="قيد المراجعة" value={89} sub="طلب" color="#F59E0B" />
        <StatCard label="مرفوضون" value={25} sub="طلب" color="#EF4444" />
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 15 }}>طلبات القبول الأخيرة</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['المتقدم', 'البرنامج', 'درجة القبول', 'الحالة'].map(h => (
                <th key={h} style={{ padding: '11px 16px', color: MUTED, fontSize: 12, fontWeight: 600, textAlign: 'right', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADM_APPS.map((a, i) => (
              <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                <td style={{ padding: '11px 16px', color: TEXT, fontSize: 13, fontWeight: 600 }}>{a.name}</td>
                <td style={{ padding: '11px 16px', color: MUTED, fontSize: 13 }}>{a.prog}</td>
                <td style={{ padding: '11px 16px', color: accent, fontWeight: 700, fontSize: 13 }}>{a.score}%</td>
                <td style={{ padding: '11px 16px' }}><Badge label={a.status} color={a.status === 'مقبول' ? '#10B981' : a.status === 'رفض' ? '#EF4444' : '#F59E0B'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ITTab({ accent }: { accent: string }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard label="تذاكر مفتوحة" value={14} sub="تحتاج معالجة" color="#EF4444" />
        <StatCard label="جاري المعالجة" value={7} sub="تذكرة" color={accent} />
        <StatCard label="أجهزة نشطة" value={1240} sub="متصلة بالشبكة" color="#10B981" />
        <StatCard label="وقت التشغيل" value="99.2%" sub="هذا الشهر" color="#60A5FA" />
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 15 }}>تذاكر الدعم الفني</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['المشكلة', 'الأولوية', 'الحالة', 'المسؤول'].map(h => (
                <th key={h} style={{ padding: '11px 16px', color: MUTED, fontSize: 12, fontWeight: 600, textAlign: 'right', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {IT_TICKETS.map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                <td style={{ padding: '11px 16px', color: TEXT, fontSize: 13, fontWeight: 600 }}>{t.title}</td>
                <td style={{ padding: '11px 16px' }}><Badge label={t.priority} color={t.priority === 'حرج' ? '#EF4444' : t.priority === 'عالي' ? '#F59E0B' : t.priority === 'متوسط' ? '#60A5FA' : '#10B981'} /></td>
                <td style={{ padding: '11px 16px' }}><Badge label={t.status} color={t.status === 'مفتوح' ? '#EF4444' : t.status === 'جاري' ? '#F59E0B' : t.status === 'مجدول' ? accent : '#6B7280'} /></td>
                <td style={{ padding: '11px 16px', color: MUTED, fontSize: 12 }}>{t.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentsTab({ accent }: { accent: string }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard label="إجمالي الطلاب" value={4820} sub="مسجلون هذا الفصل" color={accent} />
        <StatCard label="طلبات معلقة" value={63} sub="بانتظار المعالجة" color="#F59E0B" />
        <StatCard label="شكاوى مفتوحة" value={11} sub="قيد الدراسة" color="#EF4444" />
        <StatCard label="منح نشطة" value={142} sub="طالب مستفيد" color="#10B981" />
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 15 }}>آخر الطلبات الواردة</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['الطالب', 'نوع الطلب', 'التاريخ', 'الحالة'].map(h => (
                <th key={h} style={{ padding: '11px 16px', color: MUTED, fontSize: 12, fontWeight: 600, textAlign: 'right', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STU_REQUESTS.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                <td style={{ padding: '11px 16px', color: TEXT, fontSize: 13, fontWeight: 600 }}>{r.student}</td>
                <td style={{ padding: '11px 16px', color: MUTED, fontSize: 13 }}>{r.type}</td>
                <td style={{ padding: '11px 16px', color: MUTED, fontSize: 12 }}>{r.date}</td>
                <td style={{ padding: '11px 16px' }}><Badge label={r.status} color={r.status === 'موافق' ? '#10B981' : r.status === 'رفض' ? '#EF4444' : r.status === 'معالجة' ? accent : '#F59E0B'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecretaryTab({ accent }: { accent: string }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard label="مهام اليوم" value={4} sub="مهمة مجدولة" color={accent} />
        <StatCard label="مراسلات واردة" value={28} sub="هذا الأسبوع" color="#60A5FA" />
        <StatCard label="اجتماعات قادمة" value={3} sub="هذا الأسبوع" color="#A78BFA" />
        <StatCard label="محاضر معلقة" value={2} sub="بانتظار التوقيع" color="#F59E0B" />
      </div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 16 }}>قائمة المهام والاجتماعات</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SEC_TASKS.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: t.done ? 'rgba(255,255,255,0.02)' : `${accent}08`, border: `1px solid ${t.done ? BORDER : accent + '22'}`, borderRadius: 12 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${t.done ? '#10B981' : accent}`, background: t.done ? 'rgba(16,185,129,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {t.done && <span style={{ color: '#10B981', fontSize: 10, fontWeight: 800 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: t.done ? MUTED : TEXT, fontWeight: 600, fontSize: 13, textDecoration: t.done ? 'line-through' : 'none' }}>{t.task}</div>
                <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>{t.date} — {t.time}</div>
              </div>
              <Badge label={t.done ? 'منجز' : 'معلق'} color={t.done ? '#10B981' : accent} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('لوحة التحكم');
  const [activeRole, setActiveRole] = useState<RoleKey>('hr');

  const currentAccent = ROLE_TABS.find(r => r.id === activeRole)?.color ?? '#10B981';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 268, minWidth: 268, background: SIDEBAR_BG, borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

        {/* Logo */}
        <div style={{ padding: '22px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: TEXT, letterSpacing: -0.5 }}>
            <span style={{ color: currentAccent }}>متين</span> الإداري
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>نظام إدارة المؤسسة</div>
        </div>

        {/* Admin Card */}
        <div style={{ margin: '14px 14px 8px', background: `linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.05))`, border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 18, fontWeight: 800, color: '#10B981' }}>خ</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.4 }}>خالد المطيري</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>رئيس قسم الموارد البشرية</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 10, background: 'rgba(16,185,129,0.12)', color: '#10B981', borderRadius: 20, padding: '2px 8px', fontWeight: 700 }}>إداري</span>
            <span style={{ fontSize: 10, background: 'rgba(16,185,129,0.08)', color: '#10B981', borderRadius: 20, padding: '2px 8px', fontWeight: 700 }}>نشط</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 10px 20px' }}>
          {SIDEBAR_SECTIONS.map((sec) => (
            <div key={sec.title} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(238,238,245,0.3)', padding: '10px 10px 4px', letterSpacing: 0.5 }}>{sec.title}</div>
              {sec.items.map((item) => {
                const isActive = activeSection === item;
                return (
                  <button
                    key={item}
                    onClick={() => setActiveSection(item)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 2, background: isActive ? `${currentAccent}18` : 'transparent', color: isActive ? currentAccent : MUTED, fontSize: 13, fontWeight: isActive ? 700 : 500, fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'right' }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 40px' }}>

        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: TEXT, margin: 0 }}>لوحة التحكم الإدارية</h1>
            <p style={{ color: MUTED, fontSize: 13, margin: '4px 0 0' }}>الثلاثاء، 8 أبريل 2026 — الفصل الدراسي الثاني</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, color: MUTED, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>الإشعارات</button>
            <button style={{ padding: '9px 18px', background: `linear-gradient(135deg, ${currentAccent}, ${currentAccent}CC)`, border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, transition: 'all 0.3s' }}>الإعدادات</button>
          </div>
        </div>

        {/* ── Role Tabs ── */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
          {ROLE_TABS.map(tab => {
            const isActive = activeRole === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRole(tab.id)}
                style={{ padding: '9px 18px', borderRadius: 10, border: `1px solid ${isActive ? tab.color : BORDER}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, background: isActive ? `${tab.color}18` : 'transparent', color: isActive ? tab.color : MUTED, transition: 'all 0.2s' }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        {activeRole === 'hr'         && <HRTab accent={currentAccent} />}
        {activeRole === 'finance'    && <FinanceTab accent={currentAccent} />}
        {activeRole === 'admissions' && <AdmissionsTab accent={currentAccent} />}
        {activeRole === 'it'         && <ITTab accent={currentAccent} />}
        {activeRole === 'students'   && <StudentsTab accent={currentAccent} />}
        {activeRole === 'secretary'  && <SecretaryTab accent={currentAccent} />}

      </main>
    </div>
  );
}
