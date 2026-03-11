'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function HealthPage(){
  const [records,setRecords]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [toast,setToast]=useState('');
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({student_id:'',type:'checkup',description:'',date:new Date().toISOString().slice(0,10),treatment:'',notes:''});
  const [students,setStudents]=useState<any[]>([]);
  useEffect(()=>{load();loadStudents();},[]);
  const load=async()=>{try{const r=await fetch('/api/health',{headers:getH(),credentials:'include'});const d=await r.json();setRecords(Array.isArray(d)?d:d.records||[]);}catch{}finally{setLoading(false);}};
  const loadStudents=async()=>{try{const r=await fetch('/api/students',{headers:getH(),credentials:'include'});const d=await r.json();setStudents(Array.isArray(d)?d:d.students||[]);}catch{}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.student_id||!form.description)return showToast('الطالب والوصف مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/health',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify(form)});if(r.ok){showToast('تم التسجيل ✓');setShowAdd(false);setForm({student_id:'',type:'checkup',description:'',date:new Date().toISOString().slice(0,10),treatment:'',notes:''});load();}else showToast('فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const typeColor:Record<string,string>={checkup:'#3B82F6',injury:'#EF4444',illness:'#F59E0B',vaccination:'#22C55E'};
  const typeLabel:Record<string,string>={checkup:'فحص دوري',injury:'إصابة',illness:'مرض',vaccination:'تطعيم'};
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">🏥 الصحة المدرسية</h1><p className="text-gray-400 text-sm mt-1">{records.length} سجل صحي</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ تسجيل حالة</button>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.entries(typeLabel).map(([k,v])=>(
          <div key={k} className="rounded-2xl p-4 text-center" style={{background:CARD,border:`1px solid ${BORDER}`}}>
            <div className="text-2xl font-black mb-1" style={{color:typeColor[k]}}>{records.filter((r:any)=>r.type===k).length}</div>
            <div className="text-gray-400 text-sm">{v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
        <div style={{overflowX:"auto"}}><table className="w-full text-sm">
          <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الطالب</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">النوع</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الوصف</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">التاريخ</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">العلاج</th>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={5} className="text-center py-12 text-gray-500">جاري التحميل...</td></tr>
            :records.length===0?<tr><td colSpan={5} className="text-center py-12 text-gray-500">لا توجد سجلات</td></tr>
            :records.map((r:any)=>(
              <tr key={r.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white">{r.student_name||'—'}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-bold" style={{background:`${typeColor[r.type]||'#6B7280'}22`,color:typeColor[r.type]||'#6B7280'}}>{typeLabel[r.type]||r.type||'—'}</span></td>
                <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{r.description||'—'}</td>
                <td className="px-4 py-3 text-gray-300">{r.date?new Date(r.date).toLocaleDateString('ar-SA'):'—'}</td>
                <td className="px-4 py-3 text-gray-300">{r.treatment||'—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd&&(
        <Modal title="تسجيل حالة صحية" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div><label className="text-xs text-gray-400 mb-1 block">الطالب *</label><select style={inp} value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})}><option value="">اختر طالب</option>{students.map((s:any)=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-400 mb-1 block">النوع</label><select style={inp} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{Object.entries(typeLabel).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">التاريخ</label><input style={inp} type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            </div>
            <div><label className="text-xs text-gray-400 mb-1 block">الوصف *</label><textarea style={{...inp,minHeight:80,resize:'none'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
            <div><label className="text-xs text-gray-400 mb-1 block">العلاج</label><input style={inp} value={form.treatment} onChange={e=>setForm({...form,treatment:e.target.value})}/></div>
            <div><label className="text-xs text-gray-400 mb-1 block">ملاحظات</label><textarea style={{...inp,minHeight:60,resize:'none'}} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الحفظ...':'تسجيل'}</button>
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
