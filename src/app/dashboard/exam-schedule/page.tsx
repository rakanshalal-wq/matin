'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { ClipboardList } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
export default function Page(){
 const [items,setItems]=useState<any[]>([]);
 const [loading,setLoading]=useState(true);
 const [showModal,setShowModal]=useState(false);
 const [editing,setEditing]=useState<any>(null);
 const [form,setForm]=useState({'subject':'','class_name':'','exam_date':'','start_time':'','end_time':'','room':'','type':'نهائي','notes':''});
 const [search,setSearch]=useState('');
 const [saving,setSaving]=useState(false);
 const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
 const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
 useEffect(()=>{fetchData();},[]);
 const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/exam-schedule',{headers:getH()});const d=await r.json();setItems(Array.isArray(d)?d:(d.exams||[]))}catch{setItems([])}finally{setLoading(false)}};
 const openAdd=()=>{setEditing(null);setForm({'subject':'','class_name':'','exam_date':'','start_time':'','end_time':'','room':'','type':'نهائي','notes':''});setShowModal(true)};
 const openEdit=(item:any)=>{setEditing(item);const f:any={};Object.keys({'subject':'','class_name':'','exam_date':'','start_time':'','end_time':'','room':'','type':'نهائي','notes':''}).forEach(k=>{f[k]=item[k]??({'subject':'','class_name':'','exam_date':'','start_time':'','end_time':'','room':'','type':'نهائي','notes':''} as any)[k]});setForm(f);setShowModal(true)};
 const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/exam-schedule?id='+editing.id:'/api/exam-schedule';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
 const del=async(id:number)=>{if(!confirm('حذف هذا السجل؟'))return;try{await fetch('/api/exam-schedule?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
 const filtered=items.filter(r=>!search||JSON.stringify(r).includes(search));
 return(
 <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
 <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}><IconRenderer name="ICON_ClipboardList" size={18} /> جدول الاختبارات</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>إدارة جداول الاختبارات والامتحانات</p></div>
 <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'#0B0B16',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة</button>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginBottom:28}}>
 <div key={'إجمالي الاختبارات'} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:26,fontWeight:800,color:'#C9A84C'}}>{loading?'...':items.length}</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>إجمالي الاختبارات</div></div><div key={'هذا الأسبوع'} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:26,fontWeight:800,color:'#3B82F6'}}>{loading?'...':items.filter((r:any)=>{if(!r.exam_date)return false;const d=new Date(r.exam_date),n=new Date();return d>=n&&d<=new Date(n.getTime()+7*86400000);}).length}</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>هذا الأسبوع</div></div><div key={'نهائية'} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:26,fontWeight:800,color:'#EF4444'}}>{loading?'...':items.filter((r:any)=>r.type==='نهائي').length}</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>نهائية</div></div><div key={'قصيرة'} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:26,fontWeight:800,color:'#10B981'}}>{loading?'...':items.filter((r:any)=>r.type==='قصير').length}</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>قصيرة</div></div>
 </div>
 <div style={{marginBottom:20}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{...inp,width:280}}/></div>
 <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
 <div style={{overflowX:'auto'}}>
 <table style={{width:'100%',borderCollapse:'collapse'}}>
 <thead><tr style={{borderBottom:'1px solid '+BR}}><th key='المادة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>المادة</th><th key='الفصل' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الفصل</th><th key='التاريخ' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>التاريخ</th><th key='الوقت' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الوقت</th><th key='القاعة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>القاعة</th><th key='النوع' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>النوع</th><th key='إجراءات' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>إجراءات</th></tr></thead>
 <tbody>
 {loading?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
 :filtered.length===0?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد سجلات</td></tr>
 :filtered.map((r:any,i:number)=>(
 <tr key={i} style={{borderBottom:'1px solid '+BR}}>
 <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.subject||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.class_name||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{r.exam_date?new Date(r.exam_date).toLocaleDateString('ar-SA'):'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.5)',fontSize:13}}>{r.start_time||''}{r.end_time?' - '+r.end_time:''}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.room||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.type||'—'}</td>
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
 <div><label style={lbl}>المادة</label><input type='text' value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={inp} placeholder='الرياضيات'/></div>
<div><label style={lbl}>الفصل</label><input type='text' value={form.class_name} onChange={e=>setForm({...form,class_name:e.target.value})} style={inp} placeholder='3أ'/></div>
<div><label style={lbl}>تاريخ الاختبار</label><input type='date' value={form.exam_date} onChange={e=>setForm({...form,exam_date:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>وقت البداية</label><input type='time' value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>وقت النهاية</label><input type='time' value={form.end_time} onChange={e=>setForm({...form,end_time:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>قاعة الاختبار</label><input type='text' value={form.room} onChange={e=>setForm({...form,room:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>نوع الاختبار</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={inp}><option key='نهائي' value='نهائي'>نهائي</option><option key='منتصف الفصل' value='منتصف الفصل'>منتصف الفصل</option><option key='قصير' value='قصير'>قصير</option><option key='عملي' value='عملي'>عملي</option></select></div>
<div><label style={lbl}>ملاحظات</label><input type='text' value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={inp} placeholder=''/></div>
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
