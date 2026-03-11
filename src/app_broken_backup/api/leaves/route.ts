import { NextResponse } from "next/server";
import { pool, getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    let query = `SELECT l.*, u.name as employee_name 
      FROM leaves l 
      LEFT JOIN users u ON l.teacher_id::text = u.id::text 
      WHERE 1=1`;
    const params: any[] = [];

    if (user.role !== "super_admin" && user.school_id) {
      params.push(String(user.school_id);
      query += ` AND l.school_id = $${params.length}`;
    }
    query += " ORDER BY l.created_at DESC";

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const body = await request.json();

    const result = await pool.query(
      `INSERT INTO leaves (id, teacher_id, type, start_date, end_date, reason, status, school_id, created_at, updated_at) 
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW(), NOW() RETURNING *`,
      [
        String(body.teacher_id || user.id),
        body.type || 'annual',
        body.start_date,
        body.end_date,
        body.reason || '',
        'pending',
        String(user.school_id || '')
      ]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    const result = await pool.query(
      "UPDATE leaves SET status=$1, updated_at=NOW() WHERE id::text = $2::text RETURNING *",
      [body.status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await pool.query("DELETE FROM leaves WHERE id::text = $1::text", [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
