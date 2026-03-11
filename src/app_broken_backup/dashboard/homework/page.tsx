'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function HomeworkPage(){
  const [hw,setHw]=useState<any[]>([]);
  const [classes,setClasses]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const [form,setForm]=useState({title:'',description:'',class_id:'',subject:'',due_date:'',max_grade:'100'});
  useEffect(()=>{load();loadClasses();},[]);
  const load=async()=>{try{const r=await fetch('/api/homework',{headers:getH(),credentials:'include'});const d=await r.json();setHw(Array.isArray(d)?d:d.homework||[]);}catch{}finally{setLoading(false);}};
  const loadClasses=async()=>{try{const r=await fetch('/api/classes',{headers:getH()});const d=await r.json();setClasses(Array.isArray(d)?d:[]);}catch{}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.title||!form.class_id)return showToast('العنوان والفصل مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/homework',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({...form,max_grade:parseFloat(form.max_grade)||100})});const d=await r.json();if(r.ok){showToast('تم إضافة الواجب ✓');setShowAdd(false);setForm({title:'',description:'',class_id:'',subject:'',due_date:'',max_grade:'100'});load();}else showToast(d.error||'فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const handleDelete=async(id:string)=>{if(!confirm('حذف الواجب؟'))return;try{const r=await fetch(`/api/homework?id=${id}`,{method:'DELETE',headers:getH(),credentials:'include'});if(r.ok){showToast('تم الحذف ✓');load();}else showToast('فشل');}catch{showToast('خطأ');}};
  const isOverdue=(d:string)=>d&&new Date(d)<new Date();
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">📋 الواجبات المنزلية</h1><p className="text-gray-400 text-sm mt-1">{hw.length} واجب</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إضافة واجب</button>
      </div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :hw.length===0?<div className="text-center py-20 text-gray-500">لا توجد واجبات بعد</div>
      :<div className="flex flex-col gap-3">
        {hw.map((h:any)=>(
          <div key={h.id} className="rounded-2xl p-5" style={{background:CARD,border:`1px solid ${BORDER}`}}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white">{h.title}</span>
                  {h.due_date&&<span className="text-xs px-2 py-0.5 rounded-full" style={{background:isOverdue(h.due_date)?'#EF444422':'#22C55E22',color:isOverdue(h.due_date)?'#EF4444':'#22C55E'}}>{isOverdue(h.due_date)?'منتهي':'نشط'}</span>}
                </div>
                {h.description&&<p className="text-gray-400 text-sm mb-2">{h.description}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {h.class_name&&<span>📚 {h.class_name}</span>}
                  {h.subject&&<span>📖 {h.subject}</span>}
                  {h.due_date&&<span>📅 {new Date(h.due_date).toLocaleDateString('ar-SA')}</span>}
                  {h.max_grade&&<span>🏆 الدرجة القصوى: {h.max_grade}</span>}
                </div>
              </div>
              <button onClick={()=>handleDelete(h.id)} className="px-3 py-1.5 rounded-xl text-xs flex-shrink-0" style={{background:'rgba(239,68,68,0.15)',color:'#EF4444'}}>حذف</button>
            </div>
          </div>
        ))}
      </div>}
      {showAdd&&(
        <Modal title="إضافة واجب جديد" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">عنوان الواجب *</label><input style={inp} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="عنوان الواجب"/></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">الوصف</label><textarea style={{...inp,minHeight:80,resize:'none'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="تفاصيل الواجب..."/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الفصل *</label><select style={inp} value={form.class_id} onChange={e=>setForm({...form,class_id:e.target.value})}><option value="">اختر</option>{classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">المادة</label><input style={inp} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="الرياضيات"/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">تاريخ التسليم</label><input style={inp} type="date" value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الدرجة القصوى</label><input style={inp} type="number" value={form.max_grade} onChange={e=>setForm({...form,max_grade:e.target.value})}/></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الحفظ...':'إضافة الواجب'}</button>
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
