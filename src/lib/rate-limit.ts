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

// ────────────────────────────────────────────────
// الإعدادات
// ────────────────────────────────────────────────
const MAX_ATTEMPTS = 10;           // عدد المحاولات المسموحة
const WINDOW_MS = 15 * 60 * 1000; // نافذة زمنية: 15 دقيقة
const BLOCK_MS  = 15 * 60 * 1000; // مدة الحظر: 15 دقيقة

// ─── تنظيف lazy ─────────────────────────────────
// يُنظَّف مع كل طلب بدل setInterval لأن serverless environments لا تضمن تشغيله
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // كل 5 دقائق

function maybePurgeExpired(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    const windowExpired = now - entry.firstAttempt > WINDOW_MS;
    const blockExpired  = !entry.blockedUntil || now > entry.blockedUntil;
    if (windowExpired && blockExpired) {
      store.delete(key);
    }
  }
}

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
  maybePurgeExpired();
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
 */
export function resetRateLimit(key: string): void {
  store.delete(key);
}

/**
 * يُنسّق الوقت بالعربية (ثواني أو دقائق)
 */
export function formatRetryAfter(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.ceil(seconds / 60);
    return minutes === 1 ? 'دقيقة واحدة' : `${minutes} دقائق`;
  }
  if (seconds === 1) return 'ثانية واحدة';
  if (seconds <= 10) return `${seconds} ثواني`;
  return `${seconds} ثانية`;
}

/**
 * يستخرج IP من الـ request headers (Next.js Request)
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}
