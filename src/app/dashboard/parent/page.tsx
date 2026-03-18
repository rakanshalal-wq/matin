'use client';
import IconRenderer from "@/components/IconRenderer";
import {, X } from "lucide-react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, ICONS, G, DARK, CARD, BORDER, Spinner } from '@/components/ui-icons';

/* ─── Design: Dark #06060E + Gold #C9A84C — متين v5 ─── */

const getHeaders = (): Record<string, string> => {
 try {
 const token = localStorage.getItem('matin_token');
 if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
 return { 'Content-Type': 'application/json' };
 } catch { return { 'Content-Type': 'application/json' }; }
};

/* ── Modal ── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
 return (
 <div style={{ position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20 }} onClick={onClose}>
 <div style={{ background:'#0F0F1A',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.6)' }} onClick={e=>e.stopPropagation()}>
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 24px',borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
 <h3 style={{ color:'#EEEEF5',fontSize:17,fontWeight:700,margin:0 }}>{title}</h3>
 <button onClick={onClose} style={{ background:'rgba(255,255,255,0.05)',border:'none',borderRadius:8,padding:'6px 10px',cursor:'pointer',color:'rgba(238,238,245,0.6)',fontSize:16 }}>✕</button>
 </div>
 <div style={{ padding:24 }}>{children}</div>
 </div>
 </div>
 );
}
const ErrBox = ({ msg }: { msg: string }) => msg ? <div style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 14px',color:'#EF4444',fontSize:13,marginBottom:12 }}>{msg}</div> : null;
const OkBox = ({ msg }: { msg: string }) => msg ? <div style={{ background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:8,padding:'10px 14px',color:'#10B981',fontSize:13,marginBottom:12 }}>{msg}</div> : null;
const INP: React.CSSProperties = { width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,color:'#EEEEF5',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit' };
const LBL: React.CSSProperties = { display:'block',color:'rgba(238,238,245,0.7)',fontSize:13,fontWeight:600,marginBottom:6 };
const FW: React.CSSProperties = { marginBottom:16 };

export default function ParentDashboard() {
 const router = useRouter();
 const [user, setUser] = useState<any>(null);
 const [children, setChildren] = useState<any[]>([]);
 const [selectedChild, setSelectedChild] = useState<any>(null);
 const [loading, setLoading] = useState(true);

 // ── Message modal ──
 const [showMsgModal, setShowMsgModal] = useState(false);
 const [msgForm, setMsgForm] = useState({ subject: '', body: '', teacher_id: '' });
 const [msgLoading, setMsgLoading] = useState(false);
 const [msgErr, setMsgErr] = useState('');
 const [msgOk, setMsgOk] = useState('');

 // ── Leave request modal ──
 const [showLeaveModal, setShowLeaveModal] = useState(false);
 const [leaveForm, setLeaveForm] = useState({ reason: '', from_date: '', to_date: '' });
 const [leaveLoading, setLeaveLoading] = useState(false);
 const [leaveErr, setLeaveErr] = useState('');
 const [leaveOk, setLeaveOk] = useState('');

 useEffect(() => {
 const u = localStorage.getItem('matin_user');
 if (!u) { router.push('/login'); return; }
 const parsed = JSON.parse(u);
 setUser(parsed);
 fetchData(parsed);
 }, []);

 const fetchData = async (u: any) => {
 try {
 const res = await fetch('/api/parents', { headers: getHeaders() });
 if (res.ok) {
 const d = await res.json();
 const kids = d.children || (Array.isArray(d) ? d : []);
 setChildren(kids);
 if (kids.length > 0) setSelectedChild(kids[0]);
 }
 } catch (e) { console.error(e); }
 finally { setLoading(false); }
 };

 const handleSendMessage = async () => {
 if (!msgForm.subject.trim()) { setMsgErr('الموضوع مطلوب'); return; }
 if (!msgForm.body.trim()) { setMsgErr('نص الرسالة مطلوب'); return; }
 setMsgLoading(true); setMsgErr(''); setMsgOk('');
 try {
 const res = await fetch('/api/messages', {
 method: 'POST',
 headers: getHeaders(),
 body: JSON.stringify({ ...msgForm, student_id: selectedChild?.id, parent_id: user?.id }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'فشل إرسال الرسالة');
 setMsgOk('تم إرسال الرسالة بنجاح');
 setTimeout(() => { setShowMsgModal(false); setMsgOk(''); setMsgForm({ subject: '', body: '', teacher_id: '' }); }, 1500);
 } catch (e: any) { setMsgErr(e.message); }
 finally { setMsgLoading(false); }
 };

 const handleLeaveRequest = async () => {
 if (!leaveForm.reason.trim()) { setLeaveErr('سبب الغياب مطلوب'); return; }
 if (!leaveForm.from_date) { setLeaveErr('تاريخ البداية مطلوب'); return; }
 setLeaveLoading(true); setLeaveErr(''); setLeaveOk('');
 try {
 const res = await fetch('/api/attendance', {
 method: 'POST',
 headers: getHeaders(),
 body: JSON.stringify({ ...leaveForm, student_id: selectedChild?.id, parent_id: user?.id, type: 'leave_request' }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'فشل إرسال طلب الإجازة');
 setLeaveOk('تم إرسال طلب الإجازة بنجاح');
 setTimeout(() => { setShowLeaveModal(false); setLeaveOk(''); setLeaveForm({ reason: '', from_date: '', to_date: '' }); }, 1500);
 } catch (e: any) { setLeaveErr(e.message); }
 finally { setLeaveLoading(false); }
 };

 const logout = () => {
 localStorage.removeItem('matin_token');
 localStorage.removeItem('matin_user');
 router.push('/login');
 };

 const MENU = [
 { icon: 'dashboard', label: 'الرئيسية', path: '/dashboard/parent' },
 { icon: 'student_hat', label: 'أبنائي', path: '/dashboard/students' },
 { icon: 'schedule', label: 'الجدول', path: '/dashboard/schedules' },
 { icon: 'attendance', label: 'الحضور', path: '/dashboard/attendance' },
 { icon: 'grades', label: 'الدرجات', path: '/dashboard/grades' },
 { icon: 'fees', label: 'الرسوم', path: '/dashboard/finance' },
 { icon: 'transport', label: 'النقل', path: '/dashboard/transport' },
 { icon: 'messages', label: 'التواصل', path: '/dashboard/messages' },
 { icon: 'notif', label: 'الإشعارات', path: '/dashboard/notifications' },
 ];

 if (loading) return (
 <div style={{ minHeight: '100vh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
 <Spinner size={40} />
 <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>جاري التحميل...</div>
 </div>
 );

 return (
 <div style={{ display: 'flex', minHeight: '100vh', background: DARK, fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
 {/* Sidebar */}
 <div style={{ width: 220, background: '#080810', borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
 <div style={{ padding: '20px 16px', borderBottom: `1px solid ${BORDER}` }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(201,168,76,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G }}>
 <Icon d={ICONS.parent} size={18} />
 </div>
 <div>
 <div style={{ color: G, fontSize: 14, fontWeight: 800 }}>ولي أمر</div>
 <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 11, marginTop: 2 }}>{user?.name}</div>
 </div>
 </div>
 </div>
 <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
 {MENU.map((item) => {
 const isActive = typeof window !== 'undefined' && window.location.pathname === item.path;
 return (
 <div key={item.path}
 onClick={() => router.push(item.path)}
 style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 2, cursor: 'pointer', transition: 'all 0.15s', background: isActive ? `rgba(201,168,76,0.08)` : 'transparent', color: isActive ? G : 'rgba(238,238,245,0.55)', borderRight: isActive ? `3px solid ${G}` : '3px solid transparent', fontSize: 13, fontWeight: isActive ? 700 : 500 }}>
 <Icon d={ICONS[item.icon]} size={15} color={isActive ? G : 'rgba(238,238,245,0.4)'} />
 <span>{item.label}</span>
 </div>
 );
 })}
 </div>
 <div style={{ padding: '12px 8px', borderTop: `1px solid ${BORDER}` }}>
 <div onClick={logout}
 style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', color: '#EF4444', fontSize: 13, fontWeight: 600, background: 'rgba(239,68,68,0.06)' }}>
 <Icon d={ICONS.logout} size={15} color="#EF4444" />
 <span>تسجيل الخروج</span>
 </div>
 </div>
 </div>

 {/* Main Content */}
 <div style={{ flex: 1, overflow: 'auto' }}>
 {/* Topbar */}
 <div style={{ background: '#080810', borderBottom: `1px solid ${BORDER}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)' }}>
 <span style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 16 }}>بوابة ولي الأمر</span>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <button onClick={() => router.push('/dashboard/notifications')}
 style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(238,238,245,0.5)', padding: 8, borderRadius: 8 }}>
 <Icon d={ICONS.notif} size={18} />
 </button>
 <div style={{ width: 34, height: 34, borderRadius: '50%', background: `rgba(201,168,76,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G, fontWeight: 800, fontSize: 14 }}>
 {user?.name?.charAt(0)}
 </div>
 </div>
 </div>

 <div style={{ padding: '28px 24px' }}>
 {/* الترحيب */}
 <div style={{ marginBottom: 28 }}>
 <h1 style={{ color: '#EEEEF5', fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.5 }}>مرحباً {user?.name}</h1>
 <p style={{ color: 'rgba(238,238,245,0.4)', margin: 0, fontSize: 14 }}>تابع أداء أبنائك من هنا</p>
 </div>

 {/* الإجراءات السريعة */}
 <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
 <button onClick={() => { setMsgErr(''); setMsgOk(''); setMsgForm({ subject: '', body: '', teacher_id: '' }); setShowMsgModal(true); }}
 style={{ padding: '10px 18px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 10, color: '#3B82F6', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
 <Icon d={ICONS.messages} size={15} color="#3B82F6" /> رسالة للمعلم
 </button>
 <button onClick={() => { setLeaveErr(''); setLeaveOk(''); setLeaveForm({ reason: '', from_date: '', to_date: '' }); setShowLeaveModal(true); }}
 style={{ padding: '10px 18px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, color: '#F59E0B', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
 <Icon d={ICONS.attendance} size={15} color="#F59E0B" /> طلب إجازة
 </button>
 </div>

 {/* اختيار الابن */}
 {children.length > 0 && (
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
 <h3 style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
 <Icon d={ICONS.student_hat} size={16} color={G} /> أبنائي
 </h3>
 <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
 {children.map((child: any, i: number) => (
 <div key={i} onClick={() => setSelectedChild(child)}
 style={{ background: selectedChild?.id === child.id ? `rgba(201,168,76,0.1)` : 'rgba(255,255,255,0.03)', border: `2px solid ${selectedChild?.id === child.id ? G : BORDER}`, borderRadius: 12, padding: '12px 18px', cursor: 'pointer', transition: 'all 0.2s' }}>
 <div style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700 }}>{child.name}</div>
 <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginTop: 3 }}>{child.class_name || 'غير محدد'}</div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* إحصائيات الابن المختار */}
 {selectedChild && (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
 {[
 { icon: 'attendance', label: 'الحضور', value: `${selectedChild.attendance || 0}%`, color: '#10B981', path: '/dashboard/attendance' },
 { icon: 'grades', label: 'المعدل', value: `${selectedChild.grades_avg || 0}%`, color: '#3B82F6', path: '/dashboard/grades' },
 { icon: 'fees', label: 'الرسوم', value: selectedChild.pending_fees > 0 ? 'معلقة' : 'مسددة', color: selectedChild.pending_fees > 0 ? '#EF4444' : '#10B981', path: '/dashboard/finance' },
 { icon: 'transport', label: 'الباص', value: selectedChild.bus_status || 'غير مسجل', color: '#F59E0B', path: '/dashboard/transport' },
 ].map((item, i) => (
 <div key={i} onClick={() => router.push(item.path)}
 style={{ background: `${item.color}08`, border: `1px solid ${item.color}25`, borderRadius: 14, padding: '18px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
 onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = item.color; }}
 onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}25`; }}>
 <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: item.color }}>
 <Icon d={ICONS[item.icon]} size={18} />
 </div>
 <div style={{ color: item.color, fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{item.value}</div>
 <div style={{ color: 'rgba(238,238,245,0.45)', fontSize: 12, fontWeight: 500 }}>{item.label}</div>
 </div>
 ))}
 </div>
 )}

 {/* روابط سريعة */}
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
 <h3 style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>الوصول السريع</h3>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
 {[
 { icon: 'schedule', label: 'الجدول الدراسي', path: '/dashboard/schedules', color: '#8B5CF6' },
 { icon: 'homework', label: 'الواجبات', path: '/dashboard/homework', color: '#F59E0B' },
 { icon: 'exams', label: 'الاختبارات', path: '/dashboard/exams', color: '#3B82F6' },
 { icon: 'messages', label: 'التواصل مع المعلم', path: '/dashboard/messages', color: '#10B981' },
 { icon: 'notif', label: 'الإشعارات', path: '/dashboard/notifications', color: '#EC4899' },
 { icon: 'reports', label: 'التقارير', path: '/dashboard/reports', color: '#06B6D4' },
 ].map((item, i) => (
 <div key={i} onClick={() => router.push(item.path)}
 style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
 onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = item.color; (e.currentTarget as HTMLDivElement).style.background = `${item.color}08`; }}
 onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
 <div style={{ width: 34, height: 34, borderRadius: 9, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: item.color }}>
 <Icon d={ICONS[item.icon]} size={16} />
 </div>
 <div style={{ color: 'rgba(238,238,245,0.7)', fontSize: 12, fontWeight: 600 }}>{item.label}</div>
 </div>
 ))}
 </div>
 </div>

 {/* لا يوجد أبناء */}
 {children.length === 0 && (
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '48px 32px', textAlign: 'center', marginTop: 24 }}>
 <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: G }}>
 <Icon d={ICONS.parent} size={30} />
 </div>
 <div style={{ color: 'rgba(238,238,245,0.6)', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>لم يتم ربط أبنائك بعد</div>
 <div style={{ color: 'rgba(238,238,245,0.3)', fontSize: 13 }}>تواصل مع إدارة المدرسة لربط حسابات أبنائك</div>
 </div>
 )}
 </div>
 </div>

 {}
 {showMsgModal && (
 <Modal title="إرسال رسالة للمعلم" onClose={() => setShowMsgModal(false)}>
 {selectedChild && (
 <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'rgba(238,238,245,0.6)' }}>
 الطالب: <strong style={{ color: '#EEEEF5' }}>{selectedChild.name}</strong>
 </div>
 )}
 <div style={FW}><label style={LBL}>الموضوع <span style={{color:'#EF4444'}}>*</span></label>
 <input value={msgForm.subject} onChange={e => setMsgForm(f => ({...f, subject: e.target.value}))} placeholder="مثال: استفسار عن الواجب" style={INP} />
 </div>
 <div style={FW}><label style={LBL}>نص الرسالة <span style={{color:'#EF4444'}}>*</span></label>
 <textarea value={msgForm.body} onChange={e => setMsgForm(f => ({...f, body: e.target.value}))} rows={5} placeholder="اكتب رسالتك هنا..." style={{ ...INP, resize: 'vertical', minHeight: 100 }} />
 </div>
 <ErrBox msg={msgErr} /><OkBox msg={msgOk} />
 <button onClick={handleSendMessage} disabled={msgLoading} style={{ width: '100%', padding: '11px', background: msgLoading ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#3B82F6,#1D4ED8)', border: 'none', borderRadius: 10, color: msgLoading ? 'rgba(238,238,245,0.3)' : '#fff', cursor: msgLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14 }}>
 {msgLoading ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
 </button>
 </Modal>
 )}

 {}
 {showLeaveModal && (
 <Modal title="طلب إجازة للطالب" onClose={() => setShowLeaveModal(false)}>
 {selectedChild && (
 <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'rgba(238,238,245,0.6)' }}>
 الطالب: <strong style={{ color: '#EEEEF5' }}>{selectedChild.name}</strong>
 </div>
 )}
 <div style={FW}><label style={LBL}>سبب الغياب <span style={{color:'#EF4444'}}>*</span></label>
 <input value={leaveForm.reason} onChange={e => setLeaveForm(f => ({...f, reason: e.target.value}))} placeholder="مثال: مرض، ظروف عائلية..." style={INP} />
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
 <div><label style={LBL}>من تاريخ <span style={{color:'#EF4444'}}>*</span></label>
 <input value={leaveForm.from_date} onChange={e => setLeaveForm(f => ({...f, from_date: e.target.value}))} type="date" style={INP} />
 </div>
 <div><label style={LBL}>إلى تاريخ</label>
 <input value={leaveForm.to_date} onChange={e => setLeaveForm(f => ({...f, to_date: e.target.value}))} type="date" style={INP} />
 </div>
 </div>
 <ErrBox msg={leaveErr} /><OkBox msg={leaveOk} />
 <button onClick={handleLeaveRequest} disabled={leaveLoading} style={{ width: '100%', padding: '11px', background: leaveLoading ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg,${G},#A07830)`, border: 'none', borderRadius: 10, color: leaveLoading ? 'rgba(238,238,245,0.3)' : '#000', cursor: leaveLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14 }}>
 {leaveLoading ? 'جارٍ الإرسال...' : 'إرسال طلب الإجازة'}
 </button>
 </Modal>
 )}

 </div>
 );
}
