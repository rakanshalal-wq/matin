'use client';
import { AlertTriangle, BarChart3, CheckCircle, Download, FileText, Medal, TrendingUp, Trophy, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

const GOLD = '#C9A84C';
const BG = '#0B0B16';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

const getGradeColor = (score: number) => {
  if (score >= 90) return '#10B981';
  if (score >= 80) return '#3B82F6';
  if (score >= 70) return '#F59E0B';
  if (score >= 60) return '#F97316';
  return '#EF4444';
};

const getGradeLetter = (score: number) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

export default function GradesPage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    student_name: '', class_name: '', subject: '',
    semester: 'الفصل الاول', exam_type: 'نهائي',
    score: '', max_score: '100', notes: '',
  });

  useEffect(() => { fetchGrades(); }, [filterClass, filterSubject, filterSemester]);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterClass) params.set('class', filterClass);
      if (filterSubject) params.set('subject', filterSubject);
      if (filterSemester) params.set('semester', filterSemester);
      const res = await fetch('/api/grades?' + params.toString(), { headers: getHeaders() });
      const data = await res.json();
      setGrades(Array.isArray(data) ? data : []);
    } catch { setGrades([]); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.student_name || !form.subject || !form.score) return alert('ادخل البيانات المطلوبة');
    setSaving(true);
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? '/api/grades?id=' + editItem.id : '/api/grades';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
      if (res.ok) {
        setShowModal(false); setEditItem(null);
        setForm({ student_name: '', class_name: '', subject: '', semester: 'الفصل الاول', exam_type: 'نهائي', score: '', max_score: '100', notes: '' });
        fetchGrades();
      } else { const e = await res.json(); alert(e.error || 'فشل الحفظ'); }
    } catch { } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل انت متاكد من الحذف؟')) return;
    try { await fetch('/api/grades?id=' + id, { method: 'DELETE', headers: getHeaders() }); fetchGrades(); } catch { }
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({ student_name: item.student_name || '', class_name: item.class_name || '', subject: item.subject || '', semester: item.semester || 'الفصل الاول', exam_type: item.exam_type || 'نهائي', score: String(item.score || ''), max_score: String(item.max_score || '100'), notes: item.notes || '' });
    setShowModal(true);
  };

  const exportCSV = () => {
    const headers = ['الطالب', 'الفصل', 'المادة', 'الفصل الدراسي', 'نوع الاختبار', 'الدرجة', 'الدرجة الكاملة', 'النسبة', 'التقدير'];
    const rows = filtered.map((r: any) => {
      const pct = Math.round((r.score / r.max_score) * 100);
      return [r.student_name, r.class_name, r.subject, r.semester, r.exam_type, r.score, r.max_score, pct + '%', getGradeLetter(pct)];
    });
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'الدرجات.csv'; a.click();
  };

  const filtered = grades.filter((r: any) => {
    return !searchTerm || r.student_name?.includes(searchTerm) || r.subject?.includes(searchTerm) || r.class_name?.includes(searchTerm);
  });

  const avgScore = filtered.length ? Math.round(filtered.reduce((s: number, r: any) => s + (r.score / r.max_score) * 100, 0) / filtered.length) : 0;
  const topStudents = [...filtered].sort((a: any, b: any) => (b.score / b.max_score) - (a.score / a.max_score)).slice(0, 3);
  const failCount = filtered.filter((r: any) => (r.score / r.max_score) * 100 < 60).length;

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BORDER, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>BarChart3 الدرجات والتقييم</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>متابعة درجات الطلاب وتحليل الاداء الاكاديمي</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={exportCSV} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BORDER, borderRadius: 10, padding: '10px 18px', color: 'white', cursor: 'pointer', fontSize: 14 }}>Download تصدير كشف الدرجات</button>
          <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ اضافة درجة</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'اجمالي السجلات', value: filtered.length, color: GOLD, icon: "ICON_FileText" },
          { label: 'متوسط الدرجات', value: avgScore + '%', color: getGradeColor(avgScore), icon: "ICON_TrendingUp" },
          { label: 'الراسبون', value: failCount, color: '#EF4444', icon: 'AlertTriangle️' },
          { label: 'الناجحون', value: filtered.length - failCount, color: '#10B981', icon: "ICON_CheckCircle" },
        ].map((s, i) => (
          <div key={i} style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}><IconRenderer name={s.icon} /></div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {topStudents.length > 0 && (
        <div style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <h3 style={{ color: GOLD, fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>Trophy المتفوقون</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {topStudents.map((s: any, i: number) => {
              const pct = Math.round((s.score / s.max_score) * 100);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 16px' }}>
                  <span style={{ fontSize: 20 }}>{["ICON_Medal", "ICON_Medal", "ICON_Medal"][i]}</span>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{s.student_name}</div>
                    <div style={{ color: getGradeColor(pct), fontSize: 13 }}>{pct}% — {s.subject}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="بحث عن طالب او مادة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inp, width: 260 }} />
        <input placeholder="الفصل..." value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{ ...inp, width: 160 }} />
        <input placeholder="المادة..." value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{ ...inp, width: 160 }} />
        <select value={filterSemester} onChange={e => setFilterSemester(e.target.value)} style={{ ...inp, width: 180 }}>
          <option value="">جميع الفصول</option>
          <option value="الفصل الاول">الفصل الاول</option>
          <option value="الفصل الثاني">الفصل الثاني</option>
          <option value="الفصل الثالث">الفصل الثالث</option>
        </select>
      </div>

      <div style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>BarChart3</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>لا توجد درجات مسجلة</p>
            <button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ اضافة اول درجة</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid ' + BORDER }}>
                  {['الطالب', 'الفصل', 'المادة', 'الفصل الدراسي', 'نوع الاختبار', 'الدرجة', 'النسبة', 'التقدير', 'اجراءات'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any, i: number) => {
                  const pct = Math.round((r.score / r.max_score) * 100);
                  const color = getGradeColor(pct);
                  return (
                    <tr key={r.id || i} style={{ borderBottom: '1px solid ' + BORDER }}>
                      <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{r.student_name}</td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.class_name}</td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.subject}</td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{r.semester}</td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{r.exam_type}</td>
                      <td style={{ padding: '14px 16px', color: 'white', fontWeight: 700 }}>{r.score}/{r.max_score}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 60, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 3 }} />
                          </div>
                          <span style={{ color, fontSize: 13, fontWeight: 600 }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: color + '22', color, padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>{getGradeLetter(pct)}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(r)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '6px 12px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button>
                          <button onClick={() => handleDelete(r.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#12121F', border: '1px solid ' + BORDER, borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل الدرجة' : 'اضافة درجة جديدة'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>X</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>اسم الطالب *</label>
                <input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} placeholder="ادخل اسم الطالب" style={inp} />
              </div>
              <div>
                <label style={lbl}>الفصل</label>
                <input value={form.class_name} onChange={e => setForm({ ...form, class_name: e.target.value })} placeholder="مثال: الاول أ" style={inp} />
              </div>
              <div>
                <label style={lbl}>المادة *</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="مثال: الرياضيات" style={inp} />
              </div>
              <div>
                <label style={lbl}>الفصل الدراسي</label>
                <select value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} style={inp}>
                  <option>الفصل الاول</option>
                  <option>الفصل الثاني</option>
                  <option>الفصل الثالث</option>
                </select>
              </div>
              <div>
                <label style={lbl}>نوع الاختبار</label>
                <select value={form.exam_type} onChange={e => setForm({ ...form, exam_type: e.target.value })} style={inp}>
                  <option>نهائي</option>
                  <option>منتصف الفصل</option>
                  <option>اختبار قصير</option>
                  <option>واجب</option>
                  <option>مشاركة</option>
                </select>
              </div>
              <div>
                <label style={lbl}>الدرجة *</label>
                <input type="number" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} placeholder="0" min="0" style={inp} />
              </div>
              <div>
                <label style={lbl}>الدرجة الكاملة</label>
                <input type="number" value={form.max_score} onChange={e => setForm({ ...form, max_score: e.target.value })} placeholder="100" min="1" style={inp} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>ملاحظات</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="اي ملاحظات..." style={{ ...inp, height: 70, resize: 'vertical' as const }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'اضافة الدرجة'}
              </button>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BORDER, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>الغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
