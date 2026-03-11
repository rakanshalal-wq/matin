"use client";
import { useState, useEffect } from "react";

const INTEGRATIONS = [
  { key: "moyasar", name: "موياسر", category: "دفع", icon: "💳", desc: "بوابة دفع سعودية - مدى، فيزا، ماستركارد", fields: ["api_key", "secret_key"] },
  { key: "hyperpay", name: "HyperPay", category: "دفع", icon: "💳", desc: "بوابة دفع متكاملة", fields: ["api_key", "entity_id"] },
  { key: "stcpay", name: "STC Pay", category: "دفع", icon: "📱", desc: "محفظة STC الإلكترونية", fields: ["api_key"] },
  { key: "tabby", name: "Tabby", category: "دفع", icon: "🛍️", desc: "اشتري الآن وادفع لاحقاً", fields: ["api_key", "secret_key"] },
  { key: "tamara", name: "Tamara", category: "دفع", icon: "🛍️", desc: "تقسيط بدون فوائد", fields: ["api_key"] },
  { key: "twilio", name: "Twilio SMS", category: "رسائل", icon: "📨", desc: "إرسال رسائل SMS", fields: ["account_sid", "auth_token", "phone_number"] },
  { key: "unifonic", name: "Unifonic", category: "رسائل", icon: "📨", desc: "رسائل SMS عربية", fields: ["api_key", "sender_id"] },
  { key: "whatsapp", name: "واتساب Business", category: "رسائل", icon: "💬", desc: "إرسال رسائل واتساب تلقائية", fields: ["api_key", "phone_id"] },
  { key: "firebase", name: "Firebase Push", category: "إشعارات", icon: "🔔", desc: "إشعارات الجوال", fields: ["server_key", "project_id"] },
  { key: "zoom", name: "Zoom", category: "تعليم", icon: "📹", desc: "اجتماعات ومحاضرات مباشرة", fields: ["api_key", "api_secret"] },
  { key: "googlemeet", name: "Google Meet", category: "تعليم", icon: "📹", desc: "اجتماعات مجانية", fields: ["client_id", "client_secret"] },
  { key: "moodle", name: "Moodle", category: "تعليم", icon: "📚", desc: "نظام إدارة التعلم", fields: ["url", "token"] },
  { key: "noor", name: "نور", category: "حكومي", icon: "🏛️", desc: "نظام نور للتعليم", fields: ["api_key", "school_code"] },
  { key: "nafath", name: "نفاذ", category: "حكومي", icon: "🔐", desc: "التحقق من الهوية الوطنية", fields: ["client_id", "client_secret"] },
  { key: "absher", name: "أبشر", category: "حكومي", icon: "🏛️", desc: "بوابة الخدمات الحكومية", fields: ["api_key"] },
  { key: "sehatey", name: "صحتي", category: "حكومي", icon: "🏥", desc: "السجلات الصحية للطلاب", fields: ["api_key"] },
  { key: "qiwa", name: "قوى", category: "حكومي", icon: "👔", desc: "إدارة العقود والرواتب", fields: ["api_key", "establishment_id"] },
  { key: "muqeem", name: "مقيم", category: "حكومي", icon: "🏛️", desc: "بيانات المقيمين", fields: ["api_key"] },
  { key: "faris", name: "فارس", category: "حكومي", icon: "🎓", desc: "نظام شؤون المعلمين", fields: ["api_key", "school_code"] },
  { key: "aramex", name: "أرامكس", category: "شحن", icon: "📦", desc: "شركة شحن أرامكس", fields: ["username", "password", "account_number"] },
  { key: "smsa", name: "SMSA", category: "شحن", icon: "📦", desc: "شركة شحن SMSA", fields: ["api_key"] },
  { key: "openai", name: "OpenAI", category: "ذكاء اصطناعي", icon: "🤖", desc: "GPT-4 للمساعد الذكي", fields: ["api_key"] },
];

const FIELD_LABELS: Record<string, string> = {
  api_key: "مفتاح API", secret_key: "المفتاح السري", auth_token: "Auth Token",
  account_sid: "Account SID", phone_number: "رقم الهاتف", sender_id: "Sender ID",
  phone_id: "Phone ID", server_key: "Server Key", project_id: "Project ID",
  api_secret: "API Secret", client_id: "Client ID", client_secret: "Client Secret",
  url: "رابط الخادم", token: "Token", school_code: "كود المدرسة",
  establishment_id: "رقم المنشأة", username: "اسم المستخدم", password: "كلمة المرور",
  account_number: "رقم الحساب", entity_id: "Entity ID",
};

const CATEGORIES = ["الكل", "دفع", "رسائل", "إشعارات", "تعليم", "حكومي", "شحن", "ذكاء اصطناعي"];

const CATEGORY_COLORS: Record<string, string> = {
  "دفع": "text-emerald-400 bg-emerald-400/10", "رسائل": "text-blue-400 bg-blue-400/10",
  "إشعارات": "text-yellow-400 bg-yellow-400/10", "تعليم": "text-purple-400 bg-purple-400/10",
  "حكومي": "text-orange-400 bg-orange-400/10", "شحن": "text-pink-400 bg-pink-400/10",
  "ذكاء اصطناعي": "text-cyan-400 bg-cyan-400/10",
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
          try { keysMap[row.key || row.name] = typeof row.config === "string" ? JSON.parse(row.config) : (row.config || {}); }
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
      await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key, name: key, config, is_active: true }),
      });
      setConnected(prev => ({ ...prev, [key]: true }));
      setSavedKeys(prev => ({ ...prev, [key]: config }));
      setEditing(null);
    } catch (e) { console.error(e); }
    setSaving(null);
  };

  const handleDisconnect = async (key: string) => {
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
                {isEditing ? (
                  <div className="space-y-2">
                    {integration.fields.map(field => (
                      <div key={field}>
                        <label className="text-xs text-gray-400 mb-1 block">{FIELD_LABELS[field] || field}</label>
                        <input
                          type={field.includes("password") || field.includes("secret") || field.includes("token") || field.includes("key") ? "password" : "text"}
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setInputValues(prev => ({ ...prev, [integration.key]: savedKeys[integration.key] || {} })); setEditing(integration.key); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isConnected ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30" : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"}`}>
                      {isConnected ? "✏️ تعديل" : "🔗 ربط الآن"}
                    </button>
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
