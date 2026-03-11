'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function LeavesPage(){
  const [leaves,setLeaves]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [toast,setToast]=useState('');
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({employee_id:'',type:'annual',start_date:'',end_date:'',reason:''});
  const [employees,setEmployees]=useState<any[]>([]);
  useEffect(()=>{load();loadEmployees();},[]);
  const load=async()=>{try{const r=await fetch('/api/leaves',{headers:getH(),credentials:'include'});const d=await r.json();setLeaves(Array.isArray(d)?d:d.leaves||[]);}catch{}finally{setLoading(false);}};
  const loadEmployees=async()=>{try{const r=await fetch('/api/employees',{headers:getH(),credentials:'include'});const d=await r.json();setEmployees(Array.isArray(d)?d:d.employees||[]);}catch{}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.employee_id||!form.start_date||!form.end_date)return showToast('الموظف والتواريخ مطلوبة');
    setSaving(true);
    try{const r=await fetch('/api/leaves',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify(form)});if(r.ok){showToast('تم تقديم الطلب ✓');setShowAdd(false);setForm({employee_id:'',type:'annual',start_date:'',end_date:'',reason:''});load();}else showToast('فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const updateStatus=async(id:string,status:string)=>{try{const r=await fetch(`/api/leaves?id=${id}`,{method:'PATCH',headers:getH(),credentials:'include',body:JSON.stringify({status})});if(r.ok){showToast('تم التحديث ✓');load();}else showToast('فشل');}catch{showToast('خطأ');}};
  const statusColor:Record<string,string>={pending:'#F59E0B',approved:'#22C55E',rejected:'#EF4444'};
  const statusLabel:Record<string,string>={pending:'معلق',approved:'موافق',rejected:'مرفوض'};
  const typeLabel:Record<string,string>={annual:'سنوية',sick:'مرضية',emergency:'طارئة',unpaid:'بدون راتب'};
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">🏖️ الإجازات</h1><p className="text-gray-400 text-sm mt-1">{leaves.length} طلب</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ طلب إجازة</button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{l:'معلق',v:leaves.filter((l:any)=>l.status==='pending').length,c:'#F59E0B'},{l:'موافق',v:leaves.filter((l:any)=>l.status==='approved').length,c:'#22C55E'},{l:'مرفوض',v:leaves.filter((l:any)=>l.status==='rejected').length,c:'#EF4444'}].map((s,i)=>(
          <div key={i} className="rounded-2xl p-4 text-center" style={{background:CARD,border:`1px solid ${BORDER}`}}>
            <div className="text-2xl font-black mb-1" style={{color:s.c}}>{s.v}</div>
            <div className="text-gray-400 text-sm">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
        <div style={{overflowX:"auto"}}><table className="w-full text-sm">
          <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الموظف</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">النوع</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">من</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">إلى</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الحالة</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">إجراء</th>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={6} className="text-center py-12 text-gray-500">جاري التحميل...</td></tr>
            :leaves.length===0?<tr><td colSpan={6} className="text-center py-12 text-gray-500">لا توجد طلبات</td></tr>
            :leaves.map((l:any)=>(
              <tr key={l.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white">{l.employee_name||'—'}</td>
                <td className="px-4 py-3 text-gray-300">{typeLabel[l.type]||l.type||'—'}</td>
                <td className="px-4 py-3 text-gray-300">{l.start_date?new Date(l.start_date).toLocaleDateString('ar-SA'):'—'}</td>
                <td className="px-4 py-3 text-gray-300">{l.end_date?new Date(l.end_date).toLocaleDateString('ar-SA'):'—'}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-bold" style={{background:`${statusColor[l.status]||'#6B7280'}22`,color:statusColor[l.status]||'#6B7280'}}>{statusLabel[l.status]||l.status||'—'}</span></td>
                <td className="px-4 py-3">
                  {l.status==='pending'&&(
                    <div className="flex gap-1">
                      <button onClick={()=>updateStatus(l.id,'approved')} className="px-2 py-1 rounded-lg text-xs" style={{background:'rgba(34,197,94,0.15)',color:'#22C55E'}}>قبول</button>
                      <button onClick={()=>updateStatus(l.id,'rejected')} className="px-2 py-1 rounded-lg text-xs" style={{background:'rgba(239,68,68,0.15)',color:'#EF4444'}}>رفض</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd&&(
        <Modal title="طلب إجازة" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div><label className="text-xs text-gray-400 mb-1 block">الموظف *</label><select style={inp} value={form.employee_id} onChange={e=>setForm({...form,employee_id:e.target.value})}><option value="">اختر</option>{employees.map((e:any)=><option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
            <div><label className="text-xs text-gray-400 mb-1 block">نوع الإجازة</label><select style={inp} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="annual">سنوية</option><option value="sick">مرضية</option><option value="emergency">طارئة</option><option value="unpaid">بدون راتب</option></select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-400 mb-1 block">من *</label><input style={inp} type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">إلى *</label><input style={inp} type="date" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})}/></div>
            </div>
            <div><label className="text-xs text-gray-400 mb-1 block">السبب</label><textarea style={{...inp,minHeight:80,resize:'none'}} value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/></div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الحفظ...':'تقديم الطلب'}</button>
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
