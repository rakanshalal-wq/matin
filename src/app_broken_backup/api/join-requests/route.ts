import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    let schoolFilter = '';
    let params: any[] = [];
    if (user.role === 'owner') {
      schoolFilter = 'AND u.school_id IN (SELECT id FROM schools WHERE owner_id::text = $1::text)';
      params = [String(user.id)];
    } else if (user.role === 'admin') {
      schoolFilter = 'AND u.school_id::text = $1::text';
      params = [String(user.school_id)];
    } else if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.national_id, u.status, u.created_at,
        s.name as school_name, s.id as school_id
       FROM users u
       LEFT JOIN schools s ON s.id::text = u.school_id::text
       WHERE u.status = 'pending' ${schoolFilter}
       ORDER BY u.created_at DESC`,
      params
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Join requests GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const body = await request.json();
    const { userId, action, class_id } = body;
    if (!userId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 });
    }
    const newStatus = action === 'approve' ? 'active' : 'rejected';
    await pool.query('UPDATE users SET status = $1 WHERE id::text = $2::text', [newStatus, userId]);
    if (action === 'approve' && class_id) {
      await pool.query('UPDATE students SET class_id = $1 WHERE user_id::text = $2::text', [class_id, String(userId)]);
    }
    const actionLabel = action === 'approve' ? 'تمت الموافقة' : 'تم الرفض';
    return NextResponse.json({ success: true, message: actionLabel });
  } catch (error: any) {
    console.error('Join requests PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
