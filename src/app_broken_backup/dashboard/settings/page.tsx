'use client';
import { useState, useEffect } from 'react';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{'Content-Type':'application/json','Authorization':'Bearer '+t};const u=JSON.parse(localStorage.getItem('matin_user')||'{}');return{'Content-Type':'application/json','x-user-id':String(u.id||'')};}catch{return{'Content-Type':'application/json'};}};
const inp:any={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',color:'white',fontSize:14,outline:'none',width:'100%'};
export default function SettingsPage(){
  const [school,setSchool]=useState<any>({});
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const [tab,setTab]=useState<'general'|'academic'|'notifications'|'security'>('general');
  useEffect(()=>{load();},[]);
  const load=async()=>{try{const r=await fetch('/api/schools/me',{headers:getH(),credentials:'include'});const d=await r.json();setSchool(d||{});}catch{}finally{setLoading(false);}};
  const showToast=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000);};
  const handleSave=async()=>{
    setSaving(true);
    try{const r=await fetch('/api/schools/me',{method:'PATCH',headers:getH(),credentials:'include',body:JSON.stringify(school)});if(r.ok)showToast('تم الحفظ ✓');else showToast('فشل الحفظ');}
    catch{showToast('خطأ');}finally{setSaving(false);}
  };
  const TABS=[{id:'general',l:'عام'},{id:'academic',l:'أكاديمي'},{id:'notifications',l:'الإشعارات'},{id:'security',l:'الأمان'}];
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:'white',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif'}}>
      {toast&&<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold" style={{background:'#16A34A',color:'white'}}>{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">⚙️ إعدادات المؤسسة</h1><p className="text-gray-400 text-sm mt-1">إدارة بيانات وإعدادات المؤسسة</p></div>
        <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{background:G,color:'#000'}}>{saving?'جاري الحفظ...':'حفظ التغييرات'}</button>
      </div>
      <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{background:CARD,border:`1px solid ${BORDER}`,display:'inline-flex'}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id as any)} className="px-4 py-2 rounded-xl text-sm font-bold" style={{background:tab===t.id?G:'transparent',color:tab===t.id?'#000':'#9CA3AF'}}>{t.l}</button>
        ))}
      </div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      :<div className="max-w-2xl">
        {tab==='general'&&(
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-6" style={{background:CARD,border:`1px solid ${BORDER}`}}>
              <h3 className="font-bold text-white mb-4">المعلومات الأساسية</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">اسم المؤسسة</label><input style={inp} value={school.name||''} onChange={e=>setSchool({...school,name:e.target.value})}/></div>
                <div><label className="text-xs text-gray-400 mb-1 block">البريد الإلكتروني</label><input style={inp} type="email" value={school.email||''} onChange={e=>setSchool({...school,email:e.target.value})}/></div>
                <div><label className="text-xs text-gray-400 mb-1 block">رقم الهاتف</label><input style={inp} value={school.phone||''} onChange={e=>setSchool({...school,phone:e.target.value})}/></div>
                <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">العنوان</label><input style={inp} value={school.address||''} onChange={e=>setSchool({...school,address:e.target.value})}/></div>
                <div><label className="text-xs text-gray-400 mb-1 block">المدينة</label><input style={inp} value={school.city||''} onChange={e=>setSchool({...school,city:e.target.value})}/></div>
                <div><label className="text-xs text-gray-400 mb-1 block">الدولة</label><input style={inp} value={school.country||'المملكة العربية السعودية'} onChange={e=>setSchool({...school,country:e.target.value})}/></div>
                <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">الوصف</label><textarea style={{...inp,minHeight:80,resize:'none'}} value={school.description||''} onChange={e=>setSchool({...school,description:e.target.value})}/></div>
              </div>
            </div>
          </div>
        )}
        {tab==='academic'&&(
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-6" style={{background:CARD,border:`1px solid ${BORDER}`}}>
              <h3 className="font-bold text-white mb-4">الإعدادات الأكاديمية</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-400 mb-1 block">نوع المؤسسة</label><select style={inp} value={school.type||''} onChange={e=>setSchool({...school,type:e.target.value})}><option value="">اختر</option><option value="school">مدرسة</option><option value="university">جامعة</option><option value="institute">معهد</option><option value="kindergarten">روضة</option></select></div>
                <div><label className="text-xs text-gray-400 mb-1 block">العام الدراسي</label><input style={inp} value={school.academic_year||''} onChange={e=>setSchool({...school,academic_year:e.target.value})} placeholder="2024-2025"/></div>
                <div><label className="text-xs text-gray-400 mb-1 block">بداية الفصل الدراسي</label><input style={inp} type="date" value={school.semester_start||''} onChange={e=>setSchool({...school,semester_start:e.target.value})}/></div>
                <div><label className="text-xs text-gray-400 mb-1 block">نهاية الفصل الدراسي</label><input style={inp} type="date" value={school.semester_end||''} onChange={e=>setSchool({...school,semester_end:e.target.value})}/></div>
                <div><label className="text-xs text-gray-400 mb-1 block">درجة النجاح</label><input style={inp} type="number" value={school.pass_grade||60} onChange={e=>setSchool({...school,pass_grade:parseInt(e.target.value)})}/></div>
                <div><label className="text-xs text-gray-400 mb-1 block">اللغة الافتراضية</label><select style={inp} value={school.language||'ar'} onChange={e=>setSchool({...school,language:e.target.value})}><option value="ar">العربية</option><option value="en">English</option></select></div>
              </div>
            </div>
          </div>
        )}
        {tab==='notifications'&&(
          <div className="rounded-2xl p-6" style={{background:CARD,border:`1px solid ${BORDER}`}}>
            <h3 className="font-bold text-white mb-4">إعدادات الإشعارات</h3>
            <div className="flex flex-col gap-4">
              {[
                {k:'notify_attendance',l:'إشعارات الحضور والغياب',d:'إرسال إشعار عند تسجيل الغياب'},
                {k:'notify_grades',l:'إشعارات الدرجات',d:'إرسال إشعار عند إضافة درجات جديدة'},
                {k:'notify_homework',l:'إشعارات الواجبات',d:'تذكير بمواعيد تسليم الواجبات'},
                {k:'notify_payments',l:'إشعارات المدفوعات',d:'إشعار عند استحقاق الرسوم'},
                {k:'email_notifications',l:'إشعارات البريد الإلكتروني',d:'إرسال إشعارات عبر البريد'},
                {k:'sms_notifications',l:'إشعارات SMS',d:'إرسال رسائل نصية للأولياء'},
              ].map(n=>(
                <div key={n.k} className="flex items-center justify-between p-4 rounded-xl" style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${BORDER}`}}>
                  <div><div className="text-white font-medium">{n.l}</div><div className="text-gray-500 text-xs mt-0.5">{n.d}</div></div>
                  <button onClick={()=>setSchool({...school,[n.k]:!school[n.k]})} className="w-12 h-6 rounded-full transition-all relative" style={{background:school[n.k]?G:'rgba(255,255,255,0.1)'}}>
                    <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{right:school[n.k]?'2px':'auto',left:school[n.k]?'auto':'2px'}}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==='security'&&(
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-6" style={{background:CARD,border:`1px solid ${BORDER}`}}>
              <h3 className="font-bold text-white mb-4">إعدادات الأمان</h3>
              <div className="flex flex-col gap-4">
                {[
                  {k:'require_2fa',l:'المصادقة الثنائية',d:'إلزامية لجميع المستخدمين'},
                  {k:'allow_parent_login',l:'تسجيل دخول الأولياء',d:'السماح لأولياء الأمور بالدخول'},
                  {k:'allow_student_login',l:'تسجيل دخول الطلاب',d:'السماح للطلاب بالدخول'},
                  {k:'public_profile',l:'الملف الشخصي العام',d:'إظهار المؤسسة في نتائج البحث'},
                ].map(s=>(
                  <div key={s.k} className="flex items-center justify-between p-4 rounded-xl" style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${BORDER}`}}>
                    <div><div className="text-white font-medium">{s.l}</div><div className="text-gray-500 text-xs mt-0.5">{s.d}</div></div>
                    <button onClick={()=>setSchool({...school,[s.k]:!school[s.k]})} className="w-12 h-6 rounded-full transition-all relative" style={{background:school[s.k]?G:'rgba(255,255,255,0.1)'}}>
                      <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{right:school[s.k]?'2px':'auto',left:school[s.k]?'auto':'2px'}}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>}
    </div>
  );
}
