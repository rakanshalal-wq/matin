'use client';
import IconRenderer from "@/components/IconRenderer";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ─── Design: Dark #06060E + Gold #C9A84C — متين v5 ─── */
const G = '#C9A84C';
const DARK = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';

const getHeaders = (): Record<string, string> => {
 try {
 const token = localStorage.getItem('matin_token');
 if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
 } catch { return { 'Content-Type': 'application/json' }; }
};

const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
 <path d={d} />
 </svg>
);

const ICONS = {
 students: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
 teachers: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
 classes: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
 exams: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
 attendance:'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
 close: 'M18 6L6 18 M6 6l12 12',
 edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
 trash: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
 plus: 'M12 5v14 M5 12h14',
 reports: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8',
 notif: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
 settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
};

const GRADE_OPTIONS = [
 'الأول الابتدائي','الثاني الابتدائي','الثالث الابتدائي',
 'الرابع الابتدائي','الخامس الابتدائي','السادس الابتدائي',
 'الأول المتوسط','الثاني المتوسط','الثالث المتوسط',
 'الأول الثانوي','الثاني الثانوي','الثالث الثانوي',
];

/* ─── Reusable Modal ─── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
 return (
 <div style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20 }} onClick={onClose}>
 <div style={{ background:'#0F0F1A',border:`1px solid ${BORDER}`,borderRadius:20,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.6)' }} onClick={e=>e.stopPropagation()}>
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 24px',borderBottom:`1px solid ${BORDER}` }}>
 <h3 style={{ color:'#EEEEF5',fontSize:17,fontWeight:700,margin:0 }}>{title}</h3>
 <button onClick={onClose} style={{ background:'rgba(255,255,255,0.05)',border:'none',borderRadius:8,padding:8,cursor:'pointer',color:'rgba(238,238,245,0.6)',display:'flex' }}>
 <Icon d={ICONS.close} size={16}/>
 </button>
 </div>
 <div style={{ padding:24 }}>{children}</div>
 </div>
 </div>
 );
}

/* ─── Field ─── */
function Field({ label, value, onChange, type='text', required=false, placeholder='', options }: {
 label:string; value:string; onChange:(v:string)=>void;
 type?:string; required?:boolean; placeholder?:string;
 options?:string[];
}) {
 const base:React.CSSProperties = { width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:`1px solid ${BORDER}`,borderRadius:10,color:'#EEEEF5',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit' };
 return (
 <div style={{ marginBottom:16 }}>
 <label style={{ display:'block',color:'rgba(238,238,245,0.7)',fontSize:13,fontWeight:600,marginBottom:6 }}>
 {label} {required && <span style={{ color:'#EF4444' }}>*</span>}
 </label>
 {options ? (
 <select value={value} onChange={e=>onChange(e.target.value)} style={base}>
 <option value="">اختر...</option>
 {options.map(o=><option key={o} value={o}>{o}</option>)}
 </select>
 ) : (
 <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base}/>
 )}
 </div>
 );
}

/* ─── Error Box ─── */
const ErrBox = ({ msg }: { msg: string }) => msg ? (
 <div style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 14px',color:'#EF4444',fontSize:13,marginBottom:12 }}>{msg}</div>
) : null;

/* ─── Submit Button ─── */
const SubmitBtn = ({ loading, label, loadingLabel }: { loading:boolean; label:string; loadingLabel:string }) => (
 <button disabled={loading} style={{ width:'100%',padding:'11px',background:loading?'rgba(201,168,76,0.4)':`linear-gradient(135deg,${G},#E2C46A)`,color:'#000',border:'none',borderRadius:10,cursor:loading?'not-allowed':'pointer',fontSize:15,fontWeight:700,marginTop:8 }}>
 {loading ? loadingLabel : label}
 </button>
);

