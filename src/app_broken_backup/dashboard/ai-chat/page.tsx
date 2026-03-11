'use client';
import { useState, useEffect, useRef } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
export default function AIChatPage(){
  const [messages,setMessages]=useState<{role:string,content:string}[]>([{role:'assistant',content:'مرحباً! أنا مساعد متين الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في إدارة المؤسسة، تحليل البيانات، الإجابة على أسئلتك التعليمية وأكثر.'}]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'});},[messages]);
  const send=async()=>{
    if(!input.trim()||loading)return;
    const userMsg=input.trim();
    setInput('');
    setMessages(prev=>[...prev,{role:'user',content:userMsg}]);
    setLoading(true);
    try{
      const r=await fetch('/api/ai-chat',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({message:userMsg,history:messages.slice(-10)})});
      const d=await r.json();
      setMessages(prev=>[...prev,{role:'assistant',content:d.reply||d.message||d.content||'عذراً، لم أتمكن من الإجابة.'}]);
    }catch{setMessages(prev=>[...prev,{role:'assistant',content:'عذراً، حدث خطأ في الاتصال.'}]);}
    finally{setLoading(false);}
  };
  const SUGGESTIONS=['كم عدد الطلاب المسجلين؟','ما هي نسبة الحضور هذا الأسبوع؟','اعطني تقرير عن الدرجات','ما هي الواجبات المتأخرة؟'];
  return(
    <div className="flex flex-col h-screen" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3" style={{borderBottom:`1px solid ${BORDER}`,background:'rgba(255,255,255,0.02)'}}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:`${G}22`}}>🤖</div>
        <div>
          <h1 className="font-black text-white">مساعد متين الذكي</h1>
          <p className="text-xs text-gray-400">مدعوم بالذكاء الاصطناعي</p>
        </div>
        <div className="mr-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"/>
          <span className="text-xs text-gray-400">متصل</span>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.map((m,i)=>(
          <div key={i} className={`flex ${m.role==='user'?'justify-start':'justify-end'}`}>
            <div className="max-w-[75%]">
              {m.role==='assistant'&&(
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{background:`${G}22`,color:G}}>🤖</div>
                  <span className="text-xs text-gray-400">متين AI</span>
                </div>
              )}
              <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed" style={{background:m.role==='user'?G:CARD,color:m.role==='user'?'#000':'white',border:m.role==='user'?'none':`1px solid ${BORDER}`,borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px'}}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading&&(
          <div className="flex justify-end">
            <div className="px-4 py-3 rounded-2xl" style={{background:CARD,border:`1px solid ${BORDER}`}}>
              <div className="flex gap-1">
                {[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full" style={{background:G,animation:`pulse ${0.5+i*0.15}s infinite`}}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      {/* Suggestions */}
      {messages.length===1&&(
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s,i)=>(
            <button key={i} onClick={()=>{setInput(s);}} className="px-3 py-1.5 rounded-xl text-xs" style={{background:CARD,border:`1px solid ${BORDER}`,color:'#9CA3AF'}}>{s}</button>
          ))}
        </div>
      )}
      {/* Input */}
      <div className="px-6 py-4" style={{borderTop:`1px solid ${BORDER}`}}>
        <div className="flex gap-3">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} placeholder="اكتب رسالتك هنا..." className="flex-1 px-4 py-3 rounded-xl text-sm" style={{background:'rgba(255,255,255,0.06)',border:`1px solid rgba(255,255,255,0.1)`,color:'white',outline:'none'}}/>
          <button onClick={send} disabled={loading||!input.trim()} className="px-5 py-3 rounded-xl font-bold text-sm" style={{background:G,color:'#000',opacity:loading||!input.trim()?0.5:1}}>إرسال</button>
        </div>
      </div>
    </div>
  );
}
