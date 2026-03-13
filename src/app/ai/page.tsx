'use client';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════
   صفحة الذكاء الاصطناعي — وفق الدستور السيادي 3.0
   ركائز الابتكار الخمس:
   1. AI Career Pathing
   2. Matin Coin
   3. AI Well-being
   4. Skills Passport
   5. المحفظة التعليمية الموحدة
═══════════════════════════════════════════════════════ */

const PILLARS = [
  {
    num: '01',
    title: 'AI Career Pathing',
    subtitle: 'التوجيه المهني الذكي',
    desc: 'يحلل مهارات الطالب وأنماط تعلمه ويقترح مسارات وظيفية مناسبة بناءً على بيانات حقيقية من داخل المنصة.',
    details: [
      'يتتبع المواد التي يتفاعل معها الطالب أكثر',
      'يحلل وقت الاستجابة في الاختبارات والأخطاء المتكررة',
      'يصدر تقريراً دورياً لولي الأمر عن ميول الطالب',
      'يقترح مسارات مهنية مبنية على بيانات حقيقية',
      'يضيف السلوك لـ Skills Passport كمؤشرات مهارية',
    ],
    color: '#C9A84C',
    icon: '🎯',
  },
  {
    num: '02',
    title: 'Matin Coin',
    subtitle: 'الاقتصاد الداخلي',
    desc: 'عملة داخلية تحفز الطلاب على الإنجاز والمشاركة — تُكسب بالحضور والدرجات والمشاركة، وتُصرف في المتجر الداخلي.',
    details: [
      'تُكسب بالحضور المنتظم والدرجات المتميزة',
      'تُكسب بالمشاركة في الأنشطة والمسابقات',
      'تُصرف في متجر المكافآت الداخلي',
      'تُحفز المنافسة الإيجابية بين الطلاب',
      'يتحكم فيها مدير المؤسسة بالكامل',
    ],
    color: '#F59E0B',
    icon: '🪙',
  },
  {
    num: '03',
    title: 'AI Well-being',
    subtitle: 'مراقبة الصحة النفسية',
    desc: 'مراقبة ذكية وسرية للصحة النفسية للطلاب — يكتشف مبكراً علامات الضغط والقلق ويرفع تنبيهات للمرشد الطلابي.',
    details: [
      'يراقب أنماط التفاعل والنشاط بشكل سري',
      'يكتشف التغيرات المفاجئة في الأداء والحضور',
      'يرفع تنبيهات مبكرة للمرشد الطلابي',
      'لا يشارك البيانات إلا مع المختص المعتمد',
      'يحترم خصوصية الطالب بالكامل',
    ],
    color: '#10B981',
    icon: '💚',
  },
  {
    num: '04',
    title: 'Skills Passport',
    subtitle: 'جواز سفر المهارات',
    desc: 'ملف مهاري شامل يتابع الطالب مدى الحياة — يوثق كل مهارة اكتسبها من الروضة حتى سوق العمل.',
    details: [
      'يوثق المهارات الأكاديمية والعملية والسلوكية',
      'يُحدَّث تلقائياً مع كل إنجاز أو شهادة',
      'قابل للمشاركة مع أصحاب العمل والجامعات',
      'يُنقل مع الطالب بين المؤسسات التعليمية',
      'مبني على معايير دولية معتمدة',
    ],
    color: '#3B82F6',
    icon: '📘',
  },
  {
    num: '05',
    title: 'المحفظة التعليمية الموحدة',
    subtitle: 'ملف الطالب الشامل',
    desc: 'ملف شامل للطالب ينقل معه بين المؤسسات التعليمية — يحتوي على كل تاريخه الأكاديمي والمهاري.',
    details: [
      'يحتوي على كل الدرجات والشهادات والإنجازات',
      'يُنقل بين المؤسسات بموافقة الطالب أو وليه',
      'مشفر ومحمي بأعلى معايير الأمان',
      'يُقبل رسمياً من المؤسسات المشتركة في متين',
      'يدعم التكامل مع نور ووزارة التعليم',
    ],
    color: '#8B5CF6',
    icon: '🗂️',
  },
];

