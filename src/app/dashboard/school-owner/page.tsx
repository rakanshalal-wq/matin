'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, GraduationCap, School, Baby, Bus, 
  Settings, Bell, LogOut, Plus, ChevronDown, Menu, X,
  Wallet, FileText, Shield, Calendar, TrendingUp, BookOpen,
  ClipboardCheck, CreditCard, Building2, UserCheck, AlertCircle
} from 'lucide-react';
import { getHeaders } from '@/lib/api';

/* ═══════════════════════════════════════════════════════════════════
   SCHOOL OWNER DASHBOARD — متين v6
   للمدارس التابعة لمنصة متين (تحت إدارة مالك المنصة)
   Primary: #34D399 (Green) | Secondary: #D4A843 (Gold)
   ═══════════════════════════════════════════════════════════════════ */

const C = '#34D399';      // Green Primary
const C2 = '#059669';     // Green Dark
const CD = 'rgba(52,211,153,0.1)';  // Green Dim
const CB = 'rgba(52,211,153,0.22)'; // Green Border
const GD = '#D4A843';     // Gold (للإشارة إنها تحت منصة متين)
const GD2 = '#E8C060';
const BG = '#06060E';
const SB = '#070F0A';     // Sidebar Green-tinted
const CARD = 'rgba(255,255,255,0.025)';
const BORDER = 'rgba(255,255,255,0.07)';
const BORDER2 = 'rgba(255,255,255,0.04)';
const TEXT = '#EEEEF5';
const TEXT_DIM = 'rgba(238,238,245,0.55)';
const TEXT_MUTED = 'rgba(238,238,245,0.28)';
const GREEN = '#10B981';
const RED = '#EF4444';
const BLUE = '#60A5FA';
const PURPLE = '#A78BFA';
const ORANGE = '#FB923C';
const CYAN = '#22D3EE';

// أنواع الوحدات التعليمية
const UNIT_TYPES = {
  school: { icon: '🏫', label: 'مدرسة', color: BLUE, bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.2)' },
  kg: { icon: '🌱', label: 'روضة', color: GREEN, bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.2)' },
  nursery: { icon: '🍼', label: 'حضانة', color: ORANGE, bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.2)' },
};

