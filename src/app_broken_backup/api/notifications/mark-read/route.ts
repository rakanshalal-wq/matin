import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const filter = getFilterSQL(user);
    if (body.all) {
      await pool.query(
        `UPDATE notifications SET is_read = true WHERE 1=1 ${filter.sql}`,
        filter.params
      );
    } else if (body.id) {
      await pool.query('UPDATE notifications SET is_read = true WHERE id::text = $1::text', [body.id]);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
