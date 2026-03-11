import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const exam_id = searchParams.get('exam_id');
    const session_id = searchParams.get('session_id');

    const filter = getFilterSQL(user);

    // جلب جلسة محددة مع المخالفات والإجابات
    if (session_id) {
      const session = await pool.query(`SELECT * FROM exam_sessions WHERE id::text = $1::text`, [session_id]);
      const violations = await pool.query(`SELECT * FROM exam_violations WHERE session_id = $1 ORDER BY timestamp`, [session_id]);
      const answers = await pool.query(`
        SELECT ea.*, q.text_ar as question_text, q.answer as correct_answer
        FROM exam_answers ea
        LEFT JOIN questions q ON q.id::text = ea.question_id::text
        WHERE ea.session_id = $1 ORDER BY ea.answered_at
      `, [session_id]);
      return NextResponse.json({
        session: session.rows[0] || null,
        violations: violations.rows,
        answers: answers.rows
      });
    }

    // جلب كل جلسات اختبار معين
    if (exam_id) {
      const result = await pool.query(`
        SELECT es.*, u.name as student_name, s.student_id as student_number,
          e.title_ar as exam_title
        FROM exam_sessions es
        LEFT JOIN students s ON s.id::text = es.student_id::text
        LEFT JOIN users u ON u.id::text = s.user_id
        LEFT JOIN exams e ON e.id::text = es.exam_id::text
        WHERE es.exam_id = $1 ${filter.sql}
        ORDER BY es.started_at DESC
      `, [exam_id, ...filter.params]);
      return NextResponse.json(result.rows);
    }

    // كل الجلسات
    const result = await pool.query(`
      SELECT es.*, u.name as student_name, e.title_ar as exam_title
      FROM exam_sessions es
      LEFT JOIN students s ON s.id::text = es.student_id::text
      LEFT JOIN users u ON u.id::text = s.user_id
      LEFT JOIN exams e ON e.id::text = es.exam_id::text
      WHERE 1=1 ${filter.sql}
      ORDER BY es.started_at DESC LIMIT 100
    `, filter.params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { action } = body;

    // === بدء جلسة اختبار ===
    if (action === 'start') {
      const { exam_id, student_id } = body;
      if (!exam_id || !student_id) return NextResponse.json({ error: 'الاختبار والطالب مطلوبين' }, { status: 400 });

      // تحقق من وجود جلسة سابقة نشطة
      const existing = await pool.query(
        `SELECT * FROM exam_sessions WHERE exam_id = $1 AND student_id::text = $2::text AND status = 'active'`,
        [exam_id, student_id]
      );
      if (existing.rows.length > 0) {
        // جلب الأسئلة مجدداً
        const questions = await pool.query(`
          SELECT q.id, q.text_ar, q.text, q.type, q.options, q.marks,
                 eq.question_bank_id
          FROM exam_questions eq
          JOIN questions q ON q.id::text = eq.question_id::text
          WHERE eq.exam_id = $1
          ORDER BY eq."order"
        `, [exam_id]);
        return NextResponse.json({ session: existing.rows[0], questions: questions.rows, message: 'جلسة موجودة مسبقاً' });
      }

      const ids = getInsertIds(user);
      const id = crypto.randomUUID();
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const ua = request.headers.get('user-agent') || 'unknown';

      const result = await pool.query(
        `INSERT INTO exam_sessions (id, exam_id, student_id, status, ip_address, user_agent, school_id, owner_id)
         VALUES ($1,$2,$3,'active',$4,$5,$6,$7) RETURNING *`,
        [id, exam_id, student_id, ip, ua, ids.school_id, ids.owner_id]
      );

      // جلب أسئلة الاختبار مع question_bank_id
      const questions = await pool.query(`
        SELECT q.id, q.text_ar, q.text, q.type, q.options, q.marks,
               eq.question_bank_id
        FROM exam_questions eq
        JOIN questions q ON q.id::text = eq.question_id::text
        WHERE eq.exam_id = $1
        ORDER BY eq."order"
      `, [exam_id]);

      return NextResponse.json({
        session: result.rows[0],
        questions: questions.rows,
        message: 'بدأ الاختبار — بالتوفيق!'
      }, { status: 201 });
    }

    // === تسجيل مخالفة ===
    if (action === 'violation') {
      const { session_id, type, description, severity } = body;
      if (!session_id || !type) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });

      const id = crypto.randomUUID();
      await pool.query(
        `INSERT INTO exam_violations (id, session_id, type, description, severity) VALUES ($1,$2,$3,$4,$5)`,
        [id, session_id, type, description || null, severity || 'warning']
      );

      // تحديث عدادات الجلسة
      const updateField = type === 'fullscreen_exit' ? 'fullscreen_exits' : type === 'tab_switch' ? 'tab_switches' : type === 'copy_attempt' ? 'copy_attempts' : 'suspicious_flags';
      await pool.query(`UPDATE exam_sessions SET ${updateField} = ${updateField} + 1 WHERE id::text = $1::text`, [session_id]);

      // تحقق من عدد المخالفات — 5 مخالفات = إنهاء تلقائي
      const session = await pool.query(`SELECT * FROM exam_sessions WHERE id::text = $1::text`, [session_id]);
      const s = session.rows[0];
      if (s) {
        const totalViolations = (s.fullscreen_exits || 0) + (s.tab_switches || 0) + (s.copy_attempts || 0) + (s.suspicious_flags || 0);
        if (totalViolations >= 5) {
          await pool.query(`UPDATE exam_sessions SET status = 'terminated', finished_at = NOW() WHERE id::text = $1::text`, [session_id]);
          return NextResponse.json({ warning: 'تم إنهاء الاختبار تلقائياً — تجاوزت الحد المسموح من المخالفات', terminated: true });
        }
      }

      return NextResponse.json({ recorded: true });
    }

    // === تسجيل إجابة ===
    if (action === 'answer') {
      const { session_id, question_id, answer, time_spent_seconds, question_bank_id } = body;
      if (!session_id || !question_id) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });

      // جلب الإجابة الصحيحة
      const q = await pool.query(`SELECT answer FROM questions WHERE id::text = $1::text`, [question_id]);
      const is_correct = q.rows[0] ? q.rows[0].answer === answer : false;

      const id = crypto.randomUUID();
      
      // إضافة question_bank_id إذا كان عمود موجود
      try {
        await pool.query(
          `INSERT INTO exam_answers (id, session_id, question_id, answer, is_correct, time_spent_seconds, question_bank_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (session_id, question_id) DO UPDATE SET answer = $4, is_correct = $5, time_spent_seconds = $6, answered_at = NOW()`,
          [id, session_id, question_id, answer, is_correct, time_spent_seconds || 0, question_bank_id || null]
        );
      } catch {
        // fallback بدون question_bank_id
        await pool.query(
          `INSERT INTO exam_answers (id, session_id, question_id, answer, is_correct, time_spent_seconds)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (session_id, question_id) DO UPDATE SET answer = $4, is_correct = $5, time_spent_seconds = $6, answered_at = NOW()`,
          [id, session_id, question_id, answer, is_correct, time_spent_seconds || 0]
        );
      }

      // تحديث إحصائيات question_bank إذا كان السؤال من البنك
      if (question_bank_id) {
        try {
          const timeSpent = time_spent_seconds || 0;
          await pool.query(`
            UPDATE question_bank SET
              times_used = times_used + 1,
              times_correct = times_correct + $1,
              times_wrong = times_wrong + $2,
              avg_time_seconds = CASE 
                WHEN times_used = 0 THEN $3
                ELSE (avg_time_seconds * times_used + $3) / (times_used + 1)
              END
            WHERE id::text = $4::text
          `, [is_correct ? 1 : 0, is_correct ? 0 : 1, timeSpent, question_bank_id]);
        } catch (e) {
          console.error('[exam-session] Failed to update question_bank stats:', e);
        }
      }

      return NextResponse.json({ saved: true, is_correct });
    }

    // === إنهاء الاختبار ===
    if (action === 'finish') {
      const { session_id } = body;
      if (!session_id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

      await pool.query(
        `UPDATE exam_sessions SET status = 'completed', finished_at = NOW() WHERE id::text = $1::text`,
        [session_id]
      );

      // حساب الدرجة
      const answers = await pool.query(
        `SELECT COUNT(*) FILTER (WHERE is_correct = true) as correct, COUNT(*) as total FROM exam_answers WHERE session_id = $1`,
        [session_id]
      );
      const { correct, total } = answers.rows[0];
      const correctNum = parseInt(correct);
      const totalNum = parseInt(total);
      const pct = totalNum > 0 ? Math.round((correctNum / totalNum) * 100) : 0;
      const gradeLabel = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';

      // تحديث exam_sessions بالنتيجة
      await pool.query(
        `UPDATE exam_sessions SET score = $1, total_marks = $2, percentage = $3, grade = $4 WHERE id::text = $5::text`,
        [correctNum, totalNum, pct, gradeLabel, session_id]
      );

      // حفظ الدرجة تلقائياً في جدول grades
      try {
        const sessionInfo = await pool.query(
          `SELECT es.student_id, es.exam_id, e.school_id, e.owner_id, e.subject_id as course_id
           FROM exam_sessions es LEFT JOIN exams e ON e.id::text = es.exam_id::text
           WHERE es.id::text = $1::text`, [session_id]
        );
        if (sessionInfo.rows[0]) {
          const si = sessionInfo.rows[0];
          const gradeId = crypto.randomUUID();
          await pool.query(
            `INSERT INTO grades (id, marks, max_marks, percentage, grade, remarks, student_id, course_id, exam_id, school_id, owner_id, created_at, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW()
             ON CONFLICT (exam_id, student_id) DO UPDATE SET
               marks = GREATEST(grades.marks, $2), percentage = GREATEST(grades.percentage, $4),
               grade = CASE WHEN $2 > grades.marks THEN $5 ELSE grades.grade END, updated_at = NOW()`,
            [gradeId, correctNum, totalNum, pct, gradeLabel, 'تصحيح تلقائي', si.student_id, si.course_id || '', si.exam_id, si.school_id, si.owner_id]
          );
        }
      } catch (gradeErr) { console.error('[exam-session] Auto-grade save error:', gradeErr); }

      // تشغيل تحليل الأسئلة تلقائياً بعد كل اختبار
      try {
        const qbAnswers = await pool.query(`
          SELECT ea.question_bank_id, ea.is_correct, ea.time_spent_seconds
          FROM exam_answers ea
          WHERE ea.session_id = $1 AND ea.question_bank_id IS NOT NULL
        `, [session_id]);
        
        // تحديث quality_label للأسئلة التي لديها بيانات كافية
        for (const ans of qbAnswers.rows) {
          const stats = await pool.query(`
            SELECT times_used, times_correct, times_wrong, avg_time_seconds
            FROM question_bank WHERE id::text = $1::text
          `, [ans.question_bank_id]);
          
          if (stats.rows[0] && stats.rows[0].times_used >= 5) {
            const { times_used, times_correct, avg_time_seconds } = stats.rows[0];
            const correctRate = times_correct / times_used;
            
            let quality_label = 'غير محلل';
            let quality_score = 0.5;
            
            if (correctRate > 0.9) { quality_label = 'سهل جداً'; quality_score = 0.3; }
            else if (correctRate > 0.7) { quality_label = 'جيد - سهل'; quality_score = 0.65; }
            else if (correctRate >= 0.4) { quality_label = 'ممتاز'; quality_score = 0.9; }
            else if (correctRate >= 0.2) { quality_label = 'جيد - صعب'; quality_score = 0.7; }
            else { quality_label = 'صعب جداً'; quality_score = 0.25; }
            
            await pool.query(`
              UPDATE question_bank SET quality_label = $1, quality_score = $2, ai_analyzed = true
              WHERE id::text = $3::text
            `, [quality_label, quality_score, ans.question_bank_id]);
          }
        }
      } catch (e) {
        console.error('[exam-session] Auto-analyze error:', e);
      }

      return NextResponse.json({
        finished: true,
        correct: parseInt(correct),
        total: parseInt(total),
        percentage: total > 0 ? Math.round((correct / total) * 100) : 0
      });
    }

    return NextResponse.json({ error: 'action مطلوب' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
