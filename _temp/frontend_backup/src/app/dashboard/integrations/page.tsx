"use client";
export const dynamic = "force-dynamic";
import { Bell, BookOpen, Bot, Building2, CheckCircle, ClipboardList, CreditCard, FlaskConical, GraduationCap, Hospital, Key, Link, Lock, Mail, MailOpen, Map, MessageCircle, Package, Pencil, Save, Shirt, ShoppingBag, Smartphone, Video, XCircle, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import IconRenderer from "@/components/IconRenderer";

type Integration = {
 key: string;
 name: string;
 category: string;
 icon: string;
 desc: string;
 fields: string[];
 testable: boolean;
 requiresLicense: boolean;
 licenseNote?: string;
};

const INTEGRATIONS: Integration[] = [
 // ===== دفع =====
 { key: "payment_gateway_1", name: "بوابة الدفع الرئيسية", category: "دفع", icon: "ICON_CreditCard", desc: "قبول مدى، فيزا، ماستركارد", fields: ["publishable_key","secret_key"], testable: true, requiresLicense: false },
 { key: "payment_gateway_2", name: "بوابة الدفع البديلة", category: "دفع", icon: "ICON_CreditCard", desc: "بوابة دفع احتياطية متكاملة", fields: ["api_key","entity_id"], testable: false, requiresLicense: false },
 { key: "payment_wallet", name: "المحفظة الإلكترونية", category: "دفع", icon: "ICON_Smartphone", desc: "الدفع عبر المحفظة الإلكترونية", fields: ["api_key","merchant_id"], testable: false, requiresLicense: false },
 { key: "payment_bnpl_1", name: "الدفع على أقساط", category: "دفع", icon: "<ShoppingBag size={16} />", desc: "اشتري الآن وادفع لاحقاً", fields: ["public_key","secret_key","merchant_code"], testable: false, requiresLicense: false },
 { key: "payment_bnpl_2", name: "التقسيط بدون فوائد", category: "دفع", icon: "<ShoppingBag size={16} />", desc: "تقسيط ميسّر بدون فوائد", fields: ["api_token"], testable: false, requiresLicense: false },
 // ===== رسائل =====
 { key: "taqnyat", name: "تقنيات SMS", category: "رسائل", icon: "ICON_MailOpen", desc: "رسائل SMS سعودية", fields: ["api_key","sender"], testable: false, requiresLicense: false },
 { key: "unifonic", name: "Unifonic", category: "رسائل", icon: "ICON_MailOpen", desc: "رسائل SMS عربية", fields: ["app_id","sender_id"], testable: false, requiresLicense: false },
 { key: "whatsapp", name: "واتساب Business", category: "رسائل", icon: "ICON_MessageCircle", desc: "إرسال رسائل واتساب تلقائية", fields: ["access_token","phone_number_id"], testable: true, requiresLicense: false },
 { key: "resend", name: "Resend Email", category: "رسائل", icon: "ICON_Mail", desc: "إرسال إيميلات احترافية", fields: ["api_key","from_email","from_name"], testable: true, requiresLicense: false },
 // ===== إشعارات =====
 { key: "firebase", name: "Firebase Push", category: "إشعارات", icon: "ICON_Bell", desc: "إشعارات الجوال", fields: ["server_key","project_id"], testable: true, requiresLicense: false },
 // ===== تعليم =====
 { key: "zoom", name: "Zoom", category: "تعليم", icon: "ICON_Video", desc: "اجتماعات ومحاضرات مباشرة", fields: ["api_key","api_secret"], testable: false, requiresLicense: false },
 { key: "googlemeet", name: "Google Meet", category: "تعليم", icon: "ICON_Video", desc: "اجتماعات مجانية", fields: ["client_id","client_secret"], testable: false, requiresLicense: false },
 { key: "moodle", name: "Moodle", category: "تعليم", icon: "ICON_BookOpen", desc: "نظام إدارة التعلم", fields: ["url","token"], testable: false, requiresLicense: false },
 // ===== شحن =====
 { key: "aramex", name: "أرامكس", category: "شحن", icon: "ICON_Package", desc: "شركة شحن أرامكس", fields: ["username","password","account_number","account_pin"], testable: false, requiresLicense: false },
 { key: "smsa", name: "SMSA", category: "شحن", icon: "ICON_Package", desc: "شركة شحن SMSA", fields: ["api_key","passkey","sender_city"], testable: false, requiresLicense: false },
 // ===== ذكاء اصطناعي =====
 { key: "openai", name: "OpenAI", category: "ذكاء اصطناعي", icon: "ICON_Bot", desc: "GPT-4 للمساعد الذكي", fields: ["api_key"], testable: false, requiresLicense: false },
 // ===== خرائط =====
 { key: "google_maps", name: "Google Maps", category: "خرائط", icon: "<Map size={16} />", desc: "خرائط وتتبع الباصات", fields: ["api_key"], testable: false, requiresLicense: false },
 // ===== حكومي — يحتاج ترخيص رسمي =====
 { key: "noor", name: "نور", category: "حكومي", icon: "<Building2 size={16} />", desc: "نظام نور للتعليم — ربط بيانات الطلاب والمعلمين", fields: ["api_key","school_code"], testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً رسمياً من وزارة التعليم" },
 { key: "nafath", name: "نفاذ", category: "حكومي", icon: "ICON_Lock", desc: "التحقق من الهوية الوطنية — تسجيل دخول آمن", fields: ["client_id","client_secret","service_id"], testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً عبر منصة اعتماد (وزارة الاتصالات)" },
 { key: "absher", name: "أبشر", category: "حكومي", icon: "<Building2 size={16} />", desc: "بوابة الخدمات الحكومية", fields: ["api_key"], testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً من وزارة الداخلية" },
 { key: "sehatey", name: "صحتي", category: "حكومي", icon: "ICON_Hospital", desc: "السجلات الصحية للطلاب", fields: ["api_key"], testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً من وزارة الصحة" },
 { key: "qiwa", name: "قوى", category: "حكومي", icon: "ICON_Shirt", desc: "إدارة العقود والرواتب", fields: ["api_key","establishment_id"], testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً من وزارة الموارد البشرية" },
 { key: "muqeem", name: "مقيم", category: "حكومي", icon: "<Building2 size={16} />", desc: "بيانات المقيمين", fields: ["api_key"], testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً من الجوازات" },
 { key: "faris", name: "فارس", category: "حكومي", icon: "ICON_GraduationCap", desc: "نظام شؤون المعلمين", fields: ["api_key","school_code"], testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً من وزارة التعليم" },
];

const FIELD_LABELS: Record<string, string> = {
 api_key: "مفتاح API", secret_key: "المفتاح السري", auth_token: "Auth Token",
 access_token: "Access Token", phone_number_id: "Phone Number ID",
 publishable_key: "Publishable Key", public_key: "Public Key",
 account_sid: "Account SID", phone_number: "رقم الهاتف", sender_id: "Sender ID",
 sender: "اسم المرسل", app_id: "App ID", phone_id: "Phone ID",
 server_key: "Server Key", project_id: "Project ID",
 api_secret: "API Secret", client_id: "Client ID", client_secret: "Client Secret",
 url: "رابط الخادم", token: "Token", school_code: "كود المدرسة",
 establishment_id: "رقم المنشأة", username: "اسم المستخدم", password: "كلمة المرور",
 account_number: "رقم الحساب", account_pin: "Account PIN", entity_id: "Entity ID",
 merchant_id: "Merchant ID", merchant_code: "Merchant Code", api_token: "API Token",
 service_id: "Service ID", passkey: "Pass Key", sender_city: "مدينة المرسل",
 from_email: "إيميل المرسل", from_name: "اسم المرسل",
};

const CATEGORIES = ["الكل", "دفع", "رسائل", "إشعارات", "تعليم", "حكومي", "شحن", "ذكاء اصطناعي", "خرائط"];

const CATEGORY_COLORS: Record<string, string> = {
 "دفع": "text-emerald-400 bg-emerald-400/10",
 "رسائل": "text-blue-400 bg-blue-400/10",
 "إشعارات": "text-yellow-400 bg-yellow-400/10",
 "تعليم": "text-purple-400 bg-purple-400/10",
 "حكومي": "text-orange-400 bg-orange-400/10",
 "شحن": "text-pink-400 bg-pink-400/10",
 "ذكاء اصطناعي": "text-cyan-400 bg-cyan-400/10",
 "خرائط": "text-teal-400 bg-teal-400/10",
};

export default function IntegrationsPage() {
 const [activeCategory, setActiveCategory] = useState("الكل");
 const [connected, setConnected] = useState<Record<string, boolean>>({});
 const [savedKeys, setSavedKeys] = useState<Record<string, Record<string, string>>>({});
 const [inputValues, setInputValues] = useState<Record<string, Record<string, string>>>({});
 const [editing, setEditing] = useState<string | null>(null);
 const [saving, setSaving] = useState<string | null>(null);
 const [showModal, setShowModal] = useState(false);
 const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState<Record<string, string>>({});
 const [loading, setLoading] = useState(true);
 const [disconnecting, setDisconnecting] = useState<string | null>(null);
 const [testing, setTesting] = useState<string | null>(null);
 const [testResult, setTestResult] = useState<Record<string, { success: boolean; message: string }>>({});

 const filtered = activeCategory === "الكل" ? INTEGRATIONS : INTEGRATIONS.filter(i => i.category === activeCategory);
 const normalIntegrations = filtered.filter(i => !i.requiresLicense);
 const govIntegrations = filtered.filter(i => i.requiresLicense);

 useEffect(() => {
 const fetchIntegrations = async () => {
 try {
 const token = localStorage.getItem("matin_token");
 const res = await fetch("/api/integrations", { headers: { Authorization: `Bearer ${token}` } });
 const data = await res.json();
 const rows = data.data || [];
 const connectedMap: Record<string, boolean> = {};
 const keysMap: Record<string, Record<string, string>> = {};
 rows.forEach((row: { key?: string; name?: string; is_active: boolean; extra_config?: unknown }) => {
 const k = row.key || row.name || "";
 connectedMap[k] = row.is_active;
 try {
 keysMap[k] = typeof row.extra_config === "string"
 ? JSON.parse(row.extra_config)
 : ((row.extra_config as Record<string, string>) || {});
 } catch { keysMap[k] = {}; }
 });
 setConnected(connectedMap);
 setSavedKeys(keysMap);
 } catch (e) { console.error(e); }
 finally { setLoading(false); }
 };
 fetchIntegrations();
 }, []);

 const handleSave = async (key: string) => {
 setSaving(key);
 try {
 const token = localStorage.getItem("matin_token");
 const config = inputValues[key] || {};
 const res = await fetch("/api/integrations", {
 method: connected[key] ? "PUT" : "POST",
 headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
 body: JSON.stringify({ key, name: key, config, is_active: true }),
 });
 const data = await res.json();
 if (data.success || res.ok) {
 setConnected(prev => ({ ...prev, [key]: true }));
 setSavedKeys(prev => ({ ...prev, [key]: config }));
 setEditing(null);
 setErrMsg(prev => ({ ...prev, [key]: '' }));
 } else {
 setErrMsg(prev => ({ ...prev, [key]: data.error || "فشل الحفظ" }));
 }
 } catch (e: any) { setErrMsg(prev => ({ ...prev, [key]: e.message || "حدث خطأ" })); }
 setSaving(null);
 };

 const handleDisconnect = async (key: string) => {
 if (!confirm(`هل تريد قطع الاتصال بـ ${INTEGRATIONS.find(i => i.key === key)?.name}؟`)) return;
 setDisconnecting(key);
 try {
 const token = localStorage.getItem("matin_token");
 await fetch("/api/integrations", {
 method: "POST",
 headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
 body: JSON.stringify({ key, name: key, config: {}, is_active: false }),
 });
 setConnected(prev => ({ ...prev, [key]: false }));
 setSavedKeys(prev => { const n = { ...prev }; delete n[key]; return n; });
 } catch (e) { console.error(e); }
 setDisconnecting(null);
 };

 const handleTest = async (key: string) => {
 setTesting(key);
 setTestResult(prev => ({ ...prev, [key]: { success: false, message: "جاري الاختبار..." } }));
 try {
 const token = localStorage.getItem("matin_token");
 const res = await fetch(`/api/integrations?id=${key}&action=test`, {
 method: "PUT",
 headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
 body: JSON.stringify({ action: "test" }),
 });
 const data = await res.json();
 setTestResult(prev => ({ ...prev, [key]: { success: data.success, message: data.message || (data.success ? "الاتصال يعمل" : "فشل الاتصال") } }));
 } catch (e: unknown) {
 const msg = e instanceof Error ? e.message : "خطأ غير معروف";
 setTestResult(prev => ({ ...prev, [key]: { success: false, message: msg } }));
 }
 setTesting(null);
 };

 const connectedCount = Object.values(connected).filter(Boolean).length;

 /* ---- بطاقة تكامل عادي ---- */
 const renderNormalCard = (integration: Integration) => {
 const isConnected = connected[integration.key];
 const isEditing = editing === integration.key;
 const isSaving = saving === integration.key;
 const isDisc = disconnecting === integration.key;
 const isTesting = testing === integration.key;
 const result = testResult[integration.key];
 const catColor = CATEGORY_COLORS[integration.category] || "text-gray-400 bg-gray-400/10";

 return (
 <div key={integration.key}
 className={`rounded-2xl border p-5 flex flex-col gap-3 transition-all ${isConnected ? "border-emerald-500/50 bg-emerald-500/5" : "border-[#2a3550] bg-[#1a2540] hover:border-yellow-400/30"}`}>
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-3">
 <span className="text-3xl"><IconRenderer name={integration.icon} /></span>
 <div>
 <h3 className="font-bold text-white text-base">{integration.name}</h3>
 <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>{integration.category}</span>
 </div>
 </div>
 <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${isConnected ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700/50 text-gray-400"}`}>
 <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`}></div>
 {isConnected ? "متصل" : "غير متصل"}
 </div>
 </div>
 <p className="text-sm text-gray-400 leading-relaxed">{integration.desc}</p>
 {result && (
 <div className={`text-xs px-3 py-2 rounded-lg ${result.success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
 {result.message}
 </div>
 )}
 {isEditing ? (
 <div className="space-y-2">
 {integration.fields.map(field => (
 <div key={field}>
 <label className="text-xs text-gray-400 mb-1 block">{FIELD_LABELS[field] || field}</label>
 <input
 type={["password","secret","token","key","pin"].some(k => field.includes(k)) ? "password" : "text"}
 placeholder={FIELD_LABELS[field] || field}
 value={inputValues[integration.key]?.[field] || ""}
 onChange={e => setInputValues(prev => ({ ...prev, [integration.key]: { ...(prev[integration.key] || {}), [field]: e.target.value } }))}
 className="w-full bg-[#0f1829] border border-[#2a3550] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
 />
 </div>
 ))}
 <div className="flex gap-2 pt-1">
 <button onClick={() => handleSave(integration.key)} disabled={isSaving}
 className="flex-1 bg-yellow-400 text-gray-900 py-2 rounded-lg text-sm font-bold hover:bg-yellow-300 disabled:opacity-50 transition-colors">
 {isSaving ? "جاري الحفظ..." : "حفظ وتفعيل"}
 </button>
 <button onClick={() => setEditing(null)}
 className="px-3 py-2 border border-[#2a3550] rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-400 transition-colors">
 إلغاء
 </button>
 </div>
 </div>
 ) : (
 <div className="flex gap-2 flex-wrap">
 <button
 onClick={() => { setInputValues(prev => ({ ...prev, [integration.key]: savedKeys[integration.key] || {} })); setEditing(integration.key); }}
 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isConnected ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30" : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"}`}>
 {isConnected ? "تعديل" : "ربط الآن"}
 </button>
 {isConnected && integration.testable && (
 <button onClick={() => handleTest(integration.key)} disabled={isTesting}
 className="px-3 py-2 border border-blue-500/30 rounded-lg text-sm text-blue-400 hover:bg-blue-500/10 transition-colors disabled:opacity-50">
 {isTesting ? "جاري الاختبار..." : "اختبار"}
 </button>
 )}
 {isConnected && (
 <button onClick={() => handleDisconnect(integration.key)} disabled={isDisc}
 className="px-3 py-2 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
 {isDisc ? "..." : "قطع"}
 </button>
 )}
 </div>
 )}
 </div>
 );
 };

 /* ---- بطاقة تكامل حكومي ---- */
 const renderGovCard = (integration: Integration) => {
 const isConnected = connected[integration.key];
 const isEditing = editing === integration.key;
 const isSaving = saving === integration.key;
 const isDisc = disconnecting === integration.key;
 const catColor = CATEGORY_COLORS[integration.category] || "text-gray-400 bg-gray-400/10";

 return (
 <div key={integration.key}
 className={`relative rounded-2xl border p-5 flex flex-col gap-3 transition-all ${isConnected ? "border-emerald-500/50 bg-emerald-500/5" : "border-orange-500/30 bg-orange-500/5"}`}>
 {/* شارة الترخيص */}
 {!isConnected && (
 <div className="absolute top-3 left-3">
 <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-medium">
 <Building2 size={16} /> يحتاج ترخيص
 </span>
 </div>
 )}
 <div className={`flex items-start gap-3 ${!isConnected ? "pt-5" : ""}`}>
 <span className="text-3xl"><IconRenderer name={integration.icon} /></span>
 <div className="flex-1">
 <div className="flex items-center justify-between gap-2">
 <h3 className="font-bold text-white text-base">{integration.name}</h3>
 {isConnected && (
 <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
 متصل
 </div>
 )}
 </div>
 <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>{integration.category}</span>
 </div>
 </div>
 <p className="text-sm text-gray-400 leading-relaxed">{integration.desc}</p>
 {!isConnected && (
 <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-xs text-orange-300 leading-relaxed">
 <span className="font-bold"><IconRenderer name="ICON_ClipboardList" size={18} /> متطلب الترخيص: </span>{integration.licenseNote}
 </div>
 )}
 {isEditing ? (
 <div className="space-y-2">
 {integration.fields.map(field => (
 <div key={field}>
 <label className="text-xs text-gray-400 mb-1 block">{FIELD_LABELS[field] || field}</label>
 <input
 type={["password","secret","token","key","pin"].some(k => field.includes(k)) ? "password" : "text"}
 placeholder={FIELD_LABELS[field] || field}
 value={inputValues[integration.key]?.[field] || ""}
 onChange={e => setInputValues(prev => ({ ...prev, [integration.key]: { ...(prev[integration.key] || {}), [field]: e.target.value } }))}
 className="w-full bg-[#0f1829] border border-orange-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-400 transition-colors"
 />
 </div>
 ))}
 <div className="flex gap-2 pt-1">
 <button onClick={() => handleSave(integration.key)} disabled={isSaving}
 className="flex-1 bg-orange-400 text-gray-900 py-2 rounded-lg text-sm font-bold hover:bg-orange-300 disabled:opacity-50 transition-colors">
 {isSaving ? "جاري الحفظ..." : isConnected ? "حفظ التعديلات" : "تفعيل بعد الترخيص"}
 </button>
 <button onClick={() => setEditing(null)}
 className="px-3 py-2 border border-[#2a3550] rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
 إلغاء
 </button>
 </div>
 </div>
 ) : (
 <div className="flex gap-2">
 <button
 onClick={() => { setInputValues(prev => ({ ...prev, [integration.key]: savedKeys[integration.key] || {} })); setEditing(integration.key); }}
 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border ${isConnected ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30" : "border-orange-500/40 text-orange-400 hover:bg-orange-500/10"}`}>
 {isConnected ? "تعديل" : "إدخال مفاتيح الترخيص"}
 </button>
 {isConnected && (
 <button onClick={() => handleDisconnect(integration.key)} disabled={isDisc}
 className="px-3 py-2 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
 {isDisc ? "..." : "قطع"}
 </button>
 )}
 </div>
 )}
 </div>
 );
 };

 return (
 <div className="min-h-screen p-6" dir="rtl">
 {/* رأس الصفحة */}
 <div className="mb-8">
 <div className="flex items-center justify-between flex-wrap gap-4">
 <div>
 <h1 className="text-3xl font-bold text-white mb-1"><IconRenderer name="ICON_Zap" size={18} /> التكاملات والربط</h1>
 <p className="text-gray-400">اربط منصتك بالخدمات الخارجية — مفتاح واحد يشتغل لكل المدارس</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="bg-[#1a2540] border border-[#2a3550] rounded-xl px-5 py-3 text-center">
 <div className="text-2xl font-bold text-emerald-400">{connectedCount}</div>
 <div className="text-xs text-gray-400">متصل</div>
 </div>
 <div className="bg-[#1a2540] border border-[#2a3550] rounded-xl px-5 py-3 text-center">
 <div className="text-2xl font-bold text-gray-300">{INTEGRATIONS.length}</div>
 <div className="text-xs text-gray-400">إجمالي</div>
 </div>
 </div>
 </div>
 </div>

 {/* لوحة التعليمات */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
 <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
 <h3 className="text-blue-400 font-bold mb-2"><IconRenderer name="ICON_CheckCircle" size={18} /> التكاملات الجاهزة — تفعّل فوراً</h3>
 <div className="text-sm text-gray-300 space-y-1">
 <p>1. اضغط <strong>"ربط الآن"</strong> على أي تكامل</p>
 <p>2. أدخل الـ API Key من موقع الخدمة</p>
 <p>3. اضغط <strong>"حفظ وتفعيل"</strong> — يشتغل فوراً لكل المدارس</p>
 </div>
 </div>
 <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
 <h3 className="text-orange-400 font-bold mb-2"><Building2 size={16} /> التكاملات الحكومية — تحتاج ترخيص رسمي</h3>
 <div className="text-sm text-gray-300 space-y-1">
 <p>الحقول جاهزة في المنصة بالكامل.</p>
 <p>بعد حصولك على الترخيص، اضغط <strong>"إدخال مفاتيح الترخيص"</strong></p>
 <p>يتفعّل فوراً بدون أي تعديل في الكود.</p>
 </div>
 </div>
 </div>

 {/* فلاتر الفئات */}
 <div className="flex flex-wrap gap-2 mb-6">
 {CATEGORIES.map(cat => (
 <button key={cat} onClick={() => setActiveCategory(cat)}
 className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeCategory === cat ? "bg-yellow-400 text-gray-900 border-yellow-400 font-bold" : "bg-[#1a2540] text-gray-300 border-[#2a3550] hover:border-yellow-400 hover:text-yellow-400"}`}>
 {cat}
 </button>
 ))}
 </div>

 {loading && (
 <div className="text-center py-20 text-gray-400">
 <div className="text-4xl mb-3 animate-pulse">Zap</div>
 <p>جاري تحميل التكاملات...</p>
 </div>
 )}

 {!loading && (
 <div className="space-y-10">
 {/* التكاملات العادية */}
 {normalIntegrations.length > 0 && (
 <section>
 {activeCategory === "الكل" && (
 <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
 <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
 تكاملات جاهزة — تفعّل فوراً
 </h2>
 )}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {normalIntegrations.map(renderNormalCard)}
 </div>
 </section>
 )}

 {/* التكاملات الحكومية */}
 {govIntegrations.length > 0 && (
 <section>
 <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
 <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
 تكاملات حكومية — جاهزة للتفعيل بعد الترخيص
 </h2>
 <p className="text-sm text-orange-300/80 mb-4">
 هذه التكاملات مبرمجة بالكامل في المنصة. بمجرد حصولك على الترخيص من الجهة المختصة، أدخل المفاتيح وستعمل فوراً.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {govIntegrations.map(renderGovCard)}
 </div>
 </section>
 )}
 </div>
 )}
 </div>
 );
}
