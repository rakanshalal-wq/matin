'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
export default function NotificationsPage(){
  const [items,setItems]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState('');
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  useEffect(()=>{load();},[]);
  const load=async()=>{try{const r=await fetch('/api/notifications',{headers:getH(),credentials:'include'});const d=await r.json();setItems(Array.isArray(d)?d:d.notifications||[]);}catch{}finally{setLoading(false);}};
  const markRead=async(id:string)=>{try{await fetch('/api/notifications',{method:'PUT',headers:getH(),credentials:'include',body:JSON.stringify({id,is_read:true})});load();}catch{}};
  const markAllRead=async()=>{try{await fetch('/api/notifications',{method:'PUT',headers:getH(),credentials:'include',body:JSON.stringify({mark_all:true})});showToast('تم تعليم الكل كمقروء ✓');load();}catch{showToast('خطأ');}};
  const typeIcon:Record<string,string>={info:'ℹ️',warning:'⚠️',success:'✅',error:'❌',announcement:'📢',grade:'🏆',attendance:'✅',homework:'📋'};
  const unread=items.filter(n=>!n.is_read).length;
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">🔔 الإشعارات</h1>
          <p className="text-gray-400 text-sm mt-1">{unread} غير مقروء من {items.length}</p>
        </div>
        {unread>0&&<button onClick={markAllRead} className="px-4 py-2 rounded-xl text-sm font-medium" style={{background:`${G}22`,color:G}}>تعليم الكل كمقروء</button>}
      </div>
      <div className="flex flex-col gap-3">
        {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
        :items.length===0?<div className="text-center py-20 text-gray-500">لا توجد إشعارات</div>
        :items.map((n:any)=>(
          <div key={n.id} onClick={()=>!n.is_read&&markRead(n.id)} className="rounded-2xl p-4 cursor-pointer transition-all" style={{background:n.is_read?CARD:'rgba(201,168,76,0.06)',border:`1px solid ${n.is_read?BORDER:`${G}33`}`}}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{background:`${G}22`}}>{typeIcon[n.type]||'🔔'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-white">{n.title||n.message}</span>
                  {!n.is_read&&<span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:G}}/>}
                </div>
                {n.title&&n.message&&<p className="text-gray-400 text-sm mt-0.5">{n.message}</p>}
                <div className="text-xs text-gray-600 mt-1">{n.created_at?new Date(n.created_at).toLocaleDateString('ar-SA',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'—'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
