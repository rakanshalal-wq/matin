import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// PUT /api/store/orders/[id]/status — تحديث حالة الطلب
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, payment_status, tracking_number } = body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'حالة غير صحيحة' }, { status: 400 });
  }

  try {
    const updates: string[] = [];
    const queryParams: any[] = [];

    if (status)          { updates.push(`status=$${queryParams.length + 1}`);          queryParams.push(status); }
    if (payment_status)  { updates.push(`payment_status=$${queryParams.length + 1}`);  queryParams.push(payment_status); }
    if (tracking_number) { updates.push(`tracking_number=$${queryParams.length + 1}`); queryParams.push(tracking_number); }

    if (!updates.length) return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });

    queryParams.push(id);
    const result = await pool.query(
      `UPDATE store_orders SET ${updates.join(', ')} WHERE id=$${queryParams.length} RETURNING *`,
      queryParams
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    return NextResponse.json({ order: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
