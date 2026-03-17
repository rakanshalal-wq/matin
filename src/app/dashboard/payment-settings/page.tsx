"use client";
import { useState, useEffect } from "react";

interface GatewayField {
  key: string;
  label: string;
  required: boolean;
  secret: boolean;
}

interface Gateway {
  key: string;
  label: string;
  desc: string;
  fields: GatewayField[];
  is_active: boolean;
  connected_at: string | null;
  config: Record<string, string>;
  has_config: boolean;
}

export default function PaymentSettingsPage() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, Record<string, string>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<any>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadGateways = async () => {
    try {
      const token = localStorage.getItem("matin_token");
      const res = await fetch("/api/school-integrations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGateways(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGateways(); }, []);

  const handleSave = async (gatewayKey: string) => {
    setSaving(gatewayKey);
    try {
      const token = localStorage.getItem("matin_token");
      const config = inputValues[gatewayKey] || {};

      const res = await fetch("/api/school-integrations", {
        method: editItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ gateway_key: gatewayKey, config, is_active: true }),
      });
      const data = await res.json();

      if (data.success) {
        showMessage("success", data.message);
        setEditing(null);
        await loadGateways();
      } else {
        showMessage("error", data.error || "فشل الحفظ");
      }
    } catch (e) {
      showMessage("error", "حدث خطأ أثناء الحفظ");
    }
    setSaving(null);
  };

  const handleDisconnect = async (gatewayKey: string, gatewayLabel: string) => {
    if (!confirm(`هل تريد إلغاء تفعيل "${gatewayLabel}"؟`)) return;
    setDisconnecting(gatewayKey);
    try {
      const token = localStorage.getItem("matin_token");
      const res = await fetch(`/api/school-integrations?gateway_key=${gatewayKey}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "تم إلغاء تفعيل بوابة الدفع");
        await loadGateways();
      } else {
        showMessage("error", data.error || "فشل الإلغاء");
      }
    } catch (e) {
      showMessage("error", "حدث خطأ");
    }
    setDisconnecting(null);
  };

  const activeCount = gateways.filter(g => g.is_active).length;

  return (
    <div className="min-h-screen p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">💳 إعدادات بوابة الدفع</h1>
            <p className="text-gray-400">اربط بوابة الدفع الخاصة بمؤسستك — الأموال تذهب مباشرة لحسابك البنكي</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-[#1a2540] border border-[#2a3550] rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">{activeCount}</div>
              <div className="text-xs text-gray-400">مفعّل</div>
            </div>
            <div className="bg-[#1a2540] border border-[#2a3550] rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-bold text-gray-300">{gateways.length}</div>
              <div className="text-xs text-gray-400">متاح</div>
            </div>
          </div>
        </div>
      </div>

      {/* رسالة النجاح/الخطأ */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium border ${
          message.type === "success"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            : "bg-red-500/10 text-red-400 border-red-500/30"
        }`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {/* تعليمات */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 mb-8">
        <h3 className="text-blue-400 font-bold mb-3 text-base">📋 كيف يعمل النظام</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div className="flex gap-3">
            <span className="text-blue-400 font-bold text-lg">1</span>
            <div>
              <p className="font-medium text-white mb-1">احصل على مفاتيح API</p>
              <p className="text-gray-400">سجّل في موقع شركة الدفع واحصل على مفاتيح الربط</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-400 font-bold text-lg">2</span>
            <div>
              <p className="font-medium text-white mb-1">أدخل المفاتيح هنا</p>
              <p className="text-gray-400">اضغط "ربط الآن" وأدخل المفاتيح — تُحفظ بشكل آمن مشفّر</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-400 font-bold text-lg">3</span>
            <div>
              <p className="font-medium text-white mb-1">الأموال لحسابك مباشرة</p>
              <p className="text-gray-400">كل مدفوعات الطلاب تذهب مباشرة لحسابك البنكي</p>
            </div>
          </div>
        </div>
      </div>

      {/* بوابات الدفع */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3 animate-pulse">💳</div>
          <p>جاري التحميل...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {gateways.map(gateway => {
            const isEditing = editing === gateway.key;
            const isSaving = saving === gateway.key;
            const isDisconnecting = disconnecting === gateway.key;

            return (
              <div
                key={gateway.key}
                className={`rounded-2xl border p-6 transition-all ${
                  gateway.is_active
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-[#2a3550] bg-[#1a2540] hover:border-yellow-400/30"
                }`}
              >
                {/* رأس البطاقة */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{gateway.label}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{gateway.desc}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full shrink-0 ${
                    gateway.is_active
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-700/50 text-gray-400"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${gateway.is_active ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`} />
                    {gateway.is_active ? "مفعّل" : "غير مفعّل"}
                  </div>
                </div>

                {/* تاريخ الربط */}
                {gateway.connected_at && (
                  <p className="text-xs text-gray-500 mb-4">
                    تاريخ الربط: {new Date(gateway.connected_at).toLocaleDateString("ar-SA")}
                  </p>
                )}

                {/* نموذج الإدخال */}
                {isEditing ? (
                  <div className="space-y-3">
                    {gateway.fields.map(field => (
                      <div key={field.key}>
                        <label className="text-xs text-gray-400 mb-1 block">
                          {field.label}
                          {field.required && <span className="text-red-400 mr-1">*</span>}
                        </label>
                        <input
                          type={field.secret ? "password" : "text"}
                          placeholder={gateway.config[field.key] ? "••••••••••••" : `أدخل ${field.label}`}
                          value={inputValues[gateway.key]?.[field.key] || ""}
                          onChange={e =>
                            setInputValues(prev => ({
                              ...prev,
                              [gateway.key]: {
                                ...(prev[gateway.key] || {}),
                                [field.key]: e.target.value,
                              },
                            }))
                          }
                          className="w-full bg-[#0f1829] border border-[#2a3550] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleSave(gateway.key)}
                        disabled={isSaving}
                        className="flex-1 bg-yellow-400 text-gray-900 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-300 disabled:opacity-50 transition-colors"
                      >
                        {isSaving ? "⏳ جاري الحفظ..." : "💾 حفظ وتفعيل"}
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-4 py-2.5 border border-[#2a3550] rounded-xl text-sm text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setInputValues(prev => ({ ...prev, [gateway.key]: {} }));
                        setEditing(gateway.key);
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        gateway.is_active
                          ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                          : "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                      }`}
                    >
                      {gateway.is_active ? "✏️ تعديل الإعدادات" : "🔗 ربط الآن"}
                    </button>
                    {gateway.is_active && (
                      <button
                        onClick={() => handleDisconnect(gateway.key, gateway.label)}
                        disabled={isDisconnecting}
                        className="px-3 py-2.5 border border-red-500/30 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
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

      {/* تنبيه أمان */}
      <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <p className="text-yellow-400 text-sm font-medium">
          🔒 جميع مفاتيح API تُحفظ مشفّرة في قاعدة البيانات ولا تظهر بالكامل بعد الحفظ.
          لا تشارك هذه المفاتيح مع أي شخص.
        </p>
      </div>
    </div>
  );
}
