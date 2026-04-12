'use client';
import { useState, useEffect } from 'react';

const ACCENT = '#047857';
const GOLD = '#D4A843';
const BG = '#06060E';
const BG2 = '#09111A';
const RED = '#EF4444';
const DIM = 'rgba(238,238,245,0.72)';
const MUT = 'rgba(238,238,245,0.36)';
const BD = 'rgba(255,255,255,0.08)';

const VERSES = [
  { n: 1, text: 'الم', state: 'completed' },
  { n: 2, text: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ', state: 'completed' },
  { n: 3, text: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ', state: 'completed' },
  { n: 4, text: 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ', state: 'active' },
  { n: 5, text: 'أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ', state: 'normal' },
  { n: 6, text: 'إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ', state: 'normal' },
  { n: 7, text: 'خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ', state: 'normal' },
];

const STUDENTS_DATA = [
  { id: 1, name: 'يوسف العمري', status: 'يقرأ', statusColor: '#10B981' },
  { id: 2, name: 'عبدالله الشمري', status: 'ينتظر', statusColor: '#3B82F6' },
  { id: 3, name: 'أحمد الغامدي', status: 'متصل', statusColor: '#10B981' },
  { id: 4, name: 'محمد السبيعي', status: 'متأخر', statusColor: '#F59E0B' },
  { id: 5, name: 'إبراهيم القحطاني', status: 'غائب', statusColor: '#EF4444' },
];

const EVAL_BUTTONS = [
  { label: 'ممتاز', color: '#10B981' },
  { label: 'جيد جداً', color: '#3B82F6' },
  { label: 'جيد', color: '#F59E0B' },
  { label: 'مراجعة', color: RED },
  { label: 'خطأ تجويد', color: '#A855F7' },
];

function IconMic({ off }: { off?: boolean }) {
  return off ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
    </svg>
  );
}

function IconCam({ off }: { off?: boolean }) {
  return off ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"/>
      <path d="M23 7l-7 5 7 5V7z"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M23 7l-7 5 7 5V7z"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  );
}

function IconScreen() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}

function IconStop() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
    </svg>
  );
}

