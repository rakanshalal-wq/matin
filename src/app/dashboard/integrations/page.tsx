"use client";
import { useState, useEffect } from "react";

const INTEGRATIONS = [
  { key: "payment_gateway_1", name: "بوابة الدفع الرئيسية", category: "دفع", icon: "💳", desc: "قبول مدى، فيزا، ماستركارد", fields: ["publishable_key", "secret_key"], testable: true },
  { key: "payment_gateway_2", name: "بوابة الدفع البديلة", category: "دفع", icon: "💳", desc: "بوابة دفع احتياطية متكاملة", fields: ["api_key", "entity_id"], testable: false },
  { key: "payment_wallet", name: "المحفظة الإلكترونية", category: "دفع", icon: "📱", desc: "الدفع عبر المحفظة الإلكترونية", fields: ["api_key", "merchant_id"], testable: false },
  { key: "payment_bnpl_1", name: "الدفع على أقساط", category: "دفع", icon: "🛍️", desc: "اشتري الآن وادفع لاحقاً", fields: ["public_key", "secret_key", "merchant_code"], testable: false },
  { key: "payment_bnpl_2", name: "التقسيط بدون فوائد", category: "دفع", icon: "🛍️", desc: "تقسيط ميسّر بدون فوائد", fields: ["api_token"], testable: false },
  { key: "taqnyat", name: "تقنيات SMS", category: "رسائل", icon: "📨", desc: "رسائل SMS سعودية", fields: ["api_key", "sender"], testable: false },
  { key: "unifonic", name: "Unifonic", category: "رسائل", icon: "📨", desc: "رسائل SMS عربية", fields: ["app_id", "sender_id"], testable: false },
  { key: "whatsapp", name: "واتساب Business", category: "رسائل", icon: "💬", desc: "إرسال رسائل واتساب تلقائية", fields: ["access_token", "phone_number_id"], testable: true },
  { key: "resend", name: "Resend Email", category: "رسائل", icon: "📧", desc: "إرسال إيميلات احترافية", fields: ["api_key", "from_email", "from_name"], testable: true },
  { key: "firebase", name: "Firebase Push", category: "إشعارات", icon: "🔔", desc: "إشعارات الجوال", fields: ["server_key", "project_id"], testable: true },
  { key: "zoom", name: "Zoom", category: "تعليم", icon: "📹", desc: "اجتماعات ومحاضرات مباشرة", fields: ["api_key", "api_secret"], testable: false },
  { key: "googlemeet", name: "Google Meet", category: "تعليم", icon: "📹", desc: "اجتماعات مجانية", fields: ["client_id", "client_secret"], testable: false },
  { key: "moodle", name: "Moodle", category: "تعليم", icon: "📚", desc: "نظام إدارة التعلم", fields: ["url", "token"], testable: false },
  { key: "noor", name: "نور", category: "حكومي", icon: "🏛️", desc: "نظام نور للتعليم", fields: ["api_key", "school_code"], testable: false },
  { key: "nafath", name: "نفاذ", category: "حكومي", icon: "🔐", desc: "التحقق من الهوية الوطنية", fields: ["client_id", "client_secret", "service_id"], testable: false },
  { key: "absher", name: "أبشر", category: "حكومي", icon: "🏛️", desc: "بوابة الخدمات الحكومية", fields: ["api_key"], testable: false },
  { key: "sehatey", name: "صحتي", category: "حكومي", icon: "🏥", desc: "السجلات الصحية للطلاب", fields: ["api_key"], testable: false },
  { key: "qiwa", name: "قوى", category: "حكومي", icon: "👔", desc: "إدارة العقود والرواتب", fields: ["api_key", "establishment_id"], testable: false },
  { key: "muqeem", name: "مقيم", category: "حكومي", icon: "🏛️", desc: "بيانات المقيمين", fields: ["api_key"], testable: false },
  { key: "faris", name: "فارس", category: "حكومي", icon: "🎓", desc: "نظام شؤون المعلمين", fields: ["api_key", "school_code"], testable: false },
  { key: "aramex", name: "أرامكس", category: "شحن", icon: "📦", desc: "شركة شحن أرامكس", fields: ["username", "password", "account_number", "account_pin"], testable: false },
  { key: "smsa", name: "SMSA", category: "شحن", icon: "📦", desc: "شركة شحن SMSA", fields: ["api_key", "passkey", "sender_city"], testable: false },
  { key: "openai", name: "OpenAI", category: "ذكاء اصطناعي", icon: "🤖", desc: "GPT-4 للمساعد الذكي", fields: ["api_key"], testable: false },
  { key: "google_maps", name: "Google Maps", category: "خرائط", icon: "🗺️", desc: "خرائط وتتبع الباصات", fields: ["api_key"], testable: false },
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
  "دفع": "text-emerald-400 bg-emerald-400/10", "رسائل": "text-blue-400 bg-blue-400/10",
  "إشعارات": "text-yellow-400 bg-yellow-400/10", "تعليم": "text-purple-400 bg-purple-400/10",
  "حكومي": "text-orange-400 bg-orange-400/10", "شحن": "text-pink-400 bg-pink-400/10",
  "ذكاء اصطناعي": "text-cyan-400 bg-cyan-400/10", "خرائط": "text-teal-400 bg-teal-400/10",
};

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

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const token = localStorage.getItem("matin_token");
        const res = await fetch("/api/integrations", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        const rows = data.data || [];
        const connectedMap: Record<string, boolean> = {};
        const keysMap: Record<string, Record<string, string>> = {};
        rows.forEach((row: any) => {
          connectedMap[row.key || row.name] = row.is_active;
          try { keysMap[row.key || row.name] = typeof row.extra_config === "string" ? JSON.parse(row.extra_config) : (row.extra_config || {}); }
          catch { keysMap[row.key || row.name] = {}; }
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
        alert(`✅ تم حفظ إعدادات ${INTEGRATIONS.find(i => i.key === key)?.name} وتفعيله`);
      } else {
        alert(`❌ خطأ: ${data.error || 'فشل الحفظ'}`);
      }
    } catch (e) { alert('❌ حدث خطأ أثناء الحفظ'); }
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
    setTestResult(prev => ({ ...prev, [key]: { success: false, message: 'جاري الاختبار...' } }));
    try {
      const token = localStorage.getItem("matin_token");
      const res = await fetch(`/api/integrations?id=${key}&action=test`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'test' }),
      });
      const data = await res.json();
      setTestResult(prev => ({ ...prev, [key]: { success: data.success, message: data.message || (data.success ? 'الاتصال يعمل ✅' : 'فشل الاتصال ❌') } }));
    } catch (e: any) {
      setTestResult(prev => ({ ...prev, [key]: { success: false, message: e.message } }));
    }
    setTesting(null);
  };

  const connectedCount = Object.values(connected).filter(Boolean).length;

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">⚡ التكاملات والربط</h1>
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

      {/* تعليمات الربط */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
        <h3 className="text-blue-400 font-bold mb-2">📋 كيفية الربط</h3>
        <div className="text-sm text-gray-300 space-y-1">
          <p>1. اضغط على <strong>"ربط الآن"</strong> للتكامل الذي تريده</p>
          <p>2. أدخل الـ API Key الذي تحصل عليه من موقع الخدمة</p>
          <p>3. اضغط <strong>"حفظ وتفعيل"</strong> — يُفعَّل فوراً لجميع المدارس</p>
          <p>4. اضغط <strong>"اختبار الاتصال"</strong> للتأكد من صحة المفاتيح</p>
        </div>
      </div>

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
          <div className="text-4xl mb-3 animate-pulse">⚡</div>
          <p>جاري تحميل التكاملات...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(integration => {
            const isConnected = connected[integration.key];
            const isEditing = editing === integration.key;
            const isSaving = saving === integration.key;
            const isDisconnecting = disconnecting === integration.key;
            const isTesting = testing === integration.key;
            const result = testResult[integration.key];
            const catColor = CATEGORY_COLORS[integration.category] || "text-gray-400 bg-gray-400/10";
            return (
              <div key={integration.key} className={`rounded-xl border p-5 transition-all ${isConnected ? "border-emerald-500/50 bg-emerald-500/5" : "border-[#2a3550] bg-[#1a2540] hover:border-yellow-400/30"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{integration.icon}</span>
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
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">{integration.desc}</p>

                {/* نتيجة الاختبار */}
                {result && (
                  <div className={`text-xs px-3 py-2 rounded-lg mb-3 ${result.success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                    {result.message}
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-2">
                    {integration.fields.map(field => (
                      <div key={field}>
                        <label className="text-xs text-gray-400 mb-1 block">{FIELD_LABELS[field] || field}</label>
                        <input
                          type={field.includes("password") || field.includes("secret") || field.includes("token") || field.includes("key") || field.includes("pin") ? "password" : "text"}
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
                        {isSaving ? "جاري الحفظ..." : "💾 حفظ وتفعيل"}
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
                      {isConnected ? "✏️ تعديل" : "🔗 ربط الآن"}
                    </button>
                    {isConnected && integration.testable && (
                      <button onClick={() => handleTest(integration.key)} disabled={isTesting}
                        className="px-3 py-2 border border-blue-500/30 rounded-lg text-sm text-blue-400 hover:bg-blue-500/10 transition-colors disabled:opacity-50">
                        {isTesting ? "⏳" : "🧪 اختبار"}
                      </button>
                    )}
                    {isConnected && (
                      <button onClick={() => handleDisconnect(integration.key)} disabled={isDisconnecting}
                        className="px-3 py-2 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                        {isDisconnecting ? "..." : "قطع"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
