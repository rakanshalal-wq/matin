import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// PUT /api/shipping/[id]/status — تحديث حالة الشحنة
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, estimated_delivery, actual_delivery } = body;

  const validStatuses = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'حالة غير صحيحة' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `UPDATE shipments SET status=$1, estimated_delivery=$2, actual_delivery=$3
       WHERE id=$4 RETURNING *`,
      [status, estimated_delivery, actual_delivery, id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'الشحنة غير موجودة' }, { status: 404 });
    return NextResponse.json({ shipment: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