const AI_ASSISTANTS = [
  { user: 'الطالب', desc: 'تلخيص المحاضرات، إجابة أسئلة المادة، تذكير بالواجبات والاختبارات القادمة' },
  { user: 'المعلم', desc: 'ملخص أداء فصله، تنبيهات الطلاب المتعثرين، اقتراحات تحسين الجدول' },
  { user: 'مدير المؤسسة', desc: 'ملخص أداء المؤسسة، تنبيهات المشاكل قبل تفاقمها، تقارير سريعة' },
  { user: 'ولي الأمر', desc: 'ملخص درجات ابنه، تنبيهات مبكرة بالتعثر، اقتراحات دعم' },
  { user: 'مالك المنصة', desc: 'ملخص صحة المنصة، تنبيهات شذوذ، توقعات الإيرادات' },
];

const s: Record<string, React.CSSProperties> = {
  wrap: { background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', paddingTop: 64 },
  nav: { position: 'fixed', top: 0, right: 0, left: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 40, background: 'rgba(6,6,14,0.92)', borderBottom: '1px solid rgba(201,168,76,0.2)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#EEEEF5', fontSize: 19, fontWeight: 800 },
  logoIcon: { width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#C9A84C,#E2C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#000' },
  navLinks: { display: 'flex', gap: 32, listStyle: 'none', flex: 1 },
  navLink: { color: 'rgba(238,238,245,0.65)', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
  navEnd: { display: 'flex', gap: 8, alignItems: 'center', marginRight: 'auto' },
  btnGhost: { padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(238,238,245,0.65)', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' },
  btnPrimary: { padding: '8px 20px', borderRadius: 9, background: '#C9A84C', color: '#000', fontSize: 13.5, fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none' },
  hero: { padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  heroGlow: { position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse,rgba(139,92,246,0.12) 0%,transparent 60%)', pointerEvents: 'none' },
  sLabel: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20, justifyContent: 'center' },
  h1: { fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: '#EEEEF5', margin: 0 },
  heroSub: { fontSize: 18, color: 'rgba(238,238,245,0.65)', maxWidth: 600, margin: '20px auto 0', lineHeight: 1.8 },
  section: { padding: '60px 24px', maxWidth: 1200, margin: '0 auto' },
  sectionTitle: { fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5', marginBottom: 12 },
  sectionSub: { fontSize: 16, color: 'rgba(238,238,245,0.65)', marginBottom: 40, lineHeight: 1.7 },
  divider: { width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' },
  footer: { borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, maxWidth: 1280, margin: '0 auto' },
  footerCopy: { fontSize: 13, color: 'rgba(238,238,245,0.35)' },
  footerLinks: { display: 'flex', gap: 24 },
  footerLink: { fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' },
};

export default function AIPage() {
  return (
    <div style={s.wrap}>
      {/* NAV */}
      <nav style={s.nav}>
        <Link href="/" style={s.logo}>
          <div style={s.logoIcon}>م</div>
          متين
        </Link>
        <ul style={s.navLinks}>
          <li><Link href="/features" style={s.navLink}>المميزات</Link></li>
          <li><Link href="/pricing" style={s.navLink}>الأسعار</Link></li>
          <li><Link href="/ai" style={{ ...s.navLink, color: '#C9A84C' }}>الذكاء الاصطناعي</Link></li>
          <li><Link href="/about" style={s.navLink}>عن متين</Link></li>
        </ul>
        <div style={s.navEnd}>
          <Link href="/login" style={s.btnGhost}>تسجيل الدخول</Link>
          <Link href="/register" style={s.btnPrimary}>ابدأ مجاناً</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.sLabel}>ركائز الابتكار الخمس</div>
        <h1 style={s.h1}>
          الذكاء الاصطناعي في <span style={{ background: 'linear-gradient(90deg,#8B5CF6,#C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>متين</span>
        </h1>
        <p style={s.heroSub}>
          خمس ركائز ابتكارية تجعل متين أكثر من مجرد نظام إدارة — منصة ذكاء تعليمي حقيقي.
        </p>

        {/* PILLARS NUMBERS */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 48 }}>
          {PILLARS.map((p) => (
            <div key={p.num} style={{ background: '#0B0B16', border: `1px solid ${p.color}30`, borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS DETAIL */}
      <section style={s.section}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {PILLARS.map((pillar, i) => (
            <div key={pillar.num} style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 2fr' : '2fr 1fr', gap: 32, background: '#0B0B16', border: `1px solid ${pillar.color}20`, borderRadius: 20, padding: 40, alignItems: 'center' }}>
              {i % 2 === 0 ? (
                <>
                  {/* LEFT: NUMBER + ICON */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 80, marginBottom: 16 }}>{pillar.icon}</div>
                    <div style={{ fontSize: 64, fontWeight: 900, color: `${pillar.color}20`, letterSpacing: -4, lineHeight: 1 }}>{pillar.num}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: pillar.color, textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 }}>{pillar.subtitle}</div>
                  </div>
                  {/* RIGHT: CONTENT */}
                  <div>
                    <h3 style={{ fontSize: 28, fontWeight: 800, color: pillar.color, marginBottom: 12 }}>{pillar.title}</h3>
                    <p style={{ fontSize: 16, color: 'rgba(238,238,245,0.8)', lineHeight: 1.8, marginBottom: 24 }}>{pillar.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {pillar.details.map((d) => (
                        <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(238,238,245,0.7)' }}>
                          <span style={{ color: pillar.color, fontSize: 16 }}>←</span>
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* LEFT: CONTENT */}
                  <div>
                    <h3 style={{ fontSize: 28, fontWeight: 800, color: pillar.color, marginBottom: 12 }}>{pillar.title}</h3>
                    <p style={{ fontSize: 16, color: 'rgba(238,238,245,0.8)', lineHeight: 1.8, marginBottom: 24 }}>{pillar.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {pillar.details.map((d) => (
                        <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(238,238,245,0.7)' }}>
                          <span style={{ color: pillar.color, fontSize: 16 }}>←</span>
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* RIGHT: NUMBER + ICON */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 80, marginBottom: 16 }}>{pillar.icon}</div>
                    <div style={{ fontSize: 64, fontWeight: 900, color: `${pillar.color}20`, letterSpacing: -4, lineHeight: 1 }}>{pillar.num}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: pillar.color, textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 }}>{pillar.subtitle}</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* AI ASSISTANT */}
      <section style={s.section}>
        <div style={s.sLabel}>المساعد الذكي</div>
        <h2 style={s.sectionTitle}>
          مساعد <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span> لكل مستخدم
        </h2>
        <p style={s.sectionSub}>
          كل مستخدم في متين لديه مساعد AI خاص به يعرف سياقه وتاريخه. المساعد لا يتخذ قرارات — يقدم معلومات وتنبيهات فقط. القرار دائماً بيد الإنسان.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {AI_ASSISTANTS.map((a) => (
            <div key={a.user} style={{ background: '#0B0B16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#C9A84C', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{a.user}</div>
              <div style={{ fontSize: 14, color: 'rgba(238,238,245,0.7)', lineHeight: 1.7 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* AI REPORTS */}
      <section style={s.section}>
        <div style={s.sLabel}>التقارير التلقائية</div>
        <h2 style={s.sectionTitle}>
          تقارير <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ذكية</span> تلقائية
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {[
            { title: 'تقرير أداء الفصل', desc: 'المتوسط، التوزيع، أعلى وأدنى درجة، مقارنة بالفصول الأخرى' },
            { title: 'تقرير مقارنة سنوية', desc: 'أداء هذا العام vs العام الماضي — تحليل شامل للتطور' },
            { title: 'تقرير الطلاب المعرضين للرسوب', desc: 'قبل نهاية الفصل بشهر — لإتاحة التدخل المبكر' },
            { title: 'تقرير الانضباط', desc: 'أكثر أيام الغياب، الأنماط الأسبوعية، تحليل الحضور' },
          ].map((r) => (
            <div key={r.title} style={{ background: '#0B0B16', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#C9A84C', marginBottom: 8 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(238,238,245,0.65)', lineHeight: 1.6 }}>{r.desc}</div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(238,238,245,0.4)' }}>قابل للتصدير PDF / Excel • يُرسل تلقائياً</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(139,92,246,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={s.sLabel}>باقة مؤسسية</div>
        <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5', marginBottom: 16 }}>
          الذكاء الاصطناعي متاح في <span style={{ background: 'linear-gradient(90deg,#8B5CF6,#C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>الباقة المؤسسية</span>
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(238,238,245,0.65)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.8 }}>
          تواصل مع فريق المبيعات للحصول على عرض مخصص لمؤسستك.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#C9A84C', color: '#000', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            تواصل مع فريق المبيعات
          </Link>
          <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(238,238,245,0.65)', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
            مقارنة الباقات
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <span style={s.footerCopy}>© {new Date().getFullYear()} منصة متين. جميع الحقوق محفوظة.</span>
        <div style={s.footerLinks}>
          <Link href="/privacy" style={s.footerLink}>سياسة الخصوصية</Link>
          <Link href="/terms" style={s.footerLink}>الشروط والأحكام</Link>
          <Link href="/contact" style={s.footerLink}>تواصل معنا</Link>
        </div>
      </footer>
    </div>
  );
}
