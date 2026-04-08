'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, Video, VideoOff, Mic, MicOff, Users, Star, ChevronLeft, ChevronRight, Play, Square, CheckCircle, XCircle, AlertTriangle, Award } from 'lucide-react';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C', DARK = '#06060E', CARD = 'rgba(255,255,255,0.03)', BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)', MUT = 'rgba(238,238,245,0.3)';
const QC = '#059669';

const SURAHS = [
  {n:1,name:'الفاتحة',ayahs:7},{n:2,name:'البقرة',ayahs:286},{n:3,name:'آل عمران',ayahs:200},
  {n:4,name:'النساء',ayahs:176},{n:5,name:'المائدة',ayahs:120},{n:6,name:'الأنعام',ayahs:165},
  {n:7,name:'الأعراف',ayahs:206},{n:8,name:'الأنفال',ayahs:75},{n:9,name:'التوبة',ayahs:129},
  {n:10,name:'يونس',ayahs:109},{n:11,name:'هود',ayahs:123},{n:12,name:'يوسف',ayahs:111},
  {n:13,name:'الرعد',ayahs:43},{n:14,name:'إبراهيم',ayahs:52},{n:15,name:'الحجر',ayahs:99},
  {n:16,name:'النحل',ayahs:128},{n:17,name:'الإسراء',ayahs:111},{n:18,name:'الكهف',ayahs:110},
  {n:19,name:'مريم',ayahs:98},{n:20,name:'طه',ayahs:135},{n:21,name:'الأنبياء',ayahs:112},
  {n:22,name:'الحج',ayahs:78},{n:23,name:'المؤمنون',ayahs:118},{n:24,name:'النور',ayahs:64},
  {n:25,name:'الفرقان',ayahs:77},{n:26,name:'الشعراء',ayahs:227},{n:27,name:'النمل',ayahs:93},
  {n:28,name:'القصص',ayahs:88},{n:29,name:'العنكبوت',ayahs:69},{n:30,name:'الروم',ayahs:60},
  {n:36,name:'يس',ayahs:83},{n:37,name:'الصافات',ayahs:182},
  {n:55,name:'الرحمن',ayahs:78},{n:56,name:'الواقعة',ayahs:96},{n:67,name:'الملك',ayahs:30},
  {n:78,name:'النبأ',ayahs:40},{n:87,name:'الأعلى',ayahs:19},{n:93,name:'الضحى',ayahs:11},
  {n:94,name:'الشرح',ayahs:8},{n:95,name:'التين',ayahs:8},{n:96,name:'العلق',ayahs:19},
  {n:97,name:'القدر',ayahs:5},{n:98,name:'البينة',ayahs:8},{n:99,name:'الزلزلة',ayahs:8},
  {n:100,name:'العاديات',ayahs:11},{n:101,name:'القارعة',ayahs:11},{n:102,name:'التكاثر',ayahs:8},
  {n:103,name:'العصر',ayahs:3},{n:104,name:'الهمزة',ayahs:9},{n:105,name:'الفيل',ayahs:5},
  {n:106,name:'قريش',ayahs:4},{n:107,name:'الماعون',ayahs:7},{n:108,name:'الكوثر',ayahs:3},
  {n:109,name:'الكافرون',ayahs:6},{n:110,name:'النصر',ayahs:3},{n:111,name:'المسد',ayahs:5},
  {n:112,name:'الإخلاص',ayahs:4},{n:113,name:'الفلق',ayahs:5},{n:114,name:'الناس',ayahs:6},
];

const GRADES = [
  { id: 'excellent', label: 'ممتاز', color: '#10B981', Ic: CheckCircle, points: 10 },
  { id: 'good', label: 'جيد', color: '#3B82F6', Ic: Star, points: 7 },
  { id: 'fair', label: 'مقبول', color: '#F59E0B', Ic: AlertTriangle, points: 4 },
  { id: 'weak', label: 'ضعيف', color: '#EF4444', Ic: XCircle, points: 1 },
];

