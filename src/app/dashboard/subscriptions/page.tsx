'use client';
import {, CheckCircle, ClipboardList, Diamond, GraduationCap, Mailbox, Package, School, Trophy, User, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

const plans = [
 { id: 'basic', name: 'أساسي', price: 0, period: 'مجاني', color: '#6B7280', icon: '', students: 50, teachers: 5, schools: 1, features: ['مدرسة واحدة', '5 معلمين', '50 طالب', 'الحضور والغياب', 'الدرجات الأساسية'] },
 { id: 'advanced', name: 'متقدم', price: 299, period: 'شهرياً', color: '#3B82F6', icon: '', students: 500, teachers: 20, schools: 5, features: ['5 مدارس', '20 معلم', '500 طالب', 'بنك أسئلة AI', 'مراقبة اختبارات', 'التقارير المتقدمة', 'الدعم الفني'] },
 { id: 'enterprise', name: 'مؤسسي', price: 599, period: 'شهرياً', color: '#C9A227', icon: "ICON_Trophy", students: -1, teachers: -1, schools: -1, features: ['مدارس غير محدودة', 'معلمين غير محدود', 'طلاب غير محدود', 'كل الميزات', 'دعم 24/7', 'مدير حساب خاص', 'API مخصص'] },
];

export default function SubscriptionsPage() {
 const [activeTab, setActiveTab] = useState('plans');
 const [subscriptions, setSubscriptions] = useState<any[]>([]);
 const [mySubscription, setMySubscription] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [upgrading, setUpgrading] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [msg, setMsg] = useState('');
 const [msgType, setMsgType] = useState<'success' | 'error'>('success');
 const [user, setUser] = useState<any>(null);

 useEffect(() => {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 setUser(u);
 fetchData(u);
 }, []);

 const fetchData = async (u: any) => {
 try {
 const [subRes, mySubRes] = await Promise.all([
 fetch('/api/finance?type=my_payments', { headers: getHeaders() }),
 fetch('/api/finance?type=my_subscription', { headers: getHeaders() }),
 ]);
 const [subData, mySubData] = await Promise.all([subRes.json(), mySubRes.json()]);
 setSubscriptions(Array.isArray(subData) ? subData : []);
 setMySubscription(mySubData);
 } catch (e) { console.error(e); } finally { setLoading(false); }
 };

 const handleUpgrade = async (planId: string) => {
 if (planId === (mySubscription?.package || user?.package)) return;
 setUpgrading(planId); setMsg('');
 try {
 const res = await fetch('/api/finance', {
 method: editItem ? 'PUT' : 'POST',
 headers: getHeaders(),
 body: JSON.stringify({ action: 'upgrade', package: planId })
 });
 const data = await res.json();
 if (res.ok) {
 setMsg(`<CheckCircle size={18} color="#10B981" /> تم الترقية إلى باقة "${plans.find(p => p.id === planId)?.name}" بنجاح`);
 setMsgType('success');
 fetchData(user);
 } else {
 setMsg(`<XCircle size={18} color="#EF4444" /> ${data.error || 'فشل الترقية'}`);
 setMsgType('error');
 }
 } catch { setMsg('XCircle خطأ في الاتصال'); setMsgType('error'); } finally {
 setUpgrading('');
 setTimeout(() => setMsg(''), 4000);
 }
 };

 const currentPlan = mySubscription?.package || user?.package || 'basic';
 const currentPlanData = plans.find(p => p.id === currentPlan);

 if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A227', fontSize: 18 }}>⏳ جاري التحميل...</div>;

 return (
 <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
 <div>
 <h1 style={{ fontSize: 26, fontWeight: 800, color: '#C9A227', margin: 0 }}><IconRenderer name="ICON_Diamond" size={18} /> الباقات والاشتراكات</h1>
 <p style={{ color: '#9CA3AF', marginTop: 6, fontSize: 14 }}>
 باقتك الحالية: <span style={{ color: currentPlanData?.color || '#C9A227', fontWeight: 700 }}>{currentPlanData?.name || 'أساسي'}</span>
 </p>
 </div>
 </div>

 {/* رسالة */}
 {msg && (
 <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 600, background: msgType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msgType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msgType === 'success' ? '#10B981' : '#EF4444' }}>{msg}</div>
 )}

 {/* Tabs */}
 <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
 {[
 { id: 'plans', label: '<Package size={18} color="#6B7280" /> الباقات المتاحة' },
 { id: 'history', label: `ClipboardList سجل المدفوعات (${subscriptions.length})` },
 ].map(tab => (
 <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
 padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
 background: activeTab === tab.id ? 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)' : 'rgba(255,255,255,0.05)',
 color: activeTab === tab.id ? '#06060E' : 'rgba(255,255,255,0.7)',
 fontFamily: 'IBM Plex Sans Arabic, sans-serif',
 }}>{tab.label}</button>
 ))}
 </div>

 {/* الباقات */}
 {activeTab === 'plans' && (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
 {plans.map(plan => {
 const isCurrent = plan.id === currentPlan;
 return (
 <div key={plan.id} style={{
 background: isCurrent ? `rgba(${plan.color === '#C9A227' ? '201,162,39' : plan.color === '#3B82F6' ? '59,130,246' : '107,114,128'},0.08)` : 'rgba(255,255,255,0.03)',
 border: `2px solid ${isCurrent ? plan.color : 'rgba(255,255,255,0.08)'}`,
 borderRadius: 16, padding: 24, position: 'relative',
 }}>
 {isCurrent && (
 <div style={{ position: 'absolute', top: -12, right: 20, background: plan.color, color: plan.id === 'basic' ? 'white' : '#06060E', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}> باقتك الحالية
 </div>
 )}
 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
 <span style={{ fontSize: 32 }}><IconRenderer name={plan.icon} /></span>
 <div>
 <h3 style={{ color: plan.color, fontSize: 20, fontWeight: 800, margin: 0 }}>{plan.name}</h3>
 <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{plan.period}</div>
 </div>
 </div>
 <div style={{ marginBottom: 20 }}>
 <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>{plan.price === 0 ? 'مجاني' : `${plan.price}`}</span>
 {plan.price > 0 && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}> ر.س/شهر</span>}
 </div>
 <div style={{ marginBottom: 20 }}>
 <div style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 8 }}>الحدود:</div>
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
 <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
 School {plan.schools === -1 ? 'غير محدود' : plan.schools} مدرسة
 </span>
 <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
 <User size={16} /><IconRenderer name="ICON_School" size={18} /> {plan.teachers === -1 ? 'غير محدود' : plan.teachers} معلم
 </span>
 <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
 GraduationCap {plan.students === -1 ? 'غير محدود' : plan.students} طالب
 </span>
 </div>
 </div>
 <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
 {plan.features.map((f, i) => (
 <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
 <span style={{ color: plan.color }}></span> {f}
 </li>
 ))}
 </ul>
 <button
 onClick={() => !isCurrent && handleUpgrade(plan.id)}
 disabled={isCurrent || upgrading === plan.id}
 style={{
 width: '100%', padding: '12px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 14, cursor: isCurrent ? 'default' : 'pointer',
 background: isCurrent ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`,
 color: isCurrent ? 'rgba(255,255,255,0.4)' : plan.id === 'basic' ? 'white' : '#06060E',
 opacity: upgrading === plan.id ? 0.7 : 1,
 fontFamily: 'IBM Plex Sans Arabic, sans-serif',
 }}
 >
 {isCurrent ? ' باقتك الحالية' : upgrading === plan.id ? '⏳ جاري الترقية...' : plan.price === 0 ? 'اختر هذه الباقة' : `ترقية إلى ${plan.name}`}
 </button>
 </div>
 );
 })}
 </div>
 )}

 {/* سجل المدفوعات */}
 {activeTab === 'history' && (
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
 {subscriptions.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Mail size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>لا توجد مدفوعات بعد</p>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.08)' }}>
 <th style={{ padding: '14px 16px', textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>الباقة</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>المبلغ</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الحالة</th>
 <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>التاريخ</th>
 </tr>
 </thead>
 <tbody>
 {subscriptions.map((s: any) => (
 <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: '12px 16px', color: 'white', fontSize: 14 }}>{s.package || s.description || 'اشتراك'}</td>
 <td style={{ padding: '12px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700, fontSize: 14 }}>{s.amount} ر.س</td>
 <td style={{ padding: '12px 16px', textAlign: 'center' }}>
 <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.status === 'paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: s.status === 'paid' ? '#10B981' : '#F59E0B' }}>
 {s.status === 'paid' ? 'Check مدفوع' : '⏳ معلق'}
 </span>
 </td>
 <td style={{ padding: '12px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
 {s.created_at ? new Date(s.created_at).toLocaleDateString('ar-SA') : '-'}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>
 )}
 </div>
 );
}
