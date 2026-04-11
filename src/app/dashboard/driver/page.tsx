'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { toast } from '@/lib/toast';
import { } from "lucide-react";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getHeaders } from '@/lib/api';

/* ─── Design: Dark #06060E + Gold #C9A84C — متين v5 ─── */
const G = '#C9A84C';
const DARK = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';


const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
 <path d={d} />
 </svg>
);

const ICONS = {
 bus: 'M8 6v6 M15 6v6 M2 12h19.6 M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5c-.3-1.1-1.3-1.8-2.4-1.8H5c-1.1 0-2.1.7-2.4 1.8l-1.4 5c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3 M7 18h10 M5 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0z M15 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0z',
 map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
 check: 'M20 6L9 17l-5-5',
 users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
 play: 'M5 3l14 9-14 9V3z',
 stop: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
 msg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
 close: 'M18 6L6 18 M6 6l12 12',
 refresh: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
};

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
 return (
 <div style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20 }} onClick={onClose}>
 <div style={{ background:'#0F0F1A',border:`1px solid ${BORDER}`,borderRadius:20,width:'100%',maxWidth:480,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.6)' }} onClick={e=>e.stopPropagation()}>
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

const ErrBox = ({ msg }: { msg: string }) => msg ? (
 <div style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 14px',color:'#EF4444',fontSize:13,marginBottom:12 }}>{msg}</div>
) : null;

const OkBox = ({ msg }: { msg: string }) => msg ? (
 <div style={{ background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:8,padding:'10px 14px',color:'#10B981',fontSize:13,marginBottom:12 }}>{msg}</div>
) : null;

type Trip = { id: number; route_name?: string; status?: string; vehicle_number?: string; start_time?: string; };
type Student = { id: number; name?: string; full_name?: string; boarded?: boolean; };

export default function DriverDashboard() {
 const router = useRouter();
 const [user, setUser] = useState<any>(null);
 const [trips, setTrips] = useState<Trip[]>([]);
 const [students, setStudents] = useState<Student[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

 const [showStart, setShowStart] = useState(false);
 const [showLoc, setShowLoc] = useState(false);
 const [showBoard, setShowBoard] = useState(false);
 const [showMsg, setShowMsg] = useState(false);

 const [startForm, setStartForm] = useState({ route_name: '', vehicle_number: '', notes: '' });
 const [startErr, setStartErr] = useState(''); const [startOk, setStartOk] = useState(''); const [startLoading, setStartLoading] = useState(false);

 const [locForm, setLocForm] = useState({ latitude: '', longitude: '', notes: '' });
 const [locErr, setLocErr] = useState(''); const [locOk, setLocOk] = useState(''); const [locLoading, setLocLoading] = useState(false);

 const [boardStudent, setBoardStudent] = useState<Student | null>(null);
 const [boardErr, setBoardErr] = useState(''); const [boardLoading, setBoardLoading] = useState(false);

 const [msgForm, setMsgForm] = useState({ message: '', recipient: 'all' });
 const [msgErr, setMsgErr] = useState(''); const [msgOk, setMsgOk] = useState(''); const [msgLoading, setMsgLoading] = useState(false);

 useEffect(() => {
 const u = localStorage.getItem('matin_user');
 if (!u) { router.push('/login'); return; }
 setUser(JSON.parse(u));
 loadData();
 }, []);

 const loadData = useCallback(async () => {
 setLoading(true);
 try {
 const [r1, r2] = await Promise.all([
 fetch('/api/transport', { headers: getHeaders() }),
 fetch('/api/student-tracking', { headers: getHeaders() }),
 ]);
 const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
 const tripList: Trip[] = Array.isArray(d1) ? d1 : (d1?.data || []);
 setTrips(tripList);
 setActiveTrip(tripList.find(t => t.status === 'active' || t.status === 'in_progress') || null);
 setStudents(Array.isArray(d2) ? d2 : (d2?.data || []));
 } catch (e) { console.error(e); }
 finally { setLoading(false); }
 }, []);

 const handleStartTrip = async () => {
 if (!startForm.route_name.trim()) { setStartErr('اسم المسار مطلوب'); return; }
 if (!startForm.vehicle_number.trim()) { setStartErr('رقم المركبة مطلوب'); return; }
 setStartLoading(true); setStartErr(''); setStartOk('');
 try {
 const res = await fetch('/api/transport', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ...startForm, status: 'active', start_time: new Date().toISOString() }) });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'فشل بدء الرحلة');
 setStartOk('تم بدء الرحلة بنجاح');
 setTimeout(() => { setShowStart(false); setStartOk(''); loadData(); }, 1500);
 } catch (e: any) { setStartErr(e.message); }
 finally { setStartLoading(false); }
 };

 const handleEndTrip = async () => {
 if (!activeTrip || !confirm('هل تريد إنهاء الرحلة الحالية؟')) return;
 try {
 const res = await fetch('/api/transport', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ id: activeTrip.id, status: 'completed', end_time: new Date().toISOString() }) });
 if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'فشل إنهاء الرحلة'); }
 await loadData();
 } catch (e: any) { toast(e.message || 'حدث خطأ', 'error'); }
 };

 const getGPS = () => {
 if (!navigator.geolocation) { setLocErr('المتصفح لا يدعم GPS'); return; }
 navigator.geolocation.getCurrentPosition(
 pos => setLocForm(f => ({ ...f, latitude: String(pos.coords.latitude.toFixed(6)), longitude: String(pos.coords.longitude.toFixed(6)) })),
 () => setLocErr('تعذر الحصول على الموقع — أدخله يدوياً')
 );
 };

 const handleUpdateLocation = async () => {
 if (!locForm.latitude || !locForm.longitude) { setLocErr('خط العرض وخط الطول مطلوبان'); return; }
 setLocLoading(true); setLocErr(''); setLocOk('');
 try {
 const res = await fetch('/api/transport/location', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ...locForm, trip_id: activeTrip?.id, timestamp: new Date().toISOString() }) });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'فشل تحديث الموقع');
 setLocOk('تم تحديث الموقع بنجاح');
 setTimeout(() => { setShowLoc(false); setLocOk(''); }, 1500);
 } catch (e: any) { setLocErr(e.message); }
 finally { setLocLoading(false); }
 };

 const handleBoard = async () => {
 if (!boardStudent) return;
 setBoardLoading(true); setBoardErr('');
 try {
 const res = await fetch('/api/transport/board', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ student_id: boardStudent.id, trip_id: activeTrip?.id, boarded_at: new Date().toISOString(), status: 'boarded' }) });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'فشل تسجيل الركوب');
 setStudents(prev => prev.map(s => s.id === boardStudent.id ? { ...s, boarded: true } : s));
 setShowBoard(false); setBoardStudent(null);
 } catch (e: any) { setBoardErr(e.message); }
 finally { setBoardLoading(false); }
 };

 const handleSendMsg = async () => {
 if (!msgForm.message.trim()) { setMsgErr('الرسالة مطلوبة'); return; }
 setMsgLoading(true); setMsgErr(''); setMsgOk('');
 try {
 const res = await fetch('/api/messages', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ content: msgForm.message, recipient_type: msgForm.recipient, trip_id: activeTrip?.id }) });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'فشل إرسال الرسالة');
 setMsgOk('تم إرسال الرسالة بنجاح');
 setTimeout(() => { setShowMsg(false); setMsgOk(''); setMsgForm({ message: '', recipient: 'all' }); }, 1500);
 } catch (e: any) { setMsgErr(e.message); }
 finally { setMsgLoading(false); }
 };

 const inp: React.CSSProperties = { width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:`1px solid ${BORDER}`,borderRadius:10,color:'#EEEEF5',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit' };
 const lbl: React.CSSProperties = { display:'block',color:'rgba(238,238,245,0.7)',fontSize:13,fontWeight:600,marginBottom:6 };
 const fw: React.CSSProperties = { marginBottom:16 };
 const mkBtn = (color: string, disabled = false): React.CSSProperties => ({ padding:'10px 20px',background:disabled?'rgba(255,255,255,0.05)':`linear-gradient(135deg,${color},${color}CC)`,color:disabled?'rgba(238,238,245,0.3)':(color===G?'#000':'#fff'),border:'none',borderRadius:10,cursor:disabled?'not-allowed':'pointer',fontSize:14,fontWeight:700,display:'flex',alignItems:'center',gap:6,fontFamily:'inherit' });

 if (!user || loading) return <div style={{ minHeight:'100vh',background:DARK,display:'flex',alignItems:'center',justifyContent:'center' }}><div style={{ color:G,fontSize:16 }}>جارٍ التحميل...</div></div>;

 const boardedCount = students.filter(s => s.boarded).length;

 return (
 <div style={{ minHeight:'100vh',background:DARK,padding:'28px 24px',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, system-ui, sans-serif' }}>

 {/* Header */}
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28,flexWrap:'wrap',gap:16 }}>
 <div>
 <h1 style={{ color:'#EEEEF5',fontSize:24,fontWeight:800,margin:0 }}>لوحة السائق</h1>
 <p style={{ color:'rgba(238,238,245,0.4)',fontSize:14,margin:'4px 0 0' }}>مرحباً، {user?.full_name || user?.name || 'السائق'}</p>
 </div>
 <button onClick={loadData} style={{ ...mkBtn('rgba(255,255,255,0.06)'),color:'rgba(238,238,245,0.7)',border:`1px solid ${BORDER}` }}>
 <Icon d={ICONS.refresh} size={15}/> تحديث
 </button>
 </div>

 {/* Active Trip Banner */}
 {activeTrip ? (
 <div style={{ background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:16,padding:'20px 24px',marginBottom:24,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
 <div style={{ display:'flex',alignItems:'center',gap:14 }}>
 <div style={{ width:48,height:48,borderRadius:12,background:'rgba(16,185,129,0.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#10B981' }}><Icon d={ICONS.bus} size={22}/></div>
 <div>
 <div style={{ color:'#10B981',fontSize:13,fontWeight:600,marginBottom:2 }}>رحلة نشطة</div>
 <div style={{ color:'#EEEEF5',fontSize:16,fontWeight:700 }}>{activeTrip.route_name || 'الرحلة الحالية'}</div>
 <div style={{ color:'rgba(238,238,245,0.4)',fontSize:12 }}>المركبة: {activeTrip.vehicle_number || '—'} | ركب: {boardedCount}/{students.length}</div>
 </div>
 </div>
 <div style={{ display:'flex',gap:10 }}>
 <button onClick={() => { setLocForm({latitude:'',longitude:'',notes:''}); setLocErr(''); setLocOk(''); setShowLoc(true); }} style={mkBtn('#3B82F6')}>
 <Icon d={ICONS.map} size={15}/> تحديث الموقع
 </button>
 <button onClick={handleEndTrip} style={mkBtn('#EF4444')}>
 <Icon d={ICONS.stop} size={15}/> إنهاء الرحلة
 </button>
 </div>
 </div>
 ) : (
 <div style={{ background:`rgba(201,168,76,0.06)`,border:`1px solid rgba(201,168,76,0.2)`,borderRadius:16,padding:'20px 24px',marginBottom:24,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
 <div style={{ display:'flex',alignItems:'center',gap:14 }}>
 <div style={{ width:48,height:48,borderRadius:12,background:`rgba(201,168,76,0.1)`,display:'flex',alignItems:'center',justifyContent:'center',color:G }}><Icon d={ICONS.bus} size={22}/></div>
 <div>
 <div style={{ color:G,fontSize:13,fontWeight:600,marginBottom:2 }}>لا توجد رحلة نشطة</div>
 <div style={{ color:'rgba(238,238,245,0.5)',fontSize:14 }}>ابدأ رحلة جديدة لتتبع الطلاب</div>
 </div>
 </div>
 <button onClick={() => { setStartForm({route_name:'',vehicle_number:'',notes:''}); setStartErr(''); setStartOk(''); setShowStart(true); }} style={mkBtn(G)}>
 <Icon d={ICONS.play} size={15}/> بدء رحلة جديدة
 </button>
 </div>
 )}

 {/* Stats */}
 <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:14,marginBottom:24 }}>
 {[
 { label:'إجمالي الرحلات',value:trips.length,color:'#8B5CF6' },
 { label:'الطلاب المسجلون',value:students.length,color:'#3B82F6' },
 { label:'ركبوا اليوم',value:boardedCount,color:'#10B981' },
 { label:'في الانتظار',value:students.length-boardedCount,color:G },
 ].map((s,i) => (
 <div key={i} style={{ background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:'18px 20px' }}>
 <div style={{ color:'rgba(238,238,245,0.5)',fontSize:12,marginBottom:8 }}>{s.label}</div>
 <div style={{ color:'#EEEEF5',fontSize:26,fontWeight:800 }}>{s.value}</div>
 </div>
 ))}
 </div>

 {/* Quick Actions */}
 <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14,marginBottom:28 }}>
 {[
 { label:'بدء رحلة',icon:ICONS.play,color:G,action:()=>{ setStartForm({route_name:'',vehicle_number:'',notes:''}); setStartErr(''); setStartOk(''); setShowStart(true); },disabled:!!activeTrip },
 { label:'تحديث الموقع',icon:ICONS.map,color:'#3B82F6',action:()=>{ setLocForm({latitude:'',longitude:'',notes:''}); setLocErr(''); setLocOk(''); setShowLoc(true); },disabled:!activeTrip },
 { label:'تسجيل ركوب طالب',icon:ICONS.check,color:'#10B981',action:()=>setShowBoard(true),disabled:!activeTrip },
 { label:'إرسال رسالة',icon:ICONS.msg,color:'#8B5CF6',action:()=>{ setMsgForm({message:'',recipient:'all'}); setMsgErr(''); setMsgOk(''); setShowMsg(true); },disabled:false },
 ].map((a,i) => (
 <button key={i} onClick={a.disabled?undefined:a.action} disabled={a.disabled} style={{ ...mkBtn(a.color,a.disabled),padding:'16px 20px',borderRadius:14,flexDirection:'column',alignItems:'flex-start',gap:10,border:`1px solid rgba(255,255,255,0.05)` }}>
 <Icon d={a.icon} size={20}/>
 <span style={{ fontSize:14 }}>{a.label}</span>
 </button>
 ))}
 </div>

 {/* Students List */}
 <div style={{ background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,overflow:'hidden',marginBottom:20 }}>
 <div style={{ padding:'18px 24px',borderBottom:`1px solid ${BORDER}` }}>
 <h3 style={{ color:'#EEEEF5',fontSize:16,fontWeight:700,margin:0 }}>قائمة الطلاب ({students.length})</h3>
 </div>
 {students.length === 0 ? (
 <div style={{ textAlign:'center',padding:48 }}><p style={{ color:'rgba(238,238,245,0.3)',fontSize:14 }}>لا يوجد طلاب مسجلون في هذا المسار</p></div>
 ) : (
 <div style={{ overflowX:'auto' }}>
 <table style={{ width:'100%',borderCollapse:'collapse' }}>
 <thead>
 <tr style={{ background:'rgba(255,255,255,0.02)' }}>
 {['الطالب','الحالة','الإجراء'].map(h => <th key={h} style={{ padding:'12px 16px',color:'rgba(238,238,245,0.5)',fontSize:12,fontWeight:600,textAlign:'right',borderBottom:`1px solid ${BORDER}` }}>{h}</th>)}
 </tr>
 </thead>
 <tbody>
 {students.map((s,i) => (
 <tr key={i} style={{ borderBottom:`1px solid rgba(255,255,255,0.03)` }}>
 <td style={{ padding:'12px 16px',color:'#EEEEF5',fontSize:14,fontWeight:600 }}>{s.full_name||s.name||`طالب ${i+1}`}</td>
 <td style={{ padding:'12px 16px' }}>
 <span style={{ padding:'3px 10px',borderRadius:20,fontSize:11,background:s.boarded?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:s.boarded?'#10B981':'#EF4444' }}>
 {s.boarded?'ركب':'في الانتظار'}
 </span>
 </td>
 <td style={{ padding:'12px 16px' }}>
 {!s.boarded && activeTrip && (
 <button onClick={()=>{ setBoardStudent(s); setBoardErr(''); setShowBoard(true); }} style={{ padding:'6px 14px',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:8,color:'#10B981',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'inherit' }}>
 تسجيل ركوب
 </button>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* Recent Trips */}
 {trips.length > 0 && (
 <div style={{ background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,overflow:'hidden' }}>
 <div style={{ padding:'18px 24px',borderBottom:`1px solid ${BORDER}` }}>
 <h3 style={{ color:'#EEEEF5',fontSize:16,fontWeight:700,margin:0 }}>آخر الرحلات</h3>
 </div>
 <div style={{ overflowX:'auto' }}>
 <table style={{ width:'100%',borderCollapse:'collapse' }}>
 <thead>
 <tr style={{ background:'rgba(255,255,255,0.02)' }}>
 {['المسار','المركبة','الحالة','وقت البدء'].map(h => <th key={h} style={{ padding:'12px 16px',color:'rgba(238,238,245,0.5)',fontSize:12,fontWeight:600,textAlign:'right',borderBottom:`1px solid ${BORDER}` }}>{h}</th>)}
 </tr>
 </thead>
 <tbody>
 {trips.slice(0,10).map((t,i) => (
 <tr key={i} style={{ borderBottom:`1px solid rgba(255,255,255,0.03)` }}>
 <td style={{ padding:'12px 16px',color:'#EEEEF5',fontSize:14 }}>{t.route_name||'—'}</td>
 <td style={{ padding:'12px 16px',color:'rgba(238,238,245,0.5)',fontSize:13 }}>{t.vehicle_number||'—'}</td>
 <td style={{ padding:'12px 16px' }}>
 <span style={{ padding:'3px 10px',borderRadius:20,fontSize:11,background:t.status==='active'?'rgba(16,185,129,0.1)':'rgba(255,255,255,0.05)',color:t.status==='active'?'#10B981':'rgba(238,238,245,0.5)' }}>
 {t.status==='active'?'نشطة':t.status==='completed'?'مكتملة':t.status||'—'}
 </span>
 </td>
 <td style={{ padding:'12px 16px',color:'rgba(238,238,245,0.4)',fontSize:12 }}>
 {t.start_time?new Date(t.start_time).toLocaleString('ar-SA'):'—'}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {}
 {showStart && (
 <Modal title="بدء رحلة جديدة" onClose={()=>setShowStart(false)}>
 <div style={fw}><label style={lbl}>اسم المسار <span style={{color:'#EF4444'}}>*</span></label><input value={startForm.route_name} onChange={e=>setStartForm(f=>({...f,route_name:e.target.value}))} placeholder="مثال: مسار الحي الشمالي" style={inp}/></div>
 <div style={fw}><label style={lbl}>رقم المركبة <span style={{color:'#EF4444'}}>*</span></label><input value={startForm.vehicle_number} onChange={e=>setStartForm(f=>({...f,vehicle_number:e.target.value}))} placeholder="مثال: أ ب ج 1234" style={inp}/></div>
 <div style={fw}><label style={lbl}>ملاحظات</label><textarea value={startForm.notes} onChange={e=>setStartForm(f=>({...f,notes:e.target.value}))} placeholder="أي ملاحظات إضافية..." style={{...inp,minHeight:80,resize:'vertical'}}/></div>
 <ErrBox msg={startErr}/><OkBox msg={startOk}/>
 <button onClick={handleStartTrip} disabled={startLoading} style={{...mkBtn(G,startLoading),width:'100%',justifyContent:'center',padding:'11px'}}>
 {startLoading?'جارٍ البدء...':'بدء الرحلة'}
 </button>
 </Modal>
 )}

 {}
 {showLoc && (
 <Modal title="تحديث الموقع الحالي" onClose={()=>setShowLoc(false)}>
 <button onClick={getGPS} style={{...mkBtn('#3B82F6'),width:'100%',justifyContent:'center',marginBottom:16}}>
 <Icon d={ICONS.map} size={15}/> الحصول على الموقع تلقائياً (GPS)
 </button>
 <div style={fw}><label style={lbl}>خط العرض <span style={{color:'#EF4444'}}>*</span></label><input value={locForm.latitude} onChange={e=>setLocForm(f=>({...f,latitude:e.target.value}))} placeholder="24.7136" style={inp} type="number" step="0.000001"/></div>
 <div style={fw}><label style={lbl}>خط الطول <span style={{color:'#EF4444'}}>*</span></label><input value={locForm.longitude} onChange={e=>setLocForm(f=>({...f,longitude:e.target.value}))} placeholder="46.6753" style={inp} type="number" step="0.000001"/></div>
 <div style={fw}><label style={lbl}>ملاحظة</label><input value={locForm.notes} onChange={e=>setLocForm(f=>({...f,notes:e.target.value}))} placeholder="مثال: عند مدخل الحي" style={inp}/></div>
 <ErrBox msg={locErr}/><OkBox msg={locOk}/>
 <button onClick={handleUpdateLocation} disabled={locLoading} style={{...mkBtn('#3B82F6',locLoading),width:'100%',justifyContent:'center',padding:'11px'}}>
 {locLoading?'جارٍ التحديث...':'تحديث الموقع'}
 </button>
 </Modal>
 )}

 {}
 {showBoard && (
 <Modal title="تسجيل ركوب طالب" onClose={()=>{ setShowBoard(false); setBoardStudent(null); }}>
 {!boardStudent ? (
 <div>
 <p style={{ color:'rgba(238,238,245,0.6)',fontSize:14,marginBottom:16 }}>اختر الطالب الذي ركب الحافلة:</p>
 <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
 {students.filter(s=>!s.boarded).map((s,i) => (
 <button key={i} onClick={()=>setBoardStudent(s)} style={{ padding:'12px 16px',background:'rgba(255,255,255,0.04)',border:`1px solid ${BORDER}`,borderRadius:10,color:'#EEEEF5',cursor:'pointer',textAlign:'right',fontSize:14,fontFamily:'inherit',display:'flex',alignItems:'center',gap:10 }}>
 <div style={{ width:32,height:32,borderRadius:'50%',background:'rgba(16,185,129,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#10B981',fontSize:13,fontWeight:700 }}>
 {(s.full_name||s.name||'؟')[0]}
 </div>
 {s.full_name||s.name}
 </button>
 ))}
 {students.filter(s=>!s.boarded).length===0 && <p style={{ color:'rgba(238,238,245,0.3)',fontSize:14,textAlign:'center',padding:'20px 0' }}>جميع الطلاب ركبوا الحافلة</p>}
 </div>
 </div>
 ) : (
 <div>
 <p style={{ color:'rgba(238,238,245,0.7)',fontSize:14,marginBottom:20 }}>تأكيد تسجيل ركوب: <strong style={{color:'#EEEEF5'}}>{boardStudent.full_name||boardStudent.name}</strong></p>
 <ErrBox msg={boardErr}/>
 <div style={{ display:'flex',gap:10 }}>
 <button onClick={()=>setBoardStudent(null)} style={{ flex:1,padding:'10px',background:'rgba(255,255,255,0.05)',border:`1px solid ${BORDER}`,borderRadius:10,color:'rgba(238,238,245,0.7)',cursor:'pointer',fontFamily:'inherit' }}>رجوع</button>
 <button onClick={handleBoard} disabled={boardLoading} style={{...mkBtn('#10B981',boardLoading),flex:1,justifyContent:'center',padding:'10px'}}>
 {boardLoading?'جارٍ التسجيل...':'تأكيد الركوب'}
 </button>
 </div>
 </div>
 )}
 </Modal>
 )}

 {}
 {showMsg && (
 <Modal title="إرسال رسالة" onClose={()=>setShowMsg(false)}>
 <div style={fw}><label style={lbl}>المستلم</label>
 <select value={msgForm.recipient} onChange={e=>setMsgForm(f=>({...f,recipient:e.target.value}))} style={inp}>
 <option value="all">جميع أولياء الأمور</option>
 <option value="parents">أولياء الأمور فقط</option>
 <option value="admin">الإدارة</option>
 </select>
 </div>
 <div style={fw}><label style={lbl}>الرسالة <span style={{color:'#EF4444'}}>*</span></label><textarea value={msgForm.message} onChange={e=>setMsgForm(f=>({...f,message:e.target.value}))} placeholder="اكتب رسالتك هنا..." style={{...inp,minHeight:100,resize:'vertical'}}/></div>
 <ErrBox msg={msgErr}/><OkBox msg={msgOk}/>
 <button onClick={handleSendMsg} disabled={msgLoading} style={{...mkBtn('#8B5CF6',msgLoading),width:'100%',justifyContent:'center',padding:'11px'}}>
 {msgLoading?'جارٍ الإرسال...':'إرسال الرسالة'}
 </button>
 </Modal>
 )}

 </div>
 );
}
