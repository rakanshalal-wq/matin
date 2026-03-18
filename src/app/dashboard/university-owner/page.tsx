'use client';
import IconRenderer from "@/components/IconRenderer";
import { Check, CheckCircle, ClipboardList, XCircle } from "lucide-react";
import { useEffect, useState } from 'react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════════
   مساعدات
<IconRenderer name="ICON_Star" size={18} /> */
const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) };
};

/* ═══════════════════════════════════════════════════════════
   مكوّن: بطاقة إحصاء
<IconRenderer name="ICON_Star" size={18} /> */
const StatCard = ({ title, value, color, sub, link }: any) => (
  <Link href={link || '#'} style={{ textDecoration: 'none' }}>
    <div
      style={{
        background: 'linear-gradient(135deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.01) 100%)',
        border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px',
        cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 32px ${color}18`; el.style.borderColor = `${color}50`; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = `${color}25`; }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `${color}08`, borderRadius: '0 14px 0 80px' }} />
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8, fontWeight: 500 }}>{title}</div>
      <div style={{ color: '#fff', fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color, fontSize: 11, marginTop: 6, fontWeight: 600 }}>{sub}</div>}
    </div>
  </Link>
);

/* ═══════════════════════════════════════════════════════════
   مكوّن: بطاقة قسم
<IconRenderer name="ICON_Star" size={18} /> */
const SectionCard = ({ label, href, color, count }: any) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <div
      style={{ background: `${color}0D`, border: `1px solid ${color}20`, borderRadius: 10, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}1A`; el.style.transform = 'translateY(-2px)'; el.style.borderColor = `${color}40`; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}0D`; el.style.transform = 'translateY(0)'; el.style.borderColor = `${color}20`; }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, margin: '0 auto 8px' }} />
      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600 }}>{label}</div>
      {count != null && <div style={{ color, fontSize: 16, fontWeight: 800, marginTop: 4 }}>{count}</div>}
    </div>
  </Link>
);

/* ═══════════════════════════════════════════════════════════
   الصفحة الرئيسية
<IconRenderer name="ICON_Star" size={18} /> */
export default function UniversityOwnerDashboard() {
  const [user, setUser]                     = useState<any>(null);
  const [school, setSchool]                 = useState<any>(null);
  const [stats, setStats]                   = useState<any>({});
  const [upcomingExams, setUpcomingExams]   = useState<any[]>([]);
  const [pendingAdmissions, setPendingAdmissions] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);
  const [time, setTime]                     = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const token = localStorage.getItem('matin_token');
    if (token) {
      fetch('/api/auth/verify', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(r => r.json())
        .then(d => {
          if (d.valid) { setUser(d.user); localStorage.setItem('matin_user', JSON.stringify(d.user)); loadAll(); }
          else window.location.href = '/login';
        }).catch(() => setLoading(false));
    } else {
      const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
      if (u?.id) { setUser(u); loadAll(); } else window.location.href = '/login';
    }
  }, []);

  const handleApproveAdmission = async (id: number) => {
    setSaving(true); setErrMsg('');
    try {
      const res = await fetch(`/api/admission?id=${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status: 'approved' }) });
      const data = await res.json();
      if (res.ok) loadAll();
      else setErrMsg(data.error || 'فشل القبول');
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };
  const handleRejectAdmission = async (id: number) => {
    setSaving(true); setErrMsg('');
    try {
      const res = await fetch(`/api/admission?id=${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status: 'rejected' }) });
      const data = await res.json();
      if (res.ok) loadAll();
      else setErrMsg(data.error || 'فشل الرفض');
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };
  const loadAll = async () => {
    try {
      const h = getHeaders();
      const [statsRes, schoolsRes, examsRes, admissionsRes, activityRes] = await Promise.all([
        fetch('/api/dashboard-stats',          { headers: h }),
        fetch('/api/schools',                  { headers: h }),
        fetch('/api/exams?limit=5',            { headers: h }),
        fetch('/api/admission?status=pending', { headers: h }),
        fetch('/api/activity-log?limit=8',     { headers: h }),
      ]);
      const [statsData, schoolsData, examsData, admissionsData, activityData] = await Promise.all([
        statsRes.json(), schoolsRes.json(), examsRes.json(), admissionsRes.json(), activityRes.json(),
      ]);
      setStats(statsData || {});
      const arr = Array.isArray(schoolsData) ? schoolsData : [];
      if (arr.length > 0) setSchool(arr[0]);
      setUpcomingExams(Array.isArray(examsData) ? examsData.slice(0, 5) : []);
      setPendingAdmissions(Array.isArray(admissionsData) ? admissionsData.slice(0, 5) : []);
      setRecentActivity(Array.isArray(activityData) ? activityData.slice(0, 8) : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const greeting = () => { const h = time.getHours(); return h < 12 ? 'صباح الخير' : h < 17 ? 'مساء الخير' : 'مساء النور'; };
  const DAYS   = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const ACCENT = '#8B5CF6';

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, borderRadius:'50%', border:'3px solid rgba(139,92,246,0.15)', borderTopColor:ACCENT, animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>جاري التحميل...</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding:'24px', maxWidth:1400, margin:'0 auto', fontFamily:'IBM Plex Sans Arabic,sans-serif' }}>

      {/* <IconRenderer name="ICON_Star" size={18} /> بطاقة الترحيب <IconRenderer name="ICON_Star" size={18} /> */}
      <div style={{ background:`linear-gradient(135deg,rgba(139,92,246,0.08) 0%,rgba(201,168,76,0.05) 50%,rgba(16,16,38,0.8) 100%)`, border:`1px solid ${ACCENT}20`, borderRadius:18, padding:'28px 32px', marginBottom:24, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, left:-40, width:200, height:200, background:`${ACCENT}04`, borderRadius:'50%' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            {school?.logo_url || school?.logo
              ? <img src={school.logo_url||school.logo} alt="" style={{ width:64, height:64, borderRadius:14, objectFit:'cover', border:`2px solid ${ACCENT}25` }} />
              : <div style={{ width:64, height:64, borderRadius:14, background:`${ACCENT}10`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:ACCENT, border:`2px solid ${ACCENT}20` }}>{school?.name_ar?.charAt(0)||school?.name?.charAt(0)||'ج'}</div>
            }
            <div>
              <div style={{ color:`${ACCENT}CC`, fontSize:12, fontWeight:600, marginBottom:4 }}>{greeting()}، {user?.name?.split(' ')[0]||'مرحباً'}</div>
              <div style={{ color:'#fff', fontSize:22, fontWeight:800 }}>{school?.name_ar||school?.name||'جامعتك'}</div>
              <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
                <span style={{ background:`${ACCENT}15`, color:ACCENT, fontSize:11, padding:'3px 10px', borderRadius:6, fontWeight:600, border:`1px solid ${ACCENT}25` }}>جامعة</span>
                {school?.subscription_status==='active'
                  ? <span style={{ background:'rgba(16,185,129,0.1)', color:'#10B981', fontSize:11, padding:'3px 10px', borderRadius:6, fontWeight:600, border:'1px solid rgba(16,185,129,0.2)' }}>اشتراك نشط</span>
                  : <span style={{ background:'rgba(239,68,68,0.1)', color:'#EF4444', fontSize:11, padding:'3px 10px', borderRadius:6, fontWeight:600, border:'1px solid rgba(239,68,68,0.2)' }}>اشتراك منتهي</span>
                }
              </div>
            </div>
          </div>
          <div style={{ textAlign:'left' }}>
            <div style={{ color:'#fff', fontSize:28, fontWeight:800, letterSpacing:-1 }}>{time.toLocaleTimeString('ar-SA',{hour:'2-digit',minute:'2-digit'})}</div>
            <div style={{ color:'rgba(255,255,255,0.35)', fontSize:12, marginTop:4 }}>{DAYS[time.getDay()]}، {time.getDate()} {MONTHS[time.getMonth()]} {time.getFullYear()}</div>
          </div>
        </div>
      </div>

      {/* <IconRenderer name="ICON_Star" size={18} /> بطاقات الإحصاء <IconRenderer name="ICON_Star" size={18} /> */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:16, marginBottom:24 }}>
        <StatCard title="إجمالي الطلاب"        value={stats.students??'—'}                                color={ACCENT}      link="/dashboard/students" />
        <StatCard title="أعضاء هيئة التدريس"   value={stats.teachers??'—'}                                color="#3B82F6"     link="/dashboard/teachers" />
        <StatCard title="الكليات"               value={stats.my_classes??stats.classes??'—'}               color="#10B981"     link="/dashboard/colleges" />
        <StatCard title="الاختبارات النشطة"     value={stats.active_exams??stats.exams??'—'}               color="#EF4444"     link="/dashboard/exams" />
        <StatCard title="طلبات القبول المعلقة"  value={pendingAdmissions.length||'—'}                      color="#F59E0B"     link="/dashboard/admission" />
        <StatCard title="الإيرادات هذا الشهر"  value={stats.revenue?`${stats.revenue} ر.س`:'—'}           color="#C9A84C"     link="/dashboard/finance" />
      </div>

      {/* <IconRenderer name="ICON_Star" size={18} /> الأقسام الرئيسية <IconRenderer name="ICON_Star" size={18} /> */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>

        {/* الأقسام الأكاديمية */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ color:'rgba(201,168,76,0.6)', fontSize:10, fontWeight:800, marginBottom:16, textTransform:'uppercase', letterSpacing:2 }}>الأقسام الأكاديمية</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { label:'الطلاب',           href:'/dashboard/students',      color:'#8B5CF6', count:stats.students },
              { label:'هيئة التدريس',     href:'/dashboard/teachers',      color:'#3B82F6', count:stats.teachers },
              { label:'الكليات',          href:'/dashboard/colleges',      color:'#10B981', count:null },
              { label:'الاختبارات',       href:'/dashboard/exams',         color:'#EF4444', count:stats.active_exams },
              { label:'الحضور',           href:'/dashboard/attendance',    color:'#06B6D4', count:null },
              { label:'الدرجات',          href:'/dashboard/grades',        color:'#A78BFA', count:null },
              { label:'الجداول',          href:'/dashboard/schedules',     color:'#F59E0B', count:null },
              { label:'الساعات المعتمدة', href:'/dashboard/credit-hours',  color:'#34D399', count:null },
              { label:'المنح الدراسية',   href:'/dashboard/scholarships',  color:'#F472B6', count:null },
            ].map((item,i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>

        {/* الإدارة والموارد البشرية */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ color:'rgba(201,168,76,0.6)', fontSize:10, fontWeight:800, marginBottom:16, textTransform:'uppercase', letterSpacing:2 }}>الإدارة والموارد البشرية</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { label:'الموظفون',    href:'/dashboard/employees',  color:'#84CC16', count:null },
              { label:'الرواتب',     href:'/dashboard/salaries',   color:'#22D3EE', count:null },
              { label:'الإجازات',    href:'/dashboard/leaves',     color:'#FB923C', count:null },
              { label:'المالية',     href:'/dashboard/finance',    color:'#C9A84C', count:null },
              { label:'الصحة',       href:'/dashboard/health',     color:'#34D399', count:null },
              { label:'الكافتيريا',  href:'/dashboard/cafeteria',  color:'#FBBF24', count:null },
              { label:'المكتبة',     href:'/dashboard/library',    color:'#A855F7', count:null },
              { label:'الإعدادات',   href:'/dashboard/settings',   color:'#94A3B8', count:null },
              { label:'التقارير',    href:'/dashboard/reports',    color:'#F97316', count:null },
            ].map((item,i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>
      </div>

      {/* <IconRenderer name="ICON_Star" size={18} /> الخدمات الجامعية المتخصصة <IconRenderer name="ICON_Star" size={18} /> */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>

        {/* الخدمات الأكاديمية */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ color:'rgba(201,168,76,0.6)', fontSize:10, fontWeight:800, marginBottom:16, textTransform:'uppercase', letterSpacing:2 }}>الخدمات الأكاديمية</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { label:'القبول',        href:'/dashboard/admission',      color:'#F59E0B' },
              { label:'المواد',        href:'/dashboard/subjects',       color:'#6366F1' },
              { label:'المناهج',       href:'/dashboard/curriculum',     color:'#14B8A6' },
              { label:'الفصول',        href:'/dashboard/classes',        color:'#10B981' },
              { label:'الإرشاد',       href:'/dashboard/counseling',     color:'#EC4899' },
              { label:'الموهوبون',     href:'/dashboard/gifted',         color:'#F59E0B' },
              { label:'ذوو الاحتياجات',href:'/dashboard/special-needs', color:'#06B6D4' },
              { label:'الاستبيانات',   href:'/dashboard/surveys',        color:'#A78BFA' },
              { label:'الشهادات',      href:'/dashboard/certificates',   color:'#34D399' },
            ].map((item,i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>

        {/* الخدمات الإدارية */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ color:'rgba(201,168,76,0.6)', fontSize:10, fontWeight:800, marginBottom:16, textTransform:'uppercase', letterSpacing:2 }}>الخدمات الإدارية</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { label:'الإعلانات',     href:'/dashboard/announcements',  color:'#F97316' },
              { label:'المهام',        href:'/dashboard/tasks',          color:'#3B82F6' },
              { label:'الاجتماعات',    href:'/dashboard/meetings',       color:'#8B5CF6' },
              { label:'الشكاوى',       href:'/dashboard/complaints',     color:'#EF4444' },
              { label:'الزوار',        href:'/dashboard/visitors',       color:'#06B6D4' },
              { label:'الأمن',         href:'/dashboard/security',       color:'#F43F5E' },
              { label:'الطوارئ',       href:'/dashboard/emergencies',    color:'#EF4444' },
              { label:'النسخ الاحتياطي',href:'/dashboard/backup',        color:'#94A3B8' },
              { label:'المجتمع',       href:'/dashboard/community',      color:'#34D399' },
            ].map((item,i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>
      </div>

      {/* <IconRenderer name="ICON_Star" size={18} /> التعليم الإلكتروني والذكاء الاصطناعي <IconRenderer name="ICON_Star" size={18} /> */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ color:'rgba(201,168,76,0.6)', fontSize:10, fontWeight:800, marginBottom:16, textTransform:'uppercase', letterSpacing:2 }}>التعليم الإلكتروني</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { label:'المحاضرات',     href:'/dashboard/lectures',       color:'#6366F1' },
              { label:'البث المباشر',  href:'/dashboard/live-stream',    color:'#EF4444' },
              { label:'بنك الأسئلة',   href:'/dashboard/question-bank',  color:'#14B8A6' },
              { label:'المكتبة',       href:'/dashboard/library',        color:'#A855F7' },
              { label:'الواجبات',      href:'/dashboard/homework',       color:'#EC4899' },
              { label:'التسجيلات',     href:'/dashboard/recordings',     color:'#0EA5E9' },
            ].map((item,i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ color:'rgba(201,168,76,0.6)', fontSize:10, fontWeight:800, marginBottom:16, textTransform:'uppercase', letterSpacing:2 }}>الذكاء الاصطناعي والتواصل</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { label:'المساعد الذكي',  href:'/dashboard/ai-chat',            color:'#A78BFA' },
              { label:'توليد الأسئلة',  href:'/dashboard/question-bank',      color:'#F472B6' },
              { label:'التحليلات',      href:'/dashboard/reports',            color:'#60A5FA' },
              { label:'الرسائل',        href:'/dashboard/messages',           color:'#34D399' },
              { label:'الإشعارات',      href:'/dashboard/push-notifications', color:'#FB923C' },
              { label:'المتجر',         href:'/dashboard/store',              color:'#E879F9' },
            ].map((item,i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>
      </div>

      {/* <IconRenderer name="ICON_Star" size={18} /> الاختبارات القادمة + طلبات القبول + النشاط الأخير <IconRenderer name="ICON_Star" size={18} /> */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20, marginBottom:24 }}>

        {/* الاختبارات القادمة */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ color:'rgba(201,168,76,0.6)', fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:2 }}>الاختبارات القادمة</div>
            <Link href="/dashboard/exams" style={{ color:'#C9A84C', fontSize:11, textDecoration:'none', fontWeight:600 }}>عرض الكل</Link>
          </div>
          {upcomingExams.length===0
            ? <div style={{ color:'rgba(255,255,255,0.2)', fontSize:13, textAlign:'center', padding:'20px 0' }}>لا توجد اختبارات قادمة</div>
            : upcomingExams.map((exam:any,i:number) => (
              <div key={i} style={{ background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.1)', borderRadius:8, padding:'10px 14px', marginBottom:8 }}>
                <div style={{ color:'#fff', fontSize:13, fontWeight:600 }}>{exam.title||exam.name}</div>
                <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:4 }}>{exam.class_name||exam.subject} — {exam.date?new Date(exam.date).toLocaleDateString('ar-SA'):''}</div>
              </div>
            ))
          }
        </div>

        {/* طلبات القبول */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ color:'rgba(201,168,76,0.6)', fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:2 }}>طلبات القبول</div>
            <Link href="/dashboard/admission" style={{ color:'#C9A84C', fontSize:11, textDecoration:'none', fontWeight:600 }}>عرض الكل</Link>
          </div>
          {pendingAdmissions.length===0
            ? <div style={{ color:'rgba(255,255,255,0.2)', fontSize:13, textAlign:'center', padding:'20px 0' }}>لا توجد طلبات معلقة</div>
            : pendingAdmissions.map((req:any,i:number) => (
              <div key={i} style={{ background:'rgba(245,158,11,0.05)', border:'1px solid rgba(245,158,11,0.1)', borderRadius:8, padding:'10px 14px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ color:'#fff', fontSize:13, fontWeight:600 }}>{req.student_name||req.name}</div>
                  <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:2 }}>{req.grade||req.level}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleApproveAdmission(req.id)} disabled={saving} style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(16,185,129,0.2)', cursor: 'pointer', fontWeight: 600 }}>قبول</button>
                  <button onClick={() => handleRejectAdmission(req.id)} disabled={saving} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontWeight: 600 }}>رفض</button>
                </div>
              </div>
            ))
          }
        </div>

        {/* النشاط الأخير */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ color:'rgba(201,168,76,0.6)', fontSize:10, fontWeight:800, marginBottom:16, textTransform:'uppercase', letterSpacing:2 }}>النشاط الأخير</div>
          {recentActivity.length===0
            ? <div style={{ color:'rgba(255,255,255,0.2)', fontSize:13, textAlign:'center', padding:'20px 0' }}>لا يوجد نشاط حديث</div>
            : recentActivity.map((act:any,i:number) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:ACCENT, marginTop:5, flexShrink:0 }} />
                <div>
                  <div style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>{act.description||act.title||act.action}</div>
                  <div style={{ color:'rgba(255,255,255,0.25)', fontSize:11, marginTop:2 }}>{act.created_at?new Date(act.created_at).toLocaleString('ar-SA'):''}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* <IconRenderer name="ICON_Star" size={18} /> رابط الجامعة العامة <IconRenderer name="ICON_Star" size={18} /> */}
      {school?.code && (
        <div style={{ background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:14, padding:'20px 24px' }}>
          <div style={{ color:'rgba(201,168,76,0.6)', fontSize:10, fontWeight:800, marginBottom:16, textTransform:'uppercase', letterSpacing:2 }}>صفحة الجامعة العامة</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <div style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, padding:'6px 14px', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:12 }}>matin.ink/school/</span>
                <span style={{ color:'#C9A84C', fontSize:12, fontWeight:700 }}>{school.code}</span>
                <button onClick={() => navigator.clipboard.writeText(`https://matin.ink/school/${school.code}`)} style={{ background:'none', border:'none', cursor:'pointer', color:'#C9A84C', fontSize:12, fontWeight:700 }}>نسخ</button>
              </div>
              {school.custom_domain && (
                <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:8, padding:'6px 14px', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:'#10B981', fontSize:12 }}>{school.custom_domain}</span>
                  {school.domain_verified && <span style={{ color:'#10B981', fontSize:11, fontWeight:700 }}>[Check] متحقق</span>}
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <a href={`https://matin.ink/school/${school.code}`} target="_blank" rel="noreferrer" style={{ background:'rgba(201,168,76,0.1)', color:'#C9A84C', fontSize:12, padding:'8px 16px', borderRadius:8, textDecoration:'none', fontWeight:600, border:'1px solid rgba(201,168,76,0.25)' }}>معاينة الصفحة</a>
              <Link href="/dashboard/school-page" style={{ background:`${ACCENT}15`, color:ACCENT, fontSize:12, padding:'8px 16px', borderRadius:8, textDecoration:'none', fontWeight:600, border:`1px solid ${ACCENT}25` }}>تعديل الصفحة</Link>
              <Link href="/dashboard/settings" style={{ background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.4)', fontSize:12, padding:'8px 16px', borderRadius:8, textDecoration:'none', fontWeight:600, border:'1px solid rgba(255,255,255,0.08)' }}>ربط دومين</Link>
            </div>
          </div>
        </div>
      )}

      {showModal && selectedReq && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0F0F1A', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440, direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: '#C9A84C', fontSize: 18, fontWeight: 700, margin: 0 }}><IconRenderer name="ICON_ClipboardList" size={18} /> مراجعة طلب الانضمام</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            {errMsg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 13 }}>{errMsg}</div>}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{selectedReq.student_name || selectedReq.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>المستوى: {selectedReq.grade || selectedReq.level || 'غير محدد'}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={async () => { await handleApproveAdmission(selectedReq.id); setShowModal(false); }} disabled={saving} style={{ flex: 1, background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '12px 0', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14 }}>{saving ? 'جاري...' : 'CheckCircle قبول'}</button>
              <button onClick={async () => { await handleRejectAdmission(selectedReq.id); setShowModal(false); }} disabled={saving} style={{ flex: 1, background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 0', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14 }}>{saving ? 'جاري...' : 'XCircle رفض'}</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13 }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
