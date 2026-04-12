import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const result = await pool.query(`
      SELECT s.*
      FROM subjects s
      WHERE 1=1 ${filter.sql} ORDER BY s.name_ar
    `, filter.params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بالإضافة' }, { status: 403 });
    }

    const body = await request.json();
    const { name, name_ar, code, description } = body;
    if (!name && !name_ar) return NextResponse.json({ error: 'اسم المادة مطلوب' }, { status: 400 });

    const ids = getInsertIds(user);
    const id = crypto.randomUUID();
    const finalCode = code || 'SUB-' + Date.now().toString(36).toUpperCase();
    const now = new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO subjects (id, name, name_ar, code, description, school_id, owner_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8) RETURNING *`,
      [id, name || name_ar, name_ar || name, finalCode, description || null, ids.school_id, ids.owner_id, now]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في الإضافة' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, name, name_ar, code, description } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const result = await pool.query(
      `UPDATE subjects SET name=$1, name_ar=$2, code=$3, description=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [name, name_ar, code, description, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM subjects WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
