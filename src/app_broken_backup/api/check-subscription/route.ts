import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    // super_admin دائماً مسموح
    if (user.role === 'super_admin') {
      return NextResponse.json({ success: true, allowed: true, role: 'super_admin' });
    }

    // جلب حالة الدفع من إعدادات المنصة
    const paymentSetting = await pool.query("SELECT value FROM platform_settings WHERE key = 'payment_enabled'");
    const paymentEnabled = paymentSetting.rows[0]?.value === 'true';

    // لو الدفع معطّل — الكل يشتغل مجاناً
    if (!paymentEnabled) {
      return NextResponse.json({ success: true, allowed: true, payment_required: false });
    }

    // جلب بيانات المدرسة
    const schoolResult = await pool.query(
      'SELECT id, name, status, trial_ends_at, subscription_ends_at FROM schools WHERE id::text = $1::text',
      [String(user.school_id)]
    );

    if (schoolResult.rows.length === 0) {
      return NextResponse.json({ success: false, allowed: false, reason: 'school_not_found' });
    }

    const school = schoolResult.rows[0];
    const now = new Date();
    const trialEnds = school.trial_ends_at ? new Date(school.trial_ends_at) : null;
    const subEnds = school.subscription_ends_at ? new Date(school.subscription_ends_at) : null;

    // لو عنده اشتراك مدفوع وما انتهى
    if (subEnds && subEnds > now) {
      return NextResponse.json({
        success: true, allowed: true, payment_required: false,
        subscription_ends: subEnds, type: 'paid'
      });
    }

    // لو في الفترة التجريبية
    if (trialEnds && trialEnds > now) {
      const daysLeft = Math.ceil((trialEnds.getTime() - now.getTime() / (1000 * 60 * 60 * 24)));
      return NextResponse.json({
        success: true, allowed: true, payment_required: false,
        trial_ends: trialEnds, days_left: daysLeft, type: 'trial',
        warning: daysLeft <= 7 ? `باقي ${daysLeft} يوم على انتهاء الفترة التجريبية` : null
      });
    }

    // انتهت الفترة التجريبية ولا يوجد اشتراك مدفوع
    return NextResponse.json({
      success: true, allowed: false, payment_required: true,
      reason: 'trial_expired',
      message: 'انتهت الفترة التجريبية. يرجى الاشتراك للاستمرار',
      package: user.package || 'basic',
      type: 'expired'
    });

  } catch (error) {
    console.error('Check subscription error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
