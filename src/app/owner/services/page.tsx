'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, StatCard, SearchBar, LoadingState, FilterTabs } from '../../dashboard/_components';

const CATEGORIES: Record<string, { label: string; color: string; icon: string }> = {
  academic:      { label: 'أكاديمي',       color: '#3B82F6', icon: '📚' },
  financial:     { label: 'مالي',          color: '#10B981', icon: '💰' },
  communication: { label: 'تواصل',         color: '#8B5CF6', icon: '📢' },
  transport:     { label: 'نقل',           color: '#F59E0B', icon: '🚌' },
  ai:            { label: 'ذكاء اصطناعي',  color: '#EC4899', icon: '🤖' },
  analytics:     { label: 'تحليلات',       color: '#06B6D4', icon: '📈' },
  branding:      { label: 'هوية',          color: '#C9A227', icon: '🎨' },
  services:      { label: 'خدمات',         color: '#6366F1', icon: '⚙️' },
  engagement:    { label: 'تفاعل',         color: '#EF4444', icon: '🏆' },
  technical:     { label: 'تقني',          color: '#64748B', icon: '🔧' },
};

const PLAN_COLORS: Record<string, string> = {
  basic: '#10B981', professional: '#3B82F6', enterprise: '#C9A227'
};

export default function OwnerServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolServices, setSchoolServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'school' | 'platform' | 'stats'>('school');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformStats, setPlatformStats] = useState<any>(null);

  const getH = () => ({ 'Authorization': 'Bearer ' + localStorage.getItem('matin_token'), 'Content-Type': 'application/json' });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (u.role !== 'super_admin') { router.push('/login'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, sc, st] = await Promise.all([
        fetch('/api/services?type=platform', { headers: getH() }).then(r => r.json()),
        fetch('/api/services?type=schools', { headers: getH() }).then(r => r.json()),
        fetch('/api/parent-payments?type=platform_stats', { headers: getH() }).then(r => r.json()),
      ]);
      setServices(Array.isArray(s) ? s : []);
      const sl = Array.isArray(sc) ? sc : [];
      setSchools(sl);
      if (sl.length > 0) setSelectedSchool(sl[0].id);
      setPlatformStats(st);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchSchoolServices = useCallback(async (sid: string) => {
    if (!sid) return;
    const res = await fetch(`/api/services?type=school&school_id=${sid}`, { headers: getH() });
    const d = await res.json();
    setSchoolServices(Array.isArray(d) ? d : []);
  }, []);

  useEffect(() => { if (selectedSchool) fetchSchoolServices(selectedSchool); }, [selectedSchool]);

  const toggleService = async (service_key: string, is_enabled: boolean) => {
    setSaving(service_key); setMsg(null);
    const res = await fetch('/api/services', { method: 'POST', headers: getH(), body: JSON.stringify({ service_key, school_id: selectedSchool, is_enabled }) });
    const d = await res.json();
    setMsg({ text: d.message || d.error, type: res.ok ? 'success' : 'error' });
    if (res.ok) fetchSchoolServices(selectedSchool);
    setSaving('');
  };

  const selectedSchoolData = schools.find((s: any) => s.id === selectedSchool);
  const filteredSchoolServices = schoolServices.filter(s =>
    (filterCategory === 'all' || s.category === filterCategory) &&
    (!searchQuery || s.name_ar.includes(searchQuery))
  );
  const filteredPlatformServices = services.filter(s =>
    (filterCategory === 'all' || s.category === filterCategory) &&
    (!searchQuery || s.name_ar.includes(searchQuery))
  );

  const mainTabs = [
    { key: 'school', label: '🏫 خدمات مؤسسة' },
    { key: 'platform', label: '🌐 كل الخدمات' },
    { key: 'stats', label: '📊 المدفوعات' },
  ];

  if (loading) return <LoadingState message="جاري تحميل الخدمات..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="إدارة الخدمات والصلاحيات"
        subtitle="تحكم كامل في الخدمات المفعّلة لكل مؤسسة"
        icon={<span style={{ fontSize: 20 }}>⚙️</span>}
      />

      {msg && (
        <div className={`alert-msg ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
        </div>
      )}

      <FilterTabs tabs={mainTabs} active={activeTab} onChange={v => setActiveTab(v as any)} />

      <div className="filters-bar">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="بحث في الخدمات..." />
        <select className="input-field" style={{ width: 'auto' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">كل الفئات</option>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
        </select>
      </div>

      {activeTab === 'school' && (
        <>
          <div className="dcard" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">اختر المؤسسة</label>
                <select className="input-field" value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)}>
                  {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name_ar || s.name_en}</option>)}
                </select>
              </div>
              {selectedSchoolData && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge" style={{ background: `${PLAN_COLORS[selectedSchoolData.plan] || '#6B7280'}20`, color: PLAN_COLORS[selectedSchoolData.plan] || '#6B7280' }}>
                    📦 {selectedSchoolData.plan || 'غير محدد'}
                  </span>
                  <span className={`badge ${selectedSchoolData.subscription_status === 'active' ? 'badge-green' : 'badge-red'}`}>
                    {selectedSchoolData.subscription_status === 'active' ? '✅ نشط' : '⚠️ منتهي'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="stat-grid" style={{ marginBottom: 16 }}>
            <StatCard label="إجمالي الخدمات" value={schoolServices.length} icon={<span>⚙️</span>} color="#3B82F6" />
            <StatCard label="مفعّلة" value={schoolServices.filter(s => s.is_enabled).length} icon={<span>✅</span>} color="#10B981" />
            <StatCard label="معطّلة" value={schoolServices.filter(s => !s.is_enabled).length} icon={<span>⛔</span>} color="#EF4444" />
          </div>

          {Object.entries(CATEGORIES).map(([catKey, cat]) => {
            const catSvcs = filteredSchoolServices.filter(s => s.category === catKey);
            if (!catSvcs.length) return null;
            return (
              <div key={catKey} className="dcard" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 20 }}>{cat.icon}</span>
                  <h3 style={{ color: cat.color, fontSize: 15, fontWeight: 700, margin: 0 }}>{cat.label}</h3>
                  <span className="badge" style={{ background: `${cat.color}20`, color: cat.color, fontSize: 11 }}>
                    {catSvcs.filter(s => s.is_enabled).length}/{catSvcs.length}
                  </span>
                </div>
                {catSvcs.map(svc => (
                  <div key={svc.key} className={`service-row ${svc.is_enabled ? 'service-on' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{svc.icon}</span>
                      <div>
                        <div className="cell-title" style={{ fontSize: 13 }}>{svc.name_ar}</div>
                        <span className="badge" style={{ fontSize: 10, background: `${PLAN_COLORS[svc.requires_plan] || '#6B7280'}20`, color: PLAN_COLORS[svc.requires_plan] || '#6B7280' }}>
                          {svc.requires_plan || 'basic'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleService(svc.key, !svc.is_enabled)}
                      disabled={saving === svc.key}
                      className={`toggle-switch ${svc.is_enabled ? 'toggle-on' : ''}`}
                    >
                      <div className="toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </>
      )}

      {activeTab === 'platform' && (
        <>
          {Object.entries(CATEGORIES).map(([catKey, cat]) => {
            const catSvcs = filteredPlatformServices.filter(s => s.category === catKey);
            if (!catSvcs.length) return null;
            return (
              <div key={catKey} className="dcard" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 20 }}>{cat.icon}</span>
                  <h3 style={{ color: cat.color, fontSize: 15, fontWeight: 700, margin: 0 }}>{cat.label}</h3>
                </div>
                <div className="cards-grid">
                  {catSvcs.map(svc => (
                    <div key={svc.key} className="dcard" style={{ padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 18 }}>{svc.icon}</span>
                        <span className="cell-title" style={{ fontSize: 13 }}>{svc.name_ar}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span className="badge" style={{ fontSize: 10, background: `${PLAN_COLORS[svc.requires_plan] || '#6B7280'}20`, color: PLAN_COLORS[svc.requires_plan] || '#6B7280' }}>
                          {svc.requires_plan || 'basic'}
                        </span>
                        {svc.is_core && <span className="badge badge-green" style={{ fontSize: 10 }}>أساسية</span>}
                        <span className="badge badge-blue" style={{ fontSize: 10 }}>{svc.enabled_count || 0} مؤسسة</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      {activeTab === 'stats' && platformStats && (
        <>
          <div className="stat-grid">
            <StatCard label="إجمالي المحصّل" value={`${Number(platformStats.totals?.total_collected || 0).toLocaleString()} ريال`} icon={<span>💰</span>} color="#10B981" />
            <StatCard label="عمولة المنصة" value={`${Number(platformStats.totals?.total_platform_revenue || 0).toLocaleString()} ريال`} icon={<span>💎</span>} color="#C9A227" />
            <StatCard label="فواتير معلّقة" value={platformStats.totals?.total_pending || 0} icon={<span>⏳</span>} color="#F59E0B" />
          </div>
          <div className="dcard" style={{ marginTop: 16 }}>
            <h3 className="card-section-title">🏫 أداء المؤسسات</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="dtable">
                <thead>
                  <tr>{['المؤسسة', 'الفواتير', 'المحصّل', 'عمولة المنصة', 'معلّق'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)', textAlign: 'right', fontWeight: 600, fontSize: 13 }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {(platformStats.schools || []).map((sc: any) => (
                    <tr key={sc.school_id} className="dtable-row">
                      <td className="cell-title" style={{ padding: '10px 12px' }}>{sc.school_name}</td>
                      <td className="cell-sub" style={{ padding: '10px 12px' }}>{sc.total_invoices}</td>
                      <td style={{ padding: '10px 12px', color: '#10B981', fontWeight: 700 }}>{Number(sc.collected).toLocaleString()} ريال</td>
                      <td style={{ padding: '10px 12px', color: '#C9A227', fontWeight: 700 }}>{Number(sc.platform_revenue).toLocaleString()} ريال</td>
                      <td style={{ padding: '10px 12px', color: '#F59E0B' }}>{sc.pending_invoices}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
