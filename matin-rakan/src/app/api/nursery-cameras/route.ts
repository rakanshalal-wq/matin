import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const filter = user.role === 'super_admin' ? '' : 'WHERE school_id = $1';
    const params = user.role === 'super_admin' ? [] : [user.school_id];

    const result = await pool.query(`SELECT * FROM nursery_cameras ${filter} ORDER BY created_at DESC`, params);
    return NextResponse.json({ cameras: result.rows });
  } catch (error) {
    console.error('Nursery cameras GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin','owner','admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { name, location, stream_url } = body;
    if (!name) return NextResponse.json({ error: 'اسم الكاميرا مطلوب' }, { status: 400 });

    const result = await pool.query(
      'INSERT INTO nursery_cameras (school_id, name, location, stream_url) VALUES ($1,$2,$3,$4) RETURNING *',
      [user.school_id, name, location||null, stream_url||null]
    );

    return NextResponse.json({ camera: result.rows[0], message: 'تم إضافة الكاميرا' });
  } catch (error) {
    console.error('Nursery cameras POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin','owner','admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف الكاميرا مطلوب' }, { status: 400 });

    await pool.query('DELETE FROM nursery_cameras WHERE id = $1 AND school_id = $2', [id, user.school_id]);
    return NextResponse.json({ message: 'تم حذف الكاميرا' });
  } catch (error) {
    console.error('Nursery cameras DELETE error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
