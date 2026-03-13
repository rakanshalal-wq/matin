import { NextResponse } from 'next/server';
import { pool, generateToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, bio, avatar, package: pkg } = await request.json();

    // التحقق من الحقول المطلوبة
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صيغة الإيميل
    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'صيغة البريد الإلكتروني غير صحيحة' },
        { status: 400 }
      );
    }

    // التحقق من قوة كلمة المرور
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
        { status: 400 }
      );
    }

    // التحقق من الاسم
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'الاسم يجب أن يكون حرفين على الأقل' },
        { status: 400 }
      );
    }

    // تحقق من تكرار الإيميل
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, bio, avatar, role, package, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'owner', $7, 'pending', NOW())
       RETURNING id, name, email, role, school_id, owner_id, package, status`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        hashedPassword,
        phone?.trim() || null,
        bio || 'مالك مدارس',
        avatar || '👤',
        pkg || 'basic'
      ]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        package: user.package,
        status: user.status,
      },
      message: 'تم التسجيل بنجاح. حسابك قيد المراجعة'
    });

    response.cookies.set('matin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'حدث خطأ في التسجيل' },
      { status: 500 }
    );
  }
}
