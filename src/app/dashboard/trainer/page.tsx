'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C';
const DARK = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

const toast = (msg: string, color = G) => {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '24px', right: '24px', background: color, color: '#fff',
    padding: '12px 20px', borderRadius: '10px', fontWeight: 700, zIndex: '9999',
    fontSize: '14px', fontFamily: 'inherit', direction: 'rtl',
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};

export default function TrainerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [trainees, setTrainees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'trainees' | 'sessions'>('overview');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [progRes, traineeRes] = await Promise.all([
        fetch('/api/training', { headers: getHeaders() }),
        fetch('/api/students', { headers: getHeaders() }),
      ]);
      const [progData, traineeData] = await Promise.all([progRes.json(), traineeRes.json()]);
      setPrograms(Array.isArray(progData) ? progData : []);
      setTrainees(Array.isArray(traineeData) ? traineeData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', headers: getHeaders() });
    } catch {}
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
    document.cookie = 'matin_token=; Max-Age=0; path=/';
    window.location.href = '/login';
  };

  const TAB_BTN = (tab: typeof activeTab, label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        background: activeTab === tab ? G : 'rgba(255,255,255,0.04)',
        color: activeTab === tab ? DARK : 'rgba(238,238,245,0.7)',
        border: `1px solid ${activeTab === tab ? G : BORDER}`,
        borderRadius: 10, padding: '8px 18px', fontWeight: 700,
        fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
      }}
    >{label}</button>
  );

  return (
    <div dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: DARK, color: '#EEEEF5', minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, flexShrink: 0, background: '#08081A', borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${G}, #E8C060)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#000' }}>م</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#EEEEF5' }}>متين</div>
              <div style={{ fontSize: 10, color: 'rgba(238,238,245,0.4)' }}>المنصة التعليمية</div>
            </div>
          </Link>
          {user && (
            <div style={{ marginTop: 14, background: `rgba(201,168,76,0.1)`, border: `1px solid ${G}30`, borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{user.name || 'المدرّب'}</div>
              <div style={{ color: G, fontSize: 11, marginTop: 2 }}>مدرّب معتمد</div>
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {[
            { tab: 'overview', label: 'النظرة العامة', icon: '📊' },
            { tab: 'programs', label: 'برامج التدريب', icon: '📚' },
            { tab: 'trainees', label: 'المتدربون', icon: '👥' },
            { tab: 'sessions', label: 'الجلسات', icon: '🎯' },
          ].map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '9px 14px', border: 'none',
                background: activeTab === tab ? `rgba(201,168,76,0.1)` : 'transparent',
                borderRight: activeTab === tab ? `3px solid ${G}` : '3px solid transparent',
                color: activeTab === tab ? '#EEEEF5' : 'rgba(238,238,245,0.55)',
                fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer', textAlign: 'right', fontFamily: 'inherit',
                borderRadius: '0 8px 8px 0', margin: '1px 0',
              }}
            >
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '9px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, color: '#F87171', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >🚪 تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <header style={{ height: 62, background: 'rgba(6,6,14,0.9)', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>لوحة المدرّب</div>
            <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.4)' }}>مركز التدريب — إدارة البرامج والمتدربين</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/dashboard/training" style={{ background: G, color: DARK, padding: '8px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>+ برنامج جديد</Link>
          </div>
        </header>

        <div style={{ padding: 24 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'rgba(238,238,245,0.4)' }}>⏳ جارٍ التحميل...</div>
          ) : (
            <>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                {TAB_BTN('overview', '📊 النظرة العامة')}
                {TAB_BTN('programs', '📚 البرامج')}
                {TAB_BTN('trainees', '👥 المتدربون')}
                {TAB_BTN('sessions', '🎯 الجلسات')}
              </div>

              {activeTab === 'overview' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                    {[
                      { label: 'البرامج النشطة', value: programs.filter(p => p.status === 'active').length || programs.length, color: G, icon: '📚' },
                      { label: 'المتدربون', value: trainees.length, color: '#3B82F6', icon: '👥' },
                      { label: 'الجلسات هذا الأسبوع', value: 0, color: '#10B981', icon: '🎯' },
                      { label: 'نسبة الإنجاز', value: '78%', color: '#8B5CF6', icon: '📈' },
                    ].map((s, i) => (
                      <div key={i} style={{ background: CARD, border: `1px solid ${s.color}25`, borderRadius: 14, padding: '20px 24px' }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{s.label}</div>
                        <div style={{ color: s.color, fontSize: 28, fontWeight: 800, marginTop: 4 }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Links */}
                  <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>روابط سريعة</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                      {[
                        { label: 'إدارة البرامج', href: '/dashboard/training', icon: '📚' },
                        { label: 'قائمة المتدربين', href: '/dashboard/students', icon: '👥' },
                        { label: 'الجدول الزمني', href: '/dashboard/schedule', icon: '📅' },
                        { label: 'تقارير الأداء', href: '/dashboard/reports', icon: '📊' },
                      ].map((link, i) => (
                        <Link key={i} href={link.href} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
                          borderRadius: 10, padding: '12px 16px', textDecoration: 'none',
                          color: '#EEEEF5', fontSize: 13, fontWeight: 600,
                        }}>
                          <span>{link.icon}</span><span>{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'programs' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>برامج التدريب ({programs.length})</div>
                    <Link href="/dashboard/training" style={{ background: G, color: DARK, padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>+ إضافة برنامج</Link>
                  </div>
                  {programs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'rgba(238,238,245,0.4)' }}>لا توجد برامج بعد</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                      {programs.map((p: any) => (
                        <div key={p.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
                          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{p.name || p.title}</div>
                          <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 13, marginBottom: 12 }}>{p.description}</div>
                          <Link href={`/dashboard/training`} style={{ color: G, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>عرض التفاصيل ←</Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'trainees' && (
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>المتدربون ({trainees.length})</div>
                  <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                          {['الاسم', 'البريد', 'البرنامج', 'الإجراءات'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'rgba(238,238,245,0.6)', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {trainees.slice(0, 20).map((t: any) => (
                          <tr key={t.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                            <td style={{ padding: '12px 16px', fontSize: 14 }}>{t.name}</td>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(238,238,245,0.6)' }}>{t.email}</td>
                            <td style={{ padding: '12px 16px', fontSize: 13 }}>{t.class_name || '—'}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <Link href={`/dashboard/students`} style={{ color: G, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>عرض</Link>
                            </td>
                          </tr>
                        ))}
                        {trainees.length === 0 && (
                          <tr><td colSpan={4} style={{ padding: 30, textAlign: 'center', color: 'rgba(238,238,245,0.4)' }}>لا يوجد متدربون بعد</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'sessions' && (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>إدارة الجلسات</div>
                  <div style={{ color: 'rgba(238,238,245,0.5)', marginBottom: 24 }}>اضغط هنا لإنشاء جلسة تدريبية جديدة</div>
                  <button
                    onClick={() => toast('قريباً — جلسات التدريب المباشر', G)}
                    style={{ background: G, color: DARK, padding: '12px 28px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
                  >+ جلسة تدريبية جديدة</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
