/**
 * /api/payment/checkout — بدء عملية دفع اشتراك
 *
 * POST body:
 *   plan_id        — معرّف الخطة (basic, pro, enterprise)
 *   billing_cycle  — monthly | yearly
 *   provider       — moyasar | tamara (افتراضي: moyasar)
 *   school_id      — (اختياري) معرّف المدرسة
 */

import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { createMoyasarPayment, createTamaraSession } from '@/lib/payment';

const PLAN_PRICES: Record<string, { monthly: number; yearly: number; name_ar: string }> = {
  basic:      { monthly: 29900,  yearly: 29900 * 10,  name_ar: 'الباقة الأساسية'   },
  pro:        { monthly: 79900,  yearly: 79900 * 10,  name_ar: 'الباقة الاحترافية' },
  enterprise: { monthly: 199900, yearly: 199900 * 10, name_ar: 'الباقة المؤسسية'   },
};

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { plan_id, billing_cycle = 'monthly', provider = 'moyasar', school_id } = body;

    if (!plan_id) {
      return NextResponse.json({ error: 'plan_id مطلوب' }, { status: 400 });
    }

    const planPrices = PLAN_PRICES[plan_id];
    if (!planPrices) {
      return NextResponse.json({ error: 'خطة غير موجودة' }, { status: 400 });
    }

    // الخطة المجانية لا تحتاج دفعاً
    if (plan_id === 'free') {
      return NextResponse.json({ redirect_url: null, free: true });
    }

    const amount = billing_cycle === 'yearly' ? planPrices.yearly : planPrices.monthly;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://matin.ink';

    // إنشاء سجل اشتراك بحالة pending
    const subResult = await pool.query(
      `INSERT INTO subscriptions
         (owner_id, school_id, plan_id, status, payment_status, billing_cycle, amount, created_at, updated_at)
       VALUES ($1, $2, $3, 'pending', 'initiated', $4, $5, NOW(), NOW())
       RETURNING id`,
      [String(user.id), school_id ?? null, plan_id, billing_cycle, amount]
    );
    const subscriptionId = subResult.rows[0]?.id;

    const callbackUrl = `${appUrl}/api/payment/callback?subscription_id=${subscriptionId}`;

    // ── Moyasar ──────────────────────────────────────────────────
    if (provider === 'moyasar') {
      const result = await createMoyasarPayment({
        amount,
        currency: 'SAR',
        description: `${planPrices.name_ar} — ${billing_cycle === 'yearly' ? 'سنوي' : 'شهري'}`,
        callback_url: callbackUrl,
        metadata: {
          subscription_id: String(subscriptionId),
          school_id: String(school_id ?? ''),
          user_id: String(user.id),
          plan_id,
          billing_cycle,
        },
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error ?? 'فشل بدء الدفع' }, { status: 502 });
      }

      // حفظ payment_id في الاشتراك
      if (result.payment_id) {
        await pool.query(
          'UPDATE subscriptions SET payment_id = $1 WHERE id = $2',
          [result.payment_id, subscriptionId]
        ).catch(() => {});
      }

      return NextResponse.json({ redirect_url: result.payment_url, payment_id: result.payment_id });
    }

    // ── Tamara ───────────────────────────────────────────────────
    if (provider === 'tamara') {
      const result = await createTamaraSession({
        amount,
        currency: 'SAR',
        description: `${planPrices.name_ar} — ${billing_cycle === 'yearly' ? 'سنوي' : 'شهري'}`,
        order_id: String(subscriptionId),
        buyer: {
          name: user.name ?? user.email,
          email: user.email,
          phone: user.phone ?? '0500000000',
        },
        success_url: `${appUrl}/dashboard/subscribe?status=success`,
        failure_url: `${appUrl}/dashboard/subscribe?status=failed`,
        cancel_url:  `${appUrl}/dashboard/subscribe?status=cancelled`,
        items: [{ name: planPrices.name_ar, quantity: 1, unit_price: amount }],
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error ?? 'فشل بدء الدفع' }, { status: 502 });
      }

      // حفظ checkout_id بحقل metadata
      if (result.payment_id) {
        await pool.query(
          `UPDATE subscriptions SET payment_id = $1,
           metadata = jsonb_set(COALESCE(metadata, '{}'), '{tamara_checkout_id}', to_jsonb($1::text))
           WHERE id = $2`,
          [result.payment_id, subscriptionId]
        ).catch(() => {});
      }

      return NextResponse.json({ redirect_url: result.payment_url, checkout_id: result.payment_id });
    }

    return NextResponse.json({ error: `المزوّد "${provider}" غير مدعوم` }, { status: 400 });
  } catch (error: any) {
    console.error('[Payment/Checkout]', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
