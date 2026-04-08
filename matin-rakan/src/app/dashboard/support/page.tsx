'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Plus, ChevronLeft, Clock, CheckCircle, AlertCircle, Send, X, Loader2, HelpCircle } from 'lucide-react';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C', DARK = '#06060E', CARD = 'rgba(255,255,255,0.03)', BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)', MUT = 'rgba(238,238,245,0.3)';

const CATS = [
  { v: 'general', l: 'عام' },
  { v: 'technical', l: 'تقني' },
  { v: 'billing', l: 'مالي' },
  { v: 'account', l: 'حساب' },
  { v: 'feature', l: 'اقتراح' },
];

const PRIORITIES = [
  { v: 'low', l: 'منخفضة', c: '#64748B' },
  { v: 'medium', l: 'متوسطة', c: '#F59E0B' },
  { v: 'high', l: 'عالية', c: '#EF4444' },
];

const STATUS_MAP: Record<string, { l: string; c: string; Ic: any }> = {
  open: { l: 'مفتوحة', c: '#3B82F6', Ic: AlertCircle },
  answered: { l: 'تم الرد', c: '#10B981', Ic: CheckCircle },
  closed: { l: 'مغلقة', c: '#64748B', Ic: CheckCircle },
  pending: { l: 'معلقة', c: '#F59E0B', Ic: Clock },
};

