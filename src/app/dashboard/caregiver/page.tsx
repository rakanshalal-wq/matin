'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Users, ClipboardCheck, BarChart3, ChevronLeft, Sun, Moon, Utensils, Activity, FileText, Baby } from 'lucide-react';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C', DARK = '#06060E', CARD = 'rgba(255,255,255,0.03)', BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)', MUT = 'rgba(238,238,245,0.3)';
const PC = '#EC4899';

export default function CaregiverDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview'|'children'|'reports'|'attendance'>('overview');
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<any>({});
  const [savingAtt, setSavingAtt] = useState(false);
  const [attMsg, setAttMsg] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, classesRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers: getHeaders() }),
        fetch('/api/classes', { headers: getHeaders() }),
      ]);
      if (statsRes.ok) { const d = await statsRes.json(); setStats(d.stats || d); }
      if (classesRes.ok) { const d = await classesRes.json(); setClasses(d.classes || d.data || []); }
    } catch {}
    setLoading(false);
  };

  const loadChildren = async (classId: string) => {
    setSelectedClass(classId);
    try {
      const r = await fetch('/api/students?class_id=' + classId, { headers: getHeaders() });
      if (r.ok) { const d = await r.json(); setStudents(d.students || d.data || []); }
    } catch {}
  };

  const toggleAtt = (sid: string) => setAttendance((p: any) => ({ ...p, [sid]: p[sid] === 'present' ? 'absent' : 'present' }));

  const saveAttendance = async () => {
    if (!selectedClass) return;
    setSavingAtt(true); setAttMsg('');
    try {
      const records = Object.entries(attendance).map(([student_id, status]) => ({ student_id, status, date: attendanceDate }));
      const r = await fetch('/api/attendance', { method: 'POST', headers: { ...getHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ class_id: selectedClass, date: attendanceDate, records }) });
      setAttMsg(r.ok ? 'تم حفظ الحضور بنجاح' : 'حدث خطأ');
    } catch { setAttMsg('حدث خطأ'); }
    setSavingAtt(false);
  };

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:DARK,color:'#fff',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}><div style={{textAlign:'center'}}><Heart size={48} color={PC} /><div style={{marginTop:16,color:DIM}}>جارٍ التحميل...</div></div></div>;

  const statCards = [
    { icon: Baby, label: 'الاطفال', value: stats.students_count || 0, color: PC },
    { icon: Users, label: 'الفصول', value: stats.classes_count || classes.length || 0, color: '#3B82F6' },
    { icon: ClipboardCheck, label: 'الحضور اليوم', value: stats.today_attendance || '-', color: '#10B981' },
    { icon: FileText, label: 'التقارير اليومية', value: stats.daily_reports || 0, color: '#F59E0B' },
  ];

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', Ic: BarChart3 },
    { id: 'children', label: 'الاطفال', Ic: Baby },
    { id: 'reports', label: 'التقارير اليومية', Ic: FileText },
    { id: 'attendance', label: 'الحضور', Ic: ClipboardCheck },
  ];

  return (
    <div style={{fontFamily:"'IBM Plex Sans Arabic',sans-serif",direction:'rtl',background:DARK,color:'#EEEEF5',minHeight:'100vh'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,margin:0}}>مرحباً، {user?.name || 'المربية'}</h1>
            <p style={{fontSize:13,color:MUT,margin:'4px 0 0'}}>لوحة تحكم المربية</p>
          </div>
          <Link href="/dashboard"><button style={{background:'rgba(255,255,255,0.06)',border:'1px solid '+BD,borderRadius:10,padding:'8px 16px',color:DIM,fontSize:13,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:6}}><ChevronLeft size={16} /> الرئيسية</button></Link>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginBottom:24}}>
          {statCards.map((s,i) => (
            <div key={i} style={{background:CARD,border:'1px solid '+BD,borderRadius:14,padding:'18px 16px',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:s.color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}><s.icon size={22} color={s.color} /></div>
              <div><div style={{fontSize:20,fontWeight:800}}>{s.value}</div><div style={{fontSize:11,color:MUT}}>{s.label}</div></div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:10,border:'1px solid '+(activeTab===t.id?PC+'40':BD),background:activeTab===t.id?PC+'15':'transparent',color:activeTab===t.id?PC:DIM,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}><t.Ic size={15} />{t.label}</button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:16}}>
            <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
              <h3 style={{fontSize:16,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><Baby size={18} color={PC} /> الفصول</h3>
              {classes.length === 0 ? <p style={{color:MUT,fontSize:13}}>لا توجد فصول حالياً</p> :
                classes.slice(0,5).map((c:any,i:number) => (
                  <div key={i} style={{padding:'10px 0',borderBottom:i<classes.length-1?'1px solid '+BD:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div><div style={{fontSize:14,fontWeight:600}}>{c.name}</div><div style={{fontSize:11,color:MUT}}>{c.age_group || c.description || ''}</div></div>
                    <div style={{fontSize:12,color:PC}}>{c.students_count || 0} طفل</div>
                  </div>
                ))
              }
            </div>
            <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
              <h3 style={{fontSize:16,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><Activity size={18} color={'#10B981'} /> الانشطة اليومية</h3>
              {[
                { Ic: Utensils, label: 'وجبة الافطار', time: '8:00', color: '#F59E0B' },
                { Ic: Sun, label: 'النشاط الصباحي', time: '9:00', color: '#3B82F6' },
                { Ic: Utensils, label: 'وجبة الغداء', time: '12:00', color: '#F59E0B' },
                { Ic: Moon, label: 'وقت القيلولة', time: '13:00', color: '#A78BFA' },
                { Ic: Heart, label: 'النشاط المسائي', time: '15:00', color: PC },
              ].map((a,i) => (
                <div key={i} style={{padding:'8px 0',borderBottom:i<4?'1px solid '+BD:'none',display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:30,height:30,borderRadius:8,background:a.color+'18',display:'flex',alignItems:'center',justifyContent:'center'}}><a.Ic size={14} color={a.color} /></div>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{a.label}</div></div>
                  <div style={{fontSize:11,color:MUT}}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'children' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>الاطفال</h3>
            <select value={selectedClass} onChange={e => loadChildren(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'10px 14px',borderRadius:10,fontSize:13,fontFamily:'inherit',marginBottom:16}}>
              <option value="">اختر الفصل</option>
              {classes.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {students.length === 0 ? <p style={{color:MUT,fontSize:13,textAlign:'center',padding:20}}>اختر فصلاً لعرض الاطفال</p> :
              <div style={{display:'grid',gap:8}}>
                {students.map((s:any,i:number) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'rgba(255,255,255,0.02)',borderRadius:10,border:'1px solid '+BD}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:PC+'20',display:'flex',alignItems:'center',justifyContent:'center'}}><Baby size={16} color={PC} /></div>
                    <div><div style={{fontSize:13,fontWeight:600}}>{s.name || s.student_name}</div><div style={{fontSize:11,color:MUT}}>{s.age ? s.age+' سنوات' : ''}</div></div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><FileText size={18} color={PC} /> التقارير اليومية</h3>
            <p style={{color:MUT,fontSize:13,textAlign:'center',padding:40}}>سيتم تفعيل التقارير اليومية في المرحلة 4 (نظام الحضانة)</p>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><ClipboardCheck size={18} color={PC} /> تسجيل الحضور</h3>
            <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
              <select value={selectedClass} onChange={e => loadChildren(e.target.value)} style={{flex:1,minWidth:200,background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'10px 14px',borderRadius:10,fontSize:13,fontFamily:'inherit'}}>
                <option value="">اختر الفصل</option>
                {classes.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} style={{background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'10px 14px',borderRadius:10,fontSize:13,fontFamily:'inherit'}} />
            </div>
            {students.length > 0 && (
              <>
                <div style={{display:'grid',gap:8,marginBottom:16}}>
                  {students.map((s:any) => (
                    <div key={s.id} onClick={() => toggleAtt(s.id)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'rgba(255,255,255,0.02)',borderRadius:10,border:'1px solid '+BD,cursor:'pointer'}}>
                      <span style={{fontSize:13,fontWeight:600}}>{s.name || s.student_name}</span>
                      <div style={{width:28,height:28,borderRadius:8,background:attendance[s.id]==='present'?'#10B981':'#EF4444',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontWeight:700}}>{attendance[s.id]==='present'?'\u2713':'\u2717'}</div>
                    </div>
                  ))}
                </div>
                <button onClick={saveAttendance} disabled={savingAtt} style={{width:'100%',background:'linear-gradient(135deg,'+PC+',#DB2777)',border:'none',borderRadius:12,padding:12,color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit',opacity:savingAtt?0.6:1}}>{savingAtt?'جارٍ الحفظ...':'حفظ الحضور'}</button>
                {attMsg && <div style={{marginTop:10,padding:'8px 12px',borderRadius:8,background:attMsg.includes('نجاح')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:attMsg.includes('نجاح')?'#10B981':'#EF4444',fontSize:12}}>{attMsg}</div>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
