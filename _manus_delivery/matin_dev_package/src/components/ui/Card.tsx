import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  color?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  icon,
  className = '',
  style = {},
  onClick,
  hoverable = true,
  color = '#D4A843',
}) => {
  const baseStyles: React.CSSProperties = {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    transition: 'all 0.2s',
    cursor: hoverable ? 'pointer' : 'default',
  };

  return (
    <div
      className={className}
      style={{
        ...baseStyles,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.boxShadow = `0 4px 12px ${color}22`;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
            color: '#EEEEF5',
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          {icon && <div style={{ fontSize: '20px' }}>{icon}</div>}
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
