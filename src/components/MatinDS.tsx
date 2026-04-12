'use client';
export const dynamic = 'force-dynamic';
/**
 * MATIN DESIGN SYSTEM — v8
 * ─────────────────────────────────────────────────────────────
 * نظام التصميم الموحد لجميع صفحات داش بورد متين
 * Primary: #C9A84C (Gold)   Secondary: #10B981 (Green)
 * Background: #06060E       Cards: rgba(255,255,255,0.03)
 * Font: Cairo / IBM Plex Sans Arabic   Direction: RTL
 * ─────────────────────────────────────────────────────────────
 */

import React from 'react';
import NextLink from 'next/link';

/* ── Palette ── */
export const G      = '#C9A84C';   // Gold
export const G2     = '#E2C46A';   // Gold Light
export const BG     = '#06060E';   // Deep Black
export const BG2    = '#0D0D1A';   // Card BG
export const CARD   = 'rgba(255,255,255,0.03)';
export const BORDER = 'rgba(255,255,255,0.07)';
export const TEXT   = '#EEEEF5';
export const TEXT2  = 'rgba(238,238,245,0.55)';
export const TEXT3  = 'rgba(238,238,245,0.35)';
export const GREEN  = '#10B981';
export const RED    = '#EF4444';
export const BLUE   = '#3B82F6';
export const PURPLE = '#8B5CF6';
export const AMBER  = '#F59E0B';
export const PINK   = '#EC4899';
export const CYAN   = '#06B6D4';
export const ORANGE = '#F97316';

/* ── Page Wrapper ── */
export const PageWrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    minHeight: '100vh',
    background: BG,
    fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
    direction: 'rtl',
    color: TEXT,
    padding: '24px 20px',
    maxWidth: 1400,
    margin: '0 auto',
  }}>
    {children}
  </div>
);

/* ── Page Header ── */
export const PageHeader = ({
  title, subtitle, Icon: IconComp, color = G, children
}: {
  title: string;
  subtitle?: string;
  Icon?: React.ElementType;
  color?: string;
  children?: React.ReactNode;
}) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 28, flexWrap: 'wrap', gap: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {IconComp && (
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <IconComp size={22} color={color} />
        </div>
      )}
      <div>
        <h1 style={{ color: TEXT, fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ color: TEXT3, fontSize: 13, margin: '4px 0 0', fontWeight: 500 }}>{subtitle}</p>}
      </div>
    </div>
    {children && <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>}
  </div>
);

/* ── Stat Card ── */
export const StatCard = ({
  title, value, sub, color, Icon: IconComp, link
}: {
  title: string;
  value: React.ReactNode;
  sub?: string;
  color: string;
  Icon?: React.ElementType;
  link?: string;
}) => {
  const inner = (
    <div style={{
      background: `linear-gradient(135deg, ${color}0A 0%, ${color}04 100%)`,
      border: `1px solid ${color}22`,
      borderRadius: 16,
      padding: '20px 22px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.25s',
      height: '100%',
      cursor: link ? 'pointer' : 'default',
    }}
      onMouseEnter={e => {
        if (link) {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${color}18`;
          (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
        }
      }}
      onMouseLeave={e => {
        if (link) {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLElement).style.borderColor = `${color}22`;
        }
      }}
    >
      <div style={{
        position: 'absolute', top: -20, left: -20,
        width: 100, height: 100,
        background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
        borderRadius: '50%',
      }} />
      {IconComp && (
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          <IconComp size={20} color={color} />
        </div>
      )}
      <div style={{ color: TEXT3, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3 }}>{title}</div>
      <div style={{ color, fontSize: 26, fontWeight: 800, lineHeight: 1, letterSpacing: -0.5 }}>{value ?? '—'}</div>
      {sub && <div style={{ color: TEXT3, fontSize: 11, marginTop: 6 }}>{sub}</div>}
    </div>
  );
  return link ? <NextLink href={link} style={{ textDecoration: 'none', display: 'block' }}>{inner}</NextLink> : inner;
};

/* ── Stats Grid ── */
export const StatsGrid = ({ children, cols = 4 }: { children: React.ReactNode; cols?: number }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${cols <= 3 ? 200 : 180}px, 1fr))`,
    gap: 16,
    marginBottom: 28,
  }}>
    {children}
  </div>
);

/* ── Section Header ── */
export const SectionHeader = ({
  title, Icon: IconComp, desc, color = G
}: {
  title: string;
  Icon?: React.ElementType;
  desc?: string;
  color?: string;
}) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      {IconComp && (
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <IconComp size={18} color={color} />
        </div>
      )}
      <h2 style={{ color: TEXT, fontSize: 18, fontWeight: 800, margin: 0 }}>{title}</h2>
    </div>
    {desc && <p style={{ color: TEXT3, fontSize: 13, margin: 0, paddingRight: IconComp ? 50 : 0 }}>{desc}</p>}
  </div>
);

/* ── Card ── */
export const Card = ({
  children, style
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div style={{
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: 24,
    ...style,
  }}>
    {children}
  </div>
);

/* ── Badge ── */
export const Badge = ({ label, color }: { label: string; color: string }) => (
  <span style={{
    background: `${color}15`, color,
    border: `1px solid ${color}30`,
    borderRadius: 6, padding: '3px 10px',
    fontSize: 11, fontWeight: 700,
    display: 'inline-flex', alignItems: 'center', gap: 4,
  }}>{label}</span>
);

/* ── Button ── */
export const Btn = ({
  label, color = G, onClick, disabled, Icon: IconComp, size = 'sm', variant = 'solid'
}: {
  label: string;
  color?: string;
  onClick?: () => void;
  disabled?: boolean;
  Icon?: React.ElementType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
}) => {
  const pad = size === 'lg' ? '12px 24px' : size === 'md' ? '10px 20px' : '8px 16px';
  const fs = size === 'lg' ? 15 : size === 'md' ? 14 : 13;
  const isGold = color === G;

  const bgStyle = variant === 'solid'
    ? isGold
      ? { background: `linear-gradient(135deg, ${G} 0%, ${G2} 100%)`, color: '#06060E' }
      : { background: `${color}18`, color }
    : variant === 'outline'
    ? { background: 'transparent', color, border: `1px solid ${color}40` }
    : { background: 'transparent', color };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: pad,
        borderRadius: 10,
        border: 'none',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: fs,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        ...bgStyle,
      }}
    >
      {IconComp && <IconComp size={size === 'lg' ? 18 : 16} />}
      {label}
    </button>
  );
};

