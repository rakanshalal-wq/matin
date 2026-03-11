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
    const course_id = searchParams.get('course_id');
    const exam_id = searchParams.get('exam_id');

    let query = `
      SELECT g.*, u.name as student_name, s.student_id as student_number,
             e.title_ar as exam_title
      FROM grades g
      LEFT JOIN students s ON s.id::text = g.student_id::text
      LEFT JOIN users u ON u.id::text = s.user_id
      LEFT JOIN exams e ON e.id::text = g.exam_id::text
      -- removed: no homework_id in grades
      WHERE 1=1 ${filter.sql}
    `;
    const params: any[] = [...filter.params];
    let idx = params.length + 1;

    if (student_id) { query += ` AND g.student_id = $${idx++}`; params.push(student_id); }
    if (course_id) { query += ` AND g.course_id = $${idx++}`; params.push(course_id); }
    if (exam_id) { query += ` AND g.exam_id = $${idx++}`; params.push(exam_id); }

    query += ' ORDER BY g.created_at DESC LIMIT 500';
    const result = await pool.query(query, params);

    // حساب المعدل العام للطالب
    if (student_id && result.rows.length > 0) {
      const totalPct = result.rows.reduce((sum: number, g: any) => sum + (parseFloat(g.percentage) || 0), 0);
      const avgPct = Math.round(totalPct / result.rows.length);
      const overallGrade = avgPct >= 90 ? 'A+' : avgPct >= 80 ? 'A' : avgPct >= 70 ? 'B' : avgPct >= 60 ? 'C' : avgPct >= 50 ? 'D' : 'F';
      return NextResponse.json({ 
        grades: result.rows, 
        summary: { count: result.rows.length, average_percentage: avgPct, overall_grade: overallGrade }
      });
    }

    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role) ) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { records } = body;

    // تسجيل درجات مجموعة طلاب
    if (records && Array.isArray(records) ) {
      const ids = getInsertIds(user);
      const results = [];
      for (const r of records) {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const percentage = r.max_marks > 0 ? ((r.marks / r.max_marks) * 100) : 0;
        const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F';
        try {
          const result = await pool.query(
            `INSERT INTO grades (id, marks, max_marks, percentage, grade, remarks, student_id, course_id, exam_id, school_id, owner_id, created_at, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12)
             ON CONFLICT (exam_id, student_id) WHERE exam_id IS NOT NULL
             DO UPDATE SET marks = GREATEST(grades.marks, $2), percentage = GREATEST(grades.percentage, $4), grade = CASE WHEN $2 > grades.marks THEN $5 ELSE grades.grade END, updated_at = $12
             RETURNING *`,
            [id, r.marks, r.max_marks, percentage, grade, r.remarks || null, r.student_id, r.course_id || '', r.exam_id || null, ids.school_id, ids.owner_id, now]
          );
          results.push(result.rows[0]);
        } catch (e) { console.error('Grade error:', e); }
      }
      return NextResponse.json({ success: true, count: results.length }, { status: 201 });
    }

    // تسجيل درجة طالب واحد
    const { marks, max_marks, remarks, student_id, course_id, exam_id } = body;
    if (!student_id) return NextResponse.json({ error: 'الطالب مطلوب' }, { status: 400 });

    const ids = getInsertIds(user);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const finalMarks = parseFloat(marks) || 0;
    const finalMax = parseFloat(max_marks) || 100;
    const percentage = finalMax > 0 ? ((finalMarks / finalMax) * 100) : 0;
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F';

    // القاعدة الذهبية: الدرجة ترتفع بس ما تنقص
    const result = await pool.query(
      `INSERT INTO grades (id, marks, max_marks, percentage, grade, remarks, student_id, course_id, exam_id, school_id, owner_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12)
       ON CONFLICT (exam_id, student_id) WHERE exam_id IS NOT NULL
       DO UPDATE SET marks = GREATEST(grades.marks, $2), percentage = GREATEST(grades.percentage, $4), grade = CASE WHEN $2 > grades.marks THEN $5 ELSE grades.grade END, updated_at = $12
       RETURNING *`,
      [id, finalMarks, finalMax, percentage, grade, remarks || null, student_id, course_id || '', exam_id || null, ids.school_id, ids.owner_id, now]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    // فقط super_admin يحذف درجات — القاعدة الذهبية
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'فقط مالك المنصة يقدر يحذف الدرجات' }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM grades WHERE id::text = $1::text', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
