import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

/**
 * GET /api/auth/2fa/status
 * يعيد حالة المصادقة الثنائية للمستخدم الحالي.
 */
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT totp_enabled, totp_enabled_at FROM users WHERE id = $1',
      [user.id]
    );
    const row = result.rows[0];

    const allowedRoles = ['super_admin', 'owner', 'admin'];
    const isEligible = allowedRoles.includes(user.role);

    return NextResponse.json({
      success: true,
      enabled: row?.totp_enabled ?? false,
      enabledAt: row?.totp_enabled_at ?? null,
      eligible: isEligible,
    });
  } catch (error) {
    console.error('2FA status error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