/* ── Gold Button ── */
export const GoldBtn = ({
  label, onClick, disabled, Icon: IconComp, size = 'md'
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  Icon?: React.ElementType;
  size?: 'sm' | 'md' | 'lg';
}) => (
  <Btn label={label} color={G} onClick={onClick} disabled={disabled} Icon={IconComp} size={size} variant="solid" />
);

/* ── Input ── */
export const INP: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10,
  color: TEXT,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
  direction: 'rtl',
};

export const LBL: React.CSSProperties = {
  display: 'block',
  color: TEXT2,
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
};

export const FW: React.CSSProperties = { marginBottom: 16 };

/* ── Table ── */
export const Table = ({ headers, children }: { headers: string[]; children: React.ReactNode }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              textAlign: 'right',
              padding: '12px 16px',
              color: TEXT3,
              fontWeight: 700,
              fontSize: 12,
              borderBottom: `1px solid ${BORDER}`,
              whiteSpace: 'nowrap',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const TR = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <tr
    onClick={onClick}
    style={{ borderBottom: `1px solid ${BORDER}`, cursor: onClick ? 'pointer' : 'default', transition: 'background 0.15s' }}
    onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
    onMouseLeave={e => { if (onClick) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
  >
    {children}
  </tr>
);

export const TD = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <td style={{ padding: '12px 16px', color: TEXT, verticalAlign: 'middle', ...style }}>{children}</td>
);

/* ── Modal ── */
export const Modal = ({
  title, onClose, children, Icon: IconComp, color = G
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  Icon?: React.ElementType;
  color?: string;
}) => (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: BG2,
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        width: '100%', maxWidth: 520,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 24px',
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {IconComp && (
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: `${color}18`,
              border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconComp size={16} color={color} />
            </div>
          )}
          <h3 style={{ color: TEXT, fontSize: 17, fontWeight: 700, margin: 0 }}>{title}</h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none', borderRadius: 8,
            padding: '6px 10px', cursor: 'pointer',
            color: TEXT2, fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18 M6 6l12 12" /></svg>
        </button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

/* ── Alert Boxes ── */
export const ErrBox = ({ msg }: { msg: string }) =>
  msg ? (
    <div style={{
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: 8, padding: '10px 14px',
      color: RED, fontSize: 13, marginBottom: 12,
    }}>{msg}</div>
  ) : null;

export const OkBox = ({ msg }: { msg: string }) =>
  msg ? (
    <div style={{
      background: 'rgba(16,185,129,0.1)',
      border: '1px solid rgba(16,185,129,0.3)',
      borderRadius: 8, padding: '10px 14px',
      color: GREEN, fontSize: 13, marginBottom: 12,
    }}>{msg}</div>
  ) : null;

/* ── Empty State ── */
export const EmptyState = ({
  Icon: IconComp, title, desc, action, color = G
}: {
  Icon?: React.ElementType;
  title: string;
  desc?: string;
  action?: React.ReactNode;
  color?: string;
}) => (
  <div style={{
    textAlign: 'center', padding: '60px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
  }}>
    {IconComp && (
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: `${color}12`,
        border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 4,
      }}>
        <IconComp size={32} color={color} />
      </div>
    )}
    <div style={{ color: TEXT, fontSize: 18, fontWeight: 700 }}>{title}</div>
    {desc && <div style={{ color: TEXT3, fontSize: 13 }}>{desc}</div>}
    {action && <div style={{ marginTop: 8 }}>{action}</div>}
  </div>
);

/* ── Avatar ── */
export const Avatar = ({
  name, color = BLUE, size = 40
}: {
  name: string;
  color?: string;
  size?: number;
}) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: `${color}20`,
    border: `1px solid ${color}30`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color, fontSize: size * 0.38, fontWeight: 700,
    flexShrink: 0,
  }}>
    {name?.charAt(0) || '?'}
  </div>
);

/* ── Icon Box ── */
export const IconBox = ({
  Icon: IconComp, color, size = 40, iconSize = 18
}: {
  Icon: React.ElementType;
  color: string;
  size?: number;
  iconSize?: number;
}) => (
  <div style={{
    width: size, height: size, borderRadius: Math.round(size * 0.28),
    background: `${color}18`,
    border: `1px solid ${color}30`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }}>
    <IconComp size={iconSize} color={color} />
  </div>
);

/* ── Divider ── */
export const Divider = () => (
  <div style={{ height: 1, background: BORDER, margin: '20px 0' }} />
);

/* ── Search Bar ── */
export const SearchBar = ({
  value, onChange, placeholder = 'بحث...'
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        ...INP,
        paddingRight: 40,
      }}
    />
    <span style={{
      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
      color: TEXT3, pointerEvents: 'none',
    }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" /></svg></span>
  </div>
);

/* ── Auth Headers Helper ── */
export const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
