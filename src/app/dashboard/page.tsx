'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getHeaders } from '@/lib/api';

const CSS = `
:root {
  --gold:#D4A843; --gold2:#E8C060;
  --gold-dim:rgba(212,168,67,0.12); --gold-border:rgba(212,168,67,0.22);
  --bg:#06060E; --bg-card:rgba(255,255,255,0.025);
  --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.04);
  --text:#EEEEF5; --text-dim:rgba(238,238,245,0.55); --text-muted:rgba(238,238,245,0.28);
  --green:#10B981; --red:#EF4444; --blue:#60A5FA; --purple:#A78BFA;
}
.stat-card{background:var(--bg-card);border:1px solid var(--border2);border-radius:14px;padding:18px 20px;position:relative;overflow:hidden;transition:all 0.2s;cursor:pointer;}
.stat-card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,0.1);}
.stat-card::before{content:'';position:absolute;inset:0;background:var(--grad,rgba(0,0,0,0));pointer-events:none;}
.stat-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
.stat-val{font-size:28px;font-weight:800;line-height:1;margin-bottom:5px;}
.stat-lbl{color:var(--text-muted);font-size:12px;}
.stat-sub{font-size:11px;margin-top:5px;}
.sec-card{background:var(--bg-card);border:1px solid var(--border2);border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all 0.2s;text-decoration:none;}
.sec-card:hover{transform:translateY(-2px);}
.sec-icon{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sec-lbl{font-size:11px;color:var(--text-muted);margin-bottom:2px;}
.sec-action{font-size:16px;font-weight:800;}
.dcard{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:20px;}
.dcard-hdr{padding:14px 20px;border-bottom:1px solid var(--border2);display:flex;align-items:center;justify-content:space-between;gap:12px;}
.dcard-title{display:flex;align-items:center;gap:10px;color:var(--text);font-size:15px;font-weight:700;}
.dcard-count{background:var(--gold-dim);border:1px solid var(--gold-border);color:var(--gold);font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px;}
.filter-tabs{display:flex;gap:4px;padding:10px 16px;border-bottom:1px solid var(--border2);overflow-x:auto;}
.filter-tabs::-webkit-scrollbar{display:none;}
.ftab{background:transparent;border:1px solid transparent;border-radius:7px;padding:5px 14px;color:var(--text-dim);font-size:12px;cursor:pointer;font-family:inherit;transition:all 0.15s;white-space:nowrap;}
.ftab.active{background:var(--gold-dim);border-color:var(--gold-border);color:var(--gold);font-weight:700;}
.dtable{width:100%;border-collapse:collapse;min-width:580px;}
.dtable thead tr{background:rgba(212,168,67,0.04);}
.dtable th{padding:11px 16px;text-align:right;color:var(--gold);font-weight:700;font-size:11.5px;border-bottom:1px solid var(--border2);white-space:nowrap;}
.dtable td{padding:12px 16px;border-bottom:1px solid var(--border2);font-size:13px;transition:background 0.15s;}
.dtable tbody tr:hover td{background:rgba(255,255,255,0.015);}
.dtable tbody tr:last-child td{border-bottom:none;}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap;}
.bg{background:rgba(16,185,129,0.1);color:var(--green);border:1px solid rgba(16,185,129,0.2);}
.br{background:rgba(239,68,68,0.1);color:var(--red);border:1px solid rgba(239,68,68,0.2);}
.bb{background:rgba(96,165,250,0.1);color:var(--blue);border:1px solid rgba(96,165,250,0.2);}
.bgo{background:var(--gold-dim);color:var(--gold);border:1px solid var(--gold-border);}
.bp{background:rgba(167,139,250,0.1);color:var(--purple);border:1px solid rgba(167,139,250,0.2);}
.btn-sm{padding:4px 11px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;border:none;}
.quick-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;}
.quick-item{background:rgba(255,255,255,0.02);border:1px solid var(--border2);border-radius:10px;padding:14px 10px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:all 0.15s;text-align:center;text-decoration:none;}
.quick-item:hover{background:rgba(255,255,255,0.05);transform:translateY(-2px);}
.quick-icon{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;}
.quick-lbl{font-size:11.5px;color:var(--text-dim);font-weight:500;}
.alert-bar{display:flex;align-items:center;gap:12px;background:rgba(212,168,67,0.06);border:1px solid rgba(212,168,67,0.18);border-radius:12px;padding:11px 16px;margin-bottom:20px;font-size:13px;color:var(--text-dim);}
.alert-bar strong{color:var(--gold);}
.page-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;flex-wrap:wrap;gap:10px;}
.page-title{color:var(--gold);font-size:22px;font-weight:800;letter-spacing:-0.5px;display:flex;align-items:center;gap:8px;}
.page-sub{color:var(--text-muted);font-size:13px;margin-top:4px;}
.btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:10px;padding:10px 20px;color:#06060E;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:7px;box-shadow:0 4px 16px rgba(212,168,67,0.25);text-decoration:none;}
.table-wrap{overflow-x:auto;}
@media(max-width:1100px){.quick-grid{grid-template-columns:repeat(4,1fr);}}
@media(max-width:768px){.quick-grid{grid-template-columns:repeat(3,1fr);}.page-title{font-size:17px;}.btn-gold{width:100%;justify-content:center;}}
`;

