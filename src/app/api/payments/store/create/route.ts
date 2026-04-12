import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { createMoyasarPayment } from '@/lib/integrations';

// POST /api/payments/store/create — إنشاء دفعة متجر
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const body = await request.json();
  const { order_id, amount, payment_method, callback_url, source } = body;

  if (!order_id || !amount) {
    return NextResponse.json({ error: 'order_id و amount مطلوبان' }, { status: 400 });
  }

  try {
    let transaction_id: string | null = null;
    let payment_url: string | null = null;

    if (source) {
      const moyasarResult = await createMoyasarPayment({
        amount: Math.round(amount * 100),
        description: `طلب متجر - ${order_id}`,
        callback_url: callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/store/orders`,
        source,
      }).catch(() => null);

      if (moyasarResult?.id) {
        transaction_id = moyasarResult.id;
        payment_url = moyasarResult.source?.transaction_url;
      }
    }

    const result = await pool.query(
      `INSERT INTO store_payments (order_id, amount, payment_method, transaction_id, status)
       VALUES ($1,$2,$3,$4,'pending') RETURNING *`,
      [order_id, amount, payment_method, transaction_id]
    );

    return NextResponse.json({ payment: result.rows[0], payment_url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
