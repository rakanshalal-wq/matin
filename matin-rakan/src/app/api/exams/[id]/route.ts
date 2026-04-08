import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// PATCH /api/exams/[id] — تغيير حالة الاختبار
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { id } = await context.params;
  const examId = parseInt(id);
  if (isNaN(examId)) return NextResponse.json({ error: 'معرف غير صحيح' }, { status: 400 });

  try {
    const body = await req.json();
    const { status } = body;

    const validStatuses = ['DRAFT', 'PUBLISHED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'حالة غير صحيحة' }, { status: 400 });
    }

    const check = await pool.query(
      'SELECT id, school_id FROM exams WHERE id = $1',
      [examId]
    );
    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
    }
    if (user.role !== 'super_admin' && check.rows[0].school_id !== user.school_id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const result = await pool.query(
      `UPDATE exams SET status = $1::text, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, examId]
    );

    await pool.query(
      'INSERT INTO activity_log (action, details, user_id, school_id, created_at) VALUES ($1, $2, $3, $4, NOW())',
      ['exam_status_change', JSON.stringify({ exam_id: examId, new_status: status }), String(user.id), user.school_id]
    ).catch(() => {});

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('exams/[id] PATCH error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/exams/[id] — حذف اختبار
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { id } = await context.params;
  const examId = parseInt(id);
  if (isNaN(examId)) return NextResponse.json({ error: 'معرف غير صحيح' }, { status: 400 });

  try {
    const check = await pool.query(
      'SELECT id, school_id, status FROM exams WHERE id = $1',
      [examId]
    );
    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
    }
    const exam = check.rows[0];
    if (user.role !== 'super_admin' && exam.school_id !== user.school_id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    if (exam.status === 'ACTIVE') {
      return NextResponse.json({ error: 'لا يمكن حذف اختبار نشط' }, { status: 409 });
    }

    await pool.query('DELETE FROM exam_questions WHERE exam_id = $1', [examId]);
    await pool.query('DELETE FROM exam_sessions WHERE exam_id = $1', [examId]).catch(() => {});
    await pool.query('DELETE FROM exams WHERE id = $1', [examId]);

    return NextResponse.json({ success: true, message: 'تم حذف الاختبار' });
  } catch (error) {
    console.error('exams/[id] DELETE error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// GET /api/exams/[id] — جلب اختبار محدد
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await context.params;
  const examId = parseInt(id);
  if (isNaN(examId)) return NextResponse.json({ error: 'معرف غير صحيح' }, { status: 400 });

  try {
    const exam = await pool.query(
      'SELECT * FROM exams WHERE id = $1 AND school_id = $2',
      [examId, user.school_id]
    );
    if (exam.rows.length === 0) {
      return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
    }

    const questions = await pool.query(
      'SELECT * FROM exam_questions WHERE exam_id = $1 ORDER BY order_num ASC',
      [examId]
    );

    return NextResponse.json({ ...exam.rows[0], questions: questions.rows });
  } catch (error) {
    console.error('exams/[id] GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
