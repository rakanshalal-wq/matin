'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
function Modal({title,onClose,children}:any){return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)'}}><div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{background:'#0D0D1A',border:`1px solid ${BORDER}`}}><div className="flex items-center justify-between px-6 py-4" style={{borderBottom:`1px solid ${BORDER}`}}><h3 className="font-bold text-lg text-white">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button></div><div className="p-6">{children}</div></div></div>);}
export default function LibraryPage(){
  const [books,setBooks]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');
  const [showAdd,setShowAdd]=useState(false);
  const [toast,setToast]=useState('');
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({title:'',author:'',isbn:'',category:'',quantity:1,description:''});
  useEffect(()=>{load();},[]);
  const load=async()=>{try{const r=await fetch('/api/library',{headers:getH(),credentials:'include'});const d=await r.json();setBooks(Array.isArray(d)?d:d.books||[]);}catch{}finally{setLoading(false);}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleAdd=async()=>{
    if(!form.title)return showToast('عنوان الكتاب مطلوب');
    setSaving(true);
    try{const r=await fetch('/api/library',{method:'POST',headers:getH(),credentials:'include',body:JSON.stringify(form)});if(r.ok){showToast('تم إضافة الكتاب ✓');setShowAdd(false);setForm({title:'',author:'',isbn:'',category:'',quantity:1,description:''});load();}else showToast('فشل');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const handleDelete=async(id:string)=>{if(!confirm('حذف الكتاب؟'))return;try{const r=await fetch(`/api/library?id=${id}`,{method:'DELETE',headers:getH(),credentials:'include'});if(r.ok){showToast('تم الحذف ✓');load();}else showToast('فشل');}catch{showToast('خطأ');}};
  const filtered=books.filter(b=>!search||b.title?.toLowerCase().includes(search.toLowerCase())||b.author?.toLowerCase().includes(search.toLowerCase()));
  const CATEGORIES=['علوم','رياضيات','لغة عربية','لغة إنجليزية','تاريخ','جغرافيا','دين','أدب','أخرى'];
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">📚 المكتبة</h1><p className="text-gray-400 text-sm mt-1">{books.length} كتاب</p></div>
        <button onClick={()=>setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>+ إضافة كتاب</button>
      </div>
      <div className="mb-6">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 بحث بالعنوان أو المؤلف..." style={{...inp,maxWidth:320}}/>
      </div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :filtered.length===0?<div className="text-center py-20 text-gray-500">لا توجد كتب</div>
      :<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((b:any)=>(
          <div key={b.id} className="rounded-2xl p-4" style={{background:CARD,border:`1px solid ${BORDER}`}}>
            <div className="w-12 h-16 rounded-xl flex items-center justify-center text-2xl mb-3" style={{background:`${G}22`}}>📖</div>
            <div className="font-bold text-white mb-1 truncate">{b.title}</div>
            <div className="text-gray-400 text-xs mb-2">{b.author||'—'}</div>
            {b.category&&<div className="inline-block px-2 py-0.5 rounded-full text-xs mb-2" style={{background:`${G}22`,color:G}}>{b.category}</div>}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">الكمية: {b.quantity||1}</span>
              <button onClick={()=>handleDelete(b.id)} className="px-2 py-1 rounded-lg text-xs" style={{background:'rgba(239,68,68,0.15)',color:'#EF4444'}}>حذف</button>
            </div>
          </div>
        ))}
      </div>}
      {showAdd&&(
        <Modal title="إضافة كتاب" onClose={()=>setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">عنوان الكتاب *</label><input style={inp} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">المؤلف</label><input style={inp} value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">ISBN</label><input style={inp} value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})}/></div>
              <div><label className="text-xs text-gray-400 mb-1 block">التصنيف</label><select style={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="">اختر</option>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الكمية</label><input style={inp} type="number" min={1} value={form.quantity} onChange={e=>setForm({...form,quantity:parseInt(e.target.value)||1})}/></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">الوصف</label><textarea style={{...inp,minHeight:80,resize:'none'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
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
