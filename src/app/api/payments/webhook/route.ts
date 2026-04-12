import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// POST /api/payments/webhook — استقبال إشعارات الدفع
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }

    // Moyasar webhook
    if (type === 'payment.paid' && data.id) {
      // تحديث حالة دفعة الاشتراك
      await pool.query(
        `UPDATE subscription_payments SET status='paid', transaction_id=$1, paid_at=NOW()
         WHERE transaction_id=$1`,
        [data.id]
      ).catch(() => {});

      // تحديث حالة دفعة المتجر
      await pool.query(
        `UPDATE store_payments SET status='paid', transaction_id=$1, paid_at=NOW()
         WHERE transaction_id=$1`,
        [data.id]
      ).catch(() => {});
    }

    if (type === 'payment.failed' && data.id) {
      await pool.query(
        `UPDATE subscription_payments SET status='failed' WHERE transaction_id=$1`,
        [data.id]
      ).catch(() => {});
      await pool.query(
        `UPDATE store_payments SET status='failed' WHERE transaction_id=$1`,
        [data.id]
      ).catch(() => {});
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
