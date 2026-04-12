import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/shipping/providers — قائمة مزودي الشحن
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `SELECT id, institution_id, provider_name, is_active, created_at
       FROM shipping_providers WHERE institution_id=$1`,
      [user.school_id || user.institution_id]
    );
    return NextResponse.json({ providers: result.rows });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/shipping/providers — إضافة مزود شحن
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const body = await request.json();
  const { provider_name, api_key, api_secret } = body;

  if (!provider_name || !api_key) {
    return NextResponse.json({ error: 'provider_name و api_key مطلوبان' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO shipping_providers (institution_id, provider_name, api_key, api_secret)
       VALUES ($1,$2,$3,$4) RETURNING id, institution_id, provider_name, is_active, created_at`,
      [user.school_id || user.institution_id, provider_name, api_key, api_secret]
    );
    return NextResponse.json({ provider: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
