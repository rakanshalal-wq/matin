import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import crypto from 'crypto';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// بدء جلسة اختبار جديدة
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'student') return NextResponse.json({ error: 'غير مصرح - للطلاب فقط' }, { status: 401 });

    const body = await request.json();
    const { exam_id } = body;
    if (!exam_id) return NextResponse.json({ error: 'معرف الاختبار مطلوب' }, { status: 400 });

    // التحقق من الاختبار
    const examResult = await pool.query('SELECT * FROM exams WHERE id = $1', [exam_id]);
    if (examResult.rows.length === 0) return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
    const exam = examResult.rows[0];

    // التحقق من عدم وجود جلسة سابقة
    const existingSession = await pool.query(
      'SELECT * FROM exam_sessions WHERE exam_id = $1 AND student_id = $2 AND status != $3',
      [exam_id, user.id, 'abandoned']
    );
    if (existingSession.rows.length > 0) {
      const session = existingSession.rows[0];
      if (session.status === 'completed') return NextResponse.json({ error: 'لقد أكملت هذا الاختبار مسبقاً' }, { status: 400 });
      // إرجاع الجلسة الحالية
      const questions = await pool.query(
        `SELECT eq.id, eq.question_text, eq.question_type, eq.options, eq.points, eq.order_index
         FROM exam_questions eq WHERE eq.exam_id = $1 ORDER BY eq.order_index`,
        [exam_id]
      );
      return NextResponse.json({ session_id: session.id, exam, questions: questions.rows, resumed: true });
    }

    // إنشاء جلسة جديدة
    const sessionId = crypto.randomUUID();
    const ipAddress = '0.0.0.0';
    await pool.query(
      `INSERT INTO exam_sessions (id, exam_id, student_id, status, started_at, ip_address, school_id)
       VALUES ($1, $2, $3, 'in_progress', NOW(), $4, $5)`,
      [sessionId, exam_id, user.id, ipAddress, user.school_id]
    );

    // جلب الأسئلة وخلطها
    const questions = await pool.query(
      `SELECT id, question_text, question_type, options, points, order_index
       FROM exam_questions WHERE exam_id = $1 ORDER BY order_index`,
      [exam_id]
    );

    let shuffledQuestions = questions.rows;
    if (exam.shuffle_questions) {
      shuffledQuestions = shuffleArray(questions.rows);
    }

    // خلط خيارات كل سؤال
    shuffledQuestions = shuffledQuestions.map(q => {
      if (q.question_type === 'multiple_choice' && q.options) {
        try {
          const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
          return { ...q, options: shuffleArray(opts) };
        } catch { return q; }
      }
      return q;
    });

    return NextResponse.json({
      session_id: sessionId,
      exam: { id: exam.id, title: exam.title, duration_minutes: exam.duration_minutes, total_marks: exam.total_marks },
      questions: shuffledQuestions,
      started_at: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error starting exam:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// حفظ إجابة سؤال واحد
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'student') return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { session_id, question_id, answer, action } = body;

    if (action === 'submit') {
      // تسليم الاختبار
      const session = await pool.query('SELECT * FROM exam_sessions WHERE id = $1 AND student_id = $2', [session_id, user.id]);
      if (session.rows.length === 0) return NextResponse.json({ error: 'الجلسة غير موجودة' }, { status: 404 });

      // التصحيح التلقائي
      const answers = await pool.query(
        `SELECT sa.*, eq.correct_answer, eq.points FROM student_answers sa
         JOIN exam_questions eq ON eq.id = sa.question_id WHERE sa.session_id = $1`,
        [session_id]
      );

      let totalScore = 0;
      for (const ans of answers.rows) {
        const isCorrect = ans.answer === ans.correct_answer;
        if (isCorrect) totalScore += (ans.points || 1);
        await pool.query('UPDATE student_answers SET is_correct = $1, score = $2 WHERE id = $3',
          [isCorrect, isCorrect ? (ans.points || 1) : 0, ans.id]);
      }

      await pool.query(
        'UPDATE exam_sessions SET status = $1, finished_at = NOW(), score = $2 WHERE id = $3',
        ['completed', totalScore, session_id]
      );

      // حفظ الدرجة في جدول grades
      const examData = session.rows[0];
      await pool.query(
        `INSERT INTO grades (student_id, exam_id, score, school_id, created_at)
         VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT DO NOTHING`,
        [user.id, examData.exam_id, totalScore, user.school_id]
      );

      return NextResponse.json({ success: true, score: totalScore, total_questions: answers.rows.length });
    }

    // حفظ إجابة سؤال
    const existing = await pool.query(
      'SELECT id FROM student_answers WHERE session_id = $1 AND question_id = $2',
      [session_id, question_id]
    );

    if (existing.rows.length > 0) {
      await pool.query('UPDATE student_answers SET answer = $1, answered_at = NOW() WHERE id = $2',
        [answer, existing.rows[0].id]);
    } else {
      await pool.query(
        `INSERT INTO student_answers (session_id, question_id, answer, answered_at, school_id)
         VALUES ($1, $2, $3, NOW(), $4)`,
        [session_id, question_id, answer, user.school_id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
