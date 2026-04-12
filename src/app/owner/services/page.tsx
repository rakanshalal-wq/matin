'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, StatCard, SearchBar, LoadingState, FilterTabs } from '../../dashboard/_components';

const CATEGORIES: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  academic:      { label: 'أكاديمي',       color: '#3B82F6', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  financial:     { label: 'مالي',          color: '#10B981', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  communication: { label: 'تواصل',         color: '#8B5CF6', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  transport:     { label: 'نقل',           color: '#F59E0B', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg> },
  ai:            { label: 'ذكاء اصطناعي',  color: '#EC4899', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3"/></svg> },
  analytics:     { label: 'تحليلات',       color: '#06B6D4', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> },
  branding:      { label: 'هوية',          color: '#C9A227', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  services:      { label: 'خدمات',         color: '#6366F1', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  engagement:    { label: 'تفاعل',         color: '#EF4444', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg> },
  technical:     { label: 'تقني',          color: '#64748B', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
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
    { key: 'school', label: '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg> خدمات مؤسسة' },
    { key: 'platform', label: '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> كل الخدمات' },
    { key: 'stats', label: '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> المدفوعات' },
  ];

  if (loading) return <LoadingState message="جاري تحميل الخدمات..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="إدارة الخدمات والصلاحيات"
        subtitle="تحكم كامل في الخدمات المفعّلة لكل مؤسسة"
        icon={<span style={{ fontSize: 20 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>}
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
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> {selectedSchoolData.plan || 'غير محدد'}
                  </span>
                  <span className={`badge ${selectedSchoolData.subscription_status === 'active' ? 'badge-green' : 'badge-red'}`}>
                    {selectedSchoolData.subscription_status === 'active' ? '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> نشط' : '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01"/></svg> منتهي'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="stat-grid" style={{ marginBottom: 16 }}>
            <StatCard label="إجمالي الخدمات" value={schoolServices.length} icon={<span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>} color="#3B82F6" />
            <StatCard label="مفعّلة" value={schoolServices.filter(s => s.is_enabled).length} icon={<span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></span>} color="#10B981" />
            <StatCard label="معطّلة" value={schoolServices.filter(s => !s.is_enabled).length} icon={<span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01"/></svg></span>} color="#EF4444" />
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
            <StatCard label="إجمالي المحصّل" value={`${Number(platformStats.totals?.total_collected || 0).toLocaleString()} ريال`} icon={<span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>} color="#10B981" />
            <StatCard label="عمولة المنصة" value={`${Number(platformStats.totals?.total_platform_revenue || 0).toLocaleString()} ريال`} icon={<span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>} color="#C9A227" />
            <StatCard label="فواتير معلّقة" value={platformStats.totals?.total_pending || 0} icon={<span>⏳</span>} color="#F59E0B" />
          </div>
          <div className="dcard" style={{ marginTop: 16 }}>
            <h3 className="card-section-title"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg> أداء المؤسسات</h3>
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
