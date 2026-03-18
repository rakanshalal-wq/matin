import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';
import { encryptExamContent, decryptExamContent } from '@/lib/encryption';

// ===== نظام الاختبارات الذكي - الجزء السابع من الوثيقة الفنية =====
// بنك أسئلة آمن + فتح بصلاحيات + تصحيح محمي + جلسات اختبار

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const { searchParams } = new URL(request.url);
    const exam_id = searchParams.get('id');
    
    // جلب اختبار واحد مع تفاصيله
    if (exam_id) {
      const exam = await pool.query(`
        SELECT e.*, s.name as school_name,
          (SELECT COUNT(*) FROM exam_questions eq WHERE eq.exam_id = e.id) as questions_count,
          (SELECT COUNT(*) FROM exam_sessions es WHERE es.exam_id = e.id::text) as sessions_count,
          (SELECT COUNT(*) FROM exam_sessions es WHERE es.exam_id = e.id::text AND es.status = 'completed') as completed_count
        FROM exams e
        LEFT JOIN schools s ON s.id = e.school_id
        WHERE e.id = $1
      `, [exam_id]);
      
      if (exam.rows.length === 0) return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
      
      // جلب الأسئلة (فقط للمعلم والمدير)
      let questions: any[] = [];
      if (['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
        const qResult = await pool.query(
          `SELECT eq.*, qb.question_text as bank_text, qb.options as bank_options, qb.correct_answer as bank_answer
           FROM exam_questions eq
           LEFT JOIN question_bank qb ON qb.id = eq.question_bank_id
           WHERE eq.exam_id = $1 ORDER BY eq."order"`,
          [exam_id]
        );
        questions = qResult.rows;
      }
      
      // جلب نتائج الطلاب
      let results: any[] = [];
      if (['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
        const rResult = await pool.query(
          `SELECT es.*, u.name as student_name
           FROM exam_sessions es
           LEFT JOIN users u ON u.id = es.student_id::integer
           WHERE es.exam_id = $1 ORDER BY es.started_at DESC`,
          [exam_id]
        );
        results = rResult.rows;
      }
      
      return NextResponse.json({ exam: exam.rows[0], questions, results });
    }
    
    const filterSql = filter.sql.replace(/AND school_id/g, 'AND e.school_id');
    const result = await pool.query(`
      SELECT e.*, s.name as school_name,
        (SELECT COUNT(*) FROM exam_questions eq WHERE eq.exam_id = e.id) as questions_count,
        (SELECT COUNT(*) FROM exam_sessions es WHERE es.exam_id = e.id::text) as sessions_count,
        (SELECT COUNT(*) FROM exam_sessions es WHERE es.exam_id = e.id::text AND es.status = 'completed') as completed_count,
        (SELECT AVG(g.marks) FROM grades g WHERE g.exam_id = e.id) as avg_score
      FROM exams e
      LEFT JOIN schools s ON s.id = e.school_id
      WHERE 1=1 ${filterSql} ORDER BY e.scheduled_at DESC NULLS LAST, e.created_at DESC
    `, filter.params);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Exams GET Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بإنشاء اختبارات' }, { status: 403 });
    }

    const body = await request.json();

    // ✅ التحقق من صحة البيانات بـ Zod
    const { z } = await import('zod');
    const ExamPostSchema = z.object({
      title: z.string().min(2, 'عنوان الاختبار يجب أن يكون حرفين على الأقل').max(200).trim().optional().nullable(),
      title_ar: z.string().min(2).max(200).trim().optional().nullable(),
      description: z.string().max(2000).optional().nullable(),
      instructions: z.string().max(2000).optional().nullable(),
      type: z.string().max(50).optional().nullable(),
      exam_type: z.string().max(50).optional().nullable(),
      total_marks: z.number().min(0).max(10000).optional().nullable(),
      passing_marks: z.number().min(0).max(100).optional().nullable(),
      duration: z.number().int().min(1).max(480).optional().nullable(),
      duration_minutes: z.number().int().min(1).max(480).optional().nullable(),
      scheduled_at: z.string().optional().nullable(),
      start_time: z.string().optional().nullable(),
      end_time: z.string().optional().nullable(),
      course_id: z.union([z.string(), z.number()]).optional().nullable(),
      school_id: z.union([z.string(), z.number()]).optional().nullable(),
      class_id: z.union([z.string(), z.number()]).optional().nullable(),
      subject: z.string().max(100).optional().nullable(),
      grade: z.string().max(50).optional().nullable(),
      shuffle_questions: z.boolean().optional(),
      shuffle_options: z.boolean().optional(),
      show_results_immediately: z.boolean().optional(),
      unlock_delegates: z.array(z.any()).optional(),
      questions: z.array(z.any()).optional(),
    }).refine(d => d.title || d.title_ar, { message: 'عنوان الاختبار مطلوب' });
    const parsed = ExamPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors.map(e => e.message).join(' | ') },
        { status: 400 }
      );
    }
    const { 
      title, title_ar, description, type, exam_type,
      total_marks, passing_marks, duration, duration_minutes,
      scheduled_at, start_time, end_time,
      course_id, school_id, class_id,
      subject, grade, instructions,
      shuffle_questions, shuffle_options, show_results_immediately,
      unlock_delegates,
      questions
    } = parsed.data;

    // تحديد المدرسة
    let finalSchoolId = school_id;
    if (!finalSchoolId && user.role === 'owner') {
      const s = await pool.query('SELECT id FROM schools WHERE owner_id = $1 LIMIT 1', [user.id]);
      if (s.rows.length > 0) finalSchoolId = s.rows[0].id;
    }
    if (!finalSchoolId && user.school_id) finalSchoolId = String(user.school_id);
    if (!finalSchoolId) return NextResponse.json({ error: 'لازم تنشئ مدرسة أول' }, { status: 400 });

    const ids = getInsertIds(user);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // حساب الدرجة الكلية من الأسئلة
    const questionsArray = Array.isArray(questions) ? questions : [];
    const calculatedTotalMarks = questionsArray.length > 0 
      ? questionsArray.reduce((sum: number, q: any) => sum + (Number(q.points) || 1), 0)
      : (total_marks || 100);
    
    const examType = exam_type || type || 'QUIZ';
    const examTypeUpper = examType.toUpperCase();
    const validTypes = ['QUIZ', 'MIDTERM', 'FINAL', 'HOMEWORK', 'PRACTICE'];
    const finalType = validTypes.includes(examTypeUpper) ? examTypeUpper : 'QUIZ';
    const finalDuration = duration_minutes || duration || 60;
    const finalScheduledAt = start_time || scheduled_at || null;

    const result = await pool.query(
      `INSERT INTO exams (id, title, title_ar, description, type, total_marks, passing_marks, duration, scheduled_at, status, course_id, school_id, subject, grade, exam_type, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5::"ExamType",$6,$7,$8,$9,'DRAFT'::"ExamStatus",$10,$11,$12,$13,$14,$15,$15) RETURNING *`,
      [id, title || title_ar, title_ar || title, description || instructions || null, finalType, calculatedTotalMarks, passing_marks || 50, finalDuration, finalScheduledAt, course_id || null, finalSchoolId, subject || null, grade || null, exam_type || type || 'quiz', now]
    );
    
    const exam = result.rows[0];
    
    // حفظ الأسئلة من question_bank
    if (questionsArray.length > 0) {
      for (let i = 0; i < questionsArray.length; i++) {
        const q = questionsArray[i];
        const qId = crypto.randomUUID();
        try {
          const qData = await pool.query('SELECT * FROM question_bank WHERE id = $1', [q.question_id]);
          const qRow = qData.rows[0];
          
          await pool.query(
            `INSERT INTO exam_questions (id, exam_id, question_bank_id, question_id, "order", points, question_text, options, correct_answer, difficulty)
             VALUES ($1, $2, $3, NULL, $4, $5, $6, $7, $8, $9)`,
            [qId, id, q.question_id, q.order || (i + 1), q.points || 1,
              qRow?.question_text || q.question_text || null,
              qRow?.options || q.options || null,
              qRow?.correct_answer || q.correct_answer || null,
              qRow?.difficulty || q.difficulty || null]
          );
          
          // تحديث عداد استخدام السؤال
          if (q.question_id) {
            await pool.query('UPDATE question_bank SET usage_count = COALESCE(usage_count, 0) + 1, times_used = COALESCE(times_used, 0) + 1 WHERE id = $1', [q.question_id]);
          }
        } catch (qErr) {
          console.error('Error inserting question:', qErr);
        }
      }
    }
    
    return NextResponse.json({ ...exam, questions_count: questionsArray.length }, { status: 201 });
  } catch (error: any) {
    console.error('Exams POST Error:', error);
    return NextResponse.json({ error: error.message || 'فشل في الإضافة' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const body = await request.json();
    const { id, action } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    // جلب الاختبار
    const examResult = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);
    if (examResult.rows.length === 0) return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
    const exam = examResult.rows[0];

    // ===== إجراءات خاصة =====
    if (action) {
      switch (action) {
        case 'publish':
          // نشر الاختبار (من DRAFT إلى PUBLISHED)
          if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
          }
          await pool.query(`UPDATE exams SET status = 'PUBLISHED'::"ExamStatus", updated_at = NOW() WHERE id = $1`, [id]);
          return NextResponse.json({ success: true, message: 'تم نشر الاختبار' });

        case 'activate':
          // تفعيل الاختبار (فتحه للطلاب)
          if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
          }
          await pool.query(`UPDATE exams SET status = 'ACTIVE'::"ExamStatus", updated_at = NOW() WHERE id = $1`, [id]);
          return NextResponse.json({ success: true, message: 'تم تفعيل الاختبار' });

        case 'close':
          // إغلاق الاختبار
          await pool.query(`UPDATE exams SET status = 'COMPLETED'::"ExamStatus", updated_at = NOW() WHERE id = $1`, [id]);
          return NextResponse.json({ success: true, message: 'تم إغلاق الاختبار' });

        case 'grade_answer':
          // تصحيح إجابة طالب (التصحيح المحمي)
          const { answer_id, grade: answerGrade, feedback } = body;
          if (!answer_id) return NextResponse.json({ error: 'معرف الإجابة مطلوب' }, { status: 400 });
          
          // التحقق من أن الإجابة ليست نهائية
          const answer = await pool.query('SELECT * FROM student_answers WHERE id = $1', [answer_id]);
          if (answer.rows.length === 0) return NextResponse.json({ error: 'الإجابة غير موجودة' }, { status: 404 });
          
          if (answer.rows[0].is_final) {
            // فقط صاحب صلاحية grades_override يمكنه التعديل
            if (!['super_admin', 'owner'].includes(user.role)) {
              return NextResponse.json({ error: 'الدرجة نهائية ولا يمكن تعديلها. يحتاج صلاحية grades_override' }, { status: 403 });
            }
          }
          
          await pool.query(
            `UPDATE student_answers SET grade = $1, is_final = true, graded_by_ai = false WHERE id = $2`,
            [answerGrade, answer_id]
          );
          return NextResponse.json({ success: true, message: 'تم تصحيح الإجابة' });

        case 'finalize_grades':
          // تثبيت جميع الدرجات (لا يمكن التعديل بعدها إلا بصلاحية خاصة)
          if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
            return NextResponse.json({ error: 'غير مصرح بتثبيت الدرجات' }, { status: 403 });
          }
          await pool.query(
            `UPDATE student_answers SET is_final = true WHERE exam_id = $1::integer`,
            [id]
          );
          return NextResponse.json({ success: true, message: 'تم تثبيت جميع الدرجات' });

        default:
          return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
      }
    }

    // تحديث عام
    const { title, title_ar, description, type, total_marks, passing_marks, duration, scheduled_at, status } = body;
    const result = await pool.query(
      `UPDATE exams SET title=$1, title_ar=$2, description=$3, type=$4::"ExamType", total_marks=$5, passing_marks=$6, duration=$7, scheduled_at=$8, status=COALESCE($9::"ExamStatus", status), updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [title, title_ar, description, type, total_marks, passing_marks, duration, scheduled_at, status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Exams PUT Error:', error);
    return NextResponse.json({ error: error.message || 'فشل' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بالحذف' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    // التحقق من عدم وجود جلسات مكتملة
    const sessions = await pool.query(
      `SELECT COUNT(*) as count FROM exam_sessions WHERE exam_id = $1 AND status = 'completed'`,
      [id]
    );
    if (parseInt(sessions.rows[0].count) > 0) {
      return NextResponse.json({ error: 'لا يمكن حذف اختبار تم إكماله من قبل طلاب' }, { status: 400 });
    }

    await pool.query('DELETE FROM exam_questions WHERE exam_id = $1', [id]);
    await pool.query('DELETE FROM exams WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'تم حذف الاختبار' });
  } catch (error: any) {
    console.error('Exams DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'فشل' }, { status: 500 });
  }
}


// === نظام التحكم بالطباعة ===
// الطباعة متاحة فقط قبل ساعة من الاختبار
// تُسجل كل عملية طباعة في سجل المراقبة
export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const { exam_id, action } = await request.json();
    if (action === 'print') {
      // جلب بيانات الاختبار
      const exam = await pool.query('SELECT * FROM exams WHERE id = $1', [exam_id]);
      if (exam.rows.length === 0) return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
      const e = exam.rows[0];
      // تحقق من الوقت — الطباعة متاحة فقط قبل ساعة
      if (e.start_time) {
        const examTime = new Date(e.start_time);
        const now = new Date();
        const diffHours = (examTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (diffHours > 1) {
          return NextResponse.json({ error: 'الطباعة غير متاحة — متاحة فقط قبل ساعة من الاختبار', allowed_at: new Date(examTime.getTime() - 60 * 60 * 1000) }, { status: 403 });
        }
      }
      // سجّل عملية الطباعة
      await pool.query(
        'INSERT INTO exam_print_logs (exam_id, user_id, copies, printed_at) VALUES ($1, $2, 1, NOW())',
        [exam_id, String(user.id)]
      ).catch(() => {});
      // سجّل في audit
      await pool.query(
        'INSERT INTO activity_log (action, details, user_id, created_at) VALUES ($1, $2, $3, NOW())',
        ['exam_print', JSON.stringify({ exam_id, user_name: user.name }), String(user.id)]
      ).catch(() => {});
      return NextResponse.json({ success: true, message: 'تم السماح بالطباعة وتسجيلها', print_allowed: true });
    }
    return NextResponse.json({ error: 'إجراء غير صحيح' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
