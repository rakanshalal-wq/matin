'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { Shield } from "lucide-react";
import { useState, useEffect } from 'react';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')}}catch{return{'Content-Type':'application/json'}}};
const GOLD='#D4A843',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
const ROLES=[{id:'admin',label:'مدير المدرسة',color:'#EF4444'},{id:'teacher',label:'معلم',color:'#3B82F6'},{id:'student',label:'طالب',color:'#10B981'},{id:'parent',label:'ولي أمر',color:'#8B5CF6'},{id:'driver',label:'سائق',color:'#F59E0B'}];
const MODULES=[{id:'students',label:'الطلاب'},{id:'teachers',label:'المعلمون'},{id:'grades',label:'الدرجات'},{id:'attendance',label:'الحضور'},{id:'finance',label:'المالية'},{id:'reports',label:'التقارير'},{id:'exams',label:'الاختبارات'},{id:'library',label:'المكتبة'},{id:'cafeteria',label:'الكافتيريا'},{id:'transport',label:'النقل'},{id:'settings',label:'الإعدادات'},{id:'backup',label:'النسخ الاحتياطي'}];
const ACTIONS=['view','create','edit','delete'];
const ACTION_LABELS:Record<string,string>={view:'عرض',create:'إنشاء',edit:'تعديل',delete:'حذف'};
export default function PermissionsPage(){
 const [perms,setPerms]=useState<Record<string,Record<string,Record<string,boolean>>>>(()=>{
 const p:any={};
 ROLES.forEach(r=>{p[r.id]={};MODULES.forEach(m=>{p[r.id][m.id]={view:r.id==='admin',create:r.id==='admin',edit:r.id==='admin',delete:r.id==='admin'}})});
 return p;
 });
 const [selectedRole,setSelectedRole]=useState('admin');
 const [saving,setSaving]=useState(false);
 const [showModal,setShowModal]=useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [loading,setLoading]=useState(true);
 useEffect(()=>{fetchPerms();},[]);
 const fetchPerms=async()=>{setLoading(true);try{const r=await fetch('/api/permissions',{headers:getH()});const d=await r.json();if(d.permissions)setPerms(d.permissions)}catch{}finally{setLoading(false)}};
 const toggle=(module:string,action:string)=>{setPerms(p=>({...p,[selectedRole]:{...p[selectedRole],[module]:{...p[selectedRole][module],[action]:!p[selectedRole][module][action]}}}))};
 const toggleAll=(module:string,val:boolean)=>{setPerms(p=>({...p,[selectedRole]:{...p[selectedRole],[module]:Object.fromEntries(ACTIONS.map(a=>[a,val]))}}))};
 const save=async()=>{setSaving(true);try{await fetch('/api/permissions',{method:'PUT',headers:getH(),body:JSON.stringify({permissions:perms})});setErrMsg('')}catch(e:any){setErrMsg(e.message||'حدث خطأ');}finally{setSaving(false)}};
 const role=ROLES.find(r=>r.id===selectedRole);
 return(
 <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
 <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
 <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}>إدارة الصلاحيات</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>تحديد صلاحيات الوصول لكل دور في النظام</p></div>
 <button onClick={save} disabled={saving} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 24px',color:'#0B0B16',fontWeight:700,cursor:saving?'not-allowed':'pointer',fontSize:14,opacity:saving?0.7:1}}>{saving?'جاري الحفظ...':'حفظ الصلاحيات'}</button>
 </div>
 <div style={{display:'flex',gap:10,marginBottom:28,flexWrap:'wrap'}}>
 {ROLES.map(r=><button key={r.id} onClick={()=>setSelectedRole(r.id)} style={{padding:'10px 20px',borderRadius:10,border:'2px solid',borderColor:selectedRole===r.id?r.color:BR,background:selectedRole===r.id?`${r.color}22`:CB,color:selectedRole===r.id?r.color:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:14,fontWeight:selectedRole===r.id?700:400}}>{r.label}</button>)}
 </div>
 {role&&<div style={{background:`${role.color}11`,border:`1px solid ${role.color}44`,borderRadius:12,padding:'12px 20px',marginBottom:24,color:role.color,fontSize:14,fontWeight:600}}>تعديل صلاحيات: {role.label}</div>}
 {loading?<div style={{textAlign:'center',padding:60,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</div>:(
 <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
 <div style={{overflowX:'auto'}}>
 <table style={{width:'100%',borderCollapse:'collapse'}}>
 <thead><tr style={{borderBottom:'1px solid '+BR}}>
 <th style={{padding:'14px 20px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الوحدة</th>
 {ACTIONS.map(a=><th key={a} style={{padding:'14px 16px',textAlign:'center',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>{ACTION_LABELS[a]}</th>)}
 <th style={{padding:'14px 16px',textAlign:'center',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>الكل</th>
 </tr></thead>
 <tbody>
 {MODULES.map((m,i)=>{
 const mp=perms[selectedRole]?.[m.id]||{};
 const allOn=ACTIONS.every(a=>mp[a]);
 return(
 <tr key={m.id} style={{borderBottom:'1px solid '+BR,background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
 <td style={{padding:'14px 20px',color:'white',fontWeight:600,fontSize:14}}>{m.label}</td>
 {ACTIONS.map(a=>(
 <td key={a} style={{padding:'14px 16px',textAlign:'center'}}>
 <div onClick={()=>toggle(m.id,a)} style={{width:24,height:24,borderRadius:6,border:'2px solid',borderColor:mp[a]?(role?.color||GOLD):BR,background:mp[a]?`${role?.color||GOLD}33`:'transparent',cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}>
 {mp[a]&&<span style={{color:role?.color||GOLD,fontSize:14,fontWeight:800}}></span>}
 </div>
 </td>
 ))}
 <td style={{padding:'14px 16px',textAlign:'center'}}>
 <div onClick={()=>toggleAll(m.id,!allOn)} style={{width:24,height:24,borderRadius:6,border:'2px solid',borderColor:allOn?GOLD:BR,background:allOn?`${GOLD}33`:'transparent',cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}>
 {allOn&&<span style={{color:GOLD,fontSize:14,fontWeight:800}}><IconRenderer name="ICON_Check" size={36} /></span>}
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 )}
 </div>
 );
}
