import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT key, value FROM platform_settings WHERE key IN ('payment_enabled','payment_provider','plan_basic_price_monthly','plan_pro_price_monthly','plan_enterprise_price_monthly','plan_basic_price_yearly','plan_pro_price_yearly','plan_enterprise_price_yearly')"
    );
    const settings: Record<string, string> = {};
    for (const row of result.rows) { settings[row.key] = row.value; }
    return NextResponse.json({
      success: true,
      payment_enabled: settings.payment_enabled === 'true',
      provider: settings.payment_provider || 'moyasar',
      prices: {
        basic: { monthly: Number(settings.plan_basic_price_monthly) || 199, yearly: Number(settings.plan_basic_price_yearly) || 1999 },
        pro: { monthly: Number(settings.plan_pro_price_monthly) || 399, yearly: Number(settings.plan_pro_price_yearly) || 3999 },
        enterprise: { monthly: Number(settings.plan_enterprise_price_monthly) || 799, yearly: Number(settings.plan_enterprise_price_yearly) || 7999 },
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, payment_enabled: false }, { status: 500 });
  }
}
