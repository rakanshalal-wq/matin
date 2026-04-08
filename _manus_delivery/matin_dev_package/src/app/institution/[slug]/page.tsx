'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { School, GraduationCap, Building2, Briefcase, BookOpen, BarChart3, MessageCircle, Trophy, Award, CreditCard, Monitor, Users } from 'lucide-react';

const BD = 'rgba(255,255,255,0.08)';
const DIM = 'rgba(238,238,245,0.6)';
const MUT = 'rgba(238,238,245,0.3)';
const CD = 'rgba(255,255,255,0.03)';

const ICONS: Record<string, any> = { school: School, university: GraduationCap, institute: Building2, training: Briefcase, quran: BookOpen };
const LABELS: Record<string, string> = { school: 'مدرسة', university: 'جامعة', institute: 'معهد', training: 'مركز تدريب', quran: 'تحفيظ قرآن' };
const COLORS: Record<string, [string,string,string]> = {
  school: ['#1E88E5','#0D47A1','#FFB300'],
  university: ['#7C3AED','#4C1D95','#F59E0B'],
  institute: ['#0EA5E9','#0369A1','#F59E0B'],
  training: ['#F97316','#C2410C','#10B981'],
  quran: ['#059669','#065F46','#D4A843'],
};
const CTAS: Record<string, string> = { school: 'سجّل ابنك الآن', university: 'قدّم طلب القبول', institute: 'سجّل الآن', training: 'سجّل في البرنامج', quran: 'انضم للحلقة' };

