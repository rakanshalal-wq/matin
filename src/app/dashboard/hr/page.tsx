'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon, ICONS, G, DARK, CARD, BORDER, Spinner } from '@/components/ui-icons';
import { getHeaders } from '@/lib/api';

/* ─── HR Dashboard — متين v5 ─── */

export default function HRDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'leaves' | 'payroll' | 'attendance'>('overview');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddLeave, setShowAddLeave] = useState(false);
  const [empForm, setEmpForm] = useState({ name: '', email: '', phone: '', department: '', position: '', salary: '', join_date: '', status: 'active' });
  const [leaveForm, setLeaveForm] = useState({ employee_id: '', type: 'annual', start_date: '', end_date: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, empRes, leavesRes, payrollRes] = await Promise.all([
        fetch('/api/hr-stats', { headers: getHeaders() }),
        fetch('/api/employees', { headers: getHeaders() }),
        fetch('/api/leaves', { headers: getHeaders() }),
        fetch('/api/payroll', { headers: getHeaders() }),
      ]);
      const [statsData, empData, leavesData, payrollData] = await Promise.all([
        statsRes.json(), empRes.json(), leavesRes.json(), payrollRes.json()
      ]);
      setStats(statsData || {});
      setEmployees(Array.isArray(empData) ? empData : []);
      setLeaves(Array.isArray(leavesData) ? leavesData : []);
      setPayroll(Array.isArray(payrollData) ? payrollData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const saveEmployee = async () => {
    if (!empForm.name) { setMsg('الاسم مطلوب'); return; }
    setSaving(true); setMsg('');
    try {
      const res = await fetch('/api/employees', { method: 'POST', headers: getHeaders(), body: JSON.stringify(empForm) });
      const data = await res.json();
      if (res.ok) {
        setEmployees([data, ...employees]);
        setEmpForm({ name: '', email: '', phone: '', department: '', position: '', salary: '', join_date: '', status: 'active' });
        setShowAddEmployee(false);
        setMsg('تم إضافة الموظف');
      } else { setMsg(data.error || 'فشل'); }
    } catch (e: any) { setMsg(e.message || 'خطأ'); }
    finally { setSaving(false); }
  };

  const saveLeave = async () => {
    if (!leaveForm.employee_id || !leaveForm.start_date) { setMsg('بيانات ناقصة'); return; }
    setSaving(true); setMsg('');
    try {
      const res = await fetch('/api/leaves', { method: 'POST', headers: getHeaders(), body: JSON.stringify(leaveForm) });
      const data = await res.json();
      if (res.ok) {
        setLeaves([data, ...leaves]);
        setLeaveForm({ employee_id: '', type: 'annual', start_date: '', end_date: '', reason: '' });
        setShowAddLeave(false);
        setMsg('تم تسجيل الإجازة');
      } else { setMsg(data.error || 'فشل'); }
    } catch (e: any) { setMsg(e.message || 'خطأ'); }
    finally { setSaving(false); }
  };

  const updateLeaveStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/leaves?id=${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status }) });
      setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
    } catch {}
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <Spinner size={40} />
      <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>جاري التحميل...</div>
    </div>
  );

  const inpStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { color: 'rgba(238,238,245,0.6)', fontSize: 13, marginBottom: 6, display: 'block', fontWeight: 500 };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: 'dashboard' },
    { id: 'employees', label: 'الموظفين', icon: 'users' },
    { id: 'leaves', label: 'الإجازات', icon: 'calendar' },
    { id: 'payroll', label: 'الرواتب', icon: 'wallet' },
    { id: 'attendance', label: 'الحضور', icon: 'attendance' },
  ];

  return (
    <div style={{ padding: '28px 24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', minHeight: '100vh', background: DARK }}>
      {/* الهيدر */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, background: 'rgba(139,92,246,0.12)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Icon d={ICONS.users} size={24} />
          </div>
          <div>
            <h1 style={{ color: '#EEEEF5', fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>الموارد البشرية</h1>
            <p style={{ color: 'rgba(238,238,245,0.45)', margin: 0, fontSize: 13 }}>إدارة الموظفين والرواتب والإجازات</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/dashboard/messages" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, color: 'rgba(238,238,245,0.7)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            <Icon d={ICONS.messages} size={15} /> الرسائل
          </Link>
          <Link href="/dashboard/notifications" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: `rgba(201,168,76,0.08)`, border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 10, color: G, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            <Icon d={ICONS.notif} size={15} /> الإشعارات
          </Link>
        </div>
      </div>

      {/* التبويبات */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 4, width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', transition: 'all 0.2s',
              background: activeTab === tab.id ? `linear-gradient(135deg, ${G}, #E2C46A)` : 'transparent',
              color: activeTab === tab.id ? '#000' : 'rgba(238,238,245,0.5)',
            }}>
            <Icon d={ICONS[tab.icon]} size={14} color={activeTab === tab.id ? '#000' : 'rgba(238,238,245,0.5)'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* نظرة عامة */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 28 }}>
            {[
              { label: 'الموظفين', value: employees.length, icon: 'users', color: '#8B5CF6' },
              { label: 'نشطين', value: employees.filter((e: any) => e.status === 'active').length, icon: 'user', color: '#10B981' },
              { label: 'إجازات معلقة', value: leaves.filter((l: any) => l.status === 'pending').length, icon: 'calendar', color: '#F59E0B' },
              { label: 'رواتب الشهر', value: `${payroll.reduce((sum, p) => sum + (p.net_salary || 0), 0).toLocaleString('ar-SA')} ر.س`, icon: 'wallet', color: '#3B82F6' },
            ].map((s, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ color: 'rgba(238,238,245,0.45)', fontSize: 12, marginBottom: 8, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ color: '#EEEEF5', fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    <Icon d={ICONS[s.icon]} size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h2 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, margin: '0 0 18px' }}>الإجراءات السريعة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
              {[
                { label: 'إضافة موظف', icon: 'plus', action: () => setShowAddEmployee(true), color: '#8B5CF6' },
                { label: 'طلب إجازة', icon: 'calendar', action: () => setShowAddLeave(true), color: '#F59E0B' },
                { label: 'الرواتب', icon: 'wallet', tab: 'payroll', color: '#3B82F6' },
                { label: 'التقارير', icon: 'reports', href: '/dashboard/reports', color: '#10B981' },
              ].map((a, i) => (
                a.href ? (
                  <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = a.color; (e.currentTarget as HTMLDivElement).style.background = `${a.color}10`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: a.color }}>
                        <Icon d={ICONS[a.icon]} size={17} />
                      </div>
                      <div style={{ color: 'rgba(238,238,245,0.75)', fontSize: 12, fontWeight: 600 }}>{a.label}</div>
                    </div>
                  </Link>
                ) : (
                  <div key={i} onClick={() => a.action ? a.action() : setActiveTab(a.tab as any)}
                    style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = a.color; (e.currentTarget as HTMLDivElement).style.background = `${a.color}10`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: a.color }}>
                      <Icon d={ICONS[a.icon]} size={17} />
                    </div>
                    <div style={{ color: 'rgba(238,238,245,0.75)', fontSize: 12, fontWeight: 600 }}>{a.label}</div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* آخر الإجازات */}
          {leaves.length > 0 && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}` }}>
                <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, margin: 0 }}>آخر طلبات الإجازة</h3>
              </div>
              <div style={{ padding: 20 }}>
                {leaves.slice(0, 5).map((leave: any) => (
                  <div key={leave.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    <div>
                      <div style={{ color: '#EEEEF5', fontWeight: 600 }}>{leave.employee_name}</div>
                      <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{leave.type} | {new Date(leave.start_date).toLocaleDateString('ar-SA')}</div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: leave.status === 'approved' ? 'rgba(16,185,129,0.1)' : leave.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: leave.status === 'approved' ? '#10B981' : leave.status === 'rejected' ? '#EF4444' : '#F59E0B' }}>
                      {leave.status === 'approved' ? 'مقبول' : leave.status === 'rejected' ? 'مرفوض' : 'معلق'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* الموظفين */}
      {activeTab === 'employees' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, margin: 0 }}>الموظفين ({employees.length})</h2>
            <button onClick={() => setShowAddEmployee(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: `linear-gradient(135deg, ${G}, #E2C46A)`, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
              <Icon d={ICONS.plus} size={16} color="#000" /> إضافة موظف
            </button>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {employees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(238,238,245,0.3)', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16 }}>
                <div style={{ marginBottom: 12 }}><Icon d={ICONS.users} size={40} color="rgba(238,238,245,0.15)" /></div>
                <div style={{ fontSize: 14 }}>لا يوجد موظفين بعد</div>
              </div>
            ) : employees.map((emp: any) => (
              <div key={emp.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                    <Icon d={ICONS.user} size={18} />
                  </div>
                  <div>
                    <div style={{ color: '#EEEEF5', fontWeight: 700 }}>{emp.name}</div>
                    <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{emp.position} | {emp.department}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ color: 'rgba(238,238,245,0.5)', fontSize: 13 }}>{emp.salary?.toLocaleString('ar-SA')} ر.س</span>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: emp.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(156,163,175,0.1)', color: emp.status === 'active' ? '#10B981' : '#9CA3AF' }}>
                    {emp.status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الإجازات */}
      {activeTab === 'leaves' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, margin: 0 }}>طلبات الإجازة ({leaves.length})</h2>
            <button onClick={() => setShowAddLeave(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#F59E0B', color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
              <Icon d={ICONS.plus} size={16} color="#000" /> طلب إجازة
            </button>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {leaves.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(238,238,245,0.3)', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16 }}>
                <div style={{ marginBottom: 12 }}><Icon d={ICONS.calendar} size={40} color="rgba(238,238,245,0.15)" /></div>
                <div style={{ fontSize: 14 }}>لا توجد إجازات</div>
              </div>
            ) : leaves.map((leave: any) => (
              <div key={leave.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ color: '#EEEEF5', fontWeight: 700 }}>{leave.employee_name}</div>
                    <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{leave.type}</div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: leave.status === 'approved' ? 'rgba(16,185,129,0.1)' : leave.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: leave.status === 'approved' ? '#10B981' : leave.status === 'rejected' ? '#EF4444' : '#F59E0B' }}>
                    {leave.status === 'approved' ? 'مقبول' : leave.status === 'rejected' ? 'مرفوض' : 'معلق'}
                  </span>
                </div>
                <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 13 }}>
                  من {new Date(leave.start_date).toLocaleDateString('ar-SA')} إلى {new Date(leave.end_date).toLocaleDateString('ar-SA')}
                </div>
                {leave.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => updateLeaveStatus(leave.id, 'approved')} style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>قبول</button>
                    <button onClick={() => updateLeaveStatus(leave.id, 'rejected')} style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>رفض</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الرواتب */}
      {activeTab === 'payroll' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, margin: 0 }}>كشوف الرواتب</h2>
            <Link href="/dashboard/payroll" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#3B82F6', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              <Icon d={ICONS.wallet} size={16} color="white" /> إدارة الرواتب
            </Link>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {payroll.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(238,238,245,0.3)', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16 }}>
                <div style={{ marginBottom: 12 }}><Icon d={ICONS.wallet} size={40} color="rgba(238,238,245,0.15)" /></div>
                <div style={{ fontSize: 14 }}>لا توجد كشوف رواتب</div>
              </div>
            ) : payroll.map((p: any) => (
              <div key={p.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#EEEEF5', fontWeight: 700 }}>{p.employee_name}</div>
                  <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{p.month} / {p.year}</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: '#10B981', fontWeight: 700, fontSize: 16 }}>{p.net_salary?.toLocaleString('ar-SA')} ر.س</div>
                  <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 11 }}>صافي الراتب</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الحضور */}
      {activeTab === 'attendance' && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#10B981' }}>
            <Icon d={ICONS.attendance} size={30} />
          </div>
          <h3 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>تتبع الحضور</h3>
          <p style={{ color: 'rgba(238,238,245,0.5)', fontSize: 14, marginBottom: 24 }}>لتسجيل ومتابعة حضور الموظفين</p>
          <Link href="/dashboard/attendance" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#10B981', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            <Icon d={ICONS.attendance} size={16} color="white" /> الذهاب إلى الحضور
          </Link>
        </div>
      )}

      {/* Modal: إضافة موظف */}
      {showAddEmployee && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#0D0D1A', border: `1px solid ${BORDER}`, borderRadius: 18, padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, margin: 0 }}>إضافة موظف جديد</h2>
              <button onClick={() => setShowAddEmployee(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Icon d={ICONS.x} size={18} />
              </button>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              <div><label style={labelStyle}>الاسم *</label><input value={empForm.name} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} placeholder="اسم الموظف" style={inpStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>البريد الإلكتروني</label><input value={empForm.email} onChange={e => setEmpForm({ ...empForm, email: e.target.value })} placeholder="email@example.com" style={inpStyle} /></div>
                <div><label style={labelStyle}>الهاتف</label><input value={empForm.phone} onChange={e => setEmpForm({ ...empForm, phone: e.target.value })} placeholder="05xxxxxxxx" style={inpStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>القسم</label><input value={empForm.department} onChange={e => setEmpForm({ ...empForm, department: e.target.value })} placeholder="مثال: التعليم" style={inpStyle} /></div>
                <div><label style={labelStyle}>المنصب</label><input value={empForm.position} onChange={e => setEmpForm({ ...empForm, position: e.target.value })} placeholder="مثال: معلم" style={inpStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>الراتب الأساسي</label><input type="number" value={empForm.salary} onChange={e => setEmpForm({ ...empForm, salary: e.target.value })} placeholder="10000" style={inpStyle} /></div>
                <div><label style={labelStyle}>تاريخ التعيين</label><input type="date" value={empForm.join_date} onChange={e => setEmpForm({ ...empForm, join_date: e.target.value })} style={inpStyle} /></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={saveEmployee} disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', padding: '12px', background: `linear-gradient(135deg, ${G}, #E2C46A)`, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
                {saving ? <Spinner size={16} color="#000" /> : <Icon d={ICONS.save} size={16} color="#000" />}
                {saving ? 'جاري الحفظ...' : 'حفظ الموظف'}
              </button>
              <button onClick={() => setShowAddEmployee(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, color: 'rgba(238,238,245,0.7)', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: طلب إجازة */}
      {showAddLeave && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#0D0D1A', border: `1px solid ${BORDER}`, borderRadius: 18, padding: 32, width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, margin: 0 }}>طلب إجازة</h2>
              <button onClick={() => setShowAddLeave(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Icon d={ICONS.x} size={18} />
              </button>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={labelStyle}>الموظف</label>
                <select value={leaveForm.employee_id} onChange={e => setLeaveForm({ ...leaveForm, employee_id: e.target.value })} style={{ ...inpStyle, cursor: 'pointer' }}>
                  <option value="">-- اختر الموظف --</option>
                  {employees.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>نوع الإجازة</label>
                <select value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })} style={{ ...inpStyle, cursor: 'pointer' }}>
                  <option value="annual">سنوية</option>
                  <option value="sick">مرضية</option>
                  <option value="emergency">طارئة</option>
                  <option value="unpaid">بدون راتب</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>من تاريخ</label><input type="date" value={leaveForm.start_date} onChange={e => setLeaveForm({ ...leaveForm, start_date: e.target.value })} style={inpStyle} /></div>
                <div><label style={labelStyle}>إلى تاريخ</label><input type="date" value={leaveForm.end_date} onChange={e => setLeaveForm({ ...leaveForm, end_date: e.target.value })} style={inpStyle} /></div>
              </div>
              <div><label style={labelStyle}>السبب</label><textarea value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} placeholder="سبب الإجازة..." rows={3} style={{ ...inpStyle, resize: 'vertical' } as any} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={saveLeave} disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', padding: '12px', background: '#F59E0B', color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
                {saving ? <Spinner size={16} color="#000" /> : 'تقديم الطلب'}
              </button>
              <button onClick={() => setShowAddLeave(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, color: 'rgba(238,238,245,0.7)', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
