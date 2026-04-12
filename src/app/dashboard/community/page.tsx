'use client';
export const dynamic = 'force-dynamic';
import { Ban, BarChart3, Calendar, Check, FileText, Globe, Heart, MessageCircle, Newspaper, Pencil, Pin, Siren, Trash2, TrendingUp, User, X, Plus } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, StatCard, SearchBar, EmptyState, LoadingState, FilterTabs } from '../_components';
import { getHeaders } from '@/lib/api';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [reports, setReports] = useState<any[]>([]);
  const [blocked, setBlocked] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [editPost, setEditPost] = useState<any>(null);

  const isAdmin = ['admin', 'school_owner', 'university_owner', 'institute_owner', 'kindergarten_owner', 'training_owner', 'owner', 'super_admin'].includes(currentUser?.role);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setCurrentUser(u);
    fetchPosts();
  }, []);

  useEffect(() => {
    if (isAdmin && activeTab === 'reports') fetchReports();
    if (isAdmin && activeTab === 'blocked') fetchBlocked();
  }, [activeTab, isAdmin]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/social', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'get_posts' }) });
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/community', { headers: getHeaders() });
      const data = await res.json();
      setReports(data.reports || []);
    } catch { setReports([]); }
  };

  const fetchBlocked = async () => {
    try {
      const res = await fetch('/api/community?type=blocked', { headers: getHeaders() });
      const data = await res.json();
      setBlocked(data.blocked || []);
    } catch { setBlocked([]); }
  };

  const savePost = async () => {
    if (!newPost.trim()) { setErrMsg('أدخل محتوى المنشور'); return; }
    setSaving(true); setErrMsg('');
    try {
      if (editPost) {
        const res = await fetch(`/api/social?id=${editPost.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ content: newPost, title: newPostTitle }) });
        const data = await res.json();
        if (!res.ok) { setErrMsg(data.error || 'فشل التعديل'); return; }
      } else {
        const res = await fetch('/api/social', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ action: 'create_post', content: newPost, title: newPostTitle }) });
        const data = await res.json();
        if (!res.ok) { setErrMsg(data.error || 'فشل النشر'); return; }
      }
      setNewPost(''); setNewPostTitle(''); setShowNewPost(false); setEditPost(null); setErrMsg('');
      fetchPosts();
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const handleEditPost = (post: any) => {
    setEditPost(post);
    setNewPost(post.content || '');
    setNewPostTitle(post.title || '');
    setErrMsg('');
    setShowNewPost(true);
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
      fetchComments(postId); fetchPosts();
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

  const pinPost = async (postId: number, pinned: boolean) => {
    try {
      await fetch('/api/community', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ id: postId, pinned: !pinned }) });
      fetchPosts();
    } catch { console.error('pin error'); }
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

  const filteredPosts = posts.filter(p => {
    const matchSearch = !searchText || p.content?.includes(searchText) || p.user_name?.includes(searchText);
    const matchFilter = filterType === 'all' || (filterType === 'mine' && p.user_id === currentUser?.id) || (filterType === 'pinned' && p.pinned);
    return matchSearch && matchFilter;
  });

  const stats = {
    total: posts.length,
    today: posts.filter(p => new Date(p.created_at).toDateString() === new Date().toDateString()).length,
    myPosts: posts.filter(p => p.user_id === currentUser?.id).length,
    pinned: posts.filter(p => p.pinned).length,
  };

  const mainTabs = [
    { key: 'feed', label: 'المنشورات' },
    ...(isAdmin ? [
      { key: 'reports', label: 'البلاغات' },
      { key: 'blocked', label: 'المحظورون' },
      { key: 'stats', label: 'الإحصائيات' },
    ] : []),
  ];

  const postFilterTabs = [
    { key: 'all', label: 'الكل' },
    { key: 'mine', label: 'منشوراتي' },
    ...(isAdmin ? [{ key: 'pinned', label: 'المثبّتة' }] : []),
  ];

  if (loading) return <LoadingState message="جاري تحميل المجتمع..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="الملتقى المجتمعي"
        subtitle="تواصل مع زملائك وشارك أفكارك"
        icon={<Globe size={22} />}
        action={
          <button className="btn-gold" onClick={() => { setEditPost(null); setNewPost(''); setNewPostTitle(''); setShowNewPost(true); }}>
            <Pencil size={16} /> منشور جديد
          </button>
        }
      />

      <div className="stat-grid">
        <StatCard label="إجمالي المنشورات" value={stats.total} icon={<FileText size={20} />} color="#3B82F6" />
        <StatCard label="منشورات اليوم" value={stats.today} icon={<Calendar size={20} />} color="#10B981" />
        <StatCard label="منشوراتي" value={stats.myPosts} icon={<User size={20} />} color="#D4A843" />
        {isAdmin && <StatCard label="المثبّتة" value={stats.pinned} icon={<Pin size={20} />} color="#8B5CF6" />}
      </div>

      {isAdmin && (
        <FilterTabs tabs={mainTabs} active={activeTab} onChange={setActiveTab} />
      )}

      {/* تبويب المنشورات */}
      {activeTab === 'feed' && (
        <>
          {showNewPost && (
            <div className="dcard" style={{ marginBottom: 20, border: '1px solid rgba(201,162,39,0.3)' }}>
              <div className="post-author-row">
                <div className="avatar-circle avatar-gold">{currentUser?.name?.charAt(0) || '؟'}</div>
                <span className="cell-title">{currentUser?.name || 'مستخدم'}</span>
              </div>
              <input
                className="input-field"
                value={newPostTitle}
                onChange={e => setNewPostTitle(e.target.value)}
                placeholder="عنوان المنشور (اختياري)"
                style={{ marginBottom: 12 }}
              />
              <textarea
                className="input-field"
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="شارك أفكارك مع المجتمع..."
                style={{ minHeight: 120, resize: 'vertical' }}
              />
              {errMsg && <div className="error-msg">{errMsg}</div>}
              <div className="modal-footer" style={{ marginTop: 12 }}>
                <button className="btn-gold" onClick={savePost} disabled={!newPost.trim() || saving}>
                  {saving ? '⏳...' : editPost ? <><Pencil size={15} /> حفظ</> : 'نشر'}
                </button>
                <button className="btn-ghost" onClick={() => { setShowNewPost(false); setNewPost(''); setNewPostTitle(''); setEditPost(null); }}>
                  <X size={15} /> إلغاء
                </button>
              </div>
            </div>
          )}

          <div className="filters-bar">
            <SearchBar value={searchText} onChange={setSearchText} placeholder="ابحث في المنشورات..." />
            <FilterTabs tabs={postFilterTabs} active={filterType} onChange={setFilterType} />
          </div>

          {filteredPosts.length === 0 ? (
            <EmptyState icon={<Globe size={32} />} title="لا توجد منشورات" description="كن أول من ينشر في المجتمع" />
          ) : (
            <div className="posts-list">
              {filteredPosts.map((post: any) => (
                <div key={post.id} className={`dcard post-card ${post.pinned ? 'post-pinned' : ''}`}>
                  {post.pinned && (
                    <div className="pin-label"><Pin size={12} /> منشور مثبّت</div>
                  )}
                  <div className="post-header">
                    <div className="post-author">
                      <div className="avatar-circle avatar-blue">{post.user_name?.charAt(0) || '؟'}</div>
                      <div>
                        <div className="cell-title">{post.user_name || 'مستخدم'}</div>
                        <div className="cell-sub">{timeAgo(post.created_at)}</div>
                      </div>
                    </div>
                    <div className="action-btns">
                      {isAdmin && (
                        <button className={`btn-icon ${post.pinned ? 'btn-icon-gold' : 'btn-icon-ghost'}`} onClick={() => pinPost(post.id, post.pinned)} title={post.pinned ? 'إلغاء التثبيت' : 'تثبيت'}>
                          <Pin size={15} />
                        </button>
                      )}
                      {(post.user_id === currentUser?.id || isAdmin) && (
                        <>
                          <button className="btn-icon btn-icon-ghost" onClick={() => handleEditPost(post)}><Pencil size={15} /></button>
                          <button className="btn-icon btn-icon-red" onClick={() => deletePost(post.id)}><Trash2 size={15} /></button>
                        </>
                      )}
                    </div>
                  </div>
                  {post.title && <div className="post-title">{post.title}</div>}
                  <div className="post-content">{post.content}</div>
                  <div className="post-actions">
                    <button className={`post-action-btn ${post.user_liked ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>
                      <Heart size={15} /> {post.likes_count || 0}
                    </button>
                    <button className="post-action-btn" onClick={() => toggleComments(post.id)}>
                      <MessageCircle size={15} /> {post.comments_count || 0}
                    </button>
                  </div>
                  {showComments[post.id] && (
                    <div className="comments-section">
                      <div className="comment-input-row">
                        <input
                          className="input-field"
                          value={commentText[post.id] || ''}
                          onChange={e => setCommentText({ ...commentText, [post.id]: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                          placeholder="اكتب تعليقاً..."
                        />
                        <button className="btn-gold" onClick={() => addComment(post.id)}>إرسال</button>
                      </div>
                      {(comments[post.id] || []).map((c: any) => (
                        <div key={c.id} className="comment-item">
                          <div className="avatar-circle avatar-sm">{c.user_name?.charAt(0) || '؟'}</div>
                          <div>
                            <div className="comment-meta">
                              <span className="cell-title" style={{ fontSize: 13 }}>{c.user_name}</span>
                              <span className="cell-sub" style={{ fontSize: 11 }}>{timeAgo(c.created_at)}</span>
                            </div>
                            <div className="comment-text">{c.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* تبويب البلاغات */}
      {activeTab === 'reports' && isAdmin && (
        <div>
          <h2 className="section-title"><Siren size={18} /> البلاغات المُرسلة</h2>
          {reports.length === 0 ? (
            <EmptyState icon={<Check size={32} />} title="لا توجد بلاغات حالياً" description="المجتمع بخير" />
          ) : (
            <div className="posts-list">
              {reports.map((r: any, i: number) => (
                <div key={i} className="dcard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="cell-title">{r.reporter_name || 'مستخدم'} أبلغ عن منشور</div>
                    <div className="cell-sub">{r.reason || 'بدون سبب'}</div>
                  </div>
                  <button className="btn-sm btn-sm-red" onClick={() => deletePost(r.post_id)}><Trash2 size={13} /> حذف المنشور</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* تبويب المحظورون */}
      {activeTab === 'blocked' && isAdmin && (
        <div>
          <h2 className="section-title"><Ban size={18} /> المستخدمون المحظورون</h2>
          {blocked.length === 0 ? (
            <EmptyState icon={<Check size={32} />} title="لا يوجد مستخدمون محظورون" description="" />
          ) : (
            <div className="posts-list">
              {blocked.map((b: any, i: number) => (
                <div key={i} className="dcard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="cell-title">{b.user_name || 'مستخدم'}</div>
                  <button className="btn-sm btn-sm-green">رفع الحظر</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* تبويب الإحصائيات */}
      {activeTab === 'stats' && isAdmin && (
        <div>
          <h2 className="section-title"><BarChart3 size={18} /> إحصائيات المجتمع</h2>
          <div className="stat-grid">
            <StatCard label="إجمالي المنشورات" value={posts.length} icon={<FileText size={20} />} color="#3B82F6" />
            <StatCard label="إجمالي التفاعلات" value={posts.reduce((a, p) => a + (p.likes_count || 0), 0)} icon={<Heart size={20} />} color="#EF4444" />
            <StatCard label="إجمالي التعليقات" value={posts.reduce((a, p) => a + (p.comments_count || 0), 0)} icon={<MessageCircle size={20} />} color="#10B981" />
            <StatCard label="منشورات اليوم" value={posts.filter(p => new Date(p.created_at).toDateString() === new Date().toDateString()).length} icon={<Calendar size={20} />} color="#D4A843" />
            <StatCard label="المنشورات المثبّتة" value={posts.filter(p => p.pinned).length} icon={<Pin size={20} />} color="#8B5CF6" />
            <StatCard label="متوسط التفاعل" value={posts.length ? (posts.reduce((a, p) => a + (p.likes_count || 0), 0) / posts.length).toFixed(1) : 0} icon={<TrendingUp size={20} />} color="#F59E0B" />
          </div>
        </div>
      )}
    </div>
  );
}
