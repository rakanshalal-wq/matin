'use client';
import { Calendar } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
const DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
const PERIODS=['الحصة الأولى','الحصة الثانية','الحصة الثالثة','الحصة الرابعة','الحصة الخامسة','الحصة السادسة','الحصة السابعة'];
export default function SchedulePage(){
  const [schedule,setSchedule]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showModal,setShowModal]=useState(false);
  const [editing,setEditing]=useState<any>(null);
  const [form,setForm]=useState({class_name:'',subject:'',teacher_name:'',day:'الأحد',period:'الحصة الأولى',start_time:'07:30',end_time:'08:15',room:''});
  const [filterClass,setFilterClass]=useState('');
  const [filterDay,setFilterDay]=useState('');
  const [saving,setSaving]=useState(false);
  useEffect(()=>{fetchData();},[]);
  const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/schedules',{headers:getH()});const d=await r.json();setSchedule(Array.isArray(d)?d:(d.schedules||[]))}catch{setSchedule([])}finally{setLoading(false)}};
  const openAdd=()=>{setEditing(null);setForm({class_name:'',subject:'',teacher_name:'',day:'الأحد',period:'الحصة الأولى',start_time:'07:30',end_time:'08:15',room:''});setShowModal(true)};
  const openEdit=(s:any)=>{setEditing(s);setForm({class_name:s.class_name||'',subject:s.subject||'',teacher_name:s.teacher_name||'',day:s.day||'الأحد',period:s.period||'الحصة الأولى',start_time:s.start_time||'07:30',end_time:s.end_time||'08:15',room:s.room||''});setShowModal(true)};
  const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/schedules?id='+editing.id:'/api/schedules';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
  const del=async(id:number)=>{if(!confirm('حذف هذه الحصة؟'))return;try{await fetch('/api/schedules?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
  const classes=[...new Set(schedule.map(s=>s.class_name).filter(Boolean))];
  const filtered=schedule.filter(s=>(!filterClass||s.class_name===filterClass)&&(!filterDay||s.day===filterDay));
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
  const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
  const COLORS=['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899','#14B8A6','#EF4444'];
  return(
    <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
        <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}>Calendar الجدول الدراسي</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>إدارة جدول الحصص الدراسية</p></div>
        <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'#0B0B16',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة حصة</button>
      </div>
      <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
        <select value={filterClass} onChange={e=>setFilterClass(e.target.value)} style={{...inp,width:180}}>
          <option value="">كل الفصول</option>
          {classes.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterDay} onChange={e=>setFilterDay(e.target.value)} style={{...inp,width:160}}>
          <option value="">كل الأيام</option>
          {DAYS.map(d=><option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      {filterClass?(
        <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
              <thead><tr style={{borderBottom:'1px solid '+BR}}>
                <th style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,width:140}}>الحصة</th>
                {DAYS.map(d=><th key={d} style={{padding:'14px 16px',textAlign:'center',color:'rgba(255,255,255,0.5)',fontSize:13}}>{d}</th>)}
              </tr></thead>
              <tbody>
                {PERIODS.map(p=>(
                  <tr key={p} style={{borderBottom:'1px solid '+BR}}>
                    <td style={{padding:'12px 16px',color:GOLD,fontSize:13,fontWeight:600}}>{p}</td>
                    {DAYS.map((d,di)=>{
                      const cell=filtered.find(s=>s.day===d&&s.period===p);
                      return <td key={d} style={{padding:'8px',textAlign:'center'}}>
                        {cell?<div style={{background:`${COLORS[di%COLORS.length]}22`,border:`1px solid ${COLORS[di%COLORS.length]}44`,borderRadius:8,padding:'6px 10px',cursor:'pointer'}} onClick={()=>openEdit(cell)}>
                          <div style={{color:'white',fontSize:13,fontWeight:600}}>{cell.subject}</div>
                          <div style={{color:'rgba(255,255,255,0.5)',fontSize:11}}>{cell.teacher_name}</div>
                          {cell.room&&<div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>غرفة {cell.room}</div>}
                        </div>:<div style={{color:'rgba(255,255,255,0.15)',fontSize:12}}>—</div>}
                      </td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ):(
        <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{borderBottom:'1px solid '+BR}}>{['الفصل','المادة','المعلم','اليوم','الحصة','الوقت','الغرفة','إجراءات'].map(h=><th key={h} style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>{h}</th>)}</tr></thead>
              <tbody>
                {loading?<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
                :filtered.length===0?<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد حصص</td></tr>
                :filtered.map((s:any,i:number)=>(
                  <tr key={i} style={{borderBottom:'1px solid '+BR}}>
                    <td style={{padding:'12px 16px',color:GOLD,fontWeight:600,fontSize:14}}>{s.class_name||'—'}</td>
                    <td style={{padding:'12px 16px',color:'white',fontWeight:600,fontSize:14}}>{s.subject||'—'}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13}}>{s.teacher_name||'—'}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{s.day||'—'}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{s.period||'—'}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.5)',fontSize:13}}>{s.start_time||''}{s.end_time?' - '+s.end_time:''}</td>
                    <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.5)',fontSize:13}}>{s.room||'—'}</td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>openEdit(s)} style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,padding:'5px 10px',color:'#3B82F6',cursor:'pointer',fontSize:12}}>تعديل</button>
                        <button onClick={()=>del(s.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'5px 10px',color:'#EF4444',cursor:'pointer',fontSize:12}}>حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
          <div style={{background:'#111827',border:'1px solid '+BR,borderRadius:20,padding:32,width:'100%',maxWidth:500,maxHeight:'90vh',overflowY:'auto'}}>
            <h3 style={{color:'white',fontSize:20,fontWeight:700,marginBottom:24}}>{editing?'تعديل الحصة':'إضافة حصة جديدة'}</h3>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><label style={lbl}>الفصل</label><input value={form.class_name} onChange={e=>setForm({...form,class_name:e.target.value})} style={inp} placeholder="مثال: 1أ"/></div>
                <div><label style={lbl}>المادة</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={inp} placeholder="الرياضيات"/></div>
              </div>
              <div><label style={lbl}>المعلم</label><input value={form.teacher_name} onChange={e=>setForm({...form,teacher_name:e.target.value})} style={inp} placeholder="اسم المعلم"/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><label style={lbl}>اليوم</label><select value={form.day} onChange={e=>setForm({...form,day:e.target.value})} style={inp}>{DAYS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
                <div><label style={lbl}>الحصة</label><select value={form.period} onChange={e=>setForm({...form,period:e.target.value})} style={inp}>{PERIODS.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                <div><label style={lbl}>وقت البداية</label><input type="time" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} style={inp}/></div>
                <div><label style={lbl}>وقت النهاية</label><input type="time" value={form.end_time} onChange={e=>setForm({...form,end_time:e.target.value})} style={inp}/></div>
                <div><label style={lbl}>الغرفة</label><input value={form.room} onChange={e=>setForm({...form,room:e.target.value})} style={inp} placeholder="101"/></div>
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
