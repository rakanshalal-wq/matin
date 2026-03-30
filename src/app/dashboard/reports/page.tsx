'use client';
export const dynamic = 'force-dynamic';
import { BarChart3, BookOpen, CheckCircle, Clock, Coins, Download, File, FileText, GraduationCap, Hand, Key, School, Search, TrendingUp, User } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function ReportsPage() {
 const [activeReport, setActiveReport] = useState('school_overview');
 const [data, setData] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [user, setUser] = useState<any>(null);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [saving, setSaving] = useState(false);
 const [dateFrom, setDateFrom] = useState('');
 const [dateTo, setDateTo] = useState('');
 const [exportMsg, setExportMsg] = useState('');
 const [showModal, setShowModal] = useState(false);

 useEffect(() => {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 setUser(u);
 fetchReport('school_overview');
 }, []);

 const handleExport = async (format: 'csv' | 'pdf') => {
 setSaving(true); setErrMsg(''); setExportMsg('');
 try {
 const params = new URLSearchParams({ type: activeReport, format, ...(dateFrom && { from: dateFrom }), ...(dateTo && { to: dateTo }) });
 const res = await fetch(`/api/reports/export?${params}`, { method: 'POST', headers: getHeaders() });
 if (res.ok) {
 const blob = await res.blob();
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a'); a.href = url; a.download = `report_${activeReport}.${format}`; a.click();
 URL.revokeObjectURL(url);
 setExportMsg('<CheckCircle size={18} color="#10B981" /> تم تصدير التقرير');
 } else {
 const d = await res.json();
 setErrMsg(d.error || 'فشل التصدير');
 }
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ في التصدير'); } finally { setSaving(false); }
 };
 const handleSaveReportConfig = async () => {
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? '/api/reports?id=' + editItem.id : '/api/reports';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify({ type: activeReport, dateFrom, dateTo }) });
 if (res.ok) { setShowModal(false); setEditItem(null); setExportMsg('تم حفظ إعدادات التقرير'); }
 else { const d = await res.json(); setErrMsg(d.error || 'فشل الحفظ'); }
 } catch (e) { setErrMsg('حدث خطأ'); } finally { setSaving(false); }
 };
 const handleFilteredFetch = () => {
 const params = new URLSearchParams({ type: activeReport, ...(dateFrom && { from: dateFrom }), ...(dateTo && { to: dateTo }) });
 setLoading(true);
 setActiveReport(activeReport);
 fetch(`/api/reports?${params}`, { headers: getHeaders() })
 .then(r => r.json())
 .then(d => setData(d))
 .catch(e => setErrMsg(e.message || 'حدث خطأ'))
 .finally(() => setLoading(false));
 };
 const fetchReport = async (type: string) => {
 setLoading(true);
 setActiveReport(type);
 try {
 const res = await fetch(`/api/reports?type=${type}`, { headers: getHeaders() });
 const result = await res.json();
 setData(result);
 } catch (e) { console.error(e); } finally { setLoading(false); }
 };

 const reportTypes = [
 { id: 'school_overview', label: 'BarChart3 نظرة عامة', desc: 'إحصائيات شاملة للمدرسة' },
 { id: 'student_performance', label: 'GraduationCap أداء الطلاب', desc: 'متوسط الدرجات والأداء الأكاديمي' },
 { id: 'attendance_report', label: 'Hand تقرير الحضور', desc: 'إحصائيات الحضور والغياب' },
 { id: 'financial_report', label: 'Coins التقرير المالي', desc: 'الإيرادات والمدفوعات' },
 ];

 const renderOverview = () => {
 if (!data || typeof data !== 'object') return null;
 return (
 <div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'الطلاب', value: data.students || 0, icon: "ICON_GraduationCap", color: '#3B82F6' },
 { label: 'المعلمين', value: data.teachers || 0, icon: '<User size={16} />School', color: '#10B981' },
 { label: 'الفصول', value: data.classes || 0, icon: "ICON_School", color: 'var(--gold)' },
 { label: 'الاختبارات', value: data.exams || 0, icon: "ICON_FileText", color: '#8B5CF6' },
 { label: 'المحاضرات', value: data.lectures || 0, icon: "ICON_BookOpen", color: '#F59E0B' },
 ].map((s, i) => (
 <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
 <div style={{ fontSize: 32, marginBottom: 8 }}><IconRenderer name={s.icon} /></div>
 <div style={{ color: s.color, fontSize: 28, fontWeight: 800 }}>{(s.value || 0).toLocaleString()}</div>
 <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>{s.label}</div>
 </div>
 ))}
 </div>
 {data.attendance && data.attendance.length > 0 && (
 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
 <h3 style={{ color: 'var(--gold)', fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}><Hand size={18} color="#6B7280" /> إحصائيات الحضور</h3>
 <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
 {data.attendance.map((a: any, i: number) => {
 const isPresent = a.status === 'PRESENT' || a.status === 'present';
 const isAbsent = a.status === 'ABSENT' || a.status === 'absent';
 const color = isPresent ? '#10B981' : isAbsent ? '#EF4444' : '#F59E0B';
 const bg = isPresent ? 'rgba(16,185,129,0.1)' : isAbsent ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)';
 const label = isPresent ? 'حاضر' : isAbsent ? 'غائب' : a.status === 'LATE' ? 'متأخر' : a.status;
 return (
 <div key={i} style={{ padding: '12px 20px', borderRadius: 10, background: bg, border: `1px solid ${color}30`, textAlign: 'center' }}>
 <div style={{ color, fontSize: 24, fontWeight: 800 }}>{a.count}</div>
 <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>{label}</div>
 </div>
 );
 })}
 </div>
 </div>
 )}
 </div>
 );
 };

 const renderStudentPerformance = () => {
 if (!data || !Array.isArray(data)) return <div style={{ color: '#9CA3AF', textAlign: 'center', padding: 40 }}>لا توجد بيانات أداء</div>;
 return (
 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.08)' }}>
 <th style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--gold)', fontWeight: 700 }}>الطالب</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>متوسط الدرجات</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>الاختبارات</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>أعلى درجة</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>أدنى درجة</th>
 </tr>
 </thead>
 <tbody>
 {data.slice(0, 50).map((s: any) => {
 const avg = parseFloat(s.avg_percentage || 0);
 const color = avg >= 90 ? '#10B981' : avg >= 70 ? '#3B82F6' : avg >= 50 ? '#F59E0B' : '#EF4444';
 return (
 <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: '12px 16px', color: 'white', fontSize: 14, fontWeight: 600 }}>{s.student_name || '-'}</td>
 <td style={{ padding: '12px 16px', textAlign: 'center' }}>
 <span style={{ color, fontWeight: 700, fontSize: 16 }}>{avg ? `${avg}%` : '-'}</span>
 </td>
 <td style={{ padding: '12px 16px', textAlign: 'center', color: '#9CA3AF' }}>{s.exams_taken || 0}</td>
 <td style={{ padding: '12px 16px', textAlign: 'center', color: '#10B981', fontWeight: 600 }}>{s.highest_grade || '-'}</td>
 <td style={{ padding: '12px 16px', textAlign: 'center', color: '#EF4444', fontWeight: 600 }}>{s.lowest_grade || '-'}</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 );
 };

 const renderAttendanceReport = () => {
 if (!data || !Array.isArray(data)) return <div style={{ color: '#9CA3AF', textAlign: 'center', padding: 40 }}>لا توجد بيانات حضور</div>;
 return (
 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.08)' }}>
 <th style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--gold)', fontWeight: 700 }}>الطالب</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>أيام الحضور</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>أيام الغياب</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>التأخر</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>الإجمالي</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>نسبة الحضور</th>
 </tr>
 </thead>
 <tbody>
 {data.slice(0, 50).map((s: any) => {
 const total = parseInt(s.total_days || 0);
 const present = parseInt(s.present_days || 0);
 const pct = total > 0 ? Math.round((present / total) * 100) : 0;
 const color = pct >= 90 ? '#10B981' : pct >= 75 ? '#F59E0B' : '#EF4444';
 return (
 <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: '12px 16px', color: 'white', fontSize: 14, fontWeight: 600 }}>{s.student_name || '-'}</td>
 <td style={{ padding: '12px 16px', textAlign: 'center', color: '#10B981', fontWeight: 600 }}>{s.present_days || 0}</td>
 <td style={{ padding: '12px 16px', textAlign: 'center', color: '#EF4444', fontWeight: 600 }}>{s.absent_days || 0}</td>
 <td style={{ padding: '12px 16px', textAlign: 'center', color: '#F59E0B' }}>{s.late_days || 0}</td>
 <td style={{ padding: '12px 16px', textAlign: 'center', color: '#9CA3AF' }}>{total}</td>
 <td style={{ padding: '12px 16px', textAlign: 'center' }}>
 <span style={{ color, fontWeight: 700 }}>{pct}%</span>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 );
 };

 const renderFinancial = () => {
 if (!data || typeof data !== 'object') return <div style={{ color: '#9CA3AF', textAlign: 'center', padding: 40 }}>لا توجد بيانات مالية</div>;
 return (
 <div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الإيرادات', value: `${(data.total_revenue || 0).toLocaleString()} ر.س`, icon: "ICON_Coins", color: '#10B981' },
 { label: 'المدفوعات المكتملة', value: data.paid_count || 0, icon: "ICON_CheckCircle", color: '#3B82F6' },
 { label: 'المدفوعات المعلقة', value: data.pending_count || 0, icon: '⏳', color: '#F59E0B' },
 { label: 'المشتركون النشطون', value: data.active_subscriptions || 0, icon: "ICON_Key", color: '#8B5CF6' },
 ].map((s, i) => (
 <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
 <div style={{ fontSize: 32, marginBottom: 8 }}><IconRenderer name={s.icon} /></div>
 <div style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.value}</div>
 <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>{s.label}</div>
 </div>
 ))}
 </div>
 {data.recent_payments && data.recent_payments.length > 0 && (
 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
 <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <h3 style={{ color: 'var(--gold)', fontSize: 16, fontWeight: 700, margin: 0 }}><Clock size={18} color="#F59E0B" /> آخر المدفوعات</h3>
 </div>
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.05)' }}>
 <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--gold)', fontWeight: 700, fontSize: 13 }}>المستخدم</th>
 <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700, fontSize: 13 }}>المبلغ</th>
 <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700, fontSize: 13 }}>الحالة</th>
 <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700, fontSize: 13 }}>التاريخ</th>
 </tr>
 </thead>
 <tbody>
 {data.recent_payments.map((p: any) => (
 <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
 <td style={{ padding: '10px 16px', color: 'white', fontSize: 13 }}>{p.user_name || `مستخدم #${p.user_id}`}</td>
 <td style={{ padding: '10px 16px', textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>{parseFloat(p.amount || 0).toLocaleString()} ر.س</td>
 <td style={{ padding: '10px 16px', textAlign: 'center' }}>
 <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: p.status === 'paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: p.status === 'paid' ? '#10B981' : '#F59E0B' }}>
 {p.status === 'paid' ? 'CheckCircle مدفوع' : '⏳ معلق'}
 </span>
 </td>
 <td style={{ padding: '10px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>{p.created_at ? new Date(p.created_at).toLocaleDateString('ar-SA') : '-'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 );
 };

 return (
 <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'var(--font)' }}>
 <div style={{ marginBottom: 24 }}>
 <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gold)', margin: 0 }}><IconRenderer name="ICON_TrendingUp" size={18} /> التقارير والإحصائيات</h1>
 <p style={{ color: '#9CA3AF', fontSize: 14, margin: '6px 0 0' }}>تقارير شاملة من بيانات المنصة الحقيقية</p>
 </div>

 {/* فلتر التاريخ والتصدير */}
 <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
 <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
 <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>من:</label>
 <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
 </div>
 <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
 <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>إلى:</label>
 <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
 </div>
 <button onClick={handleFilteredFetch} style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><IconRenderer name="ICON_Search" size={18} /> تصفية</button>
 <button onClick={() => handleExport('csv')} disabled={saving} style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '8px 16px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: saving ? 0.7 : 1 }}><IconRenderer name="ICON_Download" size={18} /> CSV</button>
 <button onClick={() => handleExport('pdf')} disabled={saving} style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '8px 16px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: saving ? 0.7 : 1 }}><IconRenderer name="ICON_File" size={18} /> PDF</button>
 {exportMsg && <span style={{ color: '#10B981', fontSize: 13 }}>{exportMsg}</span>}
 {errMsg && <span style={{ color: '#EF4444', fontSize: 13 }}>{errMsg}</span>}
 </div>
 {/* أنواع التقارير */}
 <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
 {reportTypes.map(rt => (
 <button key={rt.id} onClick={() => fetchReport(rt.id)} style={{
 padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
 background: activeReport === rt.id ? 'linear-gradient(135deg, #D4A843, #E8C547)' : 'rgba(255,255,255,0.05)',
 color: activeReport === rt.id ? 'var(--bg)' : 'rgba(255,255,255,0.7)',
 fontFamily: 'var(--font)',
 transition: 'all 0.2s',
 }}>{rt.label}</button>
 ))}
 </div>

 {/* المحتوى */}
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center', color: 'var(--gold)', fontSize: 18 }}>⏳ جاري تحميل التقرير...</div>
 ) : (
 <div>
 {activeReport === 'school_overview' && renderOverview()}
 {activeReport === 'student_performance' && renderStudentPerformance()}
 {activeReport === 'attendance_report' && renderAttendanceReport()}
 {activeReport === 'financial_report' && renderFinancial()}
 </div>
 )}
 </div>
 );
}
