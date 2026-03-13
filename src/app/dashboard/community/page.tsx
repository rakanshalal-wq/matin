'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setCurrentUser(u);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/social', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'get_posts' }) });
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;
    try {
      await fetch('/api/social', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'create_post', content: newPost }) });
      setNewPost('');
      setShowNewPost(false);
      fetchPosts();
    } catch (error) { console.error('Error:', error); }
  };

  const toggleLike = async (postId: number) => {
    try {
      await fetch('/api/social', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'toggle_like', post_id: postId }) });
      fetchPosts();
    } catch (error) { console.error('Error:', error); }
  };

  const addComment = async (postId: number) => {
    if (!commentText[postId]?.trim()) return;
    try {
      await fetch('/api/social', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'add_comment', post_id: postId, content: commentText[postId] }) });
      setCommentText({ ...commentText, [postId]: '' });
      fetchComments(postId);
      fetchPosts();
    } catch (error) { console.error('Error:', error); }
  };

  const fetchComments = async (postId: number) => {
    try {
      const res = await fetch('/api/social', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'get_comments', post_id: postId }) });
      const data = await res.json();
      setComments({ ...comments, [postId]: data.comments || [] });
    } catch (error) { console.error('Error:', error); }
  };

  const toggleComments = (postId: number) => {
    const newShow = !showComments[postId];
    setShowComments({ ...showComments, [postId]: newShow });
    if (newShow && !comments[postId]) fetchComments(postId);
  };

  const deletePost = async (postId: number) => {
    if (!confirm('هل تريد حذف هذا المنشور؟')) return;
    try {
      await fetch('/api/social', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'delete_post', post_id: postId }) });
      fetchPosts();
    } catch (error) { console.error('Error:', error); }
  };

  const timeAgo = (date: string) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `منذ ${days} يوم`;
    return new Date(date).toLocaleDateString('ar-SA');
  };

  const stats = {
    total: posts.length,
    today: posts.filter(p => new Date(p.created_at).toDateString() === new Date().toDateString()).length,
    myPosts: posts.filter(p => p.user_id === currentUser?.id).length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>🌐 المجتمع</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>تواصل مع زملائك وشارك أفكارك</p>
        </div>
        <button onClick={() => setShowNewPost(true)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', border: 'none', borderRadius: 10, color: '#06060E', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          ✏️ منشور جديد
        </button>
      </div>

      {/* الإحصائيات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي المنشورات', value: stats.total, icon: '📝', color: '#3B82F6' },
          { label: 'منشورات اليوم', value: stats.today, icon: '📅', color: '#10B981' },
          { label: 'منشوراتي', value: stats.myPosts, icon: '👤', color: '#C9A227' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* نموذج منشور جديد */}
      {showNewPost && (
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid rgba(201,162,39,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A227, #D4B03D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#06060E' }}>
              {currentUser?.name?.charAt(0) || '؟'}
            </div>
            <div style={{ color: 'white', fontWeight: 600 }}>{currentUser?.name || 'مستخدم'}</div>
          </div>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="شارك أفكارك مع المجتمع..."
            style={{ width: '100%', minHeight: 120, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: 'white', fontSize: 15, resize: 'vertical', outline: 'none', direction: 'rtl', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <button onClick={() => { setShowNewPost(false); setNewPost(''); }} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>إلغاء</button>
            <button onClick={createPost} disabled={!newPost.trim()} style={{ padding: '10px 24px', background: newPost.trim() ? 'linear-gradient(135deg, #C9A227, #D4B03D)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: newPost.trim() ? '#06060E' : 'rgba(255,255,255,0.3)', fontWeight: 700, cursor: newPost.trim() ? 'pointer' : 'default', fontSize: 14 }}>نشر</button>
          </div>
        </div>
      )}

      {/* المنشورات */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.5)' }}>جاري التحميل...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌐</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>لا توجد منشورات بعد</div>
          <div style={{ fontSize: 14 }}>كن أول من يشارك في المجتمع!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map((post: any) => (
            <div key={post.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.08)', transition: 'border-color 0.2s' }}>
              {/* رأس المنشور */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white' }}>
                    {post.user_name?.charAt(0) || '؟'}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{post.user_name || 'مستخدم'}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{timeAgo(post.created_at)}</div>
                  </div>
                </div>
                {(post.user_id === currentUser?.id || currentUser?.role === 'super_admin') && (
                  <button onClick={() => deletePost(post.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 18 }}>🗑</button>
                )}
              </div>

              {/* محتوى المنشور */}
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.8, marginBottom: 16, whiteSpace: 'pre-wrap', direction: 'rtl' }}>
                {post.content}
              </div>

              {/* أزرار التفاعل */}
              <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => toggleLike(post.id)} style={{ background: 'none', border: 'none', color: post.user_liked ? '#EF4444' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {post.user_liked ? '❤️' : '🤍'} {post.likes_count || 0}
                </button>
                <button onClick={() => toggleComments(post.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  💬 {post.comments_count || 0}
                </button>
              </div>

              {/* التعليقات */}
              {showComments[post.id] && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* إضافة تعليق */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <input
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                      placeholder="اكتب تعليقاً..."
                      style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', direction: 'rtl' }}
                    />
                    <button onClick={() => addComment(post.id)} style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #C9A227, #D4B03D)', border: 'none', borderRadius: 8, color: '#06060E', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>إرسال</button>
                  </div>

                  {/* قائمة التعليقات */}
                  {(comments[post.id] || []).map((c: any) => (
                    <div key={c.id} style={{ display: 'flex', gap: 10, marginBottom: 12, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                        {c.user_name?.charAt(0) || '؟'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{c.user_name}</span>
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{timeAgo(c.created_at)}</span>
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, direction: 'rtl' }}>{c.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
