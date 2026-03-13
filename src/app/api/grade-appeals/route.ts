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
    let whereClause = 'WHERE ga.school_id = $1';
    const params: any[] = [user.school_id || user.id];
    let paramIdx = 2;

    if (status) {
      whereClause += ` AND ga.status = $${paramIdx++}`;
      params.push(status);
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM grade_appeals ga ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0]?.total || '0');

    const result = await pool.query(
      `SELECT ga.*,
        s.full_name AS student_name,
        sub.name AS subject_name,
        t.full_name AS teacher_name
       FROM grade_appeals ga
       LEFT JOIN students s ON ga.student_id = s.id
       LEFT JOIN subjects sub ON ga.subject_id = sub.id
       LEFT JOIN teachers t ON ga.teacher_id = t.id
       ${whereClause}
       ORDER BY ga.created_at DESC
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
    const { student_id, subject_id, teacher_id, original_grade, requested_grade, reason } = body;

    if (!student_id || !subject_id || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO grade_appeals (school_id, student_id, subject_id, teacher_id, original_grade, requested_grade, reason, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())
       RETURNING id`,
      [user.school_id || user.id, student_id, subject_id, teacher_id || null, original_grade || null, requested_grade || null, reason]
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
    const { id, status, response_note, new_grade } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await pool.query(
      `UPDATE grade_appeals SET status = $1, response_note = $2, new_grade = $3, updated_at = NOW()
       WHERE id = $4 AND school_id = $5`,
      [status || 'pending', response_note || null, new_grade || null, id, user.school_id || user.id]
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
      'DELETE FROM grade_appeals WHERE id = $1 AND school_id = $2',
      [id, user.school_id || user.id]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
