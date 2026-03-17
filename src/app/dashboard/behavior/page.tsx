'use client';
import { Drama } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
const TYPES=[{v:'positive',l:'سلوك إيجابي',c:'#10B981'},{v:'negative',l:'مخالفة سلوكية',c:'#EF4444'},{v:'warning',l:'إنذار',c:'#F59E0B'},{v:'suspension',l:'إيقاف',c:'#8B5CF6'}];
export default function BehaviorPage(){
  const [records,setRecords]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showModal,setShowModal]=useState(false);
  const [editing,setEditing]=useState<any>(null);
  const [form,setForm]=useState({student_id:'',student_name:'',type:'positive',description:'',action_taken:'',date:new Date().toISOString().split('T')[0],points:0});
  const [filterType,setFilterType]=useState('');
  const [search,setSearch]=useState('');
  const [saving,setSaving]=useState(false);
  useEffect(()=>{fetchData();},[]);
  const fetchData=async()=>{setLoading(true);try{const r=await fetch('/api/behavior',{headers:getH()});const d=await r.json();setRecords(Array.isArray(d)?d:(d.records||[]))}catch{setRecords([])}finally{setLoading(false)}};
  const openAdd=()=>{setEditing(null);setForm({student_id:'',student_name:'',type:'positive',description:'',action_taken:'',date:new Date().toISOString().split('T')[0],points:0});setShowModal(true)};
  const openEdit=(r:any)=>{setEditing(r);setForm({student_id:r.student_id||'',student_name:r.student_name||'',type:r.type||'positive',description:r.description||'',action_taken:r.action_taken||'',date:r.date?.split('T')[0]||'',points:r.points||0});setShowModal(true)};
  const save=async()=>{setSaving(true);try{const method=editing?'PUT':'POST';const url=editing?'/api/behavior?id='+editing.id:'/api/behavior';const r=await fetch(url,{method,headers:getH(),body:JSON.stringify(form)});if(r.ok){setShowModal(false);fetchData()}}catch{}finally{setSaving(false)}};
  const del=async(id:number)=>{if(!confirm('حذف هذا السجل؟'))return;try{await fetch('/api/behavior?id='+id,{method:'DELETE',headers:getH()});fetchData()}catch{}};
  const filtered=records.filter(r=>(!filterType||r.type===filterType)&&(!search||r.student_name?.includes(search)||r.description?.includes(search)));
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
  const lbl:React.CSSProperties={display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
  return(
    <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
        <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}>Drama السلوك والانضباط</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>تسجيل ومتابعة السلوك الطلابي</p></div>
        <button onClick={openAdd} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'#0B0B16',fontWeight:700,cursor:'pointer',fontSize:14}}>+ تسجيل حادثة</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginBottom:28}}>
        {TYPES.map(t=><div key={t.v} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}>
          <div style={{fontSize:24,fontWeight:800,color:t.c}}>{records.filter(r=>r.type===t.v).length}</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>{t.l}</div>
        </div>)}
      </div>
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث باسم الطالب..." style={{...inp,width:220}}/>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{...inp,width:180}}>
          <option value="">كل الأنواع</option>
          {TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
        </select>
      </div>
      <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'1px solid '+BR}}>{['الطالب','النوع','الوصف','الإجراء','النقاط','التاريخ','إجراءات'].map(h=><th key={h} style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>{h}</th>)}</tr></thead>
            <tbody>
              {loading?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
              :filtered.length===0?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد سجلات</td></tr>
              :filtered.map((r:any,i:number)=>{const t=TYPES.find(t=>t.v===r.type);return(
                <tr key={i} style={{borderBottom:'1px solid '+BR}}>
                  <td style={{padding:'12px 16px',color:'white',fontWeight:600,fontSize:14}}>{r.student_name||'—'}</td>
                  <td style={{padding:'12px 16px'}}><span style={{background:`${t?.c||'#9CA3AF'}22`,color:t?.c||'#9CA3AF',padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{t?.l||r.type}</span></td>
                  <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.7)',fontSize:13,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.description||'—'}</td>
                  <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{r.action_taken||'—'}</td>
                  <td style={{padding:'12px 16px',color:r.points>0?'#10B981':'#EF4444',fontWeight:700}}>{r.points>0?'+':''}{r.points||0}</td>
                  <td style={{padding:'12px 16px',color:'rgba(255,255,255,0.5)',fontSize:13}}>{r.date?new Date(r.date).toLocaleDateString('ar-SA'):'—'}</td>
                  <td style={{padding:'12px 16px'}}>
                    <div style={{display:'flex',gap:6}}>
                      <button onClick={()=>openEdit(r)} style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:6,padding:'5px 10px',color:'#3B82F6',cursor:'pointer',fontSize:12}}>تعديل</button>
                      <button onClick={()=>del(r.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:6,padding:'5px 10px',color:'#EF4444',cursor:'pointer',fontSize:12}}>حذف</button>
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </div>
      {showModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
          <div style={{background:'#111827',border:'1px solid '+BR,borderRadius:20,padding:32,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto'}}>
            <h3 style={{color:'white',fontSize:20,fontWeight:700,marginBottom:24}}>{editing?'تعديل السجل':'تسجيل حادثة جديدة'}</h3>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div><label style={lbl}>اسم الطالب</label><input value={form.student_name} onChange={e=>setForm({...form,student_name:e.target.value})} style={inp} placeholder="اسم الطالب"/></div>
              <div><label style={lbl}>نوع الحادثة</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={inp}>
                  {TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
                </select>
              </div>
              <div><label style={lbl}>الوصف</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{...inp,minHeight:80,resize:'vertical'}} placeholder="وصف الحادثة..."/></div>
              <div><label style={lbl}>الإجراء المتخذ</label><input value={form.action_taken} onChange={e=>setForm({...form,action_taken:e.target.value})} style={inp} placeholder="الإجراء المتخذ"/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><label style={lbl}>النقاط</label><input type="number" value={form.points} onChange={e=>setForm({...form,points:Number(e.target.value)})} style={inp}/></div>
                <div><label style={lbl}>التاريخ</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp}/></div>
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
