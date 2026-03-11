import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    const filter = getFilterSQL(user);
    const result = await pool.query(
      `SELECT * FROM coupons WHERE 1=1 ${filter.sql} ORDER BY created_at DESC`,
      filter.params
    );
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    const ids = getInsertIds(user);
    const body = await request.json();
    const { code, discount_type, discount_value, max_uses, used_count, start_date, end_date, status } = body;
    if (!code) return NextResponse.json({ error: 'كود الخصم مطلوب' }, { status: 400 });
    const result = await pool.query(
      `INSERT INTO coupons (code, discount_type, discount_value, max_uses, used_count, start_date, end_date, status, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`,
      [code, discount_type||'percentage', discount_value||0, max_uses||100, used_count||0, start_date||null, end_date||null, status||'active', ids.school_id, ids.owner_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, code, discount_type, discount_value, max_uses, start_date, end_date, status } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const result = await pool.query(
      'UPDATE coupons SET code=$1, discount_type=$2, discount_value=$3, max_uses=$4, start_date=$5, end_date=$6, status=$7 WHERE id=$8 RETURNING *',
      [code, discount_type, discount_value, max_uses, start_date, end_date, status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM coupons WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
