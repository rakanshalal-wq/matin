'use client';
import { useState } from 'react';
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState(0);
  return (
    <div dir="rtl" style={{ fontFamily: "IBM Plex Sans Arabic, sans-serif", background: '#06060E', color: '#EEEEF5', height: '100vh', overflow: 'hidden', display: 'flex' }}>
      <aside style={{ width: 260, flexShrink: 0, height: '100vh', background: '#08081A', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #D4A843, #E8C060)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#000' }}>م</div>
            <div><div style={{ fontSize: 17, fontWeight: 800 }}>متين</div><div style={{ fontSize: 9, color: 'rgba(238,238,245,0.55)' }}>المنصة</div></div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
          {['النظرة العامة', 'القائمة', 'الإعدادات'].map((item, i) => (
            <div key={i} onClick={() => setActiveNav(i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 14px', fontSize: 12, color: activeNav === i ? '#EEEEF5' : 'rgba(238,238,245,0.55)', cursor: 'pointer', borderRight: activeNav === i ? '3px solid #A78BFA' : '3px solid transparent', margin: '1px 5px 1px 0', borderRadius: '0 7px 7px 0', background: activeNav === i ? '#A78BFA' + '15' : 'transparent', fontWeight: activeNav === i ? 600 : 400 }}>
              <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg></span><span>{item}</span>{activeNav === i && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#A78BFA', marginRight: 'auto' }} />}
            </div>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <header style={{ height: 62, background: 'rgba(6,6,14,0.88)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
          <div><div style={{ fontSize: 16, fontWeight: 800 }}>الموارد البشرية للمدرسة</div><div style={{ fontSize: 10.5, color: 'rgba(238,238,245,0.35)' }}>النظرة العامة</div></div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#A78BFA' + '15', border: '1.5px solid ' + '#A78BFA' + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>المستخدم</div>
          </div>
        </header>
        <div style={{ flex: 1, padding: '18px 20px', overflowY: 'auto' }}>
          <div style={{ color: '#A78BFA', fontSize: 19, fontWeight: 800, marginBottom: 16 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> النظرة العامة</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            {[{ icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, value: '45', label: 'الموظفين', color: '#A78BFA' }, { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, value: '32', label: 'المعلمين', color: '#8B5CF6' }, { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8"/></svg>, value: '13', label: 'الإداريين', color: '#7C3AED' }, { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, value: '180K', label: 'الرواتب الشهرية', color: '#D4A843' }].map((stat, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 11, padding: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 18, background: stat.color + '20', color: stat.color }}>{stat.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.55)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

