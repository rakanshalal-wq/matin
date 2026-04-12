import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/pagination';

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const { page, limit, offset } = getPaginationParams(searchParams);
  const status = searchParams.get('status');

  try {
    let whereClause = 'WHERE ls.school_id = $1';
    const params: any[] = [user.school_id || user.id];
    let paramIdx = 2;

    if (status) {
      whereClause += ` AND ls.status = $${paramIdx++}`;
      params.push(status);
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM live_sessions ls ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0]?.total || '0');

    const result = await pool.query(
      `SELECT ls.*,
        t.full_name AS teacher_name,
        sub.name AS subject_name,
        c.name AS class_name
       FROM live_sessions ls
       LEFT JOIN teachers t ON ls.teacher_id = t.id
       LEFT JOIN subjects sub ON ls.subject_id = sub.id
       LEFT JOIN classes c ON ls.class_id = c.id
       ${whereClause}
       ORDER BY ls.scheduled_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    return NextResponse.json(buildPaginatedResponse(result.rows, total, page, limit));
  } catch (err: any) {
    return NextResponse.json(buildPaginatedResponse([], 0, page, limit));
  }
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, subject_id, class_id, teacher_id, scheduled_at, duration_minutes, platform, meeting_url, description } = body;

    if (!title || !scheduled_at) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO live_sessions (school_id, title, subject_id, class_id, teacher_id, scheduled_at, duration_minutes, platform, meeting_url, description, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'scheduled', NOW())
       RETURNING id`,
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
    );

    return NextResponse.json({ success: true, id: result.rows[0]?.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, title, subject_id, class_id, scheduled_at, duration_minutes, platform, meeting_url, description, status } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await pool.query(
      `UPDATE live_sessions SET title = $1, subject_id = $2, class_id = $3, scheduled_at = $4,
       duration_minutes = $5, platform = $6, meeting_url = $7, description = $8, status = $9, updated_at = NOW()
       WHERE id = $10 AND school_id = $11`,
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

export async function DELETE(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    await pool.query(
      'DELETE FROM live_sessions WHERE id = $1 AND school_id = $2',
      [id, user.school_id || user.id]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
