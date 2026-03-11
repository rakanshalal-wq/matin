'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
export default function SchedulesPage(){
  const [schedules,setSchedules]=useState<any[]>([]);
  const [classes,setClasses]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [classId,setClassId]=useState('');
  const [toast,setToast]=useState('');
  const inp={background:'rgba(255,255,255,0.06)',border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
  useEffect(()=>{loadClasses();},[]);
  useEffect(()=>{if(classId)load();},[classId]);
  const load=async()=>{
    setLoading(true);
    try{const r=await fetch(`/api/schedules?class_id=${classId}`,{headers:getH(),credentials:'include'});const d=await r.json();setSchedules(Array.isArray(d)?d:[]);}
    catch{}finally{setLoading(false);}
  };
  const loadClasses=async()=>{try{const r=await fetch('/api/classes',{headers:getH()});const d=await r.json();setClasses(Array.isArray(d)?d:[]);if(Array.isArray(d)&&d.length>0)setClassId(d[0].id);}catch{}};
  const getSlots=(day:string)=>schedules.filter(s=>s.day_of_week===day||s.day===day).sort((a,b)=>(a.start_time||'').localeCompare(b.start_time||''));
  const colors=['#C9A84C','#3B82F6','#22C55E','#8B5CF6','#F59E0B','#EC4899','#14B8A6'];
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">📅 الجداول الدراسية</h1></div>
      </div>
      <div className="flex gap-3 mb-6">
        <select value={classId} onChange={e=>setClassId(e.target.value)} style={{...inp,maxWidth:250}}>
          <option value="">اختر الفصل</option>
          {classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {!classId?<div className="text-center py-20 text-gray-500">اختر فصلاً لعرض الجدول</div>
      :loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :(
        <div className="grid grid-cols-5 gap-3">
          {DAYS.map((day,di)=>(
            <div key={day} className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
              <div className="px-3 py-2 text-center text-sm font-bold" style={{background:`${G}22`,color:G}}>{day}</div>
              <div className="p-2 flex flex-col gap-2">
                {getSlots(day).length===0?<div className="text-center py-4 text-gray-600 text-xs">لا يوجد</div>
                :getSlots(day).map((s:any,i:number)=>(
                  <div key={s.id} className="rounded-xl p-2 text-xs" style={{background:`${colors[(di*3+i)%colors.length]}22`,border:`1px solid ${colors[(di*3+i)%colors.length]}44`}}>
                    <div className="font-bold" style={{color:colors[(di*3+i)%colors.length]}}>{s.subject||s.subject_name||'—'}</div>
                    <div className="text-gray-400">{s.start_time||''} - {s.end_time||''}</div>
                    <div className="text-gray-500">{s.teacher_name||''}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
