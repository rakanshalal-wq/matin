'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Award, Calendar, Clock, BarChart3, FileText, ChevronLeft, CheckCircle, Target } from 'lucide-react';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C', DARK = '#06060E', CARD = 'rgba(255,255,255,0.03)', BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)', MUT = 'rgba(238,238,245,0.3)';

export default function TraineeDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [courses, setCourses] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview'|'courses'|'grades'|'assignments'>('overview');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, gradesRes, hwRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers: getHeaders() }),
        fetch('/api/grades', { headers: getHeaders() }),
        fetch('/api/homework', { headers: getHeaders() }),
      ]);
      if (statsRes.ok) { const d = await statsRes.json(); setStats(d.stats || d); }
      if (gradesRes.ok) { const d = await gradesRes.json(); setGrades(d.grades || d.data || []); }
      if (hwRes.ok) { const d = await hwRes.json(); setHomework(d.homework || d.data || []); }
    } catch {}
    setLoading(false);
  };

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:DARK,color:'#fff',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}><div style={{textAlign:'center'}}><Target size={48} color={G} /><div style={{marginTop:16,color:DIM}}>جارٍ التحميل...</div></div></div>;

  const statCards = [
    { icon: BookOpen, label: 'البرامج المسجلة', value: stats.classes_count || 0, color: '#3B82F6' },
    { icon: BarChart3, label: 'المعدل العام', value: stats.average_grade || '-', color: '#10B981' },
    { icon: CheckCircle, label: 'المهام المنجزة', value: stats.completed_homework || 0, color: '#F59E0B' },
    { icon: Award, label: 'الشهادات', value: stats.certificates || 0, color: '#A78BFA' },
  ];

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', Ic: BarChart3 },
    { id: 'courses', label: 'برامجي', Ic: BookOpen },
    { id: 'grades', label: 'الدرجات', Ic: Award },
    { id: 'assignments', label: 'المهام', Ic: FileText },
  ];

  return (
    <div style={{fontFamily:"'IBM Plex Sans Arabic',sans-serif",direction:'rtl',background:DARK,color:'#EEEEF5',minHeight:'100vh'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,margin:0}}>مرحباً، {user?.name || 'المتدرب'}</h1>
            <p style={{fontSize:13,color:MUT,margin:'4px 0 0'}}>لوحة تحكم المتدرب</p>
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
              <h3 style={{fontSize:16,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><FileText size={18} color={G} /> المهام القادمة</h3>
              {homework.length === 0 ? <p style={{color:MUT,fontSize:13}}>لا توجد مهام حالياً</p> :
                homework.slice(0,5).map((h:any,i:number) => (
                  <div key={i} style={{padding:'10px 0',borderBottom:i<Math.min(homework.length,5)-1?'1px solid '+BD:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div><div style={{fontSize:14,fontWeight:600}}>{h.title}</div><div style={{fontSize:11,color:MUT}}>{h.subject || ''}</div></div>
                    <div style={{fontSize:11,color:h.status==='completed'?'#10B981':'#F59E0B',background:h.status==='completed'?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)',padding:'4px 10px',borderRadius:6}}>{h.status==='completed'?'مكتمل':'قيد التنفيذ'}</div>
                  </div>
                ))
              }
            </div>
            <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
              <h3 style={{fontSize:16,fontWeight:700,marginBottom:14,display:'flex',alignItems:'center',gap:8}}><Award size={18} color={'#A78BFA'} /> آخر الدرجات</h3>
              {grades.length === 0 ? <p style={{color:MUT,fontSize:13}}>لا توجد درجات بعد</p> :
                grades.slice(0,5).map((g:any,i:number) => (
                  <div key={i} style={{padding:'10px 0',borderBottom:i<Math.min(grades.length,5)-1?'1px solid '+BD:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontSize:14,fontWeight:600}}>{g.subject || g.exam_name || 'اختبار'}</div>
                    <div style={{fontSize:15,fontWeight:800,color:G}}>{g.score || g.grade || '-'}</div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>جميع الدرجات</h3>
            {grades.length === 0 ? <p style={{color:MUT,fontSize:13,textAlign:'center',padding:40}}>لا توجد درجات</p> :
              <div style={{display:'grid',gap:8}}>
                {grades.map((g:any,i:number) => (
                  <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',background:'rgba(255,255,255,0.02)',borderRadius:10,border:'1px solid '+BD}}>
                    <div><div style={{fontSize:14,fontWeight:600}}>{g.subject || g.exam_name || 'اختبار'}</div><div style={{fontSize:11,color:MUT}}>{g.date || g.created_at?.split('T')[0] || ''}</div></div>
                    <div style={{fontSize:18,fontWeight:800,color:G}}>{g.score || g.grade || '-'}</div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {activeTab === 'assignments' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>المهام والواجبات</h3>
            {homework.length === 0 ? <p style={{color:MUT,fontSize:13,textAlign:'center',padding:40}}>لا توجد مهام</p> :
              <div style={{display:'grid',gap:8}}>
                {homework.map((h:any,i:number) => (
                  <div key={i} style={{padding:'14px 16px',background:'rgba(255,255,255,0.02)',borderRadius:12,border:'1px solid '+BD}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <div style={{fontSize:14,fontWeight:700}}>{h.title}</div>
                      <div style={{fontSize:11,color:h.status==='completed'?'#10B981':'#F59E0B',background:h.status==='completed'?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)',padding:'4px 10px',borderRadius:6}}>{h.status==='completed'?'مكتمل':'قيد التنفيذ'}</div>
                    </div>
                    <div style={{fontSize:12,color:DIM}}>{h.description || ''}</div>
                    {h.due_date && <div style={{fontSize:11,color:MUT,marginTop:6,display:'flex',alignItems:'center',gap:4}}><Clock size={12} /> تسليم: {h.due_date.split('T')[0]}</div>}
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {activeTab === 'courses' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>البرامج التدريبية المسجلة</h3>
            <p style={{color:MUT,fontSize:13,textAlign:'center',padding:40}}>سيتم عرض البرامج المسجلة هنا</p>
          </div>
        )}
      </div>
    </div>
  );
}
