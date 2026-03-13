'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  verified: boolean;
  role?: string;
  created_at: string;
}

interface Post {
  id: number;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
}

interface ProfileData {
  user: User;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  posts: Post[];
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('matin_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    loadProfile();
  }, [userId]);

  useEffect(() => {
    if (currentUser && profileData) {
      checkFollowStatus();
    }
  }, [currentUser, profileData]);

  const loadProfile = async () => {
    try {
      const response = await fetch(`/api/profile?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!currentUser || !profileData) return;
    
    try {
      const response = await fetch(`/api/follow?followerId=${currentUser.id}&followingId=${profileData.user.id}`);
      const data = await response.json();
      if (data.success) {
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      alert('يجب تسجيل الدخول أولاً!');
      return;
    }

    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: currentUser.id,
          followingId: profileData?.user.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsFollowing(data.action === 'followed');
        loadProfile(); // Reload to update followers count
      }
    } catch (error) {
      console.error('Error following:', error);
    }
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

  if (isLoading) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #06060E 0%, #1B263B 50%, #243B53 100%)', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        جاري التحميل...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #06060E 0%, #1B263B 50%, #243B53 100%)', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        المستخدم غير موجود
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileData.user.id;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={{ background: 'linear-gradient(135deg, #06060E 0%, #1B263B 50%, #243B53 100%)', minHeight: '100vh' }} dir="rtl">
        
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
                color: '#06060E',
                boxShadow: '0 4px 12px rgba(201, 162, 39, 0.3)'
              }}>م</div>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#C9A227' }}>متين المجتمع</span>
            </Link>

            <Link href="/community" style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 6,
              color: 'white',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600
            }}>← العودة للمجتمع</Link>
          </div>
        </nav>

        {/* PROFILE HEADER */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: 32,
            marginBottom: 24
          }}>
            
            {/* User Info */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'flex-start' }}>
              <div style={{
                width: 120,
                height: 120,
                background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 64,
                flexShrink: 0,
                boxShadow: '0 8px 24px rgba(201, 162, 39, 0.3)'
              }}>{profileData.user.avatar}</div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', margin: 0 }}>
                    {profileData.user.name}
                  </h1>
                  {profileData.user.verified && (
                    <span style={{ fontSize: 24 }}>✓</span>
                  )}
                  {profileData.user.role && profileData.user.role !== 'user' && (
                    <span style={{
                      padding: '4px 12px',
                      background: 'rgba(201, 162, 39, 0.2)',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#C9A227'
                    }}>
                      {profileData.user.role === 'admin' ? 'مشرف' : profileData.user.role}
                    </span>
                  )}
                </div>
                
                <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 16 }}>
                  {profileData.user.bio}
                </p>

                <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 20 }}>
                  انضم في {new Date(profileData.user.created_at).toLocaleDateString('ar-SA')}
                </div>

                {!isOwnProfile && currentUser && (
                  <button
                    onClick={handleFollow}
                    style={{
                      padding: '10px 24px',
                      background: isFollowing ? 'transparent' : 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                      border: isFollowing ? '1px solid #C9A227' : 'none',
                      borderRadius: 8,
                      color: isFollowing ? '#C9A227' : '#06060E',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: isFollowing ? 'none' : '0 4px 12px rgba(201, 162, 39, 0.4)'
                    }}
                  >
                    {isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, paddingTop: 24, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#C9A227', marginBottom: 4 }}>
                  {profileData.stats.posts}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>منشور</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#C9A227', marginBottom: 4 }}>
                  {profileData.stats.followers}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>متابع</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#C9A227', marginBottom: 4 }}>
                  {profileData.stats.following}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>يتابع</div>
              </div>
            </div>

          </div>

          {/* Posts */}
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 20 }}>
            المنشورات ({profileData.stats.posts})
          </h2>

          {profileData.posts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: 'rgba(255, 255, 255, 0.7)', 
              padding: 60,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 12
            }}>
              لا توجد منشورات بعد
            </div>
          ) : (
            profileData.posts.map((post) => (
              <div key={post.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                padding: 20,
                marginBottom: 16
              }}>
                
                {/* Post Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24
                  }}>{profileData.user.avatar}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>
                      {profileData.user.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }}>
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
                      alt="Post" 
                      style={{ 
                        width: '100%', 
                        maxHeight: 500, 
                        objectFit: 'cover', 
                        borderRadius: 8 
                      }} 
                    />
                  </div>
                )}

                {/* Stats */}
                <div style={{ display: 'flex', gap: 20, paddingTop: 12, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                    <span>🤍</span>
                    <span>{post.likes_count}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                    <span>💬</span>
                    <span>{post.comments_count}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                    <span>🔗</span>
                    <span>{post.shares_count}</span>
                  </div>
                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </>
  );
}
