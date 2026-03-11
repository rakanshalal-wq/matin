import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';




export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await req.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 });
    }

    // Get school context if available
    let schoolContext = '';
    if (user.school_id) {
      const schoolResult = await pool.query('SELECT name, type, status FROM schools WHERE id::text = $1::text', [user.school_id]);
      if (schoolResult.rows.length > 0) {
        const school = schoolResult.rows[0];
        schoolContext = `المؤسسة: ${school.name} (${school.type || 'مدرسة'})`;
      }
    }

    // Build the AI prompt with context
    const systemPrompt = `أنت مساعد ذكي لمنصة متين التعليمية. ${schoolContext}. 
    دورك هو مساعدة المستخدمين في:
    - الإجابة على أسئلتهم حول استخدام المنصة
    - تقديم نصائح تعليمية وإدارية
    - المساعدة في حل المشاكل التقنية
    - تقديم اقتراحات لتحسين الأداء التعليمي
    أجب باللغة العربية بشكل مختصر ومفيد.`;

    // Try to use OpenAI API if available
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI();
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(context || []),
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content || 'عذراً، لم أتمكن من معالجة طلبك.';
      return NextResponse.json({ reply, success: true });
    } catch (aiError) {
      // Fallback: simple response if AI API is not available
      const fallbackReplies: Record<string, string> = {
        'مرحبا': 'مرحباً بك في منصة متين! كيف يمكنني مساعدتك؟',
        'كيف': 'يمكنك التنقل بين الأقسام من القائمة الجانبية. هل تحتاج مساعدة في قسم معين؟',
        'مساعدة': 'أنا هنا لمساعدتك! يمكنك سؤالي عن أي ميزة في المنصة.',
      };

      let reply = 'مرحباً بك في المساعد الذكي لمنصة متين! أنا هنا لمساعدتك. يرجى طرح سؤالك.';
      for (const [key, value] of Object.entries(fallbackReplies) ) {
        if (message.includes(key)) {
          reply = value;
          break;
        }
      }

      return NextResponse.json({ reply, success: true, fallback: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
