'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function PayrollPage(){
  const [records,setRecords]=useState<any[]>([]);
  const [employees,setEmployees]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const [monthFilter,setMonthFilter]=useState(new Date().toISOString().slice(0,7));
  const [form,setForm]=useState({employee_id:'',base_salary:'',allowances:'0',deductions:'0',month:'',notes:'',status:'pending'});
  useEffect(()=>{load();},[monthFilter]);
  const load=async()=>{try{const r=await fetch(`/api/payroll?month=${monthFilter}`,{headers:getH(),credentials:'include'});const d=await r.json();setRecords(Array.isArray(d)?d:d.payroll||[]);setEmployees(d.employees||[]);}catch{}finally{setLoading(false);}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.employee_id||!form.base_salary)return showToast('الموظف والراتب الأساسي مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/payroll',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({...form,base_salary:parseFloat(form.base_salary),allowances:parseFloat(form.allowances)||0,deductions:parseFloat(form.deductions)||0,month:form.month||monthFilter})});const d=await r.json();if(r.ok){showToast('تم إضافة الراتب ✓');setShowAdd(false);setForm({employee_id:'',base_salary:'',allowances:'0',deductions:'0',month:'',notes:'',status:'pending'});load();}else showToast(d.error||'فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const markPaid=async(id:string)=>{try{const r=await fetch(`/api/payroll?id=${id}`,{method:'PATCH',headers:getH(),credentials:'include',body:JSON.stringify({status:'paid'})});if(r.ok){showToast('تم تسجيل الدفع ✓');load();}else showToast('فشل');}catch{showToast('خطأ');}};
  const totalNet=records.reduce((s:number,r:any)=>s+((r.base_salary||0)+(r.allowances||0)-(r.deductions||0)),0);
  const totalPaid=records.filter((r:any)=>r.status==='paid').length;
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">💰 الرواتب</h1><p className="text-gray-400 text-sm mt-1">{records.length} سجل</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إضافة راتب</button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{l:'إجمالي الرواتب',v:`${totalNet.toLocaleString()} ر.س`,c:G},{l:'تم الدفع',v:totalPaid,c:'#22C55E'},{l:'معلق',v:records.length-totalPaid,c:'#F59E0B'}].map((s,i)=>(
          <div key={i} className="rounded-2xl p-4 text-center" style={{background:CARD,border:`1px solid ${BORDER}`}}>
            <div className="text-2xl font-black mb-1" style={{color:s.c}}>{s.v}</div>
            <div className="text-gray-400 text-sm">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mb-6">
        <input type="month" value={monthFilter} onChange={e=>setMonthFilter(e.target.value)} style={{...inp,maxWidth:200}}/>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
        <div style={{overflowX:"auto"}}><table className="w-full text-sm">
          <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الموظف</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الراتب الأساسي</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">البدلات</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الخصومات</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الصافي</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الحالة</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">إجراء</th>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={7} className="text-center py-12 text-gray-500">جاري التحميل...</td></tr>
            :records.length===0?<tr><td colSpan={7} className="text-center py-12 text-gray-500">لا توجد سجلات</td></tr>
            :records.map((r:any)=>{
              const net=(r.base_salary||0)+(r.allowances||0)-(r.deductions||0);
              return(
                <tr key={r.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{background:`${G}22`,color:G}}>{(r.employee_name||'?')[0]}</div>
                      <span className="text-white">{r.employee_name||'—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{(r.base_salary||0).toLocaleString()} ر.س</td>
                  <td className="px-4 py-3 text-green-400">+{(r.allowances||0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-400">-{(r.deductions||0).toLocaleString()}</td>
                  <td className="px-4 py-3 font-black" style={{color:G}}>{net.toLocaleString()} ر.س</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-bold" style={{background:r.status==='paid'?'#22C55E22':'#F59E0B22',color:r.status==='paid'?'#22C55E':'#F59E0B'}}>{r.status==='paid'?'مدفوع':'معلق'}</span></td>
                  <td className="px-4 py-3">{r.status!=='paid'&&<button onClick={()=>markPaid(r.id)} className="px-3 py-1 rounded-lg text-xs" style={{background:'#22C55E22',color:'#22C55E'}}>تسجيل دفع</button>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showAdd&&(
        <Modal title="إضافة راتب" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">الموظف *</label><select style={inp} value={form.employee_id} onChange={e=>setForm({...form,employee_id:e.target.value})}><option value="">اختر</option>{employees.map((e:any)=><option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الراتب الأساسي *</label><input style={inp} type="number" value={form.base_salary} onChange={e=>setForm({...form,base_salary:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الشهر</label><input style={inp} type="month" value={form.month||monthFilter} onChange={e=>setForm({...form,month:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">البدلات</label><input style={inp} type="number" value={form.allowances} onChange={e=>setForm({...form,allowances:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الخصومات</label><input style={inp} type="number" value={form.deductions} onChange={e=>setForm({...form,deductions:e.target.value})}/></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">ملاحظات</label><input style={inp} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الحفظ...':'إضافة'}</button>
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
