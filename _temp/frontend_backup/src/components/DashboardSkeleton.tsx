'use client';

// ─── Skeleton Loading Components ─────────────────────────────────────────────
// مكونات Skeleton لتحسين تجربة المستخدم أثناء تحميل البيانات

const shimmer = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

function SkeletonBox({ width = '100%', height = 16, borderRadius = 8, style = {} }: {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
}

// Skeleton لكارت الإحصائيات
export function StatCardSkeleton() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      padding: 20,
    }}>
      <SkeletonBox width="60%" height={12} style={{ marginBottom: 12 }} />
      <SkeletonBox width="40%" height={32} style={{ marginBottom: 8 }} />
      <SkeletonBox width="50%" height={10} />
    </div>
  );
}

// Skeleton للوحة التحكم الرئيسية
export function DashboardHomeSkeleton() {
  return (
    <div style={{ padding: 24, direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic,Arial,sans-serif' }}>
      <style>{shimmer}</style>
      
      {/* Header Skeleton */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          <SkeletonBox width="30%" height={13} style={{ marginBottom: 8 }} />
          <SkeletonBox width="50%" height={22} style={{ marginBottom: 8 }} />
          <SkeletonBox width="20%" height={22} borderRadius={20} />
        </div>
        <SkeletonBox width={120} height={40} borderRadius={12} />
      </div>

      {/* Stats Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
      </div>

      {/* Content Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[1, 2].map(i => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: 20,
          }}>
            <SkeletonBox width="40%" height={16} style={{ marginBottom: 16 }} />
            {[1, 2, 3, 4].map(j => (
              <div key={j} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                <SkeletonBox width={36} height={36} borderRadius={8} />
                <div style={{ flex: 1 }}>
                  <SkeletonBox width="70%" height={12} style={{ marginBottom: 6 }} />
                  <SkeletonBox width="40%" height={10} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton للوحة تحكم المالك (owner)
export function OwnerDashboardSkeleton() {
  return (
    <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', background: '#0A0A14', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <style>{shimmer}</style>
      
      {/* Sidebar Skeleton */}
      <aside style={{ width: 228, background: '#0B0B16', borderLeft: '1px solid rgba(201,168,76,0.15)', padding: '20px 12px', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <SkeletonBox width={36} height={36} borderRadius={12} />
          <div style={{ flex: 1 }}>
            <SkeletonBox width="60%" height={12} style={{ marginBottom: 6 }} />
            <SkeletonBox width="80%" height={10} />
          </div>
        </div>
        {/* Nav Items */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 4, borderRadius: 10 }}>
            <SkeletonBox width={18} height={18} borderRadius={4} />
            <SkeletonBox width="70%" height={12} />
          </div>
        ))}
      </aside>

      {/* Main Content Skeleton */}
      <main style={{ flex: 1, padding: 28, overflow: 'auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <SkeletonBox width="25%" height={28} style={{ marginBottom: 8 }} />
          <SkeletonBox width="40%" height={14} />
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
        </div>

        {/* Table Skeleton */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <SkeletonBox width="20%" height={16} />
            <SkeletonBox width={120} height={36} borderRadius={10} />
          </div>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
              <SkeletonBox width={40} height={40} borderRadius={10} />
              <div style={{ flex: 2 }}>
                <SkeletonBox width="60%" height={13} style={{ marginBottom: 6 }} />
                <SkeletonBox width="40%" height={11} />
              </div>
              <SkeletonBox width="15%" height={24} borderRadius={20} />
              <SkeletonBox width="10%" height={13} />
              <SkeletonBox width={80} height={32} borderRadius={8} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default DashboardHomeSkeleton;
