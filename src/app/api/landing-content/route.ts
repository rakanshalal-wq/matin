import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';

const D: Record<string,any> = {
  hero_badge: 'منصة التعليم الأذكى للمؤسسات الخاصة في السعودية',
  hero_title1: 'كل مؤسستك في', hero_title2: 'لوحة تحكم واحدة',
  hero_desc: 'من الحضور والدرجات إلى الرسوم والنقل — متين يدير كل شيء حتى تركّز أنت على التعليم.',
  hero_btn1: 'ابدأ تجربتك المجانية', hero_btn2: 'شاهد العرض',
  bg_type: 'color', bg_value: '#06060E',
  bg_gradient_from: '#06060E', bg_gradient_to: '#0A1628', bg_gradient_dir: '135deg',
  bg_image_url: '', bg_overlay_opacity: 70,
  announcement_text: 'منصة التعليم الأذكى للمؤسسات الخاصة في السعودية',
  sec_announcement: true,
  inst_title1: 'لكل مؤسسة تعليمية', inst_title2: 'حل مخصص',
  inst_desc: 'من الروضة للجامعة — متين يتكيف مع طبيعة مؤسستك وهيكلها الأكاديمي.',
  feat_title1: 'كل ما تحتاجه', feat_title2: 'في مكان واحد',
  pricing_title: 'باقة لكل مؤسسة', pricing_desc: 'ابدأ مجاناً وطوّر حسب احتياجك.',
  footer_copyright: '© 2026 متين — جميع الحقوق محفوظة · صنع بـ ❤️ في المملكة العربية السعودية',
  footer_logo_desc: 'منصة إدارة التعليم المتكاملة',
  footer_whatsapp: '', footer_email: '', footer_twitter: '', footer_linkedin: '',
  sec_institutions: true, sec_features: true, sec_roles: true,
  sec_integrations: true, sec_pricing: true, sec_testimonials: true,
  sec_faq: true, sec_cta: true, sec_floating_whatsapp: true,
  hero_cards: [
    {title:'المتجر الإلكتروني',tag:'مدفوعات إلكترونية مدمجة',desc:'متجر خاص لكل مؤسسة لبيع الكتب، الأدوات، والمنتجات التعليمية.'},
    {title:'المكتبة الرقمية',tag:'وصول 24/7 من أي جهاز',desc:'مستودع محتوى تعليمي ثري — كتب، مقاطع، ملفات، ومراجع.'},
    {title:'الملتقى المجتمعي',tag:'تواصل حقيقي داخل المؤسسة',desc:'فضاء تفاعلي يجمع الطلاب والمعلمين وأولياء الأمور.'},
    {title:'الإعلانات',tag:'استهداف حسب الدور والمؤسسة',desc:'أنشئ إعلانات وأظهرها داخل لوحات التحكم لجميع المستخدمين.'}
  ],
  institutions: [
    {name:'المدارس',tag:'الأكثر استخداماً',desc:'إدارة كاملة للفصول، المناهج، الحضور، الدرجات، والتواصل مع أولياء الأمور.'},
    {name:'الجامعات',tag:'دعم متعدد الأقسام',desc:'نظام أكاديمي متقدم يدعم التسجيل، الساعات المعتمدة، والمقررات الإلكترونية.'},
    {name:'رياض الأطفال',tag:'تواصل لحظي مع الأهل',desc:'متابعة يومية للنشاطات، التغذية، الحضور، وتقارير النمو لأولياء الأمور.'},
    {name:'حضانات الأطفال',tag:'متابعة دقيقة بالدقيقة',desc:'إدارة الحضانة بالكامل — تسجيل الأطفال، جداول الرعاية، وتقارير يومية.'},
    {name:'مراكز التدريب',tag:'إصدار شهادات رقمية',desc:'إدارة الدورات، المدربين، الحضور، الشهادات، والمدفوعات في منظومة واحدة.'},
    {name:'المعاهد التقنية',tag:'تكامل مع سوق العمل',desc:'مناهج تقنية، مشاريع التخرج، التدريب الميداني، ومتابعة الكفاءات العملية.'},
    {name:'المساجد والحلقات',tag:'خصوصية تامة',desc:'إدارة حلقات التحفيظ، المستويات، الحضور، والتقييم الديني بشكل منظم.'}
  ],
  features: [
    {title:'إدارة متعددة الأدوار',color:'#60A5FA',desc:'15+ دور من مالك المنصة لولي الأمر — كل دور بصلاحياته الدقيقة.'},
    {title:'حضور وغياب ذكي',color:'#10B981',desc:'تسجيل فوري مع إشعارات لحظية لأولياء الأمور عبر واتساب و SMS.'},
    {title:'إدارة مالية متكاملة',color:'#D4A843',desc:'رسوم الطلاب، الرواتب، الفواتير، والمنح — مع تقارير مالية تلقائية.'},
    {title:'تعليم إلكتروني مدمج',color:'#A78BFA',desc:'محاضرات مسجّلة، بث مباشر، واجبات إلكترونية، وبنك أسئلة متقدم.'},
    {title:'نقل مدرسي مع GPS',color:'#FB923C',desc:'تتبع حافلات المدرسة في الوقت الفعلي مع إشعارات وصول وانصراف.'}
  ],
  pricing_plans: [
    {name:'أساسي',price:'مجاناً',period:'تجربة 30 يوم كاملة',features:'حتى 100 طالب\nلوحة تحكم أساسية\nالحضور والغياب\nالدرجات والتقارير',btn:'ابدأ مجاناً',badge:''},
    {name:'متقدم',price:'1,200',period:'ريال / سنة',features:'حتى 500 طالب\nجميع مميزات الأساسي\nالتعليم الإلكتروني\nالنقل المدرسي + GPS\nإدارة مالية كاملة',btn:'اشترك الآن',badge:'الأكثر شعبية'},
    {name:'مؤسسي',price:'حسب الطلب',period:'للمؤسسات الكبيرة',features:'طلاب غير محدودين\nجميع المميزات\nدعم مخصص 24/7\nتكاملات مخصصة\nWhite Label متاح',btn:'تواصل معنا',badge:''}
  ],
  testimonials: [
    {text:'متين غيّر طريقة إدارتنا للمدرسة كلياً — الحضور والرسوم والتواصل مع الأهل كله صار في مكان واحد.',name:'أحمد العمري',title:'مدير مدرسة الأمل الدولية — الرياض',rating:5},
    {text:'أفضل استثمار عملناه لمعهدنا. نظام التعليم الإلكتروني وإصدار الشهادات أعطانا ميزة تنافسية كبيرة.',name:'سارة الحربي',title:'مديرة معهد تقنية المعلومات — جدة',rating:5}
  ],
  integrations: ['واتساب Business','SMS محلي','نظام نور','مدى / فيزا','تقارير PDF','تخزين سحابي','ذكاء اصطناعي','GPS تتبع','إشعارات فورية','SSL وأمان'],
  faqs: [
    {question:'هل يمكنني تجربة متين قبل الدفع?',answer:'نعم، نوفر تجربة مجانية كاملة لمدة 30 يوم بدون بطاقة ائتمان. تحصل على وصول كامل لجميع المميزات خلال فترة التجربة.'},
    {question:'كم يستغرق إعداد المنصة لمؤسستي?',answer:'معظم المؤسسات تكون جاهزة خلال يوم واحد. فريقنا يساعدك في استيراد البيانات وإعداد الفصول والمستخدمين.'},
    {question:'هل بياناتي آمنة على متين?',answer:'نعم، نستخدم تشفير SSL كامل، ونسخ احتياطية يومية، وخوادم موثوقة. بياناتك ملكك حصراً.'}
  ],
};

export async function GET() {
  try {
    const res = await pool.query("SELECT content FROM landing_content WHERE section='main'");
    return NextResponse.json({ ...D, ...(res.rows[0]?.content || {}) });
  } catch { return NextResponse.json(D); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await pool.query(
      "INSERT INTO landing_content(section,content,updated_at) VALUES('main',$1,NOW()) ON CONFLICT(section) DO UPDATE SET content=$1,updated_at=NOW()",
      [JSON.stringify(body)]
    );
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
