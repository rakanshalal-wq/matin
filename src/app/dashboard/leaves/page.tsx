'use client';
export const dynamic = 'force-dynamic';
import { Palmtree } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='var(--gold)',BG='var(--bg)',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
export default function Page(){
 const [items,setItems]=useState<any[]>([]);
 const [loading,setLoading]=useState(true);
 const [showModal,setShowModal]=useState(false);
 const [editing,setEditing]=useState<any>(null);
 const [form,setForm]=useState({'employee_name':'','leave_type':'سنوية','start_date':'','end_date':'','reason':'','status':'معلق'});
 const [search,setSearch]=useState('');
 const [saving,setSaving]=useState(false);
 const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
 const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
 useEffect(()=>{fetchData();},[]);
 const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/leaves',{headers:getH()});const d=await r.json();setItems(Array.isArray(d)?d:(d.leaves||[]))}catch{setItems([])}finally{setLoading(false)}};
 const openAdd=()=>{setEditing(null);setForm({'employee_name':'','leave_type':'سنوية','start_date':'','end_date':'','reason':'','status':'معلق'});setShowModal(true)};
 const openEdit=(item:any)=>{setEditing(item);const f:any={};Object.keys({'employee_name':'','leave_type':'سنوية','start_date':'','end_date':'','reason':'','status':'معلق'}).forEach(k=>{f[k]=item[k]??({'employee_name':'','leave_type':'سنوية','start_date':'','end_date':'','reason':'','status':'معلق'} as any)[k]});setForm(f);setShowModal(true)};
 const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/leaves?id='+editing.id:'/api/leaves';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
 const del=async(id:number)=>{if(!confirm('حذف هذا السجل؟'))return;try{await fetch('/api/leaves?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
 const filtered=items.filter(r=>!search||JSON.stringify(r).includes(search));
 return(
 <div style={{minHeight:'100vh',background:'var(--bg)',padding:'24px 28px',direction:'rtl',fontFamily:'var(--font)'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
 <div><h1 className="page-title">Palmtree الإجازات والغيابات</h1><p className="page-sub">إدارة طلبات الإجازات للمعلمين والموظفين</p></div>
 <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'var(--bg)',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة</button>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginBottom:28}}>
 <div key={'إجمالي الطلبات'} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:26,fontWeight:800,color:'var(--gold)'}}>{'...' }</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>إجمالي الطلبات</div></div><div key={'معلقة'} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:26,fontWeight:800,color:'#F59E0B'}}>{'...' }</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>معلقة</div></div><div key={'موافق عليها'} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:26,fontWeight:800,color:'#10B981'}}>{'...' }</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>موافق عليها</div></div><div key={'مرفوضة'} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:26,fontWeight:800,color:'#EF4444'}}>{'...' }</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>مرفوضة</div></div>
 </div>
 <div style={{marginBottom:20}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{...inp,width:280}}/></div>
 <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
 <div style={{overflowX:'auto'}}>
 <table style={{width:'100%',borderCollapse:'collapse'}}>
 <thead><tr style={{borderBottom:'1px solid '+BR}}><th key='الموظف' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الموظف</th><th key='نوع الإجازة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>نوع الإجازة</th><th key='من' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>من</th><th key='إلى' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>إلى</th><th key='الأيام' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الأيام</th><th key='الحالة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الحالة</th><th key='إجراءات' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>إجراءات</th></tr></thead>
 <tbody>
 {loading?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
 :filtered.length===0?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد سجلات</td></tr>
 :filtered.map((r:any,i:number)=>(
 <tr key={i} style={{borderBottom:'1px solid '+BR}}>
 <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.employee_name||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.leave_type||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{r.start_date?new Date(r.start_date).toLocaleDateString('ar-SA'):'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{r.end_date?new Date(r.end_date).toLocaleDateString('ar-SA'):'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.days||'—'}</td>
<td style={{padding:'12px 16px'}}><span style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.7)',padding:'3px 10px',borderRadius:20,fontSize:12}}>{r.status||'—'}</span></td>
 <td style={{padding:'12px 16px'}}>
 <div style={{display:'flex',gap:6}}>
 <button onClick={()=>openEdit(r)} style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,padding:'5px 10px',color:'#3B82F6',cursor:'pointer',fontSize:12}}>تعديل</button>
 <button onClick={()=>del(r.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'5px 10px',color:'#EF4444',cursor:'pointer',fontSize:12}}>حذف</button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 {showModal&&(
 <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
 <div style={{background:'#111827',border:'1px solid '+BR,borderRadius:20,padding:32,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto'}}>
 <h3 style={{color:'white',fontSize:20,fontWeight:700,marginBottom:24}}>{editing?'تعديل':'إضافة جديدة'}</h3>
 <div style={{display:'flex',flexDirection:'column',gap:14}}>
 <div><label style={lbl}>اسم الموظف</label><input type='text' value={form.employee_name} onChange={e=>setForm({...form,employee_name:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>نوع الإجازة</label><select value={form.leave_type} onChange={e=>setForm({...form,leave_type:e.target.value})} style={inp}><option key='سنوية' value='سنوية'>سنوية</option><option key='مرضية' value='مرضية'>مرضية</option><option key='طارئة' value='طارئة'>طارئة</option><option key='أمومة' value='أمومة'>أمومة</option><option key='بدون راتب' value='بدون راتب'>بدون راتب</option></select></div>
<div><label style={lbl}>تاريخ البداية</label><input type='date' value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>تاريخ النهاية</label><input type='date' value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>السبب</label><input type='text' value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>الحالة</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={inp}><option key='معلق' value='معلق'>معلق</option><option key='موافق' value='موافق'>موافق</option><option key='مرفوض' value='مرفوض'>مرفوض</option></select></div>
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