/* ─── Confirm Delete ─── */
function ConfirmDelete({ name, onConfirm, onCancel, loading }: { name:string; onConfirm:()=>void; onCancel:()=>void; loading:boolean }) {
 return (
 <Modal title="تأكيد الحذف" onClose={onCancel}>
 <p style={{ color:'rgba(238,238,245,0.7)',fontSize:14,marginBottom:24 }}>
 هل أنت متأكد من حذف <strong style={{ color:'#EEEEF5' }}>{name}</strong>؟ لا يمكن التراجع.
 </p>
 <div style={{ display:'flex',gap:12,justifyContent:'flex-end' }}>
 <button onClick={onCancel} style={{ padding:'9px 20px',background:'rgba(255,255,255,0.05)',border:`1px solid ${BORDER}`,borderRadius:10,color:'rgba(238,238,245,0.7)',cursor:'pointer',fontSize:14 }}>إلغاء</button>
 <button onClick={onConfirm} disabled={loading} style={{ padding:'9px 20px',background:loading?'rgba(239,68,68,0.4)':'#EF4444',border:'none',borderRadius:10,color:'#fff',cursor:loading?'not-allowed':'pointer',fontSize:14,fontWeight:700 }}>
 {loading?'جارٍ الحذف...':'حذف'}
 </button>
 </div>
 </Modal>
 );
}

