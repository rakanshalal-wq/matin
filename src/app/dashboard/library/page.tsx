'use client';
export const dynamic = 'force-dynamic';
import { Book, BookOpen, CheckCircle, HelpCircle, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';
const GOLD='#D4A843',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
const STATUS_MAP: Record<string,{label:string;color:string;bg:string}> = { available:{label:'متاح',color:'#10B981',bg:'rgba(16,185,129,0.15)'}, borrowed:{label:'مستعار',color:'#F59E0B',bg:'rgba(245,158,11,0.15)'}, reserved:{label:'محجوز',color:'#3B82F6',bg:'rgba(59,130,246,0.15)'}, lost:{label:'مفقود',color:'#EF4444',bg:'rgba(239,68,68,0.15)'} };
export default function LibraryPage() {
 const [books,setBooks]=useState<any[]>([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState('');const [filterStatus,setFilterStatus]=useState('');const [showModal,setShowModal]=useState(false);const [editItem,setEditItem]=useState<any>(null);const [saving,setSaving]=useState(false);
 const [form,setForm]=useState({title:'',author:'',isbn:'',category:'علوم',quantity:'1',available_quantity:'1',status:'available',publisher:'',year:'',description:''});
 useEffect(()=>{fetchBooks();},[]);
 const fetchBooks=async()=>{setLoading(true);try{const r=await fetch('/api/library',{headers:getHeaders()});const d=await r.json();setBooks(Array.isArray(d)?d:[]);}catch{setBooks([]);}finally{setLoading(false);}};
 const handleSave=async()=>{if(!form.title)return alert('ادخل عنوان الكتاب');setSaving(true);try{const m=editItem?'PUT':'POST';const u=editItem?'/api/library?id='+editItem.id:'/api/library';const r=await fetch(u,{method:m,headers:getHeaders(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);setEditItem(null);setForm({title:'',author:'',isbn:'',category:'علوم',quantity:'1',available_quantity:'1',status:'available',publisher:'',year:'',description:''});fetchBooks();}else{const e=await r.json();alert(e.error||'فشل الحفظ');}}catch{}finally{setSaving(false);}};
 const handleDelete=async(id:number)=>{if(!confirm('هل انت متاكد؟'))return;try{await fetch('/api/library?id='+id,{method:'DELETE',headers:getHeaders()});fetchBooks();}catch{}};
 const openEdit=(item:any)=>{setEditItem(item);setForm({title:item.title||'',author:item.author||'',isbn:item.isbn||'',category:item.category||'علوم',quantity:String(item.quantity||1),available_quantity:String(item.available_quantity||1),status:item.status||'available',publisher:item.publisher||'',year:String(item.year||''),description:item.description||''});setShowModal(true);};
 const filtered=books.filter((r:any)=>(!search||r.title?.includes(search)||r.author?.includes(search))&&(!filterStatus||r.status===filterStatus));
 const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
 const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
 return (
 <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
 <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}><IconRenderer name="ICON_BookOpen" size={18} /> المكتبة المدرسية</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>ادارة الكتب والاستعارات</p></div>
 <button onClick={()=>{setEditItem(null);setShowModal(true);}} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'#0B0B16',fontWeight:700,cursor:'pointer',fontSize:14}}>+ اضافة كتاب</button>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginBottom:28}}>
 {[{l:'اجمالي الكتب',v:books.length,c:GOLD,i:"ICON_BookOpen"},{l:'متاح',v:books.filter((r:any)=>r.status==='available').length,c:'#10B981',i:"ICON_CheckCircle"},{l:'مستعار',v:books.filter((r:any)=>r.status==='borrowed').length,c:'#F59E0B',i:"ICON_Book"},{l:'مفقود',v:books.filter((r:any)=>r.status==='lost').length,c:'#EF4444',i:"ICON_HelpCircle"}].map((s,i)=>(
 <div key={i} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}><div style={{fontSize:24,marginBottom:8}}>{s.i}</div><div style={{fontSize:26,fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>{s.l}</div></div>
 ))}
 </div>
 <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
 <input placeholder="بحث عن كتاب او مؤلف..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,width:280}}/>
 <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{...inp,width:160}}>
 <option value="">جميع الحالات</option>{Object.entries(STATUS_MAP).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
 </select>
 </div>
 <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
 {loading?<div style={{textAlign:'center',padding:60,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</div>:filtered.length===0?
 <div style={{textAlign:'center',padding:60}}><div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Book size={19} color="#6B7280" /></div><p style={{color:'rgba(255,255,255,0.4)',fontSize:16}}>لا توجد كتب مسجلة</p><button onClick={()=>setShowModal(true)} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 24px',color:'#0B0B16',fontWeight:700,cursor:'pointer',marginTop:16}}>+ اضافة اول كتاب</button></div>:
 <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}>
 <thead><tr style={{borderBottom:'1px solid '+BR}}>{['العنوان','المؤلف','الفئة','الكمية','المتاح','الحالة','اجراءات'].map(h=><th key={h} style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600,whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
 <tbody>{filtered.map((r:any,i:number)=>{const st=STATUS_MAP[r.status]||{label:r.status,color:'#9CA3AF',bg:'rgba(156,163,175,0.15)'};return(
 <tr key={r.id||i} style={{borderBottom:'1px solid '+BR}}>
 <td style={{padding:'14px 16px',color:'white',fontWeight:600}}>{r.title}</td>
 <td style={{padding:'14px 16px',color:'rgba(255,255,255,0.7)'}}>{r.author||'—'}</td>
 <td style={{padding:'14px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{r.category||'—'}</td>
 <td style={{padding:'14px 16px',color:'rgba(255,255,255,0.7)'}}>{r.quantity||1}</td>
 <td style={{padding:'14px 16px',color:GOLD,fontWeight:700}}>{r.available_quantity||0}</td>
 <td style={{padding:'14px 16px'}}><span style={{background:st.bg,color:st.color,padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:600}}>{st.label}</span></td>
 <td style={{padding:'14px 16px'}}><div style={{display:'flex',gap:8}}><button onClick={()=>openEdit(r)} style={{background:'rgba(201,168,76,0.15)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:8,padding:'6px 12px',color:GOLD,cursor:'pointer',fontSize:12}}>تعديل</button><button onClick={()=>handleDelete(r.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:'6px 12px',color:'#EF4444',cursor:'pointer',fontSize:12}}>حذف</button></div></td>
 </tr>);})}</tbody>
 </table></div>}
 </div>
 {showModal&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
 <div style={{background:'#12121F',border:'1px solid '+BR,borderRadius:20,padding:32,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}><h2 style={{color:'white',fontSize:20,fontWeight:700,margin:0}}>{editItem?'تعديل الكتاب':'اضافة كتاب جديد'}</h2><button onClick={()=>{setShowModal(false);setEditItem(null);}} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:22,cursor:'pointer'}}>X</button></div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
 <div style={{gridColumn:'1/-1'}}><label style={lbl}>عنوان الكتاب *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="ادخل عنوان الكتاب" style={inp}/></div>
 <div><label style={lbl}>المؤلف</label><input value={form.author} onChange={e=>setForm({...form,author:e.target.value})} placeholder="اسم المؤلف" style={inp}/></div>
 <div><label style={lbl}>الفئة</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={inp}>{['علوم','ادب','تاريخ','رياضيات','دين','قصص','اخرى'].map(c=><option key={c}>{c}</option>)}</select></div>
 <div><label style={lbl}>الكمية الكلية</label><input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} style={inp}/></div>
 <div><label style={lbl}>الكمية المتاحة</label><input type="number" value={form.available_quantity} onChange={e=>setForm({...form,available_quantity:e.target.value})} style={inp}/></div>
 <div><label style={lbl}>الحالة</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={inp}>{Object.entries(STATUS_MAP).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
 <div><label style={lbl}>دار النشر</label><input value={form.publisher} onChange={e=>setForm({...form,publisher:e.target.value})} style={inp}/></div>
 <div><label style={lbl}>سنة النشر</label><input type="number" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} placeholder="2024" style={inp}/></div>
 <div style={{gridColumn:'1/-1'}}><label style={lbl}>ملاحظات</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{...inp,height:70,resize:'vertical' as const}}/></div>
 </div>
 <div style={{display:'flex',gap:12,marginTop:24}}>
 <button onClick={handleSave} disabled={saving} style={{flex:1,background:GOLD,border:'none',borderRadius:10,padding:12,color:'#0B0B16',fontWeight:700,cursor:saving?'not-allowed':'pointer',fontSize:15,opacity:saving?0.7:1}}>{saving?'جاري الحفظ...':editItem?'حفظ التعديلات':'اضافة الكتاب'}</button>
 <button onClick={()=>{setShowModal(false);setEditItem(null);}} style={{flex:1,background:'rgba(255,255,255,0.06)',border:'1px solid '+BR,borderRadius:10,padding:12,color:'white',cursor:'pointer',fontSize:15}}>الغاء</button>
 </div>
 </div>
 </div>}
 </div>
 );
}
