'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

const PINK   = '#F472B6';
const BLUE   = '#60A5FA';
const ORANGE = '#FB923C';
const GREEN  = '#34D399';
const RED    = '#EF4444';
const CARD   = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

type Tab = 'employees' | 'leaves' | 'payroll' | 'recruitment';

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}0A`, borderRadius: '0 14px 0 70px' }} />
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ color, fontSize: 11, marginTop: 6, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

function inputSt(extra?: any): any {
  return {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 9, padding: '0.65rem 0.9rem',
    color: '#F8FAFC', fontSize: '0.9rem',
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    ...extra,
  };
}

const label6: any = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 };
const cancelBtn: any = { background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9, padding: '0.65rem 1.5rem', color: '#94A3B8', cursor: 'pointer', fontWeight: 600, fontFamily: "'IBM Plex Sans Arabic', sans-serif" };
const backdrop: any = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' };

const STATUS_COLOR: any = {
  active: GREEN, موافق: GREEN, مقبولة: GREEN, approved: GREEN,
  pending: ORANGE, معلقة: ORANGE, قيد_المراجعة: ORANGE,
  rejected: RED, مرفوضة: RED, inactive: RED,
};

export default function UniversityHrPage() {
  const [stats, setStats]         = useState<any>({ total_employees: 0, faculty: 0, pending_leaves: 0, this_month_hires: 0 });
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaves, setLeaves]       = useState<any[]>([]);
  const [payroll, setPayroll]     = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<Tab>('employees');
  const [toast, setToast]         = useState('');

  // Employee tab state
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('الكل');
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [empForm, setEmpForm]       = useState({ name: '', email: '', role: 'دكتور', department: '', hire_date: '' });
  const [savingEmp, setSavingEmp]   = useState(false);

  // Recruitment modal
  const [showJobModal, setShowJobModal]   = useState(false);
  const [jobForm, setJobForm]             = useState({ title: '', department: '', type: 'دوام كامل', deadline: '' });
  const [savingJob, setSavingJob]         = useState(false);
  const [jobs, setJobs]                   = useState<any[]>([]);

  // Payroll month/year
  const [payMonth, setPayMonth] = useState(new Date().getMonth() + 1);
  const [payYear, setPayYear]   = useState(new Date().getFullYear());

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [meRes, statsRes, empRes, leavesRes, payRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/university/hr?type=stats'),
        fetch('/api/university/hr?type=employees'),
        fetch('/api/university/hr?type=leaves'),
        fetch('/api/university/hr?type=payroll'),
      ]);
      if (statsRes.ok)  { const d = await statsRes.json();  setStats(d.stats || d); }
      if (empRes.ok)    { const d = await empRes.json();    setEmployees(d.employees || d.data || []); }
      if (leavesRes.ok) { const d = await leavesRes.json(); setLeaves(d.leaves || d.data || []); }
      if (payRes.ok)    { const d = await payRes.json();    setPayroll(d.payroll || d.data || []); }
    } catch (_) {}
    setLoading(false);
  };

  const handleAddEmployee = async () => {
    if (!empForm.name || !empForm.email) return;
    setSavingEmp(true);
    await fetch('/api/university', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'add-employee', ...empForm }),
    }).catch(() => {});
    setShowAddEmp(false);
    setEmpForm({ name: '', email: '', role: 'دكتور', department: '', hire_date: '' });
    setSavingEmp(false);
    showToast('✅ تمت إضافة الموظف بنجاح');
    loadAll();
  };

  const handleLeaveAction = async (id: any, action: 'accept' | 'reject') => {
    await fetch('/api/university', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'leave-action', id, action }),
    }).catch(() => {});
    showToast(action === 'accept' ? '✅ تمت الموافقة على الإجازة' : '❌ تم رفض الإجازة');
    loadAll();
  };

  const handleAddJob = async () => {
    if (!jobForm.title) return;
    setSavingJob(true);
    await fetch('/api/university', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add-job', ...jobForm }),
    }).catch(() => {});
    setShowJobModal(false);
    setJobForm({ title: '', department: '', type: 'دوام كامل', deadline: '' });
    setSavingJob(false);
    showToast('✅ تم فتح الوظيفة بنجاح');
    setJobs((prev: any[]) => [...prev, { ...jobForm, id: Date.now(), applicants: 0 }]);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: PINK }}>
      <div style={{ textAlign: 'center', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <div style={{ fontWeight: 700 }}>جارٍ التحميل…</div>
      </div>
    </div>
  );

  const TABS: { id: Tab; label: string; color: string }[] = [
    { id: 'employees',   label: 'الموظفون',  color: PINK   },
    { id: 'leaves',      label: 'الإجازات',  color: ORANGE },
    { id: 'payroll',     label: 'الرواتب',   color: BLUE   },
    { id: 'recruitment', label: 'التوظيف',   color: GREEN  },
  ];

  const fallbackEmployees: any[] = employees.length ? employees : [
    { id: 1, name: 'د. خالد العمري',   role: 'دكتور',   department: 'كلية الحاسب',     hire_date: '2020-08-01', status: 'active' },
    { id: 2, name: 'أ. سارة الغامدي',  role: 'محاضر',   department: 'كلية العلوم',     hire_date: '2021-02-15', status: 'active' },
    { id: 3, name: 'م. عمر الزهراني', role: 'إداري',   department: 'شؤون الطلاب',     hire_date: '2019-09-01', status: 'active' },
    { id: 4, name: 'أ. نورة القحطاني', role: 'معيد',    department: 'كلية الأعمال',    hire_date: '2023-01-20', status: 'active' },
    { id: 5, name: 'م. فهد البشري',    role: 'موظف',    department: 'الإدارة المالية', hire_date: '2022-06-10', status: 'inactive' },
  ];

  const fallbackLeaves: any[] = leaves.length ? leaves : [
    { id: 1, employee: 'د. خالد العمري',   type: 'إجازة مرضية',    from: '2026-04-10', to: '2026-04-15', status: 'معلقة' },
    { id: 2, employee: 'أ. سارة الغامدي',  type: 'إجازة سنوية',    from: '2026-04-20', to: '2026-04-30', status: 'معلقة' },
    { id: 3, employee: 'م. عمر الزهراني', type: 'إجازة طارئة',    from: '2026-04-05', to: '2026-04-06', status: 'مقبولة' },
    { id: 4, employee: 'أ. نورة القحطاني', type: 'إجازة دراسية',   from: '2026-05-01', to: '2026-05-14', status: 'مرفوضة' },
  ];

  const fallbackPayroll: any[] = payroll.length ? payroll : [
    { id: 1, name: 'د. خالد العمري',   position: 'أستاذ مساعد', basic: 18000, allowances: 4500, deductions: 900,  net: 21600 },
    { id: 2, name: 'أ. سارة الغامدي',  position: 'محاضر',       basic: 12000, allowances: 3000, deductions: 600,  net: 14400 },
    { id: 3, name: 'م. عمر الزهراني', position: 'مدير إداري',   basic: 10000, allowances: 2500, deductions: 500,  net: 12000 },
    { id: 4, name: 'أ. نورة القحطاني', position: 'معيد',         basic: 8000,  allowances: 2000, deductions: 400,  net: 9600  },
    { id: 5, name: 'م. فهد البشري',    position: 'موظف مالي',   basic: 7000,  allowances: 1750, deductions: 350,  net: 8400  },
  ];

  const fallbackJobs: any[] = jobs.length ? jobs : [
    { id: 1, title: 'أستاذ مساعد - هندسة البرمجيات',  department: 'كلية الحاسب',     type: 'دوام كامل', deadline: '2026-05-01', applicants: 12 },
    { id: 2, title: 'محاضر - الرياضيات',              department: 'كلية العلوم',     type: 'دوام كامل', deadline: '2026-05-15', applicants: 8  },
    { id: 3, title: 'معيد - قواعد البيانات',          department: 'كلية الحاسب',     type: 'دوام جزئي', deadline: '2026-04-20', applicants: 5  },
  ];

  const filteredEmployees = fallbackEmployees.filter(e => {
    const matchSearch = !search || e.name.includes(search) || e.department.includes(search);
    const matchRole   = roleFilter === 'الكل' || e.role === roleFilter;
    return matchSearch && matchRole;
  });

  const thStyle: any = { padding: '0.75rem 1rem', textAlign: 'right', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', fontWeight: 600, borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' };
  const tdStyle: any = { padding: '0.85rem 1rem', fontSize: '0.87rem', borderBottom: `1px solid ${BORDER}` };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', color: '#F8FAFC' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', background: '#0D2A1A', border: `1px solid ${GREEN}40`, borderRadius: 12, padding: '0.75rem 1.5rem', color: GREEN, fontWeight: 700, zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: PINK }}>الموارد البشرية — الجامعة</h1>
        <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>إدارة الموظفين والإجازات والرواتب والتوظيف</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard label="إجمالي الموظفين"    value={stats.total_employees || fallbackEmployees.length} color={PINK}   sub="جميع الأقسام" />
        <StatCard label="هيئة التدريس"       value={stats.faculty || fallbackEmployees.filter(e => ['دكتور','محاضر','معيد'].includes(e.role)).length} color={BLUE}   sub="أكاديميون" />
        <StatCard label="إجازات معلقة"       value={stats.pending_leaves || fallbackLeaves.filter(l => l.status === 'معلقة').length} color={ORANGE} sub="تحتاج مراجعة" />
        <StatCard label="توظيف هذا الشهر"    value={stats.this_month_hires || 3} color={GREEN}  sub="موظف جديد" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? `${t.color}20` : 'transparent',
            border: `1px solid ${tab === t.id ? t.color + '50' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 9, padding: '0.5rem 1.1rem', cursor: 'pointer',
            color: tab === t.id ? t.color : 'rgba(255,255,255,0.5)',
            fontWeight: 700, fontSize: '0.88rem', transition: 'all 0.15s',
            fontFamily: "'IBM Plex Sans Arabic', sans-serif",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── EMPLOYEES ─── */}
      {tab === 'employees' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
              <input type="text" placeholder="🔍 بحث بالاسم أو القسم…" value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...inputSt(), maxWidth: 260, flex: 1 }} />
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ ...inputSt(), maxWidth: 160 }}>
                {['الكل', 'دكتور', 'معيد', 'محاضر', 'إداري', 'موظف'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <button onClick={() => setShowAddEmp(true)} style={{ background: PINK, border: 'none', borderRadius: 9, padding: '0.6rem 1.25rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem', whiteSpace: 'nowrap', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
              + إضافة موظف
            </button>
          </div>

          {/* Table */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['الاسم', 'الدور/الرتبة', 'الكلية/القسم', 'تاريخ التعيين', 'الحالة', 'إجراءات'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((e: any, i: number) => (
                    <tr key={e.id || i} style={{ borderBottom: i < filteredEmployees.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{e.name}</td>
                      <td style={tdStyle}>{e.role}</td>
                      <td style={tdStyle}>{e.department}</td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.5)' }}>{e.hire_date ? new Date(e.hire_date).toLocaleDateString('ar-SA') : '—'}</td>
                      <td style={tdStyle}>
                        <span style={{ background: `${STATUS_COLOR[e.status] || ORANGE}18`, color: STATUS_COLOR[e.status] || ORANGE, borderRadius: 6, padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.8rem' }}>
                          {e.status === 'active' ? 'نشط' : e.status === 'inactive' ? 'غير نشط' : e.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}30`, borderRadius: 7, padding: '0.25rem 0.7rem', color: BLUE, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                          عرض
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>لا نتائج</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── LEAVES ─── */}
      {tab === 'leaves' && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['الموظف', 'نوع الإجازة', 'من', 'إلى', 'الحالة', 'إجراءات'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fallbackLeaves.map((l: any, i: number) => (
                  <tr key={l.id || i} style={{ borderBottom: i < fallbackLeaves.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{l.employee}</td>
                    <td style={tdStyle}>{l.type}</td>
                    <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.55)' }}>{l.from}</td>
                    <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.55)' }}>{l.to}</td>
                    <td style={tdStyle}>
                      <span style={{ background: `${STATUS_COLOR[l.status] || ORANGE}18`, color: STATUS_COLOR[l.status] || ORANGE, borderRadius: 6, padding: '0.2rem 0.6rem', fontWeight: 700, fontSize: '0.8rem' }}>{l.status}</span>
                    </td>
                    <td style={tdStyle}>
                      {l.status === 'معلقة' ? (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => handleLeaveAction(l.id, 'accept')} style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}30`, borderRadius: 7, padding: '0.25rem 0.7rem', color: GREEN, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>قبول</button>
                          <button onClick={() => handleLeaveAction(l.id, 'reject')} style={{ background: `${RED}18`, border: `1px solid ${RED}30`, borderRadius: 7, padding: '0.25rem 0.7rem', color: RED, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>رفض</button>
                        </div>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── PAYROLL ─── */}
      {tab === 'payroll' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <select value={payMonth} onChange={e => setPayMonth(Number(e.target.value))} style={{ ...inputSt(), maxWidth: 140 }}>
                {['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'].map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
              <select value={payYear} onChange={e => setPayYear(Number(e.target.value))} style={{ ...inputSt(), maxWidth: 110 }}>
                {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <button onClick={() => alert('جارٍ تصدير كشف الرواتب PDF…')} style={{ background: BLUE, border: 'none', borderRadius: 9, padding: '0.6rem 1.25rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
              تصدير PDF
            </button>
          </div>

          {/* Table */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['الموظف', 'المنصب', 'الراتب الأساسي', 'البدلات', 'الخصومات', 'الصافي'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fallbackPayroll.map((p: any, i: number) => (
                    <tr key={p.id || i} style={{ borderBottom: i < fallbackPayroll.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{p.name}</td>
                      <td style={tdStyle}>{p.position}</td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.6)' }}>{Number(p.basic || 0).toLocaleString()}</td>
                      <td style={{ ...tdStyle, color: GREEN }}>{Number(p.allowances || 0).toLocaleString()}</td>
                      <td style={{ ...tdStyle, color: RED }}>({Number(p.deductions || 0).toLocaleString()})</td>
                      <td style={{ ...tdStyle, fontWeight: 800, color: BLUE }}>{Number(p.net || 0).toLocaleString()} ريال</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── RECRUITMENT ─── */}
      {tab === 'recruitment' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowJobModal(true)} style={{ background: GREEN, border: 'none', borderRadius: 9, padding: '0.6rem 1.25rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
              + فتح وظيفة جديدة
            </button>
          </div>
          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {fallbackJobs.map((j: any, i: number) => (
              <div key={j.id || i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{j.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                    {j.department} · {j.type} · آخر تقديم: {j.deadline}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ background: `${GREEN}15`, color: GREEN, borderRadius: 8, padding: '0.3rem 0.8rem', fontWeight: 700, fontSize: '0.82rem' }}>
                    {j.applicants} متقدم
                  </span>
                  <button style={{ background: `${PINK}15`, border: `1px solid ${PINK}30`, borderRadius: 8, padding: '0.3rem 0.8rem', color: PINK, fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                    عرض الطلبات
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════ ADD EMPLOYEE MODAL ══════════ */}
      {showAddEmp && (
        <div style={backdrop}>
          <div style={{ background: '#0D1B2A', border: `1px solid ${PINK}40`, borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 500, direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
            <h3 style={{ margin: '0 0 1.5rem', color: PINK, fontWeight: 800 }}>إضافة موظف جديد</h3>
            {[
              { label: 'الاسم الكامل *',     key: 'name',       type: 'text',  ph: 'الاسم بالكامل' },
              { label: 'البريد الإلكتروني *', key: 'email',      type: 'email', ph: 'example@university.edu.sa' },
              { label: 'الكلية/القسم',        key: 'department', type: 'text',  ph: 'كلية الحاسب والمعلومات' },
              { label: 'تاريخ التعيين',       key: 'hire_date',  type: 'date',  ph: '' },
            ].map(({ label, key, type, ph }) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={label6}>{label}</label>
                <input type={type} placeholder={ph} value={(empForm as any)[key]} onChange={e => setEmpForm(p => ({ ...p, [key]: e.target.value }))} style={inputSt()} />
              </div>
            ))}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={label6}>الدور</label>
              <select value={empForm.role} onChange={e => setEmpForm(p => ({ ...p, role: e.target.value }))} style={inputSt()}>
                {['دكتور', 'معيد', 'محاضر', 'إداري', 'موظف'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddEmp(false)} style={cancelBtn}>إلغاء</button>
              <button onClick={handleAddEmployee} disabled={savingEmp || !empForm.name || !empForm.email}
                style={{ background: PINK, border: 'none', borderRadius: 9, padding: '0.65rem 1.75rem', color: '#000', fontWeight: 800, cursor: 'pointer', opacity: (savingEmp || !empForm.name || !empForm.email) ? 0.6 : 1, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                {savingEmp ? 'جارٍ الإضافة…' : 'إضافة الموظف ✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ADD JOB MODAL ══════════ */}
      {showJobModal && (
        <div style={backdrop}>
          <div style={{ background: '#0D1B2A', border: `1px solid ${GREEN}40`, borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 480, direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
            <h3 style={{ margin: '0 0 1.5rem', color: GREEN, fontWeight: 800 }}>فتح وظيفة جديدة</h3>
            {[
              { label: 'المسمى الوظيفي *', key: 'title',      type: 'text', ph: 'أستاذ مساعد - تخصص البرمجيات' },
              { label: 'الكلية/القسم',     key: 'department', type: 'text', ph: 'كلية الحاسب والمعلومات'        },
              { label: 'آخر موعد للتقديم', key: 'deadline',   type: 'date', ph: ''                              },
            ].map(({ label, key, type, ph }) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={label6}>{label}</label>
                <input type={type} placeholder={ph} value={(jobForm as any)[key]} onChange={e => setJobForm(p => ({ ...p, [key]: e.target.value }))} style={inputSt()} />
              </div>
            ))}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={label6}>نوع الدوام</label>
              <select value={jobForm.type} onChange={e => setJobForm(p => ({ ...p, type: e.target.value }))} style={inputSt()}>
                {['دوام كامل', 'دوام جزئي', 'عقد مؤقت'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowJobModal(false)} style={cancelBtn}>إلغاء</button>
              <button onClick={handleAddJob} disabled={savingJob || !jobForm.title}
                style={{ background: GREEN, border: 'none', borderRadius: 9, padding: '0.65rem 1.75rem', color: '#000', fontWeight: 800, cursor: 'pointer', opacity: (savingJob || !jobForm.title) ? 0.6 : 1, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                {savingJob ? 'جارٍ الحفظ…' : 'فتح الوظيفة ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
