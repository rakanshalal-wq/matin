'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { Megaphone } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
export default function Page(){
 const [items,setItems]=useState<any[]>([]);
 const [loading,setLoading]=useState(true);
 const [showModal,setShowModal]=useState(false);
 const [editing,setEditing]=useState<any>(null);
 const [form,setForm]=useState({'title':'','content':'','target_audience':'الجميع','priority':'عادي','publish_date':'','expiry_date':'','status':'مسودة'});
 const [search,setSearch]=useState('');
 const [saving,setSaving]=useState(false);
 const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
 const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
 useEffect(()=>{fetchData();},[]);
 const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/announcements',{headers:getH()});const d=await r.json();setItems(Array.isArray(d)?d:(d.announcements||[]))}catch{setItems([])}finally{setLoading(false)}};
 const openAdd=()=>{setEditing(null);setForm({'title':'','content':'','target_audience':'الجميع','priority':'عادي','publish_date':'','expiry_date':'','status':'مسودة'});setShowModal(true)};
 const openEdit=(item:any)=>{setEditing(item);const f:any={};Object.keys({'title':'','content':'','target_audience':'الجميع','priority':'عادي','publish_date':'','expiry_date':'','status':'مسودة'}).forEach(k=>{f[k]=item[k]??({'title':'','content':'','target_audience':'الجميع','priority':'عادي','publish_date':'','expiry_date':'','status':'مسودة'} as any)[k]});setForm(f);setShowModal(true)};
 const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/announcements?id='+editing.id:'/api/announcements';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
 const del=async(id:number)=>{if(!confirm('حذف هذا السجل؟'))return;try{await fetch('/api/announcements?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
 const filtered=items.filter(r=>!search||JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
 return(
 <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
 <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}><IconRenderer name="ICON_Megaphone" size={18} /> الإعلانات</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>إدارة الإعلانات والإشعارات للمجتمع المدرسي</p></div>
 <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'#0B0B16',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة</button>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginBottom:28}}>
 <div key='إجمالي الإعلانات' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#C9A84C'}}>items.length</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>إجمالي الإعلانات</div></div><div key='منشورة' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#10B981'}}>published</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>منشورة</div></div><div key='مسودات' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#F59E0B'}}>drafts</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>مسودات</div></div><div key='عاجلة' style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,fontWeight:800,color:'#EF4444'}}>urgent</div><div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>عاجلة</div></div>
 </div>
 <div style={{marginBottom:20}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث..." style={{...inp,width:300}}/></div>
 <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
 <div style={{overflowX:'auto'}}>
 <table style={{width:'100%',borderCollapse:'collapse'}}>
 <thead><tr style={{borderBottom:'1px solid '+BR}}><th key='العنوان' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>العنوان</th><th key='الجمهور' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الجمهور</th><th key='الأولوية' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الأولوية</th><th key='تاريخ النشر' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>تاريخ النشر</th><th key='الانتهاء' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الانتهاء</th><th key='الحالة' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الحالة</th><th key='إجراءات' style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>إجراءات</th></tr></thead>
 <tbody>
 {loading?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
 :filtered.length===0?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد سجلات</td></tr>
 :filtered.map((r:any,i:number)=>(
 <tr key={i} style={{borderBottom:'1px solid '+BR}}>
 <td style={{padding:'12px 16px',color:GOLD,fontWeight:700,fontSize:14}}>{r.title||'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{r.target_audience||'—'}</td>
<td style={{padding:'12px 16px'}}><span style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.7)',padding:'3px 10px',borderRadius:20,fontSize:12}}>{r.priority||'—'}</span></td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{r.publish_date?new Date(r.publish_date).toLocaleDateString('ar-SA'):'—'}</td>
<td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{r.expiry_date?new Date(r.expiry_date).toLocaleDateString('ar-SA'):'—'}</td>
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
 <div><label style={lbl}>عنوان الإعلان</label><input type='text' value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>محتوى الإعلان</label><textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} style={{...inp,minHeight:70,resize:'vertical'}} placeholder=''/></div>
<div><label style={lbl}>الجمهور المستهدف</label><select value={form.target_audience} onChange={e=>setForm({...form,target_audience:e.target.value})} style={inp}><option key='الجميع' value='الجميع'>الجميع</option><option key='المعلمون' value='المعلمون'>المعلمون</option><option key='الطلاب' value='الطلاب'>الطلاب</option><option key='أولياء الأمور' value='أولياء الأمور'>أولياء الأمور</option><option key='الإداريون' value='الإداريون'>الإداريون</option></select></div>
<div><label style={lbl}>الأولوية</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} style={inp}><option key='عادي' value='عادي'>عادي</option><option key='مهم' value='مهم'>مهم</option><option key='عاجل' value='عاجل'>عاجل</option></select></div>
<div><label style={lbl}>تاريخ النشر</label><input type='date' value={form.publish_date} onChange={e=>setForm({...form,publish_date:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>تاريخ الانتهاء</label><input type='date' value={form.expiry_date} onChange={e=>setForm({...form,expiry_date:e.target.value})} style={inp} placeholder=''/></div>
<div><label style={lbl}>الحالة</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={inp}><option key='مسودة' value='مسودة'>مسودة</option><option key='منشور' value='منشور'>منشور</option><option key='منتهي' value='منتهي'>منتهي</option></select></div>
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
