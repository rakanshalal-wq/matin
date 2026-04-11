import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = '#D4A843',
  trend,
  trendValue,
}) => {
  const trendColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#60A5FA';

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '14px',
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${color}10, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      {icon && (
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            background: `${color}22`,
            color: color,
            fontSize: '20px',
          }}
        >
          {icon}
        </div>
      )}

      {/* Value */}
      <div
        style={{
          fontSize: '28px',
          fontWeight: 800,
          lineHeight: 1,
          marginBottom: '5px',
          color: '#EEEEF5',
        }}
      >
        {value}
      </div>

      {/* Label */}
      <div
        style={{
          color: 'rgba(238,238,245,0.55)',
          fontSize: '12px',
          marginBottom: trend ? '8px' : 0,
        }}
      >
        {label}
      </div>

      {/* Trend */}
      {trend && trendValue && (
        <div
          style={{
            fontSize: '11px',
            color: trendColor,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
          {trendValue}
        </div>
      )}
    </div>
  );
};

export default StatCard;
