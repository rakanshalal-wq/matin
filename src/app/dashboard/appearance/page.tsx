"use client";
import { } from "lucide-react";
import { useState, useEffect } from "react";

const TEMPLATES = [
 { id: "classic", name: "كلاسيك", colors: ["#1e40af", "#ffffff", "#f8fafc"] },
 { id: "modern", name: "عصري", colors: ["#7c3aed", "#ffffff", "#faf5ff"] },
 { id: "nature", name: "طبيعي", colors: ["#15803d", "#ffffff", "#f0fdf4"] },
 { id: "warm", name: "دافئ", colors: ["#c2410c", "#ffffff", "#fff7ed"] },
 { id: "dark", name: "داكن", colors: ["#1e293b", "#94a3b8", "#0f172a"] },
];

export default function AppearancePage() {
 const [settings, setSettings] = useState({
 primary_color: "#1e40af",
 secondary_color: "#ffffff",
 background_color: "#f8fafc",
 logo_url: "",
 hero_image_url: "",
 school_name: "",
 school_slogan: "",
 template: "classic",
 font: "Tajawal",
 show_ads: true,
 show_store_button: true,
 });
 const [saving, setSaving] = useState(false);
 const [saved, setSaved] = useState(false);
 const [loading, setLoading] = useState(true);
 const [errMsg, setErrMsg] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [activeTab, setActiveTab] = useState("template");

 useEffect(() => {
 setLoading(true);
 fetch("/api/appearance").then(r => r.json()).then(data => {
 if (data && !data.error) setSettings(prev => ({ ...prev, ...data }));
 }).catch(() => {}).finally(() => setLoading(false));
 }, []);

 const handleSave = async () => {
 setSaving(true); setErrMsg('');
 try {
 const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') || '' : '';
 const res = await fetch("/api/appearance", {
 method: "PUT",
 headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
 body: JSON.stringify(settings)
 });
 const data = await res.json();
 if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
 else setErrMsg(data.error || 'فشل الحفظ');
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };

 const applyTemplate = (t: typeof TEMPLATES[0]) => {
 setSettings(prev => ({
 ...prev,
 template: t.id,
 primary_color: t.colors[0],
 secondary_color: t.colors[1],
 background_color: t.colors[2],
 }));
 };

 const TABS = [
 { id: "template", label: "القوالب" },
 { id: "colors", label: "الألوان" },
 { id: "media", label: "الصور والشعار" },
 { id: "text", label: "النصوص" },
 { id: "options", label: "الخيارات" },
 ];

 if (loading) return (
 <div className="p-6 max-w-5xl mx-auto flex items-center justify-center min-h-[300px]" dir="rtl">
 <div className="text-center">
 <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
 <p className="text-gray-500">جاري تحميل الإعدادات...</p>
 </div>
 </div>
 );

 return (
 <div className="p-6 max-w-5xl mx-auto" dir="rtl">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-3xl font-bold text-gray-900">تخصيص المظهر</h1>
 <p className="text-gray-500 mt-1">غيّر تصميم صفحتك العامة بالكامل</p>
 </div>
 <button onClick={handleSave} disabled={saving}
 className={`px-6 py-3 rounded-xl font-bold text-white transition-all ${saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"} disabled:opacity-50`}>
 {saving ? "جاري الحفظ..." : saved ? " تم الحفظ" : "حفظ التغييرات"}
 </button>
 </div>

 {/* التبويبات */}
 <div className="flex gap-2 mb-6 border-b">
 {TABS.map(tab => (
 <button key={tab.id} onClick={() => setActiveTab(tab.id)}
 className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
 {tab.label}
 </button>
 ))}
 </div>

 {/* القوالب */}
 {activeTab === "template" && (
 <div>
 <h2 className="text-lg font-bold mb-4">اختر قالباً</h2>
 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
 {TEMPLATES.map(t => (
 <div key={t.id} onClick={() => applyTemplate(t)}
 className={`cursor-pointer rounded-xl overflow-hidden border-4 transition-all ${settings.template === t.id ? "border-blue-600 scale-105" : "border-gray-200 hover:border-blue-300"}`}>
 <div className="h-20" style={{ backgroundColor: t.colors[0] }}>
 <div className="h-6 mx-2 mt-2 rounded" style={{ backgroundColor: t.colors[1], opacity: 0.3 }}></div>
 <div className="h-4 mx-4 mt-1 rounded" style={{ backgroundColor: t.colors[1], opacity: 0.2 }}></div>
 </div>
 <div className="p-2 text-center text-sm font-medium" style={{ backgroundColor: t.colors[2] }}>{t.name}</div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* الألوان */}
 {activeTab === "colors" && (
 <div className="space-y-6">
 {[
 { key: "primary_color", label: "اللون الرئيسي", desc: "لون الأزرار والعناوين" },
 { key: "secondary_color", label: "اللون الثانوي", desc: "لون النصوص الثانوية" },
 { key: "background_color", label: "لون الخلفية", desc: "خلفية الصفحة" },
 ].map(c => (
 <div key={c.key} className="flex items-center justify-between p-4 bg-white rounded-xl border">
 <div>
 <p className="font-medium">{c.label}</p>
 <p className="text-sm text-gray-500">{c.desc}</p>
 </div>
 <div className="flex items-center gap-3">
 <span className="text-sm text-gray-500">{(settings as any)[c.key]}</span>
 <input type="color" value={(settings as any)[c.key]}
 onChange={e => setSettings(prev => ({ ...prev, [c.key]: e.target.value }))}
 className="w-12 h-10 rounded-lg cursor-pointer border-2 border-gray-200" />
 </div>
 </div>
 ))}
 <div className="p-4 bg-white rounded-xl border">
 <p className="font-medium mb-3">الخط</p>
 <select value={settings.font} onChange={e => setSettings(prev => ({ ...prev, font: e.target.value }))}
 className="w-full border rounded-lg px-3 py-2">
 <option value="Tajawal">Tajawal (افتراضي)</option>
 <option value="Cairo">Cairo</option>
 <option value="Almarai">Almarai</option>
 <option value="Noto Kufi Arabic">Noto Kufi Arabic</option>
 </select>
 </div>
 </div>
 )}

 {/* الصور */}
 {activeTab === "media" && (
 <div className="space-y-4">
 {[
 { key: "logo_url", label: "شعار المؤسسة", placeholder: "https://..." },
 { key: "hero_image_url", label: "صورة الغلاف الرئيسية", placeholder: "https://..." },
 ].map(m => (
 <div key={m.key} className="p-4 bg-white rounded-xl border">
 <p className="font-medium mb-2">{m.label}</p>
 <input type="text" placeholder={m.placeholder}
 value={(settings as any)[m.key]}
 onChange={e => setSettings(prev => ({ ...prev, [m.key]: e.target.value }))}
 className="w-full border rounded-lg px-3 py-2 text-sm" />
 {(settings as any)[m.key] && (
 <img src={(settings as any)[m.key]} alt="" className="mt-3 h-24 object-contain rounded-lg border" />
 )}
 </div>
 ))}
 </div>
 )}

 {/* النصوص */}
 {activeTab === "text" && (
 <div className="space-y-4">
 <div className="p-4 bg-white rounded-xl border">
 <p className="font-medium mb-2">اسم المؤسسة (يظهر في الصفحة العامة)</p>
 <input type="text" placeholder="مدرسة النجاح الأهلية"
 value={settings.school_name}
 onChange={e => setSettings(prev => ({ ...prev, school_name: e.target.value }))}
 className="w-full border rounded-lg px-3 py-2" />
 </div>
 <div className="p-4 bg-white rounded-xl border">
 <p className="font-medium mb-2">الشعار أو الوصف المختصر</p>
 <input type="text" placeholder="نحو مستقبل أفضل..."
 value={settings.school_slogan}
 onChange={e => setSettings(prev => ({ ...prev, school_slogan: e.target.value }))}
 className="w-full border rounded-lg px-3 py-2" />
 </div>
 </div>
 )}

 {/* الخيارات */}
 {activeTab === "options" && (
 <div className="space-y-4">
 {[
 { key: "show_ads", label: "إظهار الإعلانات", desc: "إعلانات المنصة تظهر في صفحتك" },
 { key: "show_store_button", label: "إظهار زر المتجر", desc: "زر الانتقال للمتجر الإلكتروني" },
 ].map(opt => (
 <div key={opt.key} className="flex items-center justify-between p-4 bg-white rounded-xl border">
 <div>
 <p className="font-medium">{opt.label}</p>
 <p className="text-sm text-gray-500">{opt.desc}</p>
 </div>
 <button onClick={() => setSettings(prev => ({ ...prev, [opt.key]: !(prev as any)[opt.key] }))}
 className={`w-12 h-6 rounded-full transition-all ${(settings as any)[opt.key] ? "bg-blue-600" : "bg-gray-300"}`}>
 <div className={`w-5 h-5 bg-white rounded-full shadow transition-all mx-0.5 ${(settings as any)[opt.key] ? "translate-x-6" : ""}`}></div>
 </button>
 </div>
 ))}
 </div>
 )}

 {/* معاينة */}
 <div className="mt-8 p-4 rounded-xl border-2 border-dashed border-gray-300">
 <p className="text-sm text-gray-500 mb-3 text-center">معاينة مبسطة</p>
 <div className="rounded-lg overflow-hidden" style={{ backgroundColor: settings.background_color }}>
 <div className="h-16 flex items-center px-4 gap-3" style={{ backgroundColor: settings.primary_color }}>
 {settings.logo_url && <img src={settings.logo_url} alt="" className="h-10 w-10 rounded-full object-cover" />}
 <span className="text-white font-bold">{settings.school_name || "اسم المؤسسة"}</span>
 </div>
 <div className="p-4 text-center">
 <p className="font-medium" style={{ color: settings.primary_color }}>{settings.school_slogan || "الشعار هنا"}</p>
 </div>
 </div>
 </div>
 </div>
 );
}