export default function SchoolOwnerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeUnit, setActiveUnit] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState<string>('school');
  const [units, setUnits] = useState<any[]>([
    { id: 'school', type: 'school', name: 'مدرسة الأمل', stages: 'ابتدائي + متوسط', students: 380, status: 'active' },
    { id: 'kg', type: 'kg', name: 'روضة الأمل', stages: 'KG1-KG3', students: 76, status: 'active' },
    { id: 'nursery', type: 'nursery', name: 'حضانة الأمل', stages: 'شهرين — 3 سنوات', students: 30, status: 'active' },
  ]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    setLoading(false);
  }, []);

  const totalStudents = units.reduce((sum, u) => sum + u.students, 0);
  const activeUnits = units.filter(u => u.status === 'active').length;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXT }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${C}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div>جاري التحميل...</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: BG, color: TEXT, fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl' }}>
      
      {/* Overlay for mobile */}
      <div 
        style={{ 
          display: sidebarOpen ? 'block' : 'none', 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', 
          zIndex: 299, backdropFilter: 'blur(4px)' 
        }} 
        onClick={() => setSidebarOpen(false)} 
      />

      {/* SIDEBAR */}
      <aside style={{
        width: 266, flexShrink: 0, height: '100vh', background: SB,
        borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', position: 'relative', zIndex: 300,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Green gradient line */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 1, height: '100%',
          background: `linear-gradient(180deg,transparent,${C} 30%,${C} 70%,transparent)`, opacity: 0.22
        }} />

        {/* Logo & User */}
        <div style={{ padding: '14px 13px 11px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg,${GD},${GD2})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900, color: '#000', flexShrink: 0
            }}>م</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, letterSpacing: -0.5 }}>متين</div>
              <div style={{ fontSize: 9, color: TEXT_MUTED }}>لوحة مالك المدرسة</div>
            </div>
          </Link>

          {/* User Card */}
          <div style={{
            background: CD, border: `1px solid ${CB}`, borderRadius: 9,
            padding: '9px 11px', display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'rgba(52,211,153,0.15)', border: `1px solid ${CB}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17
            }}>👨‍💼</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: TEXT, fontSize: 12.5, fontWeight: 700 }}>{user?.name || 'أحمد المطيري'}</div>
              <div style={{ color: C, fontSize: 10.5, fontWeight: 600, marginTop: 1 }}>مالك مدرسة الأمل</div>
            </div>
          </div>

          {/* Units Label */}
          <div style={{ fontSize: 9, color: TEXT_MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>وحداتي التعليمية</div>

          {/* Units List */}
          <div>
            <div 
              onClick={() => setActiveUnit('all')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 9px', borderRadius: 7,
                border: `1px solid ${activeUnit === 'all' ? CB : BORDER2}`,
                background: activeUnit === 'all' ? CD : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s'
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: 6, background: CD,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
              }}>🏫</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: TEXT }}>جميع الوحدات</div>
                <div style={{ fontSize: 9.5, color: TEXT_MUTED }}>{units.length} وحدات · {totalStudents} طالب</div>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 8,
                background: CD, color: C, border: `1px solid ${CB}`
              }}>كل</span>
            </div>

            {units.map(unit => {
              const typeConfig = UNIT_TYPES[unit.type as keyof typeof UNIT_TYPES];
              return (
                <div 
                  key={unit.id}
                  onClick={() => setActiveUnit(unit.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 9px', borderRadius: 7,
                    border: `1px solid ${activeUnit === unit.id ? typeConfig.border : BORDER2}`,
                    background: activeUnit === unit.id ? typeConfig.bg : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s'
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, background: typeConfig.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
                  }}>{typeConfig.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: TEXT }}>{unit.name}</div>
                    <div style={{ fontSize: 9.5, color: TEXT_MUTED }}>{unit.stages} · {unit.students} طالب</div>
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 8,
                    background: typeConfig.bg, color: typeConfig.color, border: `1px solid ${typeConfig.border}`
                  }}>{typeConfig.label}</span>
                </div>
              );
            })}

            {/* Add Unit Button */}
            <div 
              onClick={() => setShowAddUnitModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 9px', borderRadius: 7,
                border: `1px dashed ${BORDER}`, cursor: 'pointer', justifyContent: 'center',
                background: 'rgba(255,255,255,0.01)'
              }}
            >
              <span style={{ fontSize: 13 }}>➕</span>
              <span style={{ fontSize: 11.5, color: C, fontWeight: 600 }}>إضافة وحدة جديدة</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '5px 0 4px', overflowY: 'auto' }}>
          <NavGroup label="الرئيسية">
            <NavItem icon={<LayoutDashboard size={13} />} label="لوحتي" active dot />
            <NavItem icon={<TrendingUp size={13} />} label="الإحصائيات والتقارير" />
          </NavGroup>

          <NavGroup label="إدارة الوحدات">
            <NavItem icon={<Plus size={13} />} label="+ إضافة وحدة" highlight onClick={() => setShowAddUnitModal(true)} />
            <NavItem icon={<Building2 size={13} />} label="إعدادات الوحدات" />
            <NavItem icon={<Calendar size={13} />} label="الجداول الدراسية" />
          </NavGroup>

          <NavGroup label="الموظفون">
            <NavItem icon={<Users size={13} />} label="الموارد البشرية" badge="86" badgeColor="c" />
            <NavItem icon={<Shield size={13} />} label="🔐 الصلاحيات" />
            <NavItem icon={<FileText size={13} />} label="العقود" badge="6" badgeColor="r" />
          </NavGroup>

          <NavGroup label="الطلاب">
            <NavItem icon={<School size={13} />} label="طلاب المدرسة" badge="380" badgeColor="c" />
            <NavItem icon={<GraduationCap size={13} />} label="أطفال الروضة" badge="76" badgeColor="c" />
            <NavItem icon={<Baby size={13} />} label="أطفال الحضانة" badge="30" badgeColor="c" />
            <NavItem icon={<ClipboardCheck size={13} />} label="طلبات القبول" badge="14" badgeColor="r" />
          </NavGroup>

          <NavGroup label="المالية">
            <NavItem icon={<Wallet size={13} />} label="الإيرادات والرسوم" />
            <NavItem icon={<CreditCard size={13} />} label="الرسوم المعلقة" badge="38K" badgeColor="r" />
            <NavItem icon={<TrendingUp size={13} />} label="المنح والإعفاءات" />
          </NavGroup>

          <NavGroup label="النقل">
            <NavItem icon={<Bus size={13} />} label="الباصات المدرسية" />
          </NavGroup>

          <NavGroup label="الإعدادات">
            <NavItem icon={<Settings size={13} />} label="إعدادات المدرسة" />
            <NavItem icon={<BookOpen size={13} />} label="الاشتراك والباقة" />
          </NavGroup>
        </nav>

        {/* Footer */}
        <div style={{ padding: '9px 11px', borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <button style={{
            width: '100%', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.15)',
            borderRadius: 8, padding: 8, color: '#F87171', fontSize: 11.5, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            fontFamily: 'inherit'
          }}>
            <LogOut size={13} /> تسجيل الخروج
          </button>
          <div style={{ marginTop: 6, color: 'rgba(238,238,245,0.14)', fontSize: 10, textAlign: 'center' }}>
            متين v6 — مدرسة الأمل الدولية
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        
        {/* Header */}
        <header style={{
          height: 62, background: 'rgba(6,6,14,0.88)', backdropFilter: 'blur(24px) saturate(1.8)',
          borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button 
              onClick={() => setSidebarOpen(true)}
              style={{
                display: 'none', '@media(max-width:768px)': { display: 'flex' },
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`,
                borderRadius: 9, width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: TEXT_DIM
              }}
            >
              <Menu size={17} />
            </button>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>
                {activeUnit === 'all' ? 'جميع الوحدات — نظرة شاملة' : units.find(u => u.id === activeUnit)?.name}
              </div>
              <div style={{ fontSize: 10.5, color: 'rgba(238,238,245,0.35)', marginTop: 1 }}>
                {units.length} وحدات تعليمية · {totalStudents} طالب وطفل · الفصل الثاني 1445/1446
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Notification */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
              borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: TEXT_DIM, position: 'relative'
            }}>
              <Bell size={16} />
              <span style={{
                position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%',
                background: RED, border: `1.5px solid ${BG}`
              }} />
            </div>

            {/* Add Unit Button */}
            <button 
              onClick={() => setShowAddUnitModal(true)}
              style={{
                background: `linear-gradient(135deg,${C},${C2})`, border: 'none', borderRadius: 9,
                padding: '7px 14px', color: '#fff', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Plus size={12} strokeWidth={2.5} /> إضافة وحدة
            </button>

            {/* User Button */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
              borderRadius: 10, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 7,
              cursor: 'pointer'
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7, background: 'rgba(52,211,153,0.1)',
                border: `1.5px solid rgba(52,211,153,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14
              }}>👨‍💼</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>{user?.name || 'أحمد المطيري'}</div>
                <div style={{ fontSize: 9.5, color: C, fontWeight: 700 }}>مالك المدرسة</div>
              </div>
              <ChevronDown size={12} color="rgba(238,238,245,0.35)" />
            </div>
          </div>
        </header>

        {/* Unit Tabs */}
        <div style={{
          display: 'flex', gap: 0, borderBottom: `1px solid ${BORDER}`, overflowX: 'auto',
          flexShrink: 0, background: 'rgba(6,6,14,0.7)'
        }}>
          <TabButton 
            active={activeUnit === 'all'} 
            onClick={() => setActiveUnit('all')}
            icon="🏫"
            label="جميع الوحدات"
          />
          {units.map(unit => (
            <TabButton 
              key={unit.id}
              active={activeUnit === unit.id}
              onClick={() => setActiveUnit(unit.id)}
              icon={UNIT_TYPES[unit.type as keyof typeof UNIT_TYPES].icon}
              label={unit.name}
            />
          ))}
          <button 
            onClick={() => setShowAddUnitModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
              fontSize: 12, fontWeight: 600, color: C, opacity: 0.7,
              cursor: 'pointer', whiteSpace: 'nowrap', background: 'none', border: 'none',
              borderBottom: '3px solid transparent', fontFamily: 'inherit'
            }}
          >
            ＋ إضافة وحدة
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '14px 16px', overflowY: 'auto' }}>
          
          {/* Page Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 13, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: C, display: 'flex', alignItems: 'center', gap: 8 }}>
                {activeUnit === 'all' ? '🏫 نظرة شاملة — جميع الوحدات' : `${UNIT_TYPES[units.find(u => u.id === activeUnit)?.type as keyof typeof UNIT_TYPES]?.icon || '🏫'} ${units.find(u => u.id === activeUnit)?.name}`}
              </div>
              <div style={{ color: TEXT_MUTED, fontSize: 12, marginTop: 3 }}>
                {activeUnit === 'all' ? 'مدرسة + روضة + حضانة · كل شيء في مكان واحد' : units.find(u => u.id === activeUnit)?.stages}
              </div>
            </div>
            <button 
              onClick={() => setShowAddUnitModal(true)}
              style={{
                background: `linear-gradient(135deg,${C},${C2})`, border: 'none', borderRadius: 9,
                padding: '9px 16px', color: '#fff', fontWeight: 700, fontSize: 12.5,
                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Plus size={13} strokeWidth={2.5} /> + إضافة وحدة جديدة
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 13 }}>
            <StatCard 
              icon="👥" 
              value={totalStudents} 
              label="إجمالي الطلاب والأطفال"
              sub={activeUnit === 'all' ? units.map(u => u.students).join(' + ') : undefined}
              color={C}
            />
            <StatCard 
              icon="👩‍🏫" 
              value="86" 
              label="إجمالي الموظفين"
              sub="معلمون + خدمات"
              color={BLUE}
            />
            <StatCard 
              icon="💰" 
              value="1.2M" 
              label="الإيرادات الفصلية"
              sub="SAR هذا الفصل"
              color={GD}
            />
            <StatCard 
              icon="📋" 
              value="14" 
              label="طلبات قبول معلقة"
              sub="تحتاج مراجعة"
              color={RED}
            />
          </div>

          {/* Units Overview Cards */}
          {activeUnit === 'all' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 13 }}>
              {units.map(unit => {
                const typeConfig = UNIT_TYPES[unit.type as keyof typeof UNIT_TYPES];
                return (
                  <div 
                    key={unit.id}
                    onClick={() => setActiveUnit(unit.id)}
                    style={{
                      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 11,
                      overflow: 'hidden', cursor: 'pointer', marginBottom: 0
                    }}
                  >
                    <div style={{ padding: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: 10, background: typeConfig.bg,
                          border: `1px solid ${typeConfig.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 22
                        }}>{typeConfig.icon}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>{unit.name}</div>
                          <div style={{ fontSize: 11, color: typeConfig.color, marginTop: 1 }}>{unit.stages}</div>
                        </div>
                        <span style={{
                          marginRight: 'auto', padding: '2px 7px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                          background: typeConfig.bg, color: typeConfig.color, border: `1px solid ${typeConfig.border}`
                        }}>نشطة</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                        <div style={{
                          background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER2}`, borderRadius: 7,
                          padding: 8, textAlign: 'center'
                        }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: typeConfig.color }}>{unit.students}</div>
                          <div style={{ fontSize: 10, color: TEXT_MUTED }}>طالب</div>
                        </div>
                        <div style={{
                          background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER2}`, borderRadius: 7,
                          padding: 8, textAlign: 'center'
                        }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>{unit.type === 'school' ? '54' : unit.type === 'kg' ? '18' : '14'}</div>
                          <div style={{ fontSize: 10, color: TEXT_MUTED }}>{unit.type === 'school' ? 'معلم' : unit.type === 'kg' ? 'معلمة' : 'مربية'}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 4 }}>الطاقة الاستيعابية</div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: unit.type === 'school' ? '84%' : unit.type === 'kg' ? '76%' : '60%',
                          background: typeConfig.color, borderRadius: 3
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: TEXT_MUTED, marginTop: 3 }}>
                        <span>{unit.students} طالب</span>
                        <span style={{ color: typeConfig.color }}>{unit.type === 'school' ? '84%' : unit.type === 'kg' ? '76%' : '60%'} ممتلئة</span>
                      </div>
                    </div>
                    <div style={{
                      padding: '8px 14px', background: typeConfig.bg, borderTop: `1px solid ${BORDER2}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <span style={{ fontSize: 11, color: typeConfig.color, fontWeight: 600 }}>📊 عرض التفاصيل ←</span>
                      <span style={{ fontSize: 10, color: TEXT_MUTED }}>رسوم: {unit.type === 'school' ? '680K' : unit.type === 'kg' ? '342K' : '54K'} SAR</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>إجراءات سريعة</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
              <QuickAction icon="🌐" label="الواجهة الأمامية" color={GREEN} />
              <QuickAction icon="👥" label="المستخدمون" color={BLUE} />
              <QuickAction icon="📦" label="الاشتراكات" color={GD} />
              <QuickAction icon="📢" label="الإعلانات" color={ORANGE} />
              <QuickAction icon="📄" label="الضرائب" color={GREEN} />
              <QuickAction icon="🛒" label="المتجر" color={PURPLE} />
              <QuickAction icon="💬" label="الملتقى" color={CYAN} />
              <QuickAction icon="🔐" label="الصلاحيات" color={RED} />
              <QuickAction icon="💾" label="النسخ الاحتياطي" color={GD} />
              <QuickAction icon="🔒" label="سجل الأمان" color={BLUE} />
              <QuickAction icon="💰" label="الباقات" color={GREEN} />
              <QuickAction icon="📊" label="التقارير" color={PURPLE} />
              <QuickAction icon="⚙️" label="الإعدادات" color={TEXT_DIM} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer style={{
          padding: '14px 28px', borderTop: `1px solid rgba(255,255,255,0.06)`,
          display: 'flex', justifyContent: 'space-between', flexShrink: 0
        }}>
          <p style={{ color: 'rgba(238,238,245,0.25)', fontSize: 12 }}>© 2026 متين — جميع الحقوق محفوظة</p>
          <p style={{ color: 'rgba(238,238,245,0.25)', fontSize: 12 }}>صنع بـ ❤️ في المملكة العربية السعودية</p>
        </footer>
      </div>

      {/* Add Unit Modal */}
      {showAddUnitModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)'
        }}>
          <div style={{
            background: SB, border: `1px solid ${CB}`, borderRadius: 16, padding: 0,
            maxWidth: 520, width: '92%', maxHeight: '90vh', overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '14px 16px', borderBottom: `1px solid ${BORDER2}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: TEXT, display: 'flex', alignItems: 'center', gap: 8 }}>
                🏫 إضافة وحدة تعليمية جديدة
              </div>
              <button 
                onClick={() => setShowAddUnitModal(false)}
                style={{ background: 'none', border: 'none', color: TEXT_MUTED, cursor: 'pointer', fontSize: 20 }}
              >×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 700, marginBottom: 10 }}>اختر نوع الوحدة</div>
              
              {/* Unit Type Picker */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                {Object.entries(UNIT_TYPES).map(([key, config]) => (
                  <div 
                    key={key}
                    onClick={() => setSelectedUnitType(key)}
                    style={{
                      border: `2px solid ${selectedUnitType === key ? C : BORDER2}`, borderRadius: 10,
                      padding: '14px 10px', textAlign: 'center', cursor: 'pointer',
                      background: selectedUnitType === key ? CD : 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{config.icon}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT }}>{config.label}</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 3 }}>
                      {key === 'school' ? 'ابتدائي · متوسط · ثانوي' : key === 'kg' ? 'KG1 · KG2 · KG3 · تمهيدي' : 'من شهرين حتى 3 سنوات'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 2 }}>
                <div>
                  <label style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, display: 'block', marginBottom: 5 }}>اسم الوحدة</label>
                  <input 
                    type="text" 
                    placeholder="مثال: روضة الأمل"
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
                      color: TEXT, fontSize: 13, padding: '9px 12px', borderRadius: 8,
                      fontFamily: 'inherit', outline: 'none', marginBottom: 10
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, display: 'block', marginBottom: 5 }}>ترتبط بـ (الفرع)</label>
                  <select style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
                    color: TEXT, fontSize: 13, padding: '9px 12px', borderRadius: 8,
                    fontFamily: 'inherit', outline: 'none', marginBottom: 10
                  }}>
                    <option>الفرع الرئيسي — النزهة</option>
                    <option>فرع الروضة</option>
                    <option>فرع العليا</option>
                    <option>مستقلة</option>
                  </select>
                </div>
              </div>

              {/* Info Box */}
              <div style={{
                background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER2}`,
                borderRadius: 9, padding: 12, marginBottom: 14
              }}>
                <div style={{ fontSize: 11, color: C, fontWeight: 700, marginBottom: 8 }}>⚡ سيتم تلقائياً عند الإضافة</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11.5, color: TEXT_DIM }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: GREEN }}>✓</span> إنشاء تبويب مستقل في النظام</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: GREEN }}>✓</span> إعداد نماذج التقييم والتقارير المناسبة</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: GREEN }}>✓</span> ربط الوحدة بالموارد البشرية والمالية</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: GREEN }}>✓</span> تفعيل بوابة ولي الأمر للوحدة الجديدة</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: GREEN }}>✓</span> إضافة الوحدة لتبويبات الموارد البشرية</div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => setShowAddUnitModal(false)}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`,
                    borderRadius: 9, padding: 11, color: TEXT_DIM, fontSize: 13,
                    cursor: 'pointer', fontFamily: 'inherit'
                  }}
                >إلغاء</button>
                <button 
                  style={{
                    flex: 2, background: `linear-gradient(135deg,${C},${C2})`, border: 'none',
                    borderRadius: 9, padding: 11, color: '#fff', fontWeight: 800, fontSize: 13,
                    cursor: 'pointer', fontFamily: 'inherit'
                  }}
                >إضافة الوحدة ←</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Sub Components
   ═══════════════════════════════════════════════════════════════════ */

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div style={{ fontSize: 9, color: TEXT_MUTED, fontWeight: 700, letterSpacing: 1.2, padding: '8px 13px 3px' }}>{label}</div>
      {children}
    </>
  );
}

