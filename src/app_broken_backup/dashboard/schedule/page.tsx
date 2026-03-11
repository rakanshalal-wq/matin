'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
const DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
const COLORS=['#C9A84C','#3B82F6','#22C55E','#8B5CF6','#F59E0B','#EC4899','#14B8A6','#EF4444'];
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function SchedulePage(){
  const [schedule,setSchedule]=useState<any[]>([]);
  const [classes,setClasses]=useState<any[]>([]);
  const [teachers,setTeachers]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [classFilter,setClassFilter]=useState('');
  const [showAdd,setShowAdd]=useState(false);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const [form,setForm]=useState({class_id:'',teacher_id:'',subject:'',day_of_week:'0',start_time:'08:00',end_time:'09:00',room:''});
  useEffect(()=>{load();loadClasses();loadTeachers();},[]);
  const load=async()=>{try{const r=await fetch('/api/schedule',{headers:getH(),credentials:'include'});const d=await r.json();setSchedule(Array.isArray(d)?d:d.schedule||[]);}catch{}finally{setLoading(false);}};
  const loadClasses=async()=>{try{const r=await fetch('/api/classes',{headers:getH()});const d=await r.json();setClasses(Array.isArray(d)?d:[]);}catch{}};
  const loadTeachers=async()=>{try{const r=await fetch('/api/teachers',{headers:getH()});const d=await r.json();setTeachers(Array.isArray(d)?d:[]);}catch{}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.class_id||!form.subject)return showToast('الفصل والمادة مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/schedule',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({...form,day_of_week:parseInt(form.day_of_week)})});const d=await r.json();if(r.ok){showToast('تم إضافة الحصة ✓');setShowAdd(false);setForm({class_id:'',teacher_id:'',subject:'',day_of_week:'0',start_time:'08:00',end_time:'09:00',room:''});load();}else showToast(d.error||'فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const handleDelete=async(id:string)=>{if(!confirm('حذف الحصة؟'))return;try{const r=await fetch(`/api/schedule?id=${id}`,{method:'DELETE',headers:getH(),credentials:'include'});if(r.ok){showToast('تم الحذف ✓');load();}else showToast('فشل');}catch{showToast('خطأ');}};
  const filtered=schedule.filter((s:any)=>!classFilter||s.class_id===classFilter);
  const byDay=(day:number)=>filtered.filter((s:any)=>s.day_of_week===day||s.day_of_week===String(day));
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">📅 الجدول الدراسي</h1><p className="text-gray-400 text-sm mt-1">{schedule.length} حصة</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إضافة حصة</button>
      </div>
      <div className="flex gap-3 mb-6">
        <select value={classFilter} onChange={e=>setClassFilter(e.target.value)} style={{...inp,maxWidth:220}}><option value="">كل الفصول</option>{classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DAYS.map((day,di)=>(
          <div key={di} className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
            <div className="px-4 py-3 text-center font-bold text-sm" style={{background:`${G}22`,color:G}}>{day}</div>
            <div className="p-3 flex flex-col gap-2">
              {byDay(di).length===0?<div className="text-center py-4 text-gray-600 text-xs">لا توجد حصص</div>
              :byDay(di).sort((a:any,b:any)=>(a.start_time||'').localeCompare(b.start_time||'')).map((s:any,si:number)=>(
                <div key={s.id} className="rounded-xl p-3" style={{background:`${COLORS[si%COLORS.length]}15`,border:`1px solid ${COLORS[si%COLORS.length]}30`}}>
                  <div className="font-bold text-sm" style={{color:COLORS[si%COLORS.length]}}>{s.subject}</div>
                  {s.start_time&&<div className="text-xs text-gray-400 mt-1">{s.start_time} - {s.end_time||''}</div>}
                  {s.teacher_name&&<div className="text-xs text-gray-500 mt-0.5">{s.teacher_name}</div>}
                  {s.room&&<div className="text-xs text-gray-500">قاعة: {s.room}</div>}
                  <button onClick={()=>handleDelete(s.id)} className="text-xs mt-2" style={{color:'#EF4444'}}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>}
      {showAdd&&(
        <Modal title="إضافة حصة دراسية" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-400 mb-1 block">الفصل *</label><select style={inp} value={form.class_id} onChange={e=>setForm({...form,class_id:e.target.value})}><option value="">اختر</option>{classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">المادة *</label><input style={inp} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="الرياضيات"/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">المعلم</label><select style={inp} value={form.teacher_id} onChange={e=>setForm({...form,teacher_id:e.target.value})}><option value="">اختر</option>{teachers.map((t:any)=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">اليوم</label><select style={inp} value={form.day_of_week} onChange={e=>setForm({...form,day_of_week:e.target.value})}>{DAYS.map((d,i)=><option key={i} value={i}>{d}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">وقت البداية</label><input style={inp} type="time" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">وقت النهاية</label><input style={inp} type="time" value={form.end_time} onChange={e=>setForm({...form,end_time:e.target.value})}/></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">القاعة / الغرفة</label><input style={inp} value={form.room} onChange={e=>setForm({...form,room:e.target.value})} placeholder="قاعة 101"/></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الحفظ...':'إضافة الحصة'}</button>
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
