'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
export default function AttendancePage(){
  const [records,setRecords]=useState<any[]>([]);
  const [classes,setClasses]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [classFilter,setClassFilter]=useState('');
  const [dateFilter,setDateFilter]=useState(new Date().toISOString().slice(0,10));
  const [toast,setToast]=useState('');
  const [saving,setSaving]=useState(false);
  useEffect(()=>{load();loadClasses();},[dateFilter,classFilter]);
  const load=async()=>{
    setLoading(true);
    try{const params=new URLSearchParams();if(dateFilter)params.set('date',dateFilter);if(classFilter)params.set('class_id',classFilter);const r=await fetch(`/api/attendance?${params}`,{headers:getH(),credentials:'include'});const d=await r.json();setRecords(Array.isArray(d)?d:d.attendance||[]);}
    catch{}finally{setLoading(false);}
  };
  const loadClasses=async()=>{try{const r=await fetch('/api/classes',{headers:getH()});const d=await r.json();setClasses(Array.isArray(d)?d:[]);}catch{}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const markAttendance=async(studentId:string,status:string)=>{
    setSaving(true);
    try{const r=await fetch('/api/attendance',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({student_id:studentId,date:dateFilter,status,class_id:classFilter})});if(r.ok){showToast('تم التسجيل ✓');load();}else showToast('فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const present=records.filter((r:any)=>r.status==='present').length;
  const absent=records.filter((r:any)=>r.status==='absent').length;
  const late=records.filter((r:any)=>r.status==='late').length;
  const rate=records.length?(present/records.length*100).toFixed(0):0;
  const statusColor:Record<string,string>={present:'#22C55E',absent:'#EF4444',late:'#F59E0B',excused:'#3B82F6'};
  const statusLabel:Record<string,string>={present:'حاضر',absent:'غائب',late:'متأخر',excused:'معذور'};
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">✅ الحضور والغياب</h1><p className="text-gray-400 text-sm mt-1">{records.length} سجل</p></div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:'نسبة الحضور',v:`${rate}%`,c:G},{l:'حاضر',v:present,c:'#22C55E'},{l:'غائب',v:absent,c:'#EF4444'},{l:'متأخر',v:late,c:'#F59E0B'}].map((s,i)=>(
          <div key={i} className="rounded-2xl p-4 text-center" style={{background:CARD,border:`1px solid ${BORDER}`}}>
            <div className="text-2xl font-black mb-1" style={{color:s.c}}>{s.v}</div>
            <div className="text-gray-400 text-sm">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} style={{...inp,maxWidth:200}}/>
        <select value={classFilter} onChange={e=>setClassFilter(e.target.value)} style={{...inp,maxWidth:200}}>
          <option value="">كل الفصول</option>
          {classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
        <div style={{overflowX:"auto"}}><table className="w-full text-sm">
          <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الطالب</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الفصل</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">التاريخ</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الحالة</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">تغيير</th>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={5} className="text-center py-12 text-gray-500">جاري التحميل...</td></tr>
            :records.length===0?<tr><td colSpan={5} className="text-center py-12 text-gray-500">لا توجد سجلات لهذا اليوم</td></tr>
            :records.map((r:any)=>(
              <tr key={r.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{background:`${G}22`,color:G}}>{(r.student_name||'?')[0]}</div>
                    <span className="text-white">{r.student_name||'—'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">{r.class_name||'—'}</td>
                <td className="px-4 py-3 text-gray-300">{r.date?new Date(r.date).toLocaleDateString('ar-SA'):dateFilter}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-bold" style={{background:`${statusColor[r.status]||'#6B7280'}22`,color:statusColor[r.status]||'#6B7280'}}>
                    {statusLabel[r.status]||r.status||'—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {['present','absent','late','excused'].map(s=>(
                      <button key={s} onClick={()=>markAttendance(r.student_id,s)} disabled={saving||r.status===s} className="px-2 py-1 rounded-lg text-xs" style={{background:r.status===s?`${statusColor[s]}33`:`${statusColor[s]}11`,color:statusColor[s],opacity:r.status===s?1:0.6}}>
                        {statusLabel[s]}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
