'use client';
import { Building, CheckCircle, CreditCard, Crown, Lock, Mail, MessageCircle, Package, Save, Settings, Smartphone } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

 return { 'Content-Type': 'application/json' };
};

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 24, ...style }}>{children}</div>
);

const Toggle = ({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) => (
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <div>
 <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{label}</div>
 {desc && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>{desc}</div>}
 </div>
 <div onClick={() => onChange(!value)} style={{ width: 52, height: 28, borderRadius: 14, cursor: 'pointer', transition: 'all 0.3s', background: value ? '#10B981' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 3px' }}>
 <div style={{ width: 22, height: 22, borderRadius: 11, background: 'white', transition: 'all 0.3s', transform: value ? 'translateX(0px)' : 'translateX(24px)' }} />
 </div>
 </div>
);

const InputField = ({ label, value, onChange, type = 'text', desc, placeholder, dir }: { label: string; value: string; onChange: (v: string) => void; type?: string; desc?: string; placeholder?: string; dir?: string }) => (
 <div style={{ marginBottom: 16 }}>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
 {desc && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginBottom: 6 }}>{desc}</div>}
 <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} dir={dir || 'ltr'} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
 </div>
);

const SelectField = ({ label, value, onChange, options, desc }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; desc?: string }) => (
 <div style={{ marginBottom: 16 }}>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
 {desc && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginBottom: 6 }}>{desc}</div>}
 <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}>
 {options.map(o => <option key={o.value} value={o.value} style={{ background: '#06060E' }}>{o.label}</option>)}
 </select>
 </div>
);

const StatusBadge = ({ active }: { active: boolean }) => (
 <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: active ? '#10B98120' : '#EF444420', color: active ? '#10B981' : '#EF4444' }}>
 {active ? 'مفعّل' : 'معطّل'}
 </span>
);

