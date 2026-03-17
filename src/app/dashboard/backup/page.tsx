'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string,string> => { try { const t = localStorage.getItem('matin_token'); if(t) return {'Content-Type':'application/json','Authorization':'Bearer '+t}; const u=JSON.parse(localStorage.getItem('matin_user')||'{}'); return {'Content-Type':'application/json','x-user-id':String(u.id||'')}; } catch { return {'Content-Type':'application/json'}; }};
const GOLD='#C9A84C',BG='#0B0B16',CB='rgba(255,255,255,0.04)',BR='rgba(255,255,255,0.08)';
export default function BackupPage() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'backups'|'schedule'>('backups');
  const [schedule, setSchedule] = useState({enabled:true,frequency:'daily',time:'02:00',retention_days:'30'});
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [backupForm, setBackupForm] = useState({ type: 'full', destination: 'local' });
  const [errMsg, setErrMsg] = useState('');
  const [editItem, setEditItem] = useState<any>(null);
  useEffect(()=>{fetchData();},[]);
  const fetchData = async () => { setLoading(true); try { const r=await fetch('/api/backup',{headers:getH()}); const d=await r.json(); setBackups(Array.isArray(d)?d:(d.backups||[])); if(d.schedule) setSchedule(d.schedule); } catch { setBackups([]); } finally { setLoading(false); }};
  const createBackup = async () => { setCreating(true); try { const r=await fetch('/api/backup',{method:'POST',headers:getH(),body:JSON.stringify({type:'manual'})}); if(r.ok){alert('تم إنشاء النسخة الاحتياطية بنجاح');fetchData();} else alert('فشل إنشاء النسخة الاحتياطية'); } catch {} finally { setCreating(false); }};
  const restoreBackup = async (id:number) => { if(!confirm('هل أنت متأكد من الاستعادة؟ سيتم استبدال البيانات الحالية.')) return; try { await fetch('/api/backup?id='+id+'&action=restore',{method:'POST',headers:getH()}); alert('بدأت عملية الاستعادة'); } catch {}};
  const deleteBackup = async (id:number) => { if(!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/backup?id='+id,{method:'DELETE',headers:getH()}); fetchData(); } catch {}};
  const handleCreateBackup = async () => {
    setSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') || '' : '';
      const res = await fetch('/api/backup', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(backupForm) });
      const data = await res.json();
      if (res.ok) { setShowModal(false); }
      else { setErrMsg(data.error || 'فشل إنشاء النسخة'); }
    } catch (e: any) { console.error(e); } finally { setSaving(false); }
  };
  const saveSchedule = async () => { setSavingSchedule(true); try { await fetch('/api/backup',{method:'PUT',headers:getH(),body:JSON.stringify({schedule})}); } catch {} finally { setSavingSchedule(false); }};
  const formatSize = (b:number) => { if(!b) return '—'; if(b<1024) return b+' B'; if(b<1048576) return (b/1024).toFixed(1)+' KB'; return (b/1048576).toFixed(1)+' MB'; };
  const inp: React.CSSProperties = {width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid '+BR,borderRadius:8,padding:'10px 14px',color:'white',fontSize:14,outline:'none',boxSizing:'border-box'};
  const lbl: React.CSSProperties = {display:'block',color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:6};
  const totalSize = backups.reduce((s:number,b:any)=>s+(b.size||0),0);
  return (
    <div style={{minHeight:'100vh',background:BG,padding:'32px 24px',direction:'rtl',fontFamily:'Cairo, sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
        <div><h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0}}>💾 النسخ الاحتياطي</h1><p style={{color:'rgba(255,255,255,0.5)',marginTop:6,fontSize:14}}>إدارة النسخ الاحتياطية واستعادة البيانات</p></div>
        <button onClick={createBackup} disabled={creating} style={{background:GOLD,border:'none',borderRadius:10,padding:'10px 20px',color:'#0B0B16',fontWeight:700,cursor:creating?'not-allowed':'pointer',fontSize:14,opacity:creating?0.7:1}}>
          {creating?'جاري الإنشاء...':'+ نسخة احتياطية الآن'}
        </button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,marginBottom:28}}>
        {[{l:'إجمالي النسخ',v:backups.length,c:GOLD},{l:'الحجم الكلي',v:formatSize(totalSize),c:'#3B82F6'},{l:'آخر نسخة',v:backups[0]?new Date(backups[0].created_at).toLocaleDateString('ar-SA'):'—',c:'#10B981'},{l:'الاحتفاظ',v:schedule.retention_days+' يوم',c:'#8B5CF6'}].map((s,i)=>(
          <div key={i} style={{background:CB,border:'1px solid '+BR,borderRadius:14,padding:'18px 20px'}}>
            <div style={{fontSize:22,fontWeight:800,color:s.c}}>{loading?'...':s.v}</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginBottom:24}}>
        {[{id:'backups',l:'النسخ الاحتياطية'},{id:'schedule',l:'الجدولة التلقائية'}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id as any)} style={{padding:'10px 20px',borderRadius:10,border:'1px solid',borderColor:activeTab===t.id?GOLD:BR,background:activeTab===t.id?`${GOLD}22`:CB,color:activeTab===t.id?GOLD:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:14}}>{t.l}</button>
        ))}
      </div>
      {activeTab==='backups' && (
        <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{borderBottom:'1px solid '+BR}}>{['الاسم','النوع','الحجم','الحالة','التاريخ','إجراءات'].map(h=><th key={h} style={{padding:'14px 16px',textAlign:'right',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:600}}>{h}</th>)}</tr></thead>
              <tbody>
                {loading?<tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>جاري التحميل...</td></tr>
                :backups.length===0?<tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'rgba(255,255,255,0.4)'}}>لا توجد نسخ احتياطية</td></tr>
                :backups.map((b:any,i:number)=>(
                  <tr key={i} style={{borderBottom:'1px solid '+BR}}>
                    <td style={{padding:'14px 16px',color:'white',fontWeight:600,fontSize:14}}>{b.name||'نسخة_'+i}</td>
                    <td style={{padding:'14px 16px'}}><span style={{background:'rgba(59,130,246,0.15)',color:'#3B82F6',padding:'3px 10px',borderRadius:20,fontSize:12}}>{b.type==='auto'?'تلقائية':'يدوية'}</span></td>
                    <td style={{padding:'14px 16px',color:'rgba(255,255,255,0.6)',fontSize:13}}>{formatSize(b.size)}</td>
                    <td style={{padding:'14px 16px'}}><span style={{background:b.status==='completed'?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)',color:b.status==='completed'?'#10B981':'#F59E0B',padding:'3px 10px',borderRadius:20,fontSize:12}}>{b.status==='completed'?'مكتملة':'جاري...'}</span></td>
                    <td style={{padding:'14px 16px',color:'rgba(255,255,255,0.5)',fontSize:13}}>{b.created_at?new Date(b.created_at).toLocaleString('ar-SA'):'—'}</td>
                    <td style={{padding:'14px 16px'}}>
                      <div style={{display:'flex',gap:8}}>
                        <button onClick={()=>restoreBackup(b.id)} style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:8,padding:'6px 12px',color:'#10B981',cursor:'pointer',fontSize:12}}>استعادة</button>
                        <button onClick={()=>deleteBackup(b.id)} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:'6px 12px',color:'#EF4444',cursor:'pointer',fontSize:12}}>حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab==='schedule' && (
        <div style={{background:CB,border:'1px solid '+BR,borderRadius:16,padding:32,maxWidth:500}}>
          <h3 style={{color:'white',fontSize:18,fontWeight:700,marginBottom:24}}>⚙️ إعدادات الجدولة التلقائية</h3>
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(255,255,255,0.03)',borderRadius:12,padding:'16px 20px'}}>
              <div><div style={{color:'white',fontWeight:600}}>تفعيل النسخ التلقائي</div><div style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginTop:4}}>نسخ احتياطي تلقائي دوري</div></div>
              <div onClick={()=>setSchedule({...schedule,enabled:!schedule.enabled})} style={{width:48,height:26,borderRadius:13,background:schedule.enabled?GOLD:'rgba(255,255,255,0.1)',cursor:'pointer',position:'relative',transition:'background 0.3s'}}>
                <div style={{position:'absolute',top:3,right:schedule.enabled?3:undefined,left:schedule.enabled?undefined:3,width:20,height:20,borderRadius:'50%',background:'white',transition:'all 0.3s'}}/>
              </div>
            </div>
            <div><label style={lbl}>التكرار</label>
              <select value={schedule.frequency} onChange={e=>setSchedule({...schedule,frequency:e.target.value})} style={inp}>
                <option value="hourly">كل ساعة</option><option value="daily">يومياً</option><option value="weekly">أسبوعياً</option><option value="monthly">شهرياً</option>
              </select>
            </div>
            <div><label style={lbl}>وقت النسخ</label><input type="time" value={schedule.time} onChange={e=>setSchedule({...schedule,time:e.target.value})} style={inp}/></div>
            <div><label style={lbl}>الاحتفاظ بالنسخ (أيام)</label><input type="number" value={schedule.retention_days} onChange={e=>setSchedule({...schedule,retention_days:e.target.value})} style={inp} min="1" max="365"/></div>
            <button onClick={saveSchedule} disabled={savingSchedule} style={{background:GOLD,border:'none',borderRadius:10,padding:14,color:'#0B0B16',fontWeight:700,cursor:savingSchedule?'not-allowed':'pointer',fontSize:15,opacity:savingSchedule?0.7:1}}>
              {savingSchedule?'جاري الحفظ...':'حفظ الإعدادات'}
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0B0B16', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 420, direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, margin: 0 }}>💾 إنشاء نسخة احتياطية</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>نوع النسخة</label>
              <select value={backupForm.type} onChange={e => setBackupForm({ ...backupForm, type: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13 }}>
                <option value="full">نسخة كاملة</option>
                <option value="partial">نسخة جزئية</option>
                <option value="database">قاعدة البيانات فقط</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>وجهة الحفظ</label>
              <select value={backupForm.destination} onChange={e => setBackupForm({ ...backupForm, destination: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13 }}>
                <option value="local">محلي</option>
                <option value="cloud">سحابي</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleCreateBackup} disabled={saving} style={{ flex: 1, background: saving ? 'rgba(201,162,39,0.5)' : '#C9A227', border: 'none', borderRadius: 10, padding: '12px 0', color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14 }}>{saving ? 'جاري الإنشاء...' : 'إنشاء النسخة'}</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
