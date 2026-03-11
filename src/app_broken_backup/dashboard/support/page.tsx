'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp={background:'rgba(255,255,255,0.06)',border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function SupportPage(){
  const [tickets,setTickets]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const [form,setForm]=useState({subject:'',message:'',priority:'medium',category:'technical'});
  useEffect(()=>{load();},[]);
  const load=async()=>{try{const r=await fetch('/api/support',{headers:getH(),credentials:'include'});const d=await r.json();setTickets(Array.isArray(d)?d:d.tickets||[]);}catch{}finally{setLoading(false);}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.subject||!form.message)return showToast('الموضوع والرسالة مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/support',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify(form)});const d=await r.json();if(r.ok){showToast('تم إرسال التذكرة ✓');setShowAdd(false);setForm({subject:'',message:'',priority:'medium',category:'technical'});load();}else showToast(d.error||'فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const statusC:Record<string,string>={open:'#3B82F6',in_progress:'#F59E0B',resolved:'#22C55E',closed:'#6B7280'};
  const statusL:Record<string,string>={open:'مفتوح',in_progress:'قيد المعالجة',resolved:'محلول',closed:'مغلق'};
  const priorityC:Record<string,string>={low:'#6B7280',medium:'#3B82F6',high:'#F59E0B',urgent:'#EF4444'};
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">🎫 الدعم الفني</h1><p className="text-gray-400 text-sm mt-1">{tickets.length} تذكرة</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ تذكرة جديدة</button>
      </div>
      <div className="flex flex-col gap-4">
        {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
        :tickets.length===0?<div className="text-center py-20 text-gray-500">لا توجد تذاكر</div>
        :tickets.map((t:any)=>(
          <div key={t.id} className="rounded-2xl p-5" style={{background:CARD,border:`1px solid ${BORDER}`}}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white">{t.subject}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{background:`${statusC[t.status]||'#6B7280'}22`,color:statusC[t.status]||'#6B7280'}}>{statusL[t.status]||t.status}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{background:`${priorityC[t.priority]||'#6B7280'}22`,color:priorityC[t.priority]||'#6B7280'}}>{t.priority}</span>
                </div>
                <p className="text-gray-300 text-sm">{t.message||t.description}</p>
              </div>
              <div className="text-xs text-gray-500 flex-shrink-0">{t.created_at?new Date(t.created_at).toLocaleDateString('ar-SA'):'—'}</div>
            </div>
          </div>
        ))}
      </div>
      {showAdd&&(
        <Modal title="تذكرة دعم جديدة" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div><label className="text-xs text-gray-400 mb-1 block">الموضوع *</label><input style={inp} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="موضوع المشكلة"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-400 mb-1 block">الأولوية</label><select style={inp} value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option value="low">منخفض</option><option value="medium">متوسط</option><option value="high">عالي</option><option value="urgent">عاجل</option></select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الفئة</label><select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="technical">تقني</option><option value="billing">فواتير</option><option value="general">عام</option><option value="feature">طلب ميزة</option></select></div>
            </div>
            <div><label className="text-xs text-gray-400 mb-1 block">الرسالة *</label><textarea style={{...inp,minHeight:100}} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="اشرح المشكلة بالتفصيل..."/></div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الإرسال...':'إرسال التذكرة'}</button>
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
