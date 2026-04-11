import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'matin_token';

function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch { return null; }
}

const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/pricing', '/api/auth', '/api/public', '/api/schools/public', '/api/institutes/public', '/institution', '/school'];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) return true;
  if (/^\/school\/[^/]+$/.test(pathname) && !pathname.includes('dashboard')) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ===== نظام النطاقات الفرعية =====
  const host = request.headers.get('host') || '';
  const parts = host.split('.');

  // فقط 3+ أجزاء = subdomain (مثل school1.matin.ink)
  // matin.ink = جزئين = الموقع الرئيسي
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain && !['www','app','api'].includes(subdomain)) {
      return NextResponse.rewrite(new URL('/institution/' + subdomain, request.url));
    }
  }

  if (isPublic(pathname)) return NextResponse.next();
  if (pathname.startsWith('/_next') || pathname.includes('.')) return NextResponse.next();
  if (pathname.startsWith('/api/payments/webhook')) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? decodeJWT(token) : null;

  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // نظام التوجيه الذكي: التحقق من نوع المؤسسة
  if (pathname.startsWith('/dashboard')) {
    // يمكن إضافة منطق إضافي هنا للتحقق من نوع المؤسسة
    // والتأكد من أن المستخدم له إمكانية الوصول إلى المسار المطلوب
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
