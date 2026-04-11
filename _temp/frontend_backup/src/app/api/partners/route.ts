import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM partners WHERE is_active = true ORDER BY sort_order'
    );
    return NextResponse.json({ success: true, partners: result.rows });
  } catch (error) {
    console.error('Partners error:', error);
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
      return NextResponse.json({ error: 'لا تملك صلاحية لإضافة شريك' }, { status: 403 });
    }
    const { name, logo_url, icon } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: 'اسم الشريك مطلوب' }, { status: 400 });

    const result = await pool.query(
      'INSERT INTO partners (name, logo_url, icon) VALUES ($1, $2, $3) RETURNING *',
      [name, logo_url, icon]
    );

    return NextResponse.json({ success: true, partner: result.rows[0] });
  } catch (error) {
    console.error('Add partner error:', error);
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
      return NextResponse.json({ error: 'لا تملك صلاحية لتعديل شريك' }, { status: 403 });
    }
    const { id, name, logo_url, icon, is_active } = await request.json();

    await pool.query(
      'UPDATE partners SET name = $1, logo_url = $2, icon = $3, is_active = $4 WHERE id = $5',
      [name, logo_url, icon, is_active, id]
    );

    return NextResponse.json({ success: true, message: 'تم التحديث بنجاح' });
  } catch (error) {
    console.error('Update partner error:', error);
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
      return NextResponse.json({ error: 'لا تملك صلاحية لحذف شريك' }, { status: 403 });
    }
    const { id } = await request.json();

    await pool.query('DELETE FROM partners WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (error) {
    console.error('Delete partner error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
