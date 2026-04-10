import { NextResponse } from 'next/server';
import { pool, generateToken } from '@/lib/auth';
import { verifyTOTP } from '@/lib/totp';

/**
 * POST /api/auth/2fa/validate
 * يُكمل تسجيل الدخول بعد التحقق من رمز TOTP.
 * يُستدعى بعد نجاح /api/auth/login عندما يُعيد { require2FA: true, userId }.
 */
export async function POST(request: Request) {
  try {
    const { userId, token } = await request.json();

    if (!userId || !token) {
      return NextResponse.json(
        { success: false, message: 'معرف المستخدم والرمز مطلوبان' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT id, name, email, role, school_id, owner_id, package, status,
              totp_secret, totp_enabled
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'المستخدم غير موجود' }, { status: 404 });
    }

    const user = result.rows[0];

    if (!user.totp_enabled || !user.totp_secret) {
      return NextResponse.json(
        { success: false, message: 'المصادقة الثنائية غير مفعّلة لهذا المستخدم' },
        { status: 400 }
      );
    }

    // التحقق من عدم إعادة استخدام الرمز في نفس الدقيقة
    const tokenClean = String(token).replace(/\s/g, '');
    const now = new Date();
    const windowStart = new Date(now.getTime() - 90 * 1000); // نافذة 90 ثانية

    const usedCheck = await pool.query(
      'SELECT id FROM totp_used_tokens WHERE user_id = $1 AND token = $2 AND used_at > $3',
      [user.id, tokenClean, windowStart]
    );

    if (usedCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'تم استخدام هذا الرمز مسبقاً. انتظر الرمز التالي' },
        { status: 401 }
      );
    }

    if (!verifyTOTP(user.totp_secret, tokenClean)) {
      return NextResponse.json(
        { success: false, message: 'رمز المصادقة غير صحيح أو منتهي الصلاحية' },
        { status: 401 }
      );
    }

    // تسجيل الرمز كمستخدم لمنع إعادة استخدامه
    await pool.query(
      'INSERT INTO totp_used_tokens (user_id, token, used_at) VALUES ($1, $2, NOW())',
      [user.id, tokenClean]
    );

    // تنظيف الأكواد القديمة (أقدم من 5 دقائق)
    pool.query(
      'DELETE FROM totp_used_tokens WHERE used_at < NOW() - INTERVAL \'5 minutes\''
    ).catch(() => {});

    const jwt = generateToken(user);

    const response = NextResponse.json({
      success: true,
      token: jwt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        school_id: user.school_id,
        owner_id: user.owner_id,
        package: user.package,
        status: user.status,
      },
    });

    response.cookies.set('matin_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('2FA validate error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
