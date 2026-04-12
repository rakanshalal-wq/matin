'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

// ─── Toggle Component ────────────────────────────────────────────────────────
const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.87rem' }}>{label}</span>
    <button
      onClick={() => onChange(!checked)}
      style={{ width: 44, height: 24, borderRadius: 12, background: checked ? '#A78BFA' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
    >
      <span style={{ position: 'absolute', top: 2, left: checked ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s', display: 'block' }} />
    </button>
  </div>
);

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ title, value, sub, color }: { title: string; value: any; sub: string; color: string }) => (
  <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}0A`, borderRadius: '0 14px 0 70px' }} />
    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>{title}</div>
    <div style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{value}</div>
    <div style={{ color, fontSize: 11, marginTop: 4, fontWeight: 600 }}>{sub}</div>
  </div>
);

// ─── Default permissions object ───────────────────────────────────────────────
const defaultPermissions = {
  upload_grades: false,
  create_exams: false,
  add_assignments: false,
  record_attendance: false,
  upload_content: false,
  live_stream: false,
  supervise_assistants: false,
  supervise_masters: false,
  supervise_phd: false,
  publish_research: false,
  send_notifications: false,
  access_forum: false,
  view_dept_reports: false,
};

export default function DeanDashboard() {
  const [user] = useState<any>({ name: 'أ.د. فيصل العمري', role: 'عميد كلية الهندسة' });
  const [stats, setStats] = useState<any>({ students: 820, faculty: 62, attendance: 89, graduates: 124 });
  const [faculty, setFaculty] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>('overview');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [permissionsModal, setPermissionsModal] = useState<any>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>(defaultPermissions);

  const fallbackFaculty: any[] = [
    { id: 1, name: 'د. أحمد الزهراني', role: 'دكتور', department: 'هندسة البرمجيات', status: 'active' },
    { id: 2, name: 'م. سلمى الحربي', role: 'معيد', department: 'هندسة الحاسب', status: 'active' },
    { id: 3, name: 'د. خالد العتيبي', role: 'دكتور', department: 'الهندسة الكهربائية', status: 'on_leave' },
    { id: 4, name: 'أ. ريم البقمي', role: 'إداري', department: 'شؤون الطلاب', status: 'active' },
    { id: 5, name: 'د. عمر الشمري', role: 'دكتور', department: 'الهندسة الميكانيكية', status: 'active' },
    { id: 6, name: 'م. ناصر الدوسري', role: 'معيد', department: 'هندسة البرمجيات', status: 'active' },
  ];
  const fallbackLeaves: any[] = [
    { id: 1, name: 'د. خالد العتيبي', type: 'إجازة سنوية', from: '2026-04-01', to: '2026-04-14', status: 'pending' },
    { id: 2, name: 'م. سلمى الحربي', type: 'إجازة مرضية', from: '2026-04-05', to: '2026-04-07', status: 'pending' },
    { id: 3, name: 'أ. ريم البقمي', type: 'إجازة اضطرارية', from: '2026-04-10', to: '2026-04-10', status: 'pending' },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [statsRes, facultyRes, leavesRes] = await Promise.allSettled([
          fetch('/api/university/dean?type=stats'),
          fetch('/api/university/dean?type=faculty'),
          fetch('/api/university/dean?type=leaves'),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const d = await statsRes.value.json();
          setStats(d);
        }

        if (facultyRes.status === 'fulfilled' && facultyRes.value.ok) {
          const d = await facultyRes.value.json();
          setFaculty(Array.isArray(d) ? d : d.data ?? fallbackFaculty);
        } else {
          setFaculty(fallbackFaculty);
        }

        if (leavesRes.status === 'fulfilled' && leavesRes.value.ok) {
          const d = await leavesRes.value.json();
          setLeaves(Array.isArray(d) ? d : d.data ?? fallbackLeaves);
        } else {
          setLeaves(fallbackLeaves);
        }
      } catch {
        setFaculty(fallbackFaculty);
        setLeaves(fallbackLeaves);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openPermissions = (member: any) => {
    setPermissionsModal(member);
    setPermissions({ ...defaultPermissions });
  };

  const closePermissions = () => {
    setPermissionsModal(null);
  };

  const savePermissions = () => {
    // In production: PUT /api/university/dean/permissions { staff_id: permissionsModal.id, permissions }
    closePermissions();
  };

  const setPermission = (key: string) => (val: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: val }));
  };

  const filteredFaculty = faculty.filter((m: any) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'doctors') return m.role === 'دكتور';
    if (selectedFilter === 'assistants') return m.role === 'معيد';
    if (selectedFilter === 'admin') return m.role === 'إداري';
    return true;
  });

  const roleColor: any = { دكتور: '#A78BFA', معيد: '#60A5FA', إداري: '#34D399' };
  const statusLabel: any = { active: 'نشط', on_leave: 'في إجازة', inactive: 'غير نشط' };
  const statusColor: any = { active: '#34D399', on_leave: '#FBBF24', inactive: '#F87171' };

  const tabs = [
    { key: 'overview', label: 'نظرة عامة' },
    { key: 'faculty', label: 'هيئة التدريس' },
    { key: 'students', label: 'الطلاب' },
    { key: 'leaves', label: 'إجازات' },
    { key: 'finance', label: 'المالية' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#06060E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #A78BFA', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>جارٍ تحميل البيانات...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06060E', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl', color: '#fff' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } *, *::before, *::after { box-sizing: border-box; }`}</style>

      {/* ─── Permissions Modal ─── */}
      {permissionsModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closePermissions(); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div style={{ background: '#0E0E1A', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 18, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>إدارة صلاحيات {permissionsModal.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{permissionsModal.role} — {permissionsModal.department}</div>
              </div>
              <button
                onClick={closePermissions}
                style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >×</button>
            </div>

            {/* Section: Academic */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid rgba(167,139,250,0.2)' }}>الصلاحيات الأكاديمية</div>
              <Toggle label="رفع الدرجات" checked={permissions.upload_grades} onChange={setPermission('upload_grades')} />
              <Toggle label="إنشاء الاختبارات" checked={permissions.create_exams} onChange={setPermission('create_exams')} />
              <Toggle label="إضافة واجبات" checked={permissions.add_assignments} onChange={setPermission('add_assignments')} />
              <Toggle label="تسجيل الحضور" checked={permissions.record_attendance} onChange={setPermission('record_attendance')} />
              <Toggle label="رفع المحتوى" checked={permissions.upload_content} onChange={setPermission('upload_content')} />
              <Toggle label="بث مباشر" checked={permissions.live_stream} onChange={setPermission('live_stream')} />
            </div>

            {/* Section: Supervision */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid rgba(167,139,250,0.2)' }}>صلاحيات الإشراف</div>
              <Toggle label="الإشراف على المعيدين" checked={permissions.supervise_assistants} onChange={setPermission('supervise_assistants')} />
              <Toggle label="إشراف رسائل الماجستير" checked={permissions.supervise_masters} onChange={setPermission('supervise_masters')} />
              <Toggle label="إشراف رسائل الدكتوراه" checked={permissions.supervise_phd} onChange={setPermission('supervise_phd')} />
              <Toggle label="نشر الأبحاث" checked={permissions.publish_research} onChange={setPermission('publish_research')} />
            </div>

            {/* Section: Communication */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#A78BFA', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid rgba(167,139,250,0.2)' }}>صلاحيات التواصل</div>
              <Toggle label="إرسال إشعارات" checked={permissions.send_notifications} onChange={setPermission('send_notifications')} />
              <Toggle label="الوصول للملتقى" checked={permissions.access_forum} onChange={setPermission('access_forum')} />
              <Toggle label="عرض تقارير القسم" checked={permissions.view_dept_reports} onChange={setPermission('view_dept_reports')} />
            </div>

            {/* Modal Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-start' }}>
              <button
                onClick={savePermissions}
                style={{ padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #A78BFA, #7C3AED)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
              >
                حفظ الصلاحيات <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              </button>
              <button
                onClick={closePermissions}
                style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Header ─── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #A78BFA, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>منصة ماتن</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>نظام إدارة الجامعة</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#A78BFA' }}>{user.role}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(167,139,250,0.13)', border: '2px solid rgba(167,139,250,0.27)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 32px 40px' }}>
        {/* Page Title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff' }}>لوحة تحكم عميد الكلية</h1>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>كلية الهندسة — الفصل الدراسي الثاني 1446هـ</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '10px 20px',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid #A78BFA' : '2px solid transparent',
                color: tab === t.key ? '#A78BFA' : 'rgba(255,255,255,0.45)',
                fontSize: 14,
                fontWeight: tab === t.key ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW ─── */}
        {tab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
              <StatCard title="طلاب الكلية" value="820" sub="طالب مسجل" color="#A78BFA" />
              <StatCard title="هيئة التدريس" value="62" sub="عضو تدريس" color="#60A5FA" />
              <StatCard title="نسبة الحضور" value="89%" sub="متوسط الحضور" color="#34D399" />
              <StatCard title="متأهلون للتخرج" value="124" sub="طالب مستوفٍ للمتطلبات" color="#FBBF24" />
            </div>

            {/* Overview summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>هيئة التدريس</div>
                  <button onClick={() => setTab('faculty')} style={{ fontSize: 12, color: '#A78BFA', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>عرض الكل ←</button>
                </div>
                {faculty.slice(0, 4).map((m: any) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{m.department}</div>
                    </div>
                    <span style={{ fontSize: 11, color: roleColor[m.role] ?? '#fff', background: `${roleColor[m.role] ?? '#fff'}18`, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{m.role}</span>
                  </div>
                ))}
                {faculty.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '16px 0' }}>لا توجد بيانات</div>}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>طلبات الإجازة</div>
                  <button onClick={() => setTab('leaves')} style={{ fontSize: 12, color: '#A78BFA', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>عرض الكل ←</button>
                </div>
                {leaves.map((l: any) => (
                  <div key={l.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{l.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{l.type} · {l.from} → {l.to}</div>
                      </div>
                      {l.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => setLeaves((prev) => prev.map((x: any) => x.id === l.id ? { ...x, status: 'approved' } : x))}
                            style={{ padding: '4px 12px', borderRadius: 7, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#34D399', fontSize: 11, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
                          >قبول</button>
                          <button
                            onClick={() => setLeaves((prev) => prev.map((x: any) => x.id === l.id ? { ...x, status: 'rejected' } : x))}
                            style={{ padding: '4px 12px', borderRadius: 7, background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#F87171', fontSize: 11, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
                          >رفض</button>
                        </div>
                      )}
                      {l.status !== 'pending' && (
                        <span style={{ fontSize: 11, color: l.status === 'approved' ? '#34D399' : '#F87171', fontWeight: 600 }}>{l.status === 'approved' ? 'مقبول' : 'مرفوض'}</span>
                      )}
                    </div>
                  </div>
                ))}
                {leaves.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '16px 0' }}>لا توجد طلبات إجازة</div>}
              </div>
            </div>
          </>
        )}

        {/* ─── FACULTY ─── */}
        {tab === 'faculty' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>هيئة التدريس</div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                style={{ padding: '7px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}
              >
                <option value="all">الكل</option>
                <option value="doctors">دكاترة</option>
                <option value="assistants">معيدون</option>
                <option value="admin">إداريون</option>
              </select>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['الاسم', 'الدور', 'القسم', 'الحالة', 'صلاحيات'].map((h) => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.map((m: any, i: number) => (
                  <tr key={m.id} style={{ borderBottom: i < filteredFaculty.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{m.name}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 12, color: roleColor[m.role] ?? '#fff', background: `${roleColor[m.role] ?? '#fff'}18`, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>{m.role}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{m.department}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 12, color: statusColor[m.status] ?? '#fff', background: `${statusColor[m.status] ?? '#fff'}18`, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>{statusLabel[m.status] ?? m.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <button
                        onClick={() => openPermissions(m)}
                        style={{ padding: '6px 16px', borderRadius: 8, background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)', color: '#A78BFA', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
                      >
                        صلاحيات
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredFaculty.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>لا توجد نتائج</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── STUDENTS ─── */}
        {tab === 'students' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>إجمالي طلاب الكلية: <strong style={{ color: '#A78BFA' }}>820 طالب</strong></div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>تفاصيل الطلاب قيد الإعداد</div>
          </div>
        )}

        {/* ─── LEAVES ─── */}
        {tab === 'leaves' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>طلبات الإجازة</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{leaves.filter((l: any) => l.status === 'pending').length} طلب قيد الانتظار</div>
            </div>
            <div style={{ padding: '8px 0' }}>
              {leaves.map((l: any, i: number) => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: i < leaves.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{l.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{l.type} · من {l.from} إلى {l.to}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {l.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => setLeaves((prev) => prev.map((x: any) => x.id === l.id ? { ...x, status: 'approved' } : x))}
                          style={{ padding: '7px 18px', borderRadius: 9, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#34D399', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
                        >قبول</button>
                        <button
                          onClick={() => setLeaves((prev) => prev.map((x: any) => x.id === l.id ? { ...x, status: 'rejected' } : x))}
                          style={{ padding: '7px 18px', borderRadius: 9, background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#F87171', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
                        >رفض</button>
                      </>
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 600, color: l.status === 'approved' ? '#34D399' : '#F87171', background: l.status === 'approved' ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)', padding: '6px 16px', borderRadius: 9 }}>
                        {l.status === 'approved' ? 'مقبول' : 'مرفوض'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {leaves.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>لا توجد طلبات إجازة</div>}
            </div>
          </div>
        )}

        {/* ─── FINANCE ─── */}
        {tab === 'finance' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>لوحة المالية</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>التقارير المالية قيد الإعداد</div>
          </div>
        )}
      </div>
    </div>
  );
}
