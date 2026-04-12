'use client';
import { useState, FormEvent } from 'react';

const G = '#C9A84C', DARK = '#06060E';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'حدث خطأ، حاول مرة أخرى');
        setLoading(false);
        return;
      }

      // حفظ بيانات المستخدم والتوكن
      if (data.user) localStorage.setItem('matin_user', JSON.stringify(data.user));
      if (data.token) localStorage.setItem('matin_token', data.token);

      window.location.href = data.redirect || '/dashboard';
    } catch {
      setError('تعذّر الاتصال بالسيرفر');
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:DARK,padding:'1rem',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}>
      <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'2.5rem',width:'100%',maxWidth:420,boxShadow:'0 25px 50px rgba(0,0,0,0.4)'}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{display:'inline-block',background:`linear-gradient(135deg,${G},#B8943A)`,color:'#fff',width:52,height:52,borderRadius:14,lineHeight:'52px',fontSize:'1.4rem',fontWeight:800}}>م</div>
          <h1 style={{fontSize:'1.5rem',fontWeight:700,color:'#fff',margin:'12px 0 4px'}}>تسجيل الدخول</h1>
          <p style={{color:'rgba(238,238,245,0.4)',fontSize:'0.9rem',margin:0}}>أدخل بياناتك للوصول إلى لوحة التحكم</p>
        </div>

        {error && (
          <div style={{background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:'10px 14px',color:'#FCA5A5',fontSize:'0.875rem',marginBottom:16,textAlign:'center'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <div>
            <label style={{color:'rgba(238,238,245,0.5)',fontSize:'0.85rem',display:'block',marginBottom:6}}>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="example@school.com"
              style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'12px 14px',color:'#fff',fontSize:'0.95rem',fontFamily:'inherit',direction:'ltr',textAlign:'left',boxSizing:'border-box',outline:'none'}} />
          </div>
          <div>
            <label style={{color:'rgba(238,238,245,0.5)',fontSize:'0.85rem',display:'block',marginBottom:6}}>كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••"
              style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'12px 14px',color:'#fff',fontSize:'0.95rem',fontFamily:'inherit',boxSizing:'border-box',outline:'none'}} />
          </div>
          <button type="submit" disabled={loading} style={{background:`linear-gradient(135deg,${G},#B8943A)`,border:'none',borderRadius:10,padding:'14px',color:'#fff',fontSize:'1rem',fontWeight:600,cursor:loading?'wait':'pointer',marginTop:4,fontFamily:'inherit',opacity:loading?0.7:1}}>
            {loading ? 'جارٍ الدخول...' : 'دخول'}
          </button>
        </form>

        <div style={{textAlign:'center',marginTop:20}}>
          <a href="/register" style={{color:G,textDecoration:'none',fontSize:'0.85rem'}}>ليس لديك حساب؟ سجل الآن</a>
        </div>
        <div style={{textAlign:'center',marginTop:8}}>
          <a href="/forgot-password" style={{color:'rgba(238,238,245,0.3)',textDecoration:'none',fontSize:'0.8rem'}}>نسيت كلمة المرور؟</a>
        </div>
      </div>
    </div>
  );
}
