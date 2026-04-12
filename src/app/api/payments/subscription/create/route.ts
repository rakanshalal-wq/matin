import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { createMoyasarPayment } from '@/lib/integrations';

// POST /api/payments/subscription/create — إنشاء دفعة اشتراك
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const body = await request.json();
  const { subscription_id, amount, payment_method, callback_url, source } = body;

  if (!subscription_id || !amount) {
    return NextResponse.json({ error: 'subscription_id و amount مطلوبان' }, { status: 400 });
  }

  try {
    // محاولة إنشاء دفعة عبر Moyasar
    let transaction_id: string | null = null;
    let payment_url: string | null = null;

    if (source) {
      const moyasarResult = await createMoyasarPayment({
        amount: Math.round(amount * 100), // تحويل لهللات
        description: `اشتراك - ${subscription_id}`,
        callback_url: callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
        source,
      }).catch(() => null);

      if (moyasarResult && 'id' in moyasarResult && moyasarResult.id) {
        transaction_id = (moyasarResult as any).id;
        payment_url = (moyasarResult as any).source?.transaction_url;
      }
    }

    const result = await pool.query(
      `INSERT INTO subscription_payments
       (institution_id, subscription_id, amount, payment_method, transaction_id, status)
       VALUES ($1,$2,$3,$4,$5,'pending') RETURNING *`,
      [user.school_id || user.institution_id, subscription_id, amount, payment_method, transaction_id]
    );

    return NextResponse.json({
      payment: result.rows[0],
      payment_url,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
