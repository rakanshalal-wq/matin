import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { createSmsaShipment, createAramexShipment } from '@/lib/integrations';

// POST /api/shipping/create — إنشاء شحنة
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const body = await request.json();
  const { order_id, provider_id, provider_name, shipment_data } = body;

  if (!order_id || !provider_id) {
    return NextResponse.json({ error: 'order_id و provider_id مطلوبان' }, { status: 400 });
  }

  try {
    let tracking_number = `TRK-${Date.now()}`;

    // محاولة إنشاء الشحنة عبر المزود الفعلي
    if (provider_name === 'smsa' && shipment_data) {
      const smsaResult = await createSmsaShipment(shipment_data).catch(() => null);
      if (smsaResult && 'awb_number' in smsaResult && smsaResult.awb_number) tracking_number = (smsaResult as any).awb_number;
    } else if (provider_name === 'aramex' && shipment_data) {
      const aramexResult = await createAramexShipment(shipment_data).catch(() => null);
      if (aramexResult && 'tracking_number' in aramexResult && aramexResult.tracking_number) tracking_number = (aramexResult as any).tracking_number;
    }

    const result = await pool.query(
      `INSERT INTO shipments (order_id, provider_id, tracking_number)
       VALUES ($1,$2,$3) RETURNING *`,
      [order_id, provider_id, tracking_number]
    );

    // تحديث رقم التتبع في الطلب
    await pool.query(
      'UPDATE store_orders SET tracking_number=$1 WHERE id=$2',
      [tracking_number, order_id]
    ).catch(() => {});

    return NextResponse.json({ shipment: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