export default function PlatformSettingsPage() {
 const [settings, setSettings] = useState<Record<string, string>>({});
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [showModal, setShowModal] = useState(false);
 const [errMsg, setErrMsg] = useState('');
 const [editItem, setEditItem] = useState<any>(null);
 const [saved, setSaved] = useState(false);
 const [activeTab, setActiveTab] = useState('general');

 useEffect(() => { fetchSettings(); }, []);

 const fetchSettings = async () => {
 try {
 const res = await fetch('/api/platform-settings', { headers: getHeaders(), credentials: 'include' });
 const data = await res.json();
 if (data.success) { 
 const map: Record<string, string> = {};
 for (const s of data.settings) { map[s.key] = s.value; }
 setSettings(map);
 }
 } catch (e) { console.error(e); }
 setLoading(false);
 };

 const updateSetting = (key: string, value: string) => {
 setSettings(prev => ({ ...prev, [key]: value }));
 setSaved(false);
 };

 const saveSettings = async () => {
 setSaving(true);
 try {
 const res = await fetch('/api/platform-settings', { method: 'PUT', headers: getHeaders(), credentials: 'include', body: JSON.stringify({ settings }) });
 const data = await res.json();
 if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
 else { alert(data.error || 'فشل الحفظ'); }
 } catch (e) { alert('خطأ في الاتصال'); }
 setSaving(false);
 };

 if (loading) return (
 <div style={{ minHeight: '100vh', background: '#06060E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <div style={{ color: '#C9A227', fontSize: 18 }}>جاري تحميل الإعدادات...</div>
 </div>
 );

 const tabs = [
 { id: 'general', label: 'عام', icon: '<Settings size={16} />' },
 { id: 'auth', label: 'المصادقة', icon: "ICON_Lock" },
 { id: 'email', label: 'البريد', icon: "ICON_Mail" },
 { id: 'sms', label: 'الرسائل', icon: "ICON_Smartphone" },
 { id: 'whatsapp', label: 'واتساب', icon: "ICON_MessageCircle" },
 { id: 'payment', label: 'الدفع', icon: "ICON_CreditCard" },
 { id: 'plans', label: 'الباقات', icon: "ICON_Package" },
 { id: 'limits', label: 'الحدود', icon: "ICON_Lock" },
 ];

 return (
 <div style={{ minHeight: '100vh', background: '#06060E', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
 <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
 <a href="/dashboard/super-admin" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 14 }}>← العودة للوحة التحكم</a>
 <h1 style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: 0 }}>إعدادات المنصة</h1>
 </div>
 <button onClick={saveSettings} disabled={saving} style={{ padding: '12px 32px', border: 'none', borderRadius: 10, cursor: saving ? 'wait' : 'pointer', fontWeight: 700, fontSize: 15, fontFamily: 'inherit', background: saved ? '#10B981' : 'linear-gradient(135deg, #C9A227, #D4B03D)', color: saved ? 'white' : '#06060E' }}>
 {saving ? 'جاري الحفظ...' : saved ? 'CheckCircle تم الحفظ' : 'Save حفظ التغييرات'}
 </button>
 </div>
 </div>
 <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', padding: 24, gap: 24 }}>
 <div style={{ width: 200, flexShrink: 0 }}>
 {tabs.map(tab => (
 <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: '100%', padding: '12px 16px', border: 'none', borderRadius: 10, cursor: 'pointer', marginBottom: 6, textAlign: 'right', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, background: activeTab === tab.id ? 'linear-gradient(135deg, #C9A227, #D4B03D)' : 'transparent', color: activeTab === tab.id ? '#06060E' : 'rgba(255,255,255,0.6)' }}>
 <span><IconRenderer name={tab.icon} /></span> {tab.label}
 </button>
 ))}
 <div style={{ marginTop: 24, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
 <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>حالة الخدمات</div>
 {[{ label: 'OTP', key: 'otp_enabled' }, { label: 'SMS', key: 'sms_enabled' }, { label: 'واتساب', key: 'whatsapp_enabled' }, { label: 'الدفع', key: 'payment_enabled' }].map(s => (
 <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
 <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{s.label}</span>
 <StatusBadge active={settings[s.key] === 'true'} />
 </div>
 ))}
 </div>
 </div>
 <div style={{ flex: 1 }}>
 {activeTab === 'general' && (
 <Card>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginTop: 0 }}>الإعدادات العامة</h2>
 <InputField label="اسم المنصة" value={settings.platform_name || ''} onChange={v => updateSetting('platform_name', v)} dir="rtl" />
 <Toggle label="وضع الصيانة" desc="يظهر للزوار صفحة صيانة" value={settings.maintenance_mode === 'true'} onChange={v => updateSetting('maintenance_mode', String(v))} />
 <Toggle label="السماح بالتسجيل" desc="السماح بإنشاء حسابات جديدة" value={settings.registration_enabled === 'true'} onChange={v => updateSetting('registration_enabled', String(v))} />
 </Card>
 )}
 {activeTab === 'auth' && (
 <Card>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginTop: 0 }}><IconRenderer name="ICON_Lock" size={18} /> إعدادات المصادقة</h2>
 <Toggle label="تفعيل OTP (رمز التحقق)" desc="إرسال رمز تحقق عند تسجيل الدخول" value={settings.otp_enabled === 'true'} onChange={v => updateSetting('otp_enabled', String(v))} />
 {settings.otp_enabled === 'true' && (
 <>
 <SelectField label="طريقة الإرسال" value={settings.otp_method || 'email'} onChange={v => updateSetting('otp_method', v)} options={[{ value: 'email', label: 'Mail بريد إلكتروني' }, { value: 'sms', label: 'Smartphone رسالة نصية' }, { value: 'whatsapp', label: 'MessageCircle واتساب' }]} />
 <InputField label="مدة صلاحية الرمز (دقائق)" value={settings.otp_expiry_minutes || '5'} onChange={v => updateSetting('otp_expiry_minutes', v)} type="number" />
 </>
 )}
 </Card>
 )}
 {activeTab === 'email' && (
 <Card>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginTop: 0 }}><IconRenderer name="ICON_Mail" size={18} /> إعدادات البريد الإلكتروني</h2>
 <SelectField label="مزود الخدمة" value={settings.email_provider || 'resend'} onChange={v => updateSetting('email_provider', v)} options={[{ value: 'resend', label: 'Resend' }, { value: 'sendgrid', label: 'SendGrid' }, { value: 'mailgun', label: 'Mailgun' }]} />
 <InputField label="مفتاح API" value={settings.email_api_key || ''} onChange={v => updateSetting('email_api_key', v)} type="password" placeholder="re_xxxxxxxxxxxxxxxx" />
 <InputField label="إيميل المرسل" value={settings.email_from || ''} onChange={v => updateSetting('email_from', v)} placeholder="noreply@matin.ink" />
 <InputField label="اسم المرسل" value={settings.email_from_name || ''} onChange={v => updateSetting('email_from_name', v)} dir="rtl" />
 </Card>
 )}
 {activeTab === 'sms' && (
 <Card>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginTop: 0 }}><IconRenderer name="ICON_Smartphone" size={18} /> إعدادات الرسائل النصية</h2>
 <Toggle label="تفعيل SMS" desc="إرسال رسائل نصية للمستخدمين" value={settings.sms_enabled === 'true'} onChange={v => updateSetting('sms_enabled', String(v))} />
 {settings.sms_enabled === 'true' && (
 <>
 <SelectField label="مزود الخدمة" value={settings.sms_provider || 'taqnyat'} onChange={v => updateSetting('sms_provider', v)} options={[{ value: 'taqnyat', label: 'تقنيات (Taqnyat)' }, { value: 'unifonic', label: 'Unifonic' }, { value: 'twilio', label: 'Twilio' }]} />
 <InputField label="مفتاح API" value={settings.sms_api_key || ''} onChange={v => updateSetting('sms_api_key', v)} type="password" />
 <InputField label="اسم المرسل" value={settings.sms_sender_name || ''} onChange={v => updateSetting('sms_sender_name', v)} placeholder="MATIN" />
 </>
 )}
 </Card>
 )}
 {activeTab === 'whatsapp' && (
 <Card>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginTop: 0 }}><IconRenderer name="ICON_MessageCircle" size={18} /> إعدادات واتساب</h2>
 <Toggle label="تفعيل واتساب" desc="إرسال إشعارات عبر واتساب" value={settings.whatsapp_enabled === 'true'} onChange={v => updateSetting('whatsapp_enabled', String(v))} />
 {settings.whatsapp_enabled === 'true' && (
 <>
 <InputField label="مفتاح API" value={settings.whatsapp_api_key || ''} onChange={v => updateSetting('whatsapp_api_key', v)} type="password" />
 <InputField label="رقم واتساب" value={settings.whatsapp_phone || ''} onChange={v => updateSetting('whatsapp_phone', v)} placeholder="+966xxxxxxxxx" />
 </>
 )}
 </Card>
 )}
 {activeTab === 'payment' && (
 <Card>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginTop: 0 }}><IconRenderer name="ICON_CreditCard" size={18} /> إعدادات بوابة الدفع</h2>
 <Toggle label="تفعيل بوابة الدفع" desc="استقبال مدفوعات إلكترونية" value={settings.payment_enabled === 'true'} onChange={v => updateSetting('payment_enabled', String(v))} />
 {settings.payment_enabled === 'true' && (
 <>
 <SelectField label="مزود الخدمة" value={settings.payment_provider || 'moyasar'} onChange={v => updateSetting('payment_provider', v)} options={[{ value: 'moyasar', label: 'ميسّر (Moyasar)' }, { value: 'tap', label: 'Tap Payments' }, { value: 'hyperpay', label: 'HyperPay' }]} />
 <SelectField label="وضع الدفع" value={settings.payment_mode || 'test'} onChange={v => updateSetting('payment_mode', v)} options={[{ value: 'test', label: 'تجريبي (Test)' }, { value: 'live', label: 'حقيقي (Live)' }]} />
 <InputField label="المفتاح السري (Secret Key)" value={settings.payment_api_key || ''} onChange={v => updateSetting('payment_api_key', v)} type="password" placeholder="sk_test_xxxx" />
 <InputField label="المفتاح العام (Publishable Key)" value={settings.payment_publishable_key || ''} onChange={v => updateSetting('payment_publishable_key', v)} type="password" placeholder="pk_test_xxxx" />
 </>
 )}
 </Card>
 )}
 {activeTab === 'plans' && (
 <Card>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginTop: 0 }}><IconRenderer name="ICON_Package" size={18} /> أسعار الباقات</h2>
 {['free', 'basic', 'pro', 'enterprise'].map(plan => {
 const names: Record<string, string> = { free: 'المجانية', basic: 'الأساسية', pro: 'الاحترافية', enterprise: 'المؤسسات' };
 const colors: Record<string, string> = { free: '#94A3B8', basic: '#3B82F6', pro: '#C9A227', enterprise: '#8B5CF6' };
 const icons: Record<string, string> = { free: '', basic: '', pro: "ICON_Crown", enterprise: "ICON_Building" };
 return (
 <div key={plan} style={{ padding: 20, marginBottom: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
 <span style={{ fontSize: 24 }}>{icons[plan]}</span>
 <span style={{ color: colors[plan], fontWeight: 800, fontSize: 18 }}>باقة {names[plan]}</span>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <InputField label="السعر الشهري (ريال)" value={settings['plan_' + plan + '_price_monthly'] || '0'} onChange={v => updateSetting('plan_' + plan + '_price_monthly', v)} type="number" />
 <InputField label="السعر السنوي (ريال)" value={settings['plan_' + plan + '_price_yearly'] || '0'} onChange={v => updateSetting('plan_' + plan + '_price_yearly', v)} type="number" />
 </div>
 </div>
 );
 })}
 </Card>
 )}
 {activeTab === 'limits' && (
 <Card>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginTop: 0 }}><IconRenderer name="ICON_Lock" size={18} /> حدود الباقات</h2>
 {['free', 'basic', 'pro', 'enterprise'].map(plan => {
 const names: Record<string, string> = { free: 'المجانية', basic: 'الأساسية', pro: 'الاحترافية', enterprise: 'المؤسسات' };
 return (
 <InputField key={plan} label={'حد الطلاب - باقة ' + names[plan]} value={settings['max_students_' + plan] || '0'} onChange={v => updateSetting('max_students_' + plan, v)} type="number" />
 );
 })}
 </Card>
 )}
 </div>
 </div>
 </div>
 );
}
