import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/library/favorites — المفضلة
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const result = await pool.query(
      `SELECT lr.*, rf.created_at as favorited_at
       FROM resource_favorites rf
       JOIN library_resources lr ON lr.id::text = rf.resource_id::text
       WHERE rf.user_id = $1 ORDER BY rf.created_at DESC`,
      [user.id]
    );
    return NextResponse.json({ favorites: result.rows });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/library/favorites — إضافة للمفضلة
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const body = await request.json();
  const { resource_id } = body;

  if (!resource_id) return NextResponse.json({ error: 'resource_id مطلوب' }, { status: 400 });

  try {
    await pool.query(
      `INSERT INTO resource_favorites (resource_id, user_id)
       VALUES ($1, $2) ON CONFLICT (resource_id, user_id) DO NOTHING`,
      [resource_id, user.id]
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/library/favorites — إزالة من المفضلة
export async function DELETE(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const resource_id = searchParams.get('resource_id');

  if (!resource_id) return NextResponse.json({ error: 'resource_id مطلوب' }, { status: 400 });

  try {
    await pool.query('DELETE FROM resource_favorites WHERE resource_id=$1 AND user_id=$2', [resource_id, user.id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
