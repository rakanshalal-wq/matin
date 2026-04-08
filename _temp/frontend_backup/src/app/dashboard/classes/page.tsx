'use client';
export const dynamic = "force-dynamic";
import IconRenderer from "@/components/IconRenderer";
import { School } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
const GRADES=['الأول الابتدائي','الثاني الابتدائي','الثالث الابتدائي','الرابع الابتدائي','الخامس الابتدائي','السادس الابتدائي','الأول المتوسط','الثاني المتوسط','الثالث المتوسط','الأول الثانوي','الثاني الثانوي','الثالث الثانوي'];
export default function ClassesPage(){
 const [classes,setClasses]=useState<any[]>([]);
 const [loading,setLoading]=useState(true);
 const [showModal,setShowModal]=useState(false);
 const [editing,setEditing]=useState<any>(null);
 const [form,setForm]=useState({name:'',grade:'الأول الابتدائي',capacity:30,teacher_id:'',teacher_name:'',room:'',track:'عام',academic_year:new Date().getFullYear()+'-'+(new Date().getFullYear()+1)});
 const [filterGrade,setFilterGrade]=useState('');
 const [search,setSearch]=useState('');
 const [saving,setSaving]=useState(false);
 useEffect(()=>{fetchData();},[]);
 const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/classes',{headers:getH()});const d=await r.json();setClasses(Array.isArray(d)?d:(d.classes||[]))}catch{setClasses([])}finally{setLoading(false)}};
 const openAdd=()=>{setEditing(null);setForm({name:'',grade:'الأول الابتدائي',capacity:30,teacher_id:'',teacher_name:'',room:'',track:'عام',academic_year:new Date().getFullYear()+'-'+(new Date().getFullYear()+1)});setShowModal(true)};
 const openEdit=(c:any)=>{setEditing(c);setForm({name:c.name||'',grade:c.grade||'الأول الابتدائي',capacity:c.capacity||30,teacher_id:c.teacher_id||'',teacher_name:c.teacher_name||'',room:c.room||'',track:c.track||'عام',academic_year:c.academic_year||''});setShowModal(true)};
 const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/classes?id='+editing.id:'/api/classes';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
 const del=async(id:number)=>{if(!confirm('حذف هذا الفصل؟'))return;try{await fetch('/api/classes?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
 const filtered=classes.filter(c=>(!filterGrade||c.grade===filterGrade)&&(!search||c.name?.includes(search)||c.teacher_name?.includes(search)));
 const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
 const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
 return(
 <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
 <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}><IconRenderer name="ICON_School" size={18} /> الفصول الدراسية</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>إدارة الفصول الدراسية وتعيين المعلمين</p></div>
 <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'#0B0B16',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة فصل</button>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginBottom:28}}>
 {[{l:'إجمالي الفصول',v:classes.length,c:GOLD},{l:'الابتدائية',v:classes.filter(c=>c.grade?.includes('الابتدائي')).length,c:'#3B82F6'},{l:'المتوسطة',v:classes.filter(c=>c.grade?.includes('المتوسط')).length,c:'#10B981'},{l:'الثانوية',v:classes.filter(c=>c.grade?.includes('الثانوي')).length,c:'#8B5CF6'}].map((s,i)=>(
 <div key={i} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}>
 <div style={{fontSize:26,fontWeight:800,color:s.c}}>{loading?'...':s.v}</div>
 <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>{s.l}</div>
 </div>
 ))}
 </div>
 <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
 <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث باسم الفصل أو المعلم..." style={{...inp,width:250}}/>
 <select value={filterGrade} onChange={e=>setFilterGrade(e.target.value)} style={{...inp,width:200}}>
 <option value="">كل الصفوف</option>
 {GRADES.map(g=><option key={g} value={g}>{g}</option>)}
 </select>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
 {loading?<div style={{textAlign:'center',padding:60,color:'rgba(255,255,255,0.4)',gridColumn:'1/-1'}}>جاري التحميل...</div>
 :filtered.length===0?<div style={{textAlign:'center',padding:60,color:'rgba(255,255,255,0.4)',gridColumn:'1/-1'}}>لا توجد فصول</div>
 :filtered.map((c:any,i:number)=>(
 <div key={i} style={{background:CB,border:'1px solid '+BR,borderRadius:16,padding:20}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
 <div><div style={{color:'white',fontWeight:700,fontSize:18}}>{c.name||'—'}</div><div style={{color:'rgba(255,255,255,0.5)',fontSize:13,marginTop:3}}>{c.grade||'—'}</div></div>
 <div style={{display:'flex',gap:6}}>
 <button onClick={()=>openEdit(c)} style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,padding:'5px 10px',color:'#3B82F6',cursor:'pointer',fontSize:12}}>تعديل</button>
 <button onClick={()=>del(c.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'5px 10px',color:'#EF4444',cursor:'pointer',fontSize:12}}>حذف</button>
 </div>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
 <div style={{background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'8px 12px'}}><div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>المعلم المشرف</div><div style={{color:'white',fontSize:13,fontWeight:600,marginTop:2}}>{c.teacher_name||'—'}</div></div>
 <div style={{background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'8px 12px'}}><div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>الطاقة الاستيعابية</div><div style={{color:GOLD,fontSize:13,fontWeight:600,marginTop:2}}>{c.capacity||'—'} طالب</div></div>
 <div style={{background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'8px 12px'}}><div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>رقم الغرفة</div><div style={{color:'white',fontSize:13,fontWeight:600,marginTop:2}}>{c.room||'—'}</div></div>
 <div style={{background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'8px 12px'}}><div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>المسار</div><div style={{color:'#10B981',fontSize:13,fontWeight:600,marginTop:2}}>{c.track||'—'}</div></div>
 </div>
 </div>
 ))}
 </div>
 {showModal&&(
 <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
 <div style={{background:'#111827',border:'1px solid '+BR,borderRadius:20,padding:32,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto'}}>
 <h3 style={{color:'white',fontSize:20,fontWeight:700,marginBottom:24}}>{editing?'تعديل الفصل':'إضافة فصل جديد'}</h3>
 <div style={{display:'flex',flexDirection:'column',gap:16}}>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
 <div><label style={lbl}>اسم الفصل</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp} placeholder="مثال: 1أ"/></div>
 <div><label style={lbl}>الطاقة الاستيعابية</label><input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:Number(e.target.value)})} style={inp} min="1"/></div>
 </div>
 <div><label style={lbl}>الصف الدراسي</label>
 <select value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})} style={inp}>
 {GRADES.map(g=><option key={g} value={g}>{g}</option>)}
 </select>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
 <div><label style={lbl}>المعلم المشرف</label><input value={form.teacher_name} onChange={e=>setForm({...form,teacher_name:e.target.value})} style={inp} placeholder="اسم المعلم"/></div>
 <div><label style={lbl}>رقم الغرفة</label><input value={form.room} onChange={e=>setForm({...form,room:e.target.value})} style={inp} placeholder="مثال: 101"/></div>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
 <div><label style={lbl}>المسار</label>
 <select value={form.track} onChange={e=>setForm({...form,track:e.target.value})} style={inp}>
 {['عام','علمي','أدبي','شرعي','علوم الحاسب','الصحة والحياة','إدارة الأعمال'].map(t=><option key={t} value={t}>{t}</option>)}
 </select>
 </div>
 <div><label style={lbl}>العام الدراسي</label><input value={form.academic_year} onChange={e=>setForm({...form,academic_year:e.target.value})} style={inp} placeholder="1446-1447"/></div>
 </div>
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
