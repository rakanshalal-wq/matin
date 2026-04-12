import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const lecture_id = searchParams.get('lecture_id');
    const date = searchParams.get('date');
    const class_id = searchParams.get('class_id');
    const from_date = searchParams.get('from');
    const to_date = searchParams.get('to');

    let query = `
      SELECT a.*, u.name as student_name, s.student_id as student_number,
             l.title as lecture_title
      FROM attendance a
      LEFT JOIN students s ON s.id = a.student_id
      LEFT JOIN users u ON u.id::text = s.user_id
      LEFT JOIN lectures l ON l.id = a.lecture_id
      WHERE 1=1 ${filter.sql}
    `;
    const params: any[] = [...filter.params];
    let idx = params.length + 1;

    if (student_id) { query += ` AND a.student_id = $${idx++}`; params.push(student_id); }
    if (lecture_id) { query += ` AND a.lecture_id = $${idx++}`; params.push(lecture_id); }
    if (date) { query += ` AND a.date = $${idx++}`; params.push(date); }
    if (class_id) { query += ` AND a.class_id = $${idx++}`; params.push(class_id); }
    if (from_date) { query += ` AND a.date >= $${idx++}`; params.push(from_date); }
    if (to_date) { query += ` AND a.date <= $${idx++}`; params.push(to_date); }

    query += ' ORDER BY a.date DESC, a.created_at DESC LIMIT 500';
    
    const result = await pool.query(query, params);
    
    // إحصائيات سريعة
    const stats = {
      total: result.rows.length,
      present: result.rows.filter((r: any) => r.status === 'present').length,
      absent: result.rows.filter((r: any) => r.status === 'absent').length,
      late: result.rows.filter((r: any) => r.status === 'late').length,
      excused: result.rows.filter((r: any) => r.status === 'excused').length,
    };
    
    return NextResponse.json({ records: result.rows, stats });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ records: [], stats: {} }); }
}
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);
    const body = await request.json();
    const { action } = body;

    // === تسجيل حضور جماعي (معلم يسجل حضور كل الطلاب) ===
    if (action === 'bulk_attendance') {
      const { lecture_id, date, class_id, records } = body;
      // records = [{student_id, status, notes}]
      if (!records || !Array.isArray(records)) return NextResponse.json({ error: 'بيانات الحضور مطلوبة' }, { status: 400 });
      
      let saved = 0;
      for (const rec of records) {
        const id = require('crypto').randomUUID();
        await pool.query(
          `INSERT INTO attendance (id, student_id, lecture_id, date, status, notes, class_id, school_id, owner_id, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
           ON CONFLICT (student_id, date, COALESCE(lecture_id, '')) DO UPDATE SET
             status = $5, notes = $6, updated_at = NOW()`,
          [id, rec.student_id, lecture_id || null, date || new Date().toISOString().split('T')[0], rec.status || 'present', rec.notes || null, class_id || null, ids.school_id, ids.owner_id]
        );
        saved++;
      }
      return NextResponse.json({ saved, message: `تم تسجيل حضور ${saved} طالب` });
    }

    // === تسجيل حضور فردي ===
    const { student_id, lecture_id, date, status, notes, class_id } = body;
    if (!student_id) return NextResponse.json({ error: 'معرف الطالب مطلوب' }, { status: 400 });
    
    const id = require('crypto').randomUUID();
    const attendanceDate = date || new Date().toISOString().split('T')[0];
    const result = await pool.query(
      `INSERT INTO attendance (id, student_id, lecture_id, date, status, notes, class_id, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
       ON CONFLICT (student_id, date, COALESCE(lecture_id, '')) DO UPDATE SET
         status = $5, notes = $6, updated_at = NOW()
       RETURNING *`,
      [id, student_id, lecture_id || null, attendanceDate, status || 'present', notes || null, class_id || null, ids.school_id, ids.owner_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM attendances WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, status, notes } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE attendance SET status = COALESCE($1, status), notes = COALESCE($2, notes), updated_at = NOW() WHERE id = $3 RETURNING *`,
      [status, notes, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT attendance error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث الحضور' }, { status: 500 });
  }
}

