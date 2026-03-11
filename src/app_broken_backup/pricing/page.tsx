'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Plan {
  id: number;
  name: string;
  name_ar: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  max_students: number;
  max_teachers: number;
  features: string[] | string;
  is_active: boolean;
  is_featured: boolean;
  color?: string;
  badge_text?: string;
}

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/public/plans')
      .then(r => r.json())
      .then(data => {
        if (data.plans) setPlans(data.plans);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getFeatures = (plan: Plan): string[] => {
    if (Array.isArray(plan.features)) return plan.features;
    try { return JSON.parse(plan.features as string); } catch { return []; }
  };

  const getPrice = (plan: Plan) => {
    if (plan.price_monthly === 0) return 'مجاني';
    const price = billing === 'yearly' ? Math.round(plan.price_yearly / 12) : plan.price_monthly;
    return `${price.toLocaleString('ar-SA')} ريال`;
  };

  const getPeriod = (plan: Plan) => {
    if (plan.price_monthly === 0) return '';
    return billing === 'yearly' ? '/شهر (يُدفع سنوياً)' : '/شهر';
  };

  const getYearlySaving = (plan: Plan) => {
    if (plan.price_monthly === 0 || !plan.price_yearly) return 0;
    return Math.round(((plan.price_monthly * 12 - plan.price_yearly) / (plan.price_monthly * 12)) * 100);
  };

  const planColors = ['from-gray-800 to-gray-900', 'from-amber-900/40 to-gray-900', 'from-purple-900/40 to-gray-900'];
  const borderColors = ['border-gray-700', 'border-amber-500', 'border-purple-500'];
  const btnColors = ['border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black', 'bg-amber-500 text-black hover:bg-amber-400', 'bg-purple-600 text-white hover:bg-purple-500'];

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {/* Header */}
      <header className="bg-black/90 border-b border-amber-500/20 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-amber-500">متين</Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/" className="hover:text-amber-500 transition-colors">الرئيسية</Link>
            <Link href="/community" className="hover:text-amber-500 transition-colors">المجتمع</Link>
            <Link href="/store" className="hover:text-amber-500 transition-colors">المتجر</Link>
            <Link href="/pricing" className="text-amber-500 font-semibold">الأسعار</Link>
            <Link href="/contact" className="hover:text-amber-500 transition-colors">تواصل معنا</Link>
          </nav>
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 border border-amber-500/50 rounded-lg text-sm hover:border-amber-500 transition-colors">دخول</Link>
            <Link href="/register" className="px-4 py-2 bg-amber-500 text-black rounded-lg text-sm font-bold hover:bg-amber-400 transition-colors">ابدأ مجاناً</Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">خطط <span className="text-amber-500">الأسعار</span></h1>
          <p className="text-gray-400 text-lg mb-8">اختر الخطة المناسبة لمؤسستك التعليمية</p>

          {/* Toggle شهري/سنوي */}
          <div className="inline-flex items-center gap-3 bg-gray-900 rounded-full p-1 border border-gray-800">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              شهري
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              سنوي
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">وفّر حتى 20%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 animate-pulse">
                <div className="h-6 bg-gray-800 rounded mb-4 w-1/2"></div>
                <div className="h-12 bg-gray-800 rounded mb-6 w-3/4"></div>
                <div className="space-y-3">
                  {[1,2,3,4].map(j => <div key={j} className="h-4 bg-gray-800 rounded"></div>)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-8 max-w-5xl mx-auto ${plans.length === 1 ? 'md:grid-cols-1 max-w-sm' : plans.length === 2 ? 'md:grid-cols-2 max-w-3xl' : 'md:grid-cols-3'}`}>
            {plans.map((plan, i) => {
              const saving = getYearlySaving(plan);
              const colorIdx = i % 3;
              return (
                <div
                  key={plan.id}
                  className={`relative bg-gradient-to-b ${planColors[colorIdx]} rounded-2xl p-8 border ${borderColors[colorIdx]} transition-transform hover:-translate-y-1`}
                >
                  {/* Badge */}
                  {plan.is_featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                      ⭐ الأكثر شيوعاً
                    </div>
                  )}
                  {plan.badge_text && !plan.is_featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      {plan.badge_text}
                    </div>
                  )}

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold mb-1">{plan.name_ar}</h3>
                  {plan.description && <p className="text-gray-400 text-sm mb-4">{plan.description}</p>}

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className={`text-4xl font-bold ${plan.price_monthly === 0 ? 'text-green-400' : 'text-amber-500'}`}>
                        {getPrice(plan)}
                      </span>
                    </div>
                    {getPeriod(plan) && <p className="text-gray-400 text-sm mt-1">{getPeriod(plan)}</p>}
                    {billing === 'yearly' && saving > 0 && (
                      <p className="text-green-400 text-sm mt-1">توفير {saving}% مقارنة بالشهري</p>
                    )}
                  </div>

                  {/* Limits */}
                  <div className="flex gap-4 mb-6 text-sm text-gray-400">
                    <span>👥 {plan.max_students === -1 ? 'غير محدود' : `${plan.max_students} طالب`}</span>
                    <span>👨‍🏫 {plan.max_teachers === -1 ? 'غير محدود' : `${plan.max_teachers} معلم`}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {getFeatures(plan).map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <span className="text-amber-500 text-lg leading-none">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => router.push(`/register?plan=${plan.id}`)}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${btnColors[colorIdx]}`}
                  >
                    {plan.price_monthly === 0 ? 'ابدأ مجاناً' : 'اشترك الآن'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
          <div className="space-y-4">
            {[
              { q: 'هل يمكنني تغيير الخطة لاحقاً؟', a: 'نعم، يمكنك الترقية أو التخفيض في أي وقت وسيتم احتساب الفرق تلقائياً.' },
              { q: 'هل هناك فترة تجريبية مجانية؟', a: 'نعم، الخطة الأساسية مجانية تماماً بدون حد زمني.' },
              { q: 'ما طرق الدفع المتاحة؟', a: 'نقبل مدى، فيزا، ماستركارد، Apple Pay، STC Pay، وبالتقسيط عبر Tabby وTamara.' },
              { q: 'هل بياناتنا آمنة؟', a: 'نعم، نستخدم تشفير SSL وتخزين آمن في خوادم معتمدة بالسعودية.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h4 className="font-bold text-amber-500 mb-2">{item.q}</h4>
                <p className="text-gray-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
