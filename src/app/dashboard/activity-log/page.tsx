'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
const ACTION_ICONS: Record<string, string> = { create: '➕', update: '✏️', delete: '🗑️', login: '🔐', logout: '🚪', view: '👁️', export: '📤', import: '📥', approve: '✅', reject: '❌' };
const ACTION_COLORS: Record<string, string> = { create: '#10B981', update: '#3B82F6', delete: '#EF4444', login: GOLD, logout: '#9CA3AF', view: '#8B5CF6', export: '#F59E0B', import: '#06B6D4', approve: '#10B981', reject: '#EF4444' };
export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/activity-log', { headers: getH() }); const d = await r.json(); setLogs(Array.isArray(d) ? d : (d.logs || [])); } catch { setLogs([]); } finally { setLoading(false); } };
  const filtered = logs.filter((r: any) => (!search || r.user_name?.includes(search) || r.description?.includes(search) || r.resource?.includes(search)) && (!filterAction || r.action === filterAction) && (!filterRole || r.user_role === filterRole));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none' };
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ marginBottom: 32 }}><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>📋 سجل الأنشطة</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>تتبع جميع العمليات والأحداث في النظام</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 28 }}>
        {[{ l: 'إجمالي الأحداث', v: logs.length, c: GOLD, i: '📋' }, { l: 'اليوم', v: logs.filter((r: any) => r.created_at?.startsWith(new Date().toISOString().split('T')[0])).length, c: '#10B981', i: '📅' }, { l: 'عمليات الحذف', v: logs.filter((r: any) => r.action === 'delete').length, c: '#EF4444', i: '🗑️' }, { l: 'تسجيلات دخول', v: logs.filter((r: any) => r.action === 'login').length, c: '#3B82F6', i: '🔐' }].map((s, i) => (
          <div key={i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div><div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="🔍 بحث..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ ...inp, width: 240 }} />
        <select value={filterAction} onChange={e => { setFilterAction(e.target.value); setPage(1); }} style={{ ...inp, width: 140 }}><option value="">جميع الأحداث</option>{Object.keys(ACTION_ICONS).map(a => <option key={a} value={a}>{ACTION_ICONS[a]} {a}</option>)}</select>
        <select value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(1); }} style={{ ...inp, width: 140 }}><option value="">جميع الأدوار</option>{['admin','teacher','student','parent','driver'].map(r => <option key={r} value={r}>{r}</option>)}</select>
        <button onClick={fetchData} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 16px', color: 'white', cursor: 'pointer', fontSize: 14 }}>🔄 تحديث</button>
      </div>
      <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden' }}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div> :
          paginated.length === 0 ? <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48, marginBottom: 16 }}>📋</div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد أحداث</p></div> :
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid ' + BR }}>{['الحدث', 'المستخدم', 'الدور', 'المورد', 'التفاصيل', 'الوقت'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>{paginated.map((r: any, i: number) => (
              <tr key={r.id || i} style={{ borderBottom: '1px solid ' + BR }}>
                <td style={{ padding: '14px 16px' }}><span style={{ background: `${ACTION_COLORS[r.action] || '#9CA3AF'}22`, color: ACTION_COLORS[r.action] || '#9CA3AF', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{ACTION_ICONS[r.action] || '•'} {r.action}</span></td>
                <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{r.user_name || r.user_id || '—'}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.user_role || '—'}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{r.resource || '—'}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13, maxWidth: 200 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description || '—'}</div></td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)', fontSize: 12, whiteSpace: 'nowrap' }}>{r.created_at ? new Date(r.created_at).toLocaleString('ar-SA') : '—'}</td>
              </tr>
            ))}</tbody>
          </table></div>}
      </div>
      {totalPages > 1 && <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid ' + BR, background: CB, color: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>السابق</button>
        <span style={{ padding: '8px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>صفحة {page} من {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid ' + BR, background: CB, color: 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>التالي</button>
      </div>}
    </div>
  );
}
