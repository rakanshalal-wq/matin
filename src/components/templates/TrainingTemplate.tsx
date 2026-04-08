'use client';
import React, { useState } from 'react';
import '../../styles/training-landing.css';

export default function TrainingTemplate() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
<nav className="nav">
  <div className="nav-inner">
    <div className="nav-logo">
      <div className="center-logo">🎯</div>
      <div><div className="center-name">مركز الإبداع للتدريب</div><div className="center-tag">تدريب · تأهيل · شهادات معتمدة</div></div>
    </div>
    <div className="nav-links">
      <div className="nav-link">البرامج</div>
      <div className="nav-link">المدربون</div>
      <div className="nav-link">الشهادات</div>
      <div className="nav-link">تواصل معنا</div>
    </div>
    <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
      <button className="nav-cta" onClick={() => {toast('📝 جارٍ التوجيه لصفحة التسجيل','var(--center-primary)')}}>سجّل الآن</button>
      <button className="nav-login" onClick={() => {toast('🔑 جارٍ فتح صفحة الدخول','var(--center-primary)')}}>دخول</button>
      <button className="hamburger" onClick={() => {document.querySelector('.nav-links').style.display=this.dataset.open?'none':'flex';this.dataset.open=this.dataset.open?'':'1';}}>☰</button>
    </div>
  </div>
</nav>

