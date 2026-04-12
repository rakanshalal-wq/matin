/**
 * rate-limit.ts
 * Rate limiter بسيط في الذاكرة — يمنع هجمات brute force على `/api/auth/login`
 * في production يُنصح باستخدام Redis-based rate limiter مثل `@upstash/ratelimit`
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

// خريطة: key (IP أو email) → بيانات المحاولات
const store = new Map<string, RateLimitEntry>();

// تنظيف الإدخالات المنتهية كل 5 دقائق لتجنب تسرب الذاكرة
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    const windowExpired = now - entry.firstAttempt > WINDOW_MS;
    const blockExpired = !entry.blockedUntil || now > entry.blockedUntil;
    if (windowExpired && blockExpired) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ────────────────────────────────────────────────
// الإعدادات
// ────────────────────────────────────────────────
const MAX_ATTEMPTS = 10;       // عدد المحاولات المسموحة
const WINDOW_MS = 15 * 60 * 1000; // نافذة زمنية: 15 دقيقة
const BLOCK_MS = 15 * 60 * 1000;  // مدة الحظر: 15 دقيقة

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

/**
 * يفحص ما إذا كان الـ key مسموحاً له بالمحاولة
 * @param key - عادةً IP أو email
 */
export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // محظور؟
  if (entry?.blockedUntil && now < entry.blockedUntil) {
    const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  // لا يوجد سجل أو انتهت النافذة الزمنية → بداية جديدة
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    store.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  // زيادة العداد
  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS;
    const retryAfterSeconds = Math.ceil(BLOCK_MS / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

/**
 * يحذف سجل المحاولات عند تسجيل الدخول الناجح
 * (يمنع تراكم محاولات المستخدم الصحيح)
 */
export function resetRateLimit(key: string): void {
  store.delete(key);
}

/**
 * يستخرج IP من الـ request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = (request as any).headers?.get?.('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return (request as any).headers?.get?.('x-real-ip') ?? 'unknown';
}
