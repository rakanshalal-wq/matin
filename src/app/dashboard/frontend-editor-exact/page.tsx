'use client';

import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// محرر الواجهة الأمامية - بالضبط كما في الملف الأصلي
// ═══════════════════════════════════════════════════════════════

export default function FrontendEditor() {
  const [activeTab, setActiveTab] = useState('hero');
  const [bgColor, setBgColor] = useState('#06060E');

  const styles = `
    :root {
      --gold:#D4A843; --gold2:#E8C060;
      --gold-dim:rgba(212,168,67,0.12); --gold-border:rgba(212,168,67,0.22);
      --bg:#06060E; --bg-card:rgba(255,255,255,0.025);
      --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.04);
      --text:#EEEEF5; --text-dim:rgba(238,238,245,0.55); --text-muted:rgba(238,238,245,0.28);
      --green:#10B981; --red:#EF4444; --blue:#60A5FA; --purple:#A78BFA; --orange:#FB923C;
      --font:'IBM Plex Sans Arabic',sans-serif;
    }
    *{margin:0;padding:0;box-sizing:border-box;}
    
    .page-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap;gap:12px;}
    .page-title{color:var(--gold);font-size:20px;font-weight:800;display:flex;align-items:center;gap:8px;}
    .page-sub{color:var(--text-muted);font-size:13px;margin-top:4px;}
    
    .tabs{display:flex;gap:6px;margin-bottom:24px;border-bottom:1px solid var(--border);padding-bottom:0;overflow-x:auto;}
    .tabs::-webkit-scrollbar{display:none;}
    .tab-btn{
      background:transparent;border:none;border-bottom:2px solid transparent;
      padding:10px 18px;color:var(--text-dim);font-size:13px;font-weight:500;
      cursor:pointer;font-family:var(--font);white-space:nowrap;
      transition:all 0.15s;margin-bottom:-1px;
    }
    .tab-btn:hover{color:var(--text);}
    .tab-btn.active{color:var(--gold);border-bottom-color:var(--gold);font-weight:700;}
    
    .panel{display:none;}
    .panel.active{display:block;}
    
    .card{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:16px;}
    .card-hdr{padding:14px 18px;border-bottom:1px solid var(--border2);display:flex;align-items:center;justify-content:space-between;gap:12px;}
    .card-title{font-size:14px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:8px;}
    .card-body{padding:18px;}
    
    .field{margin-bottom:16px;}
    .field:last-child{margin-bottom:0;}
    .label{color:var(--text-dim);font-size:12px;font-weight:600;display:block;margin-bottom:6px;}
    .input{
      width:100%;background:rgba(255,255,255,0.04);
      border:1px solid var(--border);border-radius:8px;
      padding:10px 14px;color:var(--text);font-size:13px;
      outline:none;font-family:var(--font);
      transition:border-color 0.15s;
    }
    .input:focus{border-color:rgba(212,168,67,0.4);}
    .input::placeholder{color:rgba(238,238,245,0.2);}
    textarea.input{resize:vertical;min-height:80px;line-height:1.6;}
    .input-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    
    .img-upload{
      border:2px dashed var(--border);border-radius:10px;
      padding:24px;text-align:center;cursor:pointer;
      transition:all 0.2s;background:rgba(255,255,255,0.02);
      position:relative;overflow:hidden;
    }
    .img-upload:hover{border-color:rgba(212,168,67,0.35);background:rgba(212,168,67,0.03);}
    
    .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border2);}
    .toggle-row:last-child{border-bottom:none;}
    .toggle-name{font-size:13px;font-weight:600;color:var(--text);}
    .toggle-desc{font-size:11px;color:var(--text-muted);margin-top:2px;}
    .toggle{position:relative;width:42px;height:24px;flex-shrink:0;}
    .toggle input{opacity:0;width:0;height:0;}
    .toggle-slider{
      position:absolute;inset:0;background:rgba(255,255,255,0.1);
      border-radius:24px;cursor:pointer;transition:0.2s;
    }
    .toggle-slider::before{
      content:'';position:absolute;width:18px;height:18px;
      background:#fff;border-radius:50%;bottom:3px;right:3px;
      transition:0.2s;
    }
    .toggle input:checked + .toggle-slider{background:var(--gold);}
    .toggle input:checked + .toggle-slider::before{transform:translateX(-18px);}
    
    .btn-gold{
      background:linear-gradient(135deg,var(--gold),var(--gold2));
      border:none;border-radius:9px;padding:10px 20px;
      color:#06060E;font-weight:700;font-size:13px;
      cursor:pointer;font-family:var(--font);
      display:inline-flex;align-items:center;gap:7px;
      box-shadow:0 4px 14px rgba(212,168,67,0.25);
      transition:all 0.2s;white-space:nowrap;
    }
    .btn-gold:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(212,168,67,0.4);}
    .btn-outline{
      background:transparent;border:1px solid var(--border);
      border-radius:9px;padding:9px 18px;color:var(--text-dim);
      font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font);
      display:inline-flex;align-items:center;gap:7px;transition:all 0.2s;
    }
    .btn-outline:hover{border-color:rgba(255,255,255,0.15);color:var(--text);}
    
    .color-swatch{width:36px;height:36px;border-radius:8px;cursor:pointer;border:1px solid rgba(255,255,255,0.1);}
    .color-swatch.active{border:2px solid var(--gold);}
    
    .preview-badge{
      display:inline-flex;align-items:center;gap:6px;
      background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2);
      border-radius:8px;padding:6px 12px;font-size:12px;color:var(--blue);font-weight:600;
    }
    
    @media(max-width:768px){
      .input-row{grid-template-columns:1fr;}
    }
  `;

  const tabs = [
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

  const colors = ['#06060E', '#0A0A1A', '#0D0D0D', '#0A1628', '#0D1117', '#1A0A00', '#0A1A0A'];

  return (
    <>
      <style>{styles}</style>
      <div dir="rtl" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#06060E', color: '#EEEEF5', minHeight: '100vh', padding: 24 }}>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* PAGE HEADER */}
        <div className="page-hdr">
          <div>
            <div className="page-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              محرر الواجهة الأمامية
            </div>
            <div className="page-sub">تحكم كامل في محتوى وتصميم صفحة matin.ink</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="preview-badge"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z M8 21h8 M12 17v4"/></svg> معاينة الموقع</span>
            <button className="btn-gold"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg> حفظ التغييرات</button>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* HERO PANEL */}
        <div className={`panel ${activeTab === 'hero' ? 'active' : ''}`}>
          <div className="card">
            <div className="card-hdr">
              <div className="card-title"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> خلفية الصفحة الرئيسية</div>
            </div>
            <div className="card-body">
              <div className="field">
                <label className="label">نوع الخلفية</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn-gold">لون ثابت</button>
                  <button className="btn-outline">تدرج لوني</button>
                  <button className="btn-outline">صورة</button>
                </div>
              </div>

              <div className="field">
                <label className="label">لون الخلفية</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {colors.map((color) => (
                    <div
                      key={color}
                      className={`color-swatch ${bgColor === color ? 'active' : ''}`}
                      style={{ background: color }}
                      onClick={() => setBgColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="label">صورة الخلفية</label>
                <div className="img-upload">
                  <div style={{ fontSize: 32, marginBottom: 8 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12"/></svg></div>
                  <div style={{ fontSize: 12.5, color: 'rgba(238,238,245,0.5)' }}>اسحب الصورة هنا</div>
                  <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.3)', marginTop: 4 }}>أو انقر للاختيار</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Content Card */}
          <div className="card">
            <div className="card-hdr">
              <div className="card-title"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg> محتوى الهيرو</div>
            </div>
            <div className="card-body">
              <div className="field">
                <label className="label">العنوان الرئيسي</label>
                <input className="input" type="text" defaultValue="نظام إدارة التعليم الأكثر تكاملاً" />
              </div>
              
              <div className="field">
                <label className="label">الوصف الفرعي</label>
                <textarea className="input" defaultValue="حل شامل وذكي لإدارة المؤسسات التعليمية بالذكاء الاصطناعي" />
              </div>

              <div className="input-row">
                <div className="field">
                  <label className="label">نص الزر الرئيسي</label>
                  <input className="input" type="text" defaultValue="ابدأ مجاناً" />
                </div>
                <div className="field">
                  <label className="label">نص الزر الثانوي</label>
                  <input className="input" type="text" defaultValue="شاهد العرض" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Panels */}
        {tabs.filter(t => t.id !== 'hero').map((tab) => (
          <div key={tab.id} className={`panel ${activeTab === tab.id ? 'active' : ''}`}>
            <div className="card">
              <div className="card-hdr">
                <div className="card-title">{tab.label}</div>
              </div>
              <div className="card-body">
                <p style={{ color: 'rgba(238,238,245,0.5)', textAlign: 'center', padding: '40px 0' }}>
                  محتوى قسم {tab.label} قيد التطوير...
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

