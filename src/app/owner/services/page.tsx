'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES: Record<string, { label: string; color: string; icon: string }> = {
  academic:      { label: 'أكاديمي',        color: '#3B82F6', icon: '📚' },
  financial:     { label: 'مالي',           color: '#10B981', icon: '💰' },
  communication: { label: 'تواصل',          color: '#8B5CF6', icon: '📢' },
  transport:     { label: 'نقل',            color: '#F59E0B', icon: '🚌' },
  ai:            { label: 'ذكاء اصطناعي',   color: '#EC4899', icon: '🤖' },
  analytics:     { label: 'تحليلات',        color: '#06B6D4', icon: '📈' },
  branding:      { label: 'هوية',           color: '#C9A227', icon: '🎨' },
  services:      { label: 'خدمات',          color: '#6366F1', icon: '⚙️' },
  engagement:    { label: 'تفاعل',          color: '#EF4444', icon: '🏆' },
  technical:     { label: 'تقني',           color: '#64748B', icon: '🔧' },
};

const PLAN_COLORS: Record<string, string> = { basic: '#10B981', professional: '#3B82F6', enterprise: '#C9A227' };

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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
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
  const filteredSchoolServices = schoolServices.filter(s => (filterCategory === 'all' || s.category === filterCategory) && (!searchQuery || s.name_ar.includes(searchQuery)));
  const filteredPlatformServices = services.filter(s => (filterCategory === 'all' || s.category === filterCategory) && (!searchQuery || s.name_ar.includes(searchQuery)));

  const P = { page: { padding: 24, direction: 'rtl' as const, fontFamily: 'IBM Plex Sans Arabic,Arial,sans-serif', background: '#0D1B2A', minHeight: '100vh' } };

  if (loading) return <div style={{ ...P.page, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A227', fontSize: 18 }}>⚙️ جاري التحميل...</div>;

  return (
    <div style={P.page}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#C9A227', fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>⚙️ إدارة الخدمات والصلاحيات</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>تحكم كامل في الخدمات المفعّلة لكل مؤسسة</p>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14, background: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msg.type === 'success' ? '#10B981' : '#EF4444', display: 'flex', justifyContent: 'space-between' }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 6 }}>
        {[{ k: 'school', l: '🏫 خدمات مؤسسة' }, { k: 'platform', l: '🌐 كل الخدمات' }, { k: 'stats', l: '📊 المدفوعات' }].map(t => (
          <button key={t.k} onClick={() => setActiveTab(t.k as any)} style={{ flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, textAlign: 'center', background: activeTab === t.k ? 'rgba(201,162,39,0.15)' : 'transparent', color: activeTab === t.k ? '#C9A227' : 'rgba(255,255,255,0.5)', border: activeTab === t.k ? '1px solid rgba(201,162,39,0.3)' : '1px solid transparent' }}>{t.l}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input placeholder="🔍 بحث..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, fontFamily: 'inherit' }} />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, fontFamily: 'inherit' }}>
          <option value="all">كل الفئات</option>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
        </select>
      </div>

      {activeTab === 'school' && (
        <div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, display: 'block', marginBottom: 6 }}>اختر المؤسسة</label>
                <select value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: 14, fontFamily: 'inherit' }}>
                  {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name_ar || s.name_en}</option>)}
                </select>
              </div>
              {selectedSchoolData && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${PLAN_COLORS[selectedSchoolData.plan] || '#6B7280'}20`, color: PLAN_COLORS[selectedSchoolData.plan] || '#6B7280', border: `1px solid ${PLAN_COLORS[selectedSchoolData.plan] || '#6B7280'}40` }}>📦 {selectedSchoolData.plan || 'غير محدد'}</span>
                  <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: selectedSchoolData.subscription_status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: selectedSchoolData.subscription_status === 'active' ? '#10B981' : '#EF4444', border: `1px solid ${selectedSchoolData.subscription_status === 'active' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>{selectedSchoolData.subscription_status === 'active' ? '✅ نشط' : '⚠️ منتهي'}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12, marginBottom: 20 }}>
            {[{ l: 'إجمالي الخدمات', v: schoolServices.length, c: '#3B82F6', i: '⚙️' }, { l: 'مفعّلة', v: schoolServices.filter(s => s.is_enabled).length, c: '#10B981', i: '✅' }, { l: 'معطّلة', v: schoolServices.filter(s => !s.is_enabled).length, c: '#EF4444', i: '⛔' }].map(st => (
              <div key={st.l} style={{ background: `${st.c}10`, border: `1px solid ${st.c}25`, borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 24 }}>{st.i}</div>
                <div style={{ color: st.c, fontSize: 22, fontWeight: 800 }}>{st.v}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{st.l}</div>
              </div>
            ))}
          </div>

          {Object.entries(CATEGORIES).map(([catKey, cat]) => {
            const catSvcs = filteredSchoolServices.filter(s => s.category === catKey);
            if (!catSvcs.length) return null;
            return (
              <div key={catKey} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>{cat.icon}</span>
                  <h3 style={{ color: cat.color, fontSize: 16, fontWeight: 700, margin: 0 }}>{cat.label}</h3>
                  <span style={{ background: `${cat.color}20`, color: cat.color, fontSize: 11, padding: '2px 10px', borderRadius: 20 }}>{catSvcs.filter(s => s.is_enabled).length}/{catSvcs.length}</span>
                </div>
                {catSvcs.map(svc => (
                  <div key={svc.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, marginBottom: 6, background: svc.is_enabled ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${svc.is_enabled ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{svc.icon}</span>
                      <div>
                        <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{svc.name_ar}</div>
                        <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 20, background: `${PLAN_COLORS[svc.requires_plan] || '#6B7280'}20`, color: PLAN_COLORS[svc.requires_plan] || '#6B7280' }}>{svc.requires_plan || 'basic'}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleService(svc.key, !svc.is_enabled)} disabled={saving === svc.key} style={{ width: 48, height: 26, borderRadius: 13, cursor: 'pointer', position: 'relative', background: svc.is_enabled ? '#10B981' : 'rgba(255,255,255,0.15)', border: 'none', transition: 'background 0.2s' }}>
                      <div style={{ position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'all 0.2s', right: svc.is_enabled ? 3 : 'auto', left: svc.is_enabled ? 'auto' : 3 }} />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'platform' && (
        <div>
          {Object.entries(CATEGORIES).map(([catKey, cat]) => {
            const catSvcs = filteredPlatformServices.filter(s => s.category === catKey);
            if (!catSvcs.length) return null;
            return (
              <div key={catKey} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>{cat.icon}</span>
                  <h3 style={{ color: cat.color, fontSize: 16, fontWeight: 700, margin: 0 }}>{cat.label}</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 10 }}>
                  {catSvcs.map(svc => (
                    <div key={svc.key} style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>{svc.icon}</span>
                        <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{svc.name_ar}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: `${PLAN_COLORS[svc.requires_plan] || '#6B7280'}20`, color: PLAN_COLORS[svc.requires_plan] || '#6B7280' }}>{svc.requires_plan || 'basic'}</span>
                        {svc.is_core && <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>أساسية</span>}
                        <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>{svc.enabled_count || 0} مؤسسة</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'stats' && platformStats && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
            {[{ l: 'إجمالي المحصّل', v: `${Number(platformStats.totals?.total_collected || 0).toLocaleString()} ريال`, c: '#10B981', i: '💰' }, { l: 'عمولة المنصة', v: `${Number(platformStats.totals?.total_platform_revenue || 0).toLocaleString()} ريال`, c: '#C9A227', i: '💎' }, { l: 'فواتير معلّقة', v: platformStats.totals?.total_pending || 0, c: '#F59E0B', i: '⏳' }].map(st => (
              <div key={st.l} style={{ background: `${st.c}10`, border: `1px solid ${st.c}25`, borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{st.i}</div>
                <div style={{ color: st.c, fontSize: 20, fontWeight: 800 }}>{st.v}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{st.l}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ color: '#C9A227', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🏫 أداء المؤسسات</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{['المؤسسة', 'الفواتير', 'المحصّل', 'عمولة المنصة', 'معلّق'].map(h => <th key={h} style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)', textAlign: 'right', fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>{(platformStats.schools || []).map((sc: any) => (
                  <tr key={sc.school_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 12px', color: 'white', fontWeight: 600 }}>{sc.school_name}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.7)' }}>{sc.total_invoices}</td>
                    <td style={{ padding: '10px 12px', color: '#10B981', fontWeight: 700 }}>{Number(sc.collected).toLocaleString()} ريال</td>
                    <td style={{ padding: '10px 12px', color: '#C9A227', fontWeight: 700 }}>{Number(sc.platform_revenue).toLocaleString()} ريال</td>
                    <td style={{ padding: '10px 12px', color: '#F59E0B' }}>{sc.pending_invoices}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
