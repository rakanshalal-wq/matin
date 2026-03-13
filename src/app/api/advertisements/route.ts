import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM advertisements WHERE is_active = true ORDER BY sort_order'
    );
    return NextResponse.json({ success: true, advertisements: result.rows });
  } catch (error) {
    console.error('Advertisements error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user || user.role !== 'super_admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { title, image_url, link, bg_color } = await request.json();
    if (!title?.trim()) return NextResponse.json({ error: 'عنوان الإعلان مطلوب' }, { status: 400 });

    const result = await pool.query(
      'INSERT INTO advertisements (title, image_url, link, bg_color) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, image_url, link, bg_color]
    );

    return NextResponse.json({ success: true, advertisement: result.rows[0] });
  } catch (error) {
    console.error('Add advertisement error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user || user.role !== 'super_admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, title, image_url, link, bg_color, is_active } = await request.json();

    await pool.query(
      'UPDATE advertisements SET title = $1, image_url = $2, link = $3, bg_color = $4, is_active = $5 WHERE id = $6',
      [title, image_url, link, bg_color, is_active, id]
    );

    return NextResponse.json({ success: true, message: 'تم التحديث بنجاح' });
  } catch (error) {
    console.error('Update advertisement error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user || user.role !== 'super_admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await request.json();

    await pool.query('DELETE FROM advertisements WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (error) {
    console.error('Delete advertisement error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