export default function LiveQuranPage() {
  const [user, setUser] = useState<any>(null);
  const [halaqat, setHalaqat] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHalaqah, setActiveHalaqah] = useState<any>(null);
  const [isLive, setIsLive] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [surah, setSurah] = useState(SURAHS[SURAHS.length-1]);
  const [fromAyah, setFromAyah] = useState(1);
  const [toAyah, setToAyah] = useState(1);
  const [recType, setRecType] = useState('new');
  const [tajweedErrors, setTajweedErrors] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [recitations, setRecitations] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream|null>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadHalaqat();
  }, []);

  const loadHalaqat = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/live-quran', { headers: getHeaders() });
      if (r.ok) { const d = await r.json(); setHalaqat(d.halaqat || []); }
    } catch {}
    setLoading(false);
  };

  const loadStudents = async (halaqah: any) => {
    setActiveHalaqah(halaqah);
    try {
      const r = await fetch('/api/students', { headers: getHeaders() });
      if (r.ok) { const d = await r.json(); setStudents(d.students || d.data || []); }
    } catch {}
  };

  const toggleLive = async () => {
    if (!activeHalaqah) return;
    const action = isLive ? 'stop_live' : 'start_live';
    await fetch('/api/live-quran', { method: 'PUT', headers: { ...getHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ id: activeHalaqah.id, action }) });
    setIsLive(!isLive);
    if (!isLive) startCamera(); else stopCamera();
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
      setCameraOn(true);
    } catch { setCameraOn(false); }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setMicOn(!micOn);
  };

  const submitGrade = async (grade: string) => {
    if (!selectedStudent) { setMsg('اختر طالباً أولاً'); return; }
    setSaving(true); setMsg('');
    try {
      const r = await fetch('/api/quran-recitation', {
        method: 'POST', headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: selectedStudent.id, halaqah_id: activeHalaqah?.id, surah_number: surah.n, surah_name: surah.name, from_ayah: fromAyah, to_ayah: toAyah, recitation_type: recType, grade, tajweed_errors: tajweedErrors, notes: notes || null })
      });
      if (r.ok) {
        setMsg('تم تسجيل التسميع بنجاح');
        setTajweedErrors(0); setNotes('');
        const d = await r.json();
        setRecitations(prev => [d.recitation, ...prev]);
      } else { setMsg('حدث خطأ'); }
    } catch { setMsg('حدث خطأ'); }
    setSaving(false);
  };

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:DARK,color:'#fff',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}><div style={{textAlign:'center'}}><BookOpen size={48} color={QC} /><div style={{marginTop:16,color:DIM}}>جارٍ التحميل...</div></div></div>;

  return (
    <div style={{fontFamily:"'IBM Plex Sans Arabic',sans-serif",direction:'rtl',background:DARK,color:'#EEEEF5',minHeight:'100vh'}}>
      <div style={{maxWidth:1400,margin:'0 auto',padding:'24px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,margin:0,display:'flex',alignItems:'center',gap:10}}><BookOpen size={24} color={QC} /> الحلقة المباشرة</h1>
            <p style={{fontSize:13,color:MUT,margin:'4px 0 0'}}>{activeHalaqah ? activeHalaqah.name : 'اختر حلقة للبدء'}</p>
          </div>
          <Link href="/dashboard"><button style={{background:'rgba(255,255,255,0.06)',border:'1px solid '+BD,borderRadius:10,padding:'8px 16px',color:DIM,fontSize:13,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:6}}><ChevronLeft size={16} /> الرئيسية</button></Link>
        </div>

        {!activeHalaqah ? (
          <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:24}}>
            <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>اختر الحلقة</h3>
            {halaqat.length === 0 ? <p style={{color:MUT,fontSize:13,textAlign:'center',padding:40}}>لا توجد حلقات. أنشئ حلقة جديدة من صفحة المحفّظ.</p> :
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12}}>
                {halaqat.map((h:any) => (
                  <div key={h.id} onClick={() => loadStudents(h)} style={{background:'rgba(255,255,255,0.02)',border:'1px solid '+BD,borderRadius:12,padding:16,cursor:'pointer',transition:'border-color 0.2s'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                      <div style={{width:36,height:36,borderRadius:10,background:QC+'18',display:'flex',alignItems:'center',justifyContent:'center'}}><BookOpen size={18} color={QC} /></div>
                      <div><div style={{fontSize:14,fontWeight:700}}>{h.name}</div><div style={{fontSize:11,color:MUT}}>{h.muhaffiz_name || ''} | {h.day_of_week || ''} {h.start_time || ''}</div></div>
                    </div>
                    {h.is_live && <div style={{fontSize:11,color:'#EF4444',fontWeight:700,display:'flex',alignItems:'center',gap:4}}><div style={{width:8,height:8,borderRadius:'50%',background:'#EF4444'}} /> مباشر الآن</div>}
                  </div>
                ))}
              </div>
            }
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
            <div style={{display:'flex',flexDirection:'column' as const,gap:16}}>
              <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:16,position:'relative'}}>
                <div style={{aspectRatio:'16/9',background:'#000',borderRadius:12,overflow:'hidden',position:'relative'}}>
                  <video ref={videoRef} autoPlay muted playsInline style={{width:'100%',height:'100%',objectFit:'cover',display:cameraOn?'block':'none'}} />
                  {!cameraOn && <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column' as const,alignItems:'center',justifyContent:'center',color:MUT}}><VideoOff size={48} /><div style={{marginTop:8,fontSize:13}}>الكاميرا مغلقة</div></div>}
                  {isLive && <div style={{position:'absolute',top:12,right:12,background:'#EF4444',color:'#fff',padding:'4px 12px',borderRadius:6,fontSize:12,fontWeight:700,display:'flex',alignItems:'center',gap:4}}><div style={{width:8,height:8,borderRadius:'50%',background:'#fff',animation:'pulse 1s infinite'}} /> مباشر</div>}
                </div>
                <div style={{display:'flex',justifyContent:'center',gap:10,marginTop:12}}>
                  <button onClick={toggleLive} style={{display:'flex',alignItems:'center',gap:6,padding:'10px 20px',borderRadius:10,border:'none',background:isLive?'#EF4444':QC,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>{isLive?<><Square size={16} /> إيقاف</>:<><Play size={16} /> بدء البث</>}</button>
                  <button onClick={() => { if(cameraOn) stopCamera(); else startCamera(); }} style={{width:40,height:40,borderRadius:10,border:'1px solid '+BD,background:'rgba(255,255,255,0.05)',color:cameraOn?QC:MUT,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>{cameraOn?<Video size={18}/>:<VideoOff size={18}/>}</button>
                  <button onClick={toggleMic} style={{width:40,height:40,borderRadius:10,border:'1px solid '+BD,background:'rgba(255,255,255,0.05)',color:micOn?QC:MUT,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>{micOn?<Mic size={18}/>:<MicOff size={18}/>}</button>
                </div>
              </div>

              <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:20}}>
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:8}}><BookOpen size={16} color={QC} /> تسجيل التسميع</h3>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                  <div>
                    <label style={{fontSize:11,color:MUT,marginBottom:4,display:'block'}}>السورة</label>
                    <select value={surah.n} onChange={e => { const s = SURAHS.find(x=>x.n===parseInt(e.target.value)); if(s) setSurah(s); }} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'8px 10px',borderRadius:8,fontSize:13,fontFamily:'inherit'}}>
                      {SURAHS.map(s => <option key={s.n} value={s.n}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:11,color:MUT,marginBottom:4,display:'block'}}>النوع</label>
                    <select value={recType} onChange={e=>setRecType(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'8px 10px',borderRadius:8,fontSize:13,fontFamily:'inherit'}}>
                      <option value="new">حفظ جديد</option>
                      <option value="review">مراجعة</option>
                      <option value="tilawah">تلاوة</option>
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:11,color:MUT,marginBottom:4,display:'block'}}>من آية</label>
                    <input type="number" min={1} max={surah.ayahs} value={fromAyah} onChange={e=>setFromAyah(parseInt(e.target.value)||1)} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'8px 10px',borderRadius:8,fontSize:13,fontFamily:'inherit',boxSizing:'border-box' as const}} />
                  </div>
                  <div>
                    <label style={{fontSize:11,color:MUT,marginBottom:4,display:'block'}}>إلى آية</label>
                    <input type="number" min={1} max={surah.ayahs} value={toAyah} onChange={e=>setToAyah(parseInt(e.target.value)||1)} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'8px 10px',borderRadius:8,fontSize:13,fontFamily:'inherit',boxSizing:'border-box' as const}} />
                  </div>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:11,color:MUT,marginBottom:4,display:'block'}}>أخطاء التجويد</label>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <button onClick={()=>setTajweedErrors(Math.max(0,tajweedErrors-1))} style={{width:32,height:32,borderRadius:8,border:'1px solid '+BD,background:'rgba(255,255,255,0.05)',color:'#EEEEF5',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>-</button>
                    <span style={{fontSize:18,fontWeight:800,minWidth:30,textAlign:'center' as const}}>{tajweedErrors}</span>
                    <button onClick={()=>setTajweedErrors(tajweedErrors+1)} style={{width:32,height:32,borderRadius:8,border:'1px solid '+BD,background:'rgba(255,255,255,0.05)',color:'#EEEEF5',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                  </div>
                </div>
                <input placeholder="ملاحظات..." value={notes} onChange={e=>setNotes(e.target.value)} style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,color:'#EEEEF5',padding:'8px 10px',borderRadius:8,fontSize:13,fontFamily:'inherit',marginBottom:12,boxSizing:'border-box' as const}} />
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                  {GRADES.map(g => (
                    <button key={g.id} onClick={() => submitGrade(g.id)} disabled={saving} style={{display:'flex',flexDirection:'column' as const,alignItems:'center',gap:4,padding:'12px 8px',borderRadius:10,border:'2px solid '+g.color+'30',background:g.color+'10',color:g.color,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',opacity:saving?0.5:1}}>
                      <g.Ic size={20} />{g.label}
                    </button>
                  ))}
                </div>
                {msg && <div style={{marginTop:10,padding:'8px 12px',borderRadius:8,background:msg.includes('نجاح')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:msg.includes('نجاح')?'#10B981':'#EF4444',fontSize:12}}>{msg}</div>}
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column' as const,gap:16}}>
              <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:16}}>
                <h3 style={{fontSize:14,fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:6}}><Users size={16} color={QC} /> الطلاب ({students.length})</h3>
                <div style={{maxHeight:300,overflowY:'auto' as const,display:'grid',gap:6}}>
                  {students.map((s:any) => (
                    <div key={s.id} onClick={()=>setSelectedStudent(s)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:8,border:'1px solid '+(selectedStudent?.id===s.id?QC+'50':BD),background:selectedStudent?.id===s.id?QC+'10':'transparent',cursor:'pointer'}}>
                      <div style={{width:30,height:30,borderRadius:'50%',background:QC+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:QC}}>{(s.name||'')[0]}</div>
                      <div style={{fontSize:12,fontWeight:600}}>{s.name || s.student_name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{background:CARD,border:'1px solid '+BD,borderRadius:16,padding:16}}>
                <h3 style={{fontSize:14,fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:6}}><Award size={16} color={G} /> آخر التسميعات</h3>
                {recitations.length === 0 ? <p style={{color:MUT,fontSize:12}}>لا توجد تسميعات في هذه الجلسة</p> :
                  <div style={{maxHeight:250,overflowY:'auto' as const,display:'grid',gap:6}}>
                    {recitations.slice(0,10).map((r:any,i:number) => (
                      <div key={i} style={{padding:'8px 10px',borderRadius:8,border:'1px solid '+BD,fontSize:12}}>
                        <div style={{fontWeight:600}}>{r.surah_name || 'سورة '+r.surah_number}</div>
                        <div style={{color:MUT,fontSize:11}}>آية {r.from_ayah}-{r.to_ayah} | {r.grade} | {r.points} نقطة</div>
                      </div>
                    ))}
                  </div>
                }
              </div>

              <button onClick={() => { stopCamera(); setActiveHalaqah(null); setIsLive(false); setSelectedStudent(null); setRecitations([]); }} style={{background:'rgba(255,255,255,0.06)',border:'1px solid '+BD,borderRadius:10,padding:'10px 16px',color:DIM,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit',textAlign:'center' as const}}>العودة لقائمة الحلقات</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
