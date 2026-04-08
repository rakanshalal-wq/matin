'use client';
export const dynamic = "force-dynamic";
import { Building, Check, Crown, Gift, PartyPopper, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';


interface Plan {
 id: string;
 name: string;
 name_ar: string;
 price: number;
 priceYearly: number;
 color: string;
 icon: string;
 maxStudents: number;
 maxTeachers: number;
 popular?: boolean;
 features: string[];
 notIncluded: string[];
}

const defaultPlans: Plan[] = [
 {
 id: 'free', name: 'Free', name_ar: 'مجانية', price: 0, priceYearly: 0,
 color: '#6B7280', icon: "ICON_Gift", maxStudents: 30, maxTeachers: 5,
 features: ['إدارة الطلاب والمعلمين', 'الحضور والغياب', 'الدرجات', 'الرسائل', 'الجدول الدراسي', 'الواجبات'],
 notIncluded: ['الاختبارات الذكية', 'المكتبة الرقمية', 'المتجر', 'الذكاء الاصطناعي', 'النقل', 'الكافتيريا']
 },
 {
 id: 'basic', name: 'Basic', name_ar: 'أساسية', price: 99, priceYearly: 990,
 color: '#3B82F6', icon: '', maxStudents: 100, maxTeachers: 15,
 features: ['كل ميزات المجانية', 'الاختبارات الذكية', 'بنك الأسئلة', 'المكتبة الرقمية', 'التقارير المتقدمة', 'الإعلانات'],
 notIncluded: ['المتجر', 'الذكاء الاصطناعي', 'النقل', 'الكافتيريا', 'التصدير']
 },
 {
 id: 'pro', name: 'Pro', name_ar: 'احترافية', price: 299, priceYearly: 2990,
 color: '#C9A227', icon: "ICON_Crown", maxStudents: 500, maxTeachers: 50, popular: true,
 features: ['كل ميزات الأساسية', 'المتجر الإلكتروني', 'الذكاء الاصطناعي', 'تصدير البيانات', 'المجتمع والتواصل', 'إدارة الموظفين والرواتب', 'نظام الإجازات'],
 notIncluded: ['النقل والباصات', 'الكافتيريا', 'العيادة الصحية', 'API للمؤسسات']
 },
 {
 id: 'enterprise', name: 'Enterprise', name_ar: 'مؤسسية', price: 999, priceYearly: 9990,
 color: '#8B5CF6', icon: "ICON_Building", maxStudents: -1, maxTeachers: -1,
 features: ['كل ميزات الاحترافية', 'النقل والباصات + GPS', 'الكافتيريا', 'العيادة الصحية', 'التطعيمات', 'تطبيق السائق', 'API للمؤسسات', 'العلامة البيضاء', 'دعم فني أولوية'],
 notIncluded: []
 }
];

export default function SubscribePage() {
 const [user, setUser] = useState<any>(null);
 const [currentPlan, setCurrentPlan] = useState('free');
 const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
 const [loading, setLoading] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [selectedPlan, setSelectedPlan] = useState<any>(null);
 const [saving, setSaving] = useState(false);
 const [reason, setReason] = useState('');
 const [requiredFeature, setRequiredFeature] = useState('');
 const [requiredPlan, setRequiredPlan] = useState('');
 const [serverPlans, setServerPlans] = useState<any[]>([]);

 useEffect(() => {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 setUser(u);
 setCurrentPlan(u.package || 'free');
 
 const params = new URLSearchParams(window.location.search);
 setReason(params.get('reason') || '');
 setRequiredFeature(params.get('feature') || '');
 setRequiredPlan(params.get('required_plan') || '');
 
 fetchPlans();
 }, []);

 const fetchPlans = async () => {
 try {
 const res = await fetch('/api/plans', { headers: getHeaders() });
 const data = await res.json();
 if (Array.isArray(data) && data.length > 0) setServerPlans(data);
 } catch {}
 };

 const handleSubscribe = async (planId: string) => {
 if (planId === currentPlan) return;
 setLoading(true);
 try {
 const res = await fetch('/api/plans', {
 method: editItem ? 'PUT' : 'POST',
 headers: getHeaders(),
 body: JSON.stringify({ plan_id: planId, billing_cycle: billing })
 });
 const data = await res.json();
 if (res.ok) {
 document.cookie = `matin_package=${planId}; path=/; max-age=31536000`;
 const expiryDate = new Date();
 expiryDate.setFullYear(expiryDate.getFullYear() + 1);
 document.cookie = `matin_sub_expiry=${expiryDate.toISOString()}; path=/; max-age=31536000`;
 const updatedUser = { ...user, package: planId };
 localStorage.setItem('matin_user', JSON.stringify(updatedUser));
 setCurrentPlan(planId);
 alert('تم الاشتراك بنجاح! [PartyPopper]');
 if (requiredFeature && requiredFeature.startsWith('/')) {
 window.location.href = requiredFeature;
 }
 } else {
 alert(data.error || 'فشل في الاشتراك');
 }
 } catch (e: any) { setErrMsg ? setErrMsg(e.message || 'حدث خطأ') : null; } finally { setLoading(false); }
 };

 const featureLabels: Record<string, string> = {
 'ai-chat': 'الذكاء الاصطناعي', 'export': 'تصدير البيانات', 'community': 'المجتمع',
 'social': 'التواصل الاجتماعي', 'store': 'المتجر', 'transport': 'النقل والباصات',
 'cafeteria': 'الكافتيريا', 'health': 'الصحة', 'clinic': 'العيادة',
 'vaccinations': 'التطعيمات', 'driver-app': 'تطبيق السائق', 'payroll': 'الرواتب',
 'leaves': 'الإجازات', 'employees': 'الموظفين', 'integrations': 'التكاملات',
 };

 const plans = defaultPlans;
 const inputStyle = { fontFamily: 'IBM Plex Sans Arabic, sans-serif' };

 return (
 <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', maxWidth: 1200, margin: '0 auto' }}>
 {reason === 'expired' && (
 <div style={{ padding: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, marginBottom: 24, textAlign: 'center' }}>
 <h3 style={{ color: '#EF4444', margin: '0 0 8px', fontSize: 18 }}>انتهى اشتراكك</h3>
 <p style={{ color: '#F87171', margin: 0, fontSize: 14 }}>يرجى تجديد الاشتراك للاستمرار في استخدام المنصة</p>
 </div>
 )}
 
 {requiredFeature && !reason && (
 <div style={{ padding: 16, background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 12, marginBottom: 24, textAlign: 'center' }}>
 <h3 style={{ color: '#C9A227', margin: '0 0 8px', fontSize: 18 }}>ميزة غير متاحة في باقتك الحالية</h3>
 <p style={{ color: '#E8C547', margin: 0, fontSize: 14 }}>
 ميزة <strong>{featureLabels[requiredFeature] || requiredFeature}</strong> تحتاج ترقية إلى باقة <strong>{requiredPlan === 'basic' ? 'أساسية' : requiredPlan === 'pro' ? 'احترافية' : 'مؤسسية'}</strong> أو أعلى
 </p>
 </div>
 )}

 <div style={{ textAlign: 'center', marginBottom: 32 }}>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: '#C9A227', margin: '0 0 8px' }}>باقات متين</h1>
 <p style={{ color: '#9CA3AF', fontSize: 15, margin: '0 0 20px' }}>اختر الباقة المناسبة لمؤسستك التعليمية</p>
 
 <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 }}>
 <button onClick={() => setBilling('monthly')} style={{ ...inputStyle, padding: '8px 24px', borderRadius: 10, border: 'none', background: billing === 'monthly' ? '#C9A227' : 'transparent', color: billing === 'monthly' ? '#000' : '#9CA3AF', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>شهري</button>
 <button onClick={() => setBilling('yearly')} style={{ ...inputStyle, padding: '8px 24px', borderRadius: 10, border: 'none', background: billing === 'yearly' ? '#C9A227' : 'transparent', color: billing === 'yearly' ? '#000' : '#9CA3AF', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>سنوي <span style={{ fontSize: 11, color: billing === 'yearly' ? '#000' : '#10B981' }}>وفر 17%</span></button>
 </div>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
 {plans.map(plan => {
 const isCurrentPlan = plan.id === currentPlan;
 const isRecommended = plan.id === requiredPlan;
 const price = billing === 'monthly' ? plan.price : plan.priceYearly;
 
 return (
 <div key={plan.id} style={{
 background: isRecommended ? 'rgba(201,162,39,0.08)' : 'rgba(255,255,255,0.03)',
 border: `2px solid ${isRecommended ? '#C9A227' : isCurrentPlan ? plan.color : 'rgba(255,255,255,0.08)'}`,
 borderRadius: 16, padding: 24, position: 'relative',
 transform: plan.popular ? 'scale(1.02)' : 'none'
 }}>
 {plan.popular && (
 <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#C9A227', color: '#000', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>الأكثر شعبية</div>
 )}
 {isRecommended && !plan.popular && (
 <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#10B981', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>موصى به</div>
 )}
 
 <div style={{ textAlign: 'center', marginBottom: 20 }}>
 <div style={{ fontSize: 36, marginBottom: 8 }}><IconRenderer name={plan.icon} /></div>
 <h3 style={{ color: plan.color, fontSize: 20, fontWeight: 800, margin: '0 0 4px' }}>{plan.name_ar}</h3>
 <p style={{ color: '#6B7280', fontSize: 12, margin: 0 }}>{plan.name}</p>
 </div>
 
 <div style={{ textAlign: 'center', marginBottom: 20 }}>
 <span style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{price === 0 ? 'مجاناً' : price}</span>
 {price > 0 && <span style={{ color: '#9CA3AF', fontSize: 14 }}> ر.س/{billing === 'monthly' ? 'شهر' : 'سنة'}</span>}
 </div>
 
 <div style={{ marginBottom: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>
 <span>الطلاب</span>
 <span style={{ color: '#fff', fontWeight: 600 }}>{plan.maxStudents === -1 ? 'غير محدود' : plan.maxStudents}</span>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9CA3AF', marginBottom: 12 }}>
 <span>المعلمين</span>
 <span style={{ color: '#fff', fontWeight: 600 }}>{plan.maxTeachers === -1 ? 'غير محدود' : plan.maxTeachers}</span>
 </div>
 
 {plan.features.map((f, i) => (
 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#D1D5DB', marginBottom: 6 }}>
 <span style={{ color: '#10B981' }}>Check</span> {f}
 </div>
 ))}
 {plan.notIncluded.map((f, i) => (
 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4B5563', marginBottom: 6 }}>
 <span style={{ color: '#EF4444' }}></span> {f}
 </div>
 ))}
 </div>
 
 <button
 onClick={() => handleSubscribe(plan.id)}
 disabled={isCurrentPlan || loading}
 style={{
 ...inputStyle, width: '100%', padding: '12px', border: 'none', borderRadius: 10,
 background: isCurrentPlan ? '#374151' : `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`,
 color: isCurrentPlan ? '#9CA3AF' : '#fff',
 fontSize: 15, fontWeight: 700, cursor: isCurrentPlan ? 'default' : 'pointer',
 opacity: loading ? 0.5 : 1
 }}
 >
 {isCurrentPlan ? 'Check باقتك الحالية' : loading ? 'جاري المعالجة...' : 'اشترك الآن'}
 </button>
 </div>
 );
 })}
 </div>

 <div style={{ textAlign: 'center', marginTop: 32, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
 <p style={{ color: '#6B7280', fontSize: 13, margin: 0 }}>
 جميع الباقات تشمل فترة تجريبية مجانية 14 يوم — يمكنك الترقية أو التخفيض في أي وقت — الأسعار بالريال السعودي
 </p>
 </div>

 {/* أسئلة شائعة */}
 <div style={{ marginTop: 40, padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
 <h2 style={{ textAlign: 'center', color: '#C9A227', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>أسئلة شائعة عن الباقات</h2>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
 {[
 { q: 'هل يمكنني تغيير الباقة لاحقاً؟', a: 'نعم، يمكنك الترقية أو تخفيض الباقة في أي وقت. سيتم احتساب الفرق بشكل تناسبي.' },
 { q: 'هل هناك فترة تجريبية؟', a: 'نعم، جميع الباقات المدفوعة تأتي مع فترة تجريبية مجانية لمدة 14 يوم.' },
 { q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل بطاقات الائتمان (Visa, MasterCard)، مدى، Apple Pay، وSTC Pay.' },
 { q: 'هل البيانات آمنة؟', a: 'نعم، نستخدم تشفير AES-256 وجميع البيانات مخزنة في سيرفرات آمنة.' },
 ].map((faq, i) => (
 <div key={i} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
 <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 8px' }}>{faq.q}</h4>
 <p style={{ color: '#9CA3AF', fontSize: 13, margin: 0, lineHeight: 1.7 }}>{faq.a}</p>
 </div>
 ))}
 </div>
 </div>

 {showModal && selectedPlan && (
 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: '#0F0F1A', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440, direction: 'rtl' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, margin: 0 }}>تأكيد الاشتراك</h2>
 <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>×</button>
 </div>
 {errMsg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 13 }}>{errMsg}</div>}
 <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
 <div style={{ color: '#C9A227', fontSize: 22, fontWeight: 800 }}>{selectedPlan.name_ar}</div>
 <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginTop: 8 }}>{selectedPlan.price} ر.س / شهر</div>
 </div>
 <div style={{ display: 'flex', gap: 10 }}>
 <button onClick={() => handleSubscribe(selectedPlan?.id)} disabled={saving} style={{ flex: 1, background: saving ? 'rgba(201,162,39,0.5)' : 'linear-gradient(135deg,#C9A227,#E8C547)', border: 'none', borderRadius: 10, padding: '12px 0', color: '#06060E', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14 }}>{saving ? 'جاري...' : 'تأكيد الاشتراك'}</button>
 <button onClick={() => setShowModal(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
