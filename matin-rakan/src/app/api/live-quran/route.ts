import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const schoolFilter = user.role === 'super_admin' ? '' : 'WHERE h.school_id = $1';
    const params = user.role === 'super_admin' ? [] : [user.school_id];

    const result = await pool.query(
      `SELECT h.*, 
        (SELECT COUNT(*) FROM quran_recitations r WHERE r.halaqah_id = h.id AND r.session_date = CURRENT_DATE) as today_recitations,
        (SELECT name FROM users WHERE id = h.muhaffiz_id) as muhaffiz_name
       FROM quran_halaqat h ${schoolFilter}
       ORDER BY h.is_live DESC, h.created_at DESC`,
      params
    );

    return NextResponse.json({ halaqat: result.rows });
  } catch (error) {
    console.error('Live quran GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin','owner','admin','supervisor','muhaffiz'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بإنشاء حلقة' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, day_of_week, start_time, end_time, max_students } = body;

    if (!name) return NextResponse.json({ error: 'اسم الحلقة مطلوب' }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO quran_halaqat (name, school_id, muhaffiz_id, description, day_of_week, start_time, end_time, max_students, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
       RETURNING *`,
      [name, user.school_id, user.role === 'muhaffiz' ? user.id : body.muhaffiz_id || user.id, description || null, day_of_week || null, start_time || null, end_time || null, max_students || 20]
    );

    return NextResponse.json({ halaqah: result.rows[0], message: 'تم إنشاء الحلقة بنجاح' });
  } catch (error) {
    console.error('Live quran POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, action } = body;

    if (!id) return NextResponse.json({ error: 'معرف الحلقة مطلوب' }, { status: 400 });

    if (action === 'start_live') {
      await pool.query('UPDATE quran_halaqat SET is_live = true, live_started_at = NOW(), updated_at = NOW() WHERE id = $1', [id]);
      return NextResponse.json({ message: 'تم بدء البث المباشر' });
    }

    if (action === 'stop_live') {
      await pool.query('UPDATE quran_halaqat SET is_live = false, live_started_at = NULL, updated_at = NOW() WHERE id = $1', [id]);
      return NextResponse.json({ message: 'تم إيقاف البث' });
    }

    const { name, description, day_of_week, start_time, end_time, max_students, status } = body;
    await pool.query(
      `UPDATE quran_halaqat SET name = COALESCE($2, name), description = COALESCE($3, description),
       day_of_week = COALESCE($4, day_of_week), start_time = COALESCE($5, start_time),
       end_time = COALESCE($6, end_time), max_students = COALESCE($7, max_students),
       status = COALESCE($8, status), updated_at = NOW()
       WHERE id = $1`,
      [id, name, description, day_of_week, start_time, end_time, max_students, status]
    );

    return NextResponse.json({ message: 'تم تحديث الحلقة' });
  } catch (error) {
    console.error('Live quran PUT error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
