import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    // فقط super_admin يمكنه رؤية إعدادات المنصة
    if (user.role !== 'super_admin') {
      // للمستخدمين الآخرين، أرجع إعدادات مدرستهم من جدول settings
      const result = await pool.query(
        'SELECT * FROM settings WHERE school_id = $1 OR owner_id = $2 ORDER BY updated_at DESC LIMIT 200',
        [user.school_id || null, user.id]
      );
      return NextResponse.json(result.rows);
    }
    
    // super_admin يرى إعدادات المنصة الكاملة
    const result = await pool.query(
      'SELECT * FROM platform_settings ORDER BY category, key'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const body = await request.json();
    
    // إذا كان super_admin يحدّث إعدادات المنصة
    if (user.role === 'super_admin' && body.key) {
      const { key, value, category, description } = body;
      const result = await pool.query(
        `INSERT INTO platform_settings (key, value, category, description, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
         RETURNING *`,
        [key, value || '', category || 'general', description || null]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }
    
    // للمستخدمين الآخرين
    const { key, value, category } = body;
    if (!key) return NextResponse.json({ error: 'المفتاح مطلوب' }, { status: 400 });
    
    const settingId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const result = await pool.query(
      `INSERT INTO settings (id, key, value, category, updated_at, school_id, owner_id)
       VALUES ($1, $2, $3, $4, NOW(), $5, $6)
       ON CONFLICT (key) DO UPDATE SET value = $3, updated_at = NOW()
       RETURNING *`,
      [settingId, key, value || '', category || 'general', user.school_id || null, user.id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const body = await request.json();
    const { key, value } = body;
    
    if (!key) return NextResponse.json({ error: 'المفتاح مطلوب' }, { status: 400 });
    
    if (user.role === 'super_admin') {
      await pool.query(
        'UPDATE platform_settings SET value = $1, updated_at = NOW() WHERE key = $2',
        [value || '', key]
      );
    } else {
      await pool.query(
        'UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2 AND (school_id = $3 OR owner_id = $4)',
        [value || '', key, user.school_id || null, user.id]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const key = searchParams.get('key');
    
    if (user.role === 'super_admin' && key) {
      await pool.query('DELETE FROM platform_settings WHERE key = $1', [key]);
    } else if (id) {
      await pool.query('DELETE FROM settings WHERE id = $1', [id]);
    } else {
      return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
