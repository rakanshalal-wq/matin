'use client';
export const dynamic = "force-dynamic";
import { CheckCircle, Coins, Eye, Package, Pencil, Plus, RefreshCw, Save, ShoppingCart, Trash2, X, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';


export default function StoreDashboard() {
 const [products, setProducts] = useState<any[]>([]);
 const [orders, setOrders] = useState<any[]>([]);
 const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
 const [loading, setLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [editing, setEditing] = useState<any>(null);
 const [form, setForm] = useState({ name: '', description: '', price: '', sale_price: '', image: '', category: '', stock: '0' });

 useEffect(() => { fetchAll(); }, []);

 const fetchAll = async () => {
 try {
 const [p, o] = await Promise.all([
 fetch('/api/store', { headers: getHeaders() }).then(r => r.json()),
 fetch('/api/store?type=orders', { headers: getHeaders() }).then(r => r.json()),
 ]);
 setProducts(Array.isArray(p) ? p : []);
 setOrders(Array.isArray(o) ? o : []);
 } catch (e) { console.error(e); }
 finally { setLoading(false); }
 };

 const openAdd = () => { setEditing(null); setForm({ name: '', description: '', price: '', sale_price: '', image: '', category: '', stock: '0' }); setShowModal(true); };
 const openEdit = (p: any) => { setEditing(p); setForm({ name: p.name, description: p.description || '', price: p.price, sale_price: p.sale_price || '', image: p.image || '', category: p.category || '', stock: p.stock || '0' }); setShowModal(true); };

 const handleSave = async () => {
 if (!form.name || !form.price) return alert('الاسم والسعر مطلوبان');
 setSaving(true);
 try {
 if (editing) {
 await fetch('/api/store', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ id: editing.id, ...form, price: parseFloat(form.price), sale_price: form.sale_price ? parseFloat(form.sale_price) : null, stock: parseInt(form.stock) }) });
 } else {
 await fetch('/api/store', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'add_product', ...form, price: parseFloat(form.price), sale_price: form.sale_price ? parseFloat(form.sale_price) : null, stock: parseInt(form.stock) }) });
 }
 setShowModal(false);
 fetchAll();
 } catch (e) { console.error(e); }
 finally { setSaving(false); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('حذف المنتج؟')) return;
 await fetch(`/api/store?id=${id}`, { method: 'DELETE', headers: getHeaders() });
 fetchAll();
 };

 const handleOrderStatus = async (id: number, status: string) => {
 await fetch('/api/store', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ id, type: 'order', status, payment_status: status === 'delivered' ? 'paid' : 'unpaid' }) });
 fetchAll();
 };

 const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + parseFloat(o.total), 0);
 const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

 const statusColor: any = { pending: '#F59E0B', processing: '#3B82F6', delivered: '#22C55E', cancelled: '#EF4444' };
 const statusLabel: any = { pending: '⏳ جديد', processing: 'RefreshCw قيد التنفيذ', delivered: 'CheckCircle تم التسليم', cancelled: 'XCircle ملغي' };

 return (
 <div style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_ShoppingCart" size={18} /> إدارة المتجر</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>المنتجات والطلبات</p>
 </div>
 <div style={{ display: 'flex', gap: 10 }}>
 <a href="/store" target="_blank" rel="noreferrer" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, padding: '10px 18px', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}> المتجر</a>
 <button onClick={openAdd} style={{ background: 'linear-gradient(135deg, #C9A227, #D4B03D)', color: '#06060E', padding: '10px 20px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> منتج جديد</button>
 </div>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'المنتجات', value: products.length, icon: "ICON_Package", color: '#C9A227' },
 { label: 'الطلبات', value: orders.length, icon: "ICON_ShoppingCart", color: '#3B82F6' },
 { label: 'طلبات جديدة', value: orders.filter(o => o.status === 'pending').length, icon: '⏳', color: '#F59E0B' },
 { label: 'الإيرادات', value: totalRevenue.toFixed(0) + ' ر.س', icon: "ICON_Coins", color: '#22C55E' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <span style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></span>
 <span style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</span>
 </div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: '8px 0 0' }}>{stat.label}</p>
 </div>
 ))}
 </div>

 {/* Tabs */}
 <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
 {[{ key: 'products', label: 'Package المنتجات', count: products.length }, { key: 'orders', label: '<ShoppingCart size={18} color="#6B7280" /> الطلبات', count: orders.length }].map(tab => (
 <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{ background: activeTab === tab.key ? 'linear-gradient(135deg, #C9A227, #D4B03D)' : 'rgba(255,255,255,0.05)', color: activeTab === tab.key ? '#06060E' : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 20, padding: '8px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
 {tab.label} ({tab.count})
 </button>
 ))}
 </div>

 {loading ? <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 60 }}>جاري التحميل...</div> : (
 <>
 {/* المنتجات */}
 {activeTab === 'products' && (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
 {products.map(product => (
 <div key={product.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
 {product.image ? <div style={{ height: 140, background: `url(${product.image}) center/cover` }} /> : <div style={{ height: 140, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(201,162,39,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconRenderer name="ICON_Package" size={32} /></div></div>}
 <div style={{ padding: 16 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
 <h3 style={{ color: 'white', fontWeight: 700, margin: 0, fontSize: 15 }}>{product.name}</h3>
 <span style={{ background: product.is_active ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: product.is_active ? '#22C55E' : '#EF4444', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 700 }}>{product.is_active ? 'نشط' : 'مخفي'}</span>
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
 <span style={{ color: '#C9A227', fontWeight: 800 }}>{product.sale_price || product.price} ر.س</span>
 <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>مخزون: {product.stock}</span>
 </div>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => openEdit(product)} style={{ flex: 1, background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 8, padding: '7px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
 <button onClick={() => handleDelete(product.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '7px 12px', fontSize: 13, cursor: 'pointer' }}> </button>
 </div>
 </div>
 </div>
 ))}
 {products.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 60 }}>لا توجد منتجات - أضف أول منتج!</div>}
 </div>
 )}

 {/* الطلبات */}
 {activeTab === 'orders' && (
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
 {['رقم الطلب', 'العميل', 'الجوال', 'الإجمالي', 'الدفع', 'الحالة', 'التاريخ', 'إجراء'].map((h, i) => (
 <th key={i} style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {orders.map((order, i) => (
 <tr key={order.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: '14px 16px', color: '#C9A227', fontWeight: 700, fontSize: 13 }}>{order.order_number}</td>
 <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{order.customer_name}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{order.customer_phone || '-'}</td>
 <td style={{ padding: '14px 16px', color: '#22C55E', fontWeight: 700 }}>{parseFloat(order.total).toFixed(2)} ر.س</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: order.payment_status === 'paid' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: order.payment_status === 'paid' ? '#22C55E' : '#EF4444', fontSize: 12, padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>{order.payment_status === 'paid' ? '<CheckCircle size={18} color="#10B981" /> مدفوع' : '⏳ غير مدفوع'}</span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: `${statusColor[order.status]}20`, color: statusColor[order.status], fontSize: 12, padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>{statusLabel[order.status] || order.status}</span>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{new Date(order.created_at).toLocaleDateString('ar-SA')}</td>
 <td style={{ padding: '14px 16px' }}>
 <select onChange={e => handleOrderStatus(order.id, e.target.value)} defaultValue={order.status} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>
 <option value="pending">⏳ جديد</option>
 <option value="processing"><IconRenderer name="ICON_RefreshCw" size={18} /> قيد التنفيذ</option>
 <option value="delivered"><IconRenderer name="ICON_CheckCircle" size={18} /> تم التسليم</option>
 <option value="cancelled"><IconRenderer name="ICON_X" size={18} /><IconRenderer name="ICON_Circle" size={18} /> ملغي</option>
 </select>
 </td>
 </tr>
 ))}
 {orders.length === 0 && <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>لا توجد طلبات بعد</td></tr>}
 </tbody>
 </table>
 </div>
 )}
 </>
 )}

 {/* Modal */}
 {showModal && (
 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
 <div style={{ background: '#1B263B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontWeight: 800, margin: 0 }}>{editing ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل منتج' : 'Plus منتج جديد'}</h2>
 <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, cursor: 'pointer' }}>X</button>
 </div>
 {[{ key: 'name', label: 'اسم المنتج *' }, { key: 'description', label: 'الوصف' }, { key: 'price', label: 'السعر * (ر.س)' }, { key: 'sale_price', label: 'سعر التخفيض (اختياري)' }, { key: 'image', label: 'رابط الصورة' }, { key: 'category', label: 'الفئة' }, { key: 'stock', label: 'الكمية في المخزون' }].map(f => (
 <div key={f.key} style={{ marginBottom: 16 }}>
 <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label}</label>
 <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} type={['price', 'sale_price', 'stock'].includes(f.key) ? 'number' : 'text'} style={inputStyle} dir={f.key === 'image' ? 'ltr' : 'rtl'} />
 </div>
 ))}
 <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: 'linear-gradient(135deg, #C9A227, #D4B03D)', color: '#06060E', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 8 }}>
 {saving ? '⏳ جاري الحفظ...' : 'Save حفظ'}
 </button>
 </div>
 </div>
 )}
 </div>
 );
}
