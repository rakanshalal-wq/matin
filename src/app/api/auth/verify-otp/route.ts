import { NextResponse } from 'next/server';
import { pool, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        { success: false, message: 'رمز التحقق ومعرف المستخدم مطلوبان' },
        { status: 400 }
      );
    }

    // التحقق من الرمز
    const otpResult = await pool.query(
      'SELECT * FROM otp_codes WHERE user_id = $1 AND code = $2 AND used = false AND expires_at > NOW()',
      [userId, code]
    );

    if (otpResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'رمز التحقق غير صحيح أو منتهي الصلاحية' },
        { status: 401 }
      );
    }

    // تعليم الرمز كمستخدم
    await pool.query('UPDATE otp_codes SET used = true WHERE user_id = $1', [userId]);

    // جلب بيانات المستخدم
    const userResult = await pool.query(
      'SELECT id, name, email, role, school_id, owner_id, package, status, must_change_password FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];
    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        school_id: user.school_id,
        owner_id: user.owner_id,
        package: user.package,
        status: user.status,
        must_change_password: user.must_change_password || false,
      },
    });

    response.cookies.set('matin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
