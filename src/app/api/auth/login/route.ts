import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { comparePassword, signToken, getRoleRedirect } from '@/lib/auth';

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  role: string;
  full_name: string;
  institution_id: number | null;
  institution_type: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم
    const user = await queryOne<UserRow>(
      `SELECT id, email, password_hash, role, full_name, institution_id, institution_type
       FROM users
       WHERE email = $1 AND is_active = true
       LIMIT 1`,
      [email.toLowerCase().trim()]
    );

    if (!user) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const validPassword = await comparePassword(password, user.password_hash);
    if (!validPassword) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // إنشاء التوكن
    const token = signToken({
      userId: user.id,
      role: user.role,
      institutionId: user.institution_id ?? undefined,
      institutionType: user.institution_type as UserRow['institution_type'] & ('school' | 'university' | 'institute' | 'training' | 'quran') | undefined,
      name: user.full_name,
    });

    const redirect = getRoleRedirect(user.role);

    // وضع التوكن في httpOnly cookie
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
