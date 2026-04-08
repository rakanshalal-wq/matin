'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Users, FileText, Camera, ChevronLeft, Baby, Sun, Moon, Utensils, Activity, Thermometer, Smile, Frown, Meh, Plus } from 'lucide-react';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C', DARK = '#06060E', CARD = 'rgba(255,255,255,0.03)', BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)', MUT = 'rgba(238,238,245,0.3)';
const PC = '#EC4899';

const EATING = [{v:'excellent',l:'ممتاز',c:'#10B981'},{v:'good',l:'جيد',c:'#3B82F6'},{v:'normal',l:'عادي',c:'#F59E0B'},{v:'poor',l:'ضعيف',c:'#EF4444'}];
const SLEEPING = [{v:'excellent',l:'ممتاز',c:'#10B981'},{v:'good',l:'جيد',c:'#3B82F6'},{v:'normal',l:'عادي',c:'#F59E0B'},{v:'poor',l:'لم ينم',c:'#EF4444'}];
const MOODS = [{v:'happy',l:'سعيد',Ic:Smile,c:'#10B981'},{v:'normal',l:'عادي',Ic:Meh,c:'#F59E0B'},{v:'sad',l:'حزين',Ic:Frown,c:'#EF4444'}];
const HEALTH = [{v:'good',l:'جيد',c:'#10B981'},{v:'sick',l:'مريض',c:'#EF4444'},{v:'recovering',l:'يتعافى',c:'#F59E0B'}];

