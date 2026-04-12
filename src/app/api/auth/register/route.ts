import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { checkRateLimit, getClientIp, formatRetryAfter } from '@/lib/rate-limit';

// ─── الأدوار حسب نوع المؤسسة ───────────────────
const ROLE_MAP: Record<string, string> = {
  school:     'school_owner',
  quran:      'quran_admin',
  institute:  'institute_admin',
  training:   'training_manager',
  university: 'university_president',
};

const VALID_TYPES = Object.keys(ROLE_MAP);

// ─── التحقق من المدخلات ────────────────────────
function validateInput(
  institutionType: unknown,
  institutionName: unknown,
  ownerName: unknown,
  email: unknown,
  password: unknown,
): string | null {
  if (
    typeof institutionType !== 'string' ||
    typeof institutionName !== 'string' ||
    typeof ownerName !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return 'جميع الحقول مطلوبة';
  }

  if (!VALID_TYPES.includes(institutionType.trim())) {
    return 'نوع المؤسسة غير صحيح';
  }
  if (!institutionName.trim() || institutionName.length > 200) {
    return 'اسم المؤسسة مطلوب (200 حرف كحد أقصى)';
  }
  if (!ownerName.trim() || ownerName.length > 200) {
    return 'اسم المالك مطلوب (200 حرف كحد أقصى)';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim()) || email.length > 255) {
    return 'صيغة البريد الإلكتروني غير صحيحة';
  }
  if (password.length < 8 || password.length > 128) {
    return 'كلمة المرور يجب أن تكون بين 8 و128 حرفاً';
  }

  return null;
}

export async function POST(request: NextRequest) {
  // ─── Rate Limiting ──────────────────────────
  const ip = getClientIp(request);
  const ipLimit = checkRateLimit(`register:ip:${ip}`);

  if (!ipLimit.allowed) {
    const timeLabel = formatRetryAfter(ipLimit.retryAfterSeconds ?? 900);
    return NextResponse.json(
      {
        success: false,
        message: `تم تجاوز الحد المسموح به من المحاولات. يرجى الانتظار ${timeLabel}.`,
        retryAfter: ipLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(ipLimit.retryAfterSeconds ?? 900) },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { institutionType, institutionName, ownerName, email, password } = body as {
      institutionType?: unknown;
      institutionName?: unknown;
      ownerName?: unknown;
      email?: unknown;
      password?: unknown;
    };

    // ─── التحقق من المدخلات ──────────────────
    const validationError = validateInput(institutionType, institutionName, ownerName, email, password);
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    const normalizedEmail = (email as string).toLowerCase().trim();
    const normalizedType  = (institutionType as string).trim();

    // ─── التحقق من تفرد البريد ───────────────
    const existing = await queryOne<{ id: number }>(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [normalizedEmail]
    );

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // ─── تشفير كلمة المرور ───────────────────
    const passwordHash = await hashPassword(password as string);

    const role = ROLE_MAP[normalizedType];

    // ─── إنشاء المستخدم ──────────────────────
    const userRows = await query<{ id: number }>(
      `INSERT INTO users (email, password_hash, full_name, role, institution_type, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       RETURNING id`,
      [normalizedEmail, passwordHash, (ownerName as string).trim(), role, normalizedType]
    );

    const userId = userRows[0]?.id;
    if (!userId) {
      throw new Error('فشل إنشاء المستخدم');
    }

    // ─── إنشاء المؤسسة حسب النوع ─────────────
    await createInstitution(normalizedType, (institutionName as string).trim(), userId);

    return NextResponse.json(
      { success: true, message: 'تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن', redirect: '/login' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ داخلي، حاول لاحقاً' },
      { status: 500 }
    );
  }
}

// ─── إنشاء سجل المؤسسة في الجدول المناسب ────────
async function createInstitution(type: string, name: string, ownerId: number): Promise<void> {
  const tableMap: Record<string, string> = {
    school:     'schools',
    quran:      'quran_centers',
    institute:  'institutes',
    training:   'training_centers',
    university: 'universities',
  };

  const table = tableMap[type];
  if (!table) return;

  try {
    await query(
      `INSERT INTO ${table} (name, owner_id, created_at)
       VALUES ($1, $2, NOW())`,
      [name, ownerId]
    );
  } catch (err) {
    // إذا لم يكن الجدول موجوداً بعد نتجاهل الخطأ — المستخدم يُنشأ على أي حال
    console.warn(`[REGISTER] Could not insert into ${table}:`, err);
  }
}
