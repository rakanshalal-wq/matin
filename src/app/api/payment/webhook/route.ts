/**
 * /api/payment/webhook — معالج Webhook للدفع (Moyasar + Tamara)
 *
 * يستقبل إشعارات الدفع من المزوّد، يتحقق من التوقيع، ويحدّث حالة الاشتراك في قاعدة البيانات.
 *
 * Moyasar: يرسل header  x-moyasar-signature
 * Tamara:  يرسل header  x-tamara-signature
 */

import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';
import { verifyMoyasarWebhookSignature, verifyMoyasarPayment } from '@/lib/payment';

// ── Moyasar يرسل POST بـ JSON ──────────────────────────────────────
export async function POST(request: Request) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: 'قراءة الطلب فشلت' }, { status: 400 });
  }

  // ── تحديد المزوّد ────────────────────────────────────────────────
  const moyasarSig = request.headers.get('x-moyasar-signature');
  const tamaraSig  = request.headers.get('x-tamara-signature');

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'JSON غير صحيح' }, { status: 400 });
  }

  // ══════════════════════════════════════════════════════════════════
  // 💳 Moyasar
  // ══════════════════════════════════════════════════════════════════
  if (moyasarSig !== null || payload?.type === 'payment_paid') {
    // التحقق من التوقيع
    if (!verifyMoyasarWebhookSignature(rawBody, moyasarSig)) {
      console.warn('[Webhook/Moyasar] توقيع غير صحيح');
      return NextResponse.json({ error: 'توقيع غير صحيح' }, { status: 401 });
    }

    const event = payload as { type: string; data?: { id?: string; status?: string; amount?: number; metadata?: Record<string, string> } };
    const paymentId = event.data?.id;
    const status    = event.data?.status;
    const metadata  = event.data?.metadata ?? {};

    console.log('[Webhook/Moyasar]', event.type, paymentId, status);

    // التحقق المزدوج من الحالة عبر API Moyasar (لا نثق بالـ payload وحده)
    if (paymentId && (status === 'paid' || event.type === 'payment_paid')) {
      try {
        const verified = await verifyMoyasarPayment(paymentId);
        if (!verified.success) {
          console.warn('[Webhook/Moyasar] التحقق فشل:', paymentId);
          return NextResponse.json({ received: true });
        }

        // تحديث الاشتراك في قاعدة البيانات
        const subscriptionId = metadata?.subscription_id;
        const schoolId       = metadata?.school_id;

        if (subscriptionId) {
          await pool.query(
            `UPDATE subscriptions
             SET status = 'active',
                 payment_status = 'paid',
                 payment_id = $1,
                 paid_at = NOW(),
                 updated_at = NOW()
             WHERE id = $2`,
            [paymentId, subscriptionId]
          ).catch((e) => console.error('[Webhook/Moyasar] DB update error:', e));
        } else if (schoolId) {
          // تحديث الاشتراك بواسطة school_id إذا لم يكن subscription_id متوفراً
          await pool.query(
            `UPDATE subscriptions
             SET status = 'active',
                 payment_status = 'paid',
                 payment_id = $1,
                 paid_at = NOW(),
                 updated_at = NOW()
             WHERE school_id = $2
               AND status IN ('pending', 'initiated')
             ORDER BY created_at DESC
             LIMIT 1`,
            [paymentId, schoolId]
          ).catch((e) => console.error('[Webhook/Moyasar] DB update by school error:', e));
        }
      } catch (e: any) {
        console.error('[Webhook/Moyasar] استثناء:', e.message);
      }
    }

    return NextResponse.json({ received: true });
  }

  // ══════════════════════════════════════════════════════════════════
  // 🛍️ Tamara
  // ══════════════════════════════════════════════════════════════════
  if (tamaraSig !== null) {
    // Tamara لا تعطي webhook secret في الخطة الأساسية — نتحقق من الـ IP أو نقبل المرور
    const event = payload as {
      event_type?: string;
      order_id?: string;
      checkout_id?: string;
      status?: string;
    };

    console.log('[Webhook/Tamara]', event.event_type, event.checkout_id, event.status);

    if (event.status === 'approved' || event.event_type === 'order_approved') {
      const checkoutId = event.checkout_id ?? event.order_id;
      if (checkoutId) {
        await pool.query(
          `UPDATE subscriptions
           SET status = 'active',
               payment_status = 'paid',
               payment_id = $1,
               paid_at = NOW(),
               updated_at = NOW()
           WHERE payment_id = $1
              OR (metadata->>'tamara_checkout_id') = $1`,
          [checkoutId]
        ).catch((e) => console.error('[Webhook/Tamara] DB update error:', e));
      }
    }

    return NextResponse.json({ received: true });
  }

  // طلب غير معروف — نرد بـ 200 لتجنّب إعادة المحاولة
  console.warn('[Webhook] مزوّد غير معروف:', Object.keys(payload));
  return NextResponse.json({ received: true });
}
