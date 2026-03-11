'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function AnnouncementsPage(){
  const [items,setItems]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const [form,setForm]=useState({title:'',content:'',target_audience:'all',priority:'normal',expires_at:''});
  useEffect(()=>{load();},[]);
  const load=async()=>{try{const r=await fetch('/api/announcements',{headers:getH(),credentials:'include'});const d=await r.json();setItems(Array.isArray(d)?d:d.announcements||[]);}catch{}finally{setLoading(false);}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.title||!form.content)return showToast('العنوان والمحتوى مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/announcements',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify(form)});const d=await r.json();if(r.ok){showToast('تم نشر الإعلان ✓');setShowAdd(false);setForm({title:'',content:'',target_audience:'all',priority:'normal',expires_at:''});load();}else showToast(d.error||'فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const handleDelete=async(id:string)=>{if(!confirm('حذف الإعلان؟'))return;try{const r=await fetch(`/api/announcements?id=${id}`,{method:'DELETE',headers:getH(),credentials:'include'});if(r.ok){showToast('تم الحذف ✓');load();}else showToast('فشل');}catch{showToast('خطأ');}};
  const priorityColor:Record<string,string>={urgent:'#EF4444',high:'#F59E0B',normal:G,low:'#6B7280'};
  const priorityLabel:Record<string,string>={urgent:'عاجل',high:'مهم',normal:'عادي',low:'منخفض'};
  const audienceLabel:Record<string,string>={all:'الجميع',students:'الطلاب',teachers:'المعلمين',parents:'أولياء الأمور',staff:'الموظفون'};
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">📢 الإعلانات</h1><p className="text-gray-400 text-sm mt-1">{items.length} إعلان</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إعلان جديد</button>
      </div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :items.length===0?<div className="text-center py-20 text-gray-500">لا توجد إعلانات</div>
      :<div className="flex flex-col gap-4">
        {items.map((a:any)=>{
          const pc=priorityColor[a.priority]||G;
          return(
            <div key={a.id} className="rounded-2xl p-5" style={{background:CARD,border:`1px solid ${BORDER}`,borderRight:`4px solid ${pc}`}}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-bold text-white text-lg">{a.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:`${pc}22`,color:pc}}>{priorityLabel[a.priority]||a.priority}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'rgba(255,255,255,0.08)',color:'#9CA3AF'}}>{audienceLabel[a.target_audience]||a.target_audience||'الجميع'}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{a.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {a.created_at&&<span>📅 {new Date(a.created_at).toLocaleDateString('ar-SA')}</span>}
                    {a.expires_at&&<span>⏳ ينتهي: {new Date(a.expires_at).toLocaleDateString('ar-SA')}</span>}
                    {a.author_name&&<span>👤 {a.author_name}</span>}
                  </div>
                </div>
                <button onClick={()=>handleDelete(a.id)} className="px-3 py-1.5 rounded-xl text-xs flex-shrink-0" style={{background:'rgba(239,68,68,0.15)',color:'#EF4444'}}>حذف</button>
              </div>
            </div>
          );
        })}
      </div>}
      {showAdd&&(
        <Modal title="إعلان جديد" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">عنوان الإعلان *</label><input style={inp} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="عنوان الإعلان"/></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">المحتوى *</label><textarea style={{...inp,minHeight:100,resize:'none'}} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="محتوى الإعلان..."/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الجمهور المستهدف</label><select style={inp} value={form.target_audience} onChange={e=>setForm({...form,target_audience:e.target.value})}><option value="all">الجميع</option><option value="students">الطلاب</option><option value="teachers">المعلمون</option><option value="parents">أولياء الأمور</option></select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الأولوية</label><select style={inp} value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option value="normal">عادي</option><option value="high">مهم</option><option value="urgent">عاجل</option><option value="low">منخفض</option></select></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">تاريخ الانتهاء</label><input style={inp} type="date" value={form.expires_at} onChange={e=>setForm({...form,expires_at:e.target.value})}/></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري النشر...':'نشر الإعلان'}</button>
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
