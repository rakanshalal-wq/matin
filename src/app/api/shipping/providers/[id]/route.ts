import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// PUT /api/shipping/providers/[id] — تحديث مزود الشحن
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { provider_name, api_key, api_secret, is_active } = body;

  try {
    const result = await pool.query(
      `UPDATE shipping_providers SET provider_name=$1, api_key=$2, api_secret=$3, is_active=$4
       WHERE id=$5 AND institution_id=$6
       RETURNING id, institution_id, provider_name, is_active, created_at`,
      [provider_name, api_key, api_secret, is_active, id, user.school_id || user.institution_id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المزود غير موجود' }, { status: 404 });
    return NextResponse.json({ provider: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
