'use client';
import { useState, useEffect, useCallback } from 'react';

interface HeroCard { title: string; tag: string; desc: string; }
interface Institution { name: string; tag: string; desc: string; }
interface Feature { title: string; color: string; desc: string; }
interface PricingPlan { name: string; price: string; period: string; features: string; btn: string; badge: string; }
interface Testimonial { text: string; name: string; title: string; rating: number; }
interface FaqItem { question: string; answer: string; }

interface EditorData {
  hero_badge: string; hero_title1: string; hero_title2: string; hero_desc: string;
  hero_btn1: string; hero_btn2: string;
  bg_type: string; bg_value: string;
  bg_gradient_from: string; bg_gradient_to: string; bg_gradient_dir: string;
  bg_image_url: string; bg_overlay_opacity: number;
  announcement_text: string; sec_announcement: boolean;
  inst_title1: string; inst_title2: string; inst_desc: string;
  feat_title1: string; feat_title2: string;
  pricing_title: string; pricing_desc: string;
  footer_copyright: string; footer_logo_desc: string;
  footer_whatsapp: string; footer_email: string; footer_twitter: string; footer_linkedin: string;
  sec_institutions: boolean; sec_features: boolean; sec_roles: boolean;
  sec_integrations: boolean; sec_pricing: boolean; sec_testimonials: boolean;
  sec_faq: boolean; sec_cta: boolean; sec_floating_whatsapp: boolean;
  hero_cards: HeroCard[]; institutions: Institution[]; features: Feature[];
  pricing_plans: PricingPlan[]; testimonials: Testimonial[];
  integrations: string[]; faqs: FaqItem[];
  [key: string]: any;
}

const TABS = [
  { id: 'hero', label: 'الهيرو' },
  { id: 'institutions', label: 'المؤسسات' },
  { id: 'features', label: 'المميزات' },
  { id: 'pricing', label: 'الأسعار' },
  { id: 'testimonials', label: 'شهادات العملاء' },
  { id: 'integrations', label: 'التكاملات' },
  { id: 'faq', label: 'FAQ' },
  { id: 'footer', label: 'الفوتر' },
  { id: 'sections', label: 'الأقسام' },
];

const COLOR_PRESETS = ['var(--bg)','#0A0A1A','#0D0D0D','#0A1628','#0D1117','#1A0A00','#0A1A0A'];
const GRAD_PRESETS = [
  'linear-gradient(135deg,#06060E 0%,#0A1628 100%)',
  'linear-gradient(135deg,#06060E 0%,#1A0D00 100%)',
  'linear-gradient(135deg,#0A0A1A 0%,#1A0A1A 100%)',
  'linear-gradient(180deg,#06060E 0%,#0D1A2E 100%)',
  'linear-gradient(135deg,#0A0A0A 0%,#141414 50%,#0A0A0A 100%)',
];

