export const PLANS = ['free', 'basic', 'pro', 'enterprise'] as const;
export type PlanType = typeof PLANS[number];

export const PLAN_NAMES_AR: Record<PlanType, string> = {
  free: 'مجاني',
  basic: 'المبتدئ',
  pro: 'المحترف',
  enterprise: 'المؤسسي',
};
