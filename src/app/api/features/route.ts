import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM features WHERE is_active = true ORDER BY sort_order'
    );
    return NextResponse.json({ success: true, features: result.rows });
  } catch (error) {
    console.error('Features error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['owner', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'لا تملك صلاحية لإضافة ميزة' }, { status: 403 });
    }
    const { title, description, icon, image_url, link } = await request.json();
    if (!title?.trim()) return NextResponse.json({ error: 'عنوان الميزة مطلوب' }, { status: 400 });

    const result = await pool.query(
      'INSERT INTO features (title, description, icon, image_url, link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, icon, image_url, link]
    );

    return NextResponse.json({ success: true, feature: result.rows[0] });
  } catch (error) {
    console.error('Add feature error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['owner', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'لا تملك صلاحية لتعديل ميزة' }, { status: 403 });
    }
    const { id, title, description, icon, image_url, link, is_active } = await request.json();

    await pool.query(
      'UPDATE features SET title = $1, description = $2, icon = $3, image_url = $4, link = $5, is_active = $6 WHERE id = $7',
      [title, description, icon, image_url, link, is_active, id]
    );

    return NextResponse.json({ success: true, message: 'تم التحديث بنجاح' });
  } catch (error) {
    console.error('Update feature error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['owner', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'لا تملك صلاحية لحذف ميزة' }, { status: 403 });
    }
    const { id } = await request.json();

    await pool.query('DELETE FROM features WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (error) {
    console.error('Delete feature error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
