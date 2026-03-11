'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function CafeteriaPage(){
  const [items,setItems]=useState<any[]>([]);
  const [orders,setOrders]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState<'menu'|'orders'>('menu');
  const [showAdd,setShowAdd]=useState(false);
  const [toast,setToast]=useState('');
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({name:'',price:'',category:'',description:'',available:true});
  useEffect(()=>{load();},[tab]);
  const load=async()=>{
    setLoading(true);
    try{
      if(tab==='menu'){const r=await fetch('/api/cafeteria/menu',{headers:getH(),credentials:'include'});const d=await r.json();setItems(Array.isArray(d)?d:d.items||[]);}
      else{const r=await fetch('/api/cafeteria/orders',{headers:getH(),credentials:'include'});const d=await r.json();setOrders(Array.isArray(d)?d:d.orders||[]);}
    }catch{}finally{setLoading(false);}
  };
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.name||!form.price)return showToast('الاسم والسعر مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/cafeteria/menu',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({...form,price:parseFloat(form.price)||0})});if(r.ok){showToast('تم الإضافة ✓');setShowAdd(false);setForm({name:'',price:'',category:'',description:'',available:true});load();}else showToast('فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const toggleAvailable=async(id:string,available:boolean)=>{try{await fetch(`/api/cafeteria/menu?id=${id}`,{method:'PATCH',headers:getH(),credentials:'include',body:JSON.stringify({available:!available})});load();}catch{}};
  const CATEGORIES=['وجبات رئيسية','مشروبات','حلويات','وجبات خفيفة','فطور'];
  const totalRevenue=orders.reduce((s:number,o:any)=>s+(parseFloat(o.total)||0),0);
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">🍽️ المقصف</h1><p className="text-gray-400 text-sm mt-1">إدارة القائمة والطلبات</p></div>
        {tab==='menu'&&<button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إضافة وجبة</button>}
      </div>
      {tab==='orders'&&(
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[{l:'إجمالي الطلبات',v:orders.length,c:G},{l:'الإيرادات',v:`${totalRevenue.toFixed(0)} ر.س`,c:'#22C55E'},{l:'طلبات اليوم',v:orders.filter((o:any)=>o.created_at?.startsWith(new Date().toISOString().slice(0,10))).length,c:'#3B82F6'}].map((s,i)=>(
            <div key={i} className="rounded-2xl p-4 text-center" style={{background:CARD,border:`1px solid ${BORDER}`}}>
              <div className="text-2xl font-black mb-1" style={{color:s.c}}>{s.v}</div>
              <div className="text-gray-400 text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{background:CARD,border:`1px solid ${BORDER}`,display:'inline-flex'}}>
        {[{id:'menu',l:'القائمة'},{id:'orders',l:'الطلبات'}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id as any)} className="px-4 py-2 rounded-xl text-sm font-bold" style={{background:tab===t.id?G:'transparent',color:tab===t.id?'#000':'#9CA3AF'}}>{t.l}</button>
        ))}
      </div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :tab==='menu'?(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.length===0?<div className="col-span-4 text-center py-20 text-gray-500">لا توجد وجبات</div>
          :items.map((item:any)=>(
            <div key={item.id} className="rounded-2xl p-4" style={{background:CARD,border:`1px solid ${BORDER}`,opacity:item.available?1:0.6}}>
              <div className="text-3xl mb-2">🍽️</div>
              <div className="font-bold text-white mb-1">{item.name}</div>
              {item.category&&<div className="text-xs text-gray-400 mb-2">{item.category}</div>}
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold" style={{color:G}}>{item.price} ر.س</span>
                <button onClick={()=>toggleAvailable(item.id,item.available)} className="px-2 py-1 rounded-lg text-xs" style={{background:item.available?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',color:item.available?'#22C55E':'#EF4444'}}>{item.available?'متاح':'غير متاح'}</button>
              </div>
            </div>
          ))}
        </div>
      ):(
        <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
          <div style={{overflowX:"auto"}}><table className="w-full text-sm">
            <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">الطالب</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">الوجبات</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">الإجمالي</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">التاريخ</th>
            </tr></thead>
            <tbody>
              {orders.length===0?<tr><td colSpan={4} className="text-center py-12 text-gray-500">لا توجد طلبات</td></tr>
              :orders.map((o:any)=>(
                <tr key={o.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{o.student_name||'—'}</td>
                  <td className="px-4 py-3 text-gray-300">{o.items_count||1} وجبة</td>
                  <td className="px-4 py-3 font-bold" style={{color:G}}>{o.total||0} ر.س</td>
                  <td className="px-4 py-3 text-gray-300">{o.created_at?new Date(o.created_at).toLocaleDateString('ar-SA'):'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showAdd&&(
        <Modal title="إضافة وجبة" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div><label className="text-xs text-gray-400 mb-1 block">اسم الوجبة *</label><input style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-400 mb-1 block">السعر *</label><input style={inp} type="number" step="0.5" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الفئة</label><select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="">اختر</option>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div><label className="text-xs text-gray-400 mb-1 block">الوصف</label><textarea style={{...inp,minHeight:80,resize:'none'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
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
