'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function ExamsPage(){
  const [exams,setExams]=useState<any[]>([]);
  const [classes,setClasses]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const [form,setForm]=useState({title:'',subject:'',class_id:'',exam_date:'',start_time:'',end_time:'',max_grade:'100',exam_type:'written',description:''});
  useEffect(()=>{load();loadClasses();},[]);
  const load=async()=>{try{const r=await fetch('/api/exams',{headers:getH(),credentials:'include'});const d=await r.json();setExams(Array.isArray(d)?d:d.exams||[]);}catch{}finally{setLoading(false);}};
  const loadClasses=async()=>{try{const r=await fetch('/api/classes',{headers:getH()});const d=await r.json();setClasses(Array.isArray(d)?d:[]);}catch{}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.title||!form.class_id)return showToast('العنوان والفصل مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/exams',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({...form,max_grade:parseFloat(form.max_grade)||100})});const d=await r.json();if(r.ok){showToast('تم إضافة الاختبار ✓');setShowAdd(false);setForm({title:'',subject:'',class_id:'',exam_date:'',start_time:'',end_time:'',max_grade:'100',exam_type:'written',description:''});load();}else showToast(d.error||'فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const handleDelete=async(id:string)=>{if(!confirm('حذف الاختبار؟'))return;try{const r=await fetch(`/api/exams?id=${id}`,{method:'DELETE',headers:getH(),credentials:'include'});if(r.ok){showToast('تم الحذف ✓');load();}else showToast('فشل');}catch{showToast('خطأ');}};
  const getStatus=(d:string)=>{if(!d)return{l:'غير محدد',c:'#6B7280'};const now=new Date(),exam=new Date(d);const diff=(exam.getTime()-now.getTime())/(1000*60*60*24);if(diff<0)return{l:'انتهى',c:'#6B7280'};if(diff<3)return{l:'قريب',c:'#EF4444'};return{l:'قادم',c:'#22C55E'};};
  const typeLabel:Record<string,string>={written:'تحريري',oral:'شفهي',practical:'عملي',online:'إلكتروني'};
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">📝 الاختبارات</h1><p className="text-gray-400 text-sm mt-1">{exams.length} اختبار</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إضافة اختبار</button>
      </div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :exams.length===0?<div className="text-center py-20 text-gray-500">لا توجد اختبارات</div>
      :<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((e:any)=>{
          const st=getStatus(e.exam_date);
          return(
            <div key={e.id} className="rounded-2xl p-5" style={{background:CARD,border:`1px solid ${BORDER}`}}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:`${G}22`}}>📝</div>
                <span className="text-xs px-2 py-1 rounded-full font-bold" style={{background:`${st.c}22`,color:st.c}}>{st.l}</span>
              </div>
              <h3 className="font-bold text-white mb-1">{e.title}</h3>
              <div className="flex flex-col gap-1.5 text-sm mt-3">
                {e.subject&&<div className="flex items-center gap-2 text-gray-400"><span>📚</span><span>{e.subject}</span></div>}
                {e.class_name&&<div className="flex items-center gap-2 text-gray-400"><span>🏫</span><span>{e.class_name}</span></div>}
                {e.exam_date&&<div className="flex items-center gap-2 text-gray-400"><span>📅</span><span>{new Date(e.exam_date).toLocaleDateString('ar-SA')}</span></div>}
                {e.start_time&&<div className="flex items-center gap-2 text-gray-400"><span>⏰</span><span>{e.start_time} - {e.end_time||''}</span></div>}
                <div className="flex items-center gap-2"><span>🏆</span><span style={{color:G}}>{e.max_grade||100} درجة</span></div>
                {e.exam_type&&<div className="flex items-center gap-2 text-gray-400"><span>📋</span><span>{typeLabel[e.exam_type]||e.exam_type}</span></div>}
              </div>
              <div className="flex items-center justify-end mt-4 pt-4" style={{borderTop:`1px solid ${BORDER}`}}>
                <button onClick={()=>handleDelete(e.id)} className="px-3 py-1 rounded-lg text-xs" style={{background:'rgba(239,68,68,0.15)',color:'#EF4444'}}>حذف</button>
              </div>
            </div>
          );
        })}
      </div>}
      {showAdd&&(
        <Modal title="إضافة اختبار جديد" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">عنوان الاختبار *</label><input style={inp} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="اختبار نهاية الفصل"/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">المادة</label><input style={inp} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="الرياضيات"/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الفصل *</label><select style={inp} value={form.class_id} onChange={e=>setForm({...form,class_id:e.target.value})}><option value="">اختر</option>{classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">تاريخ الاختبار</label><input style={inp} type="date" value={form.exam_date} onChange={e=>setForm({...form,exam_date:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">وقت البداية</label><input style={inp} type="time" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">وقت النهاية</label><input style={inp} type="time" value={form.end_time} onChange={e=>setForm({...form,end_time:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الدرجة القصوى</label><input style={inp} type="number" value={form.max_grade} onChange={e=>setForm({...form,max_grade:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">نوع الاختبار</label><select style={inp} value={form.exam_type} onChange={e=>setForm({...form,exam_type:e.target.value})}><option value="written">تحريري</option><option value="oral">شفهي</option><option value="practical">عملي</option><option value="online">إلكتروني</option></select></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الحفظ...':'إضافة الاختبار'}</button>
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
