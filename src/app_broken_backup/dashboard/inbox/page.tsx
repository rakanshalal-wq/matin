'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp={background:'rgba(255,255,255,0.06)',border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
export default function InboxPage(){
  const [messages,setMessages]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState<any>(null);
  useEffect(()=>{load();},[]);
  const load=async()=>{try{const r=await fetch('/api/messages',{headers:getH(),credentials:'include'});const d=await r.json();setMessages(Array.isArray(d)?d:d.messages||[]);}catch{}finally{setLoading(false);}};
  const fmt=(d:string)=>{if(!d)return'—';try{return new Date(d).toLocaleDateString('ar-SA',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});}catch{return'—';}};
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      <div className="mb-6"><h1 className="text-2xl font-black text-white">✉️ الرسائل</h1><p className="text-gray-400 text-sm mt-1">{messages.length} رسالة</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
          {loading?<div className="text-center py-12 text-gray-500">جاري التحميل...</div>
          :messages.length===0?<div className="text-center py-12 text-gray-500">لا توجد رسائل</div>
          :messages.map((m:any)=>(
            <div key={m.id} onClick={()=>setSelected(m)} className="p-4 cursor-pointer transition-colors" style={{borderBottom:`1px solid ${BORDER}`,background:selected?.id===m.id?'rgba(201,168,76,0.1)':'transparent'}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{background:`${G}22`,color:G}}>{(m.sender_name||m.from_name||'?')[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white text-sm truncate">{m.sender_name||m.from_name||'مجهول'}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0">{fmt(m.created_at)}</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate">{m.subject||m.content||'—'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 rounded-2xl p-6" style={{background:CARD,border:`1px solid ${BORDER}`}}>
          {!selected?<div className="text-center py-20 text-gray-500">اختر رسالة للعرض</div>:(
            <div>
              <div className="flex items-center gap-3 mb-4 pb-4" style={{borderBottom:`1px solid ${BORDER}`}}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{background:`${G}22`,color:G}}>{(selected.sender_name||'?')[0]}</div>
                <div>
                  <div className="font-bold text-white">{selected.sender_name||'مجهول'}</div>
                  <div className="text-gray-400 text-sm">{fmt(selected.created_at)}</div>
                </div>
              </div>
              {selected.subject&&<div className="font-bold text-white text-lg mb-3">{selected.subject}</div>}
              <div className="text-gray-300 leading-relaxed">{selected.content||selected.body||'—'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
