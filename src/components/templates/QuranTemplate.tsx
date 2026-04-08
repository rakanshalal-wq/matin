'use client';
import React, { useState } from 'react';
import '../../styles/quran-landing.css';

export default function QuranTemplate() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
<nav className="nav">
  <div className="nav-inner">
    <div className="nav-logo">
      <div className="qr-logo">📖</div>
      <div><div className="qr-name">مركز النور لتحفيظ القرآن</div><div className="qr-tag">تحفيظ · تجويد · إجازات قرآنية</div></div>
    </div>
    <div className="nav-links">
      <div className="nav-link">الحلقات</div>
      <div className="nav-link">المحفّظون</div>
      <div className="nav-link">البرامج</div>
      <div className="nav-link">تواصل معنا</div>
    </div>
    <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
      <button className="nav-cta" onClick={() => {toast('📝 جارٍ التوجيه للتسجيل','var(--qr-primary)')}}>سجّل ابنك الآن</button>
      <button className="nav-login" onClick={() => {toast('🔑 بوابة الدخول','var(--qr-primary)')}}>دخول</button>
      <button className="hamburger" onClick={() => {document.querySelector('.nav-links').style.display=this.dataset.open?'none':'flex';this.dataset.open=this.dataset.open?'':'1';}}>☰</button>
    </div>
  </div>
</nav>

