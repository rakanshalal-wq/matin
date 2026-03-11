import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    let query = 'SELECT id, key, value, category, description, updated_at FROM platform_settings';
    const params: any[] = [];
    if (category) { query += ' WHERE category = $1'; params.push(category); }
    query += ' ORDER BY category, key';
    const result = await pool.query(query, params);
    const grouped: Record<string, any[]> = {};
    for (const row of result.rows) {
      if (!grouped[row.category]) grouped[row.category] = [];
      grouped[row.category].push(row);
    }
    return NextResponse.json({ success: true, settings: result.rows, grouped, total: result.rows.length });
  } catch (error: any) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'خطأ في جلب الإعدادات' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const body = await request.json();
    if (body.key && body.value !== undefined) {
      await pool.query('UPDATE platform_settings SET value = $1, updated_at = NOW(), updated_by = $2 WHERE key = $3', [String(body.value), user.id, body.key]);
      return NextResponse.json({ success: true, message: 'تم تحديث الإعداد' });
    }
    if (body.settings && typeof body.settings === 'object') {
      const updates = Object.entries(body.settings);
      let updated = 0;
      for (const [key, value] of updates) {
        const result = await pool.query('UPDATE platform_settings SET value = $1, updated_at = NOW(), updated_by = $2 WHERE key = $3', [String(value), user.id, key]);
        if (result.rowCount && result.rowCount > 0) updated++;
      }
      return NextResponse.json({ success: true, message: `تم تحديث ${updated} إعداد`, updated });
    }
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
  } catch (error: any) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث الإعدادات' }, { status: 500 });
  }
}
