'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — يمسك أخطاء React غير المتوقعة ويعرض واجهة بديلة
 * الاستخدام:
 *   <ErrorBoundary>
 *     <MyComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <DefaultErrorUI
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}

// ─── واجهة الخطأ الافتراضية ────────────────────────────
function DefaultErrorUI({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        padding: '32px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        color: '#EEEEF5',
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        textAlign: 'center',
        gap: '16px',
      }}
    >
      <div style={{ fontSize: '48px' }}>⚠️</div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
        حدث خطأ غير متوقع
      </h2>
      <p style={{ color: 'rgba(238,238,245,0.55)', fontSize: '14px', margin: 0 }}>
        {error?.message ?? 'حدث خطأ أثناء تحميل هذا القسم'}
      </p>
      <button
        onClick={onReset}
        style={{
          background: 'linear-gradient(135deg, #D4A843, #E8C060)',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        }}
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
