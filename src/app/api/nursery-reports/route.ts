import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const url = new URL(request.url);
    const studentId = url.searchParams.get('student_id');
    const date = url.searchParams.get('date');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = `SELECT r.*, (SELECT name FROM users WHERE id = r.student_id) as student_name, (SELECT name FROM users WHERE id = r.caregiver_id) as caregiver_name FROM nursery_daily_reports r WHERE 1=1`;
    const params: any[] = [];
    let idx = 1;

    if (user.role !== 'super_admin') {
      query += ` AND r.school_id = $${idx}`;
      params.push(user.school_id);
      idx++;
    }
    if (studentId) { query += ` AND r.student_id = $${idx}`; params.push(studentId); idx++; }
    if (date) { query += ` AND r.report_date = $${idx}`; params.push(date); idx++; }

    query += ` ORDER BY r.report_date DESC, r.created_at DESC LIMIT $${idx}`;
    params.push(limit);

    const result = await pool.query(query, params);
    return NextResponse.json({ reports: result.rows });
  } catch (error) {
    console.error('Nursery reports GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin','owner','admin','caregiver'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بإنشاء تقرير' }, { status: 403 });
    }

    const body = await request.json();
    const { student_id, eating, eating_notes, sleeping, sleeping_duration, mood, health, temperature, activities, notes } = body;

    if (!student_id) return NextResponse.json({ error: 'معرف الطفل مطلوب' }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO nursery_daily_reports (school_id, student_id, caregiver_id, eating, eating_notes, sleeping, sleeping_duration, mood, health, temperature, activities, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [user.school_id, student_id, user.id, eating||'normal', eating_notes||null, sleeping||'normal', sleeping_duration||null, mood||'happy', health||'good', temperature||null, activities||null, notes||null]
    );

    return NextResponse.json({ report: result.rows[0], message: 'تم حفظ التقرير بنجاح' });
  } catch (error) {
    console.error('Nursery reports POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, eating, eating_notes, sleeping, sleeping_duration, mood, health, temperature, activities, notes } = body;

    if (!id) return NextResponse.json({ error: 'معرف التقرير مطلوب' }, { status: 400 });

    await pool.query(
      `UPDATE nursery_daily_reports SET eating=COALESCE($2,eating), eating_notes=COALESCE($3,eating_notes),
       sleeping=COALESCE($4,sleeping), sleeping_duration=COALESCE($5,sleeping_duration),
       mood=COALESCE($6,mood), health=COALESCE($7,health), temperature=COALESCE($8,temperature),
       activities=COALESCE($9,activities), notes=COALESCE($10,notes), updated_at=NOW()
       WHERE id=$1`,
      [id, eating, eating_notes, sleeping, sleeping_duration, mood, health, temperature, activities, notes]
    );

    return NextResponse.json({ message: 'تم تحديث التقرير' });
  } catch (error) {
    console.error('Nursery reports PUT error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
