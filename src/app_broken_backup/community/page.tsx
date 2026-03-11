'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  verified: boolean;
  role?: string;
}

interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  created_at: string;
  author_name: string;
  author_avatar: string;
  author_verified: boolean;
  author_role?: string;
}

interface Post {
  id: number;
  user_id: number;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  author_name: string;
  author_avatar: string;
  author_bio: string;
  author_verified: boolean;
  author_role?: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Comments
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const [comments, setComments] = useState<{[key: number]: Comment[]}>({});
  const [newComment, setNewComment] = useState<{[key: number]: string}>({});

  // Login/Register Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerBio, setRegisterBio] = useState('');
  const [registerAvatar, setRegisterAvatar] = useState('👤');

  const avatars = ['👤', '👨', '👩', '👨‍💼', '👩‍💼', '👨‍🏫', '👩‍🏫', '👨‍🎓', '👩‍🎓', '🧑‍💻'];

  useEffect(() => {
    const savedUser = localStorage.getItem('matin_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts/comments?postId=${postId}`);
      const data = await response.json();
      if (data.success) {
        setComments(prev => ({...prev, [postId]: data.comments}));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const toggleComments = (postId: number) => {
    const newShowState = !showComments[postId];
    setShowComments(prev => ({...prev, [postId]: newShowState}));
    
    if (newShowState && !comments[postId]) {
      loadComments(postId);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setSelectedImage(data.imageUrl);
      } else {
        alert(data.error || 'حدث خطأ في رفع الصورة');
      }
    } catch (error) {
      alert('حدث خطأ في رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!currentUser) {
      alert('يجب تسجيل الدخول أولاً!');
      setShowLogin(true);
      return;
    }

    const content = newComment[postId]?.trim();
    if (!content) {
      alert('الرجاء كتابة تعليق');
      return;
    }

    try {
      const response = await fetch('/api/posts/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          postId: postId,
          content: content
        })
      });

      if (response.ok) {
        setNewComment(prev => ({...prev, [postId]: ''}));
        loadComments(postId);
        loadPosts();
      }
    } catch (error) {
      alert('حدث خطأ في إضافة التعليق');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('matin_user', JSON.stringify(data.user));
        setShowLogin(false);
        setLoginEmail('');
        setLoginPassword('');
        alert('تم تسجيل الدخول بنجاح! 🎉');
      } else {
        alert(data.error || 'حدث خطأ في تسجيل الدخول');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          bio: registerBio,
          avatar: registerAvatar
        })
      });

      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('matin_user', JSON.stringify(data.user));
        setShowRegister(false);
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterBio('');
        alert('تم التسجيل بنجاح! 🎉');
      } else {
        alert(data.error || 'حدث خطأ في التسجيل');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال');
    }
  };

  const handleAddPost = async () => {
    if (!currentUser) {
      alert('يجب تسجيل الدخول أولاً!');
      setShowLogin(true);
      return;
    }

    if (!newPost.trim() && !selectedImage) {
      alert('الرجاء كتابة محتوى أو إضافة صورة');
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          content: newPost,
          imageUrl: selectedImage
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewPost('');
        setSelectedImage(null);
        loadPosts();
        alert('تم نشر المنشور بنجاح! 🎉');
      }
    } catch (error) {
      alert('حدث خطأ في النشر');
    }
  };

  const handleLike = async (postId: number) => {
    if (!currentUser) {
      alert('يجب تسجيل الدخول أولاً!');
      setShowLogin(true);
      return;
    }

    try {
      const response = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          postId: postId
        })
      });

      if (response.ok) {
        loadPosts();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('matin_user');
    alert('تم تسجيل الخروج');
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #243B53 100%)', minHeight: '100vh' }} dir="rtl">
        
        {/* NAVBAR */}
        <nav style={{ 
          position: 'sticky', 
          top: 0, 
          background: 'rgba(13, 27, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
          zIndex: 1000,
          padding: '16px 0'
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 700,
                color: '#0D1B2A',
                boxShadow: '0 4px 12px rgba(201, 162, 39, 0.3)'
              }}>م</div>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#C9A227' }}>متين المجتمع</span>
            </Link>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {currentUser ? (
                <>
                  <Link 
                    href={`/profile/${currentUser.id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                  >
                    <span style={{ fontSize: 24 }}>{currentUser.avatar}</span>
                    <span style={{ color: 'white', fontSize: 14 }}>{currentUser.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '10px 20px',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: 6,
                      color: 'white',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    style={{
                      padding: '10px 20px',
                      background: 'transparent',
                      border: '1px solid #C9A227',
                      borderRadius: 6,
                      color: '#C9A227',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                      border: 'none',
                      borderRadius: 6,
                      color: '#0D1B2A',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(201, 162, 39, 0.3)'
                    }}
                  >
                    التسجيل
                  </button>
                </>
              )}
              
              <Link href="/" style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 6,
                color: 'white',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600
              }}>الرئيسية</Link>
            </div>
          </div>
        </nav>

        {/* Login Modal */}
        {showLogin && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 24
          }} onClick={() => setShowLogin(false)}>
            <div style={{
              background: '#0D1B2A',
              borderRadius: 12,
              padding: 32,
              maxWidth: 400,
              width: '100%',
              border: '1px solid rgba(201, 162, 39, 0.3)'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 24 }}>
                تسجيل الدخول
              </h3>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    marginBottom: 16,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 8,
                    color: 'white',
                    fontSize: 15,
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    marginBottom: 24,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 8,
                    color: 'white',
                    fontSize: 15,
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: 12,
                    background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#0D1B2A',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  دخول
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Register Modal */}
        {showRegister && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 24,
            overflowY: 'auto'
          }} onClick={() => setShowRegister(false)}>
            <div style={{
              background: '#0D1B2A',
              borderRadius: 12,
              padding: 32,
              maxWidth: 400,
              width: '100%',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              margin: '20px 0'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 24 }}>
                إنشاء حساب جديد
              </h3>
              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    marginBottom: 16,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 8,
                    color: 'white',
                    fontSize: 15,
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    marginBottom: 16,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 8,
                    color: 'white',
                    fontSize: 15,
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    marginBottom: 16,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 8,
                    color: 'white',
                    fontSize: 15,
                    boxSizing: 'border-box'
                  }}
                />
                <textarea
                  placeholder="نبذة عنك (اختياري)"
                  value={registerBio}
                  onChange={(e) => setRegisterBio(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 12,
                    marginBottom: 16,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 8,
                    color: 'white',
                    fontSize: 15,
                    minHeight: 80,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', color: 'white', fontSize: 14, marginBottom: 8 }}>
                    اختر صورتك الشخصية:
                  </label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {avatars.map(av => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setRegisterAvatar(av)}
                        style={{
                          fontSize: 32,
                          padding: 8,
                          background: registerAvatar === av ? 'rgba(201, 162, 39, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                          border: registerAvatar === av ? '2px solid #C9A227' : '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 8,
                          cursor: 'pointer'
                        }}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: 12,
                    background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#0D1B2A',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  إنشاء حساب
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
          
          {/* Info Banner */}
          <div style={{
            background: 'rgba(201, 162, 39, 0.1)',
            border: '1px solid rgba(201, 162, 39, 0.3)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌟</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>
              منصة شفافة ومفتوحة
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' }}>
              ✅ مفتوحة للجميع | ⛔ ممنوع الرسائل الخاصة | 🔒 شفافية كاملة
            </p>
          </div>

          {/* Create Post */}
          {currentUser && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24
            }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <Link href={`/profile/${currentUser.id}`}>
                  <div style={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}>{currentUser.avatar}</div>
                </Link>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="شارك ما يدور في ذهنك..."
                  style={{
                    flex: 1,
                    minHeight: 100,
                    padding: 12,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 8,
                    color: 'white',
                    fontSize: 15,
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Image Preview */}
              {selectedImage && (
                <div style={{ marginBottom: 12, position: 'relative' }}>
                  <img 
                    src={selectedImage} 
                    alt="Preview" 
                    style={{ 
                      width: '100%', 
                      maxHeight: 400, 
                      objectFit: 'cover', 
                      borderRadius: 8 
                    }} 
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      padding: '6px 12px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: 'none',
                      borderRadius: 6,
                      color: 'white',
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    ✕ حذف
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 6,
                    color: 'white',
                    fontSize: 13,
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                    opacity: uploadingImage ? 0.5 : 1
                  }}>
                    {uploadingImage ? '⏳ جاري الرفع...' : '📷 صورة'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <button
                  onClick={handleAddPost}
                  style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#0D1B2A',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(201, 162, 39, 0.4)'
                  }}
                >
                  نشر
                </button>
              </div>
            </div>
          )}

          {/* Posts */}
          {isLoading ? (
            <div style={{ textAlign: 'center', color: 'white', padding: 40 }}>
              جاري التحميل...
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: 40 }}>
              لا توجد منشورات بعد. كن أول من ينشر! 🚀
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                padding: 20,
                marginBottom: 16
              }}>
                
                {/* Author */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <Link href={`/profile/${post.user_id}`}>
                    <div style={{
                      width: 48,
                      height: 48,
                      background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                      cursor: 'pointer'
                    }}>{post.author_avatar}</div>
                  </Link>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Link href={`/profile/${post.user_id}`} style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'white', cursor: 'pointer' }}>
                          {post.author_name}
                        </span>
                      </Link>
                      {post.author_verified && (
                        <span style={{ fontSize: 16 }}>✓</span>
                      )}
                      {post.author_role && post.author_role !== 'user' && (
                        <span style={{
                          padding: '2px 8px',
                          background: 'rgba(201, 162, 39, 0.2)',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#C9A227'
                        }}>
                          {post.author_role === 'admin' ? 'مشرف' : post.author_role}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)' }}>
                      {post.author_bio}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', marginTop: 4 }}>
                      {getTimeAgo(post.created_at)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, marginBottom: post.image_url ? 12 : 16 }}>
                  {post.content}
                </div>

                {/* Image */}
                {post.image_url && (
                  <div style={{ marginBottom: 16 }}>
                    <img 
                      src={post.image_url} 
                      alt="Post image" 
                      style={{ 
                        width: '100%', 
                        maxHeight: 500, 
                        objectFit: 'cover', 
                        borderRadius: 8 
                      }} 
                    />
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 20, paddingTop: 12, borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: 12 }}>
                  <button
                    onClick={() => handleLike(post.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: 14,
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                  >
                    <span>🤍</span>
                    <span>{post.likes_count}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: 14,
                      cursor: 'pointer'
                    }}
                  >
                    <span>💬</span>
                    <span>{post.comments_count}</span>
                  </button>

                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 14,
                    cursor: 'pointer'
                  }}>
                    <span>🔗</span>
                    <span>{post.shares_count}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <div style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    
                    {/* Add Comment */}
                    {currentUser && (
                      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        <input
                          type="text"
                          placeholder="اكتب تعليقاً..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment(prev => ({...prev, [post.id]: e.target.value}))}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(post.id);
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: 10,
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 8,
                            color: 'white',
                            fontSize: 14
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          style={{
                            padding: '10px 20px',
                            background: 'rgba(201, 162, 39, 0.2)',
                            border: '1px solid #C9A227',
                            borderRadius: 8,
                            color: '#C9A227',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          إرسال
                        </button>
                      </div>
                    )}

                    {/* Comments List */}
                    {comments[post.id] && comments[post.id].length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {comments[post.id].map((comment) => (
                          <div key={comment.id} style={{
                            display: 'flex',
                            gap: 10,
                            padding: 12,
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: 8
                          }}>
                            <Link href={`/profile/${comment.user_id}`}>
                              <div style={{
                                width: 36,
                                height: 36,
                                background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                                flexShrink: 0,
                                cursor: 'pointer'
                              }}>{comment.author_avatar}</div>
                            </Link>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <Link href={`/profile/${comment.user_id}`} style={{ textDecoration: 'none' }}>
                                  <span style={{ fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer' }}>
                                    {comment.author_name}
                                  </span>
                                </Link>
                                {comment.author_verified && (
                                  <span style={{ fontSize: 12 }}>✓</span>
                                )}
                                <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' }}>
                                  · {getTimeAgo(comment.created_at)}
                                </span>
                              </div>
                              <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.5 }}>
                                {comment.content}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, padding: 20 }}>
                        لا توجد تعليقات بعد. كن أول من يعلق!
                      </div>
                    )}

                  </div>
                )}

              </div>
            ))
          )}

        </div>

        {/* FOOTER */}
        <footer style={{ padding: '40px 24px', borderTop: '1px solid rgba(201, 162, 39, 0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)' }}>
            © 2026 متين - منصة اجتماعية شفافة بدون رسائل خاصة
          </p>
        </footer>

      </div>
    </>
  );
}
