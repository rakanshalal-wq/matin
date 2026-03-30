'use client';
export const dynamic = 'force-dynamic';
import { CalendarDays } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='var(--gold)',BG='var(--bg)',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
const EVENT_TYPES=[{v:'exam',l:'اختبار',c:'#EF4444'},{v:'holiday',l:'إجازة',c:'#10B981'},{v:'meeting',l:'اجتماع',c:'#3B82F6'},{v:'activity',l:'نشاط',c:'#8B5CF6'},{v:'trip',l:'رحلة',c:'#F59E0B'},{v:'other',l:'أخرى',c:'#6B7280'}];
const DAYS_AR=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const MONTHS_AR=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
export default function CalendarPage(){
 const [events,setEvents]=useState<any[]>([]);
 const [loading,setLoading]=useState(true);
 const [showModal,setShowModal]=useState(false);
 const [editing,setEditing]=useState<any>(null);
 const [selectedDate,setSelectedDate]=useState<string|null>(null);
 const [form,setForm]=useState({title:'',type:'exam',date:'',end_date:'',description:'',all_day:true,location:''});
 const [saving,setSaving]=useState(false);
 const today=new Date();
 const [viewYear,setViewYear]=useState(today.getFullYear());
 const [viewMonth,setViewMonth]=useState(today.getMonth());
 useEffect(()=>{fetchData();},[]);
 const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/calendar',{headers:getH()});const d=await r.json();setEvents(Array.isArray(d)?d:(d.events||[]))}catch{setEvents([])}finally{setLoading(false)}};
 const openAdd=(date?:string)=>{setEditing(null);setForm({title:'',type:'exam',date:date||new Date().toISOString().split('T')[0],end_date:'',description:'',all_day:true,location:''});setShowModal(true)};
 const openEdit=(e:any)=>{setEditing(e);setForm({title:e.title||'',type:e.type||'exam',date:e.date?.split('T')[0]||'',end_date:e.end_date?.split('T')[0]||'',description:e.description||'',all_day:e.all_day!==false,location:e.location||''});setShowModal(true)};
 const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/calendar?id='+editing.id:'/api/calendar';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
 const del=async(id:number)=>{if(!confirm('حذف هذا الحدث؟'))return;try{await fetch('/api/calendar?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
 const getDaysInMonth=(y:number,m:number)=>new Date(y,m+1,0).getDate();
 const getFirstDay=(y:number,m:number)=>new Date(y,m,1).getDay();
 const daysInMonth=getDaysInMonth(viewYear,viewMonth);
 const firstDay=getFirstDay(viewYear,viewMonth);
 const prevMonth=()=>{if(viewMonth===0){setViewMonth(11);setViewYear(viewYear-1)}else setViewMonth(viewMonth-1)};
 const nextMonth=()=>{if(viewMonth===11){setViewMonth(0);setViewYear(viewYear+1)}else setViewMonth(viewMonth+1)};
 const getEventsForDay=(day:number)=>{const dateStr=`${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;return events.filter(e=>e.date?.startsWith(dateStr))};
 const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
 const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
 const cells=[];
 for(let i=0;i<firstDay;i++) cells.push(null);
 for(let d=1;d<=daysInMonth;d++) cells.push(d);
 const todayStr=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
 return(
 <div style={{minHeight:'100vh',background:'var(--bg)',padding:'24px 28px',direction:'rtl',fontFamily:'var(--font)'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
 <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}>[CalendarDays] التقويم المدرسي</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>جدول الأحداث والفعاليات والاختبارات</p></div>
 <button onClick={()=>openAdd()} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'var(--bg)',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة حدث</button>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:14,marginBottom:28}}>
 {EVENT_TYPES.map(t=><div key={t.v} style={{background:CB,border:'1px solid '+BR,borderRadius:12,padding:'14px 16px'}}>
 <div style={{fontSize:20,fontWeight:800,color:t.c}}>{events.filter(e=>e.type===t.v).length}</div>
 <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:3}}>{t.l}</div>
 </div>)}
 </div>
 <div style={{background:CB,border:'1px solid '+BR,borderRadius:20,padding:24,marginBottom:24}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
 <button onClick={prevMonth} style={{background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'8px 16px',color:'white',cursor:'pointer',fontSize:16}}>→</button>
 <h2 style={{color:'white',fontSize:20,fontWeight:700,margin:0}}>{MONTHS_AR[viewMonth]} {viewYear}</h2>
 <button onClick={nextMonth} style={{background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'8px 16px',color:'white',cursor:'pointer',fontSize:16}}>←</button>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:8}}>
 {DAYS_AR.map(d=><div key={d} style={{textAlign:'center',color:'rgba(255,255,255,0.4)',fontSize:12,padding:'4px 0',fontWeight:600}}>{d.slice(0,3)}</div>)}
 </div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}}>
 {cells.map((day,i)=>{
 if(!day) return <div key={'e'+i}/>;
 const dateStr=`${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
 const dayEvents=getEventsForDay(day);
 const isToday=dateStr===todayStr;
 return(
 <div key={day} onClick={()=>openAdd(dateStr)} style={{minHeight:80,background:isToday?'rgba(201,168,76,0.15)':CB,border:`1px solid ${isToday?GOLD:BR}`,borderRadius:10,padding:'6px 8px',cursor:'pointer',transition:'background 0.2s'}}>
 <div style={{color:isToday?GOLD:'rgba(255,255,255,0.7)',fontSize:13,fontWeight:isToday?700:400,marginBottom:4}}>{day}</div>
 {dayEvents.slice(0,2).map((e:any,ei:number)=>{const et=EVENT_TYPES.find(t=>t.v===e.type);return(
 <div key={ei} onClick={ev=>{ev.stopPropagation();openEdit(e)}} style={{background:`${et?.c||'#9CA3AF'}22`,borderRight:`2px solid ${et?.c||'#9CA3AF'}`,padding:'2px 6px',borderRadius:4,marginBottom:2,fontSize:11,color:'white',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.title}</div>
 )})}
 {dayEvents.length>2&&<div style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>+{dayEvents.length-2} أخرى</div>}
 </div>
 );
 })}
 </div>
 </div>
 <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
 <div style={{padding:'16px 20px',borderBottom:'1px solid '+BR}}><h3 style={{color:'white',fontSize:16,fontWeight:700,margin:0}}>الأحداث القادمة</h3></div>
 {loading?<div style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</div>
 :events.filter(e=>e.date>=todayStr).sort((a,b)=>a.date>b.date?1:-1).slice(0,10).map((e:any,i:number)=>{
 const et=EVENT_TYPES.find(t=>t.v===e.type);
 return(
 <div key={i} style={{display:'flex',alignItems:'center',gap:16,padding:'14px 20px',borderBottom:'1px solid '+BR}}>
 <div style={{width:4,height:40,background:et?.c||'#9CA3AF',borderRadius:2,flexShrink:0}}/>
 <div style={{flex:1}}>
 <div style={{color:'white',fontWeight:600,fontSize:14}}>{e.title}</div>
 <div style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginTop:2}}>{e.date?new Date(e.date).toLocaleDateString('ar-SA'):''}{e.location?' • '+e.location:''}</div>
 </div>
 <span style={{background:`${et?.c||'#9CA3AF'}22`,color:et?.c||'#9CA3AF',padding:'3px 10px',borderRadius:20,fontSize:12}}>{et?.l||e.type}</span>
 <div style={{display:'flex',gap:6}}>
 <button onClick={()=>openEdit(e)} style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,padding:'5px 10px',color:'#3B82F6',cursor:'pointer',fontSize:12}}>تعديل</button>
 <button onClick={()=>del(e.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'5px 10px',color:'#EF4444',cursor:'pointer',fontSize:12}}>حذف</button>
 </div>
 </div>
 );
 })}
 </div>
 {showModal&&(
 <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
 <div style={{background:'#111827',border:'1px solid '+BR,borderRadius:20,padding:32,width:'100%',maxWidth:500,maxHeight:'90vh',overflowY:'auto'}}>
 <h3 style={{color:'white',fontSize:20,fontWeight:700,marginBottom:24}}>{editing?'تعديل الحدث':'إضافة حدث جديد'}</h3>
 <div style={{display:'flex',flexDirection:'column',gap:14}}>
 <div><label style={lbl}>عنوان الحدث</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={inp} placeholder="عنوان الحدث"/></div>
 <div><label style={lbl}>نوع الحدث</label>
 <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={inp}>
 {EVENT_TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
 </select>
 </div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
 <div><label style={lbl}>تاريخ البداية</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp}/></div>
 <div><label style={lbl}>تاريخ النهاية</label><input type="date" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} style={inp}/></div>
 </div>
 <div><label style={lbl}>الموقع</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} style={inp} placeholder="موقع الحدث"/></div>
 <div><label style={lbl}>الوصف</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{...inp,minHeight:70,resize:'vertical'}} placeholder="وصف الحدث..."/></div>
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
