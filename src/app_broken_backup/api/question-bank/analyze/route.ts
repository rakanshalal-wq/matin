import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// =====================================================
// API التحليل الذكي للأسئلة - منصة متين
// يحلل جودة الأسئلة بناءً على أداء الطلاب الفعلي
// =====================================================

/**
 * حساب جودة السؤال بناءً على:
 * - معدل الإجابة الصحيحة (discrimination index)
 * - متوسط الوقت المستغرق
 * - عدد مرات الاستخدام
 */
function calculateQuality(timesUsed: number, timesCorrect: number, timesWrong: number, avgTime: number): {
  score: number;
  label: string;
  details: string;
} {
  if (timesUsed < 5) {
    return { score: 0.5, label: 'غير محلل بعد', details: 'يحتاج على الأقل 5 إجابات للتحليل' };
  }

  const correctRate = timesCorrect / timesUsed;
  
  // السؤال الجيد: معدل إجابة صحيحة بين 30% و 80%
  // السؤال السهل جداً: > 90% صح (لا يميز بين الطلاب)
  // السؤال الصعب جداً: < 20% صح (قد يكون مربكاً)
  
  let score = 0;
  let label = '';
  let details = '';

  if (correctRate > 0.9) {
    score = 0.3;
    label = 'سهل جداً';
    details = `${Math.round(correctRate * 100)}% من الطلاب أجابوا صح — السؤال سهل جداً ولا يميز`;
  } else if (correctRate > 0.7) {
    score = 0.65;
    label = 'جيد - سهل';
    details = `${Math.round(correctRate * 100)}% معدل الإجابة الصحيحة — سؤال جيد للمراجعة`;
  } else if (correctRate >= 0.4) {
    score = 0.9;
    label = 'ممتاز';
    details = `${Math.round(correctRate * 100)}% معدل الإجابة الصحيحة — سؤال ممتاز ومميز`;
  } else if (correctRate >= 0.2) {
    score = 0.7;
    label = 'جيد - صعب';
    details = `${Math.round(correctRate * 100)}% معدل الإجابة الصحيحة — سؤال صعب نسبياً`;
  } else {
    score = 0.25;
    label = 'صعب جداً';
    details = `${Math.round(correctRate * 100)}% فقط أجابوا صح — قد يكون السؤال مربكاً أو غامضاً`;
  }

  // تعديل بناءً على الوقت
  if (avgTime > 120) {
    details += ` | متوسط الوقت ${Math.round(avgTime)}ث (طويل)`;
  } else if (avgTime < 10 && timesUsed > 10) {
    details += ` | متوسط الوقت ${Math.round(avgTime)}ث (سريع جداً - قد يكون واضحاً)`;
  }

  return { score, label, details };
}

// GET: جلب تحليل الأسئلة
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id');
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const minUsed = parseInt(searchParams.get('min_used') || '0');

    let query = `
      SELECT 
        qb.id,
        qb.question_text,
        qb.subject,
        qb.grade,
        qb.difficulty,
        qb.times_used,
        qb.times_correct,
        qb.times_wrong,
        qb.avg_time_seconds,
        qb.quality_score,
        qb.quality_label,
        qb.is_global,
        CASE 
          WHEN qb.times_used > 0 THEN ROUND((qb.times_correct::numeric / qb.times_used) * 100, 1)
          ELSE 0
        END as correct_rate
      FROM question_bank qb
      WHERE qb.is_active = true
    `;
    const params: any[] = [];

    // صلاحيات
    if (user.role !== 'super_admin') {
      const schoolId = user.school_id;
      if (schoolId) {
        params.push(schoolId);
        query += ` AND (qb.is_global = true OR qb.school_id = $${params.length})`;
      } else {
        query += ` AND qb.is_global = true`;
      }
    }

    if (questionId) {
      params.push(questionId);
      query += ` AND qb.id = $${params.length}`;
    }
    if (subject) {
      params.push(subject);
      query += ` AND qb.subject = $${params.length}`;
    }
    if (grade) {
      params.push(grade);
      query += ` AND qb.grade = $${params.length}`;
    }
    if (minUsed > 0) {
      params.push(minUsed);
      query += ` AND qb.times_used >= $${params.length}`;
    }

    query += ` ORDER BY qb.times_used DESC, qb.quality_score DESC LIMIT 200`;

    const result = await pool.query(query, params);
    
    // إضافة التحليل المحسوب لكل سؤال
    const analyzed = result.rows.map(q => {
      const quality = calculateQuality(
        q.times_used || 0,
        q.times_correct || 0,
        q.times_wrong || 0,
        q.avg_time_seconds || 0
      );
      return {
        ...q,
        computed_quality: quality,
      };
    });

    // إحصاءات إجمالية
    const stats = {
      total: analyzed.length,
      analyzed: analyzed.filter(q => (q.times_used || 0) >= 5).length,
      excellent: analyzed.filter(q => q.quality_label === 'ممتاز').length,
      good: analyzed.filter(q => ['جيد - سهل', 'جيد - صعب'].includes(q.quality_label).length,
      weak: analyzed.filter(q => ['سهل جداً', 'صعب جداً'].includes(q.quality_label).length,
      avg_correct_rate: analyzed.length > 0
        ? Math.round(analyzed.reduce((sum, q) => sum + parseFloat(q.correct_rate || 0), 0) / analyzed.length)
        : 0,
    };

    return NextResponse.json({ questions: analyzed, stats });
  } catch (error) {
    console.error('[QuestionAnalyze GET] Error:', error);
    return NextResponse.json({ questions: [], stats: {} });
  }
}