function NavItem({ icon, label, active, dot, badge, badgeColor, highlight, onClick }: any) {
  const badgeColors: any = {
    c: { bg: CD, color: C, border: CB },
    r: { bg: 'rgba(239,68,68,0.12)', color: RED, border: 'rgba(239,68,68,0.22)' },
    g: { bg: 'rgba(212,168,67,0.12)', color: GD, border: 'rgba(212,168,67,0.22)' },
  };
  
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 11px 6px 13px',
        fontSize: 11.5, color: highlight ? C : active ? TEXT : TEXT_DIM,
        cursor: 'pointer', borderRight: `3px solid ${active ? C : 'transparent'}`,
        margin: '1px 4px 1px 0', borderRadius: '0 7px 7px 0',
        background: active ? CD : 'transparent', fontWeight: active || highlight ? 600 : 400,
        transition: 'all 0.15s'
      }}
    >
      {icon}
      <span style={{ color: highlight ? C : undefined, fontWeight: highlight ? 600 : undefined }}>{label}</span>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: C, marginRight: 'auto', boxShadow: `0 0 5px ${C}` }} />}
      {badge && (
        <span style={{
          fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 10, marginRight: 'auto',
          background: badgeColors[badgeColor]?.bg, color: badgeColors[badgeColor]?.color,
          border: `1px solid ${badgeColors[badgeColor]?.border}`
        }}>{badge}</span>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
        fontSize: 12, fontWeight: 600, color: active ? TEXT : TEXT_DIM,
        cursor: 'pointer', whiteSpace: 'nowrap', background: 'none', border: 'none',
        borderBottom: `3px solid ${active ? C : 'transparent'}`, fontFamily: 'inherit',
        transition: 'all 0.2s'
      }}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ icon, value, label, sub, color }: any) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER2}`, borderRadius: 11,
      padding: 12, position: 'relative', overflow: 'hidden', transition: 'all 0.2s'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg,${color}05 0%,transparent 60%)`, pointerEvents: 'none'
      }} />
      <div style={{
        width: 30, height: 30, borderRadius: 7,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 8, fontSize: 15
      }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1, marginBottom: 2, color }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_MUTED }}>{label}</div>
      {sub && <div style={{ fontSize: 10, marginTop: 3, color: `${color}99` }}>{sub}</div>}
    </div>
  );
}

function QuickAction({ icon, label, color }: any) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER2}`, borderRadius: 8,
      padding: '10px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
      cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center'
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 7,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
      }}>{icon}</div>
      <div style={{ fontSize: 10, color: TEXT_DIM, fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}
