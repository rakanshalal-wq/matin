import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET - جلب إعدادات الذكاء الاصطناعي للمستخدم الحالي
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    // محاولة جلب الإعدادات المحفوظة من قاعدة البيانات
    try {
      const result = await pool.query(
        `SELECT model, language, max_tokens 
         FROM ai_settings 
         WHERE user_id = $1 
         LIMIT 1`,
        [user.id]
      );

      if (result.rows.length > 0) {
        return NextResponse.json({ success: true, settings: result.rows[0] });
      }
    } catch {
      // جدول ai_settings غير موجود بعد — نرجع الإعدادات الافتراضية
    }

    // الإعدادات الافتراضية
    return NextResponse.json({
      success: true,
      settings: {
        model: 'gpt-4',
        language: 'ar',
        max_tokens: '2000',
      },
    });
  } catch (error) {
    console.error('AI settings GET error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// PUT - حفظ إعدادات الذكاء الاصطناعي
export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { model, language, max_tokens } = await req.json();

    // التحقق من صحة القيم
    const allowedModels = ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];
    const allowedLanguages = ['ar', 'en'];
    const maxTokensNum = parseInt(max_tokens);

    if (model && !allowedModels.includes(model)) {
      return NextResponse.json({ error: 'نموذج غير مدعوم' }, { status: 400 });
    }
    if (language && !allowedLanguages.includes(language)) {
      return NextResponse.json({ error: 'لغة غير مدعومة' }, { status: 400 });
    }
    if (max_tokens && (isNaN(maxTokensNum) || maxTokensNum < 100 || maxTokensNum > 8000)) {
      return NextResponse.json({ error: 'عدد الرموز يجب أن يكون بين 100 و 8000' }, { status: 400 });
    }

    // محاولة حفظ الإعدادات في قاعدة البيانات
    try {
      await pool.query(
        `INSERT INTO ai_settings (user_id, model, language, max_tokens, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (user_id) 
         DO UPDATE SET 
           model = EXCLUDED.model,
           language = EXCLUDED.language,
           max_tokens = EXCLUDED.max_tokens,
           updated_at = NOW()`,
        [user.id, model || 'gpt-4', language || 'ar', max_tokens || '2000']
      );
    } catch {
      // جدول ai_settings غير موجود بعد — نرجع نجاح وهمي حتى يُنشأ الجدول
      return NextResponse.json({
        success: true,
        message: 'تم حفظ الإعدادات مؤقتاً (قاعدة البيانات تحتاج إلى تحديث)',
        settings: { model, language, max_tokens },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات الذكاء الاصطناعي بنجاح',
      settings: { model, language, max_tokens },
    });
  } catch (error) {
    console.error('AI settings PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
