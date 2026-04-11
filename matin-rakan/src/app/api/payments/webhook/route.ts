import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      event = JSON.parse(body);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const planId = session.metadata?.plan_id;

        if (userId && planId) {
          await pool.query(
            `UPDATE users SET package = $1, status = 'active', stripe_subscription_id = $2, updated_at = NOW() WHERE id = $3`,
            [planId, session.subscription, userId]
          );

          await pool.query(
            `INSERT INTO payment_history (user_id, school_id, plan_id, amount, currency, stripe_session_id, stripe_subscription_id, status, created_at)
             VALUES ($1, $2, $3, $4, 'SAR', $5, $6, 'completed', NOW())`,
            [userId, session.metadata?.school_id || null, planId, session.amount_total / 100, session.id, session.subscription]
          ).catch(() => {});

          console.log(`[Stripe] User ${userId} upgraded to ${planId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        if (sub.status === 'active') {
          await pool.query(
            `UPDATE users SET status = 'active' WHERE stripe_subscription_id = $1`,
            [sub.id]
          ).catch(() => {});
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await pool.query(
          `UPDATE users SET package = 'basic', stripe_subscription_id = NULL WHERE stripe_subscription_id = $1`,
          [sub.id]
        ).catch(() => {});
        console.log(`[Stripe] Subscription ${sub.id} canceled — downgraded to basic`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        await pool.query(
          `UPDATE users SET status = 'payment_failed' WHERE stripe_customer_id = $1`,
          [customerId]
        ).catch(() => {});
        console.log(`[Stripe] Payment failed for customer ${customerId}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
