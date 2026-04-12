import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/payments/history — سجل المدفوعات
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all'; // all | subscription | store
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;
  const institutionId = user.school_id || user.institution_id;

  try {
    const results: any = {};

    if (type === 'all' || type === 'subscription') {
      const subResult = await pool.query(
        `SELECT *, 'subscription' as payment_type FROM subscription_payments
         WHERE institution_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [institutionId, limit, offset]
      );
      results.subscription_payments = subResult.rows;
    }

    if (type === 'all' || type === 'store') {
      const storeResult = await pool.query(
        `SELECT sp.*, 'store' as payment_type FROM store_payments sp
         JOIN store_orders so ON so.id::text = sp.order_id::text
         WHERE so.institution_id=$1 ORDER BY sp.created_at DESC LIMIT $2 OFFSET $3`,
        [institutionId, limit, offset]
      );
      results.store_payments = storeResult.rows;
    }

    return NextResponse.json({ ...results, page, limit });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
