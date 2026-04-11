import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const role   = searchParams.get('role');
    const search = searchParams.get('search');
    let query = `
      SELECT u.id::text, u.name, u.email, u.role, u.status,
             u.phone, u.city, u.created_at, s.name as school_name
      FROM users u
      LEFT JOIN schools s ON s.id = u.school_id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (role) { params.push(role); query += ` AND u.role = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length})`; }
    query += ` ORDER BY u.created_at DESC LIMIT 500`;
    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    const body = await request.json();
    const { id, status, role } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const updates: string[] = [];
    const params: any[] = [];
    if (status) { params.push(status); updates.push(`status = $${params.length}`); }
    if (role)   { params.push(role);   updates.push(`role = $${params.length}`); }
    if (updates.length === 0) return NextResponse.json({ error: 'لا شيء للتعديل' }, { status: 400 });
    params.push(id);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${params.length}::integer`, params);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Users PUT error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const check = await pool.query('SELECT role FROM users WHERE id = $1::integer', [id]);
    if (check.rows[0]?.role === 'super_admin') {
      return NextResponse.json({ error: 'لا يمكن حذف مالك المنصة' }, { status: 403 });
    }
    await pool.query('DELETE FROM users WHERE id = $1::integer', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Users DELETE error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
