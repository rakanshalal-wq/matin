'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
export default function ReportsPage(){
  const [stats,setStats]=useState<any>({});
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState('');
  useEffect(()=>{load();},[]);
  const load=async()=>{
    try{
      const [s,a,g,h]=await Promise.all([
        fetch('/api/dashboard/stats',{headers:getH(),credentials:'include'}).then(r=>r.json()),
        fetch('/api/attendance?summary=true',{headers:getH(),credentials:'include'}).then(r=>r.json()),
        fetch('/api/grades',{headers:getH(),credentials:'include'}).then(r=>r.json()),
        fetch('/api/homework',{headers:getH(),credentials:'include'}).then(r=>r.json()),
      ]);
      setStats({...s,attendance:a,grades:Array.isArray(g)?g:g.grades||[],homework:Array.isArray(h)?h:h.homework||[]});
    }catch{}finally{setLoading(false);}
  };
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const exportReport=async(type:string)=>{
    showToast(`جاري تصدير تقرير ${type}...`);
    try{const r=await fetch(`/api/reports?type=${type}&format=csv`,{headers:getH(),credentials:'include'});if(r.ok){const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`report_${type}_${new Date().toISOString().slice(0,10)}.csv`;a.click();showToast('تم التصدير ✓');}else showToast('فشل التصدير');}
    catch{showToast('خطأ في التصدير');}
  };
  const grades=stats.grades||[];
  const avgGrade=grades.length?grades.reduce((s:number,g:any)=>s+(g.grade||0),0)/grades.length:0;
  const passRate=grades.length?(grades.filter((g:any)=>(g.grade/(g.max_grade||100))>=0.6).length/grades.length)*100:0;
  const REPORTS=[
    {id:'students',icon:'👨‍🎓',title:'تقرير الطلاب',desc:'بيانات الطلاب والتسجيل',color:'#3B82F6'},
    {id:'attendance',icon:'✅',title:'تقرير الحضور',desc:'إحصائيات الحضور والغياب',color:'#22C55E'},
    {id:'grades',icon:'🏆',title:'تقرير الدرجات',desc:'نتائج الطلاب والمتوسطات',color:G},
    {id:'teachers',icon:'👨‍🏫',title:'تقرير المعلمين',desc:'بيانات الكادر التعليمي',color:'#8B5CF6'},
    {id:'financial',icon:'💰',title:'التقرير المالي',desc:'الإيرادات والمصروفات',color:'#F59E0B'},
    {id:'homework',icon:'📋',title:'تقرير الواجبات',desc:'الواجبات والتسليمات',color:'#EC4899'},
  ];
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="mb-6"><h1 className="text-2xl font-black text-white">📊 التقارير والإحصائيات</h1><p className="text-gray-400 text-sm mt-1">نظرة شاملة على أداء المؤسسة</p></div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :<>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {l:'إجمالي الطلاب',v:stats.total_students||0,c:'#3B82F6',icon:'👨‍🎓'},
            {l:'المعلمون',v:stats.total_teachers||0,c:'#8B5CF6',icon:'👨‍🏫'},
            {l:'متوسط الدرجات',v:`${avgGrade.toFixed(1)}%`,c:G,icon:'🏆'},
            {l:'نسبة النجاح',v:`${passRate.toFixed(0)}%`,c:'#22C55E',icon:'✅'},
          ].map((s,i)=>(
            <div key={i} className="rounded-2xl p-5" style={{background:CARD,border:`1px solid ${BORDER}`}}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{s.icon}</span>
                <div className="text-3xl font-black" style={{color:s.c}}>{s.v}</div>
              </div>
              <div className="text-gray-400 text-sm">{s.l}</div>
            </div>
          ))}
        </div>
        <h2 className="text-lg font-bold text-white mb-4">تصدير التقارير</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORTS.map(r=>(
            <div key={r.id} className="rounded-2xl p-5 flex items-center gap-4" style={{background:CARD,border:`1px solid ${BORDER}`}}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:`${r.color}22`}}>{r.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-white">{r.title}</div>
                <div className="text-gray-400 text-xs mt-0.5">{r.desc}</div>
              </div>
              <button onClick={()=>exportReport(r.id)} className="px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0" style={{background:`${r.color}22`,color:r.color}}>تصدير</button>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}
