import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  color = '#D4A843',
  style = {},
}) => {
  const baseStyles: React.CSSProperties = {
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    opacity: disabled ? 0.5 : 1,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '10px 20px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '16px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
      color: '#06060E',
      ...sizeStyles[size],
    },
    secondary: {
      background: 'rgba(255,255,255,0.05)',
      color: '#EEEEF5',
      border: '1px solid rgba(255,255,255,0.1)',
      ...sizeStyles[size],
    },
    outline: {
      background: 'transparent',
      color: color,
      border: `1px solid ${color}`,
      ...sizeStyles[size],
    },
  };

  const hoverStyles: React.CSSProperties = {
    transform: disabled ? 'none' : 'translateY(-2px)',
    boxShadow: disabled ? 'none' : `0 4px 12px ${color}33`,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: 'none' });
      }}
    >
      {children}
    </button>
  );
};

export default Button;
