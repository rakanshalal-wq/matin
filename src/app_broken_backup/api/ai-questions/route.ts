import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { subject, topic, from_page, to_page, count, difficulty, types, exam_type } = await request.json();
    if (!subject || !count) return NextResponse.json({ error: 'المادة وعدد الأسئلة مطلوبة' }, { status: 400 });

    // جلب مفتاح AI
    const aiKeyResult = await pool.query("SELECT value FROM platform_settings WHERE key = 'ai_api_key'");
    const aiKey = aiKeyResult.rows[0]?.value;

    let questions: any[] = [];

    if (aiKey) {
      // توليد بالـ AI الحقيقي
      const prompt = `أنت نظام توليد أسئلة تعليمية.
ولّد ${count} سؤال في مادة "${subject}" ${topic ? 'موضوع: ' + topic : ''} ${from_page && to_page ? 'من صفحة ' + from_page + ' إلى صفحة ' + to_page : ''}.
نوع الاختبار: ${exam_type || 'جزئي'}.
مستوى الصعوبة: ${difficulty || 'متوسط'}.
أنواع الأسئلة المطلوبة: ${types?.join(', ') || 'اختيار من متعدد, صح وخطأ'}.

أرجع JSON فقط بدون أي نص إضافي بالشكل التالي:
[{"text":"نص السؤال","type":"mcq","options":["أ","ب","ج","د"],"answer":"أ","difficulty":"easy|medium|hard","marks":1}]

لـ صح وخطأ: type="true_false", options=["صح","خطأ"]
لـ مقالي: type="essay", options=null`;

      try {
        const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': aiKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            messages: [{ role: 'user', content: prompt }]
          })
        });
        const aiData = await aiRes.json();
        const text = aiData.content?.[0]?.text || '';
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) questions = JSON.parse(jsonMatch[0]);
      } catch (e) { console.error('AI Error:', e); }
    }

    // لو AI ما اشتغل — نولّد أسئلة نموذجية
    if (questions.length === 0) {
      for (let i = 0; i < (count || 5); i++) {
        questions.push({
          text: `سؤال ${i + 1} في ${subject} ${topic ? '- ' + topic : ''}`,
          type: i % 3 === 0 ? 'true_false' : 'mcq',
          options: i % 3 === 0 ? ['صح', 'خطأ'] : ['أ', 'ب', 'ج', 'د'],
          answer: i % 3 === 0 ? 'صح' : 'أ',
          difficulty: ['easy', 'medium', 'hard'][i % 3],
          marks: 1,
          ai_generated: true,
          ai_confidence: 0,
          needs_review: true,
        });
      }
    }

    // تقييم مستوى كل سؤال بالألوان
    questions = questions.map((q: any) => {
      let level_color = 'green';
      let level_label = 'سهل';
      if (q.difficulty === 'medium') { level_color = 'yellow'; level_label = 'متوسط'; }
      if (q.difficulty === 'hard') { level_color = 'red'; level_label = 'صعب'; }
      return { ...q, level_color, level_label, ai_generated: true, needs_review: true, approved: false };
    });

    // تقييم توازن الاختبار
    const easy = questions.filter((q: any) => q.difficulty === 'easy').length;
    const medium = questions.filter((q: any) => q.difficulty === 'medium').length;
    const hard = questions.filter((q: any) => q.difficulty === 'hard').length;
    const total = questions.length;
    const balanced = (easy / total >= 0.3 && easy / total <= 0.5) && (hard / total <= 0.25);

    // سجل في audit log
    await pool.query(
      `INSERT INTO activity_log (action, details, user_id, created_at) VALUES ($1, $2, $3, NOW()`,
      ['ai_question_generation', JSON.stringify({ subject, topic, count, difficulty, exam_type, questions_generated: questions.length }), String(user.id)]
    ).catch(() => {});

    return NextResponse.json({
      success: true,
      questions,
      analysis: {
        total,
        easy, medium, hard,
        easy_pct: Math.round((easy / total) * 100),
        medium_pct: Math.round((medium / total) * 100),
        hard_pct: Math.round((hard / total) * 100),
        balanced,
        warning: !balanced ? '⚠️ الاختبار غير متوازن — يرجى تعديل توزيع الصعوبة' : null,
      },
      message: '⚠️ الأسئلة تحتاج مراجعة واعتماد من المعلم قبل استخدامها',
    });
  } catch (error: any) {
    console.error('AI Questions Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
