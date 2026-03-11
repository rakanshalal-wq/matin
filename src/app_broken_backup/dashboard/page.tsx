'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
const DARK='#06060E',CARD='rgba(255,255,255,0.04)',BORDER='rgba(255,255,255,0.08)',G='#C9A84C';
const getH=():Record<string,string>=>{try{const t=localStorage.getItem('matin_token');if(t)return{"Content-Type":"application/json","Authorization":"Bearer "+t};const u=JSON.parse(localStorage.getItem('matin_user')||"{}");return{"Content-Type":"application/json","x-user-id":String(u.id||"")};}catch{return{"Content-Type":"application/json"};}};
export default function DashboardPage(){
  const [stats,setStats]=useState<any>({});
  const [user,setUser]=useState<any>({});
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const u=JSON.parse(localStorage.getItem("matin_user")||"{}");setUser(u);
    fetch("/api/dashboard-stats",{headers:getH(),credentials:"include"}).then(r=>r.json()).then(d=>setStats(d)).catch(()=>{}).finally(()=>setLoading(false));
  },[]);
  const cards=[
    {icon:"👥",label:"الطلاب",value:stats.students||stats.my_students||0,color:"#3B82F6",href:"/dashboard/students"},
    {icon:"👨‍🏫",label:"المعلمون",value:stats.teachers||stats.my_teachers||0,color:"#22C55E",href:"/dashboard/teachers"},
    {icon:"📚",label:"الفصول",value:stats.classes||stats.my_classes||0,color:G,href:"/dashboard/classes"},
    {icon:"📝",label:"الاختبارات",value:stats.active_exams||stats.exams||0,color:"#8B5CF6",href:"/dashboard/exams"},
    {icon:"✅",label:"الحضور اليوم",value:stats.attendance_today||0,color:"#14B8A6",href:"/dashboard/attendance"},
    {icon:"📢",label:"الإعلانات",value:stats.announcements||0,color:"#F59E0B",href:"/dashboard/announcements"},
  ];
  const quickLinks=[
    {icon:"📋",label:"الواجبات",href:"/dashboard/homework"},
    {icon:"🏆",label:"الدرجات",href:"/dashboard/grades"},
    {icon:"📅",label:"الجداول",href:"/dashboard/schedules"},
    {icon:"💰",label:"الرواتب",href:"/dashboard/payroll"},
    {icon:"🛍️",label:"المتجر",href:"/dashboard/store"},
    {icon:"👨‍👩‍👧",label:"أولياء الأمور",href:"/dashboard/parents"},
    {icon:"🎫",label:"الدعم",href:"/dashboard/support"},
    {icon:"⚙️",label:"الإعدادات",href:"/dashboard/settings"},
  ];
  const greeting=()=>{const h=new Date().getHours();if(h<12)return"صباح الخير";if(h<17)return"مساء الخير";return"مساء النور";};
  return(
    <div className="min-h-screen p-6" style={{background:DARK,color:"white",direction:"rtl",fontFamily:"IBM Plex Sans Arabic, sans-serif"}}>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">{greeting()}، {user.name||"مرحباً"} 👋</h1>
        <p className="text-gray-400 mt-1">نظرة عامة على {user.school_name||"المؤسسة"}</p>
      </div>
      {loading?<div className="text-center py-20 text-gray-500">جاري التحميل...</div>:(
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {cards.map((c,i)=>(
              <Link key={i} href={c.href} className="rounded-2xl p-6 block transition-all hover:scale-105" style={{background:CARD,border:`1px solid ${BORDER}`}}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{background:`${c.color}22`}}>{c.icon}</div>
                  <div className="text-gray-400 text-sm">{c.label}</div>
                </div>
                <div className="text-4xl font-black" style={{color:c.color}}>{Number(c.value).toLocaleString("ar-SA")}</div>
              </Link>
            ))}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-4">روابط سريعة</h2>
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
              {quickLinks.map((l,i)=>(
                <Link key={i} href={l.href} className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all hover:scale-105" style={{background:CARD,border:`1px solid ${BORDER}`}}>
                  <span className="text-2xl">{l.icon}</span>
                  <span className="text-xs text-gray-400">{l.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
