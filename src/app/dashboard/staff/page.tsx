'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BG = '#06060E';
const SB = '#14070A';
const C = '#F97316';
const GD = '#D4A843';
const TXT = '#EEEEF5';
const DIM = 'rgba(238,238,245,0.5)';
const MUT = 'rgba(238,238,245,0.3)';
const BD = 'rgba(255,255,255,0.08)';
const CD = 'rgba(255,255,255,0.03)';
const FONT = "'IBM Plex Sans Arabic', sans-serif";

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, empRes] = await Promise.all([
          fetch('/api/auth/me', { credentials: 'include' }),
          fetch('/api/employees', { credentials: 'include' }),
        ]);
        if (meRes.ok) { const d = await meRes.json(); setUser(d.user || d); }
        if (empRes.ok) { const d = await empRes.json(); setEmployees(Array.isArray(d) ? d : d.employees || []); }
      } catch (e) {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, color: C, fontFamily: FONT, direction: 'rtl' }}>جاري التحميل...</div>;

  const hrName = user?.name || 'مسؤول الموارد البشرية';

  const jobTitles = [
    'معلم/معلمة', 'وكيل/وكيلة', 'مرشد/مرشدة طلابية', 'مشرف/مشرفة', 'محاسب/محاسبة',
    'سائق', 'حارس أمن', 'عامل/عاملة نظافة', 'سكرتير/سكرتيرة', 'مربية أطفال',
    'أخصائي نفسي', 'معلم تربية بدنية', 'مشرف نقل', 'فني صيانة', 'أمين مكتبة',
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: FONT, direction: 'rtl', background: BG, color: TXT }}>
      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? 260 : 0, background: SB, borderLeft: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.3s', flexShrink: 0 }}>
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C}, #EA580C)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>م</div>
          <div><div style={{ fontSize: 15, fontWeight: 800 }}>متين</div><div style={{ fontSize: 9, color: MUT }}>الموارد البشرية</div></div>
        </div>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C}22`, border: `1px solid ${C}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
            <div><div style={{ fontSize: 13, fontWeight: 700 }}>{hrName}</div><div style={{ fontSize: 10, color: C }}>مسؤول الموارد البشرية</div></div>
          </div>
        </div>
        {/* Branch selector */}
        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${BD}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUT, marginBottom: 8 }}>الفرع</div>
          {[
            { id: 'all', label: 'جميع الفروع', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg> },
            { id: 'main', label: 'المدرسة الرئيسية', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg> },
            { id: 'kg', label: 'الروضة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
            { id: 'nursery', label: 'الحضانة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
          ].map(b => (
            <button key={b.id} onClick={() => setSelectedBranch(b.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 600, background: selectedBranch === b.id ? `${C}18` : 'transparent', color: selectedBranch === b.id ? C : DIM, marginBottom: 2, textAlign: 'right' }}>
              <span>{b.icon}</span> {b.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px' }}>
          {[
            { id: 'home', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, label: 'نظرة عامة' },
            { id: 'employees', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, label: 'قائمة الموظفين' },
            { id: 'add', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14 M5 12h14"/></svg>, label: 'إضافة موظف' },
            { id: 'contracts', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>, label: 'العقود' },
            { id: 'salaries', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: 'الرواتب' },
            { id: 'leaves', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, label: 'الإجازات' },
            { id: 'attendance', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, label: 'حضور الموظفين' },
            { id: 'reports', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, label: 'التقارير' },
          ].map(nav => (
            <button key={nav.id} onClick={() => setActiveSection(nav.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 600, background: activeSection === nav.id ? `${C}18` : 'transparent', color: activeSection === nav.id ? C : DIM, marginBottom: 2, textAlign: 'right' }}>
              <span style={{ fontSize: 14 }}>{nav.icon}</span> {nav.label}
            </button>
          ))}
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: 56, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BD}`, background: 'rgba(6,6,14,0.8)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: DIM, fontSize: 18 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3"/></svg></button>
            <h1 style={{ fontSize: 16, fontWeight: 700 }}>الموارد البشرية</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => { setActiveSection('add'); setShowAddModal(true); }} style={{ background: C, border: 'none', borderRadius: 9, padding: '7px 16px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>+ إضافة موظف</button>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {/* HOME */}
          {activeSection === 'home' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'إجمالي الموظفين', value: employees.length || 86, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, color: '#60A5FA' },
                  { label: 'عقود نشطة', value: 72, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>, color: '#4ADE80' },
                  { label: 'إجازات هذا الشهر', value: 5, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, color: C },
                  { label: 'مسمّى وظيفي', value: jobTitles.length, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>, color: '#A78BFA' },
                ].map((s, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: DIM }}>{s.label}</span>
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* Job Titles */}
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg> المسميات الوظيفية</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {jobTitles.map((jt, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BD}`, borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: C }} />
                      <span style={{ fontSize: 12, color: DIM }}>{jt}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recent Employees */}
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> آخر الموظفين المضافين</h3>
                {(employees.length > 0 ? employees.slice(0, 5) : [
                  { name: 'أ. سارة العتيبي', role: 'معلمة رياضيات', branch: 'المدرسة', date: '2026-03-20' },
                  { name: 'أ. فهد الحربي', role: 'معلم علوم', branch: 'المدرسة', date: '2026-03-15' },
                  { name: 'منى القحطاني', role: 'مربية أطفال', branch: 'الحضانة', date: '2026-03-10' },
                ]).map((emp: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BD}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${C}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</div>
                        <div style={{ fontSize: 10, color: MUT }}>{emp.role || emp.position || 'موظف'} · {emp.branch || ''}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: MUT }}>{emp.date ? new Date(emp.date).toLocaleDateString('ar-SA') : ''}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* EMPLOYEES LIST */}
          {activeSection === 'employees' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> قائمة الموظفين</h3>
                <button onClick={() => setActiveSection('add')} style={{ background: C, border: 'none', borderRadius: 8, padding: '7px 16px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>+ إضافة</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 80px', gap: 8, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8, fontSize: 11, fontWeight: 700, color: MUT }}>
                <span>#</span><span>الاسم</span><span>المسمى</span><span>الفرع</span><span>الحالة</span><span></span>
              </div>
              {(employees.length > 0 ? employees : [
                { name: 'أ. سارة العتيبي', role: 'معلمة', branch: 'المدرسة', status: 'نشط' },
                { name: 'أ. فهد الحربي', role: 'معلم', branch: 'المدرسة', status: 'نشط' },
                { name: 'منى القحطاني', role: 'مربية', branch: 'الحضانة', status: 'نشط' },
                { name: 'خالد السالم', role: 'سائق', branch: 'النقل', status: 'نشط' },
                { name: 'نورة الزهراني', role: 'محاسبة', branch: 'الإدارة', status: 'إجازة' },
              ]).map((emp: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 80px', gap: 8, padding: '10px 12px', borderBottom: `1px solid ${BD}`, fontSize: 12, alignItems: 'center' }}>
                  <span style={{ color: MUT }}>{i+1}</span>
                  <span style={{ fontWeight: 600 }}>{emp.name}</span>
                  <span style={{ color: DIM }}>{emp.role || emp.position}</span>
                  <span style={{ color: DIM }}>{emp.branch || ''}</span>
                  <span style={{ background: (emp.status || 'نشط') === 'نشط' ? '#4ADE8018' : '#FB923C18', color: (emp.status || 'نشط') === 'نشط' ? '#4ADE80' : '#FB923C', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, textAlign: 'center' }}>{emp.status || 'نشط'}</span>
                  <button style={{ background: `${C}18`, border: `1px solid ${C}33`, borderRadius: 6, padding: '3px 8px', color: C, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>تعديل</button>
                </div>
              ))}
            </div>
          )}

          {/* ADD EMPLOYEE */}
          {activeSection === 'add' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14 M5 12h14"/></svg> إضافة موظف جديد</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>الاسم الكامل</label>
                    <input placeholder="اسم الموظف" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 9, padding: '10px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>رقم الهوية</label>
                    <input placeholder="10XXXXXXXX" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 9, padding: '10px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>المسمى الوظيفي</label>
                    <select style={{ width: '100%', background: '#0B0B16', border: `1px solid ${BD}`, borderRadius: 9, padding: '10px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                      <option style={{ background: '#0B0B16', color: TXT }}>-- اختر المسمى --</option>
                      {jobTitles.map((jt, i) => <option key={i} style={{ background: '#0B0B16', color: TXT }}>{jt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>الفرع</label>
                    <select style={{ width: '100%', background: '#0B0B16', border: `1px solid ${BD}`, borderRadius: 9, padding: '10px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                      <option style={{ background: '#0B0B16', color: TXT }}>المدرسة الرئيسية</option>
                      <option style={{ background: '#0B0B16', color: TXT }}>الروضة</option>
                      <option style={{ background: '#0B0B16', color: TXT }}>الحضانة</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>الجوال</label>
                    <input placeholder="05XXXXXXXX" type="tel" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 9, padding: '10px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>البريد الإلكتروني</label>
                    <input placeholder="email@example.com" type="email" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 9, padding: '10px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>تاريخ بداية العقد</label>
                    <input type="date" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 9, padding: '10px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>تاريخ نهاية العقد</label>
                    <input type="date" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 9, padding: '10px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: DIM, display: 'block', marginBottom: 4 }}>الراتب الشهري (SAR)</label>
                  <input placeholder="مثال: 8000" type="number" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 9, padding: '10px 12px', color: TXT, fontSize: 13, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button style={{ background: C, border: 'none', borderRadius: 10, padding: '12px 24px', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: FONT, width: '100%' }}>
                  إضافة الموظف ←
                </button>
              </div>
            </div>
          )}

          {/* CONTRACTS */}
          {activeSection === 'contracts' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg> العقود</h3>
              {[
                { emp: 'أ. سارة العتيبي', type: 'سنوي', start: '2025-09-01', end: '2026-08-31', status: 'نشط' },
                { emp: 'أ. فهد الحربي', type: 'سنوي', start: '2025-09-01', end: '2026-08-31', status: 'نشط' },
                { emp: 'خالد السالم', type: 'مؤقت', start: '2026-01-01', end: '2026-06-30', status: 'قارب على الانتهاء' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${BD}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.emp}</div>
                    <div style={{ fontSize: 10, color: MUT }}>{c.type} · {c.start} → {c.end}</div>
                  </div>
                  <span style={{ background: c.status === 'نشط' ? '#4ADE8018' : '#FB923C18', color: c.status === 'نشط' ? '#4ADE80' : '#FB923C', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>{c.status}</span>
                </div>
              ))}
              <button onClick={() => router.push('/dashboard/contracts')} style={{ background: `${C}18`, border: `1px solid ${C}33`, borderRadius: 8, padding: '8px 16px', color: C, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, marginTop: 12 }}>عرض كل العقود</button>
            </div>
          )}

          {/* SALARIES */}
          {activeSection === 'salaries' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> الرواتب</h3>
              <button onClick={() => router.push('/dashboard/salaries')} style={{ background: C, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>فتح صفحة الرواتب</button>
            </div>
          )}

          {/* LEAVES */}
          {activeSection === 'leaves' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> طلبات الإجازات</h3>
              <button onClick={() => router.push('/dashboard/leaves')} style={{ background: C, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>فتح صفحة الإجازات</button>
            </div>
          )}

          {/* ATTENDANCE */}
          {activeSection === 'attendance' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> حضور الموظفين</h3>
              <button onClick={() => router.push('/dashboard/attendance')} style={{ background: C, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>فتح صفحة الحضور</button>
            </div>
          )}

          {/* REPORTS */}
          {activeSection === 'reports' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> تقارير الموارد البشرية</h3>
              <button onClick={() => router.push('/dashboard/reports')} style={{ background: C, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>فتح التقارير</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
