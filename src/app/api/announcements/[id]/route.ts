import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/announcements/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query('SELECT * FROM announcements WHERE id = $1', [id]);
    if (!result.rows[0]) return NextResponse.json({ error: 'الإعلان غير موجود' }, { status: 404 });
    return NextResponse.json({ announcement: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/announcements/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, content, target_audience, priority, expires_at, is_active } = body;

  try {
    const result = await pool.query(
      `UPDATE announcements SET title=$1, content=$2, target_audience=$3,
       priority=$4, expires_at=$5, is_active=$6
       WHERE id=$7 RETURNING *`,
      [title, content, target_audience, priority, expires_at, is_active, id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'الإعلان غير موجود' }, { status: 404 });
    return NextResponse.json({ announcement: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/announcements/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
