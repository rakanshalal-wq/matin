'use client';
import { ClipboardList, Lock, Settings } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
export default function SecurityPage(){
  const [logs,setLogs]=useState<any[]>([]);
  const [sessions,setSessions]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [activeTab,setActiveTab]=useState<'logs'|'sessions'|'settings'>('logs');
  const [settings,setSettings]=useState({two_factor:false,session_timeout:'60',max_login_attempts:'5',password_min_length:'8',require_uppercase:true,require_numbers:true,require_special:false});
  const [saving,setSaving]=useState(false);
  const [showModal,setShowModal]=useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [filterStatus,setFilterStatus]=useState('');
  useEffect(()=>{fetchData();},[]);
  const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/security',{headers:getH()});const d=await r.json();setLogs(Array.isArray(d)?d:(d.logs||[]));setSessions(d.sessions||[]);if(d.settings)setSettings(d.settings)}catch{setLogs([])}finally{setLoading(false)}};
  const saveSettings=async()=>{setSaving(true);try{await fetch('/api/security',{method:'PUT',headers:getH(),body:JSON.stringify({settings})});setErrMsg('')}catch(e:any){setErrMsg(e.message||'حدث خطأ');}finally{setSaving(false)}};
  const revokeSession=async(id:string)=>{if(!confirm('إلغاء هذه الجلسة؟'))return;try{await fetch('/api/security?session_id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
  const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
  const SC:Record<string,string>={success:'#10B981',failed:'#EF4444',warning:'#F59E0B',info:'#3B82F6'};
  const filteredLogs=logs.filter(l=>!filterStatus||l.status===filterStatus);
  const tabs=[{id:'logs',l:'سجل الأحداث',i:"ICON_ClipboardList"},{id:'sessions',l:'الجلسات النشطة',i:"ICON_Lock"},{id:'settings',l:'إعدادات الأمان',i:'Settings️'}];
  return(
    <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
      <div style={{marginBottom:32}}>
        <h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}>Lock الأمان وحماية النظام</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>مراقبة الأمان وإدارة الجلسات والصلاحيات</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:16,marginBottom:28}}>
        {[{l:'محاولات الدخول الناجحة',v:logs.filter((l:any)=>l.status==='success').length,c:'#10B981'},{l:'محاولات فاشلة',v:logs.filter((l:any)=>l.status==='failed').length,c:'#EF4444'},{l:'الجلسات النشطة',v:sessions.length,c:GOLD},{l:'تنبيهات أمنية',v:logs.filter((l:any)=>l.status==='warning').length,c:'#F59E0B'}].map((s,i)=>(
          <div key={i} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}>
            <div style={{fontSize:26,fontWeight:800,color:s.c}}>{loading?'...':s.v}</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginBottom:24}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setActiveTab(t.id as any)} style={{padding:'10px 20px',borderRadius:10,border:'1px solid',borderColor:activeTab===t.id?GOLD:BR,background:activeTab===t.id?`${GOLD}22`:CB,color:activeTab===t.id?GOLD:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:14}}>{t.i} {t.l}</button>)}
      </div>
      {activeTab==='logs'&&(
        <>
          <div style={{display:'flex',gap:8,marginBottom:16}}>
            {[{v:'',l:'الكل'},{v:'success',l:'ناجح'},{v:'failed',l:'فاشل'},{v:'warning',l:'تحذير'}].map(f=><button key={f.v} onClick={()=>setFilterStatus(f.v)} style={{padding:'7px 14px',borderRadius:20,border:'1px solid',borderColor:filterStatus===f.v?GOLD:BR,background:filterStatus===f.v?`${GOLD}22`:CB,color:filterStatus===f.v?GOLD:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:13}}>{f.l}</button>)}
          </div>
          <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr style={{borderBottom:'1px solid '+BR}}>{['المستخدم','النشاط','IP','الحالة','الوقت'].map(h=><th key={h} style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>{h}</th>)}</tr></thead>
                <tbody>
                  {loading?<tr><td colSpan={5} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
                  :filteredLogs.length===0?<tr><td colSpan={5} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد سجلات</td></tr>
                  :filteredLogs.map((l:any,i:number)=>{const c=SC[l.status]||'#9CA3AF';return(
                    <tr key={i} style={{borderBottom:'1px solid '+BR}}>
                      <td style={{padding:'12px 16px',color:'white',fontWeight:600,fontSize:14}}>{l.user_name||l.user_id||'—'}</td>
                      <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{l.action||l.description||'—'}</td>
                      <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.4)',fontSize:12,fontFamily:'monospace'}}>{l.ip_address||'—'}</td>
                      <td style={{padding:'12px 16px'}}><span style={{background:`${c}22`,color:c,padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{l.status||'—'}</span></td>
                      <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.5)',fontSize:12}}>{l.created_at?new Date(l.created_at).toLocaleString('ar-SA'):'—'}</td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {activeTab==='sessions'&&(
        <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{borderBottom:'1px solid '+BR}}>{['المستخدم','الجهاز','IP','بدء الجلسة','آخر نشاط','إجراء'].map(h=><th key={h} style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>{h}</th>)}</tr></thead>
              <tbody>
                {sessions.length===0?<tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد جلسات نشطة</td></tr>
                :sessions.map((s:any,i:number)=>(
                  <tr key={i} style={{borderBottom:'1px solid '+BR}}>
                    <td style={{padding:'12px 16px',color:'white',fontWeight:600}}>{s.user_name||'—'}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{s.device||s.user_agent||'—'}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.4)',fontSize:12,fontFamily:'monospace'}}>{s.ip_address||'—'}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.5)',fontSize:12}}>{s.created_at?new Date(s.created_at).toLocaleString('ar-SA'):'—'}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.5)',fontSize:12}}>{s.last_activity?new Date(s.last_activity).toLocaleString('ar-SA'):'—'}</td>
                    <td style={{padding:'12px 16px'}}><button onClick={()=>revokeSession(s.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:'6px 12px',color:'#EF4444',cursor:'pointer',fontSize:12}}>إلغاء</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab==='settings'&&(
        <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,padding:32,maxWidth:560}}>
          <h3 style={{color:'white',fontSize:18,fontWeight:700,marginBottom:24}}>Settings️ إعدادات الأمان</h3>
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            {[{k:'two_factor',l:'المصادقة الثنائية',d:'طبقة حماية إضافية عند الدخول'},{k:'require_uppercase',l:'أحرف كبيرة في كلمة المرور',d:'إلزامية حرف كبير واحد على الأقل'},{k:'require_numbers',l:'أرقام في كلمة المرور',d:'إلزامية رقم واحد على الأقل'},{k:'require_special',l:'رموز خاصة في كلمة المرور',d:'إلزامية رمز خاص مثل @#$'}].map(({k,l,d})=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(255,255,255,0.03)',borderRadius:12,padding:'14px 18px'}}>
                <div><div style={{color:'white',fontWeight:600,fontSize:14}}>{l}</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginTop:2}}>{d}</div></div>
                <div onClick={()=>setSettings({...settings,[k]:!(settings as any)[k]})} style={{width:44,height:24,borderRadius:12,background:(settings as any)[k]?GOLD:'rgba(255,255,255,0.1)',cursor:'pointer',position:'relative',transition:'background 0.3s',flexShrink:0}}>
                  <div style={{position:'absolute',top:2,right:(settings as any)[k]?2:undefined,left:(settings as any)[k]?undefined:2,width:20,height:20,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
                </div>
              </div>
            ))}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div><label style={lbl}>مهلة الجلسة (دقيقة)</label><input type="number" value={settings.session_timeout} onChange={e=>setSettings({...settings,session_timeout:e.target.value})} style={inp}/></div>
              <div><label style={lbl}>أقصى محاولات دخول</label><input type="number" value={settings.max_login_attempts} onChange={e=>setSettings({...settings,max_login_attempts:e.target.value})} style={inp}/></div>
              <div><label style={lbl}>الحد الأدنى لكلمة المرور</label><input type="number" value={settings.password_min_length} onChange={e=>setSettings({...settings,password_min_length:e.target.value})} style={inp}/></div>
            </div>
            <button onClick={saveSettings} disabled={saving} style={{background:GOLD,border:'none',borderRadius:10,padding:14,color:'#0B0B16',fontWeight:700,cursor:saving?'not-allowed':'pointer',fontSize:15,opacity:saving?0.7:1}}>{saving?'جاري الحفظ...':'حفظ الإعدادات'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
