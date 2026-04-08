'use client';
export const dynamic = "force-dynamic";
import { Ban, BarChart3, Calendar, Check, CheckCircle, FileText, Globe, Heart, MessageCircle, Newspaper, Pencil, Pin, Save, Search, Siren, Trash2, TrendingUp, User } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
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
 const [showModal, setShowModal] = useState(false);
 const [errMsg, setErrMsg] = useState('');

   const [editPost, setEditPost] = useState<any>(null);

 const isAdmin = ['admin', 'school_owner', 'university_owner', 'institute_owner', 'kindergarten_owner', 'training_owner', 'owner', 'super_admin'].includes(currentUser?.role);

 
  const queryClient = useQueryClient();
  // ⚡ React Query hooks
  const { data: socialData, isLoading: socialLoading } = useQuery({
    queryKey: ['community-social'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
      const r = await fetch('/api/social', { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
      if (!r.ok) return null;
      return r.json();
    },
    staleTime: 2 * 60 * 1000,
    enabled: typeof window !== 'undefined',
  });
  const { data: communityData, isLoading: communityLoading } = useQuery({
    queryKey: ['community-community'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
      const r = await fetch('/api/community', { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
      if (!r.ok) return null;
      return r.json();
    },
    staleTime: 2 * 60 * 1000,
    enabled: typeof window !== 'undefined',
  });
  const { data: community_1Data, isLoading: community_1Loading } = useQuery({
    queryKey: ['community-community'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
      const r = await fetch('/api/community?type=blocked', { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
      if (!r.ok) return null;
      return r.json();
    },
    staleTime: 2 * 60 * 1000,
    enabled: typeof window !== 'undefined',
  });

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
 const method = editPost ? 'PUT' : 'POST';
 const body = editPost
 ? JSON.stringify({ action: 'update_post', post_id: editPost, content: newPost, title: newPostTitle })
 : JSON.stringify({ action: 'create_post', content: newPost, title: newPostTitle });
 const res = await fetch('/api/social', { method, headers: getHeaders(), body });
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

 const filteredPosts = posts.filter((p: any) => {
 const matchSearch = !searchText || p.content?.includes(searchText) || p.user_name?.includes(searchText);
 const matchFilter = filterType === 'all' || (filterType === 'mine' && p.user_id === currentUser?.id) || (filterType === 'pinned' && p.pinned);
 return matchSearch && matchFilter;
 });

 const stats = {
 total: posts.length,
 today: posts.filter((p: any) => new Date(p.created_at).toDateString() === new Date().toDateString()).length,
 myPosts: posts.filter((p: any) => p.user_id === currentUser?.id).length,
 pinned: posts.filter((p: any) => p.pinned).length,
 };

 const tabs = [
 { id: 'feed', label: 'Newspaper المنشورات' },
 ...(isAdmin ? [
 { id: 'reports', label: 'Siren البلاغات' },
 { id: 'blocked', label: 'Ban المحظورون' },
 { id: 'stats', label: 'BarChart3 الإحصائيات' },
 ] : []),
 ];

 const cardStyle = { background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.08)' };

 return (
 <div>
 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_Globe" size={18} /> الملتقى المجتمعي</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>تواصل مع زملائك وشارك أفكارك</p>
 </div>
 <button onClick={() => setShowNewPost(true)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', border: 'none', borderRadius: 10, color: '#06060E', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
 <Pencil size={16} /> منشور جديد
 </button>
 </div>

 {/* الإحصائيات */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي المنشورات', value: stats.total, icon: "ICON_FileText", color: '#3B82F6' },
 { label: 'منشورات اليوم', value: stats.today, icon: "ICON_Calendar", color: '#10B981' },
 { label: 'منشوراتي', value: stats.myPosts, icon: "ICON_User", color: '#C9A227' },
 ...(isAdmin ? [{ label: 'المثبّتة', value: stats.pinned, icon: "ICON_Pin", color: '#8B5CF6' }] : []),
 ].map((s, i) => (
 <div key={i} style={cardStyle}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <span style={{ fontSize: 28 }}><IconRenderer name={s.icon} /></span>
 <div>
 <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
 <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* التبويبات (للمدير فقط) */}
 {isAdmin && (
 <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
 {tabs.map((t: any) => (
 <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '10px 20px', background: activeTab === t.id ? 'linear-gradient(135deg, #C9A227, #D4B03D)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (activeTab === t.id ? 'transparent' : 'rgba(255,255,255,0.1)'), borderRadius: 10, color: activeTab === t.id ? '#06060E' : 'rgba(255,255,255,0.7)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
 {t.label}
 </button>
 ))}
 </div>
 )}

 {/* تبويب المنشورات */}
 {activeTab === 'feed' && (
 <>
 {/* نموذج منشور جديد */}
 {showNewPost && (
 <div style={{ ...cardStyle, marginBottom: 24, border: '1px solid rgba(201,162,39,0.3)' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
 <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A227, #D4B03D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#06060E' }}>
 {currentUser?.name?.charAt(0) || '؟'}
 </div>
 <div style={{ color: 'white', fontWeight: 600 }}>{currentUser?.name || 'مستخدم'}</div>
 </div>
 <input value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} placeholder="عنوان المنشور (اختياري)" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', direction: 'rtl', marginBottom: 12, boxSizing: 'border-box' }} />
 <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="شارك أفكارك مع المجتمع..." style={{ width: '100%', minHeight: 120, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: 'white', fontSize: 15, resize: 'vertical', outline: 'none', direction: 'rtl', boxSizing: 'border-box' }} />
 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
 <button onClick={() => { setShowNewPost(false); setNewPost(''); setNewPostTitle(''); }} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>إلغاء</button>
 <button onClick={savePost} disabled={!newPost.trim()} style={{ padding: '10px 24px', background: newPost.trim() ? 'linear-gradient(135deg, #C9A227, #D4B03D)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: newPost.trim() ? '#06060E' : 'rgba(255,255,255,0.3)', fontWeight: 700, cursor: newPost.trim() ? 'pointer' : 'default', fontSize: 14 }}>{saving ? '⏳...' : editPost ? 'Save حفظ' : 'نشر'}</button>
 </div>
 </div>
 )}

 {/* فلاتر البحث */}
 <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
 <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search ابحث في المنشورات..." style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', direction: 'rtl' }} />
 {['all', 'mine', ...(isAdmin ? ['pinned'] : [])].map((f: any) => (
 <button key={f} onClick={() => setFilterType(f)} style={{ padding: '10px 18px', background: filterType === f ? 'rgba(201,162,39,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (filterType === f ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.1)'), borderRadius: 10, color: filterType === f ? '#C9A227' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
 {f === 'all' ? 'الكل' : f === 'mine' ? 'منشوراتي' : 'المثبّتة'}
 </button>
 ))}
 </div>

 {/* المنشورات */}
 {loading ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.5)' }}>جاري التحميل...</div>
 ) : filteredPosts.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(59,130,246,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Globe size={19} color="#3B82F6" /></div>
 <div style={{ fontSize: 18, fontWeight: 600 }}>لا توجد منشورات</div>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
 {filteredPosts.map((post: any) => (
 <div key={post.id} style={{ ...cardStyle, border: post.pinned ? '1px solid rgba(201,162,39,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
 {post.pinned && <div style={{ color: '#C9A227', fontSize: 12, fontWeight: 700, marginBottom: 8 }}><IconRenderer name="ICON_Pin" size={18} /> منشور مثبّت</div>}
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
 <div style={{ display: 'flex', gap: 8 }}>
 {isAdmin && (
 <button onClick={() => pinPost(post.id, post.pinned)} title={post.pinned ? 'إلغاء التثبيت' : 'تثبيت'} style={{ background: 'none', border: 'none', color: post.pinned ? '#C9A227' : 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 16 }}>Pin</button>
 )}
 {(post.user_id === currentUser?.id || isAdmin) && (
 <button onClick={() => deletePost(post.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 18 }}>Trash2</button>
 )}
 </div>
 </div>
 {post.title && <div style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{post.title}</div>}
 <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.8, marginBottom: 16, whiteSpace: 'pre-wrap', direction: 'rtl' }}>{post.content}</div>
 {/* أزرار التفاعل */}
 <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
 <button onClick={() => toggleLike(post.id)} style={{ background: 'none', border: 'none', color: post.user_liked ? '#EF4444' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
 {post.user_liked ? '<Heart size={16} />' : "ICON_Heart"} {post.likes_count || 0}
 </button>
 <button onClick={() => toggleComments(post.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
 MessageCircle {post.comments_count || 0}
 </button>
 </div>
 {/* التعليقات */}
 {showComments[post.id] && (
 <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
 <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
 <input value={commentText[post.id] || ''} onChange={e => setCommentText({ ...commentText, [post.id]: e.target.value })} onKeyDown={e => e.key === 'Enter' && addComment(post.id)} placeholder="اكتب تعليقاً..." style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', direction: 'rtl' }} />
 <button onClick={() => addComment(post.id)} style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #C9A227, #D4B03D)', border: 'none', borderRadius: 8, color: '#06060E', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>إرسال</button>
 </div>
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
 </>
 )}

 {/* تبويب البلاغات - للمدير فقط */}
 {activeTab === 'reports' && isAdmin && (
 <div>
 <h2 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}><IconRenderer name="ICON_Siren" size={18} /> البلاغات المُرسلة</h2>
 {reports.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(16,185,129,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={19} color="#10B981" /></div>
 <div>لا توجد بلاغات حالياً</div>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
 {reports.map((r: any, i: number) => (
 <div key={i} style={cardStyle}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div>
 <div style={{ color: 'white', fontWeight: 600 }}>{r.reporter_name || 'مستخدم'} أبلغ عن منشور</div>
 <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>{r.reason || 'بدون سبب'}</div>
 </div>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => deletePost(r.post_id)} style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#EF4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>حذف المنشور</button>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* تبويب المحظورون - للمدير فقط */}
 {activeTab === 'blocked' && isAdmin && (
 <div>
 <h2 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}><IconRenderer name="ICON_Ban" size={18} /> المستخدمون المحظورون</h2>
 {blocked.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(16,185,129,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={19} color="#10B981" /></div>
 <div>لا يوجد مستخدمون محظورون</div>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
 {blocked.map((b: any, i: number) => (
 <div key={i} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div style={{ color: 'white', fontWeight: 600 }}>{b.user_name || 'مستخدم'}</div>
 <button style={{ padding: '8px 16px', background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, color: '#22C55E', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>رفع الحظر</button>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* تبويب الإحصائيات - للمدير فقط */}
 {activeTab === 'stats' && isAdmin && (
 <div>
 <h2 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}><IconRenderer name="ICON_BarChart3" size={18} /> إحصائيات المجتمع</h2>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
 {[
 { label: 'إجمالي المنشورات', value: posts.length, icon: "ICON_FileText", color: '#3B82F6' },
 { label: 'إجمالي التفاعلات', value: posts.reduce((a, p) => a + (p.likes_count || 0), 0), icon: '<Heart size={16} />', color: '#EF4444' },
 { label: 'إجمالي التعليقات', value: posts.reduce((a, p) => a + (p.comments_count || 0), 0), icon: "ICON_MessageCircle", color: '#10B981' },
 { label: 'منشورات اليوم', value: posts.filter((p: any) => new Date(p.created_at).toDateString() === new Date().toDateString()).length, icon: "ICON_Calendar", color: '#C9A227' },
 { label: 'المنشورات المثبّتة', value: posts.filter((p: any) => p.pinned).length, icon: "ICON_Pin", color: '#8B5CF6' },
 { label: 'متوسط التفاعل', value: posts.length ? (posts.reduce((a, p) => a + (p.likes_count || 0), 0) / posts.length).toFixed(1) : 0, icon: "ICON_TrendingUp", color: '#F59E0B' },
 ].map((s, i) => (
 <div key={i} style={cardStyle}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <span style={{ fontSize: 32 }}><IconRenderer name={s.icon} /></span>
 <div>
 <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
 <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 );
}