/* ─── Main Page ─── */
export default function AdminDashboard() {
 const router = useRouter();
 const [user, setUser] = useState<any>(null);
 const [stats, setStats] = useState<any>({});
 const [students, setStudents] = useState<any[]>([]);
 const [teachers, setTeachers] = useState<any[]>([]);
 const [classes, setClasses] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<'overview'|'students'|'teachers'|'classes'>('overview');

 // Student state
 const [showStudentModal, setShowStudentModal] = useState(false);
 const [editingStudent, setEditingStudent] = useState<any>(null);
 const [deleteStudent, setDeleteStudent] = useState<any>(null);
 const [sForm, setSForm] = useState({ full_name:'', email:'', phone:'', gender:'male', grade_level:'', national_id:'' });
 const [sErr, setSErr] = useState('');
 const [sLoading, setSLoading] = useState(false);

 // Teacher state
 const [showTeacherModal, setShowTeacherModal] = useState(false);
 const [editingTeacher, setEditingTeacher] = useState<any>(null);
 const [deleteTeacher, setDeleteTeacher] = useState<any>(null);
 const [tForm, setTForm] = useState({ full_name:'', email:'', phone:'', specialization:'', national_id:'' });
 const [tErr, setTErr] = useState('');
 const [tLoading, setTLoading] = useState(false);

 // Class state
 const [showClassModal, setShowClassModal] = useState(false);
 const [editingClass, setEditingClass] = useState<any>(null);
 const [deleteClass, setDeleteClass] = useState<any>(null);
 const [cForm, setCForm] = useState({ name:'', grade_level:'', capacity:'30', section:'' });
 const [cErr, setCErr] = useState('');
 const [cLoading, setCLoading] = useState(false);

 useEffect(() => {
 const u = localStorage.getItem('matin_user');
 if (!u) { router.push('/login'); return; }
 const parsed = JSON.parse(u);
 if (!['admin','owner','school_owner','university_owner','institute_owner','kindergarten_owner','training_owner'].includes(parsed.role)) {
 router.push('/login'); return;
 }
 setUser(parsed);
 loadAll();
 }, []);

 const loadAll = async () => {
 setLoading(true);
 try {
 const [r1,r2,r3,r4] = await Promise.all([
 fetch('/api/dashboard-stats', { headers: getHeaders() }),
 fetch('/api/students', { headers: getHeaders() }),
 fetch('/api/teachers', { headers: getHeaders() }),
 fetch('/api/classes', { headers: getHeaders() }),
 ]);
 const [d1,d2,d3,d4] = await Promise.all([r1.json(),r2.json(),r3.json(),r4.json()]);
 setStats(d1 || {});
 setStudents(Array.isArray(d2) ? d2 : []);
 setTeachers(Array.isArray(d3) ? d3 : []);
 setClasses(Array.isArray(d4) ? d4 : []);
 } catch(e) { console.error('loadAll error:', e); }
 finally { setLoading(false); }
 };

 /* ── Student CRUD ── */
 const openAddStudent = () => { setEditingStudent(null); setSForm({ full_name:'',email:'',phone:'',gender:'male',grade_level:'',national_id:'' }); setSErr(''); setShowStudentModal(true); };
 const openEditStudent = (s:any) => { setEditingStudent(s); setSForm({ full_name:s.full_name||s.name||'',email:s.email||'',phone:s.phone||'',gender:s.gender||'male',grade_level:s.grade_level||'',national_id:s.national_id||'' }); setSErr(''); setShowStudentModal(true); };
 const submitStudent = async () => {
 if (!sForm.full_name.trim()) { setSErr('الاسم الكامل مطلوب'); return; }
 if (!sForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sForm.email)) { setSErr('البريد الإلكتروني غير صحيح'); return; }
 setSLoading(true); setSErr('');
 try {
 const method = editingStudent ? 'PUT' : 'POST';
 const body = editingStudent ? { ...sForm, id: editingStudent.id } : sForm;
 const res = await fetch('/api/students', { method, headers: getHeaders(), body: JSON.stringify(body) });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'حدث خطأ');
 setShowStudentModal(false);
 await loadAll();
 } catch(e:any) { setSErr(e.message || 'حدث خطأ غير متوقع'); }
 finally { setSLoading(false); }
 };
 const confirmDeleteStudent = async () => {
 if (!deleteStudent) return;
 setSLoading(true);
 try {
 const res = await fetch('/api/students', { method:'DELETE', headers:getHeaders(), body:JSON.stringify({ id:deleteStudent.id }) });
 if (!res.ok) { const d = await res.json(); throw new Error(d.error||'فشل الحذف'); }
 setDeleteStudent(null); await loadAll();
 } catch(e:any) { alert(e.message); }
 finally { setSLoading(false); }
 };

 /* ── Teacher CRUD ── */
 const openAddTeacher = () => { setEditingTeacher(null); setTForm({ full_name:'',email:'',phone:'',specialization:'',national_id:'' }); setTErr(''); setShowTeacherModal(true); };
 const openEditTeacher = (t:any) => { setEditingTeacher(t); setTForm({ full_name:t.full_name||t.name||'',email:t.email||'',phone:t.phone||'',specialization:t.specialization||'',national_id:t.national_id||'' }); setTErr(''); setShowTeacherModal(true); };
 const submitTeacher = async () => {
 if (!tForm.full_name.trim()) { setTErr('الاسم الكامل مطلوب'); return; }
 if (!tForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tForm.email)) { setTErr('البريد الإلكتروني غير صحيح'); return; }
 setTLoading(true); setTErr('');
 try {
 const method = editingTeacher ? 'PUT' : 'POST';
 const body = editingTeacher ? { ...tForm, id: editingTeacher.id } : tForm;
 const res = await fetch('/api/teachers', { method, headers: getHeaders(), body: JSON.stringify(body) });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'حدث خطأ');
 setShowTeacherModal(false);
 await loadAll();
 } catch(e:any) { setTErr(e.message || 'حدث خطأ غير متوقع'); }
 finally { setTLoading(false); }
 };
 const confirmDeleteTeacher = async () => {
 if (!deleteTeacher) return;
 setTLoading(true);
 try {
 const res = await fetch('/api/teachers', { method:'DELETE', headers:getHeaders(), body:JSON.stringify({ id:deleteTeacher.id }) });
 if (!res.ok) { const d = await res.json(); throw new Error(d.error||'فشل الحذف'); }
 setDeleteTeacher(null); await loadAll();
 } catch(e:any) { alert(e.message); }
 finally { setTLoading(false); }
 };

 /* ── Class CRUD ── */
 const openAddClass = () => { setEditingClass(null); setCForm({ name:'',grade_level:'',capacity:'30',section:'' }); setCErr(''); setShowClassModal(true); };
 const openEditClass = (c:any) => { setEditingClass(c); setCForm({ name:c.name||c.class_name||'',grade_level:c.grade_level||c.level||'',capacity:String(c.capacity||c.max_students||30),section:c.section||'' }); setCErr(''); setShowClassModal(true); };
 const submitClass = async () => {
 if (!cForm.name.trim()) { setCErr('اسم الفصل مطلوب'); return; }
 if (!cForm.grade_level) { setCErr('المرحلة الدراسية مطلوبة'); return; }
 setCLoading(true); setCErr('');
 try {
 const method = editingClass ? 'PUT' : 'POST';
 const body = editingClass ? { ...cForm, id:editingClass.id, capacity:Number(cForm.capacity)||30 } : { ...cForm, capacity:Number(cForm.capacity)||30 };
 const res = await fetch('/api/classes', { method, headers: getHeaders(), body: JSON.stringify(body) });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'حدث خطأ');
 setShowClassModal(false);
 await loadAll();
 } catch(e:any) { setCErr(e.message || 'حدث خطأ غير متوقع'); }
 finally { setCLoading(false); }
 };
 const confirmDeleteClass = async () => {
 if (!deleteClass) return;
 setCLoading(true);
 try {
 const res = await fetch('/api/classes', { method:'DELETE', headers:getHeaders(), body:JSON.stringify({ id:deleteClass.id }) });
 if (!res.ok) { const d = await res.json(); throw new Error(d.error||'فشل الحذف'); }
 setDeleteClass(null); await loadAll();
 } catch(e:any) { alert(e.message); }
 finally { setCLoading(false); }
 };

 /* ── Helpers ── */
 const btn = (color:string):React.CSSProperties => ({ padding:'8px 18px',background:`linear-gradient(135deg,${color},${color}CC)`,color:'#fff',border:'none',borderRadius:9,cursor:'pointer',fontSize:13,fontWeight:700,display:'flex',alignItems:'center',gap:6 });
 const iconBtn = (r:number,g:number,b:number):React.CSSProperties => ({ background:`rgba(${r},${g},${b},0.1)`,border:'none',borderRadius:7,padding:'6px 8px',cursor:'pointer',display:'flex',alignItems:'center',color:`rgb(${r},${g},${b})` });

 if (!user || loading) return (
 <div style={{ minHeight:'100vh',background:DARK,display:'flex',alignItems:'center',justifyContent:'center' }}>
 <div style={{ color:G,fontSize:16 }}>جارٍ التحميل...</div>
 </div>
 );

 const STAT_CARDS = [
 { label:'الطلاب', value:stats.students??students.length, color:'#3B82F6', icon:ICONS.students },
 { label:'المعلمون', value:stats.teachers??teachers.length, color:'#10B981', icon:ICONS.teachers },
 { label:'الفصول', value:stats.classes??classes.length, color:'#8B5CF6', icon:ICONS.classes },
 { label:'الاختبارات', value:stats.exams??'—', color:G, icon:ICONS.exams },
 ];

 return (
 <div style={{ minHeight:'100vh',background:DARK,padding:'28px 24px',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, system-ui, sans-serif' }}>

 {/* Header */}
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28,flexWrap:'wrap',gap:16 }}>
 <div>
 <h1 style={{ color:'#EEEEF5',fontSize:24,fontWeight:800,margin:0 }}>لوحة التحكم</h1>
 <p style={{ color:'rgba(238,238,245,0.4)',fontSize:14,margin:'4px 0 0' }}>مرحباً، {user?.full_name||user?.name||'المدير'} — {user?.school_name||'المؤسسة التعليمية'}</p>
 </div>
 <div style={{ display:'flex',gap:10 }}>
 <Link href="/dashboard/notifications" style={{ ...btn('rgba(255,255,255,0.06)'),color:'rgba(238,238,245,0.7)',textDecoration:'none',border:`1px solid ${BORDER}` }}>
 <Icon d={ICONS.notif} size={15}/> الإشعارات
 </Link>
 <Link href="/dashboard/settings" style={{ ...btn(G),color:'#000',textDecoration:'none' }}>
 <Icon d={ICONS.settings} size={15}/> الإعدادات
 </Link>
 </div>
 </div>

 {/* Stats */}
 <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16,marginBottom:28 }}>
 {STAT_CARDS.map((s,i)=>(
 <div key={i} style={{ background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:'20px 22px' }}>
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
 <div>
 <div style={{ color:'rgba(238,238,245,0.5)',fontSize:13,marginBottom:8 }}>{s.label}</div>
 <div style={{ color:'#EEEEF5',fontSize:28,fontWeight:800 }}>{s.value}</div>
 </div>
 <div style={{ width:44,height:44,borderRadius:12,background:`${s.color}18`,display:'flex',alignItems:'center',justifyContent:'center',color:s.color }}>
 <Icon d={s.icon} size={20}/>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Tabs */}
 <div style={{ display:'flex',gap:4,marginBottom:20,background:'rgba(255,255,255,0.03)',borderRadius:12,padding:4,width:'fit-content' }}>
 {(['overview','students','teachers','classes'] as const).map(tab=>{
 const labels = { overview:'نظرة عامة',students:'الطلاب',teachers:'المعلمون',classes:'الفصول' };
 return (
 <button key={tab} onClick={()=>setActiveTab(tab)} style={{ padding:'8px 20px',borderRadius:9,border:'none',cursor:'pointer',fontSize:14,fontWeight:600,background:activeTab===tab?G:'transparent',color:activeTab===tab?'#000':'rgba(238,238,245,0.5)',transition:'all 0.2s',fontFamily:'inherit' }}>
 {labels[tab]}
 </button>
 );
 })}
 </div>

 {/* Overview */}
 {activeTab==='overview' && (
 <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20 }}>
 <div style={{ background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:24 }}>
 <h3 style={{ color:'#EEEEF5',fontSize:16,fontWeight:700,margin:'0 0 16px' }}>إجراءات سريعة</h3>
 <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
 <button onClick={openAddStudent} style={{ ...btn('#3B82F6'),justifyContent:'flex-start' }}><Icon d={ICONS.plus} size={15}/> إضافة طالب جديد</button>
 <button onClick={openAddTeacher} style={{ ...btn('#10B981'),justifyContent:'flex-start' }}><Icon d={ICONS.plus} size={15}/> إضافة معلم جديد</button>
 <button onClick={openAddClass} style={{ ...btn('#8B5CF6'),justifyContent:'flex-start' }}><Icon d={ICONS.plus} size={15}/> إضافة فصل دراسي</button>
 <Link href="/dashboard/exams/create" style={{ ...btn(G),color:'#000',textDecoration:'none',justifyContent:'flex-start' }}><Icon d={ICONS.plus} size={15}/> إنشاء اختبار</Link>
 </div>
 </div>
 <div style={{ background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:24 }}>
 <h3 style={{ color:'#EEEEF5',fontSize:16,fontWeight:700,margin:'0 0 16px' }}>آخر الطلاب المسجلين</h3>
 {students.slice(0,5).map((s:any,i:number)=>(
 <div key={i} style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i<4?`1px solid ${BORDER}`:'none' }}>
 <div style={{ width:36,height:36,borderRadius:'50%',background:'rgba(59,130,246,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#3B82F6',fontSize:14,fontWeight:700 }}>
 {(s.full_name||s.name||'؟')[0]}
 </div>
 <div style={{ flex:1 }}>
 <div style={{ color:'#EEEEF5',fontSize:14,fontWeight:600 }}>{s.full_name||s.name}</div>
 <div style={{ color:'rgba(238,238,245,0.4)',fontSize:12 }}>{s.grade_level||'—'}</div>
 </div>
 <button onClick={()=>openEditStudent(s)} style={iconBtn(59,130,246)} title="تعديل"><Icon d={ICONS.edit} size={13}/></button>
 </div>
 ))}
 {students.length===0 && <p style={{ color:'rgba(238,238,245,0.3)',fontSize:14,textAlign:'center',padding:'20px 0' }}>لا يوجد طلاب بعد</p>}
 </div>
 </div>
 )}

 {/* Students Tab */}
 {activeTab==='students' && (
 <div style={{ background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,overflow:'hidden' }}>
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 24px',borderBottom:`1px solid ${BORDER}` }}>
 <h3 style={{ color:'#EEEEF5',fontSize:16,fontWeight:700,margin:0 }}>الطلاب ({students.length})</h3>
 <div style={{ display:'flex',gap:10 }}>
 <Link href="/dashboard/students" style={{ padding:'8px 16px',background:'rgba(255,255,255,0.05)',border:`1px solid ${BORDER}`,borderRadius:9,color:'rgba(238,238,245,0.7)',textDecoration:'none',fontSize:13 }}>عرض الكل</Link>
 <button onClick={openAddStudent} style={btn('#3B82F6')}><Icon d={ICONS.plus} size={14}/> إضافة طالب</button>
 </div>
 </div>
 {students.length===0 ? (
 <div style={{ textAlign:'center',padding:60 }}>
 <p style={{ color:'rgba(238,238,245,0.3)',fontSize:14,marginBottom:16 }}>لا يوجد طلاب مسجلون</p>
 <button onClick={openAddStudent} style={btn('#3B82F6')}><Icon d={ICONS.plus} size={14}/> إضافة أول طالب</button>
 </div>
 ) : (
 <div style={{ overflowX:'auto' }}>
 <table style={{ width:'100%',borderCollapse:'collapse' }}>
 <thead>
 <tr style={{ background:'rgba(255,255,255,0.02)' }}>
 {['الاسم','البريد الإلكتروني','الجنس','المرحلة','الإجراءات'].map(h=>(
 <th key={h} style={{ padding:'12px 16px',color:'rgba(238,238,245,0.5)',fontSize:12,fontWeight:600,textAlign:'right',borderBottom:`1px solid ${BORDER}` }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {students.map((s:any,i:number)=>(
 <tr key={i} style={{ borderBottom:`1px solid rgba(255,255,255,0.03)` }}>
 <td style={{ padding:'12px 16px',color:'#EEEEF5',fontSize:14,fontWeight:600 }}>{s.full_name||s.name}</td>
 <td style={{ padding:'12px 16px',color:'rgba(238,238,245,0.5)',fontSize:13 }}>{s.email}</td>
 <td style={{ padding:'12px 16px',color:'rgba(238,238,245,0.5)',fontSize:13 }}>{s.gender==='male'?'ذكر':'أنثى'}</td>
 <td style={{ padding:'12px 16px',color:'rgba(238,238,245,0.5)',fontSize:13 }}>{s.grade_level||'—'}</td>
 <td style={{ padding:'12px 16px' }}>
 <div style={{ display:'flex',gap:6 }}>
 <button onClick={()=>openEditStudent(s)} style={iconBtn(59,130,246)} title="تعديل"><Icon d={ICONS.edit} size={14}/></button>
 <button onClick={()=>setDeleteStudent(s)} style={iconBtn(239,68,68)} title="حذف"><Icon d={ICONS.trash} size={14}/></button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 )}

 {/* Teachers Tab */}
 {activeTab==='teachers' && (
 <div style={{ background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,overflow:'hidden' }}>
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 24px',borderBottom:`1px solid ${BORDER}` }}>
 <h3 style={{ color:'#EEEEF5',fontSize:16,fontWeight:700,margin:0 }}>المعلمون ({teachers.length})</h3>
 <div style={{ display:'flex',gap:10 }}>
 <Link href="/dashboard/teachers" style={{ padding:'8px 16px',background:'rgba(255,255,255,0.05)',border:`1px solid ${BORDER}`,borderRadius:9,color:'rgba(238,238,245,0.7)',textDecoration:'none',fontSize:13 }}>عرض الكل</Link>
 <button onClick={openAddTeacher} style={btn('#10B981')}><Icon d={ICONS.plus} size={14}/> إضافة معلم</button>
 </div>
 </div>
 {teachers.length===0 ? (
 <div style={{ textAlign:'center',padding:60 }}>
 <p style={{ color:'rgba(238,238,245,0.3)',fontSize:14,marginBottom:16 }}>لا يوجد معلمون مسجلون</p>
 <button onClick={openAddTeacher} style={btn('#10B981')}><Icon d={ICONS.plus} size={14}/> إضافة أول معلم</button>
 </div>
 ) : (
 <div style={{ padding:20,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14 }}>
 {teachers.map((t:any,i:number)=>(
 <div key={i} style={{ background:'rgba(255,255,255,0.02)',border:`1px solid ${BORDER}`,borderRadius:12,padding:16 }}>
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
 <div style={{ display:'flex',alignItems:'center',gap:12 }}>
 <div style={{ width:44,height:44,borderRadius:'50%',background:'rgba(16,185,129,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#10B981',fontSize:16,fontWeight:700 }}>
 {(t.full_name||t.name||'؟')[0]}
 </div>
 <div>
 <div style={{ color:'#EEEEF5',fontWeight:700,fontSize:14 }}>{t.full_name||t.name}</div>
 <div style={{ color:'rgba(238,238,245,0.4)',fontSize:12 }}>{t.email}</div>
 </div>
 </div>
 <div style={{ display:'flex',gap:6 }}>
 <button onClick={()=>openEditTeacher(t)} style={iconBtn(59,130,246)} title="تعديل"><Icon d={ICONS.edit} size={13}/></button>
 <button onClick={()=>setDeleteTeacher(t)} style={iconBtn(239,68,68)} title="حذف"><Icon d={ICONS.trash} size={13}/></button>
 </div>
 </div>
 <span style={{ padding:'3px 10px',borderRadius:20,fontSize:11,background:'rgba(59,130,246,0.1)',color:'#3B82F6' }}>{t.specialization||'معلم'}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* Classes Tab */}
 {activeTab==='classes' && (
 <div style={{ background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,overflow:'hidden' }}>
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 24px',borderBottom:`1px solid ${BORDER}` }}>
 <h3 style={{ color:'#EEEEF5',fontSize:16,fontWeight:700,margin:0 }}>الفصول الدراسية ({classes.length})</h3>
 <div style={{ display:'flex',gap:10 }}>
 <Link href="/dashboard/classes" style={{ padding:'8px 16px',background:'rgba(255,255,255,0.05)',border:`1px solid ${BORDER}`,borderRadius:9,color:'rgba(238,238,245,0.7)',textDecoration:'none',fontSize:13 }}>عرض الكل</Link>
 <button onClick={openAddClass} style={btn('#8B5CF6')}><Icon d={ICONS.plus} size={14}/> إضافة فصل</button>
 </div>
 </div>
 {classes.length===0 ? (
 <div style={{ textAlign:'center',padding:60 }}>
 <p style={{ color:'rgba(238,238,245,0.3)',fontSize:14,marginBottom:16 }}>لا توجد فصول دراسية</p>
 <button onClick={openAddClass} style={btn('#8B5CF6')}><Icon d={ICONS.plus} size={14}/> إضافة أول فصل</button>
 </div>
 ) : (
 <div style={{ padding:20,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14 }}>
 {classes.map((c:any,i:number)=>(
 <div key={i} style={{ background:'rgba(255,255,255,0.02)',border:`1px solid ${BORDER}`,borderRadius:12,padding:18 }}>
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
 <div style={{ width:44,height:44,borderRadius:12,background:'rgba(139,92,246,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#8B5CF6' }}>
 <Icon d={ICONS.classes} size={20}/>
 </div>
 <div style={{ display:'flex',gap:6 }}>
 <button onClick={()=>openEditClass(c)} style={iconBtn(59,130,246)} title="تعديل"><Icon d={ICONS.edit} size={13}/></button>
 <button onClick={()=>setDeleteClass(c)} style={iconBtn(239,68,68)} title="حذف"><Icon d={ICONS.trash} size={13}/></button>
 </div>
 </div>
 <div style={{ color:'#EEEEF5',fontWeight:700,fontSize:15,marginBottom:4 }}>{c.name||c.class_name}</div>
 <div style={{ color:'rgba(238,238,245,0.4)',fontSize:12,marginBottom:2 }}>المرحلة: {c.grade_level||c.level||'—'}</div>
 <div style={{ color:'rgba(238,238,245,0.4)',fontSize:12 }}>السعة: {c.capacity||c.max_students||'—'} طالب</div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {}
 {showStudentModal && (
 <Modal title={editingStudent?'تعديل بيانات الطالب':'إضافة طالب جديد'} onClose={()=>setShowStudentModal(false)}>
 <Field label="الاسم الكامل" value={sForm.full_name} onChange={v=>setSForm(f=>({...f,full_name:v}))} required placeholder="مثال: محمد أحمد العمري"/>
 <Field label="البريد الإلكتروني" value={sForm.email} onChange={v=>setSForm(f=>({...f,email:v}))} type="email" required placeholder="student@school.edu.sa"/>
 <Field label="رقم الجوال" value={sForm.phone} onChange={v=>setSForm(f=>({...f,phone:v}))} type="tel" placeholder="05xxxxxxxx"/>
 <Field label="رقم الهوية الوطنية" value={sForm.national_id} onChange={v=>setSForm(f=>({...f,national_id:v}))} placeholder="1xxxxxxxxx"/>
 <Field label="الجنس" value={sForm.gender} onChange={v=>setSForm(f=>({...f,gender:v}))} options={['male','female']}/>
 <Field label="المرحلة الدراسية" value={sForm.grade_level} onChange={v=>setSForm(f=>({...f,grade_level:v}))} options={GRADE_OPTIONS}/>
 <ErrBox msg={sErr}/>
 <SubmitBtn loading={sLoading} label={editingStudent?'حفظ التعديلات':'إضافة الطالب'} loadingLabel="جارٍ الحفظ..."/>
 </Modal>
 )}

 {}
 {showTeacherModal && (
 <Modal title={editingTeacher?'تعديل بيانات المعلم':'إضافة معلم جديد'} onClose={()=>setShowTeacherModal(false)}>
 <Field label="الاسم الكامل" value={tForm.full_name} onChange={v=>setTForm(f=>({...f,full_name:v}))} required placeholder="مثال: أحمد محمد السالم"/>
 <Field label="البريد الإلكتروني" value={tForm.email} onChange={v=>setTForm(f=>({...f,email:v}))} type="email" required placeholder="teacher@school.edu.sa"/>
 <Field label="رقم الجوال" value={tForm.phone} onChange={v=>setTForm(f=>({...f,phone:v}))} type="tel" placeholder="05xxxxxxxx"/>
 <Field label="رقم الهوية الوطنية" value={tForm.national_id} onChange={v=>setTForm(f=>({...f,national_id:v}))} placeholder="1xxxxxxxxx"/>
 <Field label="التخصص" value={tForm.specialization} onChange={v=>setTForm(f=>({...f,specialization:v}))} placeholder="مثال: رياضيات، لغة عربية..."/>
 <ErrBox msg={tErr}/>
 <SubmitBtn loading={tLoading} label={editingTeacher?'حفظ التعديلات':'إضافة المعلم'} loadingLabel="جارٍ الحفظ..."/>
 </Modal>
 )}

 {}
 {showClassModal && (
 <Modal title={editingClass?'تعديل الفصل الدراسي':'إضافة فصل دراسي'} onClose={()=>setShowClassModal(false)}>
 <Field label="اسم الفصل" value={cForm.name} onChange={v=>setCForm(f=>({...f,name:v}))} required placeholder="مثال: 1أ، الأول أ"/>
 <Field label="المرحلة الدراسية" value={cForm.grade_level} onChange={v=>setCForm(f=>({...f,grade_level:v}))} required options={GRADE_OPTIONS}/>
 <Field label="الشعبة" value={cForm.section} onChange={v=>setCForm(f=>({...f,section:v}))} placeholder="مثال: أ، ب، ج"/>
 <Field label="السعة (عدد الطلاب)" value={cForm.capacity} onChange={v=>setCForm(f=>({...f,capacity:v}))} type="number" placeholder="30"/>
 <ErrBox msg={cErr}/>
 <SubmitBtn loading={cLoading} label={editingClass?'حفظ التعديلات':'إضافة الفصل'} loadingLabel="جارٍ الحفظ..."/>
 </Modal>
 )}

 {}
 {deleteStudent && <ConfirmDelete name={deleteStudent.full_name||deleteStudent.name} onConfirm={confirmDeleteStudent} onCancel={()=>setDeleteStudent(null)} loading={sLoading}/>}
 {deleteTeacher && <ConfirmDelete name={deleteTeacher.full_name||deleteTeacher.name} onConfirm={confirmDeleteTeacher} onCancel={()=>setDeleteTeacher(null)} loading={tLoading}/>}
 {deleteClass && <ConfirmDelete name={deleteClass.name||deleteClass.class_name} onConfirm={confirmDeleteClass} onCancel={()=>setDeleteClass(null)} loading={cLoading}/>}

 </div>
 );
}
