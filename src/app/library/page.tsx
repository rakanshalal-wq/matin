'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, BookMarked, Users, Clock, CheckCircle, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function LibraryPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try { setCurrentUser(JSON.parse(localStorage.getItem('matin_user') || 'null')); } catch {}
    fetchBooks();
  }, []);

  useEffect(() => { fetchBooks(); }, [category]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`/api/library?${params}`);
      const data = await res.json();
      const bks = Array.isArray(data) ? data : [];
      setBooks(bks);
      const cats = [...new Set(bks.map((b: any) => b.category).filter(Boolean))] as string[];
      setCategories(cats);
    } catch { setBooks([]); } finally { setLoading(false); }
  };

  const handleBorrow = () => {
    if (!currentUser) { showToast('سجّل دخولك لطلب الاستعارة'); return; }
    showToast('✓ تم إرسال طلب الاستعارة');
  };

  const categoryColors: Record<string, string> = {
    'أدب': '#C9A227', 'علوم': '#22C55E', 'تاريخ': '#60A5FA',
    'تقنية': '#8B5CF6', 'رياضيات': '#F59E0B', 'دين': '#EC4899',
  };

  const filteredBooks = books.filter(b =>
    !search || b.title?.includes(search) || b.author?.includes(search)
  );

  return (
    <main dir="rtl" style={{ minHeight: '100vh', background: '#06060E', color: '#EEEEF5', fontFamily: 'Cairo, sans-serif' }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6,6,14,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 900, fontSize: 20, textDecoration: 'none' }}>متين</Link>
        <span style={{ fontWeight: 800, fontSize: 15 }}>المكتبة الرقمية</span>
        {currentUser ? (
          <span style={{ fontSize: 13, color: '#C9A227', fontWeight: 700 }}>{currentUser.name}</span>
        ) : (
          <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(201,162,39,0.1)', color: '#C9A227', padding: '6px 12px', borderRadius: 20, fontWeight: 700, fontSize: 12, textDecoration: 'none', border: '1px solid rgba(201,162,39,0.3)' }}>
            <LogIn size={13} /> دخول
          </Link>
        )}
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px 60px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { icon: <BookOpen size={18} />, label: 'إجمالي الكتب', value: books.length },
            { icon: <CheckCircle size={18} />, label: 'متاح للاستعارة', value: books.filter(b => (b.available || 0) > 0).length },
            { icon: <BookMarked size={18} />, label: 'التصنيفات', value: categories.length },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ color: '#C9A227' }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#C9A227' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#666' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchBooks()}
              placeholder="ابحث عن كتاب أو مؤلف..."
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 40px 10px 14px', color: '#EEEEF5', fontSize: 14, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => setCategory('')} style={{ background: !category ? '#C9A227' : 'rgba(255,255,255,0.04)', color: !category ? '#06060E' : '#888', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
              الكل
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ background: category === cat ? (categoryColors[cat] || '#C9A227') : 'rgba(255,255,255,0.04)', color: category === cat ? '#06060E' : '#888', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#444' }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(201,162,39,0.3)', borderTopColor: '#C9A227', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: 13 }}>جاري تحميل الكتب...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#444' }}>
            <BookOpen size={44} style={{ opacity: 0.2, marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: 14 }}>لا توجد كتب</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {filteredBooks.map(book => {
              const color = categoryColors[book.category] || '#C9A227';
              const available = book.available ?? book.quantity ?? 0;
              return (
                <div key={book.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
                  {/* Book Cover */}
                  <div style={{ height: 120, background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: `3px solid ${color}30` }}>
                    <BookOpen size={40} style={{ color: `${color}60` }} />
                    {book.category && (
                      <div style={{ position: 'absolute', top: 10, right: 10, background: `${color}20`, color, borderRadius: 8, padding: '3px 9px', fontSize: 11, fontWeight: 700, border: `1px solid ${color}40` }}>
                        {book.category}
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 11, color: available > 0 ? '#22C55E' : '#ef4444', fontWeight: 700 }}>
                      {available > 0 ? `${available} نسخة متاحة` : 'غير متاح'}
                    </div>
                  </div>

                  {/* Book Info */}
                  <div style={{ padding: '14px 14px 16px' }}>
                    <h3 style={{ margin: '0 0 5px', fontSize: 14, fontWeight: 800, lineHeight: 1.4 }}>{book.title}</h3>
                    {book.author && (
                      <p style={{ margin: '0 0 4px', fontSize: 12, color: '#888' }}>{book.author}</p>
                    )}
                    {book.publisher && (
                      <p style={{ margin: '0 0 10px', fontSize: 11, color: '#555' }}>{book.publisher}</p>
                    )}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                      {book.quantity && (
                        <span style={{ fontSize: 11, color: '#666', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 8 }}>
                          المجموع: {book.quantity}
                        </span>
                      )}
                      {book.location && (
                        <span style={{ fontSize: 11, color: '#666', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 8 }}>
                          {book.location}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleBorrow}
                      disabled={available === 0}
                      style={{ width: '100%', background: available > 0 ? color : 'rgba(255,255,255,0.04)', color: available > 0 ? '#06060E' : '#555', border: 'none', borderRadius: 10, padding: '9px', fontWeight: 800, fontSize: 13, cursor: available > 0 ? 'pointer' : 'default', fontFamily: 'Cairo, sans-serif' }}
                    >
                      {available > 0 ? 'طلب استعارة' : 'غير متاح'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'rgba(201,162,39,0.12)', border: '1px solid #C9A227', color: '#C9A227', padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, zIndex: 9999, backdropFilter: 'blur(12px)', fontFamily: 'Cairo, sans-serif', whiteSpace: 'nowrap' }}>
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
