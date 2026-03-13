import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/auth';
import jwt from 'jsonwebtoken';

function getUserFromToken(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (auth?.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      return jwt.verify(token, process.env.JWT_SECRET || 'matin_secret_2024') as any;
    }
    const cookie = req.cookies.get('matin_token')?.value;
    if (cookie) {
      return jwt.verify(cookie, process.env.JWT_SECRET || 'matin_secret_2024') as any;
    }
    return null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
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
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await req.json();
    const { message, school_id } = body;

    if (!message) return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 });

    // رد ذكي بسيط
    const replies: Record<string, string> = {
      'مرحبا': 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      'مساعدة': 'بالطبع! أنا هنا لمساعدتك. ما الذي تحتاجه؟',
      'طلاب': 'يمكنني مساعدتك في إدارة بيانات الطلاب وتتبع أدائهم.',
      'حضور': 'يمكنني مساعدتك في تسجيل الحضور والغياب ومتابعته.',
      'درجات': 'يمكنني مساعدتك في إدارة الدرجات والتقارير الأكاديمية.',
    };

    let reply = 'مرحباً! أنا مساعد متين الذكي. يمكنني مساعدتك في إدارة المدرسة، متابعة الطلاب، والتقارير. كيف يمكنني مساعدتك؟';
    for (const [key, val] of Object.entries(replies)) {
      if (message.includes(key)) { reply = val; break; }
    }

    await pool.query(
      `INSERT INTO ai_chats (user_id, message, reply, school_id, created_at)
       VALUES ($1, $2, $3, $4, NOW()`,
      [String(user.id), message, reply, school_id || null]
    ).catch(() => {});

    return NextResponse.json({ reply, success: true });
  } catch (e: any) {
    console.error('AI Chat POST error:', e.message);
    return NextResponse.json({ reply: 'عذراً، حدث خطأ. حاول مجدداً.', success: false });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = getUserFromToken(request as any);
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

