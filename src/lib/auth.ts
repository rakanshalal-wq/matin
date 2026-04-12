import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// ────────────────────────────────────────────────
// JWT Secret — يجب تعيينه في .env (مطلوب في production)
// ────────────────────────────────────────────────
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET غير معيّن — يجب تعيين متغير البيئة JWT_SECRET في production');
    }
    // في development فقط — تحذير واضح
    console.warn('⚠️  JWT_SECRET غير معيّن — يُستخدم مفتاح مؤقت لـ development فقط');
    return 'dev-only-secret-not-for-production-use';
  }
  if (secret.length < 32) {
    console.warn('⚠️  JWT_SECRET قصير جداً — يُنصح باستخدام مفتاح لا يقل عن 32 حرفاً');
  }
  return secret;
}

const COOKIE_NAME = 'matin_token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 أيام

export interface TokenPayload {
  userId: number;
  role: string;
  institutionId?: number;
  institutionType?: 'school' | 'university' | 'institute' | 'training' | 'quran';
  name: string;
}

// ────────────────────────────────────────────────
// JWT
// ────────────────────────────────────────────────
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: MAX_AGE });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────
// Password
// ────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ────────────────────────────────────────────────
// Cookie helpers (Server Components / Route Handlers)
// ────────────────────────────────────────────────
export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function getTokenFromCookies(): string | null {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export function getCurrentUser(): TokenPayload | null {
  const token = getTokenFromCookies();
  if (!token) return null;
  return verifyToken(token);
}

// ────────────────────────────────────────────────
// Role → redirect path
// ────────────────────────────────────────────────
export function getRoleRedirect(role: string): string {
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
