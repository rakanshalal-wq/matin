import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/payments/subscription/[id] — تفاصيل دفعة اشتراك
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query(
      'SELECT * FROM subscription_payments WHERE id=$1 AND institution_id=$2',
      [id, user.school_id || user.institution_id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'الدفعة غير موجودة' }, { status: 404 });
    return NextResponse.json({ payment: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
