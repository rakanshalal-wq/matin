import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { comparePassword, signToken, getRoleRedirect } from '@/lib/auth';
import { checkRateLimit, resetRateLimit, getClientIp, formatRetryAfter } from '@/lib/rate-limit';

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  role: string;
  full_name: string;
  institution_id: number | null;
  institution_type: string | null;
}

// ─── Input Validation ──────────────────────────
function validateLoginInput(email: unknown, password: unknown): string | null {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return 'البريد الإلكتروني وكلمة المرور يجب أن تكونا نصاً';
  }
  if (!email.trim()) return 'البريد الإلكتروني مطلوب';
  if (!password)     return 'كلمة المرور مطلوبة';

  // التحقق من صيغة البريد الإلكتروني
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'صيغة البريد الإلكتروني غير صحيحة';
  }
  if (email.length > 255) return 'البريد الإلكتروني طويل جداً';
  if (password.length < 4) return 'كلمة المرور قصيرة جداً';
  if (password.length > 128) return 'كلمة المرور طويلة جداً';

  return null;
}

export async function POST(request: NextRequest) {
  // ─── Rate Limiting ──────────────────────────
  const ip = getClientIp(request);
  const ipLimit = checkRateLimit(`ip:${ip}`);

  if (!ipLimit.allowed) {
    const timeLabel = formatRetryAfter(ipLimit.retryAfterSeconds ?? 900);
    return NextResponse.json(
      {
        message: `تم تجاوز الحد المسموح به من المحاولات. يرجى الانتظار ${timeLabel}.`,
        retryAfter: ipLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(ipLimit.retryAfterSeconds ?? 900),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body as { email?: unknown; password?: unknown };

    // ─── Input Validation ─────────────────────
    const validationError = validateLoginInput(email, password);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const normalizedEmail = (email as string).toLowerCase().trim();

    // ─── Rate limit per email ─────────────────
    const emailLimit = checkRateLimit(`email:${normalizedEmail}`);
    if (!emailLimit.allowed) {
      const timeLabel = formatRetryAfter(emailLimit.retryAfterSeconds ?? 900);
      return NextResponse.json(
        {
          message: `تم قفل هذا الحساب مؤقتاً بسبب محاولات كثيرة. حاول بعد ${timeLabel}.`,
          retryAfter: emailLimit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // ─── البحث عن المستخدم ────────────────────
    const user = await queryOne<UserRow>(
      `SELECT id, email, password_hash, role, full_name, institution_id, institution_type
       FROM users
       WHERE email = $1 AND is_active = true
       LIMIT 1`,
      [normalizedEmail]
    );

    if (!user) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const validPassword = await comparePassword(password as string, user.password_hash);
    if (!validPassword) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // نجح تسجيل الدخول — امسح سجل المحاولات
    resetRateLimit(`ip:${ip}`);
    resetRateLimit(`email:${normalizedEmail}`);

    // ─── إنشاء التوكن ─────────────────────────
    const token = signToken({
      userId: user.id,
      role: user.role,
      institutionId: user.institution_id ?? undefined,
      institutionType: user.institution_type as UserRow['institution_type'] & ('school' | 'university' | 'institute' | 'training' | 'quran') | undefined,
      name: user.full_name,
    });

    const redirect = getRoleRedirect(user.role);

    const response = NextResponse.json({ success: true, redirect });
    response.cookies.set('matin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json(
      { message: 'حدث خطأ داخلي، حاول لاحقاً' },
      { status: 500 }
    );
  }
}
