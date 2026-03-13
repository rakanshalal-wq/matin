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
      SELECT ga.*, 
        s.full_name AS student_name,
        sub.name AS subject_name,
        t.full_name AS teacher_name
      FROM grade_appeals ga
      LEFT JOIN students s ON ga.student_id = s.id
      LEFT JOIN subjects sub ON ga.subject_id = sub.id
      LEFT JOIN teachers t ON ga.teacher_id = t.id
      WHERE ga.school_id = ?
    `;
    const params: any[] = [user.school_id || user.id];

    if (status) {
      sql += ' AND ga.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY ga.created_at DESC';

    const countSql = `SELECT COUNT(*) as total FROM grade_appeals ga WHERE ga.school_id = ?${status ? ' AND ga.status = ?' : ''}`;
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
    const { student_id, subject_id, teacher_id, original_grade, requested_grade, reason } = body;

    if (!student_id || !subject_id || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO grade_appeals (school_id, student_id, subject_id, teacher_id, original_grade, requested_grade, reason, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [user.school_id || user.id, student_id, subject_id, teacher_id || null, original_grade || null, requested_grade || null, reason]
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
    const { id, status, response_note, new_grade } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await query(
      `UPDATE grade_appeals SET status = ?, response_note = ?, new_grade = ?, updated_at = NOW()
       WHERE id = ? AND school_id = ?`,
      [status || 'pending', response_note || null, new_grade || null, id, user.school_id || user.id]
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
    await query('DELETE FROM grade_appeals WHERE id = ? AND school_id = ?', [id, user.school_id || user.id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
