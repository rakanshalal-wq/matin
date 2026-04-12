import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { chat } from '@/lib/ai';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ chats: [], messages: [] });

    const chats = await pool.query(
      `SELECT * FROM ai_chats WHERE user_id::text = $1::text ORDER BY created_at DESC LIMIT 50`,
      [String(user.id)]
    ).catch(() => ({ rows: [] }));

    return NextResponse.json({ chats: chats.rows, messages: chats.rows });
  } catch (e: any) {
    console.error('AI Chat GET error:', e.message);
    return NextResponse.json({ chats: [], messages: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await req.json();
    const { message, school_id, history } = body;

    if (!message) return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 });

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      {
        role: 'system',
        content: 'أنت مساعد تعليمي ذكي لمنصة متين. ساعد المستخدم في إدارة المدرسة والطلاب والمعلمين والاختبارات. أجب بالعربية بشكل واضح ومختصر.',
      },
    ];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role && item.content) {
          messages.push({ role: item.role, content: String(item.content) });
        }
      }
    }

    messages.push({ role: 'user', content: message });

    let reply: string;
    try {
      const result = await chat(messages, { maxTokens: 500 });
      reply = result.text;
    } catch {
      reply = 'مرحباً! أنا مساعد متين الذكي. يمكنني مساعدتك في إدارة المدرسة، متابعة الطلاب، والتقارير. كيف يمكنني مساعدتك؟';
    }

    await pool.query(
      `INSERT INTO ai_chats (user_id, message, reply, school_id, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [String(user.id), message, reply, school_id || null]
    ).catch(() => {});

    return NextResponse.json({ reply, success: true });
  } catch (e: any) {
    console.error('AI Chat POST error:', e.message);
    return NextResponse.json({ reply: 'عذراً، حدث خطأ. حاول مجدداً.', success: false });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `DELETE FROM ai_chats WHERE id = $1 AND user_id::text = $2::text RETURNING id`,
      [id, user.id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود أو غير مصرح بحذفه' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE ai-chat error:', error);
    return NextResponse.json({ error: 'خطأ في الحذف' }, { status: 500 });
  }
}
