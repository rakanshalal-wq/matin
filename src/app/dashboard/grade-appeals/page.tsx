'use client';
import { useState, useEffect } from 'react';

export default function GradeAppealsPage() {
  const [appeals, setAppeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppeals();
  }, []);

  const fetchAppeals = async () => {
    try {
      const res = await fetch('/api/grade-appeals');
      const data = await res.json();
      setAppeals(data.appeals || []);
    } catch {}
    setLoading(false);
  };

  const handleDecision = async (id: number, decision: 'approved' | 'rejected') => {
    await fetch('/api/grade-appeals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, decision }),
    });
    fetchAppeals();
  };

  const statusColor: any = { pending: '#F59E0B', approved: '#10B981', rejected: '#EF4444', under_review: '#3B82F6' };
  const statusLabel: any = { pending: 'قيد الانتظار', approved: 'تمت الموافقة', rejected: 'مرفوض', under_review: 'قيد المراجعة' };

  return (
    <div style={{ padding: 24, background: '#06060E', minHeight: '100vh', fontFamily: 'Arial' }} dir="rtl">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#C9A227', fontSize: 24, fontWeight: 800, margin: 0 }}>⚖️ الاعتراض على الدرجات</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>مراجعة طلبات الاعتراض — الأستاذ لا يعرف هوية الطالب</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الطلبات', value: appeals.length, color: '#C9A227' },
          { label: 'قيد الانتظار', value: appeals.filter(a => a.status === 'pending').length, color: '#F59E0B' },
          { label: 'تمت الموافقة', value: appeals.filter(a => a.status === 'approved').length, color: '#10B981' },
          { label: 'مرفوضة', value: appeals.filter(a => a.status === 'rejected').length, color: '#EF4444' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ color: stat.color, fontSize: 28, fontWeight: 800 }}>{stat.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ color: 'white', fontWeight: 700 }}>طلبات الاعتراض</span>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div>
        ) : appeals.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚖️</div>
            <div>لا توجد طلبات اعتراض</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['المادة', 'الاختبار', 'الدرجة', 'السبب', 'الرسوم', 'الحالة', 'إجراء'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appeals.map((appeal, i) => (
                <tr key={appeal.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '14px 16px', color: 'white', fontSize: 14 }}>{appeal.subject_name || '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{appeal.exam_title || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>
                      {appeal.current_marks} / {appeal.max_marks}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{appeal.reason || '—'}</td>
                  <td style={{ padding: '14px 16px', color: '#10B981', fontSize: 14, fontWeight: 600 }}>{appeal.fee} ر.س</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: `${statusColor[appeal.status]}20`, color: statusColor[appeal.status], padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {statusLabel[appeal.status] || appeal.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {appeal.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleDecision(appeal.id, 'approved')}
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>
                          ✅ قبول
                        </button>
                        <button onClick={() => handleDecision(appeal.id, 'rejected')}
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>
                          ❌ رفض
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>تم البت</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
