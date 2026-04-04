'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { getHeaders } from '@/lib/api';

const GR = '#047857'; const G = '#D4A843';

const GRADES = ['ممتاز','جيد جداً','جيد','يحتاج مراجعة','خطأ تجويد'];
const GRADE_COLORS = [GR, '#3B82F6', G, '#F59E0B', '#EF4444'];

export default function QuranSession() {
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [grade, setGrade] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    fetch('/api/quran?type=session-students', { headers: getHeaders() })
      .then(r => r.json()).then(d => { if (d.students?.length) { setStudents(d.students); setCurrentStudent(d.students[0]); } })
      .catch(() => {});
  }, []);

  async function saveGrade() {
    if (!currentStudent || !grade) return;
    setSaved(false);
    await fetch('/api/quran', { method:'POST', headers: getHeaders(), body: JSON.stringify({ type:'grade', studentId: currentStudent.id, grade, notes }) });
    setSaved(true);
    setGrade(''); setNotes('');
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ fontFamily:"'IBM Plex Sans Arabic',sans-serif", direction:'rtl', color:'#F8FAFC', minHeight:'100vh' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span style={{ width:10, height:10, borderRadius:'50%', background:'#EF4444', display:'inline-block', boxShadow:'0 0 8px #EF4444' }} />
            <h1 style={{ margin:0, fontSize:'1.25rem', fontWeight:800, color:'#fff' }}>الحلقة المباشرة</h1>
          </div>
          <p style={{ margin:'0.25rem 0 0', color:'rgba(255,255,255,0.4)', fontSize:'0.85rem' }}>المحفّظ: {user?.name}</p>
        </div>
        <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#FCA5A5', padding:'0.4rem 1rem', borderRadius:20, fontSize:'0.8rem', fontWeight:700 }}>
          🔴 مباشر
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:'1rem' }}>
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1rem' }}>
          <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', color:'rgba(255,255,255,0.6)' }}>👥 الطلاب ({students.length})</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {students.map((s:any) => (
              <button key={s.id} onClick={() => { setCurrentStudent(s); setGrade(''); setNotes(''); }} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', background: currentStudent?.id===s.id ? `${GR}20` : 'rgba(255,255,255,0.02)', borderLeft: currentStudent?.id===s.id ? `3px solid ${GR}` : '3px solid transparent' }}>
                <span style={{ color:'#fff', fontWeight: currentStudent?.id===s.id ? 700 : 400, fontSize:'0.875rem' }}>{s.name}</span>
                <span style={{ fontSize:'0.75rem', padding:'2px 8px', borderRadius:12, background: s.status==='reading' ? `${GR}30` : s.status==='waiting' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', color: s.status==='reading' ? GR : s.status==='waiting' ? '#F59E0B' : '#94A3B8' }}>
                  {s.status==='reading' ? 'يقرأ' : s.status==='waiting' ? 'ينتظر' : s.status==='absent' ? 'غائب' : 'متصل'}
                </span>
              </button>
            ))}
            {students.length===0 && <div style={{ color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'2rem 0', fontSize:'0.85rem' }}>لا يوجد طلاب في الجلسة</div>}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
            <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', color:'rgba(255,255,255,0.6)' }}>
              📝 تقييم التسميع {currentStudent ? `— ${currentStudent.name}` : ''}
            </h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1rem' }}>
              {GRADES.map((g, i) => (
                <button key={g} onClick={() => setGrade(g)} style={{ padding:'0.5rem 1rem', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem', fontWeight:600, background: grade===g ? GRADE_COLORS[i] : 'rgba(255,255,255,0.05)', color: grade===g ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  {g}
                </button>
              ))}
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="ملاحظات التسميع (اختياري)..." rows={3} style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'0.75rem', color:'#fff', fontFamily:'inherit', fontSize:'0.875rem', resize:'vertical', boxSizing:'border-box', direction:'rtl' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.75rem' }}>
              <button onClick={saveGrade} disabled={!grade||!currentStudent} style={{ background: grade&&currentStudent ? GR : 'rgba(255,255,255,0.05)', border:'none', color: grade&&currentStudent ? '#fff' : 'rgba(255,255,255,0.3)', padding:'0.6rem 1.5rem', borderRadius:8, cursor: grade&&currentStudent ? 'pointer' : 'not-allowed', fontFamily:'inherit', fontWeight:600, fontSize:'0.875rem' }}>
                💾 حفظ التقييم
              </button>
              {saved && <span style={{ color: GR, fontSize:'0.85rem', fontWeight:600 }}>✅ تم الحفظ</span>}
            </div>
          </div>

          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
            <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', color:'rgba(255,255,255,0.6)' }}>⚙️ التحكم في الجلسة</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem' }}>
              {[
                { label:'📋 سجل الحضور', color:'#3B82F6' },
                { label:'📊 تقدم الحفظ', color: G },
                { label:'💬 رسائل أولياء الأمور', color:'#A855F7' },
                { label:'🔴 إنهاء الجلسة', color:'#EF4444' },
              ].map(btn => (
                <button key={btn.label} style={{ padding:'0.6rem 1rem', borderRadius:8, border:`1px solid ${btn.color}30`, background:`${btn.color}0D`, color: btn.color, cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem', fontWeight:600 }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
