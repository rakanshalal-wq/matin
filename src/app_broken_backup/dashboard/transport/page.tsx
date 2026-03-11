'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function TransportPage(){
  const [buses,setBuses]=useState<any[]>([]);
  const [routes,setRoutes]=useState<any[]>([]);
  const [drivers,setDrivers]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState<'buses'|'routes'|'drivers'>('buses');
  const [showAdd,setShowAdd]=useState(false);
  const [toast,setToast]=useState('');
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({plate:'',capacity:'',driver_id:'',model:'',year:'',status:'active'});
  useEffect(()=>{load();},[tab]);
  const load=async()=>{
    setLoading(true);
    try{
      if(tab==='buses'){const r=await fetch('/api/transport/buses',{headers:getH(),credentials:'include'});const d=await r.json();setBuses(Array.isArray(d)?d:d.buses||[]);}
      else if(tab==='routes'){const r=await fetch('/api/transport/routes',{headers:getH(),credentials:'include'});const d=await r.json();setRoutes(Array.isArray(d)?d:d.routes||[]);}
      else{const r=await fetch('/api/transport/drivers',{headers:getH(),credentials:'include'});const d=await r.json();setDrivers(Array.isArray(d)?d:d.drivers||[]);}
    }catch{}finally{setLoading(false);}
  };
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.plate)return showToast('رقم اللوحة مطلوب');
    setSaving(true);
    try{const r=await fetch('/api/transport/buses',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({...form,capacity:parseInt(form.capacity)||0})});if(r.ok){showToast('تم الإضافة ✓');setShowAdd(false);setForm({plate:'',capacity:'',driver_id:'',model:'',year:'',status:'active'});load();}else showToast('فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const TABS=[{id:'buses',l:'الحافلات'},{id:'routes',l:'المسارات'},{id:'drivers',l:'السائقون'}];
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">🚌 النقل المدرسي</h1><p className="text-gray-400 text-sm mt-1">إدارة الحافلات والمسارات</p></div>
        {tab==='buses'&&<button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إضافة حافلة</button>}
      </div>
      <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{background:CARD,border:`1px solid ${BORDER}`,display:'inline-flex'}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id as any)} className="px-4 py-2 rounded-xl text-sm font-bold" style={{background:tab===t.id?G:'transparent',color:tab===t.id?'#000':'#9CA3AF'}}>{t.l}</button>
        ))}
      </div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :tab==='buses'?(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.length===0?<div className="col-span-3 text-center py-20 text-gray-500">لا توجد حافلات</div>
          :buses.map((b:any)=>(
            <div key={b.id} className="rounded-2xl p-5" style={{background:CARD,border:`1px solid ${BORDER}`}}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{background:`${G}22`}}>🚌</div>
                <div>
                  <div className="font-bold text-white">{b.plate||'—'}</div>
                  <div className="text-xs text-gray-400">{b.model||'—'} {b.year||''}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">السعة: <span className="text-white">{b.capacity||0}</span></span>
                <span className="px-2 py-0.5 rounded-full text-xs" style={{background:b.status==='active'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',color:b.status==='active'?'#22C55E':'#EF4444'}}>{b.status==='active'?'نشط':'معطل'}</span>
              </div>
              {b.driver_name&&<div className="text-xs text-gray-500 mt-2">السائق: {b.driver_name}</div>}
            </div>
          ))}
        </div>
      ):tab==='routes'?(
        <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
          <div style={{overflowX:"auto"}}><table className="w-full text-sm">
            <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">اسم المسار</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">نقطة البداية</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">نقطة النهاية</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">عدد الطلاب</th>
            </tr></thead>
            <tbody>
              {routes.length===0?<tr><td colSpan={4} className="text-center py-12 text-gray-500">لا توجد مسارات</td></tr>
              :routes.map((r:any)=>(
                <tr key={r.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium">{r.name||'—'}</td>
                  <td className="px-4 py-3 text-gray-300">{r.start_point||'—'}</td>
                  <td className="px-4 py-3 text-gray-300">{r.end_point||'—'}</td>
                  <td className="px-4 py-3 text-gray-300">{r.student_count||0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ):(
        <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
          <div style={{overflowX:"auto"}}><table className="w-full text-sm">
            <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">السائق</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">رقم الرخصة</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">الهاتف</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">الحافلة</th>
            </tr></thead>
            <tbody>
              {drivers.length===0?<tr><td colSpan={4} className="text-center py-12 text-gray-500">لا يوجد سائقون</td></tr>
              :drivers.map((d:any)=>(
                <tr key={d.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{d.name||'—'}</td>
                  <td className="px-4 py-3 text-gray-300">{d.license_number||'—'}</td>
                  <td className="px-4 py-3 text-gray-300">{d.phone||'—'}</td>
                  <td className="px-4 py-3 text-gray-300">{d.bus_plate||'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showAdd&&(
        <Modal title="إضافة حافلة" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">رقم اللوحة *</label><input style={inp} value={form.plate} onChange={e=>setForm({...form,plate:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الطراز</label><input style={inp} value={form.model} onChange={e=>setForm({...form,model:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">السنة</label><input style={inp} value={form.year} onChange={e=>setForm({...form,year:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">السعة</label><input style={inp} type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الحالة</label><select style={inp} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="active">نشط</option><option value="inactive">معطل</option></select></div>
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
