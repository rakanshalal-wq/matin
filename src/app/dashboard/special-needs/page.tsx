'use client';
import { Accessibility, Calendar } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
const NEEDS_TYPES=[{v:'learning_disability',l:'صعوبات التعلم',c:'#3B82F6'},{v:'physical',l:'إعاقة جسدية',c:'#F59E0B'},{v:'visual',l:'إعاقة بصرية',c:'#8B5CF6'},{v:'hearing',l:'إعاقة سمعية',c:'#EC4899'},{v:'autism',l:'طيف التوحد',c:'#10B981'},{v:'gifted',l:'موهوب',c:GOLD},{v:'other',l:'أخرى',c:'#6B7280'}];
const SUPPORT_LEVELS=[{v:'low',l:'منخفض',c:'#10B981'},{v:'medium',l:'متوسط',c:'#F59E0B'},{v:'high',l:'مرتفع',c:'#EF4444'}];
export default function SpecialNeedsPage(){
  const [students,setStudents]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showModal,setShowModal]=useState(false);
  const [editing,setEditing]=useState<any>(null);
  const [form,setForm]=useState({student_id:'',student_name:'',grade:'',needs_type:'learning_disability',support_level:'medium',accommodations:'',notes:'',iep_date:''});
  const [filterType,setFilterType]=useState('');
  const [search,setSearch]=useState('');
  const [saving,setSaving]=useState(false);
  useEffect(()=>{fetchData();},[]);
  const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/special-needs',{headers:getH()});const d=await r.json();setStudents(Array.isArray(d)?d:(d.students||[]))}catch{setStudents([])}finally{setLoading(false)}};
  const openAdd=()=>{setEditing(null);setForm({student_id:'',student_name:'',grade:'',needs_type:'learning_disability',support_level:'medium',accommodations:'',notes:'',iep_date:''});setShowModal(true)};
  const openEdit=(s:any)=>{setEditing(s);setForm({student_id:s.student_id||'',student_name:s.student_name||'',grade:s.grade||'',needs_type:s.needs_type||'learning_disability',support_level:s.support_level||'medium',accommodations:s.accommodations||'',notes:s.notes||'',iep_date:s.iep_date?.split('T')[0]||''});setShowModal(true)};
  const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/special-needs?id='+editing.id:'/api/special-needs';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
  const del=async(id:number)=>{if(!confirm('حذف هذا السجل؟'))return;try{await fetch('/api/special-needs?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
  const filtered=students.filter(s=>(!filterType||s.needs_type===filterType)&&(!search||s.student_name?.includes(search)));
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
  const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
  return(
    <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
        <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}>Accessibility ذوو الاحتياجات الخاصة</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>إدارة ملفات الطلاب ذوي الاحتياجات الخاصة وخطط الدعم</p></div>
        <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'#0B0B16',fontWeight:700,cursor:'pointer',fontSize:14}}>+ إضافة طالب</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:14,marginBottom:28}}>
        {[{l:'إجمالي الطلاب',v:students.length,c:GOLD},{l:'دعم مرتفع',v:students.filter(s=>s.support_level==='high').length,c:'#EF4444'},{l:'دعم متوسط',v:students.filter(s=>s.support_level==='medium').length,c:'#F59E0B'},{l:'دعم منخفض',v:students.filter(s=>s.support_level==='low').length,c:'#10B981'}].map((s,i)=>(
          <div key={i} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'16px 18px'}}>
            <div style={{fontSize:24,fontWeight:800,color:s.c}}>{loading?'...':s.v}</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث باسم الطالب..." style={{...inp,width:220}}/>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{...inp,width:200}}>
          <option value="">كل الاحتياجات</option>
          {NEEDS_TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
        </select>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:20}}>
        {loading?<div style={{textAlign:'center',padding:60,color:'rgba(255,255,255,0.4)',gridColumn:'1/-1'}}>جاري التحميل...</div>
        :filtered.length===0?<div style={{textAlign:'center',padding:60,color:'rgba(255,255,255,0.4)',gridColumn:'1/-1'}}>لا يوجد طلاب</div>
        :filtered.map((s:any,i:number)=>{
          const nt=NEEDS_TYPES.find(t=>t.v===s.needs_type);
          const sl=SUPPORT_LEVELS.find(l=>l.v===s.support_level);
          return(
            <div key={i} style={{background:CB,border:'1px solid '+BR,borderRadius:16,padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                <div>
                  <div style={{color:'white',fontWeight:700,fontSize:16}}>{s.student_name||'—'}</div>
                  <div style={{color:'rgba(255,255,255,0.5)',fontSize:13,marginTop:3}}>{s.grade||'—'}</div>
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button onClick={()=>openEdit(s)} style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,padding:'5px 10px',color:'#3B82F6',cursor:'pointer',fontSize:12}}>تعديل</button>
                  <button onClick={()=>del(s.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'5px 10px',color:'#EF4444',cursor:'pointer',fontSize:12}}>حذف</button>
                </div>
              </div>
              <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
                <span style={{background:`${nt?.c||'#9CA3AF'}22`,color:nt?.c||'#9CA3AF',padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{nt?.l||s.needs_type}</span>
                <span style={{background:`${sl?.c||'#9CA3AF'}22`,color:sl?.c||'#9CA3AF',padding:'4px 10px',borderRadius:20,fontSize:12}}>دعم {sl?.l||s.support_level}</span>
              </div>
              {s.accommodations&&<div style={{color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:8}}><span style={{color:'rgba(255,255,255,0.4)'}}>التسهيلات: </span>{s.accommodations}</div>}
              {s.iep_date&&<div style={{color:'rgba(255,255,255,0.4)',fontSize:12}}>Calendar خطة IEP: {new Date(s.iep_date).toLocaleDateString('ar-SA')}</div>}
            </div>
          );
        })}
      </div>
      {showModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
          <div style={{background:'#111827',border:'1px solid '+BR,borderRadius:20,padding:32,width:'100%',maxWidth:540,maxHeight:'90vh',overflowY:'auto'}}>
            <h3 style={{color:'white',fontSize:20,fontWeight:700,marginBottom:24}}>{editing?'تعديل بيانات الطالب':'إضافة طالب جديد'}</h3>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><label style={lbl}>اسم الطالب</label><input value={form.student_name} onChange={e=>setForm({...form,student_name:e.target.value})} style={inp} placeholder="الاسم الكامل"/></div>
                <div><label style={lbl}>الصف الدراسي</label><input value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})} style={inp} placeholder="مثال: الثالث ابتدائي"/></div>
              </div>
              <div><label style={lbl}>نوع الاحتياج</label>
                <select value={form.needs_type} onChange={e=>setForm({...form,needs_type:e.target.value})} style={inp}>
                  {NEEDS_TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
                </select>
              </div>
              <div><label style={lbl}>مستوى الدعم المطلوب</label>
                <select value={form.support_level} onChange={e=>setForm({...form,support_level:e.target.value})} style={inp}>
                  {SUPPORT_LEVELS.map(l=><option key={l.v} value={l.v}>{l.l}</option>)}
                </select>
              </div>
              <div><label style={lbl}>التسهيلات المقدمة</label><textarea value={form.accommodations} onChange={e=>setForm({...form,accommodations:e.target.value})} style={{...inp,minHeight:80,resize:'vertical'}} placeholder="وصف التسهيلات والدعم المقدم..."/></div>
              <div><label style={lbl}>ملاحظات إضافية</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} style={{...inp,minHeight:60,resize:'vertical'}} placeholder="ملاحظات..."/></div>
              <div><label style={lbl}>تاريخ خطة IEP</label><input type="date" value={form.iep_date} onChange={e=>setForm({...form,iep_date:e.target.value})} style={inp}/></div>
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
