'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function GradesPage(){
  const [grades,setGrades]=useState<any[]>([]);
  const [students,setStudents]=useState<any[]>([]);
  const [classes,setClasses]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [classFilter,setClassFilter]=useState('');
  const [showAdd,setShowAdd]=useState(false);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const [form,setForm]=useState({student_id:'',subject:'',grade:'',max_grade:'100',term:'',notes:''});
  useEffect(()=>{load();loadClasses();loadStudents();},[]);
  const load=async()=>{try{const r=await fetch('/api/grades',{headers:getH(),credentials:'include'});const d=await r.json();setGrades(Array.isArray(d)?d:d.grades||[]);}catch{}finally{setLoading(false);}};
  const loadClasses=async()=>{try{const r=await fetch('/api/classes',{headers:getH()});const d=await r.json();setClasses(Array.isArray(d)?d:[]);}catch{}};
  const loadStudents=async()=>{try{const r=await fetch('/api/students',{headers:getH()});const d=await r.json();setStudents(Array.isArray(d)?d:[]);}catch{}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.student_id||!form.grade)return showToast('الطالب والدرجة مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/grades',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({...form,grade:parseFloat(form.grade),max_grade:parseFloat(form.max_grade)||100})});const d=await r.json();if(r.ok){showToast('تم إضافة الدرجة ✓');setShowAdd(false);setForm({student_id:'',subject:'',grade:'',max_grade:'100',term:'',notes:''});load();}else showToast(d.error||'فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const getGradeColor=(g:number,max:number)=>{const pct=(g/max)*100;if(pct>=90)return'#22C55E';if(pct>=75)return G;if(pct>=60)return'#F59E0B';return'#EF4444';};
  const getGradeLabel=(g:number,max:number)=>{const pct=(g/max)*100;if(pct>=90)return'ممتاز';if(pct>=80)return'جيد جداً';if(pct>=70)return'جيد';if(pct>=60)return'مقبول';return'ضعيف';};
  const filtered=grades.filter((g:any)=>!classFilter||g.class_id===classFilter);
  const avg=filtered.length?filtered.reduce((s:number,g:any)=>s+(g.grade||0),0)/filtered.length:0;
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">🏆 الدرجات والنتائج</h1><p className="text-gray-400 text-sm mt-1">{grades.length} سجل</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إضافة درجة</button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{l:'إجمالي السجلات',v:filtered.length,c:G},{l:'المتوسط العام',v:avg.toFixed(1),c:'#3B82F6'},{l:'الناجحون',v:filtered.filter((g:any)=>(g.grade/g.max_grade)*100>=60).length,c:'#22C55E'}].map((s,i)=>(
          <div key={i} className="rounded-2xl p-4 text-center" style={{background:CARD,border:`1px solid ${BORDER}`}}>
            <div className="text-3xl font-black mb-1" style={{color:s.c}}>{s.v}</div>
            <div className="text-gray-400 text-sm">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mb-6">
        <select value={classFilter} onChange={e=>setClassFilter(e.target.value)} style={{...inp,maxWidth:200}}><option value="">كل الفصول</option>{classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
        <div style={{overflowX:"auto"}}><table className="w-full text-sm">
          <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الطالب</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">المادة</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الدرجة</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">التقدير</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الفترة</th>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={5} className="text-center py-12 text-gray-500">جاري التحميل...</td></tr>
            :filtered.length===0?<tr><td colSpan={5} className="text-center py-12 text-gray-500">لا توجد درجات</td></tr>
            :filtered.map((g:any)=>{
              const max=g.max_grade||100;
              const color=getGradeColor(g.grade,max);
              return(
                <tr key={g.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{background:`${G}22`,color:G}}>{(g.student_name||'?')[0]}</div>
                      <span className="text-white">{g.student_name||'—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{g.subject||'—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg" style={{color}}>{g.grade}</span>
                      <span className="text-gray-500 text-xs">/ {max}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-bold" style={{background:`${color}22`,color}}>{getGradeLabel(g.grade,max)}</span></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{g.term||'—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showAdd&&(
        <Modal title="إضافة درجة" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">الطالب *</label><select style={inp} value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})}><option value="">اختر</option>{students.map((s:any)=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">المادة</label><input style={inp} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="الرياضيات"/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الفترة</label><input style={inp} value={form.term} onChange={e=>setForm({...form,term:e.target.value})} placeholder="الفصل الأول"/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الدرجة *</label><input style={inp} type="number" value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الدرجة القصوى</label><input style={inp} type="number" value={form.max_grade} onChange={e=>setForm({...form,max_grade:e.target.value})}/></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">ملاحظات</label><input style={inp} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الحفظ...':'إضافة الدرجة'}</button>
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
