import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ===== نظام الأمان والباقات - منصة متين =====
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

let cleanupCounter = 0;
function cleanup() {
  cleanupCounter++;
  if (cleanupCounter % 1000 === 0) {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) rateLimitMap.delete(key);
    }
  }
}

// تنبيه أمني: هذه الدالة تفك تشفير حمولة JWT للـ UI فقط (feature-gating على مستوى الصفحات).
// الحماية الفعلية تتم في كل API route عبر getUserFromRequest() التي تتحقق من التوقيع.
// مستخدم يعدّل الكوكي يدوياً سيحصل على واجهة مختلفة لكن ستُرفض طلباته من الـ API.
function getTokenPayload(request: NextRequest): { role: string; package: string } {
  try {
    const tokenCookie = request.cookies.get('matin_token')?.value;
    if (!tokenCookie) return { role: '', package: 'free' };
    const parts = tokenCookie.split('.');
    if (parts.length !== 3) return { role: '', package: 'free' };
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    // التحقق الأساسي: يجب أن تكون قيم role و package سلاسل نصية بسيطة
    const role = typeof payload.role === 'string' ? payload.role : '';
    const pkg = typeof payload.package === 'string' ? payload.package : 'free';
    return { role, package: pkg };
  } catch {
    return { role: '', package: 'free' };
  }
}

const PLAN_FEATURES: Record<string, string[]> = {
  free: ['attendance', 'grades', 'messages', 'students', 'teachers', 'classes', 'subjects', 'schedules', 'homework'],
  basic: ['attendance', 'grades', 'messages', 'students', 'teachers', 'classes', 'subjects', 'schedules', 'homework', 'exams', 'library', 'reports', 'announcements'],
  pro: ['attendance', 'grades', 'messages', 'students', 'teachers', 'classes', 'subjects', 'schedules', 'homework', 'exams', 'library', 'reports', 'announcements', 'store', 'ai-chat', 'export', 'community', 'social', 'payroll', 'leaves', 'employees'],
  enterprise: ['attendance', 'grades', 'messages', 'students', 'teachers', 'classes', 'subjects', 'schedules', 'homework', 'exams', 'library', 'reports', 'announcements', 'store', 'ai-chat', 'export', 'community', 'social', 'payroll', 'leaves', 'employees', 'transport', 'cafeteria', 'health', 'clinic', 'vaccinations', 'driver-app', 'api', 'white-label', 'integrations'],
};

// مطابقة صفحات Dashboard بالميزات
const PATH_TO_FEATURE: Record<string, string> = {
  '/dashboard/ai-chat': 'ai-chat',
  '/dashboard/export': 'export',
  '/dashboard/community': 'community',
  '/dashboard/social': 'social',
  '/dashboard/store': 'store',
  '/dashboard/transport': 'transport',
  '/dashboard/cafeteria': 'cafeteria',
  '/dashboard/health': 'health',
  '/dashboard/clinic': 'clinic',
  '/dashboard/vaccinations': 'vaccinations',
  '/dashboard/driver-app': 'driver-app',
  '/dashboard/payroll': 'payroll',
  '/dashboard/leaves': 'leaves',
  '/dashboard/employees': 'employees',
  '/dashboard/integrations': 'integrations',
};