<div className="hero">
  <div className="hero-bg"></div>
  <div className="hero-pattern"></div>
  <div className="hero-inner">
    <div>
      <div className="hero-badge"><span></span> باب التسجيل مفتوح — الفصل الصيفي</div>
      <h1 className="hero-title">اغرس في أبنائك <em>حبّ القرآن</em> وتلاوته <span className="gold">بإتقان</span></h1>
      <p className="hero-sub">مركز قرآني متكامل يقدم حلقات تحفيظ وتجويد بإشراف محفّظين مجازين بالسند المتصل، مع بيئة تعليمية محفّزة ومتابعة دورية لأولياء الأمور</p>
      <div className="hero-btns">
        <button className="btn-p" onClick={() => {toast('📝 يتم توجيهك لصفحة التسجيل','var(--qr-primary)')}}>📝 سجّل الآن</button>
        <button className="btn-o">🎧 استمع لطلابنا</button>
      </div>
      <div className="hero-stats">
        <div className="hstat"><div className="hstat-v">+1,200</div><div className="hstat-l">طالب وطالبة</div></div>
        <div className="hstat"><div className="hstat-v">85</div><div className="hstat-l">حافظ/ة تخرّج</div></div>
        <div className="hstat"><div className="hstat-v">35</div><div className="hstat-l">محفّظ مجاز</div></div>
        <div className="hstat"><div className="hstat-v">12</div><div className="hstat-l">إجازة صدرت</div></div>
      </div>
    </div>

    <div className="hero-card">
      <div className="hc-hdr">
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div className="hc-ic">🕌</div>
          <div><div className="hc-title">الحلقات القرآنية</div><div className="hc-sub">المركز الرئيسي</div></div>
        </div>
        <div className="live-badge"><div className="ldot"></div> مباشر</div>
      </div>
      <div className="halqa-item">
        <div className="halqa-ic" style={{background:'rgba(4,120,87,.12)',border:'1px solid rgba(4,120,87,.25)'}}>🟢</div>
        <div className="halqa-name">حلقة الإتقان — حفظ كامل</div>
        <div className="halqa-count">28 طالب</div>
        <div className="halqa-status" style={{background:'rgba(16,185,129,.12)',color:'var(--gr)'}}>منعقدة</div>
      </div>
      <div className="halqa-item">
        <div className="halqa-ic" style={{background:'rgba(212,168,67,.12)',border:'1px solid rgba(212,168,67,.25)'}}>🌟</div>
        <div className="halqa-name">حلقة التجويد — أحكام التلاوة</div>
        <div className="halqa-count">22 طالب</div>
        <div className="halqa-status" style={{background:'rgba(16,185,129,.12)',color:'var(--gr)'}}>منعقدة</div>
      </div>
      <div className="halqa-item">
        <div className="halqa-ic" style={{background:'rgba(96,165,250,.12)',border:'1px solid rgba(96,165,250,.25)'}}>📘</div>
        <div className="halqa-name">حلقة البراعم — جزء عمّ</div>
        <div className="halqa-count">35 طالب</div>
        <div className="halqa-status" style={{background:'rgba(96,165,250,.12)',color:'var(--bl)'}}>تسجيل</div>
      </div>
      <div className="halqa-item">
        <div className="halqa-ic" style={{background:'rgba(167,139,250,.12)',border:'1px solid rgba(167,139,250,.25)'}}>👩</div>
        <div className="halqa-name">حلقة النساء — حفظ ومراجعة</div>
        <div className="halqa-count">18 طالبة</div>
        <div className="halqa-status" style={{background:'rgba(16,185,129,.12)',color:'var(--gr)'}}>منعقدة</div>
      </div>
      <div style={{background:'rgba(4,120,87,.08)',border:'1px solid rgba(4,120,87,.18)',borderRadius:'11px',padding:'12px 14px',marginTop:'10px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
          <span style={{fontSize:'11px',color:'var(--td)'}}>نسبة الالتحاق</span>
          <span style={{fontSize:'14px',fontWeight:800,color:'var(--gr)'}}>86%</span>
        </div>
        <div style={{height:'5px',background:'rgba(255,255,255,.06)',borderRadius:'3px',overflow:'hidden'}}>
          <div style={{height:'100%',width:'86%',background:'linear-gradient(90deg,var(--qr-primary),var(--gr))',borderRadius:'3px'}}></div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Verse */}
<div className="verse-section">
  <div className="verse-box">
    <div className="verse-text">﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾</div>
    <div className="verse-ref">سورة القمر — الآية 17</div>
  </div>
</div>

<section>
  <div className="sec-inner">
    <div className="stats-bar">
      <div className="stat-item"><div className="stat-n">1,200<em>+</em></div><div className="stat-l">طالب وطالبة</div></div>
      <div className="stat-item"><div className="stat-n">35</div><div className="stat-l">محفّظ ومحفّظة</div></div>
      <div className="stat-item"><div className="stat-n">85</div><div className="stat-l">حافظ/ة متخرّج</div></div>
      <div className="stat-item"><div className="stat-n">12</div><div className="stat-l">إجازة بالسند</div></div>
      <div className="stat-item"><div className="stat-n">20</div><div className="stat-l">حلقة قرآنية</div></div>
    </div>

    <div className="sec-hdr center">
      <div className="sec-badge">📖 البرامج القرآنية</div>
      <h2 className="sec-title">برامج <span>قرآنية</span> لجميع <span className="gold">المستويات</span></h2>
      <p className="sec-sub">من البراعم إلى الإجازة بالسند المتصل — برامج متدرجة تناسب كل الأعمار والمستويات</p>
    </div>

    <div className="prog-grid">
      ${[
        ['🌱','برنامج البراعم','تحفيظ جزء عمّ وتبارك مع أحكام التجويد الأساسية للأطفال من 5-8 سنوات','4-8 سنوات','5 أيام/أسبوع','مبتدئ','rgba(16,185,129,','var(--gr)'],
        ['📗','برنامج الحفظ المتدرج','حفظ القرآن الكريم كاملاً على مدار 3-5 سنوات مع مراجعة مستمرة','9-15 سنة','6 أيام/أسبوع','متوسط','rgba(96,165,250,','var(--bl)'],
        ['📖','برنامج الإتقان','حفظ متقن مع ضبط المتشابهات والتفسير المبسّط','12+ سنة','6 أيام/أسبوع','متقدم','rgba(167,139,250,','var(--pu)'],
        ['🎙️','برنامج التجويد التطبيقي','إتقان أحكام التجويد نظرياً وتطبيقياً برواية حفص','جميع الأعمار','3 أيام/أسبوع','متوسط','rgba(212,168,67,','var(--qr-accent)'],
        ['📜','برنامج الإجازة بالسند','إجازة في القراءة بالسند المتصل إلى رسول الله ﷺ','حافظ كامل','يومياً','متقدم','rgba(4,120,87,','var(--qr-primary)'],
        ['👩','حلقات النساء','حلقات مخصصة للنساء حفظاً ومراجعة وتجويداً','نساء','4 أيام/أسبوع','جميع المستويات','rgba(251,146,60,','var(--or)'],
      ].map(([ic,name,desc,age,days,level,rgba,color]) => `
        <div className="prog-card">
          <div className="pc-ic" style={{background:'${rgba}0.1)',border:'1px solid ${rgba}0.2)'}}>${ic}</div>
          <div className="pc-name">${name}</div>
          <div className="pc-desc">${desc}</div>
          <div className="pc-meta">
            <div className="pc-meta-item">👤 ${age}</div>
            <div className="pc-meta-item">📅 ${days}</div>
          </div>
          <div className="pc-footer">
            <span className="pc-tag" style={{background:'${rgba}0.12)',color:'${color}',border:'1px solid ${rgba}0.25)'}}>${level}</span>
            <button className="pc-enroll" onClick={() => {toast('✅ تم إضافة البرنامج','${color}')}}>سجّل الآن</button>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<section style={{background:'var(--bg2)'}}>
  <div className="sec-inner">
    <div className="sec-hdr center">
      <div className="sec-badge">👨‍🏫 المحفّظون</div>
      <h2 className="sec-title">محفّظون <span>مجازون</span> بالسند <span className="gold">المتصل</span></h2>
      <p className="sec-sub">نخبة من المحفّظين الحاصلين على إجازات في القراءات وذوي خبرة في التعليم</p>
    </div>
    <div className="teachers-grid">
      ${[
        ['👳‍♂️','الشيخ عبدالرحمن السديري','حفص عن عاصم','مجاز بالسند المتصل','rgba(4,120,87,','+200','طالب','15','سنة خبرة'],
        ['👳‍♂️','الشيخ محمد الغامدي','القراءات السبع','مجاز بالقراءات','rgba(212,168,67,','+180','طالب','12','سنة خبرة'],
        ['👳‍♂️','الشيخ أحمد الدوسري','حفص عن عاصم','مجاز بالسند المتصل','rgba(96,165,250,','+150','طالب','10','سنة خبرة'],
        ['👩‍🏫','الأستاذة نورة المالكي','حفص عن عاصم','مجازة بالسند المتصل','rgba(167,139,250,','+120','طالبة','8','سنة خبرة'],
      ].map(([av,name,qiraa,ijaza,rgba,v1,l1,v2,l2]) => `
        <div className="teacher-card">
          <div className="tc-av" style={{background:'${rgba}0.1)',border:'1px solid ${rgba}0.2)'}}>${av}</div>
          <div className="tc-name">${name}</div>
          <div className="tc-spec">${qiraa}</div>
          <div className="tc-ijaza">✅ ${ijaza}</div>
          <div className="tc-stats">
            <div className="tc-st"><div className="tc-st-v">${v1}</div><div className="tc-st-l">${l1}</div></div>
            <div className="tc-st"><div className="tc-st-v">${v2}</div><div className="tc-st-l">${l2}</div></div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<section>
  <div className="sec-inner">
    <div className="sec-hdr center">
      <div className="sec-badge">✨ المميزات</div>
      <h2 className="sec-title">لماذا <span>مركز النور</span>؟</h2>
    </div>
    <div className="features-grid">
      ${[
        ['📖','متابعة إلكترونية','تقارير فورية لأولياء الأمور عن تقدم الحفظ والمراجعة','rgba(4,120,87,'],
        ['🏅','مسابقات قرآنية','مسابقات دورية داخلية وخارجية بجوائز قيّمة','rgba(212,168,67,'],
        ['🎓','إجازات بالسند','إمكانية الحصول على إجازة بالسند المتصل','rgba(167,139,250,'],
        ['📊','نظام نقاط تحفيزي','نقاط مكافآت على الحفظ والمراجعة والسلوك','rgba(96,165,250,'],
        ['👨‍👩‍👦','تواصل مع أولياء الأمور','بوابة خاصة لمتابعة الأبناء والتواصل مع المحفّظ','rgba(16,185,129,'],
        ['🕌','بيئة تربوية','بيئة إسلامية محفّزة بإشراف تربوي متكامل','rgba(251,146,60,'],
      ].map(([ic,name,desc,rgba]) => `
        <div className="feat-card">
          <div className="feat-ic" style={{background:'${rgba}0.1)',border:'1px solid ${rgba}0.2)'}}>${ic}</div>
          <div className="feat-name">${name}</div>
          <div className="feat-desc">${desc}</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<div className="cta-section">
  <div className="cta-box">
    <h2 className="cta-title">سجّل أبناءك في <span style={{color:'var(--gr)'}}>رحلة القرآن</span></h2>
    <p className="cta-sub">التسجيل مفتوح الآن — المقاعد محدودة في الحلقات الصباحية والمسائية</p>
    <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
      <button className="btn-p" onClick={() => {toast('📝 جارٍ التوجيه للتسجيل','var(--qr-primary)')}}>📝 سجّل الآن</button>
      <button className="btn-o" onClick={() => {toast('📞 سيتم التواصل معك','var(--cy)')}}>📞 تواصل معنا</button>
    </div>
  </div>
</div>

<footer>
  <div className="footer-inner">
    <div className="footer-brand">
      <div className="qr-logo" style={{width:'32px',height:'32px',fontSize:'16px',borderRadius:'8px'}}>📖</div>
      <span className="footer-copy">© 2026 مركز النور لتحفيظ القرآن الكريم — جميع الحقوق محفوظة</span>
    </div>
    <div className="footer-links"><a>الشروط</a><a>الخصوصية</a><a>الدعم</a></div>
  </div>
  <div className="footer-powered">⚡ مدعوم بمنصة <strong style={{color:'var(--qr-accent)'}}>متين</strong> لإدارة التعليم</div>
</footer>

<div className="toast" id="toast-el"></div>
    </div>
  );
}