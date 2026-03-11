'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
export default function ParentsPage(){
  const [parents,setParents]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');
  const inp={background:'rgba(255,255,255,0.06)',border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
  useEffect(()=>{load();},[]);
  const load=async()=>{try{const r=await fetch('/api/parents',{headers:getH(),credentials:'include'});const d=await r.json();setParents(Array.isArray(d)?d:[]);}catch{}finally{setLoading(false);}};
  const filtered=parents.filter(p=>!search||p.name?.toLowerCase().includes(search.toLowerCase())||p.email?.toLowerCase().includes(search.toLowerCase()));
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      <div className="mb-6"><h1 className="text-2xl font-black text-white">👨‍👩‍👧 أولياء الأمور</h1><p className="text-gray-400 text-sm mt-1">{parents.length} ولي أمر</p></div>
      <div className="flex gap-3 mb-6"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 بحث..." style={{...inp,maxWidth:300}}/></div>
      <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
        <div style={{overflowX:"auto"}}><table className="w-full text-sm">
          <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">ولي الأمر</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الجوال</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الأبناء</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الحالة</th>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={4} className="text-center py-12 text-gray-500">جاري التحميل...</td></tr>
            :filtered.length===0?<tr><td colSpan={4} className="text-center py-12 text-gray-500">لا توجد نتائج</td></tr>
            :filtered.map((p:any)=>(
              <tr key={p.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{background:`${G}22`,color:G}}>{(p.name||'?')[0]}</div><div><div className="font-medium text-white">{p.name}</div><div className="text-xs text-gray-500">{p.email}</div></div></div></td>
                <td className="px-4 py-3 text-gray-300">{p.phone||'—'}</td>
                <td className="px-4 py-3 text-gray-300">{p.children_count||p.students_count||0}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs" style={{background:'#22C55E22',color:'#22C55E'}}>نشط</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