const INSTITUTION_TYPES: Record<string, { label: string; color: string }> = {
  school: { label: 'مدرسة', color: '#3B82F6' },
  university: { label: 'جامعة', color: '#8B5CF6' },
  institute: { label: 'معهد', color: '#10B981' },
  kindergarten: { label: 'حضانة', color: '#F59E0B' },
  training_center: { label: 'مركز تدريب', color: '#EF4444' },
  college: { label: 'كلية', color: '#06B6D4' },
};

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [pendingAdmissions, setPendingAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [alertDismissed, setAlertDismissed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('matin_token');
    if (token) {
      fetch('/api/auth/verify', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(r => r.json())
        .then(data => {
          if (data.valid) {
            const u = data.user;
            // إعادة توجيه مالك المسجد/تحفيظ إلى لوحة تحكم القرآن
            if (u.institution_type === 'mosque' || u.institution_type === 'quran_center') {
              window.location.href = '/quran/dashboard';
              return;
            }
            setUser(u);
            localStorage.setItem('matin_user', JSON.stringify(u));
            loadAll(u);
          } else { window.location.href = '/login'; }
        }).catch(() => setLoading(false));
    } else {
      const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
      if (!u.id) { window.location.href = '/login'; return; }
      // إعادة توجيه مالك المسجد/تحفيظ إلى لوحة تحكم القرآن
      if (u.institution_type === 'mosque' || u.institution_type === 'quran_center') {
        window.location.href = '/quran/dashboard';
        return;
      }
      setUser(u); loadAll(u);
    }
  }, []);

  const handleApproveAdmission = async (id: number) => {
    setSaving(true); setErrMsg('');
    try {
      const res = await fetch(`/api/admission?id=${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status: 'approved' }) });
      const data = await res.json();
      if (res.ok) { loadAll(JSON.parse(localStorage.getItem('matin_user') || '{}')); }
      else setErrMsg(data.error || 'فشل القبول');
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const handleRejectAdmission = async (id: number) => {
    setSaving(true); setErrMsg('');
    try {
      const res = await fetch(`/api/admission?id=${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status: 'rejected' }) });
      const data = await res.json();
      if (res.ok) { loadAll(JSON.parse(localStorage.getItem('matin_user') || '{}')); }
      else setErrMsg(data.error || 'فشل الرفض');
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const loadAll = async (u: any) => {
    try {
      const headers = getHeaders();
      const [statsRes, schoolsRes, examsRes, admissionsRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers }),
        fetch('/api/schools', { headers }),
        fetch('/api/exams?limit=5', { headers }),
        fetch('/api/admission?status=pending&limit=5', { headers }),
      ]);
      const [statsData, schoolsData, examsData, admissionsData] = await Promise.all([
        statsRes.json(), schoolsRes.json(), examsRes.json(), admissionsRes.json()
      ]);
      setStats(statsData || {});
      const sl = Array.isArray(schoolsData) ? schoolsData : [];
      setSchools(sl);
      if (sl.length > 0) setSchool(sl[0]);
      setUpcomingExams(Array.isArray(examsData) ? examsData.slice(0, 5) : []);
      setPendingAdmissions(Array.isArray(admissionsData) ? admissionsData.slice(0, 5) : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const pendingCount = stats.pending_admissions || pendingAdmissions.length || 0;

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:44,height:44,borderRadius:10,background:'rgba(212,168,67,0.15)',margin:'0 auto 12px',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <p style={{ color:'rgba(255,255,255,0.4)' }}>جاري التحميل...</p>
      </div>
    </div>
  );

  const filteredSchools = activeTab === 'active'
    ? schools.filter(s => s.subscription_status === 'active')
    : activeTab === 'frozen'
    ? schools.filter(s => s.subscription_status !== 'active')
    : schools;

  return (
    <div style={{ direction:'rtl', fontFamily:'IBM Plex Sans Arabic,Arial,sans-serif' }}>
      <style>{CSS}</style>

      {!alertDismissed && pendingCount > 0 && (
        <div className="alert-bar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
          <span><strong>{pendingCount} طلبات انضمام</strong> جديدة تنتظر المراجعة</span>
          <Link href="/dashboard/admission" style={{ color:'var(--gold)',fontWeight:700,textDecoration:'none',fontSize:12,marginRight:'auto' }}>مراجعة الآن ←</Link>
          <button onClick={() => setAlertDismissed(true)} style={{ background:'none',border:'none',color:'rgba(238,238,245,0.3)',cursor:'pointer',fontSize:20,lineHeight:1,padding:0 }}>×</button>
        </div>
      )}

      <div className="page-hdr">
        <div>
          <div className="page-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/></svg>
            لوحة التحكم الرئيسية
          </div>
          <div className="page-sub">إدارة {school?.name_ar || school?.name || 'مؤسستك التعليمية'} — آخر تحديث: منذ لحظات</div>
        </div>
        <Link href="/dashboard/admission" className="btn-gold">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06060E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          طلبات الانضمام
        </Link>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          { val: stats.students||stats.total_students||0, lbl:'إجمالي الطلاب', sub:`+${stats.new_students||0} هذا الشهر`, color:'#60A5FA', grad:'rgba(96,165,250,0.05)', href:'/dashboard/students',
            icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/></svg> },
          { val: stats.teachers||stats.total_teachers||0, lbl:'المعلمون', sub:'نشطون', color:'#A78BFA', grad:'rgba(167,139,250,0.05)', href:'/dashboard/teachers',
            icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
          { val: stats.classes||stats.total_classes||0, lbl:'الفصول الدراسية', sub:'فصل نشط', color:'#10B981', grad:'rgba(16,185,129,0.05)', href:'/dashboard/classes',
            icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 8h1M14 8h1"/></svg> },
          { val: `${stats.attendance_rate||0}%`, lbl:'معدل الحضور', sub:'اليوم', color:'#D4A843', grad:'rgba(212,168,67,0.05)', href:'/dashboard/attendance',
            icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
        ].map((s,i) => (
          <Link key={i} href={s.href} style={{ textDecoration:'none' }}>
            <div className="stat-card" style={{ ['--grad' as any]:`linear-gradient(135deg,${s.grad} 0%,transparent 60%)` }}>
              <div className="stat-icon" style={{ background:`${s.color}1a`, border:`1px solid ${s.color}33` }}>{s.icon}</div>
              <div className="stat-val" style={{ color:s.color }}>{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
              <div className="stat-sub" style={{ color:`${s.color}99` }}>{s.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <Link href="/dashboard/exams" className="sec-card">
          <div className="sec-icon" style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
          </div>
          <div><div className="sec-lbl">الاختبارات</div><div className="sec-action" style={{ color:'#EF4444' }}>{stats.exams||0} ←</div></div>
        </Link>
        <Link href="/dashboard/finance" className="sec-card">
          <div className="sec-icon" style={{ background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div><div className="sec-lbl">المالية</div><div className="sec-action" style={{ color:'#10B981' }}>عرض ←</div></div>
        </Link>
        <Link href="/dashboard/inbox" className="sec-card">
          <div className="sec-icon" style={{ background:'rgba(34,211,238,0.1)',border:'1px solid rgba(34,211,238,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div><div className="sec-lbl">الرسائل</div><div className="sec-action" style={{ color:'#22D3EE' }}>عرض ←</div></div>
        </Link>
        <Link href="/dashboard/admission" className="sec-card" style={{ borderColor: pendingCount > 0 ? 'rgba(239,68,68,0.25)' : undefined }}>
          <div className="sec-icon" style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          </div>
          <div><div className="sec-lbl">طلبات الانضمام</div><div className="sec-action" style={{ color:'#EF4444' }}>{pendingCount > 0 ? `${pendingCount} معلّقة ←` : 'عرض ←'}</div></div>
        </Link>
      </div>

      <div className="dcard">
        <div className="dcard-hdr">
          <div className="dcard-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 8h1M14 8h1"/></svg>
            المؤسسات المسجلة
            <span className="dcard-count">{schools.length}</span>
          </div>
          <Link href="/dashboard/school-page" style={{ color:'#D4A843',fontSize:12,textDecoration:'none',fontWeight:600 }}>إدارة الصفحة ←</Link>
        </div>
        <div className="filter-tabs">
          {([['all','الكل'],['active','نشطة'],['frozen','متجمدة']] as [string,string][]).map(([k,v]) => (
            <button key={k} className={`ftab${activeTab===k?' active':''}`} onClick={()=>setActiveTab(k)}>
              {v} ({k==='all'?schools.length:k==='active'?schools.filter(s=>s.subscription_status==='active').length:schools.filter(s=>s.subscription_status!=='active').length})
            </button>
          ))}
        </div>
        <div className="table-wrap">
          <table className="dtable">
            <thead>
              <tr><th>المؤسسة</th><th>النوع</th><th>الحالة</th><th>الطلاب</th><th>الكود</th><th>الإجراءات</th></tr>
            </thead>
            <tbody>
              {filteredSchools.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center',padding:'28px 0',color:'rgba(238,238,245,0.25)',fontSize:13 }}>لا توجد مؤسسات</td></tr>
              ) : filteredSchools.map((s: any, i: number) => {
                const t = INSTITUTION_TYPES[s.institution_type] || INSTITUTION_TYPES.school;
                const isActive = s.subscription_status === 'active';
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight:600,color:'var(--text)' }}>{s.name_ar || s.name}</div>
                      <div style={{ color:'rgba(238,238,245,0.28)',fontSize:11,marginTop:2 }}>{s.city || ''}</div>
                    </td>
                    <td><span style={{ color:t.color,fontSize:12 }}>{t.label}</span></td>
                    <td>{isActive ? <span className="badge bg">● نشط</span> : <span className="badge br">● متجمد</span>}</td>
                    <td style={{ color:'var(--gold)',fontWeight:700 }}>{s.student_count || stats.students || '—'}</td>
                    <td style={{ color:'rgba(238,238,245,0.28)',fontSize:12 }}>{s.code || '—'}</td>
                    <td>
                      <div style={{ display:'flex',gap:5 }}>
                        <Link href="/dashboard/settings" className="btn-sm" style={{ background:'rgba(212,168,67,0.08)',color:'var(--gold)',border:'1px solid rgba(212,168,67,0.2)',textDecoration:'none',padding:'4px 11px',borderRadius:6,fontSize:11,fontWeight:600 }}>تعديل</Link>
                        <Link href="/dashboard/school-page" className="btn-sm" style={{ background:'rgba(96,165,250,0.08)',color:'var(--blue)',border:'1px solid rgba(96,165,250,0.2)',textDecoration:'none',padding:'4px 11px',borderRadius:6,fontSize:11,fontWeight:600 }}>عرض</Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div className="dcard" style={{ marginBottom:0 }}>
          <div className="dcard-hdr">
            <div className="dcard-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              طلبات الانضمام المعلقة
            </div>
            <Link href="/dashboard/admission" style={{ color:'#D4A843',fontSize:12,textDecoration:'none' }}>عرض الكل ←</Link>
          </div>
          <div style={{ padding:'8px 20px' }}>
            {pendingAdmissions.length === 0 ? (
              <div style={{ textAlign:'center',padding:'24px 0',color:'rgba(238,238,245,0.25)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" style={{ margin:'0 auto 8px',display:'block' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <div style={{ fontSize:13 }}>لا توجد طلبات معلقة</div>
              </div>
            ) : pendingAdmissions.map((a: any, i: number) => (
              <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:i<pendingAdmissions.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
                <div>
                  <div style={{ color:'var(--text)',fontSize:14,fontWeight:600 }}>{a.student_name || a.name || 'طالب'}</div>
                  <div style={{ color:'rgba(238,238,245,0.35)',fontSize:12 }}>{a.grade || a.class_name || 'غير محدد'}</div>
                </div>
                <button onClick={() => { setSelectedAdmission(a); setShowModal(true); }} style={{ background:'rgba(212,168,67,0.12)',color:'#D4A843',fontSize:11,padding:'4px 10px',borderRadius:6,border:'1px solid rgba(212,168,67,0.25)',cursor:'pointer',fontWeight:600,fontFamily:'inherit' }}>مراجعة</button>
              </div>
            ))}
          </div>
        </div>

        <div className="dcard" style={{ marginBottom:0 }}>
          <div className="dcard-hdr">
            <div className="dcard-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
              الاختبارات القادمة
            </div>
            <Link href="/dashboard/exams" style={{ color:'#D4A843',fontSize:12,textDecoration:'none' }}>عرض الكل ←</Link>
          </div>
          <div style={{ padding:'8px 20px' }}>
            {upcomingExams.length === 0 ? (
              <div style={{ textAlign:'center',padding:'24px 0',color:'rgba(238,238,245,0.25)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" style={{ margin:'0 auto 8px',display:'block' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div style={{ fontSize:13 }}>لا توجد اختبارات قادمة</div>
              </div>
            ) : upcomingExams.map((e: any, i: number) => (
              <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:i<upcomingExams.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
                <div>
                  <div style={{ color:'var(--text)',fontSize:14,fontWeight:600 }}>{e.title_ar || e.title}</div>
                  <div style={{ color:'rgba(238,238,245,0.35)',fontSize:12 }}>{e.subject||''}{e.duration?` • ${e.duration} دقيقة`:''}</div>
                </div>
                <div style={{ textAlign:'left' }}>
                  <span className={`badge ${e.status==='ACTIVE'?'br':e.status==='PUBLISHED'?'bb':'bp'}`}>
                    {e.status==='ACTIVE'?'جاري':e.status==='PUBLISHED'?'منشور':'مسودة'}
                  </span>
                  {e.scheduled_at && <div style={{ color:'rgba(238,238,245,0.25)',fontSize:11,marginTop:3 }}>{new Date(e.scheduled_at).toLocaleDateString('ar-SA')}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <div style={{ color:'rgba(238,238,245,0.28)',fontSize:10,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:12 }}>إجراءات سريعة</div>
        <div className="quick-grid">
          {[
            { label:'الطلاب', href:'/dashboard/students', color:'#60A5FA', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/></svg> },
            { label:'المعلمون', href:'/dashboard/teachers', color:'#A78BFA', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
            { label:'الاختبارات', href:'/dashboard/exams', color:'#EF4444', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg> },
            { label:'المحاضرات', href:'/dashboard/lectures', color:'#F59E0B', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg> },
            { label:'الحضور', href:'/dashboard/attendance', color:'#06B6D4', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
            { label:'الإشعارات', href:'/dashboard/notifications', color:'#10B981', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
            { label:'المالية', href:'/dashboard/finance', color:'#D4A843', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
            { label:'الجدول', href:'/dashboard/schedules', color:'#8B5CF6', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
            { label:'التقارير', href:'/dashboard/reports', color:'#FB923C', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
            { label:'المتجر', href:'/dashboard/store', color:'#E879F9', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E879F9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg> },
            { label:'المساعد AI', href:'/dashboard/ai-assistant', color:'#818CF8', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
            { label:'الإعدادات', href:'/dashboard/settings', color:'rgba(238,238,245,0.4)', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.4)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="quick-item">
              <div className="quick-icon" style={{ background:`${item.color}1a`, border:`1px solid ${item.color}33` }}>{item.icon}</div>
              <span className="quick-lbl">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {school && (
        <div style={{ background:'linear-gradient(135deg,rgba(212,168,67,0.08) 0%,rgba(212,168,67,0.04) 100%)',border:'1px solid rgba(212,168,67,0.2)',borderRadius:16,padding:'18px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
          <div>
            <div style={{ color:'#D4A843',fontSize:13,fontWeight:700,marginBottom:6,display:'flex',alignItems:'center',gap:6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              الرابط العام للمؤسسة
            </div>
            <div style={{ background:'rgba(0,0,0,0.3)',borderRadius:8,padding:'6px 14px',display:'inline-flex',alignItems:'center',gap:8 }}>
              <span style={{ color:'rgba(238,238,245,0.35)',fontSize:12 }}>matin.ink/school/</span>
              <span style={{ color:'#fff',fontSize:12,fontWeight:700 }}>{school.code}</span>
              <button onClick={() => navigator.clipboard.writeText(`https://matin.ink/school/${school.code}`)} style={{ background:'none',border:'none',cursor:'pointer',color:'#D4A843',padding:'0 2px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>
          </div>
          <div style={{ display:'flex',gap:10 }}>
            <a href={`https://matin.ink/school/${school.code}`} target="_blank" rel="noreferrer" style={{ background:'rgba(212,168,67,0.15)',color:'#D4A843',fontSize:12,padding:'7px 16px',borderRadius:9,textDecoration:'none',fontWeight:600,border:'1px solid rgba(212,168,67,0.3)' }}>معاينة</a>
            <Link href="/dashboard/school-page" style={{ background:'rgba(96,165,250,0.15)',color:'#60A5FA',fontSize:12,padding:'7px 16px',borderRadius:9,textDecoration:'none',fontWeight:600,border:'1px solid rgba(96,165,250,0.3)' }}>تعديل الصفحة</Link>
          </div>
        </div>
      )}

      {showModal && selectedAdmission && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000 }}>
          <div style={{ background:'#0F0F1A',border:'1px solid rgba(212,168,67,0.2)',borderRadius:16,padding:28,width:'100%',maxWidth:440,direction:'rtl' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
              <h2 style={{ color:'#D4A843',fontSize:18,fontWeight:700,margin:0 }}>مراجعة طلب الانضمام</h2>
              <button onClick={() => setShowModal(false)} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.4)',fontSize:24,cursor:'pointer',lineHeight:1,padding:0 }}>×</button>
            </div>
            {errMsg && <div style={{ padding:'10px 14px',borderRadius:8,marginBottom:16,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#EF4444',fontSize:13 }}>{errMsg}</div>}
            <div style={{ background:'rgba(255,255,255,0.03)',borderRadius:10,padding:16,marginBottom:20 }}>
              <div style={{ color:'#fff',fontSize:16,fontWeight:700,marginBottom:6 }}>{selectedAdmission.student_name || selectedAdmission.name}</div>
              <div style={{ color:'rgba(255,255,255,0.4)',fontSize:13 }}>الصف: {selectedAdmission.grade || selectedAdmission.class_name || 'غير محدد'}</div>
            </div>
            <div style={{ display:'flex',gap:10 }}>
              <button onClick={async()=>{await handleApproveAdmission(selectedAdmission.id);setShowModal(false);}} disabled={saving} style={{ flex:1,background:'rgba(16,185,129,0.15)',color:'#10B981',border:'1px solid rgba(16,185,129,0.3)',borderRadius:10,padding:'12px 0',cursor:saving?'not-allowed':'pointer',fontWeight:700,fontSize:14,fontFamily:'inherit' }}>{saving?'جاري...':'✓ قبول'}</button>
              <button onClick={async()=>{await handleRejectAdmission(selectedAdmission.id);setShowModal(false);}} disabled={saving} style={{ flex:1,background:'rgba(239,68,68,0.15)',color:'#EF4444',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:'12px 0',cursor:saving?'not-allowed':'pointer',fontWeight:700,fontSize:14,fontFamily:'inherit' }}>{saving?'جاري...':'✕ رفض'}</button>
              <button onClick={()=>setShowModal(false)} style={{ padding:'12px 16px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:13,fontFamily:'inherit' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
