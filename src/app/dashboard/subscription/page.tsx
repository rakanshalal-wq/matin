'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { TrendingUp, Users, HardDrive, Zap, ArrowUpCircle } from 'lucide-react';
import { getHeaders } from '@/lib/api';

const GOLD   = '#C9A84C';
const BG     = '#0B0B16';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

interface QuotaData {
  current_students: number;
  max_students: number;
  current_storage_bytes: number;
  max_storage_bytes: number;
  plan_name: string;
  end_date?: string;
  usage_percent_students: number;
  usage_percent_storage: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024)      return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3)        return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const bg = clamped >= 90 ? '#EF4444' : clamped >= 75 ? '#F59E0B' : color;
  return (
    <div style={{ background: BORDER, borderRadius: 999, height: 10, overflow: 'hidden', marginTop: 8 }}>
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          background: bg,
          borderRadius: 999,
          transition: 'width 0.6s ease',
        }}
      />
    </div>
  );
}

export default function SubscriptionPage() {
  const [quota, setQuota]     = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans]     = useState<any[]>([]);

  useEffect(() => {
    fetchQuota();
    fetchPlans();
  }, []);

  const fetchQuota = async () => {
    try {
      const res = await fetch('/api/tenant-quota', { headers: getHeaders() });
      const data = await res.json();
      setQuota(data);
    } catch { /* نتجاهل الأخطاء الهادئة */ }
    finally { setLoading(false); }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/public/plans');
      const data = await res.json();
      if (data.plans) setPlans(data.plans);
    } catch { /* ignore */ }
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: BG, padding: '24px', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      {/* ─── العنوان ─── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: GOLD, margin: 0 }}>
          <TrendingUp size={28} style={{ verticalAlign: 'middle', marginLeft: 8 }} />
          اشتراكي وحدود الباقة
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>
          تابع استهلاك مؤسستك ومستوى الباقة الحالية
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 80 }}>جاري التحميل...</div>
      ) : (
        <>
          {/* ─── بطاقة الباقة الحالية ─── */}
          {quota && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 32 }}>
              {/* الطلاب */}
              <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Users size={22} color={GOLD} />
                  <span style={{ fontWeight: 600, fontSize: 16 }}>الطلاب</span>
                  {quota.usage_percent_students >= 90 && (
                    <span style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', borderRadius: 999, padding: '2px 10px', fontSize: 12, marginRight: 'auto' }}>
                      اقتربت من الحد
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: quota.usage_percent_students >= 90 ? '#EF4444' : '#fff' }}>
                  {quota.current_students.toLocaleString('ar-SA')}
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
                    {' '}/ {quota.max_students.toLocaleString('ar-SA')} طالب
                  </span>
                </div>
                <ProgressBar percent={quota.usage_percent_students} color={GOLD} />
                <div style={{ marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                  {quota.usage_percent_students}% مستخدم
                </div>
              </div>

              {/* التخزين */}
              <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <HardDrive size={22} color="#3B82F6" />
                  <span style={{ fontWeight: 600, fontSize: 16 }}>مساحة التخزين</span>
                  {quota.usage_percent_storage >= 90 && (
                    <span style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', borderRadius: 999, padding: '2px 10px', fontSize: 12, marginRight: 'auto' }}>
                      اقتربت من الحد
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: quota.usage_percent_storage >= 90 ? '#EF4444' : '#fff' }}>
                  {formatBytes(quota.current_storage_bytes)}
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
                    {' '}/ {formatBytes(quota.max_storage_bytes)}
                  </span>
                </div>
                <ProgressBar percent={quota.usage_percent_storage} color="#3B82F6" />
                <div style={{ marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                  {quota.usage_percent_storage}% مستخدم
                </div>
              </div>

              {/* معلومات الباقة */}
              <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Zap size={22} color="#A855F7" />
                  <span style={{ fontWeight: 600, fontSize: 16 }}>الباقة الحالية</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: GOLD, marginBottom: 8 }}>
                  {quota.plan_name}
                </div>
                {quota.end_date && (
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    تنتهي في: {new Date(quota.end_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
                {(quota.usage_percent_students >= 80 || quota.usage_percent_storage >= 80) && (
                  <a
                    href="#plans"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      marginTop: 16, background: GOLD, color: '#0B0B16',
                      padding: '10px 20px', borderRadius: 10,
                      fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    }}
                  >
                    <ArrowUpCircle size={16} />
                    ترقية الباقة
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ─── الباقات المتاحة ─── */}
          {plans.length > 0 && (
            <div id="plans">
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'rgba(255,255,255,0.9)' }}>
                الباقات المتاحة
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {plans.map((p: any) => (
                  <div
                    key={p.id}
                    style={{
                      background: p.is_featured ? 'rgba(201,168,76,0.1)' : CARD_BG,
                      border: `1px solid ${p.is_featured ? GOLD : BORDER}`,
                      borderRadius: 16, padding: 24,
                      position: 'relative',
                    }}
                  >
                    {p.is_featured && (
                      <div style={{
                        position: 'absolute', top: -12, right: 20,
                        background: GOLD, color: '#0B0B16',
                        padding: '2px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                      }}>
                        الأكثر شيوعاً
                      </div>
                    )}
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{p.name_ar}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: GOLD, marginBottom: 4 }}>
                      {p.price_monthly > 0 ? `${p.price_monthly} ر.س` : 'مجاناً'}
                      {p.price_monthly > 0 && <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}> / شهر</span>}
                    </div>
                    <ul style={{ padding: 0, margin: '12px 0 0', listStyle: 'none', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                      {p.max_students > 0 && (
                        <li style={{ marginBottom: 4 }}>✓ حتى {p.max_students === 99999 ? 'غير محدود' : p.max_students.toLocaleString('ar-SA')} طالب</li>
                      )}
                      {p.max_storage_gb && (
                        <li style={{ marginBottom: 4 }}>✓ {p.max_storage_gb} GB تخزين</li>
                      )}
                      {Array.isArray(p.features) && p.features.map((f: string, i: number) => (
                        <li key={i} style={{ marginBottom: 4 }}>✓ {f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
