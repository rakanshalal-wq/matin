import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/exams/[id]/results — نتائج اختبار محدد
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await context.params;
  const examId = parseInt(id);
  if (isNaN(examId)) return NextResponse.json({ error: 'معرف غير صحيح' }, { status: 400 });

  try {
    const examCheck = await pool.query(
      'SELECT id, school_id, title_ar, total_marks FROM exams WHERE id = $1',
      [examId]
    );
    if (examCheck.rows.length === 0) {
      return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
    }
    const exam = examCheck.rows[0];
    if (user.role !== 'super_admin' && exam.school_id !== user.school_id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    let query: string;
    let queryParams: any[];

    if (user.role === 'student') {
      query = `
        SELECT es.*, u.name as student_name, u.student_id as student_number
        FROM exam_sessions es
        LEFT JOIN users u ON es.student_id = u.id
        WHERE es.exam_id = $1 AND es.student_id = $2
        ORDER BY es.submitted_at DESC
      `;
      queryParams = [examId, user.id];
    } else {
      query = `
        SELECT 
          es.*,
          u.name as student_name,
          u.student_id as student_number,
          u.email as student_email,
          ROUND((es.score::numeric / NULLIF($2::numeric, 0)) * 100, 1) as percentage
        FROM exam_sessions es
        LEFT JOIN users u ON es.student_id = u.id
        WHERE es.exam_id = $1
        ORDER BY es.score DESC NULLS LAST, es.submitted_at ASC
      `;
      queryParams = [examId, exam.total_marks || 100];
    }

    const results = await pool.query(query, queryParams);

    if (user.role !== 'student') {
      const stats = await pool.query(
        `SELECT 
          COUNT(*) as total_students,
          COUNT(CASE WHEN status = 'SUBMITTED' THEN 1 END) as submitted,
          ROUND(AVG(score), 1) as avg_score,
          MAX(score) as max_score,
          MIN(score) as min_score,
          COUNT(CASE WHEN score >= $2 * 0.5 THEN 1 END) as passed
         FROM exam_sessions WHERE exam_id = $1`,
        [examId, exam.total_marks || 100]
      );
      return NextResponse.json({
        results: results.rows,
        stats: stats.rows[0],
        exam: exam,
      });
    }

    return NextResponse.json(results.rows);
  } catch (error) {
    console.error('exams/[id]/results GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