// POST: تحديث إحصاءات سؤال بعد إجابة طالب
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { question_bank_id, is_correct, time_seconds } = body;

    if (!question_bank_id) {
      return NextResponse.json({ error: 'question_bank_id مطلوب' }, { status: 400 });
    }

    // تحديث إحصاءات السؤال
    const updateResult = await pool.query(`
      UPDATE question_bank SET
        times_used = times_used + 1,
        times_correct = times_correct + $1,
        times_wrong = times_wrong + $2,
        avg_time_seconds = CASE 
          WHEN times_used = 0 THEN $3
          ELSE (avg_time_seconds * times_used + $3) / (times_used + 1)
        END,
        updated_at = NOW()
      WHERE id::text = $4::text
      RETURNING times_used, times_correct, times_wrong, avg_time_seconds
    `, [
      is_correct ? 1 : 0,
      is_correct ? 0 : 1,
      time_seconds || 0,
      question_bank_id
    ]);

    if (updateResult.rows.length === 0) {
      return NextResponse.json({ error: 'السؤال غير موجود' }, { status: 404 });
    }

    const q = updateResult.rows[0];
    const quality = calculateQuality(q.times_used, q.times_correct, q.times_wrong, q.avg_time_seconds);

    // تحديث quality_score و quality_label
    await pool.query(`
      UPDATE question_bank SET
        quality_score = $1,
        quality_label = $2,
        ai_analyzed = true
      WHERE id::text = $3::text
    `, [quality.score, quality.label, question_bank_id]);

    return NextResponse.json({
      updated: true,
      quality,
      stats: q,
    });
  } catch (error) {
    console.error('[QuestionAnalyze POST] Error:', error);
    return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
  }
}

// PUT: إعادة تحليل جميع الأسئلة (للـ super_admin)
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح - super_admin فقط' }, { status: 403 });
    }

    // جلب جميع الأسئلة التي لديها بيانات
    const questions = await pool.query(`
      SELECT id, times_used, times_correct, times_wrong, avg_time_seconds
      FROM question_bank
      WHERE times_used > 0
    `);

    let updated = 0;
    for (const q of questions.rows) {
      const quality = calculateQuality(q.times_used, q.times_correct, q.times_wrong, q.avg_time_seconds);
      await pool.query(`
        UPDATE question_bank SET
          quality_score = $1,
          quality_label = $2,
          ai_analyzed = $3
        WHERE id::text = $4::text
      `, [quality.score, quality.label, quality.label !== 'غير محلل بعد', q.id]);
      updated++;
    }

    return NextResponse.json({
      success: true,
      analyzed: updated,
      message: `تم إعادة تحليل ${updated} سؤال`,
    });
  } catch (error) {
    console.error('[QuestionAnalyze PUT] Error:', error);
    return NextResponse.json({ error: 'فشل التحليل' }, { status: 500 });
  }
}
