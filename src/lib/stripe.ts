import Stripe from 'stripe';

// During `next build` STRIPE_SECRET_KEY is not available — skip initialization.
const _stripeKey = process.env.STRIPE_SECRET_KEY;
export const stripe = _stripeKey
  ? new Stripe(_stripeKey, {
      apiVersion: '2024-06-20' as any,
    })
  : (null as unknown as Stripe);

export const PLANS = {
  basic: {
    id: 'basic',
    name: 'الباقة الأساسية',
    nameEn: 'Basic',
    price: 0,
    priceLabel: 'مجاناً',
    period: 'شهرياً',
    features: [
      'مدرسة واحدة',
      'حتى 50 طالب',
      '3 معلمين',
      'إدارة الحضور',
      'سجل الدرجات',
    ],
    limits: { schools: 1, students: 50, teachers: 3, storage_gb: 1 },
    stripe_price_id: null as string | null,
  },
  professional: {
    id: 'professional',
    name: 'الباقة الاحترافية',
    nameEn: 'Professional',
    price: 99,
    priceLabel: '99 ر.س',
    period: 'شهرياً',
    features: [
      'حتى 3 مدارس',
      'حتى 500 طالب',
      '20 معلم',
      'تقارير متقدمة',
      'نظام الحضور + التسميع',
      'إشعارات البريد',
      'دعم فني أولوية',
    ],
    limits: { schools: 3, students: 500, teachers: 20, storage_gb: 10 },
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID || null,
  },
  enterprise: {
    id: 'enterprise',
    name: 'باقة المؤسسات',
    nameEn: 'Enterprise',
    price: 299,
    priceLabel: '299 ر.س',
    period: 'شهرياً',
    features: [
      'مدارس غير محدودة',
      'طلاب غير محدود',
      'معلمين غير محدود',
      'كل المميزات',
      'تصدير التقارير',
      'API مخصص',
      'دعم فني 24/7',
      'تخصيص الهوية',
    ],
    limits: { schools: 999, students: 99999, teachers: 9999, storage_gb: 100 },
    stripe_price_id: process.env.STRIPE_ENT_PRICE_ID || null,
  },
};

export type PlanId = keyof typeof PLANS;

export function getPlan(planId: string) {
  return PLANS[planId as PlanId] || PLANS.basic;
}

export function canUpgrade(currentPlan: string, targetPlan: string): boolean {
  const order = ['basic', 'professional', 'enterprise'];
  return order.indexOf(targetPlan) > order.indexOf(currentPlan);
}
