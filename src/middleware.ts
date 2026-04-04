import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const COOKIE_NAME = 'matin_token';

// المسارات المحمية وأدوارها المسموحة
const PROTECTED_ROUTES: { prefix: string; roles: string[] }[] = [
  { prefix: '/owner', roles: ['super_admin'] },
  {
    prefix: '/school',
    roles: ['school_owner', 'teacher', 'parent_school', 'hr_school'],
  },
  {
    prefix: '/university',
    roles: [
      'university_president',
      'university_dean',
      'professor',
      'university_student',
      'parent_university',
      'hr_university',
    ],
  },
  { prefix: '/institute', roles: ['institute_admin'] },
  {
    prefix: '/training',
    roles: ['training_manager', 'trainer', 'trainee'],
  },
  {
    prefix: '/quran',
    roles: ['quran_admin', 'quran_teacher', 'quran_supervisor', 'quran_student'],
  },
];

// مسارات عامة لا تحتاج توثيق
const PUBLIC_PATHS = ['/', '/login', '/register', '/api/auth'];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // السماح للمسارات العامة
  if (isPublic(pathname)) return NextResponse.next();

  // السماح للملفات الثابتة
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyToken(token) : null;

  // غير موثَّق → تسجيل الدخول
  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // التحقق من صلاحية الدور
  for (const route of PROTECTED_ROUTES) {
    if (pathname.startsWith(route.prefix)) {
      if (!route.roles.includes(payload.role)) {
        // الدور غير مسموح → إعادة توجيه للصفحة المناسبة
        const allowed = getRoleHome(payload.role);
        return NextResponse.redirect(new URL(allowed, request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

function getRoleHome(role: string): string {
  const map: Record<string, string> = {
    super_admin: '/owner/dashboard',
    school_owner: '/school/dashboard',
    teacher: '/school/teacher',
    parent_school: '/school/parent',
    hr_school: '/school/hr',
    university_president: '/university/president',
    university_dean: '/university/dean',
    professor: '/university/professor',
    university_student: '/university/student',
    parent_university: '/university/parent',
    hr_university: '/university/hr',
    institute_admin: '/institute/dashboard',
    training_manager: '/training/manager',
    trainer: '/training/trainer',
    trainee: '/training/trainee',
    quran_admin: '/quran/dashboard',
    quran_teacher: '/quran/teacher',
    quran_supervisor: '/quran/supervisor',
    quran_student: '/quran/student',
  };
  return map[role] ?? '/login';
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
