import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/shipping/[id] — تتبع شحنة بالمعرف أو رقم التتبع
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    // البحث بالمعرف أو رقم التتبع
    const result = await pool.query(
      `SELECT s.*, sp.provider_name FROM shipments s
       LEFT JOIN shipping_providers sp ON sp.id = s.provider_id
       WHERE s.id::text = $1 OR s.tracking_number = $1`,
      [id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'الشحنة غير موجودة' }, { status: 404 });
    return NextResponse.json({ shipment: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
