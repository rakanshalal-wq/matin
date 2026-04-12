import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin','owner','admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    let query = 'SELECT * FROM platform_settings WHERE 1=1';
    const params: any[] = [];
    let idx = 1;

    if (category) { query += ` AND category = $${idx}`; params.push(category); idx++; }

    if (user.role !== 'super_admin') {
      query += ` AND (school_id = $${idx} OR school_id IS NULL)`;
      params.push(user.school_id);
    }

    query += ' ORDER BY category, key';
    const result = await pool.query(query, params);

    const settings: Record<string, any> = {};
    for (const row of result.rows) {
      if (!settings[row.category]) settings[row.category] = {};
      settings[row.category][row.key] = row.value;
    }

    return NextResponse.json({ settings, raw: result.rows });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin','owner','admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'الإعدادات مطلوبة' }, { status: 400 });
    }

    for (const [category, pairs] of Object.entries(settings)) {
      for (const [key, value] of Object.entries(pairs as any)) {
        await pool.query(
          `INSERT INTO platform_settings (category, key, value, school_id, updated_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (category, key) DO UPDATE SET value = $3, updated_at = NOW()`,
          [category, key, String(value), user.role === 'super_admin' ? null : user.school_id]
        ).catch(() => {
          pool.query(
            `UPDATE platform_settings SET value = $1, updated_at = NOW() WHERE category = $2 AND key = $3`,
            [String(value), category, key]
          ).catch(() => {});
        });
      }
    }

    await pool.query(
      `INSERT INTO activity_logs (user_id, school_id, action, details) VALUES ($1, $2, 'update_settings', $3)`,
      [user.id, user.school_id || null, JSON.stringify(Object.keys(settings))]
    ).catch(() => {});

    return NextResponse.json({ message: 'تم حفظ الإعدادات بنجاح' });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
