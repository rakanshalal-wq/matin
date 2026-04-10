import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { verifyTOTP } from '@/lib/totp';

/**
 * POST /api/auth/2fa/disable
 * يعطّل المصادقة الثنائية بعد التحقق من رمز TOTP أو كلمة المرور.
 */
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }

    const { token } = await request.json();
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, message: 'رمز TOTP الحالي مطلوب لتعطيل المصادقة الثنائية' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'SELECT totp_secret, totp_enabled FROM users WHERE id = $1',
      [user.id]
    );
    const row = result.rows[0];

    if (!row?.totp_enabled || !row?.totp_secret) {
      return NextResponse.json(
        { success: false, message: 'المصادقة الثنائية غير مفعّلة أصلاً' },
        { status: 400 }
      );
    }

    if (!verifyTOTP(row.totp_secret, token.replace(/\s/g, ''))) {
      return NextResponse.json(
        { success: false, message: 'رمز TOTP غير صحيح' },
        { status: 401 }
      );
    }

    await pool.query(
      'UPDATE users SET totp_secret = NULL, totp_enabled = false, totp_enabled_at = NULL WHERE id = $1',
      [user.id]
    );

    // حذف الأكواد المستخدمة لهذا المستخدم
    await pool.query('DELETE FROM totp_used_tokens WHERE user_id = $1', [user.id]);

    return NextResponse.json({
      success: true,
      message: 'تم تعطيل المصادقة الثنائية بنجاح',
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