export default function InstitutionPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [d, setD] = useState<any>(null);
  const [tp, setTp] = useState('school');
  const [stats, setStats] = useState<any>({});
  const [ann, setAnn] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string,string>>({});
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/public/institution/' + slug)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) { setD(data.institution); setTp(data.type || 'school'); if (data.stats) setStats(data.stats); if (data.announcements) setAnn(data.announcements); }
      }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const TypeIcon = ICONS[tp] || School;
  const label = LABELS[tp] || 'مؤسسة';
  const [DP,DS,DA] = COLORS[tp] || COLORS.school;
  const cta = CTAS[tp] || 'سجّل الآن';
  const P = d?.primary_color || DP;
  const S = d?.secondary_color || DS;
  const A = d?.accent_color || DA;
  const name = d?.name || label;
  const desc = d?.description || 'منصة تعليمية متكاملة مدعومة بمتين';

  const submit = async () => {
    if (!form.phone || (!form.parent_name && !form.full_name)) return;
    setSending(true); setMsg('');
    try {
      const r = await fetch('/api/public/institution/' + slug, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) });
      setMsg(r.ok ? 'تم إرسال طلبك بنجاح!' : 'حدث خطأ، حاول مجدداً');
      if (r.ok) setForm({});
    } catch { setMsg('حدث خطأ'); }
    setSending(false);
  };
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({behavior:'smooth'});

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#06060E',color:'#fff',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}>
      <div style={{textAlign:'center'}}>
        <TypeIcon size={48} style={{marginBottom:16,color:P}} />
        <div style={{fontSize:'1.1rem',color:DIM}}>جارٍ تحميل البوابة...</div>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"'IBM Plex Sans Arabic',sans-serif",direction:'rtl',background:'#06060E',color:'#EEEEF5',minHeight:'100vh'}}>
      <nav style={{position:'fixed',top:0,right:0,left:0,zIndex:200,backdropFilter:'blur(20px)',background:'rgba(6,6,14,0.9)',borderBottom:'1px solid '+BD}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:11}}>
            <div style={{width:40,height:40,borderRadius:10,background:'linear-gradient(135deg,'+P+','+S+')',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}><TypeIcon size={20} /></div>
            <div>
              <div style={{fontSize:15,fontWeight:800}}>{name}</div>
              <div style={{fontSize:10,color:MUT}}>{slug}.matin.ink</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <Link href="/login"><button style={{background:'rgba(255,255,255,0.06)',border:'1px solid '+BD,borderRadius:9,padding:'8px 16px',color:DIM,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>تسجيل الدخول</button></Link>
            <button onClick={()=>scroll('register')} style={{background:'linear-gradient(135deg,'+P+','+S+')',border:'none',borderRadius:9,padding:'8px 18px',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>{cta}</button>
          </div>
        </div>
      </nav>

      <section id="hero" style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',padding:'80px 24px 60px'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 40%,'+P+'18 0%,transparent 55%),radial-gradient(circle at 75% 60%,'+A+'10 0%,transparent 45%)'}} />
        <div style={{maxWidth:1100,margin:'0 auto',position:'relative',zIndex:2,width:'100%'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:P+'18',border:'1px solid '+P+'30',borderRadius:20,padding:'6px 14px',fontSize:12,color:P,fontWeight:600,marginBottom:20}}>
            <TypeIcon size={14} />
            {label} معتمدة على منصة متين
          </div>
          <h1 style={{fontSize:'clamp(32px,5vw,48px)',fontWeight:800,lineHeight:1.15,marginBottom:16}}>
            بوابتك لـ <span style={{background:'linear-gradient(135deg,'+P+','+A+')',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{name}</span>
          </h1>
          <p style={{fontSize:16,color:DIM,lineHeight:1.7,marginBottom:28,maxWidth:480}}>{desc}</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button onClick={()=>scroll('register')} style={{background:'linear-gradient(135deg,'+P+','+S+')',border:'none',borderRadius:12,padding:'13px 28px',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 8px 28px '+P+'30'}}>{cta}</button>
            <button onClick={()=>scroll('services')} style={{background:'rgba(255,255,255,0.05)',border:'1px solid '+BD,borderRadius:12,padding:'13px 24px',color:DIM,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>تعرّف علينا</button>
          </div>
          <div style={{display:'flex',gap:28,marginTop:32,flexWrap:'wrap'}}>
            {[{k:'students',l:'طالب'},{k:'teachers',l:'معلم'},{k:'years',l:'سنة'},{k:'satisfaction',l:'% رضا'}].filter(s => stats[s.k]).map(s => (
              <div key={s.k} style={{textAlign:'center'}}>
                <div style={{fontSize:24,fontWeight:800}}>{stats[s.k]}{s.k==='satisfaction'?'%':'+'}</div>
                <div style={{fontSize:11,color:MUT,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" style={{padding:'80px 24px'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(26px,4vw,34px)',fontWeight:800,marginBottom:32,textAlign:'center'}}>
            كل ما تحتاجه <span style={{background:'linear-gradient(135deg,'+P+','+A+')',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>في مكان واحد</span>
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
            {[
              {Ic:Monitor,t:'التعليم الرقمي',d:'منهج متكامل مع محتوى تعليمي تفاعلي',c:'#3B82F6'},
              {Ic:BarChart3,t:'تتبع التقدم',d:'متابعة الأداء والتقدم في الوقت الفعلي',c:'#10B981'},
              {Ic:MessageCircle,t:'التواصل المباشر',d:'تواصل مباشر مع المعلمين والإدارة',c:'#A78BFA'},
              {Ic:Trophy,t:'الأنشطة والفعاليات',d:'برامج إثرائية متنوعة لتنمية المهارات',c:P},
              {Ic:Award,t:'شهادات معتمدة',d:'شهادات إتمام معتمدة رسمياً',c:'#F59E0B'},
              {Ic:CreditCard,t:'الدفع الإلكتروني',d:'سدّد الرسوم بأمان وسهولة',c:'#EF4444'},
            ].map((s,i) => (
              <div key={i} style={{background:CD,border:'1px solid '+BD,borderRadius:16,padding:22}}>
                <div style={{width:56,height:56,borderRadius:16,background:s.c+'18',border:'1px solid '+s.c+'25',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
                  <s.Ic size={24} color={s.c} />
                </div>
                <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>{s.t}</div>
                <div style={{fontSize:12.5,color:DIM,lineHeight:1.6}}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {ann.length > 0 && (
        <section id="announcements" style={{padding:'80px 24px'}}>
          <div style={{maxWidth:1200,margin:'0 auto'}}>
            <h2 style={{fontSize:'clamp(22px,3.5vw,30px)',fontWeight:800,marginBottom:24}}>الإعلانات</h2>
            {ann.map((a:any,i:number) => (
              <div key={i} style={{background:CD,border:'1px solid '+BD,borderRadius:14,padding:'16px 18px',marginBottom:12,display:'flex',alignItems:'flex-start',gap:14}}>
                <div style={{width:10,height:10,borderRadius:'50%',background:P,flexShrink:0,marginTop:4}} />
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>{a.title}</div>
                  <div style={{fontSize:12.5,color:DIM,lineHeight:1.6,marginTop:4}}>{a.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="register" style={{padding:'80px 24px'}}>
        <div style={{maxWidth:600,margin:'0 auto',background:'linear-gradient(135deg,'+P+'10,'+S+'08)',border:'1px solid '+P+'20',borderRadius:20,padding:40}}>
          <h2 style={{fontSize:26,fontWeight:800,marginBottom:8}}>{cta}</h2>
          <p style={{fontSize:13,color:DIM,marginBottom:24}}>أرسل طلبك وسنتواصل معك قريباً</p>
          <div style={{display:'flex',flexDirection:'column' as const,gap:12}}>
            {[{k:'full_name',p:'الاسم الكامل *'},{k:'parent_name',p:'اسم ولي الأمر'},{k:'phone',p:'رقم الجوال *'},{k:'email',p:'البريد الإلكتروني'}].map(f => (
              <input key={f.k} placeholder={f.p} value={form[f.k]||''} onChange={e=>setForm(prev=>({...prev,[f.k]:e.target.value}))}
                style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#EEEEF5',fontSize:13,padding:'11px 14px',borderRadius:10,fontFamily:'inherit',outline:'none',boxSizing:'border-box' as const}} />
            ))}
            {msg && <div style={{padding:'10px 14px',borderRadius:9,background:msg.includes('نجاح')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:msg.includes('نجاح')?'#10B981':'#EF4444',fontSize:13}}>{msg}</div>}
            <button onClick={submit} disabled={sending} style={{background:'linear-gradient(135deg,'+P+','+S+')',border:'none',borderRadius:12,padding:13,color:'#fff',fontSize:15,fontWeight:800,cursor:'pointer',fontFamily:'inherit',width:'100%',opacity:sending?0.6:1}}>{sending ? 'جارٍ الإرسال...' : cta}</button>
          </div>
        </div>
      </section>

      <footer style={{background:'#09111A',borderTop:'1px solid '+BD,padding:'48px 24px 24px'}}>
        <div style={{maxWidth:1200,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap' as const,gap:10}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:9,background:'linear-gradient(135deg,'+P+','+S+')',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}><TypeIcon size={18} /></div>
            <span style={{fontWeight:800,fontSize:15}}>{name}</span>
          </div>
          <div style={{fontSize:12,color:MUT}}>مدعوم بـ <strong style={{color:'#D4A843'}}>متين</strong> للتعليم الذكي</div>
        </div>
      </footer>
    </div>
  );
}
