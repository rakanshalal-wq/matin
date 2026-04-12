import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/library/resources/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query('SELECT * FROM library_resources WHERE id = $1', [id]);
    if (!result.rows[0]) return NextResponse.json({ error: 'المورد غير موجود' }, { status: 404 });

    // تسجيل القراءة
    await pool.query(
      'INSERT INTO resource_reads (resource_id, user_id) VALUES ($1, $2)',
      [id, user.id]
    ).catch(() => {});

    return NextResponse.json({ resource: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/library/resources/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, description, resource_type, file_url, author, subject_id, grade_level, is_public } = body;

  try {
    const result = await pool.query(
      `UPDATE library_resources SET title=$1, description=$2, resource_type=$3,
       file_url=$4, author=$5, subject_id=$6, grade_level=$7, is_public=$8
       WHERE id=$9 RETURNING *`,
      [title, description, resource_type, file_url, author, subject_id, grade_level, is_public, id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المورد غير موجود' }, { status: 404 });
    return NextResponse.json({ resource: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/library/resources/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await pool.query('DELETE FROM library_resources WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
