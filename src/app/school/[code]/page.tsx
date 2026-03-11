'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const TEMPLATES = {
  classic: { primary: '#1a3a5c', secondary: '#C9A227', bg: '#f8f9fa', headerBg: '#1a3a5c' },
  modern: { primary: '#6366F1', secondary: '#10B981', bg: '#0D1B2A', headerBg: '#0A1520' },
  green: { primary: '#065f46', secondary: '#f59e0b', bg: '#f0fdf4', headerBg: '#065f46' },
  red: { primary: '#991b1b', secondary: '#C9A227', bg: '#fff5f5', headerBg: '#991b1b' },
  purple: { primary: '#4c1d95', secondary: '#f59e0b', bg: '#faf5ff', headerBg: '#4c1d95' },
};

export default function SchoolPublicPage() {
  const params = useParams();
  const router = useRouter();
  const schoolCode = params?.code as string;
  const [school, setSchool] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    fetchSchoolData();
  }, [schoolCode]);

  // تدوير الإعلانات كل 5 ثواني
  useEffect(() => {
    if (ads.length > 1) {
      const timer = setInterval(() => {
        setAdIndex(prev => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [ads]);

  const fetchSchoolData = async () => {
    try {
      const [schoolRes, adsRes, activitiesRes, newsRes] = await Promise.all([
        fetch(`/api/schools/public?code=${schoolCode}`),
        fetch(`/api/ads?school_code=${schoolCode}&platform_ads=true`),
        fetch(`/api/activities?school_code=${schoolCode}&public=true`),
        fetch(`/api/posts?school_code=${schoolCode}&public=true&limit=6`),
      ]);
      if (schoolRes.ok) setSchool(await schoolRes.json());
      if (adsRes.ok) setAds(await adsRes.json());
      if (activitiesRes.ok) setActivities(await activitiesRes.json());
      if (newsRes.ok) setNews(await newsRes.json());
    } catch (e) {}
    finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0D1B2A' }}>
      <div style={{ color: '#C9A227', fontSize: '18px' }}>جاري التحميل...</div>
    </div>
  );

  if (!school) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0D1B2A', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '64px' }}>🏫</div>
      <div style={{ color: 'white', fontSize: '20px' }}>المؤسسة غير موجودة</div>
      <button onClick={() => router.push('/')} style={{ background: '#C9A227', color: '#0D1B2A', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: 700 }}>
        العودة للرئيسية
      </button>
    </div>
  );

  const template = TEMPLATES[school.template as keyof typeof TEMPLATES] || TEMPLATES.classic;
  const isDark = school.template === 'modern';
  const textColor = isDark ? 'white' : '#1a1a1a';
  const subTextColor = isDark ? 'rgba(255,255,255,0.6)' : '#666';
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'white';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';

  const TABS = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'about', label: 'عن المؤسسة' },
    { id: 'activities', label: 'الأنشطة' },
    { id: 'news', label: 'الأخبار' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: template.bg, fontFamily: 'IBM Plex Sans Arabic, Arial, sans-serif', direction: 'rtl' }}>
      
      {/* إعلانات المنصة - بانر علوي */}
      {ads.filter(a => a.is_platform_ad).length > 0 && (
        <div style={{ background: template.primary, color: 'white', padding: '8px 16px', textAlign: 'center', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ background: template.secondary, color: '#0D1B2A', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>إعلان</span>
          <span>{ads.filter(a => a.is_platform_ad)[adIndex % ads.filter(a => a.is_platform_ad).length]?.title}</span>
        </div>
      )}

      {/* Header */}
      <header style={{ background: template.headerBg, color: 'white', padding: '0 24px', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {school.logo ? (
              <img src={school.logo} alt={school.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: template.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {school.institution_type === 'university' ? '🎓' : school.institution_type === 'kindergarten' ? '🌟' : '🏫'}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px' }}>{school.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                {school.institution_type === 'school' ? 'مدرسة' : school.institution_type === 'university' ? 'جامعة' : school.institution_type === 'institute' ? 'معهد' : school.institution_type === 'kindergarten' ? 'حضانة' : 'مؤسسة تعليمية'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => router.push('/login?school=' + schoolCode)}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}>
              تسجيل الدخول
            </button>
            <button onClick={() => router.push('/school/' + schoolCode + '/join')}
              style={{ background: template.secondary, color: '#0D1B2A', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
              التسجيل
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4px' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ background: activeTab === tab.id ? template.secondary : 'transparent', color: activeTab === tab.id ? '#0D1B2A' : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '8px 8px 0 0', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === tab.id ? 700 : 400, transition: 'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {/* الرئيسية */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <div style={{ background: `linear-gradient(135deg, ${template.primary}20, ${template.secondary}10)`, border: `1px solid ${template.primary}30`, borderRadius: '16px', padding: '48px 32px', marginBottom: '24px', textAlign: 'center' }}>
              {school.cover_image ? (
                <img src={school.cover_image} alt="" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '24px' }} />
              ) : null}
              <h1 style={{ color: textColor, fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>
                مرحباً بكم في {school.name}
              </h1>
              <p style={{ color: subTextColor, fontSize: '16px', maxWidth: '600px', margin: '0 auto 24px' }}>
                {school.description || 'مؤسسة تعليمية متميزة تسعى لتقديم أفضل الخدمات التعليمية'}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => router.push('/school/' + schoolCode + '/join')}
                  style={{ background: template.primary, color: 'white', border: 'none', borderRadius: '10px', padding: '12px 32px', cursor: 'pointer', fontSize: '15px', fontWeight: 700 }}>
                  سجّل الآن
                </button>
                <button onClick={() => setActiveTab('about')}
                  style={{ background: 'transparent', color: textColor, border: `2px solid ${template.primary}`, borderRadius: '10px', padding: '12px 32px', cursor: 'pointer', fontSize: '15px' }}>
                  اعرف أكثر
                </button>
              </div>
            </div>

            {/* إعلانات المنصة - بانر وسط الصفحة */}
            {ads.filter(a => a.is_platform_ad && a.position === 'middle').length > 0 && (
              <div style={{ background: `linear-gradient(135deg, ${template.secondary}20, ${template.secondary}10)`, border: `2px solid ${template.secondary}40`, borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ background: template.secondary, color: '#0D1B2A', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>إعلان</span>
                <div>
                  <div style={{ color: textColor, fontWeight: 700 }}>{ads.filter(a => a.is_platform_ad && a.position === 'middle')[0]?.title}</div>
                  <div style={{ color: subTextColor, fontSize: '13px' }}>{ads.filter(a => a.is_platform_ad && a.position === 'middle')[0]?.description}</div>
                </div>
              </div>
            )}

            {/* إحصائيات المؤسسة */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { icon: '👥', num: school.students_count || 0, label: 'طالب' },
                { icon: '👨‍🏫', num: school.teachers_count || 0, label: 'معلم' },
                { icon: '🏫', num: school.classes_count || 0, label: 'فصل' },
                { icon: '🏆', num: school.achievements || 0, label: 'إنجاز' },
              ].map((stat, i) => (
                <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ color: template.primary, fontSize: '28px', fontWeight: 800 }}>{stat.num}+</div>
                  <div style={{ color: subTextColor, fontSize: '14px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* آخر الأخبار */}
            {news.length > 0 && (
              <div>
                <h2 style={{ color: textColor, fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>📰 آخر الأخبار</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {news.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <div style={{ color: subTextColor, fontSize: '12px', marginBottom: '8px' }}>
                        {new Date(item.created_at).toLocaleDateString('ar-SA')}
                      </div>
                      <div style={{ color: textColor, fontWeight: 600, marginBottom: '8px' }}>{item.content?.slice(0, 80)}...</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* عن المؤسسة */}
        {activeTab === 'about' && (
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '32px' }}>
            <h2 style={{ color: textColor, fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>عن {school.name}</h2>
            <p style={{ color: subTextColor, fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
              {school.description || 'مؤسسة تعليمية متميزة تسعى لتقديم أفضل الخدمات التعليمية لطلابها وأولياء أمورهم.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'المدينة', value: school.city || 'غير محدد' },
                { label: 'النوع', value: school.institution_type === 'school' ? 'مدرسة' : school.institution_type === 'university' ? 'جامعة' : school.institution_type },
                { label: 'الترخيص', value: school.license_number || 'غير محدد' },
                { label: 'تاريخ التأسيس', value: school.founded_year || 'غير محدد' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb', borderRadius: '8px' }}>
                  <span style={{ color: subTextColor }}>{item.label}</span>
                  <span style={{ color: textColor, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الأنشطة */}
        {activeTab === 'activities' && (
          <div>
            <h2 style={{ color: textColor, fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>🎯 الأنشطة</h2>
            {activities.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {activities.map((activity: any, i: number) => (
                  <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '20px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
                    <div style={{ color: textColor, fontWeight: 700, marginBottom: '8px' }}>{activity.title}</div>
                    <div style={{ color: subTextColor, fontSize: '13px' }}>{activity.description}</div>
                    <div style={{ color: template.secondary, fontSize: '12px', marginTop: '8px' }}>
                      {activity.date ? new Date(activity.date).toLocaleDateString('ar-SA') : ''}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', color: subTextColor }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                <div>لا توجد أنشطة حالياً</div>
              </div>
            )}
          </div>
        )}

        {/* الأخبار */}
        {activeTab === 'news' && (
          <div>
            <h2 style={{ color: textColor, fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>📰 الأخبار والإعلانات</h2>
            {news.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {news.map((item: any, i: number) => (
                  <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '20px' }}>
                    <div style={{ color: subTextColor, fontSize: '12px', marginBottom: '8px' }}>
                      {new Date(item.created_at).toLocaleDateString('ar-SA')}
                    </div>
                    <div style={{ color: textColor, fontSize: '15px', lineHeight: '1.7' }}>{item.content}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', color: subTextColor }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📰</div>
                <div>لا توجد أخبار حالياً</div>
              </div>
            )}
          </div>
        )}

        {/* تواصل معنا */}
        {activeTab === 'contact' && (
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '32px' }}>
            <h2 style={{ color: textColor, fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>📞 تواصل معنا</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { icon: '📱', label: 'الهاتف', value: school.phone || 'غير محدد' },
                { icon: '📧', label: 'البريد الإلكتروني', value: school.email || 'غير محدد' },
                { icon: '📍', label: 'العنوان', value: school.address || 'غير محدد' },
                { icon: '🌐', label: 'الموقع', value: school.website || 'غير محدد' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '16px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb', borderRadius: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  <div>
                    <div style={{ color: subTextColor, fontSize: '12px' }}>{item.label}</div>
                    <div style={{ color: textColor, fontWeight: 600 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: template.headerBg, color: 'rgba(255,255,255,0.6)', padding: '24px', textAlign: 'center', marginTop: '48px', fontSize: '13px' }}>
        <div>{school.name} &copy; {new Date().getFullYear()} | مدعوم بـ <span style={{ color: template.secondary, fontWeight: 700 }}>متين</span></div>
      </footer>
    </div>
  );
}
