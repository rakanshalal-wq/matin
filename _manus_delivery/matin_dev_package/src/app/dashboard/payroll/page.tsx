'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { Coins } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='var(--gold)',BG='var(--bg)',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
export default function PayrollPage(){
 const [records,setRecords]=useState<any[]>([]);
 const [loading,setLoading]=useState(true);
 const [showModal,setShowModal]=useState(false);
 const [editing,setEditing]=useState<any>(null);
 const [form,setForm]=useState({employee_name:'',role:'',basic_salary:0,allowances:0,deductions:0,month:'',year:new Date().getFullYear(),status:'معلق',notes:''});
 const [saving,setSaving]=useState(false);
 const [filterMonth,setFilterMonth]=useState('');
 const [filterStatus,setFilterStatus]=useState('');
 const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
 const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
 useEffect(()=>{fetchData();},[]);
 const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/payroll',{headers:getH()});const d=await r.json();setRecords(Array.isArray(d)?d:(d.payroll||[]))}catch{setRecords([])}finally{setLoading(false)}};
 const openAdd=()=>{setEditing(null);setForm({employee_name:'',role:'',basic_salary:0,allowances:0,deductions:0,month:'',year:new Date().getFullYear(),status:'معلق',notes:''});setShowModal(true)};
 const openEdit=(r:any)=>{setEditing(r);setForm({employee_name:r.employee_name||'',role:r.role||'',basic_salary:r.basic_salary||0,allowances:r.allowances||0,deductions:r.deductions||0,month:r.month||'',year:r.year||new Date().getFullYear(),status:r.status||'معلق',notes:r.notes||''});setShowModal(true)};
 const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/payroll?id='+editing.id:'/api/payroll';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
 const del=async(id:number)=>{if(!confirm('حذف هذا السجل؟'))return;try{await fetch('/api/payroll?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
 const filtered=records.filter(r=>(!filterMonth||r.month===filterMonth)&&(!filterStatus||r.status===filterStatus));
 const totalPaid=filtered.filter(r=>r.status==='مدفوع').reduce((s,r)=>(s+(r.basic_salary||0)+(r.allowances||0)-(r.deductions||0)),0);
 const totalPending=filtered.filter(r=>r.status==='معلق').reduce((s,r)=>(s+(r.basic_salary||0)+(r.allowances||0)-(r.deductions||0)),0);
 const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
 return(
 <div style={{minHeight:'100vh',background:'var(--bg)',padding:'24px 28px',direction:'rtl',fontFamily:'var(--font)'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
 <div><h1 className="page-title"><IconRenderer name="ICON_Coins" size={18} /> كشف الرواتب</h1><p className="page-sub">إدارة رواتب الموظفين والمعلمين</p></div>
 <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'var(--bg)',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة راتب</button>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:16,marginBottom:28}}>
 {[['إجمالي السجلات',records.length,GOLD],['مدفوعة',records.filter(r=>r.status==='مدفوع').length,'#10B981'],['معلقة',records.filter(r=>r.status==='معلق').length,'#F59E0B'],['إجمالي المدفوع',totalPaid.toLocaleString()+' ر.س','#3B82F6'],['إجمالي المعلق',totalPending.toLocaleString()+' ر.س','#EF4444']].map(([l,v,c])=>(
 <div key={String(l)} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}>
 <div style={{fontSize:22,fontWeight:800,color:String(c)}}>{String(v)}</div>
 <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>{String(l)}</div>
 </div>
 ))}
 </div>
 <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
 <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{...inp,width:160}}>
 <option value="">كل الأشهر</option>
 {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
 </select>
 <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{...inp,width:140}}>
 <option value="">كل الحالات</option>
 {['معلق','مدفوع','ملغي'].map(s=><option key={s} value={s}>{s}</option>)}
 </select>
 </div>
 <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
 <div style={{overflowX:'auto'}}>
 <table style={{width:'100%',borderCollapse:'collapse'}}>
 <thead><tr style={{borderBottom:'1px solid '+BR}}>
 {['الموظف','الدور','الراتب الأساسي','البدلات','الخصومات','الصافي','الشهر','الحالة','إجراءات'].map(h=><th key={h} style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>{h}</th>)}
 </tr></thead>
 <tbody>
 {loading?<tr><td colSpan={9} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
 :filtered.length===0?<tr><td colSpan={9} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد سجلات</td></tr>
 :filtered.map((r:any,i:number)=>{
 const net=(r.basic_salary||0)+(r.allowances||0)-(r.deductions||0);
 const sc=r.status==='مدفوع'?'#10B981':r.status==='معلق'?'#F59E0B':'#EF4444';
 return(
 <tr key={i} style={{borderBottom:'1px solid '+BR}}>
 <td style={{padding:'12px 16px',color:'white',fontWeight:600,fontSize:14}}>{r.employee_name||'—'}</td>
 <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{r.role||'—'}</td>
 <td style={{padding:'12px 16px',color:GOLD,fontSize:13}}>{(r.basic_salary||0).toLocaleString()}</td>
 <td style={{padding:'12px 16px',color:'#10B981',fontSize:13}}>{(r.allowances||0).toLocaleString()}</td>
 <td style={{padding:'12px 16px',color:'#EF4444',fontSize:13}}>{(r.deductions||0).toLocaleString()}</td>
 <td style={{padding:'12px 16px',color:'white',fontWeight:700,fontSize:14}}>{net.toLocaleString()} ر.س</td>
 <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.5)',fontSize:13}}>{r.month||'—'} {r.year||''}</td>
 <td style={{padding:'12px 16px'}}><span style={{background:sc+'22',color:sc,padding:'3px 10px',borderRadius:20,fontSize:12}}>{r.status||'—'}</span></td>
 <td style={{padding:'12px 16px'}}>
 <div style={{display:'flex',gap:6}}>
 <button onClick={()=>openEdit(r)} style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,padding:'5px 10px',color:'#3B82F6',cursor:'pointer',fontSize:12}}>تعديل</button>
 <button onClick={()=>del(r.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'5px 10px',color:'#EF4444',cursor:'pointer',fontSize:12}}>حذف</button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 {showModal&&(
 <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
 <div style={{background:'#111827',border:'1px solid '+BR,borderRadius:20,padding:32,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto'}}>
 <h3 style={{color:'white',fontSize:20,fontWeight:700,marginBottom:24}}>{editing?'تعديل الراتب':'إضافة راتب جديد'}</h3>
 <div style={{display:'flex',flexDirection:'column',gap:14}}>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
 <div><label style={lbl}>اسم الموظف</label><input value={form.employee_name} onChange={e=>setForm({...form,employee_name:e.target.value})} style={inp} placeholder="الاسم الكامل"/></div>
 <div><label style={lbl}>الدور الوظيفي</label><input value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={inp} placeholder="معلم / إداري..."/></div>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
 <div><label style={lbl}>الراتب الأساسي</label><input type="number" value={form.basic_salary} onChange={e=>setForm({...form,basic_salary:Number(e.target.value)})} style={inp}/></div>
 <div><label style={lbl}>البدلات</label><input type="number" value={form.allowances} onChange={e=>setForm({...form,allowances:Number(e.target.value)})} style={inp}/></div>
 <div><label style={lbl}>الخصومات</label><input type="number" value={form.deductions} onChange={e=>setForm({...form,deductions:Number(e.target.value)})} style={inp}/></div>
 </div>
 <div style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:10,padding:'12px 16px'}}>
 <span style={{color:'rgba(255,255,255,0.6)',fontSize:13}}>الراتب الصافي: </span>
 <span style={{color:GOLD,fontWeight:800,fontSize:18}}>{((form.basic_salary||0)+(form.allowances||0)-(form.deductions||0)).toLocaleString()} ر.س</span>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
 <div><label style={lbl}>الشهر</label>
 <select value={form.month} onChange={e=>setForm({...form,month:e.target.value})} style={inp}>
 <option value="">اختر الشهر</option>
 {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
 </select>
 </div>
 <div><label style={lbl}>السنة</label><input type="number" value={form.year} onChange={e=>setForm({...form,year:Number(e.target.value)})} style={inp}/></div>
 </div>
 <div><label style={lbl}>الحالة</label>
 <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={inp}>
 {['معلق','مدفوع','ملغي'].map(s=><option key={s} value={s}>{s}</option>)}
 </select>
 </div>
 <div><label style={lbl}>ملاحظات</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={{...inp,minHeight:60,resize:'vertical'}} placeholder="ملاحظات إضافية..."/></div>
 </div>
 <div style={{display:'flex',gap:12,marginTop:24}}>
 <button onClick={save} disabled={saving} style={{flex:1,background:GOLD,border:'none',borderRadius:10,padding:12,color:'var(--bg)',fontWeight:700,cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1}}>{saving?'جاري الحفظ...':'حفظ'}</button>
 <button onClick={()=>setShowModal(false)} style={{flex:1,background:CB,border:'1px solid '+BR,borderRadius:10,padding:12,color:'rgba(255,255,255,0.7)',cursor:'pointer'}}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
