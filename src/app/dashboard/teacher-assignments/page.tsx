'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { Pin } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
export default function Page(){
 const [items,setItems]=useState<any[]>([]);
 const [loading,setLoading]=useState(true);
 const [showModal,setShowModal]=useState(false);
 const [editing,setEditing]=useState<any>(null);
 const [form,setForm]=useState({'teacher_name':'','subject':'','class_name':'','grade_level':'ابتدائي','semester':'الأول','year':'','hours_per_week':0,'status':'نشط'});
 const [search,setSearch]=useState('');
 const [saving,setSaving]=useState(false);
 const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
 const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
 useEffect(()=>{fetchData();},[]);
 const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/teacher-assignments',{headers:getH()});const d=await r.json();setItems(Array.isArray(d)?d:(d.assignments||[]))}catch{setItems([])}finally{setLoading(false)}};
 const openAdd=()=>{setEditing(null);setForm({'teacher_name':'','subject':'','class_name':'','grade_level':'ابتدائي','semester':'الأول','year':'','hours_per_week':0,'status':'نشط'});setShowModal(true)};
 const openEdit=(item:any)=>{setEditing(item);const f:any={};Object.keys({'teacher_name':'','subject':'','class_name':'','grade_level':'ابتدائي','semester':'الأول','year':'','hours_per_week':0,'status':'نشط'}).forEach(k=>{f[k]=item[k]??({'teacher_name':'','subject':'','class_name':'','grade_level':'ابتدائي','semester':'الأول','year':'','hours_per_week':0,'status':'نشط'} as any)[k]});setForm(f);setShowModal(true)};
 const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/teacher-assignments?id='+editing.id:'/api/teacher-assignments';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
 const del=async(id:number)=>{if(!confirm('حذف هذا السجل؟'))return;try{await fetch('/api/teacher-assignments?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
 const filtered=items.filter(r=>!search||JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
 return(
 <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
 <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}><IconRenderer name="ICON_Pin" size={18} /> تعيينات المعلمين</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>إدارة تعيين المعلمين للفصول والمواد</p></div>
 <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'#0B0B16',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة</button>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginBottom:28}}>
 <div key='إجمالي التعيينات' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#C9A84C'}}>items.length</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>إجمالي التعيينات</div></div><div key='نشطة' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#10B981'}}>active</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>نشطة</div></div><div key='ابتدائي' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#3B82F6'}}>primary</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>ابتدائي</div></div><div key='ثانوي' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#8B5CF6'}}>secondary</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>ثانوي</div></div>
 </div>
 <div style={{marginBottom:20}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{...inp,width:300}}/></div>
 <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
 <div style={{overflowX:'auto'}}>
 <table style={{width:'100%',borderCollapse:'collapse'}}>
 <thead><tr style={{borderBottom:'1px solid '+BR}}><th key='المعلم' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>المعلم</th><th key='المادة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>المادة</th><th key='الفصل' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الفصل</th><th key='المرحلة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>المرحلة</th><th key='الفصل الدراسي' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الفصل الدراسي</th><th key='الساعات' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الساعات</th><th key='الحالة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الحالة</th><th key='إجراءات' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>إجراءات</th></tr></thead>
 <tbody>
 {loading?<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
 :filtered.length===0?<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد سجلات</td></tr>
 :filtered.map((r:any,i:number)=>(
 <tr key={i} style={{borderBottom:'1px solid '+BR}}>
 <td style={{padding:'12px 16px',color:GOLD,fontWeight:700,fontSize:14}}>{r.teacher_name||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.subject||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.class_name||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.grade_level||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.semester||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.hours_per_week||'—'}</td>
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
 <div><label style={lbl}>اسم المعلم</label><input type='text' value={form.teacher_name} onChange={e=>setForm({...form,teacher_name:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>المادة</label><input type='text' value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>الفصل</label><input type='text' value={form.class_name} onChange={e=>setForm({...form,class_name:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>المرحلة</label><select value={form.grade_level} onChange={e=>setForm({...form,grade_level:e.target.value})} style={inp}><option key='ابتدائي' value='ابتدائي'>ابتدائي</option><option key='متوسط' value='متوسط'>متوسط</option><option key='ثانوي' value='ثانوي'>ثانوي</option></select></div>
<div><label style={lbl}>الفصل الدراسي</label><select value={form.semester} onChange={e=>setForm({...form,semester:e.target.value})} style={inp}><option key='الأول' value='الأول'>الأول</option><option key='الثاني' value='الثاني'>الثاني</option><option key='الصيفي' value='الصيفي'>الصيفي</option></select></div>
<div><label style={lbl}>العام الدراسي</label><input type='text' value={form.year} onChange={e=>setForm({...form,year:e.target.value})} style={inp} placeholder='1446-1447'/></div>
<div><label style={lbl}>ساعات أسبوعياً</label><input type='number' value={form.hours_per_week} onChange={e=>setForm({...form,hours_per_week:Number(e.target.value)})} style={inp}/></div>
<div><label style={lbl}>الحالة</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={inp}><option key='نشط' value='نشط'>نشط</option><option key='منتهي' value='منتهي'>منتهي</option><option key='موقوف' value='موقوف'>موقوف</option></select></div>
 </div>
 <div style={{display:'flex',gap:12,marginTop:24}}>
 <button onClick={save} disabled={saving} style={{flex:1,background:GOLD,border:'none',borderRadius:10,padding:12,color:'#0B0B16',fontWeight:700,cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1}}>{saving?'جاري الحفظ...':'حفظ'}</button>
 <button onClick={()=>setShowModal(false)} style={{flex:1,background:CB,border:'1px solid '+BR,borderRadius:10,padding:12,color:'rgba(255,255,255,0.7)',cursor:'pointer'}}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