function IconRecord() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8"/>
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="32" height="32" fill={ACCENT} viewBox="0 0 24 24">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export default function LiveQuranPage() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [tracking, setTracking] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const [activeVerse, setActiveVerse] = useState(4);
  const [selectedEval, setSelectedEval] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(5025);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtTime = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const verseTextColor = (state: string) => {
    if (state === 'completed') return GOLD + 'aa';
    if (state === 'active') return '#ffffff';
    return DIM;
  };

  const verseBg = (state: string) => {
    if (state === 'active') return ACCENT + '1a';
    return 'transparent';
  };

  const verseBorder = (state: string) =>
    state === 'active' ? '1px solid ' + ACCENT + '55' : '1px solid transparent';

  const ctrlBtn = (active: boolean, activeColor: string) => ({
    width: 48,
    height: 48,
    borderRadius: 12,
    border: '1px solid ' + (active ? activeColor + '55' : BD),
    background: active ? activeColor + '1a' : 'rgba(255,255,255,0.04)',
    color: active ? activeColor : MUT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  } as React.CSSProperties);

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Sans Arabic','Noto Naskh Arabic',sans-serif",
        direction: 'rtl',
        background: BG,
        color: '#EEEEF5',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ───── TOP BAR ───── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 56,
          background: BG2,
          borderBottom: '1px solid ' + BD,
          flexShrink: 0,
          gap: 16,
        }}
      >
        {/* Left cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 17, fontWeight: 800, whiteSpace: 'nowrap' }}>
            الحلقة المباشرة
          </span>

          {/* LIVE badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: RED + '20',
              border: '1px solid ' + RED + '50',
              borderRadius: 20,
              padding: '3px 11px',
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: RED,
                boxShadow: '0 0 5px ' + RED,
                animation: 'livePulse 1.2s ease-in-out infinite',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: RED, letterSpacing: 0.5 }}>
              LIVE
            </span>
          </div>

          {/* Timer */}
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 15,
              fontWeight: 700,
              color: DIM,
              letterSpacing: 1.5,
            }}
          >
            {fmtTime(seconds)}
          </span>
        </div>

        {/* Right cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setShowStudents((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              background: showStudents ? ACCENT + '20' : 'rgba(255,255,255,0.06)',
              border: '1px solid ' + (showStudents ? ACCENT + '66' : BD),
              borderRadius: 10,
              padding: '7px 15px',
              color: showStudents ? '#fff' : DIM,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <IconUsers />
            الطلاب ({STUDENTS_DATA.length})
          </button>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              background: RED,
              border: 'none',
              borderRadius: 10,
              padding: '7px 18px',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <IconStop />
            إنهاء
          </button>
        </div>
      </div>

      {/* ───── MAIN GRID ───── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* ── LEFT: VIDEO SECTION ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 16px 16px 20px',
            gap: 14,
            overflow: 'hidden',
          }}
        >
          {/* Video placeholder */}
          <div
            style={{
              flex: 1,
              background: 'linear-gradient(145deg,#0a0a16 0%,#020208 100%)',
              borderRadius: 14,
              border: '1px solid ' + BD,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            {/* Ambient glow */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(4,120,87,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Start button */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                zIndex: 1,
              }}
            >
              <button
                onClick={() => setCamOn((v) => !v)}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background: ACCENT + '20',
                  border: '2px solid ' + ACCENT + '55',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <IconPlay />
              </button>
              <span style={{ color: MUT, fontSize: 14, fontWeight: 600 }}>بدء الحلقة</span>
            </div>

            {/* PIP self-view */}
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                left: 14,
                width: 160,
                height: 120,
                borderRadius: 10,
                background: '#08100a',
                border: '2px solid ' + ACCENT,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="28"
                height="28"
                fill="none"
                stroke={MUT}
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M23 7l-7 5 7 5V7z"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
          </div>

          {/* VIDEO CONTROLS BAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              flexShrink: 0,
              padding: '12px 20px',
              background: BG2,
              borderRadius: 13,
              border: '1px solid ' + BD,
            }}
          >
            {/* Mic */}
            <button
              onClick={() => setMicOn((v) => !v)}
              style={ctrlBtn(micOn, ACCENT)}
              title="الميكروفون"
            >
              <IconMic off={!micOn} />
            </button>

            {/* Camera */}
            <button
              onClick={() => setCamOn((v) => !v)}
              style={ctrlBtn(camOn, ACCENT)}
              title="الكاميرا"
            >
              <IconCam off={!camOn} />
            </button>

            {/* Screen share */}
            <button
              onClick={() => setScreenOn((v) => !v)}
              style={ctrlBtn(screenOn, '#3B82F6')}
              title="مشاركة الشاشة"
            >
              <IconScreen />
            </button>

            {/* End call */}
            <button
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                border: 'none',
                background: RED,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="إنهاء"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.91 15.91 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z"/>
              </svg>
            </button>

            {/* Record */}
            <button
              onClick={() => setRecording((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                height: 48,
                padding: '0 16px',
                borderRadius: 12,
                border: '1px solid ' + (recording ? RED + '55' : BD),
                background: recording ? RED + '18' : 'rgba(255,255,255,0.04)',
                color: recording ? RED : MUT,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              <IconRecord />
              {recording ? 'إيقاف التسجيل' : 'تسجيل'}
            </button>
          </div>
        </div>

        {/* ── RIGHT: QURAN PANEL ── */}
        <div
          style={{
            background: BG2,
            borderRight: '1px solid ' + BD,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Panel header */}
          <div
            style={{
              padding: '12px 16px 10px',
              borderBottom: '1px solid ' + BD,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>سورة البقرة</div>
                <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>
                  مدنية &nbsp;·&nbsp; 286 آية &nbsp;·&nbsp; الجزء الأول
                </div>
              </div>

              {/* Page nav */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    border: '1px solid ' + BD,
                    background: 'rgba(255,255,255,0.04)',
                    color: DIM,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconChevronRight />
                </button>
                <span style={{ fontSize: 12, color: MUT, minWidth: 18, textAlign: 'center' }}>
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    border: '1px solid ' + BD,
                    background: 'rgba(255,255,255,0.04)',
                    color: DIM,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconChevronLeft />
                </button>
              </div>
            </div>

            {/* Sub-toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setTracking((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 10px',
                  borderRadius: 7,
                  border: '1px solid ' + (tracking ? ACCENT + '55' : BD),
                  background: tracking ? ACCENT + '18' : 'rgba(255,255,255,0.03)',
                  color: tracking ? ACCENT : MUT,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <IconTarget />
                تتبع القراءة
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  border: '1px solid ' + BD,
                  background: 'rgba(255,255,255,0.04)',
                  color: DIM,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(70, z - 10))}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  border: '1px solid ' + BD,
                  background: 'rgba(255,255,255,0.04)',
                  color: DIM,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                −
              </button>
              <span style={{ fontSize: 10, color: MUT, marginRight: 'auto' }}>{zoom}%</span>
            </div>
          </div>

          {/* Scrollable quran content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
            {/* Quran frame */}
            <div
              style={{
                border: '1px solid ' + GOLD + '44',
                borderRadius: 12,
                background: 'rgba(212,168,67,0.025)',
                padding: '14px 12px',
                marginBottom: 12,
              }}
            >
              {/* Bismillah */}
              <div
                style={{
                  textAlign: 'center',
                  fontFamily: "'Amiri Quran','Noto Naskh Arabic',serif",
                  fontSize: Math.round(zoom * 0.17) + 'px',
                  color: GOLD,
                  marginBottom: 14,
                  lineHeight: 2.6,
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              {/* Verses */}
              {VERSES.map((v) => (
                <div
                  key={v.n}
                  onClick={() => setActiveVerse(v.n)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    padding: '9px 10px',
                    borderRadius: 9,
                    marginBottom: 6,
                    background: verseBg(v.state),
                    border: verseBorder(v.state),
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {/* Verse number bubble */}
                  <div
                    style={{
                      minWidth: 22,
                      height: 22,
                      borderRadius: '50%',
                      background:
                        v.state === 'active'
                          ? ACCENT
                          : v.state === 'completed'
                          ? GOLD + '40'
                          : BD,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 700,
                      color: v.state === 'active' ? '#fff' : MUT,
                      flexShrink: 0,
                      marginTop: 6,
                    }}
                  >
                    {v.n}
                  </div>

                  {/* Verse text */}
                  <div
                    style={{
                      fontFamily: "'Amiri Quran','Noto Naskh Arabic',serif",
                      fontSize: Math.round(zoom * 0.155) + 'px',
                      lineHeight: 2.5,
                      color: verseTextColor(v.state),
                      flex: 1,
                      direction: 'rtl',
                    }}
                  >
                    {v.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Current ayah display box */}
            <div
              style={{
                background: ACCENT + '12',
                border: '1px solid ' + ACCENT + '44',
                borderRadius: 10,
                padding: '11px 13px',
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 10, color: ACCENT, fontWeight: 700, marginBottom: 6 }}>
                الآية الحالية
              </div>
              <div
                style={{
                  fontFamily: "'Amiri Quran','Noto Naskh Arabic',serif",
                  fontSize: 16,
                  lineHeight: 2.4,
                  color: '#fff',
                  direction: 'rtl',
                }}
              >
                {VERSES.find((v) => v.n === activeVerse)?.text ?? VERSES[3].text}
              </div>
            </div>

            {/* Evaluation bar */}
            <div>
              <div style={{ fontSize: 11, color: MUT, marginBottom: 8, fontWeight: 600 }}>
                تقييم الطالب
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {EVAL_BUTTONS.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => setSelectedEval(btn.label)}
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      borderRadius: 8,
                      border:
                        '1px solid ' +
                        btn.color +
                        (selectedEval === btn.label ? 'cc' : '44'),
                      background:
                        selectedEval === btn.label
                          ? btn.color + '28'
                          : btn.color + '0e',
                      color: btn.color,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'right',
                      transition: 'all 0.15s',
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── STUDENTS OVERLAY PANEL ── */}
        {showStudents && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 360,
              width: 320,
              height: '100%',
              background: BG2,
              borderRight: '1px solid ' + BD,
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.55)',
            }}
          >
            {/* Panel header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid ' + BD,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                الطلاب ({STUDENTS_DATA.length})
              </span>
              <button
                onClick={() => setShowStudents(false)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  border: '1px solid ' + BD,
                  background: 'rgba(255,255,255,0.04)',
                  color: MUT,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconClose />
              </button>
            </div>

            {/* Student list */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {STUDENTS_DATA.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid ' + BD,
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: ACCENT + '22',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 700,
                        color: ACCENT,
                        flexShrink: 0,
                      }}
                    >
                      {s.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: s.statusColor,
                          fontWeight: 600,
                          marginTop: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: s.statusColor,
                            display: 'inline-block',
                          }}
                        />
                        {s.status}
                      </div>
                    </div>
                  </div>

                  <button
                    style={{
                      padding: '4px 11px',
                      borderRadius: 7,
                      border: '1px solid ' + ACCENT + '44',
                      background: ACCENT + '12',
                      color: ACCENT,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    استدعاء
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes livePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.35; transform:scale(0.85); }
        }
      `}</style>
    </div>
  );
}
