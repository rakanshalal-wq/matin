'use client';
const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('school_overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setUser(u);
    fetchReport('school_overview');
  }, []);

  const fetchReport = async (type: string) => {
    setLoading(true);
    setActiveReport(type);
    try {
      const res = await fetch(`/api/reports?type=${type}`, { headers: getHeaders() });
      const result = await res.json();
      setData(result);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const reportTypes = [
    { id: 'school_overview', label: '📊 نظرة عامة', desc: 'إحصائيات شاملة للمدرسة' },
    { id: 'student_performance', label: '🎓 أداء الطلاب', desc: 'متوسط الدرجات والأداء الأكاديمي' },
    { id: 'attendance_report', label: '✋ تقرير الحضور', desc: 'إحصائيات الحضور والغياب' },
    { id: 'financial_report', label: '💰 التقرير المالي', desc: 'الإيرادات والمدفوعات' },
  ];

  const renderOverview = () => {
    if (!data || typeof data !== 'object') return null;
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'الطلاب', value: data.students || 0, icon: '🎓', color: '#3B82F6' },
            { label: 'المعلمين', value: data.teachers || 0, icon: '👨‍🏫', color: '#10B981' },
            { label: 'الفصول', value: data.classes || 0, icon: '🏫', color: '#C9A227' },
            { label: 'الاختبارات', value: data.exams || 0, icon: '📝', color: '#8B5CF6' },
            { label: 'المحاضرات', value: data.lectures || 0, icon: '📚', color: '#F59E0B' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ color: s.color, fontSize: 28, fontWeight: 800 }}>{(s.value || 0).toLocaleString()}</div>
              <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {data.attendance && data.attendance.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
            <h3 style={{ color: '#C9A227', fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>✋ إحصائيات الحضور</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {data.attendance.map((a: any, i: number) => {
                const isPresent = a.status === 'PRESENT' || a.status === 'present';
                const isAbsent = a.status === 'ABSENT' || a.status === 'absent';
                const color = isPresent ? '#10B981' : isAbsent ? '#EF4444' : '#F59E0B';
                const bg = isPresent ? 'rgba(16,185,129,0.1)' : isAbsent ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)';
                const label = isPresent ? 'حاضر' : isAbsent ? 'غائب' : a.status === 'LATE' ? 'متأخر' : a.status;
                return (
                  <div key={i} style={{ padding: '12px 20px', borderRadius: 10, background: bg, border: `1px solid ${color}30`, textAlign: 'center' }}>
                    <div style={{ color, fontSize: 24, fontWeight: 800 }}>{a.count}</div>
                    <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStudentPerformance = () => {
    if (!data || !Array.isArray(data)) return <div style={{ color: '#9CA3AF', textAlign: 'center', padding: 40 }}>لا توجد بيانات أداء</div>;
    return (
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(201,162,39,0.08)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>الطالب</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>متوسط الدرجات</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الاختبارات</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>أعلى درجة</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>أدنى درجة</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 50).map((s: any) => {
              const avg = parseFloat(s.avg_percentage || 0);
              const color = avg >= 90 ? '#10B981' : avg >= 70 ? '#3B82F6' : avg >= 50 ? '#F59E0B' : '#EF4444';
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 16px', color: 'white', fontSize: 14, fontWeight: 600 }}>{s.student_name || '-'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ color, fontWeight: 700, fontSize: 16 }}>{avg ? `${avg}%` : '-'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#9CA3AF' }}>{s.exams_taken || 0}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#10B981', fontWeight: 600 }}>{s.highest_grade || '-'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#EF4444', fontWeight: 600 }}>{s.lowest_grade || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAttendanceReport = () => {
    if (!data || !Array.isArray(data)) return <div style={{ color: '#9CA3AF', textAlign: 'center', padding: 40 }}>لا توجد بيانات حضور</div>;
    return (
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(201,162,39,0.08)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>الطالب</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>أيام الحضور</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>أيام الغياب</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>التأخر</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الإجمالي</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>نسبة الحضور</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 50).map((s: any) => {
              const total = parseInt(s.total_days || 0);
              const present = parseInt(s.present_days || 0);
              const pct = total > 0 ? Math.round((present / total) * 100) : 0;
              const color = pct >= 90 ? '#10B981' : pct >= 75 ? '#F59E0B' : '#EF4444';
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 16px', color: 'white', fontSize: 14, fontWeight: 600 }}>{s.student_name || '-'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#10B981', fontWeight: 600 }}>{s.present_days || 0}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#EF4444', fontWeight: 600 }}>{s.absent_days || 0}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#F59E0B' }}>{s.late_days || 0}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: '#9CA3AF' }}>{total}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ color, fontWeight: 700 }}>{pct}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFinancial = () => {
    if (!data || typeof data !== 'object') return <div style={{ color: '#9CA3AF', textAlign: 'center', padding: 40 }}>لا توجد بيانات مالية</div>;
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'إجمالي الإيرادات', value: `${(data.total_revenue || 0).toLocaleString()} ر.س`, icon: '💰', color: '#10B981' },
            { label: 'المدفوعات المكتملة', value: data.paid_count || 0, icon: '✅', color: '#3B82F6' },
            { label: 'المدفوعات المعلقة', value: data.pending_count || 0, icon: '⏳', color: '#F59E0B' },
            { label: 'المشتركون النشطون', value: data.active_subscriptions || 0, icon: '🔑', color: '#8B5CF6' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {data.recent_payments && data.recent_payments.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ color: '#C9A227', fontSize: 16, fontWeight: 700, margin: 0 }}>🕐 آخر المدفوعات</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(201,162,39,0.05)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'right', color: '#C9A227', fontWeight: 700, fontSize: 13 }}>المستخدم</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700, fontSize: 13 }}>المبلغ</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700, fontSize: 13 }}>الحالة</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700, fontSize: 13 }}>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_payments.map((p: any) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '10px 16px', color: 'white', fontSize: 13 }}>{p.user_name || `مستخدم #${p.user_id}`}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>{parseFloat(p.amount || 0).toLocaleString()} ر.س</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: p.status === 'paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: p.status === 'paid' ? '#10B981' : '#F59E0B' }}>
                        {p.status === 'paid' ? '✅ مدفوع' : '⏳ معلق'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>{p.created_at ? new Date(p.created_at).toLocaleDateString('ar-SA') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#C9A227', margin: 0 }}>📈 التقارير والإحصائيات</h1>
        <p style={{ color: '#9CA3AF', fontSize: 14, margin: '6px 0 0' }}>تقارير شاملة من بيانات المنصة الحقيقية</p>
      </div>

      {/* أنواع التقارير */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {reportTypes.map(rt => (
          <button key={rt.id} onClick={() => fetchReport(rt.id)} style={{
            padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
            background: activeReport === rt.id ? 'linear-gradient(135deg, #C9A227, #E8C547)' : 'rgba(255,255,255,0.05)',
            color: activeReport === rt.id ? '#0D1B2A' : 'rgba(255,255,255,0.7)',
            fontFamily: 'IBM Plex Sans Arabic, sans-serif',
            transition: 'all 0.2s',
          }}>{rt.label}</button>
        ))}
      </div>

      {/* المحتوى */}
      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#C9A227', fontSize: 18 }}>⏳ جاري تحميل التقرير...</div>
      ) : (
        <div>
          {activeReport === 'school_overview' && renderOverview()}
          {activeReport === 'student_performance' && renderStudentPerformance()}
          {activeReport === 'attendance_report' && renderAttendanceReport()}
          {activeReport === 'financial_report' && renderFinancial()}
        </div>
      )}
    </div>
  );
}
