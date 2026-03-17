'use client';
import { ClipboardList } from "lucide-react";
import { useState, useEffect } from 'react';
const getH = (): Record<string,string> => { try { const t = localStorage.getItem('matin_token'); if(t) return {'Content-Type':'application/json','Authorization':'Bearer '+t}; const u=JSON.parse(localStorage.getItem('matin_user')||'{}'); return {'Content-Type':'application/json','x-user-id':String(u.id||'')}; } catch { return {'Content-Type':'application/json'}; }};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
const ACTION_COLORS: Record<string,string> = { login:'#10B981', logout:'#6B7280', create:'#3B82F6', update:'#F59E0B', delete:'#EF4444', view:'#8B5CF6', export:'#06B6D4' };
export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterDate, setFilterDate] = useState('');
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/activity-log', {headers:getH()}); const d = await r.json(); setLogs(Array.isArray(d)?d:(d.logs||[])); } catch { setLogs([]); } finally { setLoading(false); }};
  const filtered = logs.filter(l => {
    if (search && !JSON.stringify(l).includes(search)) return false;
    if (filterAction && l.action !== filterAction) return false;
    if (filterDate && !l.created_at?.startsWith(filterDate)) return false;
    return true;
  });
  const inp: React.CSSProperties = {background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none'};
  const actions = [...new Set(logs.map((l:any)=>l.action).filter(Boolean))];
  return (
    <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
      <div style={{marginBottom:32}}>
        <h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}><ClipboardList className="w-5 h-5 inline-block" /> سجل الأنشطة</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>تتبع جميع الأنشطة والعمليات في النظام</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginBottom:28}}>
        {[{l:'إجمالي السجلات',v:logs.length,c:GOLD},{l:'عمليات الدخول',v:logs.filter((l:any)=>l.action==='login').length,c:'#10B981'},{l:'عمليات الإنشاء',v:logs.filter((l:any)=>l.action==='create').length,c:'#3B82F6'},{l:'عمليات الحذف',v:logs.filter((l:any)=>l.action==='delete').length,c:'#EF4444'}].map((s,i)=>(
          <div key={i} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}>
            <div style={{fontSize:26,fontWeight:800,color:s.c}}>{loading?'...':s.v}</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث في السجلات..." style={{...inp,width:250}}/>
        <select value={filterAction} onChange={e=>setFilterAction(e.target.value)} style={{...inp,width:160}}>
          <option value="">كل الأنشطة</option>
          {actions.map(a=><option key={a} value={a}>{a}</option>)}
        </select>
        <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{...inp,width:180}}/>
        <button onClick={()=>{setSearch('');setFilterAction('');setFilterDate('');}} style={{background:CB,border:'1px solid '+BR,borderRadius:8,padding:'10px 16px',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:13}}>مسح الفلاتر</button>
      </div>
      <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'1px solid '+BR}}>
              {['المستخدم','الدور','النشاط','التفاصيل','IP','التاريخ والوقت'].map(h=>(
                <th key={h} style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600,whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
              : filtered.length===0 ? <tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد سجلات</td></tr>
              : filtered.map((l:any,i:number)=>{
                const ac = ACTION_COLORS[l.action]||'#9CA3AF';
                return (
                  <tr key={i} style={{borderBottom:'1px solid '+BR}}>
                    <td style={{padding:'12px 16px',color:'white',fontWeight:600,fontSize:14}}>{l.user_name||l.user_id||'—'}</td>
                    <td style={{padding:'12px 16px',fontSize:13}}><span style={{background:'rgba(201,168,76,0.15)',color:GOLD,padding:'3px 8px',borderRadius:20,fontSize:12}}>{l.role||'—'}</span></td>
                    <td style={{padding:'12px 16px'}}><span style={{background:`${ac}22`,color:ac,padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{l.action||'—'}</span></td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.details||l.description||'—'}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.4)',fontSize:12,fontFamily:'monospace'}}>{l.ip_address||'—'}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.5)',fontSize:12,whiteSpace:'nowrap'}}>{l.created_at?new Date(l.created_at).toLocaleString('ar-SA'):'—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
