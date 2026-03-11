import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { sql: filterSql, params } = getFilterSQL(user);
    const result = await pool.query(
      `SELECT l.*, u.name as employee_name FROM leaves l LEFT JOIN users u ON l.teacher_id = u.id WHERE 1=1 ${filterSql.replace('school_id', 'l.school_id')} ORDER BY l.created_at DESC`,
      params
    );
    return NextResponse.json(result.rows);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const result = await pool.query(
      `INSERT INTO leaves (teacher_id, type, start_date, end_date, reason, status, school_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [body.teacher_id || user.id, body.type, body.start_date, body.end_date, body.reason, 'pending', user.school_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await pool.query('DELETE FROM leaves WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
