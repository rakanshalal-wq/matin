'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Star, Package, LogIn, Plus, Minus, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try { setCurrentUser(JSON.parse(localStorage.getItem('matin_user') || 'null')); } catch {}
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`/api/store/products?${params}`);
      const data = await res.json();
      const prods = data.products || [];
      setProducts(prods);
      const cats = [...new Set(prods.map((p: any) => p.category).filter(Boolean))] as string[];
      setCategories(cats);
    } catch { setProducts([]); } finally { setLoading(false); }
  };

  const addToCart = (productId: number, name: string) => {
    setCart(c => ({ ...c, [productId]: (c[productId] || 0) + 1 }));
    showToast(`✓ أُضيف "${name}" للسلة`);
  };

  const removeFromCart = (productId: number) => {
    setCart(c => { const n = { ...c }; delete n[productId]; return n; });
  };

  const updateQty = (productId: number, delta: number) => {
    setCart(c => {
      const next = (c[productId] || 0) + delta;
      if (next <= 0) { const n = { ...c }; delete n[productId]; return n; }
      return { ...c, [productId]: next };
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartItems = products.filter(p => cart[p.id]);
  const cartTotal = cartItems.reduce((sum, p) => sum + (p.sale_price || p.price) * cart[p.id], 0);

  const filteredProducts = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main dir="rtl" style={{ minHeight: '100vh', background: '#06060E', color: '#EEEEF5', fontFamily: 'Cairo, sans-serif' }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6,6,14,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 900, fontSize: 20, textDecoration: 'none' }}>متين</Link>
        <span style={{ fontWeight: 800, fontSize: 15 }}>المتجر الإلكتروني</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {currentUser ? (
            <span style={{ fontSize: 13, color: '#C9A227', fontWeight: 700 }}>{currentUser.name}</span>
          ) : (
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(201,162,39,0.1)', color: '#C9A227', padding: '6px 12px', borderRadius: 20, fontWeight: 700, fontSize: 12, textDecoration: 'none', border: '1px solid rgba(201,162,39,0.3)' }}>
              <LogIn size={13} /> دخول
            </Link>
          )}
          <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: cartCount > 0 ? '#C9A227' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 20, padding: '7px 14px', color: cartCount > 0 ? '#06060E' : '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, fontSize: 13, fontFamily: 'Cairo, sans-serif' }}>
            <ShoppingCart size={15} />
            {cartCount > 0 && cartCount}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px 60px' }}>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchProducts()}
              placeholder="ابحث عن منتج..."
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 40px 10px 14px', color: '#EEEEF5', fontSize: 14, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => setCategory('')} style={{ background: !category ? '#C9A227' : 'rgba(255,255,255,0.04)', color: !category ? '#06060E' : '#888', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
              الكل
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ background: category === cat ? '#C9A227' : 'rgba(255,255,255,0.04)', color: category === cat ? '#06060E' : '#888', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#444' }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(201,162,39,0.3)', borderTopColor: '#C9A227', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: 13 }}>جاري تحميل المنتجات...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#444' }}>
            <Package size={44} style={{ opacity: 0.2, marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: 14 }}>لا توجد منتجات</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {filteredProducts.map(product => (
              <div key={product.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                {/* Product Image */}
                <div style={{ height: 140, background: 'rgba(201,162,39,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {product.image || product.image_url ? (
                    <img src={product.image || product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Package size={40} style={{ color: 'rgba(201,162,39,0.3)' }} />
                  )}
                  {product.sale_price && product.sale_price < product.price && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', color: '#fff', borderRadius: 8, padding: '2px 7px', fontSize: 11, fontWeight: 700 }}>
                      خصم
                    </div>
                  )}
                  {product.category && (
                    <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(6,6,14,0.8)', color: '#C9A227', borderRadius: 8, padding: '2px 7px', fontSize: 10, fontWeight: 700 }}>
                      {product.category}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div style={{ padding: '12px 12px 14px' }}>
                  <h3 style={{ margin: '0 0 5px', fontSize: 13, fontWeight: 800, lineHeight: 1.4 }}>{product.name}</h3>
                  {product.description && (
                    <p style={{ margin: '0 0 8px', fontSize: 11, color: '#666', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      {product.sale_price && product.sale_price < product.price ? (
                        <div>
                          <span style={{ fontSize: 15, fontWeight: 900, color: '#C9A227' }}>{product.sale_price} ر.س</span>
                          <span style={{ fontSize: 11, color: '#555', textDecoration: 'line-through', marginRight: 5 }}>{product.price}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 15, fontWeight: 900, color: '#C9A227' }}>{product.price} ر.س</span>
                      )}
                    </div>
                    {product.stock !== undefined && (
                      <span style={{ fontSize: 10, color: product.stock > 0 ? '#22C55E' : '#ef4444' }}>
                        {product.stock > 0 ? `${product.stock} متاح` : 'نفد'}
                      </span>
                    )}
                  </div>

                  {cart[product.id] ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(201,162,39,0.1)', borderRadius: 10, padding: '4px 8px' }}>
                      <button onClick={() => updateQty(product.id, -1)} style={{ background: 'none', border: 'none', color: '#C9A227', cursor: 'pointer', fontSize: 16, fontWeight: 700, padding: '0 4px' }}>−</button>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#C9A227' }}>{cart[product.id]}</span>
                      <button onClick={() => updateQty(product.id, 1)} style={{ background: 'none', border: 'none', color: '#C9A227', cursor: 'pointer', fontSize: 16, fontWeight: 700, padding: '0 4px' }}>+</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product.id, product.name)}
                      disabled={product.stock === 0}
                      style={{ width: '100%', background: product.stock === 0 ? 'rgba(255,255,255,0.04)' : '#C9A227', color: product.stock === 0 ? '#555' : '#06060E', border: 'none', borderRadius: 10, padding: '8px', fontWeight: 800, fontSize: 13, cursor: product.stock === 0 ? 'default' : 'pointer', fontFamily: 'Cairo, sans-serif' }}
                    >
                      {product.stock === 0 ? 'نفد المخزون' : 'أضف للسلة'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div onClick={() => setShowCart(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', maxWidth: 380, background: '#0d0d14', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>سلة التسوق {cartCount > 0 && `(${cartCount})`}</h2>
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
                  <ShoppingCart size={36} style={{ opacity: 0.2, marginBottom: 10 }} />
                  <p style={{ margin: 0, fontSize: 13 }}>السلة فارغة</p>
                </div>
              ) : cartItems.map(p => (
                <div key={p.id} style={{ display: 'flex', gap: 10, marginBottom: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '10px 12px' }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(201,162,39,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {p.image || p.image_url ? <img src={p.image || p.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} /> : <Package size={20} style={{ color: 'rgba(201,162,39,0.4)' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#C9A227', fontWeight: 700 }}>{(p.sale_price || p.price)} ر.س</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => updateQty(p.id, 1)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, width: 24, height: 24, cursor: 'pointer', color: '#fff', fontSize: 14 }}>+</button>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{cart[p.id]}</span>
                    <button onClick={() => updateQty(p.id, -1)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, width: 24, height: 24, cursor: 'pointer', color: '#fff', fontSize: 14 }}>−</button>
                  </div>
                </div>
              ))}
            </div>
            {cartItems.length > 0 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontWeight: 700 }}>المجموع</span>
                  <span style={{ fontWeight: 900, color: '#C9A227', fontSize: 16 }}>{cartTotal.toFixed(2)} ر.س</span>
                </div>
                {currentUser ? (
                  <button style={{ width: '100%', background: '#C9A227', color: '#06060E', border: 'none', borderRadius: 12, padding: '12px', fontWeight: 900, fontSize: 14, cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
                    إتمام الطلب
                  </button>
                ) : (
                  <Link href="/login" style={{ display: 'block', textAlign: 'center', background: '#C9A227', color: '#06060E', borderRadius: 12, padding: '12px', fontWeight: 900, fontSize: 14, textDecoration: 'none' }}>
                    سجّل دخولك لإتمام الطلب
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'rgba(34,197,94,0.12)', border: '1px solid #22C55E', color: '#22C55E', padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, zIndex: 9999, backdropFilter: 'blur(12px)', fontFamily: 'Cairo, sans-serif', whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #444; }
        * { box-sizing: border-box; }
      `}</style>
    </main>
  );
}
