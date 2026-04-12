import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const result = await pool.query(
      `SELECT * FROM complaints WHERE 1=1 ${filter.sql} ORDER BY created_at DESC LIMIT 200`,
      filter.params
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);
    const body = await request.json();
    const { title, subject, description, type, priority, status } = body;
    const subjectVal = subject || title;
    if (!subjectVal) return NextResponse.json({ error: 'الموضوع مطلوب' }, { status: 400 });
    const result = await pool.query(
      `INSERT INTO complaints (name, subject, description, type, priority, status, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()) RETURNING *`,
      [
        user.name || 'مجهول',
        subjectVal,
        description || null,
        type || 'complaint',
        priority || 'medium',
        status || 'open',
        ids.school_id,
        ids.owner_id
      ]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, status, priority } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const result = await pool.query(
      'UPDATE complaints SET status = COALESCE($1, status), priority = COALESCE($2, priority) WHERE id = $3 RETURNING *',
      [status || null, priority || null, id]
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
    await pool.query('DELETE FROM complaints WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
