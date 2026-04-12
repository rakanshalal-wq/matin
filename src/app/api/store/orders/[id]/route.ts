import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/store/orders/[id] — جلب طلب واحد مع تفاصيله
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const order = await pool.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM store_orders o
       LEFT JOIN users u ON u.id = o.customer_id
       WHERE o.id = $1`,
      [id]
    );
    if (!order.rows[0]) return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });

    // جلب عناصر الطلب
    const items = await pool.query(
      `SELECT oi.*, p.name as product_name, p.image_url
       FROM store_order_items oi
       LEFT JOIN store_products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [id]
    );

    return NextResponse.json({ order: order.rows[0], items: items.rows });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