export default function SupportPage() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '', category: 'general', priority: 'medium' });
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [filter, setFilter] = useState('all');
  const isAdmin = user && ['super_admin','owner','admin'].includes(user.role);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadTickets();
  }, []);

  const loadTickets = async (s?: string) => {
    setLoading(true);
    try {
      const url = s && s !== 'all' ? `/api/support?status=${s}` : '/api/support';
      const r = await fetch(url, { headers: getHeaders() });
      if (r.ok) { const d = await r.json(); setTickets(d.tickets || []); }
    } catch {}
    setLoading(false);
  };

  const submitTicket = async () => {
    if (!form.subject.trim() || !form.message.trim()) { setMsg('الموضوع والرسالة مطلوبان'); return; }
    setSending(true); setMsg('');
    try {
      const r = await fetch('/api/support', {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        setMsg('تم إرسال التذكرة بنجاح');
        setForm({ subject: '', message: '', category: 'general', priority: 'medium' });
        setShowNew(false);
        loadTickets();
      } else { const d = await r.json(); setMsg(d.error || 'خطأ'); }
    } catch { setMsg('خطأ في الاتصال'); }
    setSending(false);
  };

  const sendReply = async (ticketId: number) => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      const r = await fetch('/api/support', {
        method: 'PUT',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, admin_reply: replyText, status: 'answered' }),
      });
      if (r.ok) { setReplyText(''); loadTickets(); setSelectedTicket(null); setMsg('تم الرد بنجاح'); }
    } catch {}
    setReplying(false);
  };

  const closeTicket = async (ticketId: number) => {
    try {
      await fetch('/api/support', {
        method: 'PUT',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, status: 'closed' }),
      });
      loadTickets();
    } catch {}
  };

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div dir="rtl" style={{minHeight:'100vh',background:DARK,color:'#EEEEF5',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}>
      <div style={{padding:'20px 24px',borderBottom:`1px solid ${BD}`,display:'flex',alignItems:'center',gap:12}}>
        <Link href="/dashboard" style={{color:DIM,textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
          <ChevronLeft size={18} /> الرئيسية
        </Link>
        <div style={{flex:1}} />
        <HelpCircle size={20} color={G} />
        <span style={{color:G,fontWeight:700}}>الدعم الفني</span>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'30px 24px'}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
          <h1 style={{fontSize:22,fontWeight:700,color:'#fff',margin:0}}>تذاكر الدعم</h1>
          <button onClick={() => setShowNew(!showNew)} style={{display:'flex',alignItems:'center',gap:6,padding:'10px 18px',borderRadius:10,border:'none',background:`linear-gradient(135deg,${G},#B8943A)`,color:'#fff',cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:600}}>
            <Plus size={16} /> تذكرة جديدة
          </button>
        </div>

        {msg && (
          <div style={{padding:'10px 16px',borderRadius:8,background:msg.includes('نجاح')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:msg.includes('نجاح')?'#10B981':'#EF4444',fontSize:13,marginBottom:16}}>
            {msg}
          </div>
        )}

        {/* New Ticket Form */}
        {showNew && (
          <div style={{background:CARD,border:`1px solid ${BD}`,borderRadius:14,padding:24,marginBottom:24}}>
            <h3 style={{color:G,fontSize:16,fontWeight:700,marginBottom:16}}>تذكرة جديدة</h3>
            <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="الموضوع" style={{width:'100%',padding:'10px 14px',borderRadius:8,border:`1px solid ${BD}`,background:'rgba(255,255,255,0.03)',color:'#fff',fontSize:14,fontFamily:'inherit',marginBottom:12,boxSizing:'border-box'}} />
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="اكتب رسالتك هنا..." rows={4} style={{width:'100%',padding:'10px 14px',borderRadius:8,border:`1px solid ${BD}`,background:'rgba(255,255,255,0.03)',color:'#fff',fontSize:14,fontFamily:'inherit',marginBottom:12,resize:'vertical',boxSizing:'border-box'}} />
            <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{padding:'8px 14px',borderRadius:8,border:`1px solid ${BD}`,background:DARK,color:DIM,fontSize:13,fontFamily:'inherit'}}>
                {CATS.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
              </select>
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} style={{padding:'8px 14px',borderRadius:8,border:`1px solid ${BD}`,background:DARK,color:DIM,fontSize:13,fontFamily:'inherit'}}>
                {PRIORITIES.map(p => <option key={p.v} value={p.v}>{p.l}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={submitTicket} disabled={sending} style={{display:'flex',alignItems:'center',gap:6,padding:'10px 20px',borderRadius:8,border:'none',background:G,color:'#fff',cursor:'pointer',fontFamily:'inherit',fontSize:14,fontWeight:600}}>
                {sending?<Loader2 size={16} />:<Send size={16} />} إرسال
              </button>
              <button onClick={() => setShowNew(false)} style={{padding:'10px 16px',borderRadius:8,border:`1px solid ${BD}`,background:'transparent',color:MUT,cursor:'pointer',fontFamily:'inherit',fontSize:14}}>إلغاء</button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
          {[{v:'all',l:'الكل'},{v:'open',l:'مفتوحة'},{v:'answered',l:'تم الرد'},{v:'closed',l:'مغلقة'}].map(f => (
            <button key={f.v} onClick={() => { setFilter(f.v); loadTickets(f.v); }} style={{padding:'6px 14px',borderRadius:8,border:`1px solid ${filter===f.v?G:BD}`,background:filter===f.v?`${G}15`:'transparent',color:filter===f.v?G:MUT,cursor:'pointer',fontFamily:'inherit',fontSize:13}}>
              {f.l}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        {loading ? (
          <div style={{textAlign:'center',padding:40,color:DIM}}><Loader2 size={32} color={G} /><div style={{marginTop:12}}>جارٍ التحميل...</div></div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:60,color:MUT}}><MessageCircle size={48} strokeWidth={1} /><div style={{marginTop:12}}>لا توجد تذاكر</div></div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {filtered.map(t => {
              const st = STATUS_MAP[t.status] || STATUS_MAP.open;
              const StIc = st.Ic;
              return (
                <div key={t.id} style={{background:CARD,border:`1px solid ${BD}`,borderRadius:12,padding:'16px 20px',cursor:'pointer'}} onClick={() => setSelectedTicket(selectedTicket?.id === t.id ? null : t)}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                    <StIc size={16} color={st.c} />
                    <span style={{fontSize:12,color:st.c,fontWeight:600}}>{st.l}</span>
                    <span style={{fontSize:11,color:MUT,marginRight:'auto'}}>#{t.id}</span>
                    {isAdmin && t.user_name && <span style={{fontSize:11,color:MUT}}>{t.user_name}</span>}
                    <span style={{fontSize:11,color:MUT}}>{new Date(t.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div style={{fontWeight:700,color:'#fff',fontSize:15,marginBottom:4}}>{t.subject}</div>
                  <div style={{color:DIM,fontSize:13,lineHeight:1.6}}>{t.message.substring(0, 150)}{t.message.length > 150 ? '...' : ''}</div>

                  {selectedTicket?.id === t.id && (
                    <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${BD}`}}>
                      <div style={{color:DIM,fontSize:13,lineHeight:1.8,marginBottom:12}}>{t.message}</div>
                      {t.admin_reply && (
                        <div style={{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:10,padding:'12px 16px',marginBottom:12}}>
                          <div style={{fontSize:12,color:'#10B981',fontWeight:600,marginBottom:4}}>رد الإدارة {t.admin_name ? `(${t.admin_name})` : ''}</div>
                          <div style={{color:DIM,fontSize:13,lineHeight:1.7}}>{t.admin_reply}</div>
                          <div style={{fontSize:11,color:MUT,marginTop:6}}>{t.replied_at ? new Date(t.replied_at).toLocaleString('ar-SA') : ''}</div>
                        </div>
                      )}
                      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                        {isAdmin && t.status !== 'closed' && (
                          <>
                            <div style={{flex:1,minWidth:200}}>
                              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="اكتب الرد..." rows={2} style={{width:'100%',padding:'8px 12px',borderRadius:8,border:`1px solid ${BD}`,background:'rgba(255,255,255,0.03)',color:'#fff',fontSize:13,fontFamily:'inherit',resize:'none',boxSizing:'border-box'}} onClick={e => e.stopPropagation()} />
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); sendReply(t.id); }} disabled={replying} style={{padding:'8px 14px',borderRadius:8,border:'none',background:G,color:'#fff',cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:600,alignSelf:'flex-end'}}>
                              {replying ? 'جارٍ...' : 'رد'}
                            </button>
                          </>
                        )}
                        {t.status !== 'closed' && (
                          <button onClick={(e) => { e.stopPropagation(); closeTicket(t.id); }} style={{padding:'8px 14px',borderRadius:8,border:`1px solid ${BD}`,background:'transparent',color:MUT,cursor:'pointer',fontFamily:'inherit',fontSize:13,alignSelf:'flex-end'}}>
                            إغلاق التذكرة
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
