'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Users, BarChart3, ChevronLeft, Eye, Shield, ClipboardCheck, FileText, TrendingUp, UserCheck } from 'lucide-react';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C', DARK = '#06060E', CARD = 'rgba(255,255,255,0.03)', BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)', MUT = 'rgba(238,238,245,0.3)';

export default function SupervisorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview'|'halaqat'|'teachers'|'reports'>('overview');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, classesRes, teachersRes, studentsRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers: getHeaders() }),
        fetch('/api/classes', { headers: getHeaders() }),
        fetch('/api/teachers', { headers: getHeaders() }).catch(() => null),
        fetch('/api/students', { headers: getHeaders() }).catch(() => null),
      ]);
      if (statsRes.ok) { const d = await statsRes.json(); setStats(d.stats || d); }
      if (classesRes.ok) { const d = await classesRes.json(); setClasses(d.classes || d.data || []); }
      if (teachersRes && teachersRes.ok) { const d = await teachersRes.json(); setTeachers(d.teachers || d.data || []); }
      if (studentsRes && studentsRes.ok) { const d = await studentsRes.json(); setStudents(d.students || d.data || []); }
    } catch {}
    setLoading(false);
  };

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:DARK,color:'#fff',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}><div style={{textAlign:'center'}}><Shield size={48} color={G} /><div style={{marginTop:16,color:DIM}}>جارٍ التحميل...</div></div></div>;

  const statCards = [
    { icon: BookOpen, label: 'الحلقات', value: stats.classes_count || classes.length || 0, color: '#3B82F6' },
    { icon: UserCheck, label: 'المحفّظون', value: teachers.length || stats.teachers_count || 0, color: '#059669' },
    { icon: Users, label: 'الطلاب', value: stats.students_count || students.length || 0, color: '#F59E0B' },
    { icon: TrendingUp, label: 'نسبة الحضور', value: stats.attendance_rate || '-', color: '#A78BFA' },
  ];

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', Ic: BarChart3 },
    { id: 'halaqat', label: 'الحلقات', Ic: BookOpen },
    { id: 'teachers', label: 'المحفّظون', Ic: UserCheck },
    { id: 'reports', label: 'التقارير', Ic: FileText },
  ];

  return (
    <div style={{fontFamily:"'IBM Plex Sans Arabic',sans-serif",direction:'rtl',background:DARK,color:'#EEEEF5',minHeight:'100vh'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,margin:0}}>مرحباً، {user?.name || 'المشرف'}</h1>
            <p style={{fontSize:13,color:MUT,margin:'4px 0 0'}}>لوحة تحكم مشرف الحلقات</p>
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
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:10,border:'1px solid '+(activeTab===t.id?G+'40':BD),background:activeTab===t.id?G+'15':'transparent',color:activeTab===t.id?G:DIM,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}><t.Ic size={15} />{t.label}</button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:16}}>
            <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
              <h3 style={{fontSize:16,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><BookOpen size={18} color={G} /> الحلقات النشطة</h3>
              {classes.length === 0 ? <p style={{color:MUT,fontSize:13}}>لا توجد حلقات</p> :
                classes.slice(0,6).map((c:any,i:number) => (
                  <div key={i} style={{padding:'10px 0',borderBottom:i<Math.min(classes.length,6)-1?'1px solid '+BD:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div><div style={{fontSize:14,fontWeight:600}}>{c.name}</div><div style={{fontSize:11,color:MUT}}>{c.teacher_name || c.schedule || ''}</div></div>
                    <div style={{fontSize:12,color:G}}>{c.students_count || 0} طالب</div>
                  </div>
                ))
              }
            </div>
            <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
              <h3 style={{fontSize:16,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><UserCheck size={18} color={'#059669'} /> المحفّظون</h3>
              {teachers.length === 0 ? <p style={{color:MUT,fontSize:13}}>لا يوجد محفّظون مسجلون</p> :
                teachers.slice(0,6).map((t:any,i:number) => (
                  <div key={i} style={{padding:'10px 0',borderBottom:i<Math.min(teachers.length,6)-1?'1px solid '+BD:'none',display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:32,height:32,borderRadius:'50%',background:'#059669'+'20',display:'flex',alignItems:'center',justifyContent:'center'}}><UserCheck size={14} color={'#059669'} /></div>
                    <div><div style={{fontSize:13,fontWeight:600}}>{t.name}</div><div style={{fontSize:11,color:MUT}}>{t.email || t.phone || ''}</div></div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === 'halaqat' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>جميع الحلقات</h3>
            {classes.length === 0 ? <p style={{color:MUT,fontSize:13,textAlign:'center',padding:40}}>لا توجد حلقات</p> :
              <div style={{display:'grid',gap:12}}>
                {classes.map((c:any,i:number) => (
                  <div key={i} style={{background:'rgba(255,255,255,0.02)',border:'1px solid '+BD,borderRadius:12,padding:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <div style={{width:40,height:40,borderRadius:10,background:G+'18',display:'flex',alignItems:'center',justifyContent:'center'}}><BookOpen size={18} color={G} /></div>
                      <div><div style={{fontSize:14,fontWeight:600}}>{c.name}</div><div style={{fontSize:11,color:MUT}}>المحفّظ: {c.teacher_name || 'غير محدد'} | {c.schedule || ''}</div></div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <div style={{fontSize:13,color:G,fontWeight:600}}>{c.students_count || 0} طالب</div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {activeTab === 'teachers' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>المحفّظون</h3>
            {teachers.length === 0 ? <p style={{color:MUT,fontSize:13,textAlign:'center',padding:40}}>لا يوجد محفّظون</p> :
              <div style={{display:'grid',gap:8}}>
                {teachers.map((t:any,i:number) => (
                  <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',background:'rgba(255,255,255,0.02)',borderRadius:10,border:'1px solid '+BD}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <div style={{width:40,height:40,borderRadius:'50%',background:'#059669'+'20',display:'flex',alignItems:'center',justifyContent:'center'}}><UserCheck size={18} color={'#059669'} /></div>
                      <div><div style={{fontSize:14,fontWeight:600}}>{t.name}</div><div style={{fontSize:11,color:MUT}}>{t.email || ''} {t.phone ? '| '+t.phone : ''}</div></div>
                    </div>
                    <div style={{fontSize:12,color:DIM}}>{t.classes_count || 0} حلقة</div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><FileText size={18} color={G} /> التقارير</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12}}>
              {[
                { title: 'تقرير الحضور الشهري', desc: 'ملخص حضور جميع الحلقات', Ic: ClipboardCheck, color: '#3B82F6' },
                { title: 'تقرير أداء المحفّظين', desc: 'تقييم أداء المحفّظين', Ic: TrendingUp, color: '#059669' },
                { title: 'تقرير تقدم الطلاب', desc: 'ملخص تقدم الحفظ والمراجعة', Ic: BarChart3, color: '#F59E0B' },
              ].map((r,i) => (
                <div key={i} style={{background:'rgba(255,255,255,0.02)',border:'1px solid '+BD,borderRadius:12,padding:16,cursor:'pointer'}}>
                  <div style={{width:40,height:40,borderRadius:10,background:r.color+'18',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10}}><r.Ic size={20} color={r.color} /></div>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{r.title}</div>
                  <div style={{fontSize:12,color:MUT}}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
