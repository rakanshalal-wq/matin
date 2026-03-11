'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
export default function MessagesPage(){
  const [messages,setMessages]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState<any>(null);
  const [showCompose,setShowCompose]=useState(false);
  const [toast,setToast]=useState('');
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({to:'',subject:'',body:''});
  useEffect(()=>{load();},[]);
  const load=async()=>{try{const r=await fetch('/api/messages',{headers:getH(),credentials:'include'});const d=await r.json();setMessages(Array.isArray(d)?d:d.messages||[]);}catch{}finally{setLoading(false);}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleSend=async()=>{
    if(!form.to||!form.subject||!form.body)return showToast('كل الحقول مطلوبة');
    setSaving(true);
    try{const r=await fetch('/api/messages',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify(form)});if(r.ok){showToast('تم الإرسال ✓');setShowCompose(false);setForm({to:'',subject:'',body:''});load();}else showToast('فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  return(
    <div className="min-h-screen" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 flex flex-col" style={{borderLeft:`1px solid ${BORDER}`,background:'rgba(255,255,255,0.02)'}}>
          <div className="p-4" style={{borderBottom:`1px solid ${BORDER}`}}>
            <h1 className="text-lg font-black text-white mb-3">💬 الرسائل</h1>
            <button onClick={()=>setShowCompose(true)} className="w-full py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ رسالة جديدة</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading?<div className="text-center py-8 text-gray-500 text-sm">جاري التحميل...</div>
            :messages.length===0?<div className="text-center py-8 text-gray-500 text-sm">لا توجد رسائل</div>
            :messages.map((m:any)=>(
              <div key={m.id} onClick={()=>setSelected(m)} className="p-4 cursor-pointer" style={{borderBottom:`1px solid ${BORDER}`,background:selected?.id===m.id?'rgba(201,168,76,0.08)':'transparent'}}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{background:`${G}22`,color:G}}>{(m.sender_name||m.from_name||'?')[0]}</div>
                  <span className="text-sm font-medium text-white truncate">{m.sender_name||m.from_name||'—'}</span>
                  {!m.read&&<div className="w-2 h-2 rounded-full ml-auto flex-shrink-0" style={{background:G}}/>}
                </div>
                <div className="text-xs text-gray-400 truncate">{m.subject||'—'}</div>
                <div className="text-xs text-gray-600 mt-0.5">{m.created_at?new Date(m.created_at).toLocaleDateString('ar-SA'):''}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col">
          {selected?(
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-4 pb-4" style={{borderBottom:`1px solid ${BORDER}`}}>
                <h2 className="text-xl font-bold text-white mb-2">{selected.subject}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>من: {selected.sender_name||selected.from_name||'—'}</span>
                  <span>•</span>
                  <span>{selected.created_at?new Date(selected.created_at).toLocaleString('ar-SA'):''}</span>
                </div>
              </div>
              <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">{selected.body||selected.content||'—'}</div>
            </div>
          ):(
            <div className="flex-1 flex items-center justify-center text-gray-500">اختر رسالة للعرض</div>
          )}
        </div>
      </div>
      {showCompose&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}>
          <div className="rounded-2xl w-full max-w-lg" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}>
            <div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}>
              <h3 className="font-bold text-lg text-white">رسالة جديدة</h3>
              <button onClick={()=>setShowCompose(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div><label className="text-xs text-gray-400 mb-1 block">إلى *</label><input style={inp} value={form.to} onChange={e=>setForm({...form,to:e.target.value})} placeholder="البريد الإلكتروني أو معرف المستخدم"/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الموضوع *</label><input style={inp} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الرسالة *</label><textarea style={{...inp,minHeight:120,resize:'none'}} value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/></div>
              <div className="flex gap-3">
                <button onClick={handleSend} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الإرسال...':'إرسال'}</button>
                <button onClick={()=>setShowCompose(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
