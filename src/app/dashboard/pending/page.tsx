'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import { logoutUser } from '@/lib/logout';
import { useRouter } from 'next/navigation';
import { Clock, ShieldCheck, Mail, Headphones, LogOut } from 'lucide-react';


export default function PendingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('matin_user');
    if (!u) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(u);
    setUser(parsed);
    
    // إذا تم تفعيله وهو في هذه الصفحة، نقله للداشبورد
    if (parsed.status === 'active') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogout = () => { logoutUser(router); };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'var(--font)', 
      direction: 'rtl',
      padding: 20 
    }}>
      {/* Background Glows */}
      <div style={{ position: 'fixed', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -200, left: -200, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 550, position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ 
          width: 80, height: 80, 
          background: 'linear-gradient(135deg, #D4A843 0%, #E2C46A 100%)', 
          borderRadius: 22, margin: '0 auto 32px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(201,168,76,0.3)',
          fontSize: 36, fontWeight: 900, color: '#000'
        }}>م</div>

        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid rgba(201,168,76,0.15)', 
          borderRadius: 24, padding: '48px 40px', 
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)'
        }}>
          <div style={{ 
            width: 64, height: 64, 
            background: 'rgba(201,168,76,0.1)', 
            borderRadius: '50%', margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(201,168,76,0.2)'
          }}>
            <Clock size={32} color="#D4A843" />
          </div>

          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 12 }}>حسابك قيد المراجعة</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            مرحباً بك في منصة متين. لقد استلمنا طلب تسجيل مؤسستك التعليمية بنجاح. يقوم فريقنا الآن بمراجعة البيانات لضمان أعلى معايير الجودة والأمان.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              <ShieldCheck size={20} color="#D4A843" style={{ marginBottom: 8 }} />
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>حالة الطلب</div>
              <div style={{ color: 'var(--gold)', fontSize: 12, fontWeight: 600, marginTop: 4 }}>بانتظار الموافقة</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              <Mail size={20} color="#D4A843" style={{ marginBottom: 8 }} />
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>التفعيل</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>ستصلك رسالة إيميل فور التفعيل</div>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 0 32px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button 
              onClick={() => window.location.href = 'mailto:support@matin.ink'}
              style={{ 
                width: '100%', padding: '14px', 
                background: 'rgba(201,168,76,0.08)', 
                color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.2)', 
                borderRadius: 12, fontSize: 15, fontWeight: 700, 
                cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              <Headphones size={18} /> تواصل مع الدعم الفني
            </button>
            <button 
              onClick={handleLogout}
              style={{ 
                width: '100%', padding: '14px', 
                background: 'none', 
                color: 'rgba(255,255,255,0.4)', border: 'none', 
                borderRadius: 12, fontSize: 14, fontWeight: 600, 
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              <LogOut size={16} /> تسجيل الخروج
            </button>
          </div>
        </div>
        
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, marginTop: 32 }}>
          مطوّر بواسطة <span style={{ color: 'var(--gold)', fontWeight: 700 }}>متين</span>
        </p>
      </div>
    </div>
  );
}
