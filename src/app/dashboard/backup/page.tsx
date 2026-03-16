'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
export default function BackupPage() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [schedule, setSchedule] = useState({ enabled: true, frequency: 'daily', time: '02:00', retention_days: '30' });
  const [activeTab, setActiveTab] = useState<'backups' | 'schedule'>('backups');
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/backup', { headers: getH() }); const d = await r.json(); setBackups(Array.isArray(d) ? d : (d.backups || [])); if (d.schedule) setSchedule(d.schedule); } catch { setBackups([]); } finally { setLoading(false); } };
  const createBackup = async () => { setCreating(true); try { const r = await fetch('/api/backup', { method: 'POST', headers: getH(), body: JSON.stringify({ type: 'manual' }) }); if (r.ok) { alert('تم إنشاء النسخة الاحتياطية بنجاح'); fetchData(); } else { alert('فشل إنشاء النسخة الاحتياطية'); } } catch { } finally { setCreating(false); } };
  const restoreBackup = async (id: number) => { if (!confirm('هل أنت متأكد من استعادة هذه النسخة؟ سيتم استبدال البيانات الحالية.')) return; try { await fetch('/api/backup?id=' + id + '&action=restore', { method: 'POST', headers: getH() }); alert('تم بدء عملية الاستعادة'); } catch { } };
  const deleteBackup = async (id: number) => { if (!confirm('تأكيد حذف النسخة الاحتياطية؟')) return; try { await fetch('/api/backup?id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
  const saveSchedule = async () => { try { await fetch('/api/backup', { method: 'PUT', headers: getH(), body: JSON.stringify({ schedule }) }); alert('تم حفظ جدولة النسخ الاحتياطي'); } catch { } };
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  const formatSize = (bytes: number) => { if (!bytes) return '—'; if (bytes < 1024) return bytes + ' B'; if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'; return (bytes / 1048576).toFixed(1) + ' MB'; };
  const totalSize = backups.reduce((s: number, b: any) => s + (b.size || 0), 0);
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>💾 النسخ الاحتياطي</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>إدارة نسخ البيانات واستعادتها</p></div>
        <button onClick={createBackup} disabled={creating} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: creating ? 'not-allowed' : 'pointer', fontSize: 14, opacity: creating ? 0.7 : 1 }}>{creating ? '⏳ جاري الإنشاء...' : '+ إنشاء نسخة احتياطية'}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        {[{ l: 'إجمالي النسخ', v: backups.length, c: GOLD, i: '💾' }, { l: 'آخر نسخة', v: backups[0] ? new Date(backups[0].created_at).toLocaleDateString('ar-SA') : '—', c: '#10B981', i: '✅' }, { l: 'الحجم الكلي', v: formatSize(totalSize), c: '#3B82F6', i: '📦' }, { l: 'تلقائية', v: backups.filter((b: any) => b.type === 'auto').length, c: '#8B5CF6', i: '🔄' }].map((s, i) => (
          <div key={i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div><div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: CB, borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {[{ id: 'backups', label: 'النسخ المحفوظة', icon: '💾' }, { id: 'schedule', label: 'جدولة تلقائية', icon: '⏰' }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, background: activeTab === tab.id ? GOLD : 'transparent', color: activeTab === tab.id ? '#0B0B16' : 'rgba(255,255,255,0.6)' }}>{tab.icon} {tab.label}</button>)}
      </div>
      {activeTab === 'backups' && <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden' }}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div> :
          backups.length === 0 ? <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48, marginBottom: 16 }}>💾</div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد نسخ احتياطية</p><button onClick={createBackup} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>إنشاء أول نسخة</button></div> :
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid ' + BR }}>{['اسم النسخة', 'النوع', 'الحجم', 'التاريخ', 'الحالة', 'إجراءات'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>{backups.map((b: any, i: number) => (
              <tr key={b.id || i} style={{ borderBottom: '1px solid ' + BR }}>
                <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{b.name || 'backup_' + (b.id || i)}</td>
                <td style={{ padding: '14px 16px' }}><span style={{ background: b.type === 'auto' ? 'rgba(139,92,246,0.15)' : 'rgba(201,168,76,0.15)', color: b.type === 'auto' ? '#8B5CF6' : GOLD, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{b.type === 'auto' ? '🔄 تلقائية' : '✋ يدوية'}</span></td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{formatSize(b.size)}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{b.created_at ? new Date(b.created_at).toLocaleString('ar-SA') : '—'}</td>
                <td style={{ padding: '14px 16px' }}><span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✅ مكتملة</span></td>
                <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', gap: 8 }}><button onClick={() => restoreBackup(b.id)} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '6px 12px', color: '#3B82F6', cursor: 'pointer', fontSize: 12 }}>استعادة</button><button onClick={() => deleteBackup(b.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button></div></td>
              </tr>
            ))}</tbody>
          </table></div>}
      </div>}
      {activeTab === 'schedule' && <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, padding: 28, maxWidth: 500 }}>
        <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 24 }}>إعدادات الجدولة التلقائية</h3>
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
            <div><div style={{ color: 'white', fontWeight: 600 }}>النسخ التلقائي</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>تفعيل النسخ الاحتياطي التلقائي</div></div>
            <button onClick={() => setSchedule({ ...schedule, enabled: !schedule.enabled })} style={{ width: 50, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', background: schedule.enabled ? GOLD : 'rgba(255,255,255,0.1)', position: 'relative' }}><div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, right: schedule.enabled ? 3 : 25 }} /></button>
          </div>
          <div><label style={lbl}>التكرار</label><select value={schedule.frequency} onChange={e => setSchedule({ ...schedule, frequency: e.target.value })} style={inp}><option value="hourly">كل ساعة</option><option value="daily">يومياً</option><option value="weekly">أسبوعياً</option><option value="monthly">شهرياً</option></select></div>
          <div><label style={lbl}>وقت النسخ</label><input type="time" value={schedule.time} onChange={e => setSchedule({ ...schedule, time: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>مدة الاحتفاظ (أيام)</label><input type="number" value={schedule.retention_days} onChange={e => setSchedule({ ...schedule, retention_days: e.target.value })} style={inp} /></div>
          <button onClick={saveSchedule} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '12px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>حفظ الجدولة</button>
        </div>
      </div>}
    </div>
  );
}
