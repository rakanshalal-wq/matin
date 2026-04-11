/**
 * نظام التوجيه الذكي (Smart Routing System)
 * يوجه المستخدمين إلى الواجهات الصحيحة بناءً على نوع مؤسستهم
 */

export type InstitutionType = 'university' | 'school' | 'institute' | 'quran_center' | 'training_center';

export interface InstitutionRoute {
  type: InstitutionType;
  label: string;
  color: string;
  icon: string;
  dashboardPath: string;
  modules: string[];
}

/**
 * خريطة التوجيه الرئيسية
 * تحتوي على جميع أنواع المؤسسات والمسارات المرتبطة بها
 */
export const INSTITUTION_ROUTES: Record<InstitutionType, InstitutionRoute> = {
  university: {
    type: 'university',
    label: 'جامعة',
    color: '#8B5CF6',
    icon: '🎓',
    dashboardPath: '/dashboard/university',
    modules: [
      'students',
      'faculty',
      'departments',
      'courses',
      'exams',
      'grades',
      'research',
      'library',
    ],
  },
  school: {
    type: 'school',
    label: 'مدرسة',
    color: '#3B82F6',
    icon: '🏫',
    dashboardPath: '/dashboard/school',
    modules: [
      'students',
      'teachers',
      'classes',
      'schedule',
      'exams',
      'grades',
      'attendance',
      'library',
    ],
  },
  institute: {
    type: 'institute',
    label: 'معهد',
    color: '#10B981',
    icon: '🏢',
    dashboardPath: '/dashboard/institute',
    modules: [
      'trainees',
      'instructors',
      'programs',
      'courses',
      'certifications',
      'attendance',
      'library',
    ],
  },
  quran_center: {
    type: 'quran_center',
    label: 'مركز قرآن',
    color: '#EF4444',
    icon: '📖',
    dashboardPath: '/dashboard/quran',
    modules: [
      'students',
      'teachers',
      'classes',
      'memorization',
      'tajweed',
      'exams',
      'certificates',
      'library',
    ],
  },
  training_center: {
    type: 'training_center',
    label: 'مركز تدريب',
    color: '#F59E0B',
    icon: '💼',
    dashboardPath: '/dashboard/training',
    modules: [
      'trainees',
      'trainers',
      'courses',
      'schedules',
      'attendance',
      'certificates',
      'feedback',
      'library',
    ],
  },
};

/**
 * الحصول على معلومات التوجيه بناءً على نوع المؤسسة
 */
export const getInstitutionRoute = (type: InstitutionType): InstitutionRoute => {
  return INSTITUTION_ROUTES[type] || INSTITUTION_ROUTES.university;
};

/**
 * التحقق من أن نوع المؤسسة صحيح
 */
export const isValidInstitutionType = (type: string): type is InstitutionType => {
  return Object.keys(INSTITUTION_ROUTES).includes(type);
};

/**
 * الحصول على جميع أنواع المؤسسات
 */
export const getAllInstitutionTypes = (): InstitutionType[] => {
  return Object.keys(INSTITUTION_ROUTES) as InstitutionType[];
};

/**
 * الحصول على المسار الصحيح بناءً على نوع المؤسسة
 */
export const getInstitutionDashboardPath = (type: InstitutionType): string => {
  const route = getInstitutionRoute(type);
  return route.dashboardPath;
};

/**
 * الحصول على الألوان بناءً على نوع المؤسسة
 */
export const getInstitutionColors = (type: InstitutionType) => {
  const route = getInstitutionRoute(type);
  return {
    primary: route.color,
    secondary: adjustBrightness(route.color, -30),
    accent: adjustBrightness(route.color, 20),
  };
};

/**
 * دالة مساعدة لتعديل سطوع اللون
 */
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * الحصول على الوحدات المتاحة لنوع مؤسسة معينة
 */
export const getAvailableModules = (type: InstitutionType): string[] => {
  const route = getInstitutionRoute(type);
  return route.modules;
};

/**
 * التحقق من أن المستخدم لديه إمكانية الوصول إلى وحدة معينة
 */
export const canAccessModule = (
  institutionType: InstitutionType,
  moduleName: string
): boolean => {
  const modules = getAvailableModules(institutionType);
  return modules.includes(moduleName);
};
