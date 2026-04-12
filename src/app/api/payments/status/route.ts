import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { getPlan } from '@/lib/stripe';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const result = await pool.query(
      'SELECT package, stripe_customer_id, stripe_subscription_id, status FROM users WHERE id = $1',
      [user.id]
    );

    if (!result.rows[0]) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });

    const u = result.rows[0];
    const plan = getPlan(u.package || 'basic');

    const payments = await pool.query(
      'SELECT * FROM payment_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [user.id]
    ).catch(() => ({ rows: [] }));

    return NextResponse.json({
      current_plan: u.package || 'basic',
      plan_details: plan,
      subscription_status: u.status,
      has_subscription: !!u.stripe_subscription_id,
      payment_history: payments.rows,
    });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
