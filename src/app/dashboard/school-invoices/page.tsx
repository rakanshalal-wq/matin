'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { Receipt } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='var(--gold)',BG='var(--bg)',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
export default function Page(){
 const [items,setItems]=useState<any[]>([]);
 const [loading,setLoading]=useState(true);
 const [showModal,setShowModal]=useState(false);
 const [editing,setEditing]=useState<any>(null);
 const [form,setForm]=useState({'school_name':'','invoice_number':'','amount':0,'tax':0,'description':'','issue_date':'','due_date':'','status':'معلقة'});
 const [search,setSearch]=useState('');
 const [saving,setSaving]=useState(false);
 const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
 const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
 useEffect(()=>{fetchData();},[]);
 const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/school-invoices',{headers:getH()});const d=await r.json();setItems(Array.isArray(d)?d:(d.invoices||[]))}catch{setItems([])}finally{setLoading(false)}};
 const openAdd=()=>{setEditing(null);setForm({'school_name':'','invoice_number':'','amount':0,'tax':0,'description':'','issue_date':'','due_date':'','status':'معلقة'});setShowModal(true)};
 const openEdit=(item:any)=>{setEditing(item);const f:any={};Object.keys({'school_name':'','invoice_number':'','amount':0,'tax':0,'description':'','issue_date':'','due_date':'','status':'معلقة'}).forEach(k=>{f[k]=item[k]??({'school_name':'','invoice_number':'','amount':0,'tax':0,'description':'','issue_date':'','due_date':'','status':'معلقة'} as any)[k]});setForm(f);setShowModal(true)};
 const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/school-invoices?id='+editing.id:'/api/school-invoices';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
 const del=async(id:number)=>{if(!confirm('حذف هذا السجل؟'))return;try{await fetch('/api/school-invoices?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
 const filtered=items.filter(r=>!search||JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
 return(
 <div style={{minHeight:'100vh',background:'var(--bg)',padding:'24px 28px',direction:'rtl',fontFamily:'var(--font)'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
 <div><h1 className="page-title"><IconRenderer name="ICON_FileText" size={18} /> فواتير المدارس</h1><p className="page-sub">إدارة فواتير الاشتراك والخدمات للمدارس</p></div>
 <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'var(--bg)',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة</button>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginBottom:28}}>
 <div key='إجمالي الفواتير' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'var(--gold)'}}>items.length</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>إجمالي الفواتير</div></div><div key='مدفوعة' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#10B981'}}>paid</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>مدفوعة</div></div><div key='معلقة' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#F59E0B'}}>pending</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>معلقة</div></div><div key='متأخرة' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#EF4444'}}>overdue</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>متأخرة</div></div>
 </div>
 <div style={{marginBottom:20}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{...inp,width:300}}/></div>
 <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
 <div style={{overflowX:'auto'}}>
 <table style={{width:'100%',borderCollapse:'collapse'}}>
 <thead><tr style={{borderBottom:'1px solid '+BR}}><th key='المدرسة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>المدرسة</th><th key='رقم الفاتورة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>رقم الفاتورة</th><th key='المبلغ' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>المبلغ</th><th key='الضريبة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الضريبة</th><th key='الإجمالي' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الإجمالي</th><th key='الاستحقاق' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الاستحقاق</th><th key='الحالة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الحالة</th><th key='إجراءات' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>إجراءات</th></tr></thead>
 <tbody>
 {loading?<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
 :filtered.length===0?<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد سجلات</td></tr>
 :filtered.map((r:any,i:number)=>(
 <tr key={i} style={{borderBottom:'1px solid '+BR}}>
 <td style={{padding:'12px 16px',color:GOLD,fontWeight:700,fontSize:14}}>{r.school_name||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.invoice_number||'—'}</td>
<td style={{padding:'12px 16px',color:'#10B981',fontWeight:600,fontSize:13}}>{r.amount?(r.amount).toLocaleString()+' ر.س':'—'}</td>
<td style={{padding:'12px 16px',color:'#10B981',fontWeight:600,fontSize:13}}>{r.tax?(r.tax).toLocaleString()+' ر.س':'—'}</td>
<td style={{padding:'12px 16px',color:'#10B981',fontWeight:600,fontSize:13}}>{r.amount?(r.amount).toLocaleString()+' ر.س':'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{r.due_date?new Date(r.due_date).toLocaleDateString('ar-SA'):'—'}</td>
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
 <div><label style={lbl}>اسم المدرسة</label><input type='text' value={form.school_name} onChange={e=>setForm({...form,school_name:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>رقم الفاتورة</label><input type='text' value={form.invoice_number} onChange={e=>setForm({...form,invoice_number:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>المبلغ (ريال)</label><input type='number' value={form.amount} onChange={e=>setForm({...form,amount:Number(e.target.value)})} style={inp}/></div>
<div><label style={lbl}>الضريبة (ريال)</label><input type='number' value={form.tax} onChange={e=>setForm({...form,tax:Number(e.target.value)})} style={inp}/></div>
<div><label style={lbl}>الوصف</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{...inp,minHeight:70,resize:'vertical'}} placeholder=''/></div>
<div><label style={lbl}>تاريخ الإصدار</label><input type='date' value={form.issue_date} onChange={e=>setForm({...form,issue_date:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>تاريخ الاستحقاق</label><input type='date' value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>الحالة</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={inp}><option key='معلقة' value='معلقة'>معلقة</option><option key='مدفوعة' value='مدفوعة'>مدفوعة</option><option key='متأخرة' value='متأخرة'>متأخرة</option><option key='ملغاة' value='ملغاة'>ملغاة</option></select></div>
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
