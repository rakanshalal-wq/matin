'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, ChevronLeft, Clock, User, Shield, LogIn, LogOut, Edit, Trash2, Plus, Eye, Loader2 } from 'lucide-react';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C', DARK = '#06060E', CARD = 'rgba(255,255,255,0.03)', BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)', MUT = 'rgba(238,238,245,0.3)';

const ACTION_ICONS: Record<string, { Ic: any; c: string }> = {
  login: { Ic: LogIn, c: '#10B981' },
  logout: { Ic: LogOut, c: '#64748B' },
  create: { Ic: Plus, c: '#3B82F6' },
  update: { Ic: Edit, c: '#F59E0B' },
  delete: { Ic: Trash2, c: '#EF4444' },
  view: { Ic: Eye, c: '#8B5CF6' },
  default: { Ic: Activity, c: G },
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    loadLogs();
  }, []);

  const loadLogs = async (action?: string) => {
    setLoading(true);
    try {
      const url = action ? `/api/activity-logs?action=${action}` : '/api/activity-logs';
      const r = await fetch(url, { headers: getHeaders() });
      if (r.ok) { const d = await r.json(); setLogs(d.logs || []); }
    } catch {}
    setLoading(false);
  };

  return (
    <div dir="rtl" style={{minHeight:'100vh',background:DARK,color:'#EEEEF5',fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}>
      <div style={{padding:'20px 24px',borderBottom:`1px solid ${BD}`,display:'flex',alignItems:'center',gap:12}}>
        <Link href="/dashboard" style={{color:DIM,textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
          <ChevronLeft size={18} /> الرئيسية
        </Link>
        <div style={{flex:1}} />
        <Shield size={20} color={G} />
        <span style={{color:G,fontWeight:700}}>سجل النشاطات</span>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'30px 24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
          <h1 style={{fontSize:22,fontWeight:700,color:'#fff',margin:0}}>سجل النشاطات</h1>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {[{v:'',l:'الكل'},{v:'login',l:'دخول'},{v:'create',l:'إنشاء'},{v:'update',l:'تعديل'},{v:'delete',l:'حذف'}].map(f => (
              <button key={f.v} onClick={() => { setFilter(f.v); loadLogs(f.v || undefined); }} style={{padding:'6px 12px',borderRadius:8,border:`1px solid ${filter===f.v?G:BD}`,background:filter===f.v?`${G}15`:'transparent',color:filter===f.v?G:MUT,cursor:'pointer',fontFamily:'inherit',fontSize:12}}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:40,color:DIM}}><Loader2 size={32} color={G} /><div style={{marginTop:12}}>جارٍ التحميل...</div></div>
        ) : logs.length === 0 ? (
          <div style={{textAlign:'center',padding:60,color:MUT}}><Activity size={48} strokeWidth={1} /><div style={{marginTop:12}}>لا توجد نشاطات مسجلة</div></div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {logs.map(log => {
              const actionType = Object.keys(ACTION_ICONS).find(k => log.action?.includes(k)) || 'default';
              const { Ic, c } = ACTION_ICONS[actionType];
              return (
                <div key={log.id} style={{background:CARD,border:`1px solid ${BD}`,borderRadius:10,padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:36,height:36,borderRadius:8,background:`${c}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Ic size={18} color={c} />
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                      <span style={{fontWeight:600,color:'#fff',fontSize:14}}>{log.action}</span>
                      {log.user_name && <span style={{fontSize:12,color:MUT}}>— {log.user_name}</span>}
                    </div>
                    {log.details && <div style={{fontSize:12,color:DIM,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.details}</div>}
                  </div>
                  <div style={{textAlign:'left',flexShrink:0}}>
                    <div style={{fontSize:11,color:MUT}}>{new Date(log.created_at).toLocaleString('ar-SA')}</div>
                    {log.ip_address && <div style={{fontSize:10,color:'rgba(255,255,255,0.15)'}}>{log.ip_address}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
