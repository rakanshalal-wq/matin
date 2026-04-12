export type InstitutionType = 'university' | 'school' | 'institute' | 'quran_center' | 'training_center' | 'kindergarten' | 'mosque';

export interface InstitutionRoute {
  type: InstitutionType;
  label: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  icon: string;
  dashboardPath: string;
  modules: string[];
}

export const INSTITUTION_ROUTES: Record<InstitutionType, InstitutionRoute> = {
  university: {
    type: 'university',
    label: 'جامعة',
    primaryColor: '#1A56DB',
    secondaryColor: '#1E3A8A',
    accentColor: '#F59E0B',
    icon: 'graduation',
    dashboardPath: '/dashboard/university-owner',
    modules: ['students', 'faculty', 'departments', 'courses', 'exams', 'grades', 'research', 'library'],
  },
  school: {
    type: 'school',
    label: 'مدرسة',
    primaryColor: '#1E88E5',
    secondaryColor: '#0D47A1',
    accentColor: '#FFB300',
    icon: 'school',
    dashboardPath: '/dashboard/school-owner',
    modules: ['students', 'teachers', 'classes', 'schedule', 'exams', 'grades', 'attendance', 'library'],
  },
  institute: {
    type: 'institute',
    label: 'معهد',
    primaryColor: '#0EA5E9',
    secondaryColor: '#0369A1',
    accentColor: '#F59E0B',
    icon: 'institute',
    dashboardPath: '/dashboard/institute-owner',
    modules: ['trainees', 'instructors', 'programs', 'courses', 'certifications', 'attendance', 'library'],
  },
  quran_center: {
    type: 'quran_center',
    label: 'مركز تحفيظ قرآن',
    primaryColor: '#047857',
    secondaryColor: '#065F46',
    accentColor: '#D4A843',
    icon: 'quran',
    dashboardPath: '/dashboard/supervisor',
    modules: ['students', 'teachers', 'halaqat', 'memorization', 'tajweed', 'exams', 'certificates', 'library'],
  },
  training_center: {
    type: 'training_center',
    label: 'مركز تدريب',
    primaryColor: '#E65100',
    secondaryColor: '#BF360C',
    accentColor: '#FF6D00',
    icon: 'training',
    dashboardPath: '/dashboard/training-owner',
    modules: ['trainees', 'trainers', 'courses', 'schedules', 'attendance', 'certificates', 'feedback', 'library'],
  },
  kindergarten: {
    type: 'kindergarten',
    label: 'روضة أطفال',
    primaryColor: '#EC4899',
    secondaryColor: '#BE185D',
    accentColor: '#F472B6',
    icon: 'kindergarten',
    dashboardPath: '/dashboard/kindergarten-owner',
    modules: ['children', 'caregivers', 'activities', 'reports', 'attendance'],
  },
  mosque: {
    type: 'mosque',
    label: 'مسجد',
    primaryColor: '#047857',
    secondaryColor: '#065F46',
    accentColor: '#D4A843',
    icon: 'mosque',
    dashboardPath: '/dashboard/supervisor',
    modules: ['halaqat', 'students', 'teachers', 'memorization'],
  },
};

export const getInstitutionRoute = (type: InstitutionType): InstitutionRoute => {
  return INSTITUTION_ROUTES[type] || INSTITUTION_ROUTES.school;
};

export const isValidInstitutionType = (type: string): type is InstitutionType => {
  return Object.keys(INSTITUTION_ROUTES).includes(type);
};

export const getInstitutionColors = (type: InstitutionType) => {
  const route = getInstitutionRoute(type);
  return {
    primary: route.primaryColor,
    secondary: route.secondaryColor,
    accent: route.accentColor,
  };
};
