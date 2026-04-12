export default function DashboardLoading() {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 10,
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div
        style={{
          fontFamily: 'IBM Plex Sans Arabic, sans-serif',
          direction: 'rtl',
          padding: '0 0 40px',
        }}
      >
        {/* Header skeleton */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ ...shimmer, height: 28, width: 220, marginBottom: 10 }} />
          <div style={{ ...shimmer, height: 16, width: 340 }} />
        </div>

        {/* Stats cards skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ ...shimmer, height: 14, width: 80 }} />
                <div style={{ ...shimmer, width: 44, height: 44, borderRadius: 12 }} />
              </div>
              <div style={{ ...shimmer, height: 32, width: 100, marginBottom: 8 }} />
              <div style={{ ...shimmer, height: 12, width: 120 }} />
            </div>
          ))}
        </div>

        {/* Table/content skeleton */}
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            padding: 24,
          }}
        >
          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ ...shimmer, height: 20, width: 160 }} />
            <div style={{ ...shimmer, height: 36, width: 100, borderRadius: 10 }} />
          </div>

          {/* Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 0',
                borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <div style={{ ...shimmer, width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ ...shimmer, height: 14, width: `${60 + i * 8}%`, marginBottom: 8 }} />
                <div style={{ ...shimmer, height: 12, width: `${30 + i * 5}%` }} />
              </div>
              <div style={{ ...shimmer, height: 28, width: 80, borderRadius: 20 }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
