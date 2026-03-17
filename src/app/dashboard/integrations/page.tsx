'use client';
import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   MATIN — صفحة التكاملات
   الهوية البصرية: أسود #06060E + ذهبي #C9A84C
   أيقونات SVG احترافية بدلاً من الإيموجيز
═══════════════════════════════════════════════════════════ */

type Integration = {
  key: string;
  name: string;
  category: string;
  iconKey: string;
  desc: string;
  fields: string[];
  testable: boolean;
  requiresLicense: boolean;
  licenseNote?: string;
};

/* ─── أيقونات SVG احترافية ─── */
const ICONS: Record<string, JSX.Element> = {
  payment:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  wallet:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16v4"/><path d="M20 12a2 2 0 0 0-2 2 2 2 0 0 0 2 2h4v-4z"/></svg>,
  bnpl:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  sms:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  whatsapp:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  email:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  bell:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  video:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  book:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  package:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  ai:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>,
  map:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  gov:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  shield:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  health:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  briefcase:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  users:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  graduate:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
};

function IntIcon({ iconKey, size = 22, color = 'currentColor' }: { iconKey: string; size?: number; color?: string }) {
  const icon = ICONS[iconKey] || ICONS.gov;
  return (
    <span style={{ width: size, height: size, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </span>
  );
}

const INTEGRATIONS: Integration[] = [
  // ===== دفع =====
  { key: "payment_gateway_1", name: "بوابة الدفع الرئيسية",  category: "دفع",           iconKey: "payment",   desc: "قبول مدى، فيزا، ماستركارد",                           fields: ["publishable_key","secret_key"],                       testable: true,  requiresLicense: false },
  { key: "payment_gateway_2", name: "بوابة الدفع البديلة",   category: "دفع",           iconKey: "payment",   desc: "بوابة دفع احتياطية متكاملة",                          fields: ["api_key","entity_id"],                                testable: false, requiresLicense: false },
  { key: "payment_wallet",    name: "المحفظة الإلكترونية",   category: "دفع",           iconKey: "wallet",    desc: "الدفع عبر المحفظة الإلكترونية",                       fields: ["api_key","merchant_id"],                              testable: false, requiresLicense: false },
  { key: "payment_bnpl_1",    name: "الدفع على أقساط",       category: "دفع",           iconKey: "bnpl",      desc: "اشتري الآن وادفع لاحقاً",                             fields: ["public_key","secret_key","merchant_code"],            testable: false, requiresLicense: false },
  { key: "payment_bnpl_2",    name: "التقسيط بدون فوائد",    category: "دفع",           iconKey: "bnpl",      desc: "تقسيط ميسّر بدون فوائد",                              fields: ["api_token"],                                          testable: false, requiresLicense: false },
  // ===== رسائل =====
  { key: "taqnyat",           name: "تقنيات SMS",            category: "رسائل",         iconKey: "sms",       desc: "رسائل SMS سعودية",                                    fields: ["api_key","sender"],                                   testable: false, requiresLicense: false },
  { key: "unifonic",          name: "Unifonic",              category: "رسائل",         iconKey: "sms",       desc: "رسائل SMS عربية",                                      fields: ["app_id","sender_id"],                                 testable: false, requiresLicense: false },
  { key: "whatsapp",          name: "واتساب Business",       category: "رسائل",         iconKey: "whatsapp",  desc: "إرسال رسائل واتساب تلقائية",                          fields: ["access_token","phone_number_id"],                     testable: true,  requiresLicense: false },
  { key: "resend",            name: "Resend Email",          category: "رسائل",         iconKey: "email",     desc: "إرسال إيميلات احترافية",                              fields: ["api_key","from_email","from_name"],                   testable: true,  requiresLicense: false },
  // ===== إشعارات =====
  { key: "firebase",          name: "Firebase Push",         category: "إشعارات",       iconKey: "bell",      desc: "إشعارات الجوال",                                      fields: ["server_key","project_id"],                           testable: true,  requiresLicense: false },
  // ===== تعليم =====
  { key: "zoom",              name: "Zoom",                  category: "تعليم",         iconKey: "video",     desc: "اجتماعات ومحاضرات مباشرة",                            fields: ["api_key","api_secret"],                               testable: false, requiresLicense: false },
  { key: "googlemeet",        name: "Google Meet",           category: "تعليم",         iconKey: "video",     desc: "اجتماعات مجانية",                                     fields: ["client_id","client_secret"],                          testable: false, requiresLicense: false },
  { key: "moodle",            name: "Moodle",                category: "تعليم",         iconKey: "book",      desc: "نظام إدارة التعلم",                                   fields: ["url","token"],                                        testable: false, requiresLicense: false },
  // ===== شحن =====
  { key: "aramex",            name: "أرامكس",                category: "شحن",           iconKey: "package",   desc: "شركة شحن أرامكس",                                     fields: ["username","password","account_number","account_pin"], testable: false, requiresLicense: false },
  { key: "smsa",              name: "SMSA",                  category: "شحن",           iconKey: "package",   desc: "شركة شحن SMSA",                                       fields: ["api_key","passkey","sender_city"],                    testable: false, requiresLicense: false },
  // ===== ذكاء اصطناعي =====
  { key: "openai",            name: "OpenAI",                category: "ذكاء اصطناعي", iconKey: "ai",        desc: "GPT-4 للمساعد الذكي",                                 fields: ["api_key"],                                            testable: false, requiresLicense: false },
  // ===== خرائط =====
  { key: "google_maps",       name: "Google Maps",           category: "خرائط",         iconKey: "map",       desc: "خرائط وتتبع الباصات",                                 fields: ["api_key"],                                            testable: false, requiresLicense: false },
  // ===== حكومي — يحتاج ترخيص رسمي =====
  { key: "noor",    name: "نور",    category: "حكومي", iconKey: "gov",       desc: "نظام نور للتعليم — ربط بيانات الطلاب والمعلمين",     fields: ["api_key","school_code"],                  testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً رسمياً من وزارة التعليم" },
  { key: "nafath",  name: "نفاذ",  category: "حكومي", iconKey: "shield",    desc: "التحقق من الهوية الوطنية — تسجيل دخول آمن",          fields: ["client_id","client_secret","service_id"], testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً عبر منصة اعتماد (وزارة الاتصالات)" },
  { key: "absher",  name: "أبشر",  category: "حكومي", iconKey: "gov",       desc: "بوابة الخدمات الحكومية",                             fields: ["api_key"],                                testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً من وزارة الداخلية" },
  { key: "sehatey", name: "صحتي",  category: "حكومي", iconKey: "health",    desc: "السجلات الصحية للطلاب",                              fields: ["api_key"],                                testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً من وزارة الصحة" },
  { key: "qiwa",    name: "قوى",   category: "حكومي", iconKey: "briefcase", desc: "إدارة العقود والرواتب",                              fields: ["api_key","establishment_id"],             testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً من وزارة الموارد البشرية" },
  { key: "muqeem",  name: "مقيم",  category: "حكومي", iconKey: "users",     desc: "بيانات المقيمين",                                   fields: ["api_key"],                                testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً من الجوازات" },
  { key: "faris",   name: "فارس",  category: "حكومي", iconKey: "graduate",  desc: "نظام شؤون المعلمين",                                 fields: ["api_key","school_code"],                  testable: false, requiresLicense: true, licenseNote: "يتطلب اعتماداً من وزارة التعليم" },
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

const CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  "دفع":           { text: "#22C55E", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.2)" },
  "رسائل":         { text: "#3B82F6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.2)" },
  "إشعارات":       { text: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)" },
  "تعليم":         { text: "#A855F7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.2)" },
  "حكومي":         { text: "#F97316", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.2)" },
  "شحن":           { text: "#EC4899", bg: "rgba(236,72,153,0.1)",  border: "rgba(236,72,153,0.2)" },
  "ذكاء اصطناعي":  { text: "#06B6D4", bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.2)" },
  "خرائط":         { text: "#14B8A6", bg: "rgba(20,184,166,0.1)",  border: "rgba(20,184,166,0.2)" },
};

const G = '#C9A84C';
const BORDER = 'rgba(255,255,255,0.08)';

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, Record<string, string>>>({});
  const [inputValues, setInputValues] = useState<Record<string, Record<string, string>>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
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
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key, name: key, config, is_active: true }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setConnected(prev => ({ ...prev, [key]: true }));
        setSavedKeys(prev => ({ ...prev, [key]: config }));
        setEditing(null);
        alert(`تم حفظ إعدادات ${INTEGRATIONS.find(i => i.key === key)?.name} وتفعيله`);
      } else {
        alert(`خطأ: ${data.error || "فشل الحفظ"}`);
      }
    } catch { alert("حدث خطأ أثناء الحفظ"); }
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

  /* ─── بطاقة تكامل عادي ─── */
  const renderNormalCard = (integration: Integration) => {
    const isConnected = connected[integration.key];
    const isEditing   = editing === integration.key;
    const isSaving    = saving === integration.key;
    const isDisc      = disconnecting === integration.key;
    const isTesting   = testing === integration.key;
    const result      = testResult[integration.key];
    const catStyle    = CATEGORY_COLORS[integration.category] || { text: "#6B7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.2)" };

    return (
      <div key={integration.key} style={{
        borderRadius: 16,
        border: `1px solid ${isConnected ? 'rgba(34,197,94,0.35)' : BORDER}`,
        background: isConnected ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.03)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => { if (!isConnected) (e.currentTarget as HTMLElement).style.borderColor = `${G}30`; }}
        onMouseLeave={e => { if (!isConnected) (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
      >
        {/* رأس البطاقة */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11,
              background: catStyle.bg, border: `1px solid ${catStyle.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: catStyle.text, flexShrink: 0,
            }}>
              <IntIcon iconKey={integration.iconKey} size={20} color={catStyle.text} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{integration.name}</div>
              <span style={{ background: catStyle.bg, color: catStyle.text, fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                {integration.category}
              </span>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
            background: isConnected ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.15)',
            color: isConnected ? '#22C55E' : '#6B7280',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: isConnected ? '#22C55E' : '#6B7280', animation: isConnected ? 'pulse 2s infinite' : 'none' }} />
            {isConnected ? "متصل" : "غير متصل"}
          </div>
        </div>

        <p style={{ color: 'rgba(238,238,245,0.45)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{integration.desc}</p>

        {result && (
          <div style={{
            fontSize: 12, padding: '8px 12px', borderRadius: 8,
            background: result.success ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
            color: result.success ? '#22C55E' : '#EF4444',
            border: `1px solid ${result.success ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}>
            {result.message}
          </div>
        )}

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {integration.fields.map(field => (
              <div key={field}>
                <label style={{ color: 'rgba(238,238,245,0.4)', fontSize: 11, display: 'block', marginBottom: 4 }}>{FIELD_LABELS[field] || field}</label>
                <input
                  type={["password","secret","token","key","pin"].some(k => field.includes(k)) ? "password" : "text"}
                  placeholder={FIELD_LABELS[field] || field}
                  value={inputValues[integration.key]?.[field] || ""}
                  onChange={e => setInputValues(prev => ({ ...prev, [integration.key]: { ...(prev[integration.key] || {}), [field]: e.target.value } }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={() => handleSave(integration.key)} disabled={isSaving} style={{
                flex: 1, background: `linear-gradient(135deg, ${G}, #A07830)`, color: '#000',
                padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: isSaving ? 0.6 : 1,
              }}>
                {isSaving ? "جاري الحفظ..." : "حفظ وتفعيل"}
              </button>
              <button onClick={() => setEditing(null)} style={{ padding: '8px 14px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: 'rgba(238,238,245,0.5)', background: 'transparent', cursor: 'pointer' }}>
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => { setInputValues(prev => ({ ...prev, [integration.key]: savedKeys[integration.key] || {} })); setEditing(integration.key); }}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                background: isConnected ? 'rgba(34,197,94,0.15)' : `linear-gradient(135deg, ${G}, #A07830)`,
                color: isConnected ? '#22C55E' : '#000',
              }}>
              {isConnected ? "تعديل الإعدادات" : "ربط الآن"}
            </button>
            {isConnected && integration.testable && (
              <button onClick={() => handleTest(integration.key)} disabled={isTesting} style={{ padding: '8px 14px', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, fontSize: 13, color: '#3B82F6', background: 'transparent', cursor: 'pointer', opacity: isTesting ? 0.6 : 1 }}>
                {isTesting ? "..." : "اختبار"}
              </button>
            )}
            {isConnected && (
              <button onClick={() => handleDisconnect(integration.key)} disabled={isDisc} style={{ padding: '8px 14px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: '#EF4444', background: 'transparent', cursor: 'pointer', opacity: isDisc ? 0.6 : 1 }}>
                {isDisc ? "..." : "قطع"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ─── بطاقة تكامل حكومي ─── */
  const renderGovCard = (integration: Integration) => {
    const isConnected = connected[integration.key];
    const isEditing   = editing === integration.key;
    const isSaving    = saving === integration.key;
    const isDisc      = disconnecting === integration.key;

    return (
      <div key={integration.key} style={{
        position: 'relative',
        borderRadius: 16,
        border: `1px solid ${isConnected ? 'rgba(34,197,94,0.35)' : 'rgba(249,115,22,0.25)'}`,
        background: isConnected ? 'rgba(34,197,94,0.04)' : 'rgba(249,115,22,0.04)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        {!isConnected && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700, border: '1px solid rgba(249,115,22,0.25)' }}>
              يحتاج ترخيص
            </span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: !isConnected ? 20 : 0 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', flexShrink: 0 }}>
            <IntIcon iconKey={integration.iconKey} size={20} color="#F97316" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{integration.name}</div>
              {isConnected && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                  متصل
                </div>
              )}
            </div>
            <span style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>حكومي</span>
          </div>
        </div>

        <p style={{ color: 'rgba(238,238,245,0.45)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{integration.desc}</p>

        {!isConnected && (
          <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.18)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'rgba(249,115,22,0.85)', lineHeight: 1.6 }}>
            <strong>متطلب الترخيص: </strong>{integration.licenseNote}
          </div>
        )}

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {integration.fields.map(field => (
              <div key={field}>
                <label style={{ color: 'rgba(238,238,245,0.4)', fontSize: 11, display: 'block', marginBottom: 4 }}>{FIELD_LABELS[field] || field}</label>
                <input
                  type={["password","secret","token","key","pin"].some(k => field.includes(k)) ? "password" : "text"}
                  placeholder={FIELD_LABELS[field] || field}
                  value={inputValues[integration.key]?.[field] || ""}
                  onChange={e => setInputValues(prev => ({ ...prev, [integration.key]: { ...(prev[integration.key] || {}), [field]: e.target.value } }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={() => handleSave(integration.key)} disabled={isSaving} style={{ flex: 1, background: '#F97316', color: '#fff', padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: isSaving ? 0.6 : 1 }}>
                {isSaving ? "جاري الحفظ..." : isConnected ? "حفظ التعديلات" : "تفعيل بعد الترخيص"}
              </button>
              <button onClick={() => setEditing(null)} style={{ padding: '8px 14px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: 'rgba(238,238,245,0.5)', background: 'transparent', cursor: 'pointer' }}>
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { setInputValues(prev => ({ ...prev, [integration.key]: savedKeys[integration.key] || {} })); setEditing(integration.key); }}
              style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: isConnected ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.12)', color: isConnected ? '#22C55E' : '#F97316', border: `1px solid ${isConnected ? 'rgba(34,197,94,0.3)' : 'rgba(249,115,22,0.3)'}` }}>
              {isConnected ? "تعديل الإعدادات" : "إدخال مفاتيح الترخيص"}
            </button>
            {isConnected && (
              <button onClick={() => handleDisconnect(integration.key)} disabled={isDisc} style={{ padding: '8px 14px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: '#EF4444', background: 'transparent', cursor: 'pointer', opacity: isDisc ? 0.6 : 1 }}>
                {isDisc ? "..." : "قطع"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', padding: 24, direction: 'rtl' }}>

      {/* رأس الصفحة */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 4, height: 28, background: G, borderRadius: 2 }} />
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, margin: 0 }}>التكاملات والربط</h1>
            </div>
            <p style={{ color: 'rgba(238,238,245,0.4)', fontSize: 13, margin: 0 }}>اربط منصتك بالخدمات الخارجية — مفتاح واحد يشتغل لكل المدارس</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ color: '#22C55E', fontSize: 22, fontWeight: 900 }}>{connectedCount}</div>
              <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 11 }}>متصل</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{INTEGRATIONS.length}</div>
              <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 11 }}>إجمالي</div>
            </div>
          </div>
        </div>
      </div>

      {/* لوحة التعليمات */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: 16 }}>
          <div style={{ color: '#3B82F6', fontWeight: 700, fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} />
            التكاملات الجاهزة — تفعّل فوراً
          </div>
          <div style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}>1. اضغط <strong style={{ color: '#fff' }}>"ربط الآن"</strong> على أي تكامل</p>
            <p style={{ margin: 0 }}>2. أدخل الـ API Key من موقع الخدمة</p>
            <p style={{ margin: 0 }}>3. اضغط <strong style={{ color: '#fff' }}>"حفظ وتفعيل"</strong> — يشتغل فوراً</p>
          </div>
        </div>
        <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: 16 }}>
          <div style={{ color: '#F97316', fontWeight: 700, fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F97316' }} />
            التكاملات الحكومية — تحتاج ترخيص رسمي
          </div>
          <div style={{ color: 'rgba(238,238,245,0.6)', fontSize: 12, lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}>الحقول جاهزة في المنصة بالكامل.</p>
            <p style={{ margin: 0 }}>بعد حصولك على الترخيص، أدخل المفاتيح</p>
            <p style={{ margin: 0 }}>يتفعّل فوراً بدون أي تعديل في الكود.</p>
          </div>
        </div>
      </div>

      {/* فلاتر الفئات */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            background: activeCategory === cat ? G : 'rgba(255,255,255,0.04)',
            color: activeCategory === cat ? '#000' : 'rgba(238,238,245,0.6)',
            border: `1px solid ${activeCategory === cat ? G : BORDER}`,
          }}>
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${G}30`, borderTopColor: G, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'rgba(238,238,245,0.4)', fontSize: 14 }}>جاري تحميل التكاملات...</p>
        </div>
      )}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {normalIntegrations.length > 0 && (
            <section>
              {activeCategory === "الكل" && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 3, height: 18, background: '#22C55E', borderRadius: 2 }} />
                  <h2 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>تكاملات جاهزة — تفعّل فوراً</h2>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {normalIntegrations.map(renderNormalCard)}
              </div>
            </section>
          )}

          {govIntegrations.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 3, height: 18, background: '#F97316', borderRadius: 2 }} />
                <h2 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>تكاملات حكومية — جاهزة للتفعيل بعد الترخيص</h2>
              </div>
              <p style={{ color: 'rgba(249,115,22,0.7)', fontSize: 12, marginBottom: 16, marginTop: 0 }}>
                هذه التكاملات مبرمجة بالكامل في المنصة. بمجرد حصولك على الترخيص من الجهة المختصة، أدخل المفاتيح وستعمل فوراً.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {govIntegrations.map(renderGovCard)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
