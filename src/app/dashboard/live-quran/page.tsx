'use client';
import React, { useState } from 'react';
import '../../../styles/quran-live.css';

export default function LiveQuranPage() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
{/* TOP BAR */}
<div className="topbar">
  <div className="tb-right">
    <div className="tb-logo">
      <div className="tb-logo-ic"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
      <div><div className="tb-title">الحلقة المباشرة</div><div className="tb-sub">مركز النور لتحفيظ القرآن</div></div>
    </div>
  </div>
  <div className="tb-center">
    <div className="live-dot"></div>
    <span className="live-text">مباشر</span>
    <span style={{fontSize:'11px',color:'var(--text-muted)',marginRight:'8px'}} id="timer">00:00:00</span>
  </div>
  <div className="tb-left">
    <button className="tb-btn" onClick={() => {togglePanel()}}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      الطلاب
    </button>
    <button className="tb-btn tb-btn-danger" onClick={() => {toast('تم إنهاء الحلقة','var(--red)')}}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      إنهاء
    </button>
  </div>
</div>

{/* MAIN */}
<div className="main-grid">
  {/* VIDEO */}
  <div className="video-section">
    <div className="video-container" id="videoContainer">
      <div className="video-placeholder" id="videoPlaceholder">
        <div className="ic-xl" style={{width:'64px',height:'64px',margin:'0 auto 16px'}}>
          <svg viewBox="0 0 24 24" style={{width:'64px',height:'64px'}}><polygon points="23 7 16 12 23 17 23 7" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
        </div>
        <p>اضغط على زر الكاميرا لبدء الحلقة المباشرة</p>
        <button onClick={() => {startCamera()}} style={{background:'linear-gradient(135deg,var(--accent),var(--accent2))',border:'none',borderRadius:'12px',padding:'12px 28px',color:'#fff',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)',display:'inline-flex',alignItems:'center',gap:'8px'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          بدء الحلقة
        </button>
      </div>
      <video id="localVideo" autoplay muted playsinline></video>
      <div className="pip-self" id="pipSelf" style={{display:'none'}}>
        <video id="selfVideo" autoplay muted playsinline></video>
      </div>
    </div>
    <div className="video-controls">
      <div style={{textAlign:'center'}}>
        <button className="vc-btn vc-on" id="micBtn" onClick={() => {toggleMic()}}>
          <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </button>
        <div className="vc-label">الصوت</div>
      </div>
      <div style={{textAlign:'center'}}>
        <button className="vc-btn vc-on" id="camBtn" onClick={() => {toggleCam()}}>
          <svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        </button>
        <div className="vc-label">الكاميرا</div>
      </div>
      <div style={{textAlign:'center'}}>
        <button className="vc-btn vc-on" onClick={() => {toggleScreen()}}>
          <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </button>
        <div className="vc-label">الشاشة</div>
      </div>
      <div style={{textAlign:'center'}}>
        <button className="vc-btn vc-end" onClick={() => {endCall()}}>
          <svg viewBox="0 0 24 24"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" transform="rotate(135 12 12)"/></svg>
        </button>
        <div className="vc-label">إنهاء</div>
      </div>
      <div style={{textAlign:'center'}}>
        <button className="vc-btn vc-on" onClick={() => {toast('تسجيل الحلقة...','var(--red)')}}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="var(--red)" stroke="var(--red)"/></svg>
        </button>
        <div className="vc-label">تسجيل</div>
      </div>
    </div>
  </div>

  {/* QURAN DISPLAY */}
  <div className="quran-section">
    <div className="quran-header">
      <div className="qh-top">
        <div>
          <div className="qh-surah" id="surahName">سورة البقرة</div>
          <div className="qh-info" id="surahInfo">مدنية · 286 آية · الجزء الأول</div>
        </div>
        <div className="qh-nav">
          <button className="qh-nav-btn" onClick={() => {prevPage()}}><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
          <span className="qh-page" id="pageNum">صفحة 2</span>
          <button className="qh-nav-btn" onClick={() => {nextPage()}}><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>
      <div style={{display:'flex',gap:'6px'}}>
        <button className="tb-btn" style={{fontSize:'10px',padding:'4px 10px'}} onClick={() => {highlightMode=!highlightMode;toast(highlightMode?'وضع التتبع مفعّل':'وضع التتبع متوقف','var(--accent)')}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          تتبع القراءة
        </button>
        <button className="tb-btn" style={{fontSize:'10px',padding:'4px 10px'}} onClick={() => {increaseFontSize()}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          تكبير
        </button>
        <button className="tb-btn" style={{fontSize:'10px',padding:'4px 10px'}} onClick={() => {decreaseFontSize()}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          تصغير
        </button>
      </div>
    </div>

    <div className="quran-display">
      <div className="quran-frame">
        <div className="quran-bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
        <div className="quran-text" id="quranText">
          <span className="ayah completed" data-ayah="1" onClick={() => {selectAyah(this)}}>الٓمٓ</span><span className="ayah-num">١</span>
          <span className="ayah completed" data-ayah="2" onClick={() => {selectAyah(this)}}>ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ</span><span className="ayah-num">٢</span>
          <span className="ayah completed" data-ayah="3" onClick={() => {selectAyah(this)}}>الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ</span><span className="ayah-num">٣</span>
          <span className="ayah completed" data-ayah="4" onClick={() => {selectAyah(this)}}>وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ</span><span className="ayah-num">٤</span>
          <span className="ayah active" data-ayah="5" onClick={() => {selectAyah(this)}}>أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ</span><span className="ayah-num">٥</span>
          <span className="ayah" data-ayah="6" onClick={() => {selectAyah(this)}}>إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ</span><span className="ayah-num">٦</span>
          <span className="ayah" data-ayah="7" onClick={() => {selectAyah(this)}}>خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ</span><span className="ayah-num">٧</span>
        </div>
      </div>

      {/* Current Ayah Highlight */}
      <div style={{marginTop:'16px',padding:'14px',background:'rgba(4,120,87,.06)',border:'1px solid rgba(4,120,87,.18)',borderRadius:'12px'}} id="currentAyahBox">
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span style={{fontSize:'11px',fontWeight:700,color:'var(--green)'}}>الآية الحالية — آية 5</span>
        </div>
        <div style={{fontFamily:'var(--quran-font)',fontSize:'20px',color:'var(--text)',lineHeight:'1.8'}} id="currentAyahText">أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ</div>
      </div>
    </div>

    {/* EVALUATION */}
    <div className="eval-bar">
      <div className="eval-title">تقييم القراءة (للمحفّظ):</div>
      <div className="eval-btns">
        <button className="eval-btn eval-excellent" onClick={() => {evaluate(this,'ممتاز')}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{verticalAlign:'middle',marginLeft:'4px'}}><polyline points="20 6 9 17 4 12"/></svg>
          ممتاز
        </button>
        <button className="eval-btn eval-good" onClick={() => {evaluate(this,'جيد جداً')}}>جيد جداً</button>
        <button className="eval-btn eval-ok" onClick={() => {evaluate(this,'جيد')}}>جيد</button>
        <button className="eval-btn eval-weak" onClick={() => {evaluate(this,'يحتاج مراجعة')}}>يحتاج مراجعة</button>
        <button className="eval-btn" style={{background:'rgba(167,139,250,.1)',borderColor:'rgba(167,139,250,.25)',color:'var(--purple)'}} onClick={() => {evaluate(this,'خطأ تجويد')}}>خطأ تجويد</button>
      </div>
    </div>
  </div>
</div>

{/* STUDENTS PANEL */}
<div className="side-panel" id="studentsPanel">
  <div className="sp-hdr">
    <span className="sp-title">طلاب الحلقة (6)</span>
    <button className="sp-close" onClick={() => {togglePanel()}}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  </div>
  <div className="sp-body">
    <div className="student-item active-student">
      <div className="st-av" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.22)',color:'var(--green)'}}><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div><div className="st-name">يوسف السبيعي</div><div className="st-info">يقرأ الآن — آية 5</div></div>
      <span className="st-status" style={{background:'rgba(16,185,129,.12)',color:'var(--green)',border:'1px solid rgba(16,185,129,.25)'}}>يقرأ</span>
    </div>
    <div className="student-item">
      <div className="st-av" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.22)',color:'var(--blue)'}}><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div><div className="st-name">عبدالملك الحربي</div><div className="st-info">ينتظر دوره</div></div>
      <span className="st-status" style={{background:'rgba(96,165,250,.12)',color:'var(--blue)',border:'1px solid rgba(96,165,250,.25)'}}>ينتظر</span>
    </div>
    <div className="student-item">
      <div className="st-av" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.22)',color:'var(--green)'}}><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div><div className="st-name">سعود المطيري</div><div className="st-info">متصل</div></div>
      <span className="st-status" style={{background:'rgba(16,185,129,.12)',color:'var(--green)',border:'1px solid rgba(16,185,129,.25)'}}>متصل</span>
    </div>
    <div className="student-item">
      <div className="st-av" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.22)',color:'var(--orange)'}}><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div><div className="st-name">فارس العتيبي</div><div className="st-info">متأخر</div></div>
      <span className="st-status" style={{background:'rgba(251,146,60,.12)',color:'var(--orange)',border:'1px solid rgba(251,146,60,.25)'}}>متأخر</span>
    </div>
    <div className="student-item">
      <div className="st-av" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.22)',color:'var(--red)'}}><svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div><div className="st-name">خالد الشمري</div><div className="st-info">غير متصل</div></div>
      <span className="st-status" style={{background:'rgba(239,68,68,.12)',color:'var(--red)',border:'1px solid rgba(239,68,68,.25)'}}>غائب</span>
    </div>
  </div>
</div>

<div className="toast" id="toast-el"></div>
    </div>
  );
}