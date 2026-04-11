import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { stripe, PLANS, PlanId, canUpgrade } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin','owner','admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بالاشتراك' }, { status: 403 });
    }

    const { plan_id } = await request.json();
    if (!plan_id || !PLANS[plan_id as PlanId]) {
      return NextResponse.json({ error: 'باقة غير صحيحة' }, { status: 400 });
    }

    const plan = PLANS[plan_id as PlanId];
    if (plan.price === 0) {
      return NextResponse.json({ error: 'الباقة المجانية لا تحتاج دفع' }, { status: 400 });
    }

    const currentPkg = user.package || 'basic';
    if (!canUpgrade(currentPkg, plan_id)) {
      return NextResponse.json({ error: 'لا يمكن الترقية لهذه الباقة' }, { status: 400 });
    }

    // إنشاء أو جلب Stripe Customer
    let customerId: string;
    const existing = await pool.query(
      'SELECT stripe_customer_id FROM users WHERE id = $1', [user.id]
    );

    if (existing.rows[0]?.stripe_customer_id) {
      customerId = existing.rows[0].stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { user_id: String(user.id), school_id: String(user.school_id || '') },
      });
      customerId = customer.id;
      await pool.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, user.id]);
    }

    // إنشاء Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'sar',
          product_data: {
            name: plan.name,
            description: plan.features.join(' • '),
          },
          unit_amount: plan.price * 100,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      metadata: {
        user_id: String(user.id),
        plan_id: plan_id,
        school_id: String(user.school_id || ''),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://matin.ink'}/dashboard/pricing?success=true&plan=${plan_id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://matin.ink'}/dashboard/pricing?canceled=true`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url, session_id: session.id });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'خطأ في إنشاء جلسة الدفع' }, { status: 500 });
  }
}