<div className="hero">
  <div className="hero-bg"></div>
  <div className="hero-grid"></div>
  <div className="hero-inner">
    <div>
      <div className="hero-badge"><span></span> التسجيل مفتوح — الدورات الصيفية 2026</div>
      <h1 className="hero-title">طوّر مهاراتك مع <em>أقوى البرامج التدريبية</em></h1>
      <p className="hero-sub">مركز تدريبي متكامل يقدم دورات احترافية معتمدة في التقنية والإدارة والمهارات الشخصية بإشراف نخبة من المدربين المعتمدين</p>
      <div className="hero-btns">
        <button className="btn-p" onClick={() => {toast('📝 يتم توجيهك لصفحة التسجيل','var(--center-primary)')}}>📋 تصفّح البرامج</button>
        <button className="btn-o">🎥 جولة افتراضية</button>
      </div>
      <div className="hero-stats">
        <div className="hstat"><div className="hstat-v">+2,800</div><div className="hstat-l">متدرب خريج</div></div>
        <div className="hstat"><div className="hstat-v">95%</div><div className="hstat-l">نسبة الرضا</div></div>
        <div className="hstat"><div className="hstat-v">+120</div><div className="hstat-l">دورة معتمدة</div></div>
        <div className="hstat"><div className="hstat-v">40+</div><div className="hstat-l">مدرب معتمد</div></div>
      </div>
    </div>
    <div className="hero-card">
      <div className="hc-hdr">
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div className="hc-ic">🎯</div>
          <div><div className="hc-title">البرامج المتاحة</div><div className="hc-sub">الفصل التدريبي الحالي</div></div>
        </div>
        <div className="live-badge"><div className="ldot"></div> مباشر</div>
      </div>
      <div className="prog-list">
        <div className="prog-row">
          <div className="prog-ic" style={{background:'rgba(96,165,250,.12)',border:'1px solid rgba(96,165,250,.25)'}}>💻</div>
          <div className="prog-name">تطوير تطبيقات الويب</div>
          <div className="prog-status" style={{background:'rgba(16,185,129,.12)',color:'var(--gr)'}}>متاح</div>
        </div>
        <div className="prog-row">
          <div className="prog-ic" style={{background:'rgba(167,139,250,.12)',border:'1px solid rgba(167,139,250,.25)'}}>📊</div>
          <div className="prog-name">إدارة المشاريع PMP</div>
          <div className="prog-status" style={{background:'rgba(251,146,60,.12)',color:'var(--or)'}}>آخر 3 مقاعد</div>
        </div>
        <div className="prog-row">
          <div className="prog-ic" style={{background:'rgba(34,211,238,.12)',border:'1px solid rgba(34,211,238,.25)'}}>🤖</div>
          <div className="prog-name">الذكاء الاصطناعي التطبيقي</div>
          <div className="prog-status" style={{background:'rgba(16,185,129,.12)',color:'var(--gr)'}}>متاح</div>
        </div>
        <div className="prog-row">
          <div className="prog-ic" style={{background:'rgba(239,68,68,.12)',border:'1px solid rgba(239,68,68,.25)'}}>🔒</div>
          <div className="prog-name">الأمن السيبراني</div>
          <div className="prog-status" style={{background:'rgba(239,68,68,.12)',color:'var(--rd)'}}>مكتمل</div>
        </div>
      </div>
      <div style={{background:'rgba(230,81,0,.08)',border:'1px solid rgba(230,81,0,.18)',borderRadius:'11px',padding:'12px 14px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
          <span style={{fontSize:'11px',color:'var(--td)'}}>نسبة الإشغال الكلية</span>
          <span style={{fontSize:'14px',fontWeight:800,color:'var(--center-accent)'}}>78%</span>
        </div>
        <div style={{height:'5px',background:'rgba(255,255,255,.06)',borderRadius:'3px',overflow:'hidden'}}>
          <div style={{height:'100%',width:'78%',background:'linear-gradient(90deg,var(--center-primary),var(--center-accent))',borderRadius:'3px'}}></div>
        </div>
      </div>
    </div>
  </div>
</div>

<section>
  <div className="sec-inner">
    <div className="stats-bar">
      <div className="stat-item"><div className="stat-n">120<em>+</em></div><div className="stat-l">دورة تدريبية</div></div>
      <div className="stat-item"><div className="stat-n">2,800<em>+</em></div><div className="stat-l">متدرب خريج</div></div>
      <div className="stat-item"><div className="stat-n">40<em>+</em></div><div className="stat-l">مدرب معتمد</div></div>
      <div className="stat-item"><div className="stat-n">15</div><div className="stat-l">قاعة تدريبية</div></div>
      <div className="stat-item"><div className="stat-n">95<em>%</em></div><div className="stat-l">رضا المتدربين</div></div>
    </div>

    <div className="sec-hdr center">
      <div className="sec-badge">📚 البرامج التدريبية</div>
      <h2 className="sec-title">برامج <span>احترافية</span> بشهادات معتمدة</h2>
      <p className="sec-sub">اختر من بين مجموعة متنوعة من البرامج التدريبية المصممة لتأهيلك لسوق العمل</p>
    </div>

    <div className="prog-grid">
      ${[
        ['💻','تطوير تطبيقات الويب','تعلم بناء تطبيقات ويب احترافية باستخدام أحدث التقنيات','120 ساعة','متقدم','2,500 ر.س','12 مقعد','rgba(96,165,250,','#60A5FA'],
        ['📊','إدارة المشاريع الاحترافية PMP','استعد لاجتياز اختبار PMP مع تدريب عملي مكثف','80 ساعة','متوسط','3,200 ر.س','3 مقاعد','rgba(167,139,250,','#A78BFA'],
        ['🤖','الذكاء الاصطناعي التطبيقي','من الأساسيات إلى بناء نماذج ML حقيقية','100 ساعة','متقدم','4,000 ر.س','8 مقاعد','rgba(34,211,238,','#22D3EE'],
        ['🔒','الأمن السيبراني','حماية الشبكات والأنظمة من الاختراقات','90 ساعة','متوسط','3,500 ر.س','مكتمل','rgba(239,68,68,','#EF4444'],
        ['📱','تطوير تطبيقات الجوال','Flutter & React Native للتطبيقات المتعددة المنصات','80 ساعة','متوسط','2,800 ر.س','15 مقعد','rgba(16,185,129,','#10B981'],
        ['🗣️','مهارات القيادة والتواصل','تطوير المهارات القيادية والتواصل الفعّال','40 ساعة','مبتدئ','1,200 ر.س','20 مقعد','rgba(251,146,60,','#FB923C'],
      ].map(([ic,name,desc,hours,level,price,seats,rgba,color]) => `
        <div className="prog-card">
          <div className="pc-tag-bar">
            <span className="pc-level" style={{background:'${rgba}0.12)',color:'${color}',border:'1px solid ${rgba}0.25)'}}>${level}</span>
            <span className="pc-hours">⏱ ${hours}</span>
          </div>
          <div className="pc-ic" style={{background:'${rgba}0.1)',border:'1px solid ${rgba}0.2)'}}>${ic}</div>
          <div className="pc-name">${name}</div>
          <div className="pc-desc">${desc}</div>
          <div className="pc-footer">
            <span className="pc-price" style={{color:'${color}'}}>${price}</span>
            <span className="pc-seats">${seats}</span>
          </div>
          <button className="pc-enroll" style={{marginTop:'12px',width:'100%'}} onClick={() => {toast('✅ تم إضافة البرنامج لقائمة التسجيل','${color}')}}>سجّل الآن</button>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<section style={{background:'var(--bg2)'}}>
  <div className="sec-inner">
    <div className="sec-hdr center">
      <div className="sec-badge">👨‍🏫 المدربون</div>
      <h2 className="sec-title">نخبة من <span>المدربين المعتمدين</span></h2>
      <p className="sec-sub">مدربون حاصلون على شهادات دولية وخبرات عملية واسعة</p>
    </div>
    <div className="trainers-grid">
      ${[
        ['👨‍💻','م. خالد الحربي','تطوير البرمجيات','rgba(96,165,250,','+800','متدرب','4.9','تقييم'],
        ['👨‍💼','د. عبدالرحمن السالم','إدارة المشاريع','rgba(167,139,250,','+500','متدرب','4.8','تقييم'],
        ['👩‍🔬','د. نورة الشمري','الذكاء الاصطناعي','rgba(34,211,238,','+350','متدرب','4.9','تقييم'],
        ['👨‍🔧','م. فيصل العتيبي','الأمن السيبراني','rgba(239,68,68,','+420','متدرب','4.7','تقييم'],
      ].map(([av,name,spec,rgba,v1,l1,v2,l2]) => `
        <div className="trainer-card">
          <div className="tr-av" style={{background:'${rgba}0.1)',border:'1px solid ${rgba}0.2)'}}>${av}</div>
          <div className="tr-name">${name}</div>
          <div className="tr-spec">${spec}</div>
          <div className="tr-stats">
            <div className="tr-st"><div className="tr-st-v">${v1}</div><div className="tr-st-l">${l1}</div></div>
            <div className="tr-st"><div className="tr-st-v">⭐ ${v2}</div><div className="tr-st-l">${l2}</div></div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<section>
  <div className="sec-inner">
    <div className="sec-hdr center">
      <div className="sec-badge">📜 الشهادات</div>
      <h2 className="sec-title">شهادات <span>معتمدة</span> محلياً ودولياً</h2>
    </div>
    <div className="cert-section">
      <div>
        <h3 style={{fontSize:'20px',fontWeight:800,marginBottom:'20px'}}>لماذا شهاداتنا مميزة؟</h3>
        <div className="cert-features">
          <div className="cert-feat">
            <div className="cert-feat-ic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>✅</div>
            <div><div className="cert-feat-t">معتمدة من المؤسسة العامة للتدريب</div><div className="cert-feat-s">اعتماد رسمي من TVTC</div></div>
          </div>
          <div className="cert-feat">
            <div className="cert-feat-ic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>🌍</div>
            <div><div className="cert-feat-t">شهادات دولية معترفة</div><div className="cert-feat-s">PMP, CompTIA, AWS, Google</div></div>
          </div>
          <div className="cert-feat">
            <div className="cert-feat-ic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>🔐</div>
            <div><div className="cert-feat-t">توثيق رقمي مشفّر</div><div className="cert-feat-s">تحقق إلكتروني بـ QR Code</div></div>
          </div>
          <div className="cert-feat">
            <div className="cert-feat-ic" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>📊</div>
            <div><div className="cert-feat-t">ملف إنجاز رقمي</div><div className="cert-feat-s">سجل كامل لدوراتك وإنجازاتك</div></div>
          </div>
        </div>
      </div>
      <div className="cert-preview">
        <div className="cert-mock">
          <div className="cert-mock-logo">🏅</div>
          <div className="cert-mock-t">شهادة إتمام برنامج تدريبي</div>
          <div className="cert-mock-s">مركز الإبداع للتدريب</div>
          <div style={{marginTop:'10px',fontSize:'11px',color:'var(--tm)'}}>معتمدة · موثقة رقمياً · قابلة للتحقق</div>
        </div>
      </div>
    </div>
  </div>
</section>

<div className="cta-section">
  <div className="cta-box">
    <h2 className="cta-title">ابدأ رحلتك التدريبية <span style={{color:'var(--center-accent)'}}>اليوم</span></h2>
    <p className="cta-sub">سجّل في أحد برامجنا التدريبية واحصل على خصم 15% للتسجيل المبكر</p>
    <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
      <button className="btn-p" onClick={() => {toast('📝 جارٍ التوجيه للتسجيل','var(--center-primary)')}}>📋 سجّل الآن</button>
      <button className="btn-o" onClick={() => {toast('📞 سيتم التواصل معك','var(--cy)')}}>📞 تواصل معنا</button>
    </div>
  </div>
</div>

<footer>
  <div className="footer-inner">
    <div className="footer-brand">
      <div className="center-logo" style={{width:'32px',height:'32px',fontSize:'16px',borderRadius:'8px'}}>🎯</div>
      <span className="footer-copy">© 2026 مركز الإبداع للتدريب — جميع الحقوق محفوظة</span>
    </div>
    <div className="footer-links"><a>الشروط</a><a>الخصوصية</a><a>الدعم</a></div>
  </div>
  <div className="footer-powered">⚡ مدعوم بمنصة <strong style={{color:'var(--gd)'}}>متين</strong> لإدارة التعليم</div>
</footer>

<div className="toast" id="toast-el"></div>
    </div>
  );
}