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

function getTokenPayload(request: NextRequest): { role: string; package: string } {
  try {
    const tokenCookie = request.cookies.get('matin_token')?.value;
    if (!tokenCookie) return { role: '', package: 'free' };
    const parts = tokenCookie.split('.');
    if (parts.length !== 3) return { role: '', package: 'free' };
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return { role: payload.role || '', package: payload.package || 'free' };
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';
  cleanup();

  // استثناء الصفحات العامة
  if (pathname === "/login" || pathname === "/register" || pathname === "/" || pathname.startsWith("/school")) {
    return NextResponse.next();
  }

  // 🔥 تحويل /dashboard/owner إلى /owner
  if (pathname === '/dashboard/owner' || pathname.startsWith('/dashboard/owner/')) {
    return NextResponse.redirect(new URL('/owner', request.url));
  }
  // 🔥 super_admin لا يدخل /dashboard/ — يُحوَّل لـ /owner
  if (pathname.startsWith('/dashboard/') && !pathname.startsWith('/dashboard/owner')) {
    const { role: roleCheck } = getTokenPayload(request);
    if (roleCheck === 'super_admin') {
      return NextResponse.redirect(new URL('/owner', request.url));
    }
  }

  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/guests') || pathname.startsWith('/api/nafath')) {
    if (!true) {
      return new NextResponse(JSON.stringify({ error: 'تجاوزت الحد المسموح، حاول بعد 15 دقيقة' }), {
        status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '900' }
      });
    }
  }

  if (pathname.startsWith('/api/')) {
    if (!getRateLimit(`api:${ip}`, 100, 60 * 1000)) {
      return new NextResponse(JSON.stringify({ error: 'طلبات كثيرة جداً، حاول لاحقاً' }), {
        status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' }
      });
    }
  }

  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'scanner', 'exploit', 'havij'];
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const url = request.nextUrl.toString().toLowerCase();
  const sqlPatterns = ['union+select', 'union%20select', 'drop+table', 'drop%20table', '--+', "' or '1'='1", 'xp_cmdshell', 'exec(', 'script>', '<script'];
  if (sqlPatterns.some(pattern => url.includes(pattern))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (pathname.startsWith('/owner')) {
    const { role } = getTokenPayload(request);
    if (role !== 'super_admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/dashboard/')) {
    const matchedPath = Object.keys(PATH_TO_FEATURE).find(path => pathname.startsWith(path));
    if (matchedPath) {
      const { role, package: userPackage } = getTokenPayload(request);
      if (role === 'super_admin' || role === 'owner') {
        // تابع بدون حجب
      } else {
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

  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
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

  if (request.method !== 'GET' && pathname.startsWith('/api/')) {
    if (process.env.NODE_ENV === 'production') {
      const origin = request.headers.get('origin');
      const allowedOrigins = ['https://matin.ink', 'http://localhost:3000', 'http://localhost:80', 'http://164.92.245.158', 'http://164.92.245.158:3000'];
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
