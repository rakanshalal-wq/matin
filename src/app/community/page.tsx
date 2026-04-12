'use client';
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, PenSquare, LogIn, Globe, Lock, Send, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return `منذ ${Math.floor(diff / 86400)} يوم`;
}

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name?.charAt(0) || '؟';
  const colors = ['#C9A227', '#22C55E', '#60A5FA', '#F59E0B', '#8B5CF6', '#EC4899'];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}20`, border: `2px solid ${color}50`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 800, color, flexShrink: 0,
      fontFamily: 'Cairo, sans-serif'
    }}>
      {initials}
    </div>
  );
}

const roleLabel: Record<string, string> = {
  super_admin: 'مشرف المنصة',
  admin: 'مشرف',
  teacher: 'معلم',
  student: 'طالب',
  school_owner: 'مالك مؤسسة',
  university_owner: 'مالك جامعة',
  owner: 'مالك',
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('matin_user') || 'null');
      setCurrentUser(u);
    } catch {}
    fetchPosts();
  }, []);

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch('/api/social');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    if (!currentUser) { showToast('سجّل دخولك أولاً', 'err'); return; }
    setPosting(true);
    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'create_post', content: newPost.trim() }),
      });
      if (res.ok) {
        setNewPost('');
        showToast('✓ تم النشر');
        fetchPosts(true);
      } else {
        showToast('فشل النشر', 'err');
      }
    } catch {
      showToast('خطأ في الاتصال', 'err');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!currentUser) { showToast('سجّل دخولك أولاً', 'err'); return; }
    try {
      await fetch('/api/social', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'toggle_like', post_id: postId }),
      });
      fetchPosts(true);
    } catch {}
  };

  const fetchComments = async (postId: number) => {
    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'get_comments', post_id: postId }),
      });
      const data = await res.json();
      setComments(c => ({ ...c, [postId]: data.comments || [] }));
    } catch {}
  };

  const toggleComments = (postId: number) => {
    const next = !showComments[postId];
    setShowComments(s => ({ ...s, [postId]: next }));
    if (next && !comments[postId]) fetchComments(postId);
  };

  const handleComment = async (postId: number) => {
    if (!currentUser) { showToast('سجّل دخولك أولاً', 'err'); return; }
    const text = commentText[postId]?.trim();
    if (!text) return;
    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'add_comment', post_id: postId, content: text }),
      });
      if (res.ok) {
        setCommentText(c => ({ ...c, [postId]: '' }));
        fetchComments(postId);
        fetchPosts(true);
      }
    } catch {}
  };

  return (
    <main dir="rtl" style={{ minHeight: '100vh', background: '#06060E', color: '#EEEEF5', fontFamily: 'Cairo, sans-serif' }}>

      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6,6,14,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 900, fontSize: 20, textDecoration: 'none', letterSpacing: -0.5 }}>متين</Link>
        <span style={{ fontWeight: 800, fontSize: 15 }}>الملتقى المجتمعي</span>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar name={currentUser.name} size={32} />
            <span style={{ fontSize: 13, color: '#C9A227', fontWeight: 700 }}>{currentUser.name}</span>
          </div>
        ) : (
          <Link href="/login" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: '#C9A227', color: '#06060E',
            padding: '7px 16px', borderRadius: 20,
            fontWeight: 800, fontSize: 13, textDecoration: 'none',
          }}>
            <LogIn size={13} /> دخول
          </Link>
        )}
      </header>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px 40px' }}>

        {/* ── New Post ── */}
        <div style={{ margin: '20px 0 8px' }}>
          {currentUser ? (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 16, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Avatar name={currentUser.name} size={38} />
                <div style={{ flex: 1 }}>
                  <textarea
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handlePost()}
                    placeholder="شاركنا أفكارك... (Ctrl+Enter للنشر)"
                    rows={3}
                    style={{
                      width: '100%', background: 'transparent', border: 'none', outline: 'none',
                      color: '#EEEEF5', fontSize: 14, resize: 'none',
                      fontFamily: 'Cairo, sans-serif', lineHeight: 1.7,
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: '#555' }}>{newPost.length} / 500</span>
                    <button
                      onClick={handlePost}
                      disabled={posting || !newPost.trim()}
                      style={{
                        background: newPost.trim() ? '#C9A227' : 'rgba(201,162,39,0.2)',
                        color: newPost.trim() ? '#06060E' : '#555',
                        border: 'none', borderRadius: 20,
                        padding: '8px 20px', fontWeight: 800, fontSize: 13,
                        cursor: newPost.trim() ? 'pointer' : 'default',
                        fontFamily: 'Cairo, sans-serif', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      <Send size={13} />
                      {posting ? 'جاري...' : 'نشر'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(201,162,39,0.04)',
              border: '1px solid rgba(201,162,39,0.15)',
              borderRadius: 16, padding: '18px 20px', textAlign: 'center',
            }}>
              <PenSquare size={22} style={{ color: '#C9A227', marginBottom: 8 }} />
              <p style={{ margin: '0 0 12px', color: '#888', fontSize: 14 }}>سجّل دخولك للمشاركة في الملتقى</p>
              <Link href="/login" style={{
                background: '#C9A227', color: '#06060E',
                padding: '9px 28px', borderRadius: 20,
                fontWeight: 800, fontSize: 14, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <LogIn size={14} /> تسجيل الدخول
              </Link>
            </div>
          )}
        </div>

        {/* ── Refresh ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button
            onClick={() => fetchPosts(true)}
            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'Cairo, sans-serif' }}
          >
            <RefreshCw size={12} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            تحديث
          </button>
        </div>

        {/* ── Feed ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#444' }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(201,162,39,0.3)', borderTopColor: '#C9A227', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ margin: 0, fontSize: 13 }}>جاري تحميل المنشورات...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#444' }}>
            <PenSquare size={44} style={{ opacity: 0.2, marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: 14 }}>لا توجد منشورات بعد</p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#555' }}>كن الأول وشارك أفكارك</p>
          </div>
        ) : posts.map(post => (
          <article key={post.id} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: '14px 16px', marginBottom: 10,
            transition: 'border-color 0.2s',
          }}>
            {/* Post Header */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <Avatar name={post.user_name || 'م'} size={38} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{post.user_name || 'مجهول'}</span>
                  {post.user_role && (
                    <span style={{ fontSize: 11, color: '#C9A227', background: 'rgba(201,162,39,0.1)', padding: '1px 7px', borderRadius: 10 }}>
                      {roleLabel[post.user_role] || post.user_role}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#555', display: 'flex', gap: 5, alignItems: 'center', marginTop: 2 }}>
                  <span>{timeAgo(post.created_at)}</span>
                  {post.visibility === 'public'
                    ? <Globe size={10} style={{ color: '#444' }} />
                    : <Lock size={10} style={{ color: '#444' }} />}
                </div>
              </div>
            </div>

            {/* Content */}
            {post.title && (
              <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800 }}>{post.title}</h3>
            )}
            <p style={{ margin: '0 0 12px', lineHeight: 1.75, color: '#ccc', fontSize: 14, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {post.content}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 16, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => handleLike(post.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontFamily: 'Cairo, sans-serif', color: post.user_liked ? '#ef4444' : '#666', transition: 'color 0.15s' }}
              >
                <Heart size={15} style={{ fill: post.user_liked ? '#ef4444' : 'none', transition: 'fill 0.15s' }} />
                {post.likes_count || 0}
              </button>
              <button
                onClick={() => toggleComments(post.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontFamily: 'Cairo, sans-serif', color: showComments[post.id] ? '#60A5FA' : '#666' }}
              >
                <MessageCircle size={15} />
                {post.comments_count || 0}
              </button>
            </div>

            {/* Comments */}
            {showComments[post.id] && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {(comments[post.id] || []).length === 0 && (
                  <p style={{ fontSize: 12, color: '#555', margin: '0 0 10px', textAlign: 'center' }}>لا توجد تعليقات بعد</p>
                )}
                {(comments[post.id] || []).map((c: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Avatar name={c.user_name || 'م'} size={28} />
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '6px 10px', flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#C9A227', marginBottom: 2 }}>{c.user_name}</div>
                      <div style={{ fontSize: 13, color: '#bbb', lineHeight: 1.6 }}>{c.content}</div>
                    </div>
                  </div>
                ))}
                {currentUser ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Avatar name={currentUser.name} size={28} />
                    <div style={{ flex: 1, display: 'flex', gap: 6 }}>
                      <input
                        value={commentText[post.id] || ''}
                        onChange={e => setCommentText(c => ({ ...c, [post.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                        placeholder="اكتب تعليقاً... (Enter)"
                        style={{
                          flex: 1, background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 20, padding: '7px 14px',
                          color: '#EEEEF5', fontSize: 13,
                          fontFamily: 'Cairo, sans-serif', outline: 'none',
                        }}
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        style={{
                          background: '#C9A227', color: '#06060E',
                          border: 'none', borderRadius: 20,
                          padding: '7px 14px', fontWeight: 800,
                          fontSize: 13, cursor: 'pointer',
                          fontFamily: 'Cairo, sans-serif',
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <Send size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" style={{ fontSize: 12, color: '#C9A227', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <LogIn size={12} /> سجّل دخولك للتعليق
                  </Link>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'ok' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${toast.type === 'ok' ? '#22C55E' : '#ef4444'}`,
          color: toast.type === 'ok' ? '#22C55E' : '#ef4444',
          padding: '10px 24px', borderRadius: 12,
          fontSize: 14, fontWeight: 700, zIndex: 9999,
          backdropFilter: 'blur(12px)',
          fontFamily: 'Cairo, sans-serif',
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea::placeholder { color: #444; }
        input::placeholder { color: #444; }
      `}</style>
    </main>
  );
}
