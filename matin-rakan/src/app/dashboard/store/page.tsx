'use client';
export const dynamic = 'force-dynamic';
import { CheckCircle, Coins, Package, Pencil, Plus, RefreshCw, ShoppingCart, Trash2, X, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, StatCard, DataTable, EmptyState, LoadingState, Modal, FilterTabs } from '../_components';
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
    } catch (e) { console.error(e); } finally { setLoading(false); }
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
      setShowModal(false); fetchAll();
    } catch (e) { console.error(e); } finally { setSaving(false); }
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

  const statusColor: any = { pending: '#F59E0B', processing: '#3B82F6', delivered: '#22C55E', cancelled: '#EF4444' };
  const statusLabel: any = { pending: 'جديد', processing: 'قيد التنفيذ', delivered: 'تم التسليم', cancelled: 'ملغي' };

  const tabs = [
    { key: 'products', label: `المنتجات (${products.length})` },
    { key: 'orders', label: `الطلبات (${orders.length})` },
  ];

  const orderColumns = [
    { key: 'order_number', label: 'رقم الطلب', render: (v: any) => <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{v}</span> },
    { key: 'customer_name', label: 'العميل', render: (v: any) => <span className="cell-title">{v}</span> },
    { key: 'customer_phone', label: 'الجوال', render: (v: any) => <span className="cell-sub">{v || '-'}</span> },
    { key: 'total', label: 'الإجمالي', render: (v: any) => <span style={{ color: '#22C55E', fontWeight: 700 }}>{parseFloat(v).toFixed(2)} ر.س</span> },
    {
      key: 'payment_status', label: 'الدفع', align: 'center' as const,
      render: (v: any) => (
        <span className={`badge ${v === 'paid' ? 'badge-green' : 'badge-red'}`}>
          {v === 'paid' ? <><CheckCircle size={11} /> مدفوع</> : 'غير مدفوع'}
        </span>
      )
    },
    {
      key: 'status', label: 'الحالة', align: 'center' as const,
      render: (v: any) => (
        <span className="badge" style={{ background: `${statusColor[v]}20`, color: statusColor[v] }}>
          {statusLabel[v] || v}
        </span>
      )
    },
    { key: 'created_at', label: 'التاريخ', align: 'center' as const, render: (v: any) => new Date(v).toLocaleDateString('ar-SA') },
    {
      key: 'actions', label: 'تغيير الحالة', align: 'center' as const,
      render: (_: any, order: any) => (
        <select
          className="input-field"
          style={{ padding: '6px 10px', fontSize: 12 }}
          onChange={e => handleOrderStatus(order.id, e.target.value)}
          defaultValue={order.status}
        >
          <option value="pending">جديد</option>
          <option value="processing">قيد التنفيذ</option>
          <option value="delivered">تم التسليم</option>
          <option value="cancelled">ملغي</option>
        </select>
      )
    }
  ];

  if (loading) return <LoadingState message="جاري تحميل المتجر..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="إدارة المتجر"
        subtitle="المنتجات والطلبات"
        icon={<ShoppingCart size={22} />}
        action={
          <div className="action-btns">
            <a href="/store" target="_blank" rel="noreferrer" className="btn-outline">المتجر</a>
            <button className="btn-gold" onClick={openAdd}><Plus size={16} /> منتج جديد</button>
          </div>
        }
      />

      <div className="stat-grid">
        <StatCard label="المنتجات" value={products.length} icon={<Package size={20} />} color="#D4A843" />
        <StatCard label="الطلبات" value={orders.length} icon={<ShoppingCart size={20} />} color="#3B82F6" />
        <StatCard label="طلبات جديدة" value={orders.filter(o => o.status === 'pending').length} icon={<RefreshCw size={20} />} color="#F59E0B" />
        <StatCard label="الإيرادات" value={totalRevenue.toFixed(0) + ' ر.س'} icon={<Coins size={20} />} color="#22C55E" />
      </div>

      <FilterTabs tabs={tabs} active={activeTab} onChange={v => setActiveTab(v as any)} />

      {activeTab === 'products' && (
        products.length === 0 ? (
          <EmptyState
            icon={<Package size={32} />}
            title="لا توجد منتجات"
            description="أضف أول منتج للمتجر"
            action={<button className="btn-gold" onClick={openAdd}><Plus size={16} /> أضف منتجاً</button>}
          />
        ) : (
          <div className="cards-grid">
            {products.map(product => (
              <div key={product.id} className="dcard product-card">
                {product.image ? (
                  <div className="product-img" style={{ backgroundImage: `url(${product.image})` }} />
                ) : (
                  <div className="product-img-placeholder"><Package size={32} /></div>
                )}
                <div className="product-body">
                  <div className="product-header">
                    <h3 className="cell-title">{product.name}</h3>
                    <span className={`badge ${product.is_active ? 'badge-green' : 'badge-red'}`}>
                      {product.is_active ? 'نشط' : 'مخفي'}
                    </span>
                  </div>
                  <div className="product-meta">
                    <span style={{ color: 'var(--gold)', fontWeight: 800 }}>{product.sale_price || product.price} ر.س</span>
                    <span className="cell-sub">مخزون: {product.stock}</span>
                  </div>
                  <div className="action-btns">
                    <button className="btn-sm btn-sm-gold" onClick={() => openEdit(product)}><Pencil size={13} /> تعديل</button>
                    <button className="btn-sm btn-sm-red" onClick={() => handleDelete(product.id)}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'orders' && (
        orders.length === 0 ? (
          <EmptyState icon={<ShoppingCart size={32} />} title="لا توجد طلبات بعد" description="" />
        ) : (
          <DataTable columns={orderColumns} data={orders} />
        )
      )}

      {showModal && (
        <Modal
          title={editing ? 'تعديل منتج' : 'منتج جديد'}
          icon={editing ? <Pencil size={18} /> : <Plus size={18} />}
          onClose={() => setShowModal(false)}
        >
          <div className="form-row">
            {[
              { key: 'name', label: 'اسم المنتج *' },
              { key: 'description', label: 'الوصف' },
              { key: 'price', label: 'السعر * (ر.س)' },
              { key: 'sale_price', label: 'سعر التخفيض (اختياري)' },
              { key: 'image', label: 'رابط الصورة' },
              { key: 'category', label: 'الفئة' },
              { key: 'stock', label: 'الكمية في المخزون' },
            ].map(f => (
              <div key={f.key} style={{ gridColumn: ['description', 'image'].includes(f.key) ? '1 / -1' : undefined }}>
                <label className="form-label">{f.label}</label>
                <input
                  className="input-field"
                  value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  type={['price', 'sale_price', 'stock'].includes(f.key) ? 'number' : 'text'}
                  dir={f.key === 'image' ? 'ltr' : 'rtl'}
                />
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ جاري الحفظ...' : editing ? <><Pencil size={15} /> حفظ التعديلات</> : <><Package size={15} /> حفظ</>}
            </button>
            <button className="btn-ghost" onClick={() => setShowModal(false)}><X size={15} /> إلغاء</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
