import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin','owner','admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const action = url.searchParams.get('action');
    const userId = url.searchParams.get('user_id');

    let query = `SELECT a.*, (SELECT name FROM users WHERE id = a.user_id) as user_name
                 FROM activity_logs a WHERE 1=1`;
    const params: any[] = [];
    let idx = 1;

    if (user.role !== 'super_admin') {
      query += ` AND a.school_id = $${idx}`;
      params.push(user.school_id);
      idx++;
    }
    if (action) { query += ` AND a.action = $${idx}`; params.push(action); idx++; }
    if (userId) { query += ` AND a.user_id = $${idx}`; params.push(userId); idx++; }

    query += ` ORDER BY a.created_at DESC LIMIT $${idx}`;
    params.push(limit);

    const result = await pool.query(query, params);
    return NextResponse.json({ logs: result.rows });
  } catch (error) {
    console.error('Activity logs error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
