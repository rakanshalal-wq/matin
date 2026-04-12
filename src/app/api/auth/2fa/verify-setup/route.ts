import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { verifyTOTP } from '@/lib/totp';

/**
 * POST /api/auth/2fa/verify-setup
 * يتحقق من أن المستخدم أدخل الرمز الصحيح من تطبيق المصادقة،
 * ثم يُفعّل 2FA بشكل دائم في قاعدة البيانات.
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
        { success: false, message: 'الرمز مطلوب' },
        { status: 400 }
      );
    }

    // جلب السر المؤقت من قاعدة البيانات
    const result = await pool.query(
      'SELECT totp_secret, totp_enabled FROM users WHERE id = $1',
      [user.id]
    );
    const row = result.rows[0];

    if (!row?.totp_secret) {
      return NextResponse.json(
        { success: false, message: 'لم يتم إعداد المصادقة الثنائية بعد. ابدأ من /api/auth/2fa/setup' },
        { status: 400 }
      );
    }

    if (row.totp_enabled) {
      return NextResponse.json(
        { success: false, message: 'المصادقة الثنائية مفعّلة بالفعل' },
        { status: 400 }
      );
    }

    if (!verifyTOTP(row.totp_secret, token)) {
      return NextResponse.json(
        { success: false, message: 'الرمز غير صحيح أو منتهي الصلاحية. تحقق من الوقت وحاول مجدداً' },
        { status: 401 }
      );
    }

    // تفعيل 2FA
    await pool.query(
      'UPDATE users SET totp_enabled = true, totp_enabled_at = NOW() WHERE id = $1',
      [user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل المصادقة الثنائية بنجاح. ستحتاج إلى رمز المصادقة في كل تسجيل دخول',
    });
  } catch (error) {
    console.error('2FA verify-setup error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
