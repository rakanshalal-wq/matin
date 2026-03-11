'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [category, setCategory] = useState('الكل');
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', payment_method: 'cash', notes: '' });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/store?type=products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const total = cart.reduce((sum, i) => sum + (i.sale_price || i.price) * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const filtered = products.filter(p => (category === 'الكل' || p.category === category) && (!search || p.name.toLowerCase().includes(search.toLowerCase())));

  const handleOrder = async () => {
    if (!form.name || !form.phone) return alert('الاسم والجوال مطلوبان');
    setOrdering(true);
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_order', ...form, items: cart, total })
      });
      const data = await res.json();
      if (res.ok) {
        setCart([]);
        setShowCheckout(false);
        setShowCart(false);
        setOrderSuccess(`تم تأكيد طلبك! رقم الطلب: ${data.order_number} 🎉`);
        setTimeout(() => setOrderSuccess(''), 8000);
      } else alert(data.error || 'فشل');
    } catch (e) { console.error(e); }
    finally { setOrdering(false); }
  };

  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ background: '#0D1B2A', minHeight: '100vh', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(201,162,39,0.2)', zIndex: 100, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 800, fontSize: 22, textDecoration: 'none' }}>🏪 متجر متين</Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 بحث..." style={{ ...inputStyle, width: 200, padding: '8px 14px' }} />
          <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontWeight: 700 }}>
            🛒 السلة
            {cartCount > 0 && <span style={{ position: 'absolute', top: -8, left: -8, background: '#EF4444', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{cartCount}</span>}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {orderSuccess && <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, color: '#22C55E', fontWeight: 700, fontSize: 16 }}>{orderSuccess}</div>}

        {/* Categories */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ background: category === cat ? 'linear-gradient(135deg, #C9A227, #D4B03D)' : 'rgba(255,255,255,0.05)', color: category === cat ? '#0D1B2A' : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 20, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{cat}</button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 60 }}>جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛍️</div>
            <p>لا توجد منتجات</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {filtered.map(product => (
              <div key={product.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                {product.image ? (
                  <div style={{ height: 180, background: `url(${product.image}) center/cover` }} />
                ) : (
                  <div style={{ height: 180, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🛍️</div>
                )}
                <div style={{ padding: 16 }}>
                  <h3 style={{ color: 'white', fontWeight: 700, margin: '0 0 8px', fontSize: 15 }}>{product.name}</h3>
                  {product.description && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 12px', lineHeight: 1.5 }}>{product.description.slice(0, 80)}</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {product.sale_price ? (
                        <div>
                          <span style={{ color: '#EF4444', textDecoration: 'line-through', fontSize: 13 }}>{product.price} ر.س</span>
                          <span style={{ color: '#22C55E', fontWeight: 800, fontSize: 16, marginRight: 8 }}>{product.sale_price} ر.س</span>
                        </div>
                      ) : (
                        <span style={{ color: '#C9A227', fontWeight: 800, fontSize: 16 }}>{product.price} ر.س</span>
                      )}
                    </div>
                    <button onClick={() => addToCart(product)} disabled={product.stock === 0} style={{ background: product.stock === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #C9A227, #D4B03D)', color: product.stock === 0 ? 'rgba(255,255,255,0.3)' : '#0D1B2A', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}>
                      {product.stock === 0 ? 'نفد' : '🛒 أضف'}
                    </button>
                  </div>
                  {product.stock > 0 && product.stock < 10 && <p style={{ color: '#F59E0B', fontSize: 12, margin: '8px 0 0' }}>⚠️ متبقي {product.stock} فقط</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* السلة */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'flex-left' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', maxWidth: 420, background: '#1B263B', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: 'white', fontWeight: 800, margin: 0 }}>🛒 سلة التسوق ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 40 }}>السلة فارغة</div>
              ) : cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontWeight: 600, margin: '0 0 4px', fontSize: 14 }}>{item.name}</p>
                    <p style={{ color: '#C9A227', fontWeight: 700, margin: 0 }}>{(item.sale_price || item.price) * item.quantity} ر.س</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6, color: 'white', cursor: 'pointer', fontSize: 16 }}>-</button>
                    <span style={{ color: 'white', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6, color: 'white', cursor: 'pointer', fontSize: 16 }}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={{ width: 28, height: 28, background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 6, color: '#EF4444', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>الإجمالي:</span>
                  <span style={{ color: '#C9A227', fontWeight: 800, fontSize: 20 }}>{total.toFixed(2)} ر.س</span>
                </div>
                <button onClick={() => { setShowCart(false); setShowCheckout(true); }} style={{ width: '100%', background: 'linear-gradient(135deg, #C9A227, #D4B03D)', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>إتمام الطلب →</button>
              </div>
            )}
          </div>
          <div style={{ flex: 1 }} onClick={() => setShowCart(false)} />
        </div>
      )}

      {/* Checkout */}
      {showCheckout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#1B263B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontWeight: 800, margin: 0 }}>📦 إتمام الطلب</h2>
              <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>

            {[{ key: 'name', label: 'الاسم *', ph: 'اسمك الكامل' }, { key: 'phone', label: 'الجوال *', ph: '05xxxxxxxx' }, { key: 'email', label: 'الإيميل', ph: 'example@email.com' }, { key: 'address', label: 'العنوان', ph: 'عنوان التوصيل' }, { key: 'notes', label: 'ملاحظات', ph: 'أي ملاحظات للطلب' }].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph} style={inputStyle} />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 10 }}>طريقة الدفع</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ key: 'cash', label: '💵 كاش' }, { key: 'online', label: '💳 أونلاين' }].map(p => (
                  <button key={p.key} onClick={() => setForm({ ...form, payment_method: p.key })} style={{ flex: 1, background: form.payment_method === p.key ? 'rgba(201,162,39,0.2)' : 'rgba(255,255,255,0.05)', color: form.payment_method === p.key ? '#C9A227' : 'rgba(255,255,255,0.6)', border: `1px solid ${form.payment_method === p.key ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '12px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>{p.label}</button>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <h4 style={{ color: 'white', margin: '0 0 12px' }}>ملخص الطلب</h4>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{item.name} × {item.quantity}</span>
                  <span style={{ color: 'white', fontWeight: 600 }}>{((item.sale_price || item.price) * item.quantity).toFixed(2)} ر.س</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'white', fontWeight: 700 }}>الإجمالي</span>
                <span style={{ color: '#C9A227', fontWeight: 800, fontSize: 18 }}>{total.toFixed(2)} ر.س</span>
              </div>
            </div>

            <button onClick={handleOrder} disabled={ordering} style={{ width: '100%', background: 'linear-gradient(135deg, #C9A227, #D4B03D)', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
              {ordering ? '⏳ جاري التأكيد...' : '✅ تأكيد الطلب'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
