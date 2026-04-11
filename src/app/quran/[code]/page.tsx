'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const QR_PRIMARY = '#16A34A';
const QR_LIGHT = '#22C55E';
const G = '#D4A843';
const DARK = '#060D08';

const toast = (msg: string, color = QR_PRIMARY) => {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '24px', right: '24px', background: color, color: '#fff',
    padding: '12px 20px', borderRadius: '10px', fontWeight: 700, zIndex: '9999',
    fontSize: '14px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif',
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};

export default function QuranCenterPublicPage() {
  const params = useParams();
  const router = useRouter();
  const centerCode = params?.code as string;
  const [center, setCenter] = useState<any>(null);
  const [circles, setCircles] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({ student_name: '', parent_name: '', phone: '', circle_id: '', age: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCenterData();
  }, [centerCode]);

  const fetchCenterData = async () => {
    try {
      const res = await fetch(`/api/quran-center?code=${centerCode}`);
      if (res.ok) {
        const data = await res.json();
        setCenter(data.school);
        setCircles(data.circles || []);
        setAnnouncements(data.announcements || []);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const submitRegistration = async () => {
    if (!registerForm.student_name || !registerForm.phone) {
      toast('يرجى تعبئة الاسم ورقم الهاتف', '#EF4444');
      return;
    }
    setSubmitting(true);
    try {
      // إرسال طلب التسجيل عبر نظام الطلبات
      const res = await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: registerForm.student_name,
          parent_name: registerForm.parent_name,
          phone: registerForm.phone,
          notes: `طلب تسجيل في حلقة التحفيظ. الحلقة: ${registerForm.circle_id}. العمر: ${registerForm.age}`,
          school_code: centerCode,
          type: 'quran_registration',
        }),
      });
      if (res.ok) {
        toast('✅ تم إرسال طلب التسجيل. سنتواصل معك قريباً', QR_LIGHT);
        setShowRegisterModal(false);
        setRegisterForm({ student_name: '', parent_name: '', phone: '', circle_id: '', age: '' });
      } else {
        const d = await res.json();
        toast(d.error || 'فشل الإرسال، حاول مجدداً', '#EF4444');
      }
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: DARK }}>
      <div style={{ color: QR_LIGHT, fontSize: 18, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>جاري التحميل...</div>
    </div>
  );

  if (!center) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: DARK, gap: 16 }}>
      <div style={{ fontSize: 64 }}>🕌</div>
      <div style={{ color: 'white', fontSize: 20, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>مركز التحفيظ غير موجود</div>
      <button onClick={() => router.push('/')} style={{ background: QR_PRIMARY, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
        العودة للرئيسية
      </button>
    </div>
  );

  const TABS = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'circles', label: 'الحلقات' },
    { id: 'about', label: 'عن المركز' },
    { id: 'news', label: 'الأخبار' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: DARK, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
      {/* Navbar */}
      <nav style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(34,197,94,0.2)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {center.logo ? (
              <img src={center.logo} alt={center.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${QR_PRIMARY}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌙</div>
            )}
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{center.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>مركز تحفيظ القرآن الكريم</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowRegisterModal(true)}
              style={{ background: QR_PRIMARY, border: 'none', borderRadius: 8, padding: '8px 18px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
              📝 سجّل ابنك الآن
            </button>
            <Link href="/login" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '8px 14px', color: '#fff', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
              🔑 دخول
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, #0A1A0E 50%, #041208 100%)`, padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌙</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>{center.name}</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto 32px' }}>
            {center.description || 'مركز متخصص في تعليم وتحفيظ القرآن الكريم بأفضل الأساليب التربوية الحديثة'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowRegisterModal(true)}
              style={{ background: QR_PRIMARY, border: 'none', borderRadius: 10, padding: '14px 32px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16, fontFamily: 'inherit' }}>
              📝 سجّل الآن
            </button>
            <button onClick={() => setActiveTab('circles')}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '14px 32px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16, fontFamily: 'inherit' }}>
              🕌 استعرض الحلقات
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ background: 'rgba(34,197,94,0.08)', borderTop: '1px solid rgba(34,197,94,0.15)', borderBottom: '1px solid rgba(34,197,94,0.15)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
          {[
            { label: 'طالب منتسب', value: center.student_count || circles.reduce((sum: number, c: any) => sum + (parseInt(c.enrolled) || 0), 0) || '—' },
            { label: 'حلقة قرآنية', value: circles.length || center.teacher_count || '—' },
            { label: 'محفّظ ومحفّظة', value: center.teacher_count || '—' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: QR_LIGHT }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, background: activeTab === tab.id ? QR_PRIMARY : 'transparent', border: 'none', borderRadius: 10, padding: '10px 16px', color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'inherit', transition: 'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'home' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24 }}>لماذا تختار {center.name}؟</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 40 }}>
              {[
                { icon: '🌟', title: 'منهج متكامل', desc: 'خطط حفظ مدروسة تناسب جميع المستويات من المبتدئ للمتقدم' },
                { icon: '👨‍🏫', title: 'محفّظون متخصصون', desc: 'كوادر تدريسية مؤهلة ومجازة في القرآن الكريم وعلم التجويد' },
                { icon: '📊', title: 'متابعة مستمرة', desc: 'تقارير دورية لولي الأمر لمتابعة تقدم الطالب' },
                { icon: '🏆', title: 'نظام التحفيز', desc: 'نقاط ومكافآت تشجيعية لتعزيز الدافعية عند الطلاب' },
              ].map(f => (
                <div key={f.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 14, padding: '24px 20px' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            {announcements.length > 0 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>📣 آخر الأخبار</h2>
                <div style={{ display: 'grid', gap: 12 }}>
                  {announcements.slice(0, 3).map((ann: any, i: number) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px' }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{ann.title}</div>
                      {ann.content && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{ann.content}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'circles' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24 }}>الحلقات القرآنية</h2>
            {circles.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 60, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🕌</div>
                <div style={{ color: 'rgba(255,255,255,0.4)' }}>لم تُضف الحلقات بعد</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
                {circles.map((c: any) => (
                  <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 14, padding: '24px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{c.name}</div>
                        {c.teacher_name && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>المحفّظ: {c.teacher_name}</div>}
                      </div>
                      <span style={{ background: `${QR_PRIMARY}20`, color: QR_LIGHT, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{c.level}</span>
                    </div>
                    {c.schedule && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>📅 {c.schedule}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 12, color: QR_LIGHT }}>
                        {parseInt(c.enrolled) || 0}/{c.max_students} طالب
                        {parseInt(c.enrolled) >= c.max_students && <span style={{ color: '#EF4444', marginRight: 8 }}>• مكتملة</span>}
                      </div>
                      <button onClick={() => { setRegisterForm({ ...registerForm, circle_id: String(c.id) }); setShowRegisterModal(true); }}
                        disabled={parseInt(c.enrolled) >= c.max_students}
                        style={{ background: parseInt(c.enrolled) >= c.max_students ? 'rgba(255,255,255,0.05)' : QR_PRIMARY, border: 'none', borderRadius: 8, padding: '6px 14px', color: '#fff', cursor: parseInt(c.enrolled) >= c.max_students ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'inherit', opacity: parseInt(c.enrolled) >= c.max_students ? 0.5 : 1 }}>
                        {parseInt(c.enrolled) >= c.max_students ? 'مكتملة' : 'سجّل الآن'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24 }}>عن {center.name}</h2>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 32 }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 2 }}>
                {center.description || 'مركز متخصص في تعليم وتحفيظ القرآن الكريم، يضم نخبة من المحفّظين والمحفّظات المجازين والمؤهلين.'}
              </p>
              {center.phone && (
                <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a href={`tel:${center.phone}`} style={{ background: `${QR_PRIMARY}20`, border: `1px solid ${QR_PRIMARY}40`, borderRadius: 8, padding: '10px 20px', color: QR_LIGHT, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                    📞 {center.phone}
                  </a>
                  {center.email && (
                    <a href={`mailto:${center.email}`} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 20px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                      ✉️ {center.email}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24 }}>الأخبار والإعلانات</h2>
            {announcements.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                لا توجد أخبار حالياً
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {announcements.map((ann: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{ann.title}</div>
                    {ann.content && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{ann.content}</div>}
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>
                      {ann.created_at ? new Date(ann.created_at).toLocaleDateString('ar-SA') : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          {center.name} — مدار بواسطة <a href="/" style={{ color: QR_LIGHT, textDecoration: 'none' }}>منصة متين</a>
          <span style={{ margin: '0 12px' }}>•</span>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>الشروط</Link>
          <span style={{ margin: '0 8px' }}>•</span>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>الخصوصية</Link>
        </div>
      </footer>

      {/* Modal التسجيل */}
      {showRegisterModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0A1A0E', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: 32, width: 480, maxWidth: '95vw', direction: 'rtl' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#fff' }}>📝 التسجيل في المركز</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 24px' }}>ابدأ رحلة الطالب في حفظ كتاب الله</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'اسم الطالب *', key: 'student_name', placeholder: 'الاسم الكامل للطالب' },
                { label: 'اسم ولي الأمر *', key: 'parent_name', placeholder: 'الاسم الكامل لولي الأمر' },
                { label: 'رقم الجوال *', key: 'phone', placeholder: '05XXXXXXXX' },
                { label: 'عمر الطالب', key: 'age', placeholder: 'مثال: 10 سنوات' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{field.label}</label>
                  <input
                    value={registerForm[field.key as keyof typeof registerForm]}
                    onChange={e => setRegisterForm({ ...registerForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>الحلقة المطلوبة</label>
                <select value={registerForm.circle_id} onChange={e => setRegisterForm({ ...registerForm, circle_id: e.target.value })}
                  style={{ width: '100%', background: '#0A1A0E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit' }}>
                  <option value="">أي حلقة متاحة</option>
                  {circles.filter((c: any) => parseInt(c.enrolled) < c.max_students).map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={submitRegistration} disabled={submitting}
                style={{ flex: 1, background: QR_PRIMARY, border: 'none', borderRadius: 8, padding: '13px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15, fontFamily: 'inherit' }}>
                {submitting ? 'جارٍ الإرسال...' : '✅ إرسال طلب التسجيل →'}
              </button>
              <button onClick={() => setShowRegisterModal(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '13px 20px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
