import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

// POST /api/exams/ai-generate — توليد أسئلة اختبار بالذكاء الاصطناعي
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { subject, topic, grade_level, count = 10, difficulty = 'medium', question_type = 'MCQ', language = 'ar' } = body;

    if (!subject || !topic) {
      return NextResponse.json({ error: 'المادة والموضوع مطلوبان' }, { status: 400 });
    }

    const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
    const apiUrl = process.env.BUILT_IN_FORGE_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json({ error: 'خدمة الذكاء الاصطناعي غير متاحة' }, { status: 503 });
    }

    const difficultyMap: Record<string, string> = {
      easy: 'سهلة',
      medium: 'متوسطة',
      hard: 'صعبة',
    };

    const prompt = language === 'ar'
      ? `أنت معلم خبير. أنشئ ${count} سؤال اختبار من نوع ${question_type === 'MCQ' ? 'اختيار متعدد (4 خيارات)' : 'صح/خطأ'} عن مادة "${subject}" وموضوع "${topic}"${grade_level ? ` للصف ${grade_level}` : ''}. المستوى: ${difficultyMap[difficulty] || 'متوسط'}.

أعد النتيجة بصيغة JSON فقط بدون أي نص إضافي:
{
  "questions": [
    {
      "question_text": "نص السؤال",
      "question_type": "${question_type}",
      "options": ["الخيار أ", "الخيار ب", "الخيار ج", "الخيار د"],
      "correct_answer": "الخيار الصحيح",
      "explanation": "شرح الإجابة",
      "marks": 1,
      "difficulty": "${difficulty}"
    }
  ]
}`
      : `You are an expert teacher. Create ${count} ${question_type === 'MCQ' ? 'multiple choice (4 options)' : 'true/false'} questions about "${subject}" on the topic "${topic}"${grade_level ? ` for grade ${grade_level}` : ''}. Difficulty: ${difficulty}.

Return ONLY valid JSON:
{
  "questions": [
    {
      "question_text": "Question text",
      "question_type": "${question_type}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Correct option",
      "explanation": "Explanation",
      "marks": 1,
      "difficulty": "${difficulty}"
    }
  ]
}`;

    const aiResponse = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const err = await aiResponse.text();
      console.error('AI API error:', err);
      return NextResponse.json({ error: 'فشل توليد الأسئلة' }, { status: 502 });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || aiData.content?.[0]?.text || '';

    // استخرج JSON من الرد
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'تنسيق الرد غير صحيح' }, { status: 502 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      return NextResponse.json({ error: 'لم يتم توليد أسئلة' }, { status: 502 });
    }

    return NextResponse.json({
      questions: parsed.questions,
      count: parsed.questions.length,
      subject,
      topic,
    });
  } catch (error) {
    console.error('exams/ai-generate POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