export default function LandingEditorPage() {
  const [tab, setTab] = useState('hero');
  const [data, setData] = useState<EditorData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [newInt, setNewInt] = useState('');

  useEffect(() => {
    fetch('/api/landing-content').then(r => r.json()).then(d => {
      if (!Array.isArray(d.hero_cards)) d.hero_cards = [];
      if (!Array.isArray(d.institutions)) d.institutions = [];
      if (!Array.isArray(d.features)) d.features = [];
      if (!Array.isArray(d.pricing_plans)) d.pricing_plans = [];
      if (!Array.isArray(d.testimonials)) d.testimonials = [];
      if (!Array.isArray(d.integrations)) d.integrations = [];
      if (!Array.isArray(d.faqs)) d.faqs = [];
      setData(d);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (hasChanges) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  const u = useCallback((key: string, val: any) => {
    setData(prev => prev ? { ...prev, [key]: val } : prev);
    setHasChanges(true);
    setSaveMsg('');
  }, []);

  const saveAll = async () => {
    if (!data) return;
    setSaving(true); setSaveMsg('');
    try {
      const res = await fetch('/api/landing-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const r = await res.json();
      if (!r.ok) throw new Error(r.error || 'خطأ');
      setSaveMsg('ok'); setHasChanges(false);
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (e: any) { setSaveMsg('err:' + e.message); }
    setSaving(false);
  };

  if (!data) return (
    <div className="landing-editor" style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:'var(--gold)',fontSize:18,fontWeight:700}}>جاري التحميل...</p>
    </div>
  );

  const bgPreview = () => {
    if (data.bg_type === 'gradient') return `linear-gradient(${data.bg_gradient_dir},${data.bg_gradient_from} 0%,${data.bg_gradient_to} 100%)`;
    if (data.bg_type === 'image' && data.bg_image_url) return `url('${data.bg_image_url}') center/cover no-repeat`;
    return data.bg_value || 'var(--bg)';
  };

  return (
    <div className="landing-editor">
      <style>{`
.landing-editor{font-family:'IBM Plex Sans Arabic',var(--font),sans-serif;color:#EEEEF5;direction:rtl;}
.landing-editor *{box-sizing:border-box;}
.le-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap;gap:12px;}
.le-title{color:#D4A843;font-size:20px;font-weight:800;display:flex;align-items:center;gap:8px;}
.le-sub{color:rgba(238,238,245,0.28);font-size:13px;margin-top:4px;}
.le-tabs{display:flex;gap:6px;margin-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.07);padding-bottom:0;overflow-x:auto;}
.le-tabs::-webkit-scrollbar{display:none;}
.le-tab{background:transparent;border:none;border-bottom:2px solid transparent;padding:10px 18px;color:rgba(238,238,245,0.55);font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all 0.15s;margin-bottom:-1px;}
.le-tab:hover{color:#EEEEF5;}
.le-tab.active{color:#D4A843;border-bottom-color:#D4A843;font-weight:700;}
.le-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden;margin-bottom:16px;}
.le-card-hdr{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:space-between;gap:12px;}
.le-card-title{font-size:14px;font-weight:700;color:#EEEEF5;display:flex;align-items:center;gap:8px;}
.le-card-body{padding:18px;}
.le-field{margin-bottom:16px;}
.le-field:last-child{margin-bottom:0;}
.le-label{color:rgba(238,238,245,0.55);font-size:12px;font-weight:600;display:block;margin-bottom:6px;}
.le-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:10px 14px;color:#EEEEF5;font-size:13px;outline:none;font-family:inherit;transition:border-color 0.15s;}
.le-input:focus{border-color:rgba(212,168,67,0.4);}
.le-input::placeholder{color:rgba(238,238,245,0.2);}
textarea.le-input{resize:vertical;min-height:80px;line-height:1.6;}
.le-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.le-list-item{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);border-radius:10px;padding:14px 16px;margin-bottom:10px;}
.le-toggle-row{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.04);}
.le-toggle-row:last-child{border-bottom:none;}
.le-toggle-name{font-size:13px;font-weight:600;color:#EEEEF5;}
.le-toggle-desc{font-size:11px;color:rgba(238,238,245,0.28);margin-top:2px;}
.le-toggle{position:relative;width:42px;height:24px;flex-shrink:0;}
.le-toggle input{opacity:0;width:0;height:0;position:absolute;}
.le-toggle-slider{position:absolute;inset:0;background:rgba(255,255,255,0.1);border-radius:24px;cursor:pointer;transition:0.2s;}
.le-toggle-slider::before{content:'';position:absolute;width:18px;height:18px;background:#fff;border-radius:50%;bottom:3px;right:3px;transition:0.2s;}
.le-toggle input:checked+.le-toggle-slider{background:#D4A843;}
.le-toggle input:checked+.le-toggle-slider::before{transform:translateX(-18px);}
.le-btn-gold{background:linear-gradient(135deg,#D4A843,#E8C060);border:none;border-radius:9px;padding:10px 20px;color:#06060E;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:7px;box-shadow:0 4px 14px rgba(212,168,67,0.25);transition:all 0.2s;white-space:nowrap;}
.le-btn-gold:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(212,168,67,0.4);}
.le-btn-gold:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
.le-btn-outline{background:transparent;border:1px solid rgba(255,255,255,0.07);border-radius:9px;padding:9px 18px;color:rgba(238,238,245,0.55);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:7px;transition:all 0.2s;}
.le-btn-outline:hover{border-color:rgba(255,255,255,0.15);color:#EEEEF5;}
.le-btn-red{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:6px 12px;color:#EF4444;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px;transition:all 0.15s;}
.le-btn-red:hover{background:rgba(239,68,68,0.14);}
.le-btn-green{background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:8px;padding:6px 12px;color:#10B981;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px;transition:all 0.15s;}
.le-save-bar{position:sticky;bottom:0;background:rgba(6,6,14,0.92);backdrop-filter:blur(16px);border-top:1px solid rgba(255,255,255,0.07);padding:14px 0;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:24px;}
.le-save-msg{font-size:12px;color:rgba(238,238,245,0.28);display:flex;align-items:center;gap:6px;}
.le-pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.le-price-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);border-radius:12px;padding:16px;}
.le-price-name{font-size:11px;font-weight:700;color:rgba(238,238,245,0.28);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px;}
.le-color-swatch{width:36px;height:36px;border-radius:8px;cursor:pointer;border:1px solid rgba(255,255,255,0.04);transition:border 0.15s;}
.le-color-swatch.active{border:2px solid #D4A843;}
.le-grad-swatch{width:80px;height:48px;border-radius:8px;cursor:pointer;border:1px solid rgba(255,255,255,0.04);transition:border 0.15s;}
.le-grad-swatch.active{border:2px solid #D4A843;}
.le-int-tag{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.04);border-radius:8px;padding:7px 12px;}
.le-int-tag span{font-size:13px;font-weight:600;color:rgba(238,238,245,0.55);}
.le-int-tag button{background:none;border:none;color:rgba(238,238,245,0.28);cursor:pointer;font-size:14px;line-height:1;}
.le-star{cursor:pointer;transition:color 0.1s;}
@media(max-width:768px){.le-row{grid-template-columns:1fr;}.le-pricing-grid{grid-template-columns:1fr;}.le-save-bar{flex-direction:column;text-align:center;}}
      `}</style>

      {/* HEADER */}
      <div className="le-hdr">
        <div>
          <div className="le-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            محرر الواجهة الأمامية
          </div>
          <div className="le-sub">تحكم كامل في محتوى وتصميم صفحة matin.ink</div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <a href="/" target="_blank" className="le-btn-outline" style={{textDecoration:'none'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            معاينة الموقع
          </a>
          <button className="le-btn-gold" onClick={saveAll} disabled={saving}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="le-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`le-tab${tab===t.id?' active':''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ═══ HERO ═══ */}
      {tab === 'hero' && <>
        {/* Background */}
        <div className="le-card">
          <div className="le-card-hdr"><div className="le-card-title">خلفية الصفحة الرئيسية</div></div>
          <div className="le-card-body">
            <div className="le-field">
              <label className="le-label">نوع الخلفية</label>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {['color','gradient','image'].map(t => (
                  <button key={t} onClick={() => u('bg_type',t)} style={{
                    background: data.bg_type===t ? 'rgba(212,168,67,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${data.bg_type===t ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    color: data.bg_type===t ? '#D4A843' : 'rgba(238,238,245,0.55)',
                    borderRadius:8,padding:'8px 16px',fontSize:'12.5px',fontWeight:data.bg_type===t?700:600,cursor:'pointer',fontFamily:'inherit'
                  }}>
                    {t==='color'?'لون ثابت':t==='gradient'?'تدرج لوني':'صورة'}
                  </button>
                ))}
              </div>
            </div>

            {data.bg_type === 'color' && (
              <div className="le-field">
                <label className="le-label">لون الخلفية</label>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                  <input type="color" value={data.bg_value||'var(--bg)'} onChange={e => u('bg_value',e.target.value)} style={{width:56,height:44,borderRadius:10,border:'1px solid rgba(255,255,255,0.07)',cursor:'pointer',padding:4,background:'var(--bg-card)'}} />
                  <input className="le-input" value={data.bg_value||'var(--bg)'} onChange={e => u('bg_value',e.target.value)} style={{maxWidth:140}} />
                </div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {COLOR_PRESETS.map(c => (
                    <div key={c} className={`le-color-swatch${data.bg_value===c?' active':''}`} style={{background:c}} onClick={() => u('bg_value',c)} />
                  ))}
                </div>
              </div>
            )}

            {data.bg_type === 'gradient' && (
              <div className="le-field">
                <label className="le-label">التدرجات الجاهزة</label>
                <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:14}}>
                  {GRAD_PRESETS.map((g,i) => (
                    <div key={i} className="le-grad-swatch" style={{background:g}} onClick={() => {
                      const m = g.match(/#[0-9A-Fa-f]{6}/g);
                      if (m && m.length >= 2) { u('bg_gradient_from',m[0]); u('bg_gradient_to',m[1]); }
                    }} />
                  ))}
                </div>
                <div className="le-row">
                  <div className="le-field">
                    <label className="le-label">لون البداية</label>
                    <input type="color" value={data.bg_gradient_from||'var(--bg)'} onChange={e => u('bg_gradient_from',e.target.value)} style={{width:'100%',height:42,borderRadius:8,border:'1px solid rgba(255,255,255,0.07)',cursor:'pointer',padding:4,background:'var(--bg-card)'}} />
                  </div>
                  <div className="le-field">
                    <label className="le-label">لون النهاية</label>
                    <input type="color" value={data.bg_gradient_to||'#0A1628'} onChange={e => u('bg_gradient_to',e.target.value)} style={{width:'100%',height:42,borderRadius:8,border:'1px solid rgba(255,255,255,0.07)',cursor:'pointer',padding:4,background:'var(--bg-card)'}} />
                  </div>
                </div>
                <div className="le-field">
                  <label className="le-label">اتجاه التدرج</label>
                  <select className="le-input" value={data.bg_gradient_dir||'135deg'} onChange={e => u('bg_gradient_dir',e.target.value)}>
                    <option value="135deg">مائل (135°) — الافتراضي</option>
                    <option value="180deg">من أعلى لأسفل</option>
                    <option value="90deg">من اليمين لليسار</option>
                    <option value="45deg">مائل (45°)</option>
                  </select>
                </div>
              </div>
            )}

            {data.bg_type === 'image' && (
              <>
                <div className="le-field">
                  <label className="le-label">رابط صورة الخلفية</label>
                  <input className="le-input" type="url" placeholder="https://example.com/image.jpg" value={data.bg_image_url||''} onChange={e => u('bg_image_url',e.target.value)} />
                </div>
                <div className="le-field">
                  <label className="le-label">شفافية التعتيم فوق الصورة: {data.bg_overlay_opacity ?? 70}%</label>
                  <input type="range" min={0} max={90} value={data.bg_overlay_opacity??70} onChange={e => u('bg_overlay_opacity',Number(e.target.value))} style={{width:'100%',accentColor:'#D4A843'}} />
                </div>
              </>
            )}

            <div className="le-field" style={{marginTop:8}}>
              <label className="le-label">معاينة الخلفية</label>
              <div style={{width:'100%',height:120,borderRadius:10,background:bgPreview(),border:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
                {data.bg_type==='image' && data.bg_image_url && <div style={{position:'absolute',inset:0,background:`rgba(0,0,0,${(data.bg_overlay_opacity??70)/100})`}} />}
                <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
                  <div style={{fontSize:18,fontWeight:800,color:'#EEEEF5'}}>{data.hero_title1||'كل مؤسستك في'}</div>
                  <div style={{fontSize:18,fontWeight:800,color:'var(--gold)'}}>{data.hero_title2||'لوحة تحكم واحدة'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcement */}
        <div className="le-card">
          <div className="le-card-hdr">
            <div className="le-card-title">الشريط الإعلاني (أعلى الصفحة)</div>
            <label className="le-toggle"><input type="checkbox" checked={data.sec_announcement!==false} onChange={e => u('sec_announcement',e.target.checked)} /><span className="le-toggle-slider"></span></label>
          </div>
          <div className="le-card-body">
            <div className="le-field">
              <label className="le-label">نص الشريط</label>
              <input className="le-input" value={data.announcement_text||''} onChange={e => u('announcement_text',e.target.value)} placeholder="نص الشريط الإعلاني" />
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="le-card">
          <div className="le-card-hdr"><div className="le-card-title">قسم الهيرو الرئيسي</div></div>
          <div className="le-card-body">
            <div className="le-field"><label className="le-label">العنوان الرئيسي (السطر الأول)</label><input className="le-input" value={data.hero_title1||''} onChange={e => u('hero_title1',e.target.value)} /></div>
            <div className="le-field"><label className="le-label">العنوان الرئيسي (السطر الثاني — ذهبي)</label><input className="le-input" value={data.hero_title2||''} onChange={e => u('hero_title2',e.target.value)} /></div>
            <div className="le-field"><label className="le-label">الوصف</label><textarea className="le-input" value={data.hero_desc||''} onChange={e => u('hero_desc',e.target.value)} /></div>
            <div className="le-row">
              <div className="le-field"><label className="le-label">نص الزر الأول</label><input className="le-input" value={data.hero_btn1||''} onChange={e => u('hero_btn1',e.target.value)} /></div>
              <div className="le-field"><label className="le-label">نص الزر الثاني</label><input className="le-input" value={data.hero_btn2||''} onChange={e => u('hero_btn2',e.target.value)} /></div>
            </div>
          </div>
        </div>

        {/* Hero cards */}
        <div className="le-card">
          <div className="le-card-hdr">
            <div className="le-card-title">النوافذ الثلاث (تحت الهيرو)</div>
            <button className="le-btn-green" onClick={() => u('hero_cards',[...data.hero_cards,{title:'',tag:'',desc:''}])}>+ إضافة</button>
          </div>
          <div className="le-card-body">
            {data.hero_cards.map((card,i) => (
              <div key={i} className="le-list-item">
                <div className="le-row" style={{marginBottom:8}}>
                  <input className="le-input" value={card.title} onChange={e => { const a=[...data.hero_cards]; a[i]={...a[i],title:e.target.value}; u('hero_cards',a); }} placeholder="العنوان" />
                  <input className="le-input" value={card.tag} onChange={e => { const a=[...data.hero_cards]; a[i]={...a[i],tag:e.target.value}; u('hero_cards',a); }} placeholder="التاق" />
                </div>
                <textarea className="le-input" style={{minHeight:56}} value={card.desc} onChange={e => { const a=[...data.hero_cards]; a[i]={...a[i],desc:e.target.value}; u('hero_cards',a); }} placeholder="الوصف" />
                <div style={{textAlign:'left',marginTop:8}}>
                  <button className="le-btn-red" onClick={() => u('hero_cards',data.hero_cards.filter((_,j) => j!==i))}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* ═══ INSTITUTIONS ═══ */}
      {tab === 'institutions' && <>
        <div className="le-card">
          <div className="le-card-hdr"><div className="le-card-title">عنوان قسم المؤسسات</div></div>
          <div className="le-card-body">
            <div className="le-row">
              <div className="le-field"><label className="le-label">العنوان (السطر الأول)</label><input className="le-input" value={data.inst_title1||''} onChange={e => u('inst_title1',e.target.value)} /></div>
              <div className="le-field"><label className="le-label">العنوان (السطر الثاني — ذهبي)</label><input className="le-input" value={data.inst_title2||''} onChange={e => u('inst_title2',e.target.value)} /></div>
            </div>
            <div className="le-field"><label className="le-label">الوصف</label><textarea className="le-input" value={data.inst_desc||''} onChange={e => u('inst_desc',e.target.value)} /></div>
          </div>
        </div>
        <div className="le-card">
          <div className="le-card-hdr">
            <div className="le-card-title">بطاقات المؤسسات</div>
            <button className="le-btn-green" onClick={() => u('institutions',[...data.institutions,{name:'',tag:'',desc:''}])}>+ إضافة</button>
          </div>
          <div className="le-card-body">
            {data.institutions.map((inst,i) => (
              <div key={i} className="le-list-item">
                <div className="le-row" style={{marginBottom:8}}>
                  <input className="le-input" value={inst.name} onChange={e => { const a=[...data.institutions]; a[i]={...a[i],name:e.target.value}; u('institutions',a); }} placeholder="اسم المؤسسة" />
                  <input className="le-input" value={inst.tag} onChange={e => { const a=[...data.institutions]; a[i]={...a[i],tag:e.target.value}; u('institutions',a); }} placeholder="التاق" />
                </div>
                <textarea className="le-input" style={{minHeight:52}} value={inst.desc} onChange={e => { const a=[...data.institutions]; a[i]={...a[i],desc:e.target.value}; u('institutions',a); }} placeholder="الوصف" />
                <div style={{textAlign:'left',marginTop:8}}>
                  <button className="le-btn-red" onClick={() => u('institutions',data.institutions.filter((_,j) => j!==i))}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* ═══ FEATURES ═══ */}
      {tab === 'features' && <>
        <div className="le-card">
          <div className="le-card-hdr"><div className="le-card-title">عنوان قسم المميزات</div></div>
          <div className="le-card-body">
            <div className="le-row">
              <div className="le-field"><label className="le-label">السطر الأول</label><input className="le-input" value={data.feat_title1||''} onChange={e => u('feat_title1',e.target.value)} /></div>
              <div className="le-field"><label className="le-label">السطر الثاني — ذهبي</label><input className="le-input" value={data.feat_title2||''} onChange={e => u('feat_title2',e.target.value)} /></div>
            </div>
          </div>
        </div>
        <div className="le-card">
          <div className="le-card-hdr">
            <div className="le-card-title">قائمة المميزات</div>
            <button className="le-btn-green" onClick={() => u('features',[...data.features,{title:'',color:'var(--gold)',desc:''}])}>+ إضافة</button>
          </div>
          <div className="le-card-body">
            {data.features.map((feat,i) => (
              <div key={i} className="le-list-item">
                <div className="le-row" style={{marginBottom:8}}>
                  <input className="le-input" value={feat.title} onChange={e => { const a=[...data.features]; a[i]={...a[i],title:e.target.value}; u('features',a); }} placeholder="عنوان الميزة" />
                  <input type="color" value={feat.color||'#D4A843'} onChange={e => { const a=[...data.features]; a[i]={...a[i],color:e.target.value}; u('features',a); }} style={{height:42,padding:'4px 8px',cursor:'pointer',borderRadius:8,border:'1px solid rgba(255,255,255,0.07)'}} />
                </div>
                <textarea className="le-input" style={{minHeight:52}} value={feat.desc} onChange={e => { const a=[...data.features]; a[i]={...a[i],desc:e.target.value}; u('features',a); }} placeholder="الوصف" />
                <div style={{textAlign:'left',marginTop:8}}>
                  <button className="le-btn-red" onClick={() => u('features',data.features.filter((_,j) => j!==i))}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* ═══ PRICING ═══ */}
      {tab === 'pricing' && <>
        <div className="le-card">
          <div className="le-card-hdr"><div className="le-card-title">عنوان قسم الأسعار</div></div>
          <div className="le-card-body">
            <div className="le-row">
              <div className="le-field"><label className="le-label">العنوان</label><input className="le-input" value={data.pricing_title||''} onChange={e => u('pricing_title',e.target.value)} /></div>
              <div className="le-field"><label className="le-label">الوصف</label><input className="le-input" value={data.pricing_desc||''} onChange={e => u('pricing_desc',e.target.value)} /></div>
            </div>
          </div>
        </div>
        <div className="le-pricing-grid">
          {data.pricing_plans.map((plan,i) => (
            <div key={i} className="le-price-card" style={i===1?{borderColor:'rgba(212,168,67,0.22)',background:'rgba(212,168,67,0.04)'}:{}}>
              <div className="le-price-name" style={i===1?{color:'var(--gold)'}:{}}>{i===1?'★ ':''}{plan.name||`باقة ${i+1}`}</div>
              <div className="le-field"><label className="le-label">اسم الباقة</label><input className="le-input" value={plan.name} onChange={e => { const a=[...data.pricing_plans]; a[i]={...a[i],name:e.target.value}; u('pricing_plans',a); }} /></div>
              <div className="le-field"><label className="le-label">السعر</label><input className="le-input" value={plan.price} onChange={e => { const a=[...data.pricing_plans]; a[i]={...a[i],price:e.target.value}; u('pricing_plans',a); }} /></div>
              <div className="le-field"><label className="le-label">الفترة</label><input className="le-input" value={plan.period} onChange={e => { const a=[...data.pricing_plans]; a[i]={...a[i],period:e.target.value}; u('pricing_plans',a); }} /></div>
              <div className="le-field"><label className="le-label">المميزات (سطر لكل ميزة)</label><textarea className="le-input" style={{minHeight:120}} value={plan.features} onChange={e => { const a=[...data.pricing_plans]; a[i]={...a[i],features:e.target.value}; u('pricing_plans',a); }} /></div>
              <div className="le-field"><label className="le-label">نص الزر</label><input className="le-input" value={plan.btn} onChange={e => { const a=[...data.pricing_plans]; a[i]={...a[i],btn:e.target.value}; u('pricing_plans',a); }} /></div>
              {i===1 && <div className="le-field"><label className="le-label">بادج</label><input className="le-input" value={plan.badge||''} onChange={e => { const a=[...data.pricing_plans]; a[i]={...a[i],badge:e.target.value}; u('pricing_plans',a); }} /></div>}
            </div>
          ))}
        </div>
      </>}

      {/* ═══ TESTIMONIALS ═══ */}
      {tab === 'testimonials' && <>
        <div className="le-card">
          <div className="le-card-hdr">
            <div className="le-card-title">شهادات العملاء</div>
            <button className="le-btn-green" onClick={() => u('testimonials',[...data.testimonials,{text:'',name:'',title:'',rating:5}])}>+ إضافة</button>
          </div>
          <div className="le-card-body">
            {data.testimonials.map((t,i) => (
              <div key={i} className="le-list-item" style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <span style={{fontSize:13,fontWeight:600}}>شهادة #{i+1}</span>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    <div style={{display:'flex',gap:2}}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className="le-star" width="16" height="16" viewBox="0 0 24 24" fill={s <= (t.rating||5) ? '#D4A843' : 'rgba(255,255,255,0.15)'} stroke="none" onClick={() => { const a=[...data.testimonials]; a[i]={...a[i],rating:s}; u('testimonials',a); }}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                    <button className="le-btn-red" onClick={() => u('testimonials',data.testimonials.filter((_,j) => j!==i))}>حذف</button>
                  </div>
                </div>
                <textarea className="le-input" style={{minHeight:72,marginBottom:8}} value={t.text} onChange={e => { const a=[...data.testimonials]; a[i]={...a[i],text:e.target.value}; u('testimonials',a); }} placeholder="نص الشهادة" />
                <div className="le-row">
                  <input className="le-input" value={t.name} onChange={e => { const a=[...data.testimonials]; a[i]={...a[i],name:e.target.value}; u('testimonials',a); }} placeholder="اسم العميل" />
                  <input className="le-input" value={t.title} onChange={e => { const a=[...data.testimonials]; a[i]={...a[i],title:e.target.value}; u('testimonials',a); }} placeholder="المسمى والمؤسسة" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* ═══ INTEGRATIONS ═══ */}
      {tab === 'integrations' && <>
        <div className="le-card">
          <div className="le-card-hdr"><div className="le-card-title">التكاملات المعروضة</div></div>
          <div className="le-card-body" style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {data.integrations.map((name,i) => (
              <div key={i} className="le-int-tag">
                <span>{name}</span>
                <button onClick={() => u('integrations',data.integrations.filter((_,j) => j!==i))}>x</button>
              </div>
            ))}
          </div>
          <div style={{padding:'14px 18px',borderTop:'1px solid rgba(255,255,255,0.04)',display:'flex',gap:8}}>
            <input className="le-input" placeholder="اسم التكامل الجديد..." value={newInt} onChange={e => setNewInt(e.target.value)} onKeyDown={e => { if (e.key==='Enter' && newInt.trim()) { u('integrations',[...data.integrations,newInt.trim()]); setNewInt(''); } }} style={{flex:1}} />
            <button className="le-btn-gold" onClick={() => { if (newInt.trim()) { u('integrations',[...data.integrations,newInt.trim()]); setNewInt(''); } }}>إضافة</button>
          </div>
        </div>
      </>}

      {/* ═══ FAQ ═══ */}
      {tab === 'faq' && <>
        <div className="le-card">
          <div className="le-card-hdr">
            <div className="le-card-title">الأسئلة الشائعة</div>
            <button className="le-btn-green" onClick={() => u('faqs',[...data.faqs,{question:'',answer:''}])}>+ إضافة</button>
          </div>
          <div className="le-card-body">
            {data.faqs.map((faq,i) => (
              <div key={i} className="le-list-item" style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <span style={{fontSize:12,color:'rgba(238,238,245,0.28)',fontWeight:600}}>سؤال #{i+1}</span>
                  <button className="le-btn-red" onClick={() => u('faqs',data.faqs.filter((_,j) => j!==i))}>حذف</button>
                </div>
                <input className="le-input" style={{marginBottom:8}} value={faq.question} onChange={e => { const a=[...data.faqs]; a[i]={...a[i],question:e.target.value}; u('faqs',a); }} placeholder="السؤال" />
                <textarea className="le-input" style={{minHeight:60}} value={faq.answer} onChange={e => { const a=[...data.faqs]; a[i]={...a[i],answer:e.target.value}; u('faqs',a); }} placeholder="الجواب" />
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* ═══ FOOTER ═══ */}
      {tab === 'footer' && <>
        <div className="le-card">
          <div className="le-card-hdr"><div className="le-card-title">معلومات الفوتر</div></div>
          <div className="le-card-body">
            <div className="le-field"><label className="le-label">نص حقوق النشر</label><input className="le-input" value={data.footer_copyright||''} onChange={e => u('footer_copyright',e.target.value)} /></div>
            <div className="le-field"><label className="le-label">وصف الشعار</label><input className="le-input" value={data.footer_logo_desc||''} onChange={e => u('footer_logo_desc',e.target.value)} /></div>
            <div className="le-row">
              <div className="le-field"><label className="le-label">رابط واتساب</label><input className="le-input" value={data.footer_whatsapp||''} onChange={e => u('footer_whatsapp',e.target.value)} placeholder="+966500000000" /></div>
              <div className="le-field"><label className="le-label">البريد الإلكتروني</label><input className="le-input" value={data.footer_email||''} onChange={e => u('footer_email',e.target.value)} placeholder="hello@matin.ink" /></div>
            </div>
            <div className="le-row">
              <div className="le-field"><label className="le-label">تويتر / X</label><input className="le-input" value={data.footer_twitter||''} onChange={e => u('footer_twitter',e.target.value)} placeholder="https://x.com/matinink" /></div>
              <div className="le-field"><label className="le-label">لينكدإن</label><input className="le-input" value={data.footer_linkedin||''} onChange={e => u('footer_linkedin',e.target.value)} placeholder="https://linkedin.com/company/matin" /></div>
            </div>
          </div>
        </div>
      </>}

      {/* ═══ SECTIONS ═══ */}
      {tab === 'sections' && <>
        <div className="le-card">
          <div className="le-card-hdr"><div className="le-card-title">تفعيل وتعطيل الأقسام</div></div>
          {[
            {key:'sec_announcement',name:'الشريط الإعلاني',desc:'الشريط في أعلى الصفحة'},
            {key:'sec_institutions',name:'قسم المؤسسات',desc:'بطاقات أنواع المؤسسات'},
            {key:'sec_features',name:'قسم المميزات',desc:'قائمة المميزات مع الموكاب'},
            {key:'sec_roles',name:'قسم الأدوار',desc:'شبكة الأدوار والصلاحيات'},
            {key:'sec_integrations',name:'قسم التكاملات',desc:'شرائح التكاملات'},
            {key:'sec_pricing',name:'قسم الأسعار',desc:'بطاقات الباقات والأسعار'},
            {key:'sec_testimonials',name:'شهادات العملاء',desc:'آراء وتقييمات العملاء'},
            {key:'sec_faq',name:'الأسئلة الشائعة FAQ',desc:'قسم الأسئلة والأجوبة'},
            {key:'sec_floating_whatsapp',name:'زر واتساب العائم',desc:'الزر الأخضر في أسفل الصفحة'},
            {key:'sec_cta',name:'قسم CTA (الدعوة للتسجيل)',desc:'قسم "جاهز لتحويل مؤسستك"'},
          ].map(s => (
            <div key={s.key} className="le-toggle-row">
              <div>
                <div className="le-toggle-name">{s.name}</div>
                <div className="le-toggle-desc">{s.desc}</div>
              </div>
              <label className="le-toggle"><input type="checkbox" checked={data[s.key]!==false} onChange={e => u(s.key,e.target.checked)} /><span className="le-toggle-slider"></span></label>
            </div>
          ))}
        </div>
      </>}

      {/* SAVE BAR */}
      <div className="le-save-bar">
        <div className="le-save-msg">
          {saveMsg === 'ok' ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span style={{color:'#10B981'}}>تم الحفظ وتطبيقه على الصفحة الرئيسية</span></> :
           saveMsg.startsWith('err:') ? <span style={{color:'#EF4444'}}>خطأ: {saveMsg.slice(4)}</span> :
           hasChanges ? 'التغييرات لم تُحفظ بعد' : 'لا توجد تغييرات'}
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="le-btn-outline" onClick={() => window.location.reload()}>إلغاء التغييرات</button>
          <button className="le-btn-gold" onClick={saveAll} disabled={saving}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {saving ? 'جاري الحفظ...' : 'حفظ وتطبيق'}
          </button>
        </div>
      </div>
    </div>
  );
}
