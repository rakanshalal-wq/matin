import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  color?: string;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  color,
  icon,
}) => {
  const variantColors: Record<string, { bg: string; text: string; border: string }> = {
    success: {
      bg: 'rgba(16,185,129,0.1)',
      text: '#10B981',
      border: 'rgba(16,185,129,0.2)',
    },
    error: {
      bg: 'rgba(239,68,68,0.1)',
      text: '#EF4444',
      border: 'rgba(239,68,68,0.2)',
    },
    warning: {
      bg: 'rgba(245,158,11,0.1)',
      text: '#F59E0B',
      border: 'rgba(245,158,11,0.2)',
    },
    info: {
      bg: 'rgba(96,165,250,0.1)',
      text: '#60A5FA',
      border: 'rgba(96,165,250,0.2)',
    },
    default: {
      bg: 'rgba(212,168,67,0.1)',
      text: '#D4A843',
      border: 'rgba(212,168,67,0.2)',
    },
  };

  const colors = color
    ? {
        bg: `${color}15`,
        text: color,
        border: `${color}33`,
      }
    : variantColors[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
