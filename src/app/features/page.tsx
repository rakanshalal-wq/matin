import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      id: 'comprehensive',
      icon: '📱',
      title: 'إدارة شاملة',
      description: 'نظام متكامل يجمع كل احتياجاتك في مكان واحد',
      details: 'إدارة الطلاب، المعلمين، الجداول الدراسية، الحضور والغياب، الدرجات، والشؤون المالية - كل شيء في منصة واحدة سهلة الاستخدام.',
      benefits: ['توفير الوقت والجهد', 'تقليل الأخطاء', 'سهولة الوصول للمعلومات', 'تحسين الكفاءة الإدارية']
    },
    {
      id: 'cloud',
      icon: '☁️',
      title: 'سحابي 100%',
      description: 'الوصول من أي مكان وأي جهاز بأمان تام',
      details: 'لا حاجة لتثبيت برامج أو خوادم محلية. ادخل من المتصفح على أي جهاز (كمبيوتر، لابتوب، جوال، تابلت) واعمل بكل راحة.',
      benefits: ['لا حاجة لبنية تحتية', 'تحديثات تلقائية', 'نسخ احتياطي دوري', 'أمان عالي']
    },
    {
      id: 'secure',
      icon: '🔒',
      title: 'آمن ومشفر',
      description: 'حماية متقدمة لبياناتك مع نسخ احتياطي تلقائي',
      details: 'نستخدم أحدث تقنيات التشفير وأمن المعلومات لحماية بياناتك. نسخ احتياطية تلقائية يومية لضمان عدم فقدان أي معلومة.',
      benefits: ['تشفير SSL/TLS', 'نسخ احتياطي يومي', 'صلاحيات متعددة المستويات', 'سجل تدقيق كامل']
    },
    {
      id: 'ai-reports',
      icon: '📊',
      title: 'تقارير ذكية بالـ AI',
      description: 'تحليلات فورية مدعومة بالذكاء الاصطناعي',
      details: 'احصل على تقارير تفصيلية وتحليلات ذكية باستخدام الذكاء الاصطناعي. التقارير تساعدك في اتخاذ قرارات مبنية على البيانات.',
      benefits: ['تقارير تفاعلية', 'توقعات وتنبؤات', 'رسوم بيانية متقدمة', 'تصدير بصيغ متعددة']
    },
    {
      id: 'communication',
      icon: '💬',
      title: 'تواصل فعّال',
      description: 'إشعارات لحظية عبر الواتساب والإيميل والرسائل',
      details: 'تواصل فوري مع أولياء الأمور والمعلمين عبر قنوات متعددة. إشعارات تلقائية للأحداث المهمة.',
      benefits: ['واتساب تلقائي', 'إيميلات مخصصة', 'رسائل SMS', 'إشعارات داخل النظام']
    },
    {
      id: 'financial',
      icon: '💰',
      title: 'إدارة مالية',
      description: 'متابعة الرسوم والمدفوعات والفواتير بسهولة',
      details: 'نظام مالي متكامل لإدارة الرسوم الدراسية، المدفوعات، الفواتير، والتقارير المالية. دعم الدفع الإلكتروني.',
      benefits: ['فواتير إلكترونية', 'دفع أونلاين', 'تقارير مالية', 'متابعة المتأخرات']
    },
    {
      id: 'calendar',
      icon: '📅',
      title: 'تقويم ذكي',
      description: 'التقويم الدراسي والفعاليات مع تذكيرات تلقائية',
      details: 'تقويم شامل للسنة الدراسية، الإجازات، الاختبارات، والفعاليات. تذكيرات تلقائية للأحداث المهمة.',
      benefits: ['تقويم هجري وميلادي', 'تذكيرات تلقائية', 'جداول الاختبارات', 'الفعاليات والمناسبات']
    },
    {
      id: 'academic',
      icon: '🎓',
      title: 'متابعة أكاديمية',
      description: 'تتبع الأداء والحضور والدرجات لحظياً',
      details: 'متابعة شاملة للأداء الأكاديمي للطلاب. الحضور والغياب، الدرجات، الواجبات، والاختبارات - كل شيء في مكان واحد.',
      benefits: ['حضور إلكتروني', 'دفتر درجات رقمي', 'تقارير الأداء', 'تنبيهات التأخر']
    },
    {
      id: 'transport',
      icon: '🚌',
      title: 'النقل المدرسي',
      description: 'تتبع GPS وإشعارات الوصول',
      details: 'نظام متكامل لإدارة النقل المدرسي مع تتبع الباصات بالـ GPS. إشعارات فورية لأولياء الأمور عند الوصول.',
      benefits: ['تتبع مباشر', 'إشعارات الوصول', 'إدارة الخطوط', 'سجل الرحلات']
    },
    {
      id: 'health',
      icon: '🏥',
      title: 'الصحة المدرسية',
      description: 'السجلات الصحية والتطعيمات',
      details: 'ملف صحي كامل لكل طالب. السجلات الصحية، التطعيمات، الحالات المزمنة، والأدوية. تكامل مع المستشفيات.',
      benefits: ['ملف صحي رقمي', 'تذكير بالتطعيمات', 'حالات الطوارئ', 'التأمين الصحي']
    },
    {
      id: 'cafeteria',
      icon: '🍽️',
      title: 'الكافتيريا',
      description: 'القوائم والطلبات والدفع',
      details: 'نظام كامل لإدارة الكافتيريا. القوائم اليومية، الطلبات المسبقة، الدفع الإلكتروني، وإدارة الحساسية الغذائية.',
      benefits: ['قوائم يومية', 'طلب مسبق', 'دفع إلكتروني', 'تتبع الحساسية']
    },
    {
      id: 'activities',
      icon: '🎭',
      title: 'الأنشطة والفعاليات',
      description: 'النوادي والمسابقات والرحلات',
      details: 'إدارة شاملة للأنشطة اللاصفية. النوادي، الرياضة، المسابقات، الرحلات، والفعاليات الثقافية.',
      benefits: ['تسجيل إلكتروني', 'جداول الأنشطة', 'الشهادات', 'ألبوم الصور']
    },
    {
      id: 'library',
      icon: '📚',
      title: 'المكتبة',
      description: 'الاستعارة والإرجاع الإلكتروني',
      details: 'نظام مكتبة متكامل. كتالوج الكتب، الاستعارة والإرجاع، الحجز، الغرامات، والتقارير.',
      benefits: ['كتالوج رقمي', 'استعارة إلكترونية', 'تذكير بالإرجاع', 'تقارير القراءة']
    },
    {
      id: 'weather',
      icon: '🌤️',
      title: 'الطقس',
      description: 'تنبيهات الطقس وتعليق الدراسة',
      details: 'تكامل مع خدمات الأرصاد. تنبيهات تلقائية للطقس السيء، قرارات تعليق الدراسة، وتواصل مع الدفاع المدني.',
      benefits: ['توقعات يومية', 'تنبيهات الطوارئ', 'قرارات التعليق', 'تواصل تلقائي']
    },
    {
      id: 'elearning',
      icon: '💻',
      title: 'التعليم الإلكتروني',
      description: 'فصول افتراضية واختبارات أونلاين',
      details: 'منصة تعليم إلكتروني كاملة. فصول افتراضية، مكتبة رقمية، واجبات إلكترونية، واختبارات أونلاين.',
      benefits: ['فصول افتراضية', 'محتوى تفاعلي', 'اختبارات ذكية', 'تسجيل الحصص']
    },
    {
      id: 'alumni',
      icon: '🎓',
      title: 'شبكة الخريجين',
      description: 'التواصل وفرص العمل',
      details: 'منصة للتواصل مع الخريجين. قاعدة بيانات الخريجين، فرص العمل، قصص النجاح، والتبرعات.',
      benefits: ['قاعدة بيانات', 'فرص وظيفية', 'لقاءات سنوية', 'برامج التبرع']
    },
    {
      id: 'counseling',
      icon: '🧭',
      title: 'الإرشاد الأكاديمي',
      description: 'التوجيه والاستشارات',
      details: 'خدمات إرشادية متكاملة. إرشاد أكاديمي، نفسي، مهني. جلسات فردية وجماعية. متابعة الحالات.',
      benefits: ['إرشاد أكاديمي', 'دعم نفسي', 'توجيه مهني', 'متابعة الحالات']
    },
    {
      id: 'research',
      icon: '🔬',
      title: 'البحث العلمي',
      description: 'المشاريع والأبحاث',
      details: 'منصة لإدارة البحوث العلمية والمشاريع. تسجيل المشاريع، المتابعة، النشر، والجوائز.',
      benefits: ['إدارة المشاريع', 'المختبرات الافتراضية', 'النشر العلمي', 'المسابقات']
    },
    {
      id: 'quality',
      icon: '⭐',
      title: 'الجودة والاعتماد',
      description: 'معايير الجودة والتقييم',
      details: 'نظام شامل لإدارة الجودة والاعتماد الأكاديمي. التقييم الذاتي، خطط التحسين، والشهادات الدولية.',
      benefits: ['معايير الجودة', 'تقييم ذاتي', 'خطط التحسين', 'التقارير السنوية']
    },
    {
      id: 'special-needs',
      icon: '♿',
      title: 'ذوي الاحتياجات الخاصة',
      description: 'برامج التربية الخاصة',
      details: 'برامج مخصصة لذوي الاحتياجات الخاصة. خطط تعليمية فردية، تقنيات مساعدة، ومرافق مهيأة.',
      benefits: ['خطط فردية', 'تقنيات مساعدة', 'مرافق مهيأة', 'متابعة خاصة']
    },
    {
      id: 'marketing',
      icon: '📢',
      title: 'التسويق الرقمي',
      description: 'حملات إعلانية ووسائل تواصل',
      details: 'أدوات تسويق متكاملة. إدارة الموقع، وسائل التواصل، حملات إعلانية، مواد ترويجية، وعلاقات عامة.',
      benefits: ['إدارة الموقع', 'وسائل التواصل', 'حملات إعلانية', 'علاقات عامة']
    },
    {
      id: 'cybersecurity',
      icon: '🔐',
      title: 'الأمن السيبراني',
      description: 'تشفير متقدم ونسخ احتياطي',
      details: 'أمان متقدم على مستوى عالمي. تشفير متقدم، مصادقة ثنائية، صلاحيات دقيقة، سجلات التدقيق، والامتثال للوائح.',
      benefits: ['تشفير متقدم', 'مصادقة ثنائية', 'نسخ احتياطي', 'سجلات التدقيق']
    },
    {
      id: 'partnerships',
      icon: '🤝',
      title: 'الشراكات والرعاية',
      description: 'إدارة الشراكات والرعاية',
      details: 'إدارة الشراكات الاستراتيجية، الرعاة، اتفاقيات التعاون، التدريب التعاوني، والزيارات الميدانية.',
      benefits: ['إدارة الشراكات', 'برامج الرعاية', 'تدريب تعاوني', 'زيارات ميدانية']
    },
    {
      id: 'sustainability',
      icon: '🌱',
      title: 'الاستدامة البيئية',
      description: 'برامج التوعية البيئية',
      details: 'برامج التوعية البيئية، إعادة التدوير، ترشيد الطاقة، المباني الخضراء، والحدائق المدرسية.',
      benefits: ['توعية بيئية', 'إعادة تدوير', 'ترشيد الطاقة', 'حدائق خضراء']
    },
    {
      id: 'events',
      icon: '🎪',
      title: 'الفعاليات والمؤتمرات',
      description: 'تنظيم وإدارة الفعاليات',
      details: 'نظام متكامل لإدارة الفعاليات والمؤتمرات. التسجيل، قاعات الاجتماعات، البث المباشر، شهادات الحضور، واستطلاعات الرأي.',
      benefits: ['تسجيل إلكتروني', 'إدارة القاعات', 'بث مباشر', 'شهادات تلقائية']
    },
    {
      id: 'support',
      icon: '🛠️',
      title: 'الدعم الفني الداخلي',
      description: 'نظام تذاكر وصيانة',
      details: 'نظام دعم فني متكامل. نظام التذاكر، متابعة الطلبات، الصيانة الوقائية، إدارة الأصول التقنية، وقاعدة المعرفة.',
      benefits: ['نظام تذاكر', 'متابعة الطلبات', 'صيانة وقائية', 'قاعدة المعرفة']
    },
    {
      id: 'admissions',
      icon: '📝',
      title: 'القبول والتسجيل',
      description: 'طلبات القبول الإلكترونية',
      details: 'نظام قبول وتسجيل متكامل. طلبات أونلاين، رفع المستندات، مقابلات، اختبارات تحديد المستوى، نتائج القبول، حجز المقاعد، والدفع.',
      benefits: ['طلبات إلكترونية', 'رفع مستندات', 'مقابلات أونلاين', 'نتائج فورية']
    },
    {
      id: 'inventory',
      icon: '📦',
      title: 'المخزون والأصول',
      description: 'إدارة المخزون والصيانة',
      details: 'نظام شامل لإدارة المخزون والأصول. الكتب، القرطاسية، الأجهزة، الأثاث، المرافق، الصيانة الدورية، ومتابعة الاستهلاك.',
      benefits: ['إدارة المخزون', 'تتبع الأصول', 'صيانة دورية', 'تقارير الاستهلاك']
    },
    {
      id: 'hr',
      icon: '👥',
      title: 'الموارد البشرية',
      description: 'إدارة شؤون الموظفين',
      details: 'نظام كامل للموارد البشرية. ملفات الموظفين، الحضور، الرواتب والحوافز، الإجازات والانقطاعات، تقييم الأداء، والتدريب والتطوير.',
      benefits: ['ملفات رقمية', 'حضور وانصراف', 'إدارة الرواتب', 'تقييم الأداء']
    },
    {
      id: 'certificates',
      icon: '📜',
      title: 'الشهادات والوثائق',
      description: 'إصدار الشهادات إلكترونياً',
      details: 'إصدار الشهادات والوثائق الرسمية إلكترونياً. الشهادات الأكاديمية، كشوف الدرجات، الإفادات، التوصيات، والتوقيع الإلكتروني.',
      benefits: ['شهادات إلكترونية', 'توقيع رقمي', 'طباعة فورية', 'أرشفة آمنة']
    }
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #243B53 100%)', minHeight: '100vh', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }} dir="rtl">
        
        {/* NAVBAR */}
        <nav style={{ position: 'sticky', top: 0, background: 'rgba(13, 27, 42, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(201, 162, 39, 0.2)', zIndex: 1000, padding: '16px 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#0D1B2A', boxShadow: '0 4px 12px rgba(201, 162, 39, 0.3)' }}>م</div>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#C9A227' }}>متين</span>
            </Link>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <Link href="/community" style={{ color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>المجتمع</Link>
              <Link href="/store" style={{ color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>المتجر</Link>
              <Link href="/pricing" style={{ color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>الأسعار</Link>
              <Link href="/about" style={{ color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>عن متين</Link>
              <Link href="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>تواصل معنا</Link>
              <Link href="/login" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', border: 'none', borderRadius: 8, color: '#0D1B2A', textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 12px rgba(201, 162, 39, 0.4)' }}>تسجيل الدخول</Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ fontSize: 56, fontWeight: 900, color: 'white', marginBottom: 20 }}>
              مميزات <span style={{ color: '#C9A227' }}>متين</span> الشاملة
            </h1>
            <p style={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 40 }}>
              30+ ميزة احترافية لإدارة مؤسستك التعليمية بكفاءة وفعالية
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              {features.map((feature, index) => (
                <div key={feature.id} style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 16, padding: 40, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'start' }}>
                  <div style={{ fontSize: 64 }}>{feature.icon}</div>
                  <div>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: '#C9A227', marginBottom: 12 }}>{feature.title}</h2>
                    <p style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.9)', marginBottom: 16, fontWeight: 600 }}>{feature.description}</p>
                    <p style={{ fontSize: 17, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.8, marginBottom: 24 }}>{feature.details}</p>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 12 }}>الفوائد:</h3>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: '#C9A227', fontSize: 20 }}>✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 24px', background: 'rgba(201, 162, 39, 0.05)', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: 'white', marginBottom: 20 }}>
              جاهز لتجربة <span style={{ color: '#C9A227' }}>متين؟</span>
            </h2>
            <p style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 32 }}>
              ابدأ تجربتك المجانية الآن واكتشف كيف يمكن لمتين تحسين إدارة مؤسستك التعليمية
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" style={{ display: 'inline-block', padding: '16px 40px', background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', border: 'none', borderRadius: 12, color: '#0D1B2A', textDecoration: 'none', fontSize: 18, fontWeight: 800, boxShadow: '0 8px 24px rgba(201, 162, 39, 0.4)' }}>
                🚀 ابدأ مجاناً
              </Link>
              <Link href="/contact" style={{ display: 'inline-block', padding: '16px 40px', background: 'transparent', border: '2px solid #C9A227', borderRadius: 12, color: '#C9A227', textDecoration: 'none', fontSize: 18, fontWeight: 700 }}>
                📞 تواصل معنا
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '40px 24px', borderTop: '1px solid rgba(201, 162, 39, 0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)' }}>
            © 2026 متين - جميع الحقوق محفوظة | صنع بـ ❤️ في السعودية 🇸🇦
          </p>
        </footer>

      </div>
    </>
  );
}
