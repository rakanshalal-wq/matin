import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/forums/[id] — تفاصيل منتدى
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query('SELECT * FROM forums WHERE id=$1', [id]);
    if (!result.rows[0]) return NextResponse.json({ error: 'المنتدى غير موجود' }, { status: 404 });
    return NextResponse.json({ forum: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/forums/[id] — تحديث منتدى
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, description, is_public } = body;

  try {
    const result = await pool.query(
      'UPDATE forums SET name=$1, description=$2, is_public=$3 WHERE id=$4 RETURNING *',
      [name, description, is_public, id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المنتدى غير موجود' }, { status: 404 });
    return NextResponse.json({ forum: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
