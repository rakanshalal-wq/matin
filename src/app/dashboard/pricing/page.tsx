'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Check, Star, Zap, Shield, ChevronLeft, Loader2 } from 'lucide-react';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C', DARK = '#06060E', CARD = 'rgba(255,255,255,0.03)', BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)', MUT = 'rgba(238,238,245,0.3)';

const PLANS = [
  {
    id: 'basic', name: 'الأساسية', price: 0, label: 'مجاناً', period: '',
    icon: Shield, color: '#64748B', popular: false,
    features: ['مدرسة واحدة', 'حتى 50 طالب', '3 معلمين', 'إدارة الحضور', 'سجل الدرجات'],
  },
  {
    id: 'professional', name: 'الاحترافية', price: 99, label: '99 ر.س', period: '/شهرياً',
    icon: Star, color: G, popular: true,
    features: ['حتى 3 مدارس', 'حتى 500 طالب', '20 معلم', 'تقارير متقدمة', 'نظام الحضور + التسميع', 'إشعارات البريد', 'دعم فني أولوية'],
  },
  {
    id: 'enterprise', name: 'المؤسسات', price: 299, label: '299 ر.س', period: '/شهرياً',
    icon: Crown, color: '#A78BFA', popular: false,
    features: ['مدارس غير محدودة', 'طلاب غير محدود', 'معلمين غير محدود', 'كل المميزات', 'تصدير التقارير', 'API مخصص', 'دعم فني 24/7', 'تخصيص الهوية'],
  },
];

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setMsg('تم الاشتراك بنجاح! جارٍ تفعيل باقتك...');
      const newPlan = params.get('plan') || 'professional';
      setCurrentPlan(newPlan);
      u.package = newPlan;
      localStorage.setItem('matin_user', JSON.stringify(u));
    }
    if (params.get('canceled') === 'true') {
      setMsg('تم إلغاء عملية الدفع');
    }

    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const r = await fetch('/api/payments/status', { headers: getHeaders() });
      if (r.ok) {
        const d = await r.json();
        setCurrentPlan(d.current_plan || 'basic');
      }
    } catch {}
    setLoading(false);
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) return;
    if (planId === 'basic') return;
    setUpgrading(planId);
    setMsg('');
    try {
      const r = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: planId }),
      });
      const d = await r.json();
      if (d.url) {
        window.location.href = d.url;
      } else {
        setMsg(d.error || 'خطأ في إنشاء جلسة الدفع');
      }
    } catch {
      setMsg('خطأ في الاتصال');
    }
    setUpgrading('');
  };

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:DARK,color:'#fff',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}>
      <div style={{textAlign:'center'}}><Crown size={48} color={G} /><div style={{marginTop:16,color:DIM}}>جارٍ التحميل...</div></div>
    </div>
  );

  return (
    <div dir="rtl" style={{minHeight:'100vh',background:DARK,color:'#EEEEF5',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}>
      {/* Header */}
      <div style={{padding:'20px 24px',borderBottom:`1px solid ${BD}`,display:'flex',alignItems:'center',gap:12}}>
        <Link href="/dashboard" style={{color:DIM,textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
          <ChevronLeft size={18} /> الرئيسية
        </Link>
        <div style={{flex:1}} />
        <Crown size={20} color={G} />
        <span style={{color:G,fontWeight:700}}>الباقات والأسعار</span>
      </div>

      {/* Messages */}
      {msg && (
        <div style={{margin:'20px 24px',padding:'12px 16px',borderRadius:10,background:msg.includes('نجاح')?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)',color:msg.includes('نجاح')?'#10B981':'#EF4444',fontSize:14,textAlign:'center'}}>
          {msg}
        </div>
      )}

      {/* Current Plan Badge */}
      <div style={{textAlign:'center',padding:'30px 24px 10px'}}>
        <div style={{display:'inline-block',background:'rgba(201,168,76,0.15)',border:'1px solid rgba(201,168,76,0.3)',padding:'8px 20px',borderRadius:20,fontSize:13,color:G}}>
          باقتك الحالية: <strong>{PLANS.find(p=>p.id===currentPlan)?.name || 'الأساسية'}</strong>
        </div>
      </div>

      {/* Title */}
      <div style={{textAlign:'center',padding:'20px 24px 40px'}}>
        <h1 style={{fontSize:28,fontWeight:800,color:'#fff',marginBottom:8}}>اختر الباقة المناسبة</h1>
        <p style={{color:MUT,fontSize:15}}>ابدأ مجاناً وترقّ حسب احتياجاتك</p>
      </div>

      {/* Plans Grid */}
      <div style={{display:'flex',gap:20,justifyContent:'center',flexWrap:'wrap',padding:'0 24px 60px',maxWidth:1100,margin:'0 auto'}}>
        {PLANS.map(plan => {
          const isCurrent = plan.id === currentPlan;
          const Ic = plan.icon;
          return (
            <div key={plan.id} style={{
              flex:'1 1 300px',maxWidth:340,background:CARD,border:`1px solid ${plan.popular?G:BD}`,
              borderRadius:16,padding:30,position:'relative',
              boxShadow: plan.popular ? `0 0 30px rgba(201,168,76,0.15)` : 'none',
            }}>
              {plan.popular && (
                <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:`linear-gradient(135deg,${G},#B8943A)`,color:'#fff',padding:'4px 16px',borderRadius:20,fontSize:12,fontWeight:700}}>
                  الأكثر طلباً
                </div>
              )}

              <div style={{textAlign:'center',marginBottom:24}}>
                <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:56,height:56,borderRadius:14,background:`rgba(${plan.color === G ? '201,168,76' : plan.color === '#A78BFA' ? '167,139,250' : '100,116,139'},0.15)`,marginBottom:12}}>
                  <Ic size={28} color={plan.color} />
                </div>
                <h3 style={{fontSize:20,fontWeight:700,color:'#fff',marginBottom:4}}>{plan.name}</h3>
                <div style={{fontSize:32,fontWeight:800,color:plan.color}}>
                  {plan.label}
                  {plan.period && <span style={{fontSize:14,fontWeight:400,color:MUT}}>{plan.period}</span>}
                </div>
              </div>

              <div style={{marginBottom:24}}>
                {plan.features.map((f,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',fontSize:14,color:DIM}}>
                    <Check size={16} color={plan.color} /> {f}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || upgrading === plan.id || plan.price === 0}
                style={{
                  width:'100%',padding:'12px 0',borderRadius:10,border:'none',
                  background: isCurrent ? 'rgba(255,255,255,0.05)' : plan.popular ? `linear-gradient(135deg,${G},#B8943A)` : 'rgba(255,255,255,0.08)',
                  color: isCurrent ? MUT : plan.popular ? '#fff' : DIM,
                  fontSize:15,fontWeight:700,cursor: isCurrent ? 'default' : 'pointer',
                  fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                  opacity: upgrading === plan.id ? 0.7 : 1,
                }}
              >
                {upgrading === plan.id ? <><Loader2 size={16} className="animate-spin" /> جارٍ التحويل...</>
                  : isCurrent ? 'باقتك الحالية'
                  : plan.price === 0 ? 'مجانية'
                  : `ترقية إلى ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div style={{maxWidth:700,margin:'0 auto',padding:'0 24px 60px'}}>
        <h2 style={{textAlign:'center',fontSize:22,fontWeight:700,color:'#fff',marginBottom:24}}>أسئلة شائعة</h2>
        {[
          { q: 'هل يمكنني تغيير الباقة لاحقاً؟', a: 'نعم، يمكنك الترقية في أي وقت. سيتم احتساب الفرق تلقائياً.' },
          { q: 'هل يوجد فترة تجريبية؟', a: 'الباقة المجانية متاحة دائماً بدون حدود زمنية. يمكنك الترقية عندما تحتاج مميزات إضافية.' },
          { q: 'كيف يتم الدفع؟', a: 'عبر بطاقات الائتمان (Visa, Mastercard) بشكل آمن عبر Stripe.' },
          { q: 'هل يمكنني إلغاء الاشتراك؟', a: 'نعم، يمكنك إلغاء الاشتراك في أي وقت من إعدادات حسابك.' },
        ].map((faq, i) => (
          <div key={i} style={{background:CARD,border:`1px solid ${BD}`,borderRadius:12,padding:'16px 20px',marginBottom:12}}>
            <div style={{fontWeight:700,color:'#fff',fontSize:15,marginBottom:6}}>{faq.q}</div>
            <div style={{color:MUT,fontSize:14,lineHeight:1.7}}>{faq.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
