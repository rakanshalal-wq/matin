/**
 * اختبارات الـ Middleware — منصة متين
 *
 * يتحقق من:
 * 1. الـ rate limiting على مسارات تسجيل الدخول
 * 2. حماية صفحات /dashboard بإعادة التوجيه للـ login
 * 3. حماية صفحة /owner لـ super_admin فقط
 * 4. السماح بالوصول للمسارات العامة
 * 5. Security headers مُضافة على كل رد
 */
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'matin_secret_2024';

function buildToken(role: string, pkg = 'pro'): string {
  return jwt.sign({ id: 1, email: 'test@matin.ink', role, package: pkg }, JWT_SECRET, { expiresIn: '1h' });
}

function makeCookieHeader(token: string) {
  return `matin_token=${token}`;
}

function makeRequest(pathname: string, opts: { cookie?: string; ip?: string; ua?: string } = {}): NextRequest {
  const { NextRequest: NR } = require('next/server');
  const url = `http://localhost:3000${pathname}`;
  const headers: Record<string, string> = {};
  if (opts.cookie) headers['cookie'] = opts.cookie;
  if (opts.ip) headers['x-forwarded-for'] = opts.ip;
  if (opts.ua) headers['user-agent'] = opts.ua;

  return new NR(url, { headers });
}

// ── مستورد لاحقاً لتجنب تهيئة Pool في الـ import ─────────────────
let middleware: (req: NextRequest) => ReturnType<typeof import('../src/middleware').middleware>;

// Mock لكل ما يستخدم قاعدة البيانات
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  })),
}));

beforeAll(async () => {
  process.env.MATIN_DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  process.env.JWT_SECRET = JWT_SECRET;
  process.env.ENCRYPTION_KEY = 'a'.repeat(64);
  const mod = await import('../src/middleware');
  middleware = mod.middleware;
});

// ── المسارات العامة ────────────────────────────────────────────────
describe('المسارات العامة — تمر بدون تحويل', () => {
  it('/login يُسمح له بالمرور', async () => {
    const req = makeRequest('/login');
    const res = await middleware(req);
    expect(res.status).not.toBe(302);
  });

  it('/register يُسمح له بالمرور', async () => {
    const req = makeRequest('/register');
    const res = await middleware(req);
    expect(res.status).not.toBe(302);
  });
});

// ── حماية /dashboard ───────────────────────────────────────────────
describe('/dashboard — يتطلب تسجيل دخول', () => {
  it('بدون token يُحوَّل لـ /login', async () => {
    const req = makeRequest('/dashboard/admin');
    const res = await middleware(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location') || '';
    expect(location).toContain('/login');
  });

  it('مع token صحيح يُسمح بالمرور', async () => {
    const token = buildToken('admin');
    const req = makeRequest('/dashboard/admin', { cookie: makeCookieHeader(token) });
    const res = await middleware(req);
    expect(res.status).not.toBe(307);
  });
});

// ── حماية /owner ────────────────────────────────────────────────────
describe('/owner — super_admin فقط', () => {
  it('بدون token يُحوَّل لـ /login', async () => {
    const req = makeRequest('/owner');
    const res = await middleware(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location') || '';
    expect(location).toContain('/login');
  });

  it('دور admin يُحوَّل لـ /login', async () => {
    const token = buildToken('admin');
    const req = makeRequest('/owner', { cookie: makeCookieHeader(token) });
    const res = await middleware(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location') || '';
    expect(location).toContain('/login');
  });

  it('دور super_admin يُسمح بالمرور', async () => {
    const token = buildToken('super_admin');
    const req = makeRequest('/owner/dashboard', { cookie: makeCookieHeader(token) });
    const res = await middleware(req);
    expect(res.status).not.toBe(307);
  });
});

// ── super_admin يُحوَّل من /dashboard إلى /owner ────────────────────
describe('super_admin في /dashboard يُحوَّل لـ /owner', () => {
  it('super_admin يُحوَّل تلقائياً', async () => {
    const token = buildToken('super_admin');
    const req = makeRequest('/dashboard/admin', { cookie: makeCookieHeader(token) });
    const res = await middleware(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location') || '';
    expect(location).toContain('/owner');
  });
});

// ── Rate Limiting ────────────────────────────────────────────────────
describe('Rate Limiting على مسار /api/auth/login', () => {
  it('يرفض الطلب السادس من نفس IP خلال 15 دقيقة', async () => {
    const uniqueIp = `192.168.100.${Math.floor(Math.random() * 200)}`;
    let lastResponse: Response | undefined;
    // 5 محاولات مسموحة
    for (let i = 0; i < 5; i++) {
      lastResponse = await middleware(makeRequest('/api/auth/login', { ip: uniqueIp }));
    }
    // المحاولة السادسة تُحجب
    lastResponse = await middleware(makeRequest('/api/auth/login', { ip: uniqueIp }));
    expect(lastResponse?.status).toBe(429);
  });
});

// ── حظر User Agents المشبوهة ───────────────────────────────────────
describe('حظر User Agents المشبوهة', () => {
  it('sqlmap يُرفض بـ 403', async () => {
    const req = makeRequest('/api/students', { ua: 'sqlmap/1.7' });
    const res = await middleware(req);
    expect(res.status).toBe(403);
  });
});

// ── Security Headers ───────────────────────────────────────────────
describe('Security Headers على كل رد', () => {
  it('X-Frame-Options مضبوط على DENY', async () => {
    const token = buildToken('admin');
    const req = makeRequest('/dashboard/admin', { cookie: makeCookieHeader(token) });
    const res = await middleware(req);
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
  });

  it('X-Content-Type-Options مضبوط', async () => {
    const token = buildToken('admin');
    const req = makeRequest('/dashboard/admin', { cookie: makeCookieHeader(token) });
    const res = await middleware(req);
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });
});
