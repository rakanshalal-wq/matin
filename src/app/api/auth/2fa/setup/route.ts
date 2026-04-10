import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { generateTOTPSecret, generateOTPAuthURI } from '@/lib/totp';

/**
 * POST /api/auth/2fa/setup
 * يولّد سراً جديداً للـ TOTP ويعيد رابط QR لتطبيق المصادقة.
 * لا يحفظ السر في قاعدة البيانات حتى يتم التحقق منه عبر /verify-setup.
 */
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }

    // 2FA مقتصر على الأدوار ذات الصلاحيات العالية
    const allowedRoles = ['super_admin', 'owner', 'admin'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'المصادقة الثنائية متاحة للمدراء والملاك فقط' },
        { status: 403 }
      );
    }

    // التحقق إذا كان 2FA مفعّلاً بالفعل
    const existing = await pool.query(
      'SELECT totp_enabled FROM users WHERE id = $1',
      [user.id]
    );
    if (existing.rows[0]?.totp_enabled) {
      return NextResponse.json(
        { success: false, message: 'المصادقة الثنائية مفعّلة بالفعل. يجب تعطيلها أولاً لإعادة الإعداد' },
        { status: 400 }
      );
    }

    const secret = generateTOTPSecret();
    const otpauthUri = generateOTPAuthURI(secret, user.email);

    // حفظ السر مؤقتاً (غير مفعّل — totp_enabled = false)
    await pool.query(
      'UPDATE users SET totp_secret = $1, totp_enabled = false WHERE id = $2',
      [secret, user.id]
    );

    return NextResponse.json({
      success: true,
      secret,
      otpauthUri,
      message: 'امسح رمز QR بتطبيق Google Authenticator أو Authy، ثم أدخل الرمز للتأكيد',
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