export default function NurseryAdminPage() {
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [cameras, setCameras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports'|'new-report'|'cameras'|'children'>('reports');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [form, setForm] = useState<any>({ eating:'normal', sleeping:'normal', mood:'happy', health:'good', temperature:'', activities:'', notes:'', eating_notes:'', sleeping_duration:'' });
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
      const [studentsRes, reportsRes, camerasRes] = await Promise.all([
        fetch('/api/students', { headers: getHeaders() }),
        fetch('/api/nursery-reports', { headers: getHeaders() }),
        fetch('/api/nursery-cameras', { headers: getHeaders() }),
      ]);
      if (studentsRes.ok) { const d = await studentsRes.json(); setStudents(d.students || d.data || []); }
      if (reportsRes.ok) { const d = await reportsRes.json(); setReports(d.reports || []); }
      if (camerasRes.ok) { const d = await camerasRes.json(); setCameras(d.cameras || []); }
    } catch {}
    setLoading(false);
  };

  const submitReport = async () => {
    if (!selectedStudent) { setMsg('اختر طفلاً'); return; }
    setSaving(true); setMsg('');
    try {
      const r = await fetch('/api/nursery-reports', {
        method: 'POST', headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: selectedStudent, ...form, sleeping_duration: form.sleeping_duration ? parseInt(form.sleeping_duration) : null, temperature: form.temperature ? parseFloat(form.temperature) : null })
      });
      if (r.ok) { setMsg('تم حفظ التقرير بنجاح'); loadAll(); setForm({ eating:'normal', sleeping:'normal', mood:'happy', health:'good', temperature:'', activities:'', notes:'', eating_notes:'', sleeping_duration:'' }); }
      else setMsg('حدث خطأ');
    } catch { setMsg('حدث خطأ'); }
    setSaving(false);
  };

  const tabs = [
    { id: 'reports', label: 'التقارير', Ic: FileText },
    { id: 'new-report', label: 'تقرير جديد', Ic: Plus },
    { id: 'cameras', label: 'الكاميرات', Ic: Camera },
    { id: 'children', label: 'الاطفال', Ic: Baby },
  ];

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:DARK,color:'#fff',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}><div style={{textAlign:'center'}}><Heart size={48} color={PC} /><div style={{marginTop:16,color:DIM}}>جارٍ التحميل...</div></div></div>;

  return (
    <div style={{fontFamily:"'IBM Plex Sans Arabic',sans-serif",direction:'rtl',background:DARK,color:'#EEEEF5',minHeight:'100vh'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,margin:0,display:'flex',alignItems:'center',gap:10}}><Heart size={24} color={PC} /> إدارة الحضانة</h1>
            <p style={{fontSize:13,color:MUT,margin:'4px 0 0'}}>التقارير اليومية والكاميرات</p>
          </div>
          <Link href="/dashboard"><button style={{background:'rgba(255,255,255,0.06)',border:'1px solid '+BD,borderRadius:10,padding:'8px 16px',color:DIM,fontSize:13,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:6}}><ChevronLeft size={16} /> الرئيسية</button></Link>
        </div>

        <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:10,border:'1px solid '+(activeTab===t.id?PC+'40':BD),background:activeTab===t.id?PC+'15':'transparent',color:activeTab===t.id?PC:DIM,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}><t.Ic size={15} />{t.label}</button>
          ))}
        </div>

        {activeTab === 'new-report' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:24,maxWidth:700}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>تقرير يومي جديد</h3>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,color:MUT,marginBottom:6,display:'block'}}>الطفل</label>
              <select value={selectedStudent} onChange={e=>setSelectedStudent(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'10px 14px',borderRadius:10,fontSize:13,fontFamily:'inherit'}}>
                <option value="">اختر الطفل</option>
                {students.map((s:any) => <option key={s.id} value={s.id}>{s.name || s.student_name}</option>)}
              </select>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
              <div>
                <label style={{fontSize:12,color:MUT,marginBottom:6,display:'block'}}><Utensils size={14} style={{display:'inline',verticalAlign:'middle'}} /> الاكل</label>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{EATING.map(e => (
                  <button key={e.v} onClick={()=>setForm((p:any)=>({...p,eating:e.v}))} style={{padding:'6px 12px',borderRadius:8,border:'1px solid '+(form.eating===e.v?e.c:BD),background:form.eating===e.v?e.c+'15':'transparent',color:form.eating===e.v?e.c:DIM,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{e.l}</button>
                ))}</div>
              </div>
              <div>
                <label style={{fontSize:12,color:MUT,marginBottom:6,display:'block'}}><Moon size={14} style={{display:'inline',verticalAlign:'middle'}} /> النوم</label>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{SLEEPING.map(e => (
                  <button key={e.v} onClick={()=>setForm((p:any)=>({...p,sleeping:e.v}))} style={{padding:'6px 12px',borderRadius:8,border:'1px solid '+(form.sleeping===e.v?e.c:BD),background:form.sleeping===e.v?e.c+'15':'transparent',color:form.sleeping===e.v?e.c:DIM,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{e.l}</button>
                ))}</div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
              <div>
                <label style={{fontSize:12,color:MUT,marginBottom:6,display:'block'}}>المزاج</label>
                <div style={{display:'flex',gap:8}}>{MOODS.map(m => (
                  <button key={m.v} onClick={()=>setForm((p:any)=>({...p,mood:m.v}))} style={{display:'flex',flexDirection:'column' as const,alignItems:'center',gap:4,padding:'8px 14px',borderRadius:10,border:'1px solid '+(form.mood===m.v?m.c:BD),background:form.mood===m.v?m.c+'15':'transparent',color:form.mood===m.v?m.c:DIM,fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}><m.Ic size={20} />{m.l}</button>
                ))}</div>
              </div>
              <div>
                <label style={{fontSize:12,color:MUT,marginBottom:6,display:'block'}}>الصحة</label>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{HEALTH.map(h => (
                  <button key={h.v} onClick={()=>setForm((p:any)=>({...p,health:h.v}))} style={{padding:'6px 12px',borderRadius:8,border:'1px solid '+(form.health===h.v?h.c:BD),background:form.health===h.v?h.c+'15':'transparent',color:form.health===h.v?h.c:DIM,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{h.l}</button>
                ))}</div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
              <div>
                <label style={{fontSize:12,color:MUT,marginBottom:6,display:'block'}}><Thermometer size={14} style={{display:'inline',verticalAlign:'middle'}} /> الحرارة</label>
                <input type="number" step="0.1" placeholder="36.5" value={form.temperature} onChange={e=>setForm((p:any)=>({...p,temperature:e.target.value}))} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'8px 10px',borderRadius:8,fontSize:13,fontFamily:'inherit',boxSizing:'border-box' as const}} />
              </div>
              <div>
                <label style={{fontSize:12,color:MUT,marginBottom:6,display:'block'}}>مدة النوم (دقيقة)</label>
                <input type="number" placeholder="90" value={form.sleeping_duration} onChange={e=>setForm((p:any)=>({...p,sleeping_duration:e.target.value}))} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'8px 10px',borderRadius:8,fontSize:13,fontFamily:'inherit',boxSizing:'border-box' as const}} />
              </div>
            </div>

            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,color:MUT,marginBottom:6,display:'block'}}><Activity size={14} style={{display:'inline',verticalAlign:'middle'}} /> الانشطة</label>
              <input placeholder="الانشطة اللي شارك فيها الطفل..." value={form.activities} onChange={e=>setForm((p:any)=>({...p,activities:e.target.value}))} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'8px 10px',borderRadius:8,fontSize:13,fontFamily:'inherit',boxSizing:'border-box' as const}} />
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,color:MUT,marginBottom:6,display:'block'}}>ملاحظات</label>
              <textarea placeholder="ملاحظات إضافية..." value={form.notes} onChange={e=>setForm((p:any)=>({...p,notes:e.target.value}))} rows={3} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'8px 10px',borderRadius:8,fontSize:13,fontFamily:'inherit',resize:'vertical' as const,boxSizing:'border-box' as const}} />
            </div>

            {msg && <div style={{marginBottom:12,padding:'8px 12px',borderRadius:8,background:msg.includes('نجاح')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:msg.includes('نجاح')?'#10B981':'#EF4444',fontSize:12}}>{msg}</div>}
            <button onClick={submitReport} disabled={saving} style={{width:'100%',background:'linear-gradient(135deg,'+PC+',#DB2777)',border:'none',borderRadius:12,padding:13,color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit',opacity:saving?0.6:1}}>{saving?'جارٍ الحفظ...':'حفظ التقرير'}</button>
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>التقارير اليومية</h3>
            {reports.length === 0 ? <p style={{color:MUT,fontSize:13,textAlign:'center',padding:40}}>لا توجد تقارير بعد</p> :
              <div style={{display:'grid',gap:12}}>
                {reports.map((r:any,i:number) => (
                  <div key={i} style={{background:'rgba(255,255,255,0.02)',border:'1px solid '+BD,borderRadius:12,padding:16}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:36,height:36,borderRadius:'50%',background:PC+'20',display:'flex',alignItems:'center',justifyContent:'center'}}><Baby size={16} color={PC} /></div>
                        <div><div style={{fontSize:14,fontWeight:700}}>{r.student_name || 'طفل'}</div><div style={{fontSize:11,color:MUT}}>{r.report_date}</div></div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:12,flexWrap:'wrap',fontSize:12}}>
                      <span style={{padding:'4px 10px',borderRadius:6,background:'rgba(255,255,255,0.05)'}}>الاكل: {r.eating}</span>
                      <span style={{padding:'4px 10px',borderRadius:6,background:'rgba(255,255,255,0.05)'}}>النوم: {r.sleeping}</span>
                      <span style={{padding:'4px 10px',borderRadius:6,background:'rgba(255,255,255,0.05)'}}>المزاج: {r.mood}</span>
                      <span style={{padding:'4px 10px',borderRadius:6,background:'rgba(255,255,255,0.05)'}}>الصحة: {r.health}</span>
                      {r.temperature && <span style={{padding:'4px 10px',borderRadius:6,background:'rgba(255,255,255,0.05)'}}>الحرارة: {r.temperature}</span>}
                    </div>
                    {r.notes && <div style={{marginTop:8,fontSize:12,color:DIM}}>{r.notes}</div>}
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {activeTab === 'cameras' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:16,display:'flex',alignItems:'center',gap:8}}><Camera size={18} color={PC} /> كاميرات المراقبة</h3>
            {cameras.length === 0 ? <p style={{color:MUT,fontSize:13,textAlign:'center',padding:40}}>لا توجد كاميرات مسجلة. يمكن للمدير إضافة كاميرات من لوحة التحكم.</p> :
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:12}}>
                {cameras.map((c:any,i:number) => (
                  <div key={i} style={{background:'#000',borderRadius:12,overflow:'hidden',border:'1px solid '+BD}}>
                    <div style={{aspectRatio:'16/9',display:'flex',alignItems:'center',justifyContent:'center',color:MUT}}><Camera size={32} /><span style={{marginRight:8,fontSize:13}}>بث مباشر</span></div>
                    <div style={{padding:'10px 14px'}}><div style={{fontSize:13,fontWeight:600}}>{c.name}</div><div style={{fontSize:11,color:MUT}}>{c.location || ''}</div></div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {activeTab === 'children' && (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>الاطفال المسجلون</h3>
            {students.length === 0 ? <p style={{color:MUT,fontSize:13,textAlign:'center',padding:40}}>لا يوجد أطفال مسجلون</p> :
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:10}}>
                {students.map((s:any,i:number) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'rgba(255,255,255,0.02)',borderRadius:10,border:'1px solid '+BD}}>
                    <div style={{width:40,height:40,borderRadius:'50%',background:PC+'20',display:'flex',alignItems:'center',justifyContent:'center'}}><Baby size={18} color={PC} /></div>
                    <div><div style={{fontSize:14,fontWeight:600}}>{s.name || s.student_name}</div><div style={{fontSize:11,color:MUT}}>{s.age ? s.age+' سنوات' : s.class_name || ''}</div></div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
}
