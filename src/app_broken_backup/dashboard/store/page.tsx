'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function StorePage(){
  const [tab,setTab]=useState<'products'|'orders'>('products');
  const [products,setProducts]=useState<any[]>([]);
  const [orders,setOrders]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const [form,setForm]=useState({name:'',description:'',price:'',stock:'0',category:'',image_url:''});
  useEffect(()=>{loadProducts();loadOrders();},[]);
  const loadProducts=async()=>{try{const r=await fetch('/api/store/products',{headers:getH(),credentials:'include'});const d=await r.json();setProducts(Array.isArray(d)?d:d.products||[]);}catch{}finally{setLoading(false);}};
  const loadOrders=async()=>{try{const r=await fetch('/api/store/orders',{headers:getH(),credentials:'include'});const d=await r.json();setOrders(Array.isArray(d)?d:d.orders||[]);}catch{}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.name||!form.price)return showToast('الاسم والسعر مطلوبان');
    setSaving(true);
    try{const r=await fetch('/api/store/products',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify({...form,price:parseFloat(form.price),stock:parseInt(form.stock)||0})});const d=await r.json();if(r.ok){showToast('تم إضافة المنتج ✓');setShowAdd(false);setForm({name:'',description:'',price:'',stock:'0',category:'',image_url:''});loadProducts();}else showToast(d.error||'فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const handleDeleteProduct=async(id:string)=>{if(!confirm('حذف المنتج؟'))return;try{const r=await fetch(`/api/store/products?id=${id}`,{method:'DELETE',headers:getH(),credentials:'include'});if(r.ok){showToast('تم الحذف ✓');loadProducts();}else showToast('فشل');}catch{showToast('خطأ');}};
  const updateOrderStatus=async(id:string,status:string)=>{try{const r=await fetch(`/api/store/orders?id=${id}`,{method:'PATCH',headers:getH(),credentials:'include',body:JSON.stringify({status})});if(r.ok){showToast('تم التحديث ✓');loadOrders();}else showToast('فشل');}catch{showToast('خطأ');}};
  const statusColor:Record<string,string>={pending:'#F59E0B',confirmed:'#3B82F6',shipped:'#8B5CF6',delivered:'#22C55E',cancelled:'#EF4444'};
  const statusLabel:Record<string,string>={pending:'معلق',confirmed:'مؤكد',shipped:'مشحون',delivered:'مُسلَّم',cancelled:'ملغي'};
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">🛍️ المتجر</h1><p className="text-gray-400 text-sm mt-1">{products.length} منتج • {orders.length} طلب</p></div>
        {tab==='products'&&<button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إضافة منتج</button>}
      </div>
      <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{background:CARD,border:`1px solid ${BORDER}`,display:'inline-flex'}}>
        {(['products','orders'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className="px-5 py-2 rounded-xl text-sm font-bold transition-all" style={{background:tab===t?G:'transparent',color:tab===t?'#000':'#9CA3AF'}}>{t==='products'?'المنتجات':'الطلبات'}</button>
        ))}
      </div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :tab==='products'?(
        products.length===0?<div className="text-center py-20 text-gray-500">لا توجد منتجات</div>
        :<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p:any)=>(
            <div key={p.id} className="rounded-2xl overflow-hidden" style={{background:CARD,border:`1px solid ${BORDER}`}}>
              <div className="h-40 flex items-center justify-center text-5xl" style={{background:'rgba(255,255,255,0.03)'}}>
                {p.image_url?<img src={p.image_url} className="w-full h-full object-cover" alt={p.name}/>:'🛍️'}
              </div>
              <div className="p-4">
                <div className="font-bold text-white mb-1">{p.name}</div>
                {p.description&&<p className="text-gray-400 text-xs mb-2 line-clamp-2">{p.description}</p>}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-black" style={{color:G}}>{p.price} ر.س</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{background:p.stock>0?'#22C55E22':'#EF444422',color:p.stock>0?'#22C55E':'#EF4444'}}>{p.stock>0?`${p.stock} متوفر`:'نفد'}</span>
                </div>
                <button onClick={()=>handleDeleteProduct(p.id)} className="w-full py-1.5 rounded-xl text-xs font-medium" style={{background:'rgba(239,68,68,0.15)',color:'#EF4444'}}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      ):(
        orders.length===0?<div className="text-center py-20 text-gray-500">لا توجد طلبات</div>
        :<div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
          <div style={{overflowX:"auto"}}><table className="w-full text-sm">
            <thead><tr style={{background:'rgba(255,255,255,0.05)',borderBottom:`1px solid ${BORDER}`}}>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">رقم الطلب</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">العميل</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">الإجمالي</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">الحالة</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">إجراء</th>
            </tr></thead>
            <tbody>
              {orders.map((o:any)=>{
                const sc=statusColor[o.status]||G;
                return(
                  <tr key={o.id} style={{borderBottom:`1px solid ${BORDER}`}} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-400 text-xs">#{o.id?.slice(0,8)||'—'}</td>
                    <td className="px-4 py-3 text-white">{o.customer_name||o.user_name||'—'}</td>
                    <td className="px-4 py-3 font-bold" style={{color:G}}>{o.total_amount||o.total||0} ر.س</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-bold" style={{background:`${sc}22`,color:sc}}>{statusLabel[o.status]||o.status}</span></td>
                    <td className="px-4 py-3">
                      <select style={{...inp,padding:'4px 8px',fontSize:12,width:'auto'}} value={o.status} onChange={e=>updateOrderStatus(o.id,e.target.value)}>
                        {Object.entries(statusLabel).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {showAdd&&(
        <Modal title="إضافة منتج جديد" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">اسم المنتج *</label><input style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="اسم المنتج"/></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">الوصف</label><textarea style={{...inp,minHeight:80,resize:'none'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="وصف المنتج..."/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">السعر (ر.س) *</label><input style={inp} type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">المخزون</label><input style={inp} type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الفئة</label><input style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="كتب، أدوات..."/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">رابط الصورة</label><input style={inp} value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} placeholder="https://..."/></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الحفظ...':'إضافة المنتج'}</button>
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{background:CARD,border:`1px solid ${BORDER}`,color:'white'}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
