import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'matin_token';

// ===== التحقق الآمن من JWT (HMAC-SHA256) =====
// لا نستخدم atob() فقط — نتحقق من التوقيع فعلياً
async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const encoder = new TextEncoder();

    // إنشاء مفتاح HMAC من الـ secret
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // التحقق من التوقيع (signature verification)
    const data = encoder.encode(parts[0] + '.' + parts[1]);
    const sig = Uint8Array.from(
      atob(parts[2].replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (parts[2].length % 4)) % 4)),
      c => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify('HMAC', key, sig, data);
    if (!valid) return null;

    // فك ترميز الـ payload بعد التحقق من التوقيع
    const payload = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(
          atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')),
          c => c.charCodeAt(0)
        )
      )
    );

    // التحقق من انتهاء الصلاحية
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

// ===== المسارات العامة (لا تحتاج تسجيل دخول) =====
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/pricing',
  '/api/auth',
  '/api/public',
  '/api/schools/public',
  '/api/institutes/public',
  '/institution',
  '/school',
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) return true;
  if (/^\/school\/[^/]+$/.test(pathname) && !pathname.includes('dashboard')) return true;
  return false;
}

// ===== RBAC: التحكم بالوصول حسب الدور =====
const ROLE_ACCESS: Record<string, string[]> = {
  '/owner':              ['super_admin'],
  '/dashboard/owner':    ['owner'],
  '/dashboard/admin':    ['admin', 'owner'],
  '/dashboard/teacher':  ['teacher', 'admin', 'owner'],
  '/dashboard/parent':   ['parent'],
  '/dashboard/student':  ['student'],
  '/dashboard/trainer':  ['trainer', 'admin', 'owner'],
  '/dashboard/trainee':  ['trainee'],
  '/dashboard/muhaffiz': ['muhaffiz', 'supervisor', 'admin', 'owner'],
  '/dashboard/supervisor': ['supervisor', 'admin', 'owner'],
  '/dashboard/caregiver':  ['caregiver', 'admin', 'owner'],
  '/dashboard/hr':       ['admin', 'owner'],
};

function checkRBAC(pathname: string, role: string | undefined): boolean {
  if (!role) return false;

  // super_admin يوصل لكل شي
  if (role === 'super_admin') return true;

  for (const [prefix, allowedRoles] of Object.entries(ROLE_ACCESS)) {
    if (pathname.startsWith(prefix)) {
      return allowedRoles.includes(role);
    }
  }

  // مسارات dashboard عامة — أي مسجل دخول يوصل
  if (pathname.startsWith('/dashboard')) return true;

  return true;
}

// ===== دالة الـ Middleware الرئيسية (async لدعم WebCrypto) =====
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ===== نظام النطاقات الفرعية =====
  const host = request.headers.get('host') || '';
  const hostParts = host.split('.');
  if (hostParts.length >= 3) {
    const subdomain = hostParts[0];
    if (subdomain && !['www', 'app', 'api'].includes(subdomain)) {
      return NextResponse.rewrite(new URL('/institution/' + subdomain, request.url));
    }
  }

  // المسارات العامة
  if (isPublic(pathname)) return NextResponse.next();
  if (pathname.startsWith('/_next') || pathname.includes('.')) return NextResponse.next();
  if (pathname.startsWith('/api/payments/webhook')) return NextResponse.next();

  // ===== التحقق من التوكن =====
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ===== JWT_SECRET مطلوب =====
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[Middleware] JWT_SECRET not set');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ===== التحقق الكامل من التوقيع عبر WebCrypto (Edge-compatible) =====
  const payload = await verifyJWT(token, secret);
  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // RBAC: التحقق من الدور
  const role = payload.role as string | undefined;
  if (!checkRBAC(pathname, role)) {
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
  }

  // تمرير بيانات المستخدم عبر headers للـ API routes
  const response = NextResponse.next();
  response.headers.set('x-user-id', String(payload.id || ''));
  response.headers.set('x-user-role', String(payload.role || ''));
  response.headers.set('x-school-id', String(payload.school_id || ''));
  response.headers.set('x-owner-id', String(payload.owner_id || ''));

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
