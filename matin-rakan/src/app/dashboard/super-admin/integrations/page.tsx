'use client';
export const dynamic = 'force-dynamic';
import { BookOpen, Building2, Circle, CreditCard, Lock, Map, MessageCircle, Plug, Settings, Smartphone } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";

interface Integration {
 id: string;
 name: string;
 type: string;
 description: string;
 is_active: boolean;
 api_key: string;
 config: any;
}

export default function IntegrationsPage() {
 const [integrations, setIntegrations] = useState<Integration[]>([]);
 const [loading, setLoading] = useState(true);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [editingId, setEditingId] = useState<string | null>(null);
 const [showModal, setShowModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [apiKey, setApiKey] = useState('');

 useEffect(() => { fetchIntegrations(); }, []);

 const fetchIntegrations = async () => {
 try {
 const token = document.cookie.split('token=')[1]?.split(';')[0] || localStorage.getItem('token');
 const res = await fetch('/api/integrations', { headers: { 'Authorization': `Bearer ${token}` } });
 const data = await res.json();
 setIntegrations(Array.isArray(data) ? data : data.integrations || []);
 } catch (e) { console.error(e); }
 setLoading(false);
 };

 const toggleIntegration = async (id: string, currentStatus: boolean) => {
 setErrMsg('');
 try {
 const token = document.cookie.split('token=')[1]?.split(';')[0] || localStorage.getItem('token');
 const res = await fetch('/api/integrations', {
 method: 'PUT',
 headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
 body: JSON.stringify({ integration_id: id, api_key: apiKey || undefined, action: currentStatus ? 'disconnect' : 'connect' })
 });
 const data = await res.json();
 if (!res.ok) setErrMsg(data.error || 'فشل التحديث');
 else fetchIntegrations();
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); }
 };

 const getTypeIcon = (type: string) => {
 const icons: Record<string, string> = {
 auth: "ICON_Lock", payment: "ICON_CreditCard", sms: "ICON_Smartphone", messaging: "ICON_MessageCircle",
 maps: '<Map size={16} />', education: "ICON_BookOpen", government: '<Building2 size={16} />'
 };
 return icons[type] || "ICON_Plug";
 };

 const getTypeLabel = (type: string) => {
 const labels: Record<string, string> = {
 auth: 'مصادقة', payment: 'دفع', sms: 'رسائل نصية', messaging: 'مراسلة',
 maps: 'خرائط', education: 'تعليم', government: 'حكومي'
 };
 return labels[type] || type;
 };

 if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

 return (
 <div className="p-6 max-w-7xl mx-auto" dir="rtl">
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-gray-900">إدارة التكاملات</h1>
 <p className="text-gray-600 mt-2">إدارة وتفعيل التكاملات الخارجية (Plug & Play)</p>
 </div>

 {/* إحصائيات */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
 <div className="bg-white rounded-xl shadow p-6 border-r-4 border-blue-500">
 <p className="text-gray-500 text-sm">إجمالي التكاملات</p>
 <p className="text-3xl font-bold text-blue-600">{integrations.length}</p>
 </div>
 <div className="bg-white rounded-xl shadow p-6 border-r-4 border-green-500">
 <p className="text-gray-500 text-sm">مفعّلة</p>
 <p className="text-3xl font-bold text-green-600">{integrations.filter(i => i.is_active).length}</p>
 </div>
 <div className="bg-white rounded-xl shadow p-6 border-r-4 border-gray-400">
 <p className="text-gray-500 text-sm">معطّلة</p>
 <p className="text-3xl font-bold text-gray-600">{integrations.filter(i => !i.is_active).length}</p>
 </div>
 </div>

 {/* قائمة التكاملات */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {integrations.map(integration => (
 <div key={integration.id} className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all ${integration.is_active ? 'border-green-300' : 'border-gray-200'}`}>
 <div className="p-6">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <span className="text-3xl">{getTypeIcon(integration.type)}</span>
 <div>
 <h3 className="font-bold text-lg">{integration.name}</h3>
 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{getTypeLabel(integration.type)}</span>
 </div>
 </div>
 <span className={`px-3 py-1 rounded-full text-xs font-bold ${integration.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
 {integration.is_active ? 'مفعّل' : 'معطّل'}
 </span>
 </div>
 
 <p className="text-gray-600 text-sm mb-4">{integration.description || 'تكامل خارجي'}</p>

 {editingId === integration.id && (
 <div className="mb-4">
 <label className="block text-sm font-medium text-gray-700 mb-1">مفتاح API</label>
 <input
 type="password"
 value={apiKey}
 onChange={(e) => setApiKey(e.target.value)}
 className="w-full border rounded-lg px-3 py-2 text-sm"
 placeholder="أدخل مفتاح API..."
 />
 </div>
 )}

 <div className="flex gap-2">
 <button
 onClick={() => toggleIntegration(integration.id, integration.is_active)}
 className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
 integration.is_active
 ? 'bg-red-50 text-red-600 hover:bg-red-100'
 : 'bg-green-50 text-green-600 hover:bg-green-100'
 }`}
 >
 {integration.is_active ? 'Circle تعطيل' : 'Circle تفعيل'}
 </button>
 <button
 onClick={() => { setEditingId(editingId === integration.id ? null : integration.id); setApiKey(''); }}
 className="py-2 px-4 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100"
 >
 <Settings size={16} /> إعداد
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>

 {integrations.length === 0 && (
 <div className="text-center py-16 bg-white rounded-xl shadow">
 <p className="text-6xl mb-4">Plug</p>
 <p className="text-xl text-gray-500">لا توجد تكاملات مسجلة</p>
 </div>
 )}
 </div>
 );
}
