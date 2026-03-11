import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    
    const result = await pool.query(`
      SELECT a.*, u.name as author_name
      FROM announcements a
      LEFT JOIN users u ON u.id = a.author_id
      WHERE 1=1 ${filter.sql.replace(/school_id/g, 'a.school_id')}
      ORDER BY a.created_at DESC
    `, filter.params);
    
    return NextResponse.json(result.rows);
  } catch (error: any) {
    // If table doesn't exist, return empty array
    if (error.message.includes('does not exist')) {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const body = await request.json();
    const { title, content, type, target_audience, priority } = body;
    
    const result = await pool.query(
      `INSERT INTO announcements (id, title, content, target_audience, priority, author_id, school_id, is_active, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW()) RETURNING *`,
      ['ann_' + Date.now(), title, content, target_audience || 'all', priority || 'normal', user.id, user.school_id]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
