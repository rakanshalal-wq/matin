import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/forums/posts/[id]/attachments — مرفقات منشور
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query(
      'SELECT * FROM forum_attachments WHERE post_id=$1 ORDER BY created_at DESC',
      [id]
    );
    return NextResponse.json({ attachments: result.rows });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/forums/posts/[id]/attachments — رفع مرفق
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { file_url, file_name, file_type, file_size_mb } = body;

  if (!file_url) return NextResponse.json({ error: 'file_url مطلوب' }, { status: 400 });

  try {
    const result = await pool.query(
      `INSERT INTO forum_attachments (post_id, file_url, file_name, file_type, file_size_mb)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id, file_url, file_name, file_type, file_size_mb]
    );
    return NextResponse.json({ attachment: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
