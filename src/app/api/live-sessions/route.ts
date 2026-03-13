import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { paginate } from '@/lib/pagination';

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');

  try {
    let sql = `
      SELECT ls.*,
        t.full_name AS teacher_name,
        sub.name AS subject_name,
        c.name AS class_name
      FROM live_sessions ls
      LEFT JOIN teachers t ON ls.teacher_id = t.id
      LEFT JOIN subjects sub ON ls.subject_id = sub.id
      LEFT JOIN classes c ON ls.class_id = c.id
      WHERE ls.school_id = ?
    `;
    const params: any[] = [user.school_id || user.id];

    if (status) {
      sql += ' AND ls.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY ls.scheduled_at DESC';

    const countSql = `SELECT COUNT(*) as total FROM live_sessions ls WHERE ls.school_id = ?${status ? ' AND ls.status = ?' : ''}`;
    const countParams = status ? [user.school_id || user.id, status] : [user.school_id || user.id];

    const [countResult] = await query(countSql, countParams) as any[];
    const total = countResult?.total || 0;

    const { offset, meta } = paginate(page, limit, total);
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const rows = await query(sql, params);
    return NextResponse.json({ data: rows, ...meta });
  } catch (err: any) {
    // Return empty array if table doesn't exist yet
    return NextResponse.json({ data: [], page: 1, limit, total: 0, totalPages: 0 });
  }
}

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, subject_id, class_id, teacher_id, scheduled_at, duration_minutes, platform, meeting_url, description } = body;

    if (!title || !scheduled_at) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO live_sessions (school_id, title, subject_id, class_id, teacher_id, scheduled_at, duration_minutes, platform, meeting_url, description, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', NOW())`,
      [
        user.school_id || user.id,
        title,
        subject_id || null,
        class_id || null,
        teacher_id || user.id,
        scheduled_at,
        duration_minutes || 60,
        platform || 'zoom',
        meeting_url || null,
        description || null
      ]
    ) as any;

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, title, subject_id, class_id, scheduled_at, duration_minutes, platform, meeting_url, description, status } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await query(
      `UPDATE live_sessions SET title = ?, subject_id = ?, class_id = ?, scheduled_at = ?, duration_minutes = ?,
       platform = ?, meeting_url = ?, description = ?, status = ?, updated_at = NOW()
       WHERE id = ? AND school_id = ?`,
      [
        title,
        subject_id || null,
        class_id || null,
        scheduled_at,
        duration_minutes || 60,
        platform || 'zoom',
        meeting_url || null,
        description || null,
        status || 'scheduled',
        id,
        user.school_id || user.id
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    await query('DELETE FROM live_sessions WHERE id = ? AND school_id = ?', [id, user.school_id || user.id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
