'use client';
import { BookOpen, Check } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
const STAGES=['الابتدائية','المتوسطة','الثانوية','جميع المراحل'];
const TRACKS=['عام','علمي','أدبي','شرعي','علوم الحاسب والهندسة','الصحة والحياة','إدارة الأعمال'];
export default function SubjectsPage(){
  const [subjects,setSubjects]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showModal,setShowModal]=useState(false);
  const [editing,setEditing]=useState<any>(null);
  const [form,setForm]=useState({name:'',name_en:'',code:'',stage:'الابتدائية',track:'عام',weekly_hours:4,is_mandatory:true,description:''});
  const [filterStage,setFilterStage]=useState('');
  const [search,setSearch]=useState('');
  const [saving,setSaving]=useState(false);
  useEffect(()=>{fetchData();},[]);
  const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/subjects',{headers:getH()});const d=await r.json();setSubjects(Array.isArray(d)?d:(d.subjects||[]))}catch{setSubjects([])}finally{setLoading(false)}};
  const openAdd=()=>{setEditing(null);setForm({name:'',name_en:'',code:'',stage:'الابتدائية',track:'عام',weekly_hours:4,is_mandatory:true,description:''});setShowModal(true)};
  const openEdit=(s:any)=>{setEditing(s);setForm({name:s.name||'',name_en:s.name_en||'',code:s.code||'',stage:s.stage||'الابتدائية',track:s.track||'عام',weekly_hours:s.weekly_hours||4,is_mandatory:s.is_mandatory!==false,description:s.description||''});setShowModal(true)};
  const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/subjects?id='+editing.id:'/api/subjects';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
  const del=async(id:number)=>{if(!confirm('حذف هذه المادة؟'))return;try{await fetch('/api/subjects?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
  const filtered=subjects.filter(s=>(!filterStage||s.stage===filterStage)&&(!search||s.name?.includes(search)||s.code?.includes(search)));
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
  const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
  return(
    <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
        <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}>BookOpen المواد الدراسية</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>إدارة جميع المواد الدراسية لكل المراحل والمسارات</p></div>
        <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'#0B0B16',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة مادة</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginBottom:28}}>
        {[{l:'إجمالي المواد',v:subjects.length,c:GOLD},{l:'الابتدائية',v:subjects.filter(s=>s.stage==='الابتدائية').length,c:'#3B82F6'},{l:'المتوسطة',v:subjects.filter(s=>s.stage==='المتوسطة').length,c:'#10B981'},{l:'الثانوية',v:subjects.filter(s=>s.stage==='الثانوية').length,c:'#8B5CF6'}].map((s,i)=>(
          <div key={i} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}>
            <div style={{fontSize:26,fontWeight:800,color:s.c}}>{loading?'...':s.v}</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث باسم المادة أو الكود..." style={{...inp,width:240}}/>
        <select value={filterStage} onChange={e=>setFilterStage(e.target.value)} style={{...inp,width:160}}>
          <option value="">كل المراحل</option>
          {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'1px solid '+BR}}>{['المادة','الكود','المرحلة','المسار','الساعات الأسبوعية','إلزامية','إجراءات'].map(h=><th key={h} style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>{h}</th>)}</tr></thead>
            <tbody>
              {loading?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
              :filtered.length===0?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد مواد</td></tr>
              :filtered.map((s:any,i:number)=>(
                <tr key={i} style={{borderBottom:'1px solid '+BR}}>
                  <td style={{padding:'12px 16px'}}><div style={{color:'white',fontWeight:600,fontSize:14}}>{s.name}</div>{s.name_en&&<div style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>{s.name_en}</div>}</td>
                  <td style={{padding:'12px 16px',color:GOLD,fontFamily:'monospace',fontSize:13}}>{s.code||'—'}</td>
                  <td style={{padding:'12px 16px'}}><span style={{background:'rgba(59,130,246,0.15)',color:'#3B82F6',padding:'3px 10px',borderRadius:20,fontSize:12}}>{s.stage||'—'}</span></td>
                  <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{s.track||'—'}</td>
                  <td style={{padding:'12px 16px',color:'white',fontWeight:600,textAlign:'center'}}>{s.weekly_hours||'—'}</td>
                  <td style={{padding:'12px 16px',textAlign:'center'}}><span style={{color:s.is_mandatory!==false?'#10B981':'#6B7280',fontSize:16}}>{s.is_mandatory!==false?"ICON_Check":'—'}</span></td>
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
      {showModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
          <div style={{background:'#111827',border:'1px solid '+BR,borderRadius:20,padding:32,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto'}}>
            <h3 style={{color:'white',fontSize:20,fontWeight:700,marginBottom:24}}>{editing?'تعديل المادة':'إضافة مادة جديدة'}</h3>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><label style={lbl}>اسم المادة (عربي)</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp} placeholder="مثال: الرياضيات"/></div>
                <div><label style={lbl}>اسم المادة (إنجليزي)</label><input value={form.name_en} onChange={e=>setForm({...form,name_en:e.target.value})} style={inp} placeholder="Mathematics"/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><label style={lbl}>كود المادة</label><input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} style={inp} placeholder="MATH101"/></div>
                <div><label style={lbl}>الساعات الأسبوعية</label><input type="number" value={form.weekly_hours} onChange={e=>setForm({...form,weekly_hours:Number(e.target.value)})} style={inp} min="1" max="20"/></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><label style={lbl}>المرحلة الدراسية</label>
                  <select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})} style={inp}>
                    {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>المسار</label>
                  <select value={form.track} onChange={e=>setForm({...form,track:e.target.value})} style={inp}>
                    {TRACKS.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={lbl}>الوصف</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{...inp,minHeight:70,resize:'vertical'}} placeholder="وصف المادة..."/></div>
              <div style={{display:'flex',alignItems:'center',gap:12,background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'12px 16px'}}>
                <div onClick={()=>setForm({...form,is_mandatory:!form.is_mandatory})} style={{width:40,height:22,borderRadius:11,background:form.is_mandatory?GOLD:'rgba(255,255,255,0.1)',cursor:'pointer',position:'relative',transition:'background 0.3s'}}>
                  <div style={{position:'absolute',top:2,right:form.is_mandatory?2:undefined,left:form.is_mandatory?undefined:2,width:18,height:18,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
                </div>
                <span style={{color:'rgba(255,255,255,0.7)',fontSize:14}}>مادة إلزامية</span>
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