// مطابقة API routes بالميزات لتطبيق Package Enforcement على مستوى API
const API_PATH_TO_FEATURE: Record<string, string> = {
  '/api/ai-chat': 'ai-chat',
  '/api/store': 'store',
  '/api/transport': 'transport',
  '/api/cafeteria': 'cafeteria',
  '/api/clinic': 'clinic',
  '/api/payroll': 'payroll',
  '/api/employees': 'employees',
  '/api/integrations': 'integrations',
  '/api/community': 'community',
  '/api/export': 'export',
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';
  cleanup();

  // استثناء الصفحات العامة
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/school') ||
    pathname.startsWith('/quran/')   // بوابة مراكز التحفيظ العامة
  ) {
    return NextResponse.next();
  }

  // 🔥 super_admin لا يدخل /dashboard/ — يُحوَّل لـ /owner
  if (pathname.startsWith('/dashboard/')) {
    const { role: roleCheck } = getTokenPayload(request);
    if (roleCheck === 'super_admin') {
      return NextResponse.redirect(new URL('/owner', request.url));
    }
  }

  // ===== Rate Limiting =====
  // صارم على login وOTP: 5 محاولات كل 15 دقيقة (حماية من brute force)
  if (pathname === '/api/auth/login' || pathname === '/api/auth/verify-otp' || pathname.startsWith('/api/nafath') || pathname === '/api/auth/forgot-password' || pathname === '/api/auth/reset-password') {
    if (!getRateLimit(`strict:${ip}`, 5, 15 * 60 * 1000)) {
      return new NextResponse(JSON.stringify({ error: 'تجاوزت الحد المسموح، حاول بعد 15 دقيقة' }), {
        status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '900' }
      });
    }
  }
  // متوسط على باقي auth: 20 طلب/دقيقة
  else if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/guests')) {
    if (!getRateLimit(`auth:${ip}`, 20, 60 * 1000)) {
      return new NextResponse(JSON.stringify({ error: 'طلبات كثيرة جداً، حاول لاحقاً' }), {
        status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' }
      });
    }
  }
  // عام على باقي API: 100 طلب/دقيقة
  else if (pathname.startsWith('/api/')) {
    if (!getRateLimit(`api:${ip}`, 100, 60 * 1000)) {
      return new NextResponse(JSON.stringify({ error: 'طلبات كثيرة جداً، حاول لاحقاً' }), {
        status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' }
      });
    }
  }

  // ===== حماية من User Agents المشبوهة =====
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'scanner', 'exploit', 'havij'];
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ===== حماية من SQL Injection في URL =====
  const url = request.nextUrl.toString().toLowerCase();
  const sqlPatterns = ['union+select', 'union%20select', 'drop+table', 'drop%20table', '--+', "' or '1'='1", 'xp_cmdshell', 'exec(', 'script>', '<script'];
  if (sqlPatterns.some(pattern => url.includes(pattern))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ===== حماية صفحة /owner =====
  if (pathname.startsWith('/owner')) {
    const { role } = getTokenPayload(request);
    if (role !== 'super_admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ===== حماية جميع صفحات /dashboard =====
  // أي شخص بدون token صحيح يُحوَّل لصفحة تسجيل الدخول
  if (pathname.startsWith('/dashboard')) {
    const { role } = getTokenPayload(request);
    if (!role) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ===== حماية صفحات الأدوار الخاصة =====
  // كل دور يُوجَّه لصفحاته فقط، ولا يستطيع الوصول لصفحات الأدوار الأخرى
  if (pathname.startsWith('/dashboard/')) {
    const { role } = getTokenPayload(request);
    // الصفحات المقيدة بأدوار محددة فقط
    const ROLE_RESTRICTED: Record<string, string[]> = {
      '/dashboard/university-dean': ['university_dean', 'super_admin', 'owner'],
      '/dashboard/quran-supervisor': ['quran_supervisor', 'super_admin', 'owner'],
      '/dashboard/quran-teacher': ['quran_teacher', 'quran_supervisor', 'super_admin', 'owner'],
      '/dashboard/quran-live': ['quran_teacher', 'quran_supervisor', 'super_admin', 'owner'],
      '/dashboard/quran-parent': ['student', 'parent', 'super_admin', 'owner'],
      '/dashboard/school-owner': ['owner_school', 'owner', 'super_admin'],
      '/dashboard/super-admin': ['super_admin'],
    };
    const matchedRestricted = Object.keys(ROLE_RESTRICTED).find(p => pathname.startsWith(p));
    if (matchedRestricted && role) {
      const allowed = ROLE_RESTRICTED[matchedRestricted];
      if (!allowed.includes(role)) {
        // توجيه المستخدم لصفحته الخاصة بدلاً من عرض خطأ
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // ===== Package Enforcement على صفحات Dashboard =====
  if (pathname.startsWith('/dashboard/')) {
    const matchedPath = Object.keys(PATH_TO_FEATURE).find(path => pathname.startsWith(path));
    if (matchedPath) {
      const { role, package: userPackage } = getTokenPayload(request);
      if (role !== 'super_admin' && role !== 'owner') {
        const requiredFeature = PATH_TO_FEATURE[matchedPath];
        const allowedFeatures = PLAN_FEATURES[userPackage] || PLAN_FEATURES.free;
        if (!allowedFeatures.includes(requiredFeature)) {
          const subscribeUrl = new URL('/dashboard/subscribe', request.url);
          subscribeUrl.searchParams.set('feature', requiredFeature);
          subscribeUrl.searchParams.set('current_plan', userPackage);
          let requiredPlan = 'pro';
          if (PLAN_FEATURES.basic.includes(requiredFeature)) requiredPlan = 'basic';
          if (!PLAN_FEATURES.pro.includes(requiredFeature)) requiredPlan = 'enterprise';
          subscribeUrl.searchParams.set('required_plan', requiredPlan);
          return NextResponse.redirect(subscribeUrl);
        }
      }
    }
  }

  // ===== Package Enforcement على API routes =====
  // يمنع الوصول المباشر للـ API حتى لو تجاوز المستخدم الـ UI
  if (pathname.startsWith('/api/')) {
    const matchedApiPath = Object.keys(API_PATH_TO_FEATURE).find(path => pathname.startsWith(path));
    if (matchedApiPath) {
      const { role, package: userPackage } = getTokenPayload(request);
      // super_admin وowner لا يُقيَّدان
      if (role !== 'super_admin' && role !== 'owner' && role !== '') {
        const requiredFeature = API_PATH_TO_FEATURE[matchedApiPath];
        const allowedFeatures = PLAN_FEATURES[userPackage] || PLAN_FEATURES.free;
        if (!allowedFeatures.includes(requiredFeature)) {
          return new NextResponse(
            JSON.stringify({ error: 'هذه الميزة غير متاحة في باقتك الحالية', feature: requiredFeature, current_plan: userPackage }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }
  }

  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(self), microphone=(), geolocation=(self), payment=()');
  response.headers.set('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' https://api.anthropic.com https://api.resend.com https://api.openai.com; " +
    "frame-ancestors 'none';"
  );
  response.headers.set('X-Powered-By', 'matin');

  // ===== CORS للـ API في Production =====
  if (request.method !== 'GET' && pathname.startsWith('/api/')) {
    if (process.env.NODE_ENV === 'production') {
      const origin = request.headers.get('origin');
      const extraOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : [];
      const allowedOrigins = ['https://matin.ink', 'http://localhost:3000', 'http://localhost:80', ...extraOrigins];
      const isAllowed = !origin || allowedOrigins.includes(origin);
      if (!isAllowed) {
        return new NextResponse(JSON.stringify({ error: 'غير مسموح' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|register|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};
