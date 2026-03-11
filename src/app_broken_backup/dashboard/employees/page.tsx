'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function EmployeesPage(){
  const [employees,setEmployees]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');
  const [showAdd,setShowAdd]=useState(false);
  const [toast,setToast]=useState('');
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({name:'',email:'',phone:'',role:'staff',department:'',salary:'',hire_date:'',national_id:''});
  useEffect(()=>{load();},[]);
  const load=async()=>{try{const r=await fetch('/api/employees',{headers:getH(),credentials:'include'});const d=await r.json();setEmployees(Array.isArray(d)?d:d.employees||[]);}catch{}finally{setLoading(false);}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.name||!form.email)return showToast('الاسم والبريد مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/employees',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({...form,salary:parseFloat(form.salary)||0})});if(r.ok){showToast('تم إضافة الموظف ✓');setShowAdd(false);setForm({name:'',email:'',phone:'',role:'staff',department:'',salary:'',hire_date:'',national_id:''});load();}else showToast('فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const handleDelete=async(id:string)=>{if(!confirm('حذف الموظف؟'))return;try{const r=await fetch(`/api/employees?id=${id}`,{method:'DELETE',headers:getH(),credentials:'include'});if(r.ok){showToast('تم الحذف ✓');load();}else showToast('فشل');}catch{showToast('خطأ');}};
  const filtered=employees.filter(e=>!search||e.name?.toLowerCase().includes(search.toLowerCase())||e.email?.toLowerCase().includes(search.toLowerCase()));
  const ROLES:Record<string,string>={staff:'موظف',teacher:'معلم',admin:'مدير',driver:'سائق',security:'أمن',other:'أخرى'};
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">👔 الموظفون</h1><p className="text-gray-400 text-sm mt-1">{employees.length} موظف</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إضافة موظف</button>
      </div>
      <div className="mb-6">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 بحث بالاسم أو البريد..." style={{...inp,maxWidth:300}}/>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
        <div style={{overflowX:"auto"}}><table className="w-full text-sm">
          <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الموظف</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الدور</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">القسم</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">الراتب</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">تاريخ التعيين</th>
            <th className="text-right px-4 py-3 text-gray-400 font-medium">إجراءات</th>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={6} className="text-center py-12 text-gray-500">جاري التحميل...</td></tr>
            :filtered.length===0?<tr><td colSpan={6} className="text-center py-12 text-gray-500">لا يوجد موظفون</td></tr>
            :filtered.map((e:any)=>(
              <tr key={e.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{background:`${G}22`,color:G}}>{(e.name||'?')[0]}</div>
                    <div><div className="text-white font-medium">{e.name}</div><div className="text-xs text-gray-500">{e.email}</div></div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs" style={{background:`${G}22`,color:G}}>{ROLES[e.role]||e.role||'—'}</span></td>
                <td className="px-4 py-3 text-gray-300">{e.department||'—'}</td>
                <td className="px-4 py-3 text-gray-300">{e.salary?`${e.salary.toLocaleString()} ر.س`:'—'}</td>
                <td className="px-4 py-3 text-gray-300">{e.hire_date?new Date(e.hire_date).toLocaleDateString('ar-SA'):'—'}</td>
                <td className="px-4 py-3"><button onClick={()=>handleDelete(e.id)} className="px-3 py-1 rounded-lg text-xs" style={{background:'rgba(239,68,68,0.15)',color:'#EF4444'}}>حذف</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd&&(
        <Modal title="إضافة موظف جديد" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">الاسم *</label><input style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">البريد *</label><input style={inp} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الهاتف</label><input style={inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الدور</label><select style={inp} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>{Object.entries(ROLES).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">القسم</label><input style={inp} value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الراتب</label><input style={inp} type="number" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">تاريخ التعيين</label><input style={inp} type="date" value={form.hire_date} onChange={e=>setForm({...form,hire_date:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">رقم الهوية</label><input style={inp} value={form.national_id} onChange={e=>setForm({...form,national_id:e.target.value})}/></div>
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
