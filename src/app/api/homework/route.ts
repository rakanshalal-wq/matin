import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const { searchParams } = new URL(request.url);
    const homework_id = searchParams.get('homework_id');
    const student_id = searchParams.get('student_id');

    // جلب تسليمات واجب معين
    if (homework_id && searchParams.get('submissions') === 'true') {
      const result = await pool.query(`
        SELECT hs.*, u.name as student_name, s.student_id as student_number
        FROM homework_submissions hs
        LEFT JOIN students s ON s.id = hs.student_id
        LEFT JOIN users u ON u.id::text = s.user_id
        WHERE hs.homework_id = $1
        ORDER BY hs.submitted_at DESC
      `, [homework_id]);
      return NextResponse.json(result.rows);
    }

    // جلب واجبات طالب معين
    if (student_id) {
      const result = await pool.query(`
        SELECT h.*, hs.id as submission_id, hs.status as submission_status, 
               hs.grade as submission_grade, hs.submitted_at,
               hs.file_url as submission_file
        FROM homework h
        LEFT JOIN homework_submissions hs ON hs.homework_id = h.id AND hs.student_id = $1
        WHERE 1=1 ${filter.sql}
        ORDER BY h.due_date DESC
      `, [student_id, ...filter.params]);
      return NextResponse.json(result.rows);
    }

    // جلب كل الواجبات مع عدد التسليمات
    const result = await pool.query(`
      SELECT h.*, 
        (SELECT COUNT(*) FROM homework_submissions WHERE homework_id = h.id) as submissions_count,
        (SELECT COUNT(*) FROM homework_submissions WHERE homework_id = h.id AND status = 'graded') as graded_count
      FROM homework h
      WHERE 1=1 ${filter.sql}
      ORDER BY h.created_at DESC LIMIT 200
    `, filter.params);
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);
    const body = await request.json();
    const { action } = body;

    // === تسليم واجب (طالب) ===
    if (action === 'submit') {
      const { homework_id, student_id, content, file_url } = body;
      if (!homework_id || !student_id) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
      
      const id = crypto.randomUUID();
      const result = await pool.query(
        `INSERT INTO homework_submissions (id, homework_id, student_id, content, file_url, status, submitted_at, school_id, owner_id)
         VALUES ($1,$2,$3,$4,$5,'submitted',NOW(),$6,$7)
         ON CONFLICT (homework_id, student_id) DO UPDATE SET
           content = $4, file_url = $5, status = 'submitted', submitted_at = NOW()
         RETURNING *`,
        [id, homework_id, student_id, content || null, file_url || null, ids.school_id, ids.owner_id]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // === تقييم واجب (معلم) ===
    if (action === 'grade') {
      const { submission_id, grade, max_grade, feedback } = body;
      if (!submission_id) return NextResponse.json({ error: 'معرف التسليم مطلوب' }, { status: 400 });
      
      const pct = max_grade > 0 ? Math.round((grade / max_grade) * 100) : 0;
      const result = await pool.query(
        `UPDATE homework_submissions SET grade = $1, max_grade = $2, percentage = $3, feedback = $4, status = 'graded', graded_at = NOW(), graded_by = $5
         WHERE id = $6 RETURNING *`,
        [grade, max_grade || 100, pct, feedback || null, user.id || user.user_id, submission_id]
      );

      // حفظ الدرجة في جدول grades
      if (result.rows[0]) {
        const sub = result.rows[0];
        try {
          const hw = await pool.query('SELECT * FROM homework WHERE id = $1', [sub.homework_id]);
          const hwData = hw.rows[0];
          const gradeId = crypto.randomUUID();
          const gradeLabel = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';
          await pool.query(
            `INSERT INTO grades (id, marks, max_marks, percentage, grade, remarks, student_id, course_id, homework_id, school_id, owner_id, created_at, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())
             ON CONFLICT DO NOTHING`,
            [gradeId, grade, max_grade || 100, pct, gradeLabel, feedback || 'تقييم واجب', sub.student_id, hwData?.subject || '', sub.homework_id, sub.school_id || ids.school_id, sub.owner_id || ids.owner_id]
          );
        } catch (e) { console.error('[homework] Grade save error:', e); }
      }
      return NextResponse.json(result.rows[0]);
    }

    // === إنشاء واجب جديد ===
    const { title, description, subject, class_name, teacher_name, due_date, status, max_grade, attachments } = body;
    if (!title) return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });
    
    const id = crypto.randomUUID();
    const result = await pool.query(
      `INSERT INTO homework (id, title, description, subject, class_name, teacher_name, due_date, status, max_grade, attachments, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW()) RETURNING *`,
      [id, title, description || null, subject || null, class_name || null, teacher_name || null, due_date || null, status || 'active', max_grade || 100, JSON.stringify(attachments || []), ids.school_id, ids.owner_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, title, description, subject, class_name, teacher_name, due_date, status, max_grade } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    
    const result = await pool.query(
      `UPDATE homework SET title=$1, description=$2, subject=$3, class_name=$4, teacher_name=$5, due_date=$6, status=$7, max_grade=$8
       WHERE id=$9 RETURNING *`,
      [title, description, subject, class_name, teacher_name, due_date, status, max_grade || 100, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM homework_submissions WHERE homework_id = $1', [id]);
    await pool.query('DELETE FROM homework WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
